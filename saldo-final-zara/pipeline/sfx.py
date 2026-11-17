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

def elev_doors():
    """portas de elevador: motor + roletes (mecânico, sem ruído de ar)"""
    d = 1.8; t = t_(d)
    motor = (np.sin(2*np.pi*110*t) + 0.5*np.sin(2*np.pi*220*t)) * np.sin(np.pi*t/d) ** 0.6 * 0.25
    rollers = np.zeros(len(t))
    for k in range(9):
        L = int(0.03*SR); i = int((0.15 + k*0.17) * SR)
        rollers[i:i+L] += bp_fast(noise(0.03), 900, 3500) * np.linspace(1, 0, L) * 0.5
    tt = t_(0.25); end = np.sin(2*np.pi*80*tt) * expdec(len(tt), 20) * 0.4
    out = motor + rollers; j = len(t) - len(tt); out[j:] += end
    return norm(out, 0.6)
def button():
    t = t_(0.12); return norm(np.sin(2*np.pi*1650*t) * env(len(t), 0.002, 0.04), 0.4)
def elev_motor():
    """descida: zumbido grave do motor"""
    d = 3.0; t = t_(d)
    s_ = (np.sin(2*np.pi*(62 + 4*t/d)*t) + 0.4*np.sin(2*np.pi*124*t) + 0.15*np.sin(2*np.pi*248*t)) * np.minimum(1, t/0.4) * np.minimum(1, (d-t)/0.2)
    return norm(s_, 0.5)
def jolt():
    """parada brusca: pancada metálica"""
    t = t_(1.0); s_ = np.sin(2*np.pi*55*t) * expdec(len(t), 8) + np.sin(2*np.pi*730*t) * expdec(len(t), 12) * 0.25 + np.sin(2*np.pi*1190*t) * expdec(len(t), 16) * 0.15
    return norm(s_, 0.9)
def zipper():
    out = np.zeros(int(1.2 * SR))
    for k in range(40):
        L = int(0.006*SR); i = int((k * 0.026 + rng.uniform(0, 0.004)) * SR)
        out[i:i+L] += bp_fast(noise(0.006), 1500, 7000)[:L] * 0.7
    return norm(out, 0.45)
def paper():
    t = t_(0.5); s_ = bp_fast(noise(0.5), 2000, 7000) * (0.4 + 0.6*np.abs(np.sin(2*np.pi*7*t))) * np.sin(np.pi*t/0.5)
    return norm(s_, 0.3)
def intercom_on():
    out = np.zeros(int(0.5 * SR)); t = t_(0.04); out[:len(t)] = bp_fast(noise(0.04), 500, 4000) * expdec(len(t), 60)
    tb = t_(0.15); b = np.sin(2*np.pi*900*tb) * 0.3 * env(len(tb), 0.003, 0.03); out[int(0.08*SR):int(0.08*SR)+len(b)] += b
    return norm(out, 0.5)
def knock():
    """batidas fortes na porta de metal (vistas de dentro)"""
    out = np.zeros(int(1.4 * SR))
    for st in [0, 0.28, 0.56, 0.95]:
        t = t_(0.4); s_ = np.sin(2*np.pi*90*t) * expdec(len(t), 12) + np.sin(2*np.pi*410*t) * expdec(len(t), 18) * 0.35
        i = int(st*SR); out[i:i+len(s_)] += s_
    return norm(lp_fast(out, 2500), 0.85)

def hum(d=12.0):
    """zumbido elétrico baixo da cabine parada (sem ruído de ar)"""
    t = t_(d); s_ = (np.sin(2*np.pi*60*t) + 0.5*np.sin(2*np.pi*120*t) + 0.2*np.sin(2*np.pi*180*t)) * (0.85 + 0.15*np.sin(2*np.pi*0.3*t))
    return norm(s_ * np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.0), 0.25)
def pry():
    """alavanca forçando a porta: rangido metálico + tranco"""
    d = 0.9; t = t_(d); f = 260 + 90*np.sin(2*np.pi*2.5*t)
    sq = np.sin(2*np.pi*np.cumsum(f)/SR) * (0.5 + 0.5*np.sin(2*np.pi*31*t)) * np.sin(np.pi*t/d) * 0.35
    th = np.zeros(len(t)); tt = t_(0.3); i = int(0.55*SR)
    th[i:i+len(tt)] = np.sin(2*np.pi*75*tt) * expdec(len(tt), 15) + np.sin(2*np.pi*640*tt) * expdec(len(tt), 25) * 0.3
    return norm(lp_fast(sq, 1800) + th, 0.8)
