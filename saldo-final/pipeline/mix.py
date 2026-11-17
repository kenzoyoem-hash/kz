"""Mixagem de SALDO FINAL: vozes + efeitos + trilha original com ducking automático sob as falas,
masterização (loudnorm -14 LUFS, pico -1,5 dBTP). Exporta também stems separados e envelopes de voz
por quadro (atuação sincronizada no Remotion).
Saídas: public/audio/mix_ep01.wav, public/audio/music/trilha_ep01.wav, public/audio/sfx/*.wav,
        public/audio/stems/*.wav, src/data/voice_env.generated.json
Uso: python3 pipeline/mix.py"""
import numpy as np
from common import *
import sfx

def place(buf, sig, t, g=1.0):
    i = int(round(t * SR))
    if i >= len(buf): return
    L = min(len(sig), len(buf) - i); buf[i:i+L] += sig[:L] * g

def envelope(x, att=0.02, rel=0.3, blk=480):
    nb = len(x) // blk + 1
    r = np.array([np.sqrt(np.mean(x[i*blk:(i+1)*blk] ** 2)) if len(x[i*blk:(i+1)*blk]) else 0 for i in range(nb)])
    aa, ar = np.exp(-blk / (att * SR)), np.exp(-blk / (rel * SR)); out = np.zeros_like(r); s = 0.0
    for i, v in enumerate(r):
        s = aa * s + (1 - aa) * v if v > s else ar * s + (1 - ar) * v; out[i] = s
    return np.repeat(out, blk)[:len(x)]

def main():
    tl = load_json(DATA / "audio_timeline.json"); cues = load_json(DATA / "cues.generated.json")
    N = int(DURATION * SR); voice = np.zeros(N); fx = np.zeros(N)
    who = {}
    for c in cues:
        w = read_audio(ROOT / "public" / c["src"])
        g = {"MAYA_NARR": 1.0, "MAYA": 1.0, "NOAH": 0.95, "MAYA_FUTURO": 1.0}[c["who"]]
        place(voice, w, c["start"], g)
        who.setdefault(c["who"], np.zeros(N)); place(who[c["who"]], w, c["start"], g)
    sdir = AUDIO / "sfx"; sdir.mkdir(parents=True, exist_ok=True)
    cache = {}
    for e in tl["sfx"]:
        if e["s"] not in cache:
            cache[e["s"]] = sfx.LIB[e["s"]](); write_wav(sdir / f"{e['s']}.wav", cache[e["s"]])
        place(fx, cache[e["s"]], e["t"], e["g"])
    mus = sfx.music(DURATION, tl["music"])
    mdir = AUDIO / "music"; mdir.mkdir(parents=True, exist_ok=True)
    write_wav(mdir / "trilha_ep01.wav", sfx.norm(mus, 0.9))
    vad = np.clip(envelope(voice, 0.03, 0.35) / 0.07, 0, 1)
    mus = mus * (1 - 0.75 * vad); fxd = fx * (1 - 0.45 * vad)       # trilha e efeitos abrem espaço para a voz
    hz = int(0.011 * SR)
    musR = np.concatenate([np.zeros(hz), mus[:-hz]])                # largura estéreo da trilha (Haas)
    L = voice + fxd * 0.8 + mus * 0.5
    R = voice + fxd * 0.8 + musR * 0.5
    fade = int(0.4 * SR); L[-fade:] *= np.linspace(1, 0, fade); R[-fade:] *= np.linspace(1, 0, fade)
    pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk * 0.89, R / pk * 0.89
    stems = AUDIO / "stems"; stems.mkdir(parents=True, exist_ok=True)
    write_wav(stems / "voz.wav", voice / (np.abs(voice).max() or 1) * 0.9)
    write_wav(stems / "efeitos.wav", fx / (np.abs(fx).max() or 1) * 0.9)
    pre = ROOT / ".cache" / "premaster.wav"; pre.parent.mkdir(exist_ok=True)
    write_wav(pre, np.stack([L, R], 1).reshape(-1), stereo=True)
    out = AUDIO / "mix_ep01.wav"
    run(["ffmpeg", "-y", "-v", "error", "-i", pre, "-af",
         "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,alimiter=limit=0.84:level=disabled", "-ar", "48000", "-t", f"{DURATION}", out])
    # envelopes de voz por quadro (0..1) — os personagens gesticulam com a fala
    nf = int(DURATION * FPS); spf = SR // FPS; envs = {}
    for k, sig in who.items():
        r = np.array([np.sqrt(np.mean(sig[i*spf:(i+1)*spf] ** 2)) for i in range(nf)])
        envs[k] = [round(float(v), 2) for v in np.clip(r / 0.1, 0, 1)]
    save_json(DATA / "voice_env.generated.json", envs)
    print("mix ok ->", out)

if __name__ == "__main__":
    main()
