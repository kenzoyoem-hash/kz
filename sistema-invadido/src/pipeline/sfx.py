"""Biblioteca de efeitos sonoros e trilha sintetizados (sem direitos autorais de terceiros).
Cada função devolve um np.ndarray mono em 48 kHz. Reutilizável em todos os episódios."""
import numpy as np
from common import SR

rng = np.random.default_rng(7)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.2):
    e = np.ones(n); ia = max(1, int(a * SR)); ir = max(1, int(r * SR))
    e[:ia] = np.linspace(0, 1, ia); e[-ir:] *= np.linspace(1, 0, min(ir, n)) if ir <= n else 1
    return e
def expdec(n, k): return np.exp(-np.arange(n) / SR * k)
def noise(d): return rng.uniform(-1, 1, int(d * SR))
def lp(x, fc):  # filtro passa-baixa de 1 polo (rápido)
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(0, len(x), 4096):
        seg = x[i:i+4096]; out = np.empty_like(seg)
        for j, v in enumerate(seg):
            s = (1 - a) * v + a * s; out[j] = s
        y[i:i+4096] = out
    return y
def lp_fast(x, fc):  # passa-baixa via FFT (sem laço Python)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def hp_fast(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1)) ** 4); return np.fft.irfft(X, len(x))
def bp_fast(x, lo, hi): return hp_fast(lp_fast(x, hi), lo)
def norm(x, peak=0.9): m = np.abs(x).max() or 1; return x / m * peak
def sweep(f0, f1, d, shape="exp"):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d) if shape == "exp" else np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def notif():
    out = np.zeros(int(0.5 * SR))
    for k, (f, st) in enumerate([(1318, 0.0), (1760, 0.09)]):
        t = t_(0.35); s = (np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*2*f*t)) * expdec(len(t), 14)
        i = int(st * SR); out[i:i+len(s)] += s
    return norm(out, 0.6)
def message():
    out = np.zeros(int(0.45 * SR))
    for f, st in [(880, 0), (1175, 0.07), (1568, 0.14)]:
        t = t_(0.2); s = np.sin(2*np.pi*f*t) * expdec(len(t), 22); i = int(st*SR); out[i:i+len(s)] += s
    return norm(out, 0.6)
def impact():
    d = 1.6; t = t_(d)
    boom = sweep(110, 32, d) * expdec(len(t), 3.2)
    hit = lp_fast(noise(d), 1800) * expdec(len(t), 18)
    return norm(boom * 1.0 + hit * 0.8, 0.95)
def braam():
    d = 3.2; t = t_(d); f = 55
    saw = sum(np.sin(2*np.pi*f*k*t * (1 + 0.003*np.sin(2*np.pi*0.7*t))) / k for k in range(1, 18))
    saw += sum(np.sin(2*np.pi*f*1.004*k*t) / k for k in range(1, 18))
    e = np.minimum(1, t / 0.08) * np.exp(-t * 0.9)
    return norm(lp_fast(saw, 900) * e, 0.95)
def whoosh():
    d = 0.7; t = t_(d); n = noise(d)
    e = np.sin(np.pi * t / d) ** 2
    return norm(bp_fast(n, 400, 3500) * e, 0.7)
def riser():
    d = 1.6; t = t_(d); n = bp_fast(noise(d), 800, 7000)
    tone = sweep(200, 1400, d) * 0.3
    return norm((n + tone) * (t / d) ** 2.2, 0.7)
def glitch():
    d = 0.75; n = int(d * SR); out = np.zeros(n)
    i = 0
    while i < n:
        L = int(rng.uniform(0.01, 0.07) * SR)
        kind = rng.integers(0, 3)
        tt = np.arange(L) / SR
        if kind == 0: seg = np.sign(np.sin(2*np.pi*rng.uniform(80, 1600)*tt))
        elif kind == 1: seg = np.round(rng.uniform(-1, 1, L) * 4) / 4
        else: seg = np.zeros(L)
        out[i:i+L] = seg[:max(0, min(L, n-i))]; i += L
    return norm(out * env(n, 0.002, 0.05), 0.55)