def deny():
    out = np.zeros(int(0.6 * SR))
    for st in (0, 0.2):
        t = t_(0.12); b = np.sign(np.sin(2*np.pi*520*t)) * 0.35 * env(len(t), 0.002, 0.01); i = int(st*SR); out[i:i+len(b)] += b
    return norm(lp_fast(out, 3000), 0.55)

def knock3():
    """três batidas abafadas atrás de uma porta (TOC… TOC… TOC…)"""
    out = np.zeros(int(2.2 * SR))
    for st in (0, 0.62, 1.24):
        t = t_(0.35); s_ = np.sin(2*np.pi*95*t) * expdec(len(t), 16) + np.sin(2*np.pi*240*t) * expdec(len(t), 24) * 0.4
        i = int(st*SR); out[i:i+len(s_)] += s_
    return norm(lp_fast(out, 900), 0.85)
def servo():
    """motorzinho da câmera girando"""
    d = 0.9; t = t_(d); f = 420 + 60*np.sin(2*np.pi*1.1*t)
    s_ = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * 0.25 * np.sin(np.pi*t/d)
    return norm(lp_fast(s_, 2200), 0.35)

# ---------------- sons novos de SALDO FINAL ----------------
def city(d=8.0):
    """ambiência de avenida futurista: rumor grave, carros elétricos passando e zumbido de neon"""
    t = t_(d); n = len(t)
    rumble = lp_fast(noise(d), 260) * 0.6
    cars = np.zeros(n)
    for k, st in enumerate([0.4, 2.1, 3.6, 5.2, 6.6]):
        L = int(2.2 * SR); i = int(st * SR); tt = np.arange(min(L, n - i)) / SR
        f = 180 + 140 * np.exp(-((tt - 1.1) ** 2) / 0.15) * (1 if k % 2 else 0.8)
        car = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-((tt - 1.1) ** 2) / 0.35)
        cars[i:i+len(tt)] += car * 0.25 + bp_fast(rng.uniform(-1, 1, len(tt)), 300, 2000) * np.exp(-((tt - 1.1) ** 2) / 0.3) * 0.25
    neon = (np.sin(2*np.pi*120*t) * 0.04 + np.sin(2*np.pi*240*t) * 0.02)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)
    return norm((rumble + cars + neon) * e, 0.6)
def coin_flow(d=2.2):
    """transferência de anos: cintilar dourado ascendente"""
    n = int(d * SR); out = np.zeros(n)
    for k in range(34):
        st = rng.uniform(0, d - 0.3); f = 1400 + 2200 * (st / d) + rng.uniform(-200, 200)
        tt = t_(0.25); s_ = (np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*2.01*f*tt)) * expdec(len(tt), 18)
        i = int(st * SR); out[i:i+len(tt)] += s_[:n-i] * rng.uniform(0.3, 1)
    t = t_(d); pad = sweep(300, 900, d) * 0.15 * np.sin(np.pi * t / d)
    return norm(out + pad, 0.55)
def confirm():
    """confirmação de transação: dois tons limpos + pulso grave"""
    out = np.zeros(int(1.6 * SR))
    for f, st in [(784, 0), (1175, 0.11)]:
        tt = t_(0.5); s_ = (np.sin(2*np.pi*f*tt) + 0.25*np.sin(2*np.pi*3*f*tt)) * expdec(len(tt), 9); i = int(st*SR); out[i:i+len(tt)] += s_ * 0.5
    tt = t_(1.2); out[int(0.1*SR):int(0.1*SR)+len(tt)] += (np.sin(2*np.pi*46*tt) + 0.4*np.sin(2*np.pi*92*tt)) * expdec(len(tt), 3.5)
    return norm(out, 0.9)
def tap():
    tt = t_(0.08); return norm(bp_fast(noise(0.08), 1500, 6000) * expdec(len(tt), 90) + np.sin(2*np.pi*900*tt) * expdec(len(tt), 70) * 0.5, 0.5)
def cash():
    """dinheiro caiu: arpejo brilhante"""
    out = np.zeros(int(1.4 * SR))
    for k, f in enumerate([1046.5, 1318.5, 1568, 2093]):
        tt = t_(0.9); s_ = (np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*6)) * np.exp(-tt*4.5); i = int(k*0.07*SR); out[i:i+len(tt)] += s_
    return norm(out, 0.65)
def alert():
    """notificação vermelha: dois bipes dissonantes"""
    out = np.zeros(int(0.9 * SR))
    for st in (0, 0.22):
        tt = t_(0.16); s_ = (np.sin(2*np.pi*740*tt) + np.sin(2*np.pi*1046*tt)) * env(len(tt), 0.003, 0.04); i = int(st*SR); out[i:i+len(tt)] += s_
    return norm(out, 0.6)
