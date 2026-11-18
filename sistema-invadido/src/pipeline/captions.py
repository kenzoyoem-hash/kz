"""Sincroniza legendas com faster-whisper e gera ASS (estilizado, para queimar com
FFmpeg+libass) e SRT. O texto do roteiro é alinhado às marcas de tempo do Whisper
(grafia correta + tempo real da fala). Uso: python pipeline/captions.py 1"""
import sys, re, unicodedata, difflib, subprocess
import numpy as np
from faster_whisper import WhisperModel
from common import *

def norm_w(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))

def load16k(p):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                       capture_output=True).stdout
    return np.concatenate([np.zeros(4800, np.float32), np.frombuffer(b, np.float32)])  # 0,3 s de silêncio antes (o Whisper não perde o começo)

def align(script_words, wh):
    """wh: lista (palavra, ini, fim) do whisper. Retorna tempos para cada palavra do roteiro."""
    a = [norm_w(w) for w in script_words]; b = [norm_w(w[0]) for w in wh]
    times = [None] * len(a)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        tag, i1, i2, j1, j2 = blk
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1): times[i1+k] = (wh[j1+k][1], wh[j1+k][2])
        elif tag == "replace" and j2 > j1:  # distribui o trecho do whisper entre as palavras do roteiro
            s, e = wh[j1][1], wh[j2-1][2]
            for k in range(i2 - i1):
                times[i1+k] = (s + (e-s)*k/(i2-i1), s + (e-s)*(k+1)/(i2-i1))
    # interpola o que ficou sem tempo
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[j][1] for j in range(i-1, -1, -1) if times[j]), wh[0][1] if wh else 0)
            nxt = next((times[j][0] for j in range(i+1, len(times)) if times[j]), prev + 0.3)
            times[i] = (prev, max(prev + 0.05, nxt))
    return times

