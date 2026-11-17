"""Exporta as legendas do episódio em SRT (para subir como legenda nas plataformas).
Uso: python3 pipeline/export_srt.py  ->  out/saldo-final-ep01.srt"""
from common import *

WHO = {"ZARA": "", "HELENA": "[HELENA] ", "DANTE": "[DANTE] ", "CIRO": "[CIRO VOSS] ", "ATENDENTE": "[ATENDENTE] ", "JOVEM": "[JOVEM] ", "RAPAZ": "[RAPAZ NA FILA] ", "ENFERMEIRA": "[ENFERMEIRA, AO TELEFONE] "}

def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

def main():
    cues = load_json(DATA / "cues.generated.json")
    out = []
    for i, c in enumerate(cues, 1):
        nxt = cues[i]["start"] if i < len(cues) else 1e9
        out.append(f"{i}\n{ts(c['start'])} --> {ts(min(c['end'] + 0.4, nxt - 0.05))}\n{WHO[c['who']]}{c['text']}\n")
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "out" / "saldo-final-ep01.srt").write_text("\n".join(out), encoding="utf-8")
    print(f"{len(cues)} legendas -> out/saldo-final-ep01.srt")

if __name__ == "__main__":
    main()
