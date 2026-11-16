"""Gera as vozes (edge-tts, pt-BR) com ENTONAÇÃO POR TRECHO, aplica o tratamento de cada
personagem com FFmpeg e agenda as falas na linha do tempo.

Marcações aceitas no texto das falas (valem até a próxima marcação):
  [lento] [rapido] [grave] [agudo] [sussurro] [alto] [tenso] [misterioso] [normal]
  [pausa] (0,45 s)  [pausa longa] (0,9 s)  [respira] (0,3 s)
Uso: python pipeline/tts.py 2a"""
import sys, os, re, asyncio
import numpy as np
import edge_tts
from common import *

FX = {
    # vozes LIMPAS: só limpeza de graves, leve presença e compressão suave (sem eco/reverb)
    "narrator": "highpass=f=70,equalizer=f=150:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.5:g=1.5,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80",
    "bia":      "highpass=f=100,equalizer=f=3800:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80",
    "whisper":  "highpass=f=140,equalizer=f=6000:t=q:w=1:g=3,acompressor=threshold=-24dB:ratio=3,volume=0.85",
    "man":      "highpass=f=80,equalizer=f=3000:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80",
    # voz saindo do celular: só faixa de telefone (sem eco, sem distorção)
    "phone":    "highpass=f=300,lowpass=f=3600,equalizer=f=1600:t=q:w=1:g=3,acompressor=threshold=-22dB:ratio=3,volume=1.15",
    # voz vindo de longe: mais abafada e mais baixa (sem eco)
    "far":      "highpass=f=180,lowpass=f=3800,acompressor=threshold=-22dB:ratio=3,volume=0.8",
    "hacker":   "rubberband=pitch=0.80:formant=shifted,highpass=f=90,lowpass=f=7000,acrusher=bits=10:mix=0.25:mode=log:aa=1,"
                "flanger=delay=2:depth=2:speed=0.3:width=60,aecho=0.8:0.6:45|90:0.25|0.12,equalizer=f=250:t=q:w=1:g=4,"
                "acompressor=threshold=-18dB:ratio=4,volume=1.1",
    "stair":    "highpass=f=80,acompressor=threshold=-20dB:ratio=2.5",
}
TAGS = {
    "lento": dict(rate=-16), "rapido": dict(rate=+14), "grave": dict(pitch=-9), "agudo": dict(pitch=+10),
    "sussurro": dict(rate=-8, volume=-35, pitch=-3), "alto": dict(rate=+4, pitch=+7, volume=+20),
    "tenso": dict(rate=+7, pitch=+4), "misterioso": dict(rate=-12, pitch=-7), "normal": {},
}
PAUSES = {"pausa": 0.45, "pausa longa": 0.9, "respira": 0.3}
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
PX = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")

def num(v):  return int(re.sub(r"[^-+0-9]", "", v) or 0)

def parse(text):
    """-> lista de ('say', tag, texto) | ('pause', segundos)"""
    out, tag = [], "normal"
    for tok in re.split(r"(\[[^\]]+\])", text):
        if not tok.strip(): continue
        m = re.fullmatch(r"\[([^\]]+)\]", tok.strip())
        if m:
            k = m.group(1).strip().lower()
            if k in PAUSES: out.append(("pause", PAUSES[k]))
            elif k in TAGS: tag = k
            continue
        if re.search(r"\w", tok): out.append(("say", tag, tok.strip()))
    return out

def clean(text): return re.sub(r"\s+", " ", re.sub(r"\[[^\]]+\]", " ", text)).strip()

async def _synth(text, voice, rate, pitch, volume, out):
    await edge_tts.Communicate(text, voice, rate=f"{rate:+d}%", pitch=f"{pitch:+d}Hz", volume=f"{volume:+d}%", proxy=PX).save(str(out))

def synth(*a):
    import time
    for k in range(4):
        try:
            return asyncio.run(_synth(*a))
        except Exception as e:
            print(f"  tentativa {k + 1} falhou: {type(e).__name__}"); time.sleep(2 + k * 3)
    raise RuntimeError("edge-tts sem resposta")

def main(ep):
    d = ep_dir(ep); E = eid(ep)
    script = load_json(d / "script.json")
    vdir = RAW / "voice" / E; vdir.mkdir(parents=True, exist_ok=True)
    cues, prev_end = [], 0.0
    for ln in script["lines"]:
        v = script["voices"][ln["who"]]
        # padrão: a fala inteira numa única síntese (as marcações viram só pausas de pontuação)
        segs = parse(ln["text"]) if ln.get("segmented") else [("say", "normal", clean(ln["text"]))]
        pieces = []
        for i, sg in enumerate(segs):
            if sg[0] == "pause":
                pieces.append(np.zeros(int(sg[1] * SR))); continue
            _, tag, txt = sg
            t = TAGS[tag]
            # micro-variação automática entre trechos (evita monotonia)
            wob = 0
            rate = num(v["rate"]) + t.get("rate", 0); pitch = num(v["pitch"]) + t.get("pitch", 0) + wob
            vol = t.get("volume", 0) + int(ln.get("volume", 0))
            mp3 = vdir / f"{ln['id']}_{i}_raw.mp3"
            key = f"{v['voice']}|{rate}|{pitch}|{vol}|{txt}"
            keyf = mp3.with_suffix(".key")
            if not mp3.exists() or mp3.stat().st_size == 0 or not keyf.exists() or keyf.read_text() != key:
                synth(txt, v["voice"], rate, pitch, vol, mp3); keyf.write_text(key)
            seg_wav = vdir / f"{ln['id']}_{i}.wav"
            run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", f"{TRIM},aresample={SR}", "-ac", "1", "-ar", str(SR), seg_wav])
            a = read_wav(seg_wav)
            if tag == "sussurro": a = a * 0.7
            fade = min(len(a) // 4, int(0.012 * SR))
            if fade: a[:fade] *= np.linspace(0, 1, fade); a[-fade:] *= np.linspace(1, 0, fade)
            pieces.append(a); pieces.append(np.zeros(int(0.06 * SR)))
            seg_wav.unlink()
        dry = vdir / f"{ln['id']}_dry.wav"; wav = vdir / f"{ln['id']}.wav"
        write_wav(dry, np.concatenate(pieces))
        run(["ffmpeg", "-y", "-v", "error", "-i", dry, "-af", f"{FX[v['fx']]},apad=pad_dur=0.25,{TRIM.split(',areverse')[0]},aresample={SR}", "-ac", "1", "-ar", str(SR), wav])
        dur = len(read_wav(wav)) / SR
        start = max(ln["at"], prev_end + 0.12) if not ln.get("overlap") else ln["at"]
        prev_end = max(prev_end, start + dur)
        cues.append({**ln, "text": clean(ln["text"]), "marked": ln["text"], "start": round(start, 3), "dur": round(dur, 3),
                     "end": round(start + dur, 3), "wav": str(wav.relative_to(ROOT))})
        flag = "  <-- atrasada" if start > ln["at"] + 0.01 else ""
        print(f"{ln['id']} {ln['who']:12s} {start:6.2f} -> {start + dur:6.2f} ({dur:4.2f}s){flag}")
    save_json(d / "cues.generated.json", cues)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "1")