def ass_time(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"
def srt_time(t):
    ms = int(round(t * 1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"

COL = {"white": "&H00FFFFFF", "yellow": "&H003FD2FF", "red": "&H003D2DFF", "black": "&H00000000",
       "blue": "&H00FFB040", "redbox": "&H003D2DFF"}

def main(ep):
    d = ep_dir(ep); script = load_json(d / "script.json"); tl = load_json(d / "timeline.json")
    cues = load_json(d / "cues.generated.json")
    hl = {norm_w(w) for w in script["highlight"]}
    model = WhisperModel("small", device="cpu", compute_type="int8")
    words_all = []
    for c in cues:
        segs, _ = model.transcribe(load16k(ROOT / c["wav"]), language="pt", word_timestamps=True, vad_filter=False)
        wh = [(w.word.strip(), max(0.0, w.start - 0.3), max(0.0, w.end - 0.3)) for s in segs for w in s.words]
        sw = c["text"].split()
        if len(wh) < max(2, len(sw) // 3):   # whisper falhou: distribui pelo tamanho das palavras
            print(f"  aviso: {c['id']} sem palavras suficientes do whisper, usando distribuição proporcional")
            tot = sum(len(w) + 1 for w in sw); acc = 0; wh = []
            for w in sw:
                a = acc / tot * c["dur"]; acc += len(w) + 1; wh.append((w, a, acc / tot * c["dur"]))
        tms = align(sw, wh)
        c["whisper"] = " ".join(w[0] for w in wh)
        c["words"] = [{"w": w, "s": round(c["start"] + a, 3), "e": round(c["start"] + b, 3)} for w, (a, b) in zip(sw, tms)]
        words_all += [(c, x) for x in c["words"]]
        print(f"{c['id']}: whisper='{c['whisper']}'")
    save_json(d / "cues.generated.json", cues)

    def cap_y(t):
        y = tl["captionY"][0]["y"]
        for k in tl["captionY"]:
            if t >= k["from"]: y = k["y"]
        return y

    # agrupa em blocos curtos (máx. 3 palavras / 16 caracteres, quebra em pontuação)
    chunks = []
    for c in cues:
        cur = []
        for i, w in enumerate(c["words"]):
            cur.append(w)
            txt = " ".join(x["w"] for x in cur)
            last = i == len(c["words"]) - 1
            mw, mc = tl.get("capWords", 3), tl.get("capChars", 14)
            # palavras restantes até a próxima pontuação: não deixa 1-2 palavras sozinhas
            rem = 0
            for x in c["words"][i + 1:]:
                rem += 1
                if re.search(r"[.?!…,]$", x["w"]): break
            orphan = 0 < rem <= 2 and len(cur) + rem <= mw + 2
            if not last and not re.search(r"[.?!…,]$", w["w"]) and orphan: continue
            if last or re.search(r"[.?!…]$", w["w"]) or (re.search(r",$", w["w"]) and len(cur) >= 2) or len(cur) >= mw or len(txt) >= mc:
                chunks.append((c, cur)); cur = []
    ev = []
    for k, (c, ws) in enumerate(chunks):
        start = ws[0]["s"] - 0.05
        nxt = chunks[k+1][1][0]["s"] - 0.05 if k + 1 < len(chunks) else 1e9
        end = min(ws[-1]["e"] + 0.35, nxt)
        style = {"HACKER": "Hacker", "BIA": "Bia", "BIA_CLONE": "Clone", "BIA_TEL": "Clone", "HOMEM": "Homem", "HOMEM_LONGE": "Homem", "DAVI": "Homem", "VOZ": "Homem", "INTERFONE": "Hacker", "DAVI_FORA": "Homem", "DAVI_REC": "Homem", "CLARA": "Clone"}.get(c["who"], "Narr")
        y = cap_y(start)
        # um evento por palavra ativa (palavra falada em destaque)
        for j, w in enumerate(ws):
            s0 = start if j == 0 else w["s"]
            e0 = end if j == len(ws) - 1 else ws[j+1]["s"]
            if e0 <= s0: continue
            parts = []
            for q, x in enumerate(ws):
                t = x["w"].upper().replace("...", "…")
                key = norm_w(x["w"]) in hl
                if key: col = COL["red"] if style != "Hacker" else COL["yellow"]
                elif q == j: col = COL["yellow"] if style != "Hacker" else COL["white"]
                else: col = COL["white"] if style != "Hacker" else "&H00C8C8FF"
                sc = 112 if (key and q == j) else 100
                parts.append(f"{{\\c{col}\\fscx{sc}\\fscy{sc}}}{t}")
            if len(" ".join(x["w"] for x in ws)) > 17 and len(ws) > 1:
                lens = [len(x["w"]) for x in ws]; tot = sum(lens) + len(ws) - 1
                best = min(range(1, len(ws)), key=lambda q: abs((sum(lens[:q]) + q - 1) - tot / 2))
                parts[best] = "\\N" + parts[best]
            pop = "\\fscx70\\fscy70\\t(0,80,\\fscx106\\fscy106)\\t(80,150,\\fscx100\\fscy100)" if j == 0 else ""
            jit = "\\frz-1.5" if style == "Hacker" else ""
            ev.append(f"Dialogue: 0,{ass_time(s0)},{ass_time(e0)},{style},,0,0,0,,{{\\an5\\pos(540,{y}){pop}{jit}}}" + " ".join(parts))
    header = f"""[Script Info]
Title: SISTEMA INVADIDO {eid(ep).upper()}
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Narr,Montserrat Thin Black,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,1,8,4,5,60,60,0,1
Style: Hacker,JetBrains Mono,88,&H00FFFFFF,&H00FFFFFF,&H00100090,&H960000A0,-1,0,0,0,100,100,0,0,1,8,6,5,60,60,0,1
Style: Bia,Montserrat Thin Black,82,&H00FFFFFF,&H00FFFFFF,&H00703010,&H96000000,0,1,0,0,100,100,1,0,1,8,4,5,60,60,0,1
Style: Clone,Montserrat Thin Black,82,&H00FFFFFF,&H00FFFFFF,&H00800060,&H96000000,0,1,0,0,100,100,1,0,1,9,5,5,60,60,0,1
Style: Homem,Montserrat Thin Black,82,&H00FFFFFF,&H00FFFFFF,&H00A05010,&H96000000,0,0,0,0,100,100,1,0,1,8,4,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    DONE.mkdir(exist_ok=True)
    (DONE / f"{eid(ep)}_legendas.ass").write_text(header + "\n".join(ev) + "\n", encoding="utf-8")
    srt = []
    for i, c in enumerate(cues, 1):
        who = {"NARRADOR": "", "BIA_CLONE": "[VOZ DA BIA NO CELULAR] ", "BIA_TEL": "[VOZ DA BIA NO TELEFONE] ", "HOMEM_LONGE": "[HOMEM] ", "VOZ": "[VOZ LÁ FORA] ", "INTERFONE": "[INTERFONE] ", "DAVI_FORA": "[DAVI, LÁ FORA] ", "DAVI": "[DAVI] ", "DAVI_REC": "[DAVI NA GRAVAÇÃO] ", "CLARA": "[CLARA, ATRÁS DA PORTA] "}.get(c["who"], f"[{c['who']}] ")
        srt.append(f"{i}\n{srt_time(c['words'][0]['s'])} --> {srt_time(c['words'][-1]['e'] + 0.3)}\n{who}{c['text']}\n")
    (DONE / f"{eid(ep)}_legendas.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"{len(ev)} eventos ASS, {len(cues)} legendas SRT")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "1")
