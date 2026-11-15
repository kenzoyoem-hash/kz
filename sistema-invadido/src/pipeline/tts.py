"""Gera as vozes (edge-tts, pt-BR), aplica o tratamento de cada personagem com FFmpeg
e agenda as falas na linha do tempo. Uso: python pipeline/tts.py 1"""
import sys, os, asyncio
import edge_tts
from common import *

FX = {
    # narrador: mais grave/encorpado, compressão leve
    "narrator": "highpass=f=70,equalizer=f=140:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1.5:g=2,"
                "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,volume=1.0",
    # Bia sussurrando: mais suave, agudos arejados, um pouco de 'ar' do quarto
    "whisper":  "highpass=f=160,equalizer=f=6500:t=q:w=1:g=4,acompressor=threshold=-24dB:ratio=4,"
                "aecho=0.8:0.5:22:0.12,volume=0.8",
    # hacker: pitch -4 semitons (rubberband), timbre metálico, bitcrush leve e eco curto
    "hacker":   "rubberband=pitch=0.80:formant=shifted,highpass=f=90,lowpass=f=7000,"
                "acrusher=bits=10:mix=0.25:mode=log:aa=1,"
                "flanger=delay=2:depth=2:speed=0.3:width=60,"
                "aecho=0.8:0.6:45|90:0.25|0.12,equalizer=f=250:t=q:w=1:g=4,"
                "acompressor=threshold=-18dB:ratio=4,volume=1.1",
}
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"

async def synth(text, v, out):
    c = edge_tts.Communicate(text, v["voice"], rate=v["rate"], pitch=v["pitch"],
                             proxy=os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy"))
    await c.save(str(out))

def main(ep):
    d = ep_dir(ep)
    script = load_json(d / "script.json")
    vdir = RAW / "voice" / f"ep{ep:02d}"
    vdir.mkdir(parents=True, exist_ok=True)
    cues, prev_end = [], 0.0
    for ln in script["lines"]:
        v = script["voices"][ln["who"]]
        mp3 = vdir / f"{ln['id']}_raw.mp3"
        wav = vdir / f"{ln['id']}.wav"
        if not mp3.exists() or mp3.stat().st_size == 0:
            asyncio.run(synth(ln["text"], v, mp3))
        run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", f"{TRIM},{FX[v['fx']]},aresample={SR}",
             "-ac", "1", "-ar", str(SR), wav])
        dur = len(read_wav(wav)) / SR
        start = max(ln["at"], prev_end + 0.12)
        prev_end = start + dur
        cues.append({**ln, "start": round(start, 3), "dur": round(dur, 3), "end": round(prev_end, 3),
                     "wav": str(wav.relative_to(ROOT))})
        flag = "  <-- atrasada" if start > ln["at"] + 0.01 else ""
        print(f"{ln['id']} {ln['who']:9s} {start:6.2f} -> {prev_end:6.2f} ({dur:4.2f}s){flag}")
    save_json(d / "cues.generated.json", cues)

if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 1)
