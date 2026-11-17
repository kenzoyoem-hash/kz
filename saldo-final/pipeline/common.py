"""Caminhos e utilidades compartilhadas do pipeline de áudio de SALDO FINAL."""
import json, subprocess, pathlib, wave
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[1]      # saldo-final/
DATA = ROOT / "src" / "data"
AUDIO = ROOT / "public" / "audio"
CACHE = ROOT / ".cache" / "tts"
SR = 48000
FPS = 30
DURATION = 89.0

def load_json(p): return json.loads(pathlib.Path(p).read_text(encoding="utf-8"))
def save_json(p, d): pathlib.Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")

def run(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode != 0: raise RuntimeError(" ".join(map(str, cmd)) + "\n" + r.stderr[-2000:])
    return r

def read_audio(p) -> np.ndarray:
    """qualquer arquivo de áudio -> mono float32 48 kHz"""
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy()

def write_wav(p, a: np.ndarray, stereo=False):
    a = np.clip(a, -1, 1); data = (a * 32767).astype(np.int16)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2 if stereo else 1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