def static():
    d = 0.9; n = noise(d); t = t_(d)
    return norm(hp_fast(n, 1500) * (0.6 + 0.4*np.sign(np.sin(2*np.pi*13*t))) * env(len(t), 0.01, 0.3), 0.45)
def tv_on():
    d = 1.4; t = t_(d)
    click = np.zeros(len(t)); click[:300] = rng.uniform(-1, 1, 300) * np.linspace(1, 0, 300)
    hum = (np.sin(2*np.pi*60*t) + 0.5*np.sin(2*np.pi*120*t)) * 0.25 * np.minimum(1, t / 0.1) * np.exp(-t*1.2)
    whine = np.sin(2*np.pi*7800*t) * 0.05 * np.exp(-t*2)
    return norm(click + hum + whine, 0.75)
def flicker():
    d = 1.6; n = int(d*SR); out = np.zeros(n)
    for st in [0, 0.18, 0.31, 0.62, 0.7, 1.05, 1.2]:
        L = int(rng.uniform(0.04, 0.12) * SR); tt = np.arange(L) / SR
        buzz = np.sign(np.sin(2*np.pi*120*tt)) * 0.5 + rng.uniform(-1, 1, L) * 0.5
        i = int(st*SR); out[i:i+L] += buzz[:n-i] * np.linspace(1, 0.3, L)[:n-i]
    return norm(lp_fast(out, 5000), 0.6)
def lock():
    out = np.zeros(int(1.0 * SR))
    for f, st in [(1500, 0), (1000, 0.12)]:
        t = t_(0.1); s = np.sign(np.sin(2*np.pi*f*t)) * 0.3 * env(len(t), 0.002, 0.02); i = int(st*SR); out[i:i+len(s)] += s
    t = t_(0.5); thud = (np.sin(2*np.pi*70*t) * expdec(len(t), 12) + lp_fast(noise(0.5), 2500) * expdec(len(t), 40))
    i = int(0.3*SR); out[i:i+len(thud)] += thud
    return norm(out, 0.9)
def handle():
    d = 1.3; n = int(d*SR); out = np.zeros(n)
    for k, st in enumerate([0, 0.22, 0.42, 0.66, 0.85]):
        t = t_(0.18); s = (np.sin(2*np.pi*(900+k*40)*t) * 0.4 + rng.uniform(-1, 1, len(t))) * expdec(len(t), 35)
        s = bp_fast(s, 300, 4000); i = int(st*SR); out[i:i+len(s)] += s
    return norm(out, 0.8)
def bang():
    d = 1.4; n = int(d*SR); out = np.zeros(n)
    for st in [0, 0.32, 0.6]:
        t = t_(0.35); s = np.sin(2*np.pi*85*t) * expdec(len(t), 14) + lp_fast(noise(0.35), 900) * expdec(len(t), 25)
        i = int(st*SR); out[i:i+len(s)] += s
    return norm(lp_fast(out, 1500), 0.8)  # abafado: vem de outro andar
def heartbeat(beats=4, bpm=92):
    per = 60 / bpm; n = int(per * beats * SR); out = np.zeros(n)
    for b in range(beats):
        for off, g in [(0, 1.0), (0.22, 0.7)]:
            t = t_(0.25); s = np.sin(2*np.pi*52*t) * expdec(len(t), 16) * g
            i = int((b*per + off) * SR); out[i:i+len(s)] += s[:n-i]
    return norm(out, 0.95)
def alarm():
    d = 2.4; t = t_(d)
    tone = np.sin(2*np.pi*220*t) + 0.5*np.sin(2*np.pi*330*t)
    gate = (np.sin(2*np.pi*1.6*t) > 0).astype(float)
    return norm(lp_fast(tone * gate, 1500) * env(len(t), 0.05, 0.6), 0.5)
def ticks(n_=4):
    out = np.zeros(int(n_ * SR))
    for k in range(n_):
        t = t_(0.08); s = np.sin(2*np.pi*2000*t) * expdec(len(t), 60); i = int(k*SR); out[i:i+len(s)] += s
    return norm(out, 0.5)
