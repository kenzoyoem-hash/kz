"""Caminhos e utilidades compartilhadas do pipeline SISTEMA INVADIDO."""
import json, subprocess, pathlib, wave
import numpy as np

SRC = pathlib.Path(__file__).resolve().parents[1]          # sistema-invadido/src
ROOT = SRC.parent                                          # sistema-invadido
RAW = ROOT / "raw"
DONE = ROOT / "done"
SR = 48000

def ep_dir(ep: int) -> pathlib.Path:
    return SRC / "episodes" / f"ep{ep:02d}"

def load_json(p):
    return json.loads(pathlib.Path(p).read_text(encoding="utf-8"))

def save_json(p, data):
    pathlib.Path(p).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(map(str, cmd))}\n{r.stderr[-2000:]}")
    return r

def read_wav(p) -> np.ndarray:
    with wave.open(str(p)) as w:
        assert w.getframerate() == SR, p
        ch = w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if ch > 1:
            a = a.reshape(-1, ch).mean(axis=1)
        return a

def write_wav(p, a: np.ndarray, stereo=False):
    a = np.clip(a, -1, 1)
    data = (a * 32767).astype(np.int16)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