def record_stop():
    """música de vitória interrompida (agulha/fita freando)"""
    d = 0.55; t = t_(d); f = 600 * (1 - t / d) ** 2 + 40
    s_ = np.sin(2*np.pi*np.cumsum(f)/SR) * (1 - t / d) + bp_fast(noise(d), 800, 5000) * 0.3 * (1 - t / d)
    return norm(s_, 0.6)
def shatter():
    """ampulheta de vidro quebrando: estilhaços agudos + impacto"""
    d = 2.0; n = int(d * SR); out = np.zeros(n); t = t_(d)
    out += lp_fast(noise(d), 3000) * expdec(n, 22) * 0.8 + np.sin(2*np.pi*60*t) * expdec(n, 6) * 0.9
    for k in range(70):
        st = abs(rng.normal(0, 0.35)); f = rng.uniform(2500, 9000); tt = t_(0.18)
        s_ = np.sin(2*np.pi*f*tt) * expdec(len(tt), rng.uniform(25, 60)); i = int(st*SR)
        if i < n: out[i:i+len(tt)] += s_[:n-i] * rng.uniform(0.1, 0.5)
    return norm(out, 0.95)
def sand(d=3.0):
    """areia escorrendo"""
    t = t_(d); s_ = bp_fast(noise(d), 2500, 9000) * (0.6 + 0.4 * np.abs(np.sin(2*np.pi*9*t))) * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.4)
    return norm(s_, 0.35)
def victory(d=3.9):
    """trecho de vitória (synth pop) — cortado secamente pelo alerta"""
    t = t_(d); n = len(t); out = np.zeros(n); beat = 60 / 128
    chords = [[523.25, 659.25, 783.99], [587.33, 739.99, 880], [659.25, 830.61, 987.77], [698.46, 880, 1046.5]]
    for b in range(int(d / (beat / 2)) + 1):
        st = b * beat / 2; i = int(st * SR); ch = chords[(b // 4) % 4]; f = ch[b % 3] * (2 if b % 2 else 1)
        tt = np.arange(min(int(0.25 * SR), n - i)) / SR
        if len(tt) <= 0: continue
        out[i:i+len(tt)] += np.sign(np.sin(2*np.pi*f*tt)) * 0.12 * np.exp(-tt * 10)
    ph = (t % beat) / beat; kick = np.sin(2*np.pi*(50 + 90 * np.exp(-ph * 30)) * t) * np.exp(-ph * 8)
    bass = np.sin(2*np.pi*130.81*t) * 0.3 * np.exp(-((t % (beat/2)) / (beat/2)) * 3)
    return norm(lp_fast(out, 6000) + kick * 0.5 + bass, 0.8)
def phone_ring():
    """toque do celular (melodia digital) — 3 repetições"""
    out = np.zeros(int(2.4 * SR))
    for r in range(3):
        for k, f in enumerate([1318.5, 1568, 1975.5, 1568]):
            tt = t_(0.11); s_ = (np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*2*f*tt)) * env(len(tt), 0.004, 0.03); i = int((r * 0.8 + k * 0.12) * SR); out[i:i+len(tt)] += s_
    return norm(out, 0.5)
def buzz():
    """vibração do celular sobre o sofá"""
    d = 2.4; t = t_(d); s_ = np.sin(2*np.pi*170*t) * ((t % 0.8) < 0.45)
    return norm(lp_fast(s_ + bp_fast(noise(d), 100, 400) * 0.3 * ((t % 0.8) < 0.45), 500), 0.5)
def sigh_room(d=3.0):
    """tom de sala (silêncio vivo)"""
    t = t_(d); return norm(lp_fast(noise(d), 180) * np.minimum(1, t/0.5) * np.minimum(1, (d-t)/0.5), 0.15)
def fridge():
    """porta da geladeira abrindo + zumbido do motor"""
    d = 2.0; t = t_(d); out = np.zeros(len(t))
    tt = t_(0.2); out[:len(tt)] += bp_fast(noise(0.2), 300, 2500) * expdec(len(tt), 25)
    out += (np.sin(2*np.pi*100*t) + 0.5*np.sin(2*np.pi*200*t)) * 0.12 * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
    return norm(out, 0.5)
def couch():
    """corpo caindo no sofá"""
    tt = t_(0.7); return norm(lp_fast(noise(0.7), 600) * expdec(len(tt), 9) + np.sin(2*np.pi*70*tt) * expdec(len(tt), 12) * 0.8, 0.8)
def lights_out():
    tt = t_(1.2); s_ = np.sin(2*np.pi*120*tt) * np.exp(-tt * 4) * 0.5 + np.sin(2*np.pi*55*tt) * np.exp(-tt * 3)
    s_[:300] += rng.uniform(-1, 1, 300) * np.linspace(1, 0, 300)
    return norm(s_, 0.7)

# ---------------- sons de "Quanto vale sua vida?" ----------------
def crowd(d=12.0):
    """agência movimentada: murmúrio de vozes (ruído formantizado), passos e bipes distantes"""
    t = t_(d); n = len(t); out = np.zeros(n)
    for k in range(6):
        f = rng.uniform(300, 900); lfo = 0.5 + 0.5 * np.sin(2*np.pi*rng.uniform(0.3, 1.2)*t + k)
        out += bp_fast(noise(d), f * 0.8, f * 1.6) * lfo * 0.5
    for st in np.arange(0.7, d, 2.3):
        tt = t_(0.12); b = np.sin(2*np.pi*1900*tt) * expdec(len(tt), 30) * 0.15; i = int(st * SR); out[i:i+len(tt)] += b[:n-i]
    return norm(lp_fast(out, 2600) * np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.5), 0.45)
