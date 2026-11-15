"""Mixagem do episódio: vozes + efeitos + trilha com ducking, corte seco final e
masterização (FFmpeg loudnorm -14 LUFS). Também exporta envelopes de voz por frame
para o Remotion (boca da Bia, ondas do hacker). Uso: python pipeline/mix.py 1"""
import sys
import numpy as np
from common import *
import sfx

def place(buf, sig, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    L = min(len(sig), len(buf) - i); buf[i:i+L] += sig[:L] * g

def smooth_env(x, att=0.02, rel=0.3):
    a_att, a_rel = np.exp(-1/(att*SR)), np.exp(-1/(rel*SR))
    # envelope por blocos de 480 amostras (10 ms) para velocidade
    blk = 480; nb = len(x) // blk + 1
    r = np.array([np.sqrt(np.mean(x[i*blk:(i+1)*blk]**2)) if len(x[i*blk:(i+1)*blk]) else 0 for i in range(nb)])
    out = np.zeros_like(r); s = 0
    aa, ar = a_att**blk, a_rel**blk
    for i, v in enumerate(r):
        s = aa*s + (1-aa)*v if v > s else ar*s + (1-ar)*v; out[i] = s
    return np.repeat(out, blk)[:len(x)]

def main(ep):
    d = ep_dir(ep); tl = load_json(d / "timeline.json"); cues = load_json(d / "cues.generated.json")
    dur = tl["duration"]; N = int(dur * SR); fps = tl["fps"]
    voice = np.zeros(N); fx = np.zeros(N)
    per_speaker = {"HACKER": np.zeros(N), "BIA": np.zeros(N), "NARRADOR": np.zeros(N)}
    for c in cues:
        w = read_wav(ROOT / c["wav"])
        g = {"NARRADOR": 1.0, "HACKER": 0.95, "BIA": 1.0}[c["who"]]
        place(voice, w, c["start"], g); place(per_speaker[c["who"]], w, c["start"], g)
    for e in tl["sfx"]:
        place(fx, sfx.LIB[e["s"]](), e["t"], e["g"])
    mus = sfx.music(dur, tl["music"])
    vad = np.clip(smooth_env(voice, 0.03, 0.35) / 0.08, 0, 1)
    mus *= 1 - 0.7 * vad
    fx *= 1 - 0.3 * vad
    # estéreo: trilha com efeito Haas, vozes e efeitos centralizados
    hz = int(0.012 * SR)
    musL, musR = mus, np.concatenate([np.zeros(hz), mus[:-hz]])
    L = voice + fx * 0.8 + musL * 0.55
    R = voice + fx * 0.8 + musR * 0.55
    cut = int(tl["hardCut"] * SR); L[cut:] = 0; R[cut:] = 0
    peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * 0.89, R / peak * 0.89
    mixdir = RAW / "mix"; mixdir.mkdir(exist_ok=True)
    pre = mixdir / f"ep{ep:02d}_premaster.wav"
    write_wav(pre, np.stack([L, R], 1).reshape(-1), stereo=True)
    write_wav(mixdir / f"ep{ep:02d}_stem_voz.wav", voice / (np.abs(voice).max() or 1) * 0.9)
    master = mixdir / f"ep{ep:02d}_master.wav"
    run(["ffmpeg", "-y", "-v", "error", "-i", pre, "-af",
         "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000", "-ar", "48000", master])
    # envelopes por frame para animação
    nf = int(dur * fps); envs = {}
    for k, sig in per_speaker.items():
        spf = SR // fps
        r = np.array([np.sqrt(np.mean(sig[i*spf:(i+1)*spf]**2)) for i in range(nf)])
        envs[k] = [round(float(v), 3) for v in np.clip(r / 0.12, 0, 1)]
    save_json(d / "audio.generated.json", {"fps": fps, "frames": nf, "env": envs})
    print("mix ok ->", master)

if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 1)
