"""Gera as falas de SALDO FINAL — Quanto vale sua vida? com vozes neurais pt-BR (edge-tts), aplica o tratamento de cada
personagem (FFmpeg), agenda as falas na linha do tempo e salva as marcas de tempo por palavra
(usadas pelas legendas e pela atuação dos personagens no Remotion).
Saídas: public/audio/voices/<id>.wav  e  src/data/cues.generated.json
Uso: python3 pipeline/tts.py"""
import os, re, asyncio, time
import numpy as np
import edge_tts
from common import *

FX = {
    # vozes limpas e próximas (sem eco)
    "close":  "highpass=f=85,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=4200:t=q:w=1.4:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90",
    # agência movimentada: leve ambiência de sala
    "room":   "highpass=f=110,equalizer=f=3000:t=q:w=1.2:g=1.5,aecho=0.8:0.25:22|38:0.12|0.07,acompressor=threshold=-20dB:ratio=2.5",
    # corrida: ofegante (voz mais aérea)
    "breath": "highpass=f=120,equalizer=f=6000:t=q:w=1:g=3,acompressor=threshold=-24dB:ratio=3",
    # Helena fraca na cama do hospital
    "weak":   "highpass=f=110,lowpass=f=9000,equalizer=f=5500:t=q:w=1:g=2,acompressor=threshold=-24dB:ratio=3,volume=0.95",
    "whisper":"highpass=f=150,equalizer=f=6000:t=q:w=1:g=3.5,acompressor=threshold=-26dB:ratio=3.5",
    # enfermeira ao telefone
    "phone":  "highpass=f=300,lowpass=f=3600,equalizer=f=1600:t=q:w=1:g=3,acompressor=threshold=-22dB:ratio=3,volume=1.1",
    # Ciro Voss pelo holograma da Áurea: grave encorpado, brilho metálico discreto
    "holo":   "highpass=f=70,equalizer=f=160:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1:g=2,aecho=0.8:0.3:30|55:0.18|0.1,chorus=0.6:0.8:30:0.25:0.3:2,acompressor=threshold=-20dB:ratio=3",
}
PX = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
GAP = 0.12

async def _synth(text, voice, rate, pitch, vol):
    c = edge_tts.Communicate(text, voice, rate=f"{rate:+d}%", pitch=f"{pitch:+d}Hz", volume=f"{vol:+d}%",
                             proxy=PX, boundary="WordBoundary")
    audio, words = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"w": ch["text"], "s": ch["offset"] / 1e7, "e": (ch["offset"] + ch["duration"]) / 1e7})
    return bytes(audio), words

def synth(text, voice, rate, pitch, vol, key):
    CACHE.mkdir(parents=True, exist_ok=True)
    mp3, wj = CACHE / f"{key}.mp3", CACHE / f"{key}.json"
    if mp3.exists() and wj.exists(): return mp3, load_json(wj)
    for k in range(5):
        try:
            audio, words = asyncio.run(_synth(text, voice, rate, pitch, vol)); break
        except Exception as e:
            print(f"  tentativa {k+1} falhou: {type(e).__name__}: {e}"); time.sleep(2 + 3 * k)
    else: raise RuntimeError("edge-tts sem resposta")
    mp3.write_bytes(audio); save_json(wj, words); return mp3, words

MAXP = 0.22

def tighten(a, maxp):
    """encurta silêncios internos maiores que maxp (s). Retorna o áudio e uma função t_original -> t_novo."""
    blk = int(0.01 * SR); n = len(a) // blk
    rms = np.array([np.sqrt(np.mean(a[i*blk:(i+1)*blk] ** 2)) for i in range(n)])
    quiet = rms < 10 ** (-38 / 20)
    keep = np.ones(len(a), bool); i = 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            run = (j - i) * blk
            if run > maxp * SR:
                cut0 = i * blk + int(maxp * SR / 2); cut1 = j * blk - int(maxp * SR / 2)
                keep[cut0:cut1] = False
            i = j
        else: i += 1
    cum = np.concatenate([[0], np.cumsum(keep)])
    def tmap(t):
        k = int(min(len(a), max(0, t * SR)))
        return cum[k] / SR
    return a[keep], tmap