def rain(d=6.0):
    t = t_(d); s_ = hp_fast(noise(d), 900) * 0.6 + lp_fast(noise(d), 400) * 0.4
    drops = np.zeros(len(t))
    for k in range(int(d * 40)):
        i = int(rng.uniform(0, d - 0.05) * SR); tt = t_(0.03); drops[i:i+len(tt)] += np.sin(2*np.pi*rng.uniform(2000, 5000)*tt) * expdec(len(tt), 150) * 0.3
    return norm((s_ + drops) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4), 0.5)
def run_splash(d=5.0, step=0.28):
    """passos correndo em asfalto molhado"""
    n = int(d * SR); out = np.zeros(n)
    for k in range(int(d / step)):
        tt = t_(0.25); s_ = np.sin(2*np.pi*70*tt) * expdec(len(tt), 30) + bp_fast(noise(0.25), 1500, 7000) * expdec(len(tt), 22) * 0.7
        i = max(0, int((k * step + rng.uniform(-0.01, 0.01)) * SR)); L = min(len(tt), n - i); out[i:i+L] += s_[:L]
    return norm(out, 0.8)
def breath_run(d=4.0, period=0.55):
    n = int(d * SR); out = np.zeros(n)
    for k in range(int(d / period)):
        L = int(0.35 * SR); tt = np.arange(L) / SR; e = np.sin(np.pi * tt / 0.35) ** 2
        s_ = bp_fast(rng.uniform(-1, 1, L), 400 if k % 2 else 700, 2500) * e
        i = int(k * period * SR); out[i:i+L] += s_[:max(0, n-i)]
    return norm(out, 0.6)
def monitor(d=10.0, bpm=96):
    per = 60 / bpm; n = int(d * SR); out = np.zeros(n)
    for b in range(int(d / per)):
        tt = t_(0.12); s_ = np.sin(2*np.pi*1000*tt) * env(len(tt), 0.003, 0.05); i = int(b * per * SR); out[i:i+len(tt)] += s_[:max(0, n-i)]
    return norm(out, 0.4)
def monitor_fast(d=3.0):
    return monitor(d, 150)
def flatline(d=1.6):
    t = t_(d); return norm(np.sin(2*np.pi*1000*t) * np.minimum(1, t / 0.01), 0.45)
def holo_on():
    d = 1.4; t = t_(d); s_ = sweep(200, 1800, d) * 0.4 * np.exp(-t * 1.5) + bp_fast(noise(d), 2000, 8000) * 0.25 * np.exp(-t * 3)
    s_ += (np.sin(2*np.pi*110*t) + 0.4*np.sin(2*np.pi*220*t)) * 0.3 * np.minimum(1, t / 0.2) * np.exp(-t * 0.8)
    return norm(s_, 0.6)
def holo_hum(d=12.0):
    t = t_(d); s_ = (np.sin(2*np.pi*120*t) + 0.3*np.sin(2*np.pi*240*t) + 0.15*np.sin(2*np.pi*361*t)) * (0.8 + 0.2*np.sin(2*np.pi*3*t))
    return norm(s_ * np.minimum(1, t / 0.5) * np.minimum(1, (d - t) / 0.5), 0.25)