def ding():
    d = 2.6; out = np.zeros(int(d*SR))
    for f, st in [(1046.5, 0), (830.6, 0.45)]:
        t = t_(2.0); s = (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*2.76*f*t)*np.exp(-t*4) + 0.2*np.sin(2*np.pi*5.4*f*t)*np.exp(-t*8)) * np.exp(-t*2.2)
        i = int(st*SR); out[i:i+len(s)] += s
    return norm(out, 0.75)
def door_slide():
    d = 2.2; t = t_(d); n = lp_fast(noise(d), 500)
    hum = np.sin(2*np.pi*95*t) * 0.3
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return norm((n + hum) * e, 0.6)
def footstep(g=1.0):
    t = t_(0.22); s = np.sin(2*np.pi*65*t) * expdec(len(t), 25) + lp_fast(noise(0.22), 1800) * expdec(len(t), 45) * 0.6
    return s * g
def steps(count=7, gap=0.55):
    n = int((count * gap + 0.5) * SR); out = np.zeros(n)
    for k in range(count):
        s = footstep(0.25 + 0.75 * k / (count - 1)); i = int(k * gap * SR); out[i:i+len(s)] += s
    return norm(lp_fast(out, 2200), 0.85)
def steps_run():
    n = int(1.2*SR); out = np.zeros(n)
    for k in range(5):
        s = footstep(0.8); i = int(k*0.21*SR); out[i:i+len(s)] += s
    return norm(out, 0.7)
def rewind():
    d = 0.5; t = t_(d)
    s = sweep(2400, 300, d) * 0.5 + bp_fast(noise(d), 1000, 6000) * 0.5
    return norm(s * env(len(t), 0.01, 0.1), 0.5)
def vibrate():
    d = 2.0; t = t_(d)
    s = np.sign(np.sin(2*np.pi*150*t)) * (np.sin(2*np.pi*5*t) > -0.2)
    return norm(lp_fast(s, 600), 0.4)
def ring():
    d = 2.2; t = t_(d)   # toque clássico 440+480 Hz modulado; corte abrupto no fim (feito no mix)
    s = (np.sin(2*np.pi*440*t) + np.sin(2*np.pi*480*t)) * (np.sin(2*np.pi*20*t) > 0)
    s = s * np.minimum(1, t / 0.02)
    return norm(s, 0.55)

def breath(n_=4, period=1.7):
    """respiração pesada atrás de alguém"""
    n = int(n_ * period * SR); out = np.zeros(n)
    for k in range(n_):
        for off, d, g in [(0, 0.8, 1.0), (0.85, 0.7, 0.8)]:
            L = int(d * SR); tt = np.arange(L) / SR
            e = np.sin(np.pi * tt / d) ** 2
            s_ = bp_fast(rng.uniform(-1, 1, L), 180 if off else 250, 900 if off else 1200) * e * g
            i = int((k * period + off) * SR); out[i:i+L] += s_[:max(0, n-i)]
    return norm(out, 0.8)
def metal_steps(count=6, gap=0.42):
    """passos em escada de metal/concreto com reverberação"""
    n = int((count * gap + 1.2) * SR); out = np.zeros(n)
    for k in range(count):
        t = t_(0.5); s_ = (np.sin(2*np.pi*95*t) * expdec(len(t), 18) + bp_fast(noise(0.5), 1500, 6000) * expdec(len(t), 60) * 0.5
              + np.sin(2*np.pi*1730*t) * expdec(len(t), 30) * 0.12)
        i = int(k * gap * SR); out[i:i+len(s_)] += s_
    return norm(lp_fast(out, 2500), 0.8)
def call_drop():
    out = np.zeros(int(1.3 * SR))
    for k in range(3):
        t = t_(0.22); s_ = np.sin(2*np.pi*480*t) * 0.6 * env(len(t), 0.005, 0.02); i = int(k * 0.4 * SR); out[i:i+len(s_)] += s_
    return norm(out, 0.5)