def tokens(text):
    """palavras do roteiro (grafia final das legendas), na ordem"""
    return [t for t in text.split() if re.search(r"\w", t)]

def main():
    sc = load_json(DATA / "script.json")
    vdir = AUDIO / "voices"; vdir.mkdir(parents=True, exist_ok=True)
    cues, prev_end = [], 0.0
    import hashlib
    for ln in sc["lines"]:
        v = sc["voices"][ln["who"]]
        rate, pitch, vol = ln.get("rate", v["rate"]), ln.get("pitch", v["pitch"]), ln.get("volume", 0)
        fx = ln.get("fx", v["fx"])
        spoken = ln.get("say") or ln["text"].replace("…", ", ").replace("CINCO ANOS", "cinco anos").replace("MEU DEUS", "Meu Deus").replace("EU?!", "eu?!")
        key = hashlib.md5(f"{v['voice']}|{rate}|{pitch}|{vol}|{spoken}".encode()).hexdigest()[:16]
        mp3, wb = synth(spoken, v["voice"], rate, pitch, vol, key)
        a = read_audio(mp3)
        # corta silêncio inicial/final e guarda o deslocamento para as marcas de tempo
        thr = 10 ** (-42 / 20); idx = np.where(np.abs(a) > thr)[0]
        i0 = max(0, idx[0] - int(0.02 * SR)); i1 = min(len(a), idx[-1] + int(0.08 * SR))
        a = a[i0:i1]; off = i0 / SR
        # edição de diálogo: pausas internas longas (> MAXP) viram MAXP; guarda o mapa de tempo p/ as palavras
        a, tmap = tighten(a, ln.get("maxPause", MAXP))
        f = min(len(a) // 4, int(0.01 * SR)); a[:f] *= np.linspace(0, 1, f); a[-f:] *= np.linspace(1, 0, f)
        dry = CACHE / f"{ln['id']}_dry.wav"; out = vdir / f"{ln['id']}.wav"
        write_wav(dry, a)
        run(["ffmpeg", "-y", "-v", "error", "-i", dry, "-af", f"{FX[fx]},apad=pad_dur=0.15", "-ac", "1", "-ar", SR, out])
        dur = len(read_audio(out)) / SR - 0.15
        start = max(ln["at"], prev_end + GAP); prev_end = start + dur
        # alinha as palavras do roteiro às marcas do TTS (mesma ordem; a grafia vem do roteiro)
        sw = tokens(ln["text"]); tw = [w for w in wb if re.search(r"\w", w["w"])]
        words = []
        for i, w in enumerate(sw):
            if len(tw) == len(sw): s, e = tw[i]["s"], tw[i]["e"]
            else:  # distribuição proporcional como reserva
                s = dur * i / len(sw) + off; e = dur * (i + 1) / len(sw) + off
            words.append({"w": w, "s": round(start + tmap(max(0, s - off)), 3), "e": round(start + tmap(max(0, e - off)), 3)})
        if len(tw) != len(sw): print(f"  aviso {ln['id']}: {len(tw)} marcas TTS x {len(sw)} palavras (proporcional)")
        cues.append({"id": ln["id"], "scene": ln["scene"], "who": ln["who"], "text": ln["text"],
                     "start": round(start, 3), "end": round(start + dur, 3), "src": f"audio/voices/{ln['id']}.wav", "words": words})
        late = "  <-- ATRASADA" if start > ln["at"] + 0.01 else ""
        print(f"{ln['id']} {ln['who']:12s} {start:6.2f} -> {start+dur:6.2f}  ({dur:4.2f}s){late}")
    save_json(DATA / "cues.generated.json", cues)

if __name__ == "__main__":
    main()