def scan():
    """leitor de pulso da agência confirmando"""
    out = np.zeros(int(1.2 * SR))
    tt = t_(0.6); out[:len(tt)] += sweep(400, 1600, 0.6) * 0.3 * env(len(tt), 0.01, 0.1)
    for f, st in [(1318, 0.62), (1760, 0.74)]:
        t2 = t_(0.3); s_ = np.sin(2*np.pi*f*t2) * expdec(len(t2), 12); i = int(st * SR); out[i:i+len(t2)] += s_ * 0.5
    return norm(out, 0.7)
def bag_drop():
    tt = t_(0.6); return norm(lp_fast(noise(0.6), 900) * expdec(len(tt), 14) + np.sin(2*np.pi*90*tt) * expdec(len(tt), 18) * 0.6, 0.8)
def pole_grab():
    tt = t_(0.8); return norm(np.sin(2*np.pi*620*tt) * expdec(len(tt), 8) * 0.4 + np.sin(2*np.pi*1460*tt) * expdec(len(tt), 12) * 0.25 + bp_fast(noise(0.8), 800, 4000) * expdec(len(tt), 30) * 0.5, 0.7)
def door_slam():
    tt = t_(0.7); return norm(np.sin(2*np.pi*60*tt) * expdec(len(tt), 10) + lp_fast(noise(0.7), 1200) * expdec(len(tt), 25) * 0.6, 0.85)
def thunder():
    d = 3.0; t = t_(d); s_ = lp_fast(noise(d), 160) * (np.exp(-t * 1.2) + 0.6 * np.exp(-((t - 0.6) ** 2) / 0.05))
    return norm(s_, 0.8)

_SKIP = {"t_", "env", "expdec", "noise", "lp", "lp_fast", "hp_fast", "bp_fast", "norm", "sweep", "music", "footstep"}
LIB = {k: v for k, v in list(globals().items()) if callable(v) and not k.startswith("_") and k not in _SKIP and getattr(v, "__module__", "") == __name__}

def music(duration, automation):
    """Trilha original de suspense tecnológico (Ré menor): pad de sintetizador, arpejo de pulsos,
    sub-grave cinematográfico. automation: [{t, level, pulse(0..2), arp(0..1)}]"""
    t = t_(duration); n = len(t)
    def auto(key, dflt=0):
        xs = [a["t"] for a in automation]; ys = [a.get(key, dflt) for a in automation]
        return np.interp(t, xs, ys)
    level, pulse, arp_l = auto("level"), auto("pulse"), auto("arp")
    # progressão Dm – Bb – Gm – A (8 s cada)
    prog = [[73.42, 146.83, 174.61, 220.0], [58.27, 116.54, 146.83, 174.61], [49.0, 98.0, 116.54, 146.83], [55.0, 110.0, 138.59, 164.81]]
    seg = 8.0; pad = np.zeros(n)
    for ci in range(int(duration / seg) + 1):
        i0, i1 = int(ci * seg * SR), min(n, int((ci + 1) * seg * SR) + int(0.8 * SR))
        if i0 >= n: break
        tt = np.arange(i1 - i0) / SR; e = np.minimum(1, tt / 0.8) * np.minimum(1, np.maximum(0, (seg + 0.8 - tt)) / 0.8)
        for k, f in enumerate(prog[ci % 4]):
            for det in (-0.3, 0.3):
                ph = 2*np.pi*(f + det)*tt
                pad[i0:i1] += (np.sin(ph) + 0.4*np.sin(2*ph) + 0.2*np.sin(3*ph)) * e * (1.0 if k == 0 else 0.55)
    pad = lp_fast(pad, 900) * (0.8 + 0.2 * np.sin(2*np.pi*0.1*t))
    # arpejo de pulsos (semicolcheias a 96 bpm)
    step = 60 / 96 / 4; idx = (t // step).astype(int); ph = (t % step) / step
    arp_notes = np.array([293.66, 349.23, 440.0, 587.33, 440.0, 349.23, 293.66, 220.0])
    chord_shift = np.array([1.0, 0.7937, 0.6674, 0.7492])[((t // seg).astype(int)) % 4]
    f = arp_notes[idx % 8] * chord_shift
    arp = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-ph * 6) * 0.5
    arp = lp_fast(arp, 3000)
    # pulso grave + chimbal
    beat = 60 / 96; bph = (t % beat) / beat
    sub = np.sin(2*np.pi*36.7*t) * np.exp(-bph * 5)
    hat = hp_fast(noise(duration), 7000) * np.exp(-((t % (beat/2)) / (beat/2)) * 30) * 0.2
    mix = norm(pad, 0.45) + arp * arp_l * 0.35 + sub * np.clip(pulse, 0, 1) * 0.45 + hat * np.clip(pulse - 1, 0, 1)
    return mix * level