def answer():
    t = t_(0.15); return norm(np.sin(2*np.pi*1200*t) * expdec(len(t), 40) + np.sin(2*np.pi*1800*t) * expdec(len(t), 50) * 0.5, 0.5)
def unlock():
    out = np.zeros(int(0.9 * SR))
    for f, st in [(1000, 0), (1500, 0.12)]:
        t = t_(0.1); s_ = np.sin(2*np.pi*f*t) * 0.4 * env(len(t), 0.002, 0.02); i = int(st*SR); out[i:i+len(s_)] += s_
    t = t_(0.3); clk = lp_fast(noise(0.3), 3500) * expdec(len(t), 50) + np.sin(2*np.pi*140*t) * expdec(len(t), 25) * 0.6
    i = int(0.32 * SR); out[i:i+len(clk)] += clk
    return norm(out, 0.8)
def door_creak():
    d = 1.6; t = t_(d); f = 380 + 120 * np.sin(2*np.pi*0.7*t) + 40 * np.sin(2*np.pi*11*t)
    s_ = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * (0.5 + 0.5*np.sin(2*np.pi*23*t))
    return norm(bp_fast(s_, 300, 2500) * np.sin(np.pi * t / d) ** 1.5, 0.45)
def push_bar():
    t = t_(0.8); s_ = np.sin(2*np.pi*75*t) * expdec(len(t), 10) + bp_fast(noise(0.8), 500, 4000) * expdec(len(t), 30) * 0.7
    s_ += np.sin(2*np.pi*2400*t) * expdec(len(t), 20) * 0.08
    return norm(s_, 0.9)
def drone_hit():
    d = 2.5; t = t_(d); s_ = (np.sin(2*np.pi*41*t) + 0.5*np.sin(2*np.pi*61.5*t)) * np.minimum(1, t / 0.02) * np.exp(-t * 1.1)
    return norm(lp_fast(s_ + bp_fast(noise(d), 60, 400) * np.exp(-t * 3) * 0.5, 600), 0.95)

def blip():
    """texto digital aparecendo na tela"""
    out = np.zeros(int(0.5 * SR))
    for k, f in enumerate([1800, 2400, 1800, 3000]):
        t = t_(0.05); s_ = np.sign(np.sin(2*np.pi*f*t)) * 0.25 * env(len(t), 0.002, 0.01); i = int(k * 0.07 * SR); out[i:i+len(s_)] += s_
    return norm(lp_fast(out, 6000), 0.4)
def door_open():
    """porta corta-fogo abrindo: estalo do trinco + rangido grave curto + batida abafada (sem ruído de ar)"""
    d = 1.3; n = int(d * SR); out = np.zeros(n)
    t = t_(0.06); clk = bp_fast(noise(0.06), 1200, 6000) * expdec(len(t), 80); out[:len(t)] += clk
    t2 = t_(0.12); out[int(0.07*SR):int(0.07*SR)+len(t2)] += bp_fast(noise(0.12), 600, 3000) * expdec(len(t2), 50) * 0.6
    tc = t_(0.7); f = 95 + 25 * np.sin(2*np.pi*1.2*tc) + 6 * np.sin(2*np.pi*17*tc)
    creak = np.sin(2*np.pi*np.cumsum(f)/SR) * (0.5 + 0.5*np.sin(2*np.pi*9*tc)) * np.sin(np.pi*tc/0.7) * 0.35
    i = int(0.2*SR); out[i:i+len(tc)] += lp_fast(creak, 900)
    tt = t_(0.35); thud = np.sin(2*np.pi*58*tt) * expdec(len(tt), 16) * 0.5
    j = int(0.9*SR); out[j:j+len(tt)] += thud[:n-j]
    return norm(out, 0.7)
def pulse():
    """batida grave única (substitui o whoosh)"""
    t = t_(0.8); return norm(np.sin(2*np.pi*48*t) * expdec(len(t), 7) + np.sin(2*np.pi*96*t) * expdec(len(t), 14) * 0.3, 0.9)
