"""Controle de qualidade: transcreve cada fala gerada (faster-whisper, pt) e compara com o roteiro."""
import re, unicodedata, difflib
from faster_whisper import WhisperModel
from common import *
def n(s): return re.sub(r"[^a-z0-9 ]", "", "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn"))
m = WhisperModel("small", device="cpu", compute_type="int8")
for c in load_json(DATA / "cues.generated.json"):
    import subprocess, numpy as np
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / "public" / c["src"]), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    segs, info = m.transcribe(np.frombuffer(b, np.float32), language="pt")
    got = " ".join(s.text.strip() for s in segs)
    r = difflib.SequenceMatcher(None, n(c["text"]).split(), n(got).split()).ratio()
    print(f"{c['id']} {r:4.2f} | roteiro: {c['text']} | ouvido: {got}")