def door_close():
    """porta fechando + bipe de trava"""
    out = np.zeros(int(1.0 * SR)); t = t_(0.5)
    out[:len(t)] += np.sin(2*np.pi*65*t) * expdec(len(t), 14) + lp_fast(noise(0.5), 1500) * expdec(len(t), 35) * 0.6
    tb = t_(0.12); b = np.sin(2*np.pi*1400*tb) * 0.3 * env(len(tb), 0.003, 0.02); i = int(0.45 * SR); out[i:i+len(b)] += b
    return norm(out, 0.8)
def key_turn():
    out = np.zeros(int(0.9 * SR))
    for st, f in [(0.0, 3200), (0.18, 2600), (0.45, 2100), (0.5, 1500)]:
        t = t_(0.06); s_ = bp_fast(noise(0.06), f * 0.6, f * 1.4) * expdec(len(t), 70); i = int(st * SR); out[i:i+len(s_)] += s_
    t = t_(0.3); out[int(0.5*SR):int(0.5*SR)+len(t)] += np.sin(2*np.pi*180*t) * expdec(len(t), 30) * 0.5
    return norm(out, 0.7)
def key_jingle():
    out = np.zeros(int(1.0 * SR))
    for k in range(7):
        t = t_(0.25); f = 3000 + rng.uniform(-600, 900)
        s_ = (np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*2.7*t)) * expdec(len(t), 25); i = int(rng.uniform(0, 0.7) * SR); out[i:i+len(s_)] += s_
    return norm(out, 0.4)
def footstep1():
    return norm(footstep(1.0), 0.7)

LIB = {k: v for k, v in globals().items() if callable(v) and k in (
    "notif message impact braam whoosh riser glitch static tv_on flicker lock handle bang heartbeat "
    "alarm ticks ding door_slide steps steps_run rewind vibrate ring breath metal_steps call_drop answer unlock "
    "door_creak push_bar drone_hit blip door_open door_close key_turn key_jingle footstep1 pulse").split()}

def music(duration, automation):
    """Trilha de suspense: drone em Lá menor, pulso grave e notas agudas esparsas.
    automation: lista de {t, level, pulse} (pulse 0..2 controla intensidade do pulso)."""
    t = t_(duration); n = len(t)
    def auto(key):
        xs = [a["t"] for a in automation]; ys = [a[key] for a in automation]
        return np.interp(t, xs, ys)
    level, pulse = auto("level"), auto("pulse")
    pad = np.zeros(n)
    for f, g in [(55, 1.0), (82.41, 0.6), (110, 0.5), (130.81, 0.35), (164.81, 0.15)]:
        for det in (-0.25, 0.25):
            ph = 2*np.pi*(f+det)*t
            pad += g * (np.sin(ph) + 0.35*np.sin(2*ph) + 0.15*np.sin(3*ph))
    pad = lp_fast(pad, 700) * (0.75 + 0.25*np.sin(2*np.pi*0.08*t))
    # pulso grave (colcheias a 100 bpm) ativado por 'pulse'
    beat = 60 / 100 / 2; ph = (t % beat) / beat
    bass = np.sin(2*np.pi*55*t) * np.exp(-ph * 9) + 0.4*np.sin(2*np.pi*110*t) * np.exp(-ph * 14)
    hat = hp_fast(noise(duration), 6000) * np.exp(-ph * 40) * 0.25
    pul = bass * np.clip(pulse, 0, 1) + hat * np.clip(pulse - 1, 0, 1)
    # notas agudas fantasmagóricas
    bell = np.zeros(n)
    for k, st in enumerate(np.arange(1.5, duration, 5.3)):
        f = [880, 1046.5, 987.8, 659.3][k % 4]; L = int(3.5*SR); i = int(st*SR)
        tt = np.arange(min(L, n-i)) / SR
        bell[i:i+len(tt)] += np.sin(2*np.pi*f*tt) * np.exp(-tt*1.4) * 0.12
    mix = norm(pad, 0.5) + pul * 0.35 + bell
    return mix * level
