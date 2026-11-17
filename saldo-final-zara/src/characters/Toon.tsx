import React from 'react';
import {clamp, lerp, rnd} from '../lib/anim';
import {C} from '../styles/theme';

/**
 * TOON — motor oficial dos personagens de SALDO FINAL (2D, contorno preto, cores chapadas).
 * Evolução do esqueleto da série "Sistema Invadido": mesma proporção e IK, agora com contornos,
 * rosto completo (sobrancelhas, olhos com cílios, nariz, boca com fonemas) e pulseira de saldo de vida.
 * Coordenadas locais: origem no chão entre os pés, Y negativo para cima. Altura ≈ 860.
 */
export type Expr = 'neutral' | 'smile' | 'smirk' | 'sarcastic' | 'worried' | 'sad' | 'weak' | 'tender' |
  'surprised' | 'shock' | 'fear' | 'angry' | 'determined' | 'cold';
export type HandShape = 'relaxed' | 'open' | 'point' | 'fist' | 'grip';
export type Viseme = 'A' | 'E' | 'I' | 'O' | 'U' | 'M';

export type Pose = {
  rSh: number; rEl: number; lSh: number; lEl: number;   // r = braço à esquerda da tela, l = à direita
  lean?: number;
  rT?: {x: number; y: number}; lT?: {x: number; y: number};   // IK: alvo da mão
  rHand?: HandShape; lHand?: HandShape; rHandRot?: number; lHandRot?: number;
  rFs?: number; lFs?: number;                          // escorço do antebraço
  head?: number;                                       // inclinação da cabeça (graus)
};

export type Look = {
  name: string;
  skin: string; skinShade: string; blush?: string; lips?: string;
  hair: string; hairShade: string; hairStyle: 'puff' | 'messy' | 'wavy' | 'slick' | 'bun' | 'ponytail' | 'cap' | 'short';
  streak?: string;                                     // mecha colorida
  shirt: string; shirtShade: string;
  top?: 'puffer' | 'coat' | 'suit' | 'gown' | 'hoodie' | 'blazer' | 'none';
  topColor?: string; topShade?: string; trim?: string;
  pants: string; shoe: string; sole: string;
  female?: boolean; brow?: number; eyeColor?: string;
  hoops?: string; earcuff?: boolean; glasses?: boolean; tie?: string; pin?: string; locket?: boolean; bag?: boolean;
  stubble?: string; capColor?: string; build?: number;
};

const OL = C.outline, OW = 7;
const D2R = Math.PI / 180;
const L1 = 150, L2 = 138, SHX = 70, SHY = -582;
const HAND = 1.3;

/** traço com contorno preto */
const Stroke: React.FC<{d: string; w: number; col: string}> = ({d, w, col}) => (
  <>
    <path d={d} stroke={OL} strokeWidth={w + OW * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d={d} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
);
const Fill: React.FC<{d: string; col: string; w?: number; o?: number}> = ({d, col, w = OW, o = 1}) => (
  <path d={d} fill={col} stroke={OL} strokeWidth={w} strokeLinejoin="round" opacity={o} />
);

export const armIK = (side: 1 | -1, tx: number, ty: number, fs = 1): [number, number] => {
  const sx = side * SHX, sy = SHY, l2 = L2 * fs;
  const dx = tx - sx, dy = ty - sy;
  const d = Math.min(L1 + l2 - 1, Math.max(20, Math.hypot(dx, dy)));
  const th = Math.atan2(side * dx, dy);
  const a = Math.acos(clamp((L1 * L1 + d * d - l2 * l2) / (2 * L1 * d), -1, 1));
  const b = Math.acos(clamp((L1 * L1 + l2 * l2 - d * d) / (2 * L1 * l2), -1, 1));
  const cand = [th + a, th - a].map((sh) => ({sh, out: side * (sx + side * Math.sin(sh) * L1)}));
  const best = cand[0].out >= cand[1].out ? cand[0] : cand[1];
  const el = 180 - (b * 180) / Math.PI;
  return [(best.sh * 180) / Math.PI, best === cand[0] ? el : -el];
};

/** mão com contorno (dedos ao longo de +Y local) */
export const Hand: React.FC<{x: number; y: number; rot: number; shape: HandShape; skin: string; mirror?: number; size?: number}> = ({x, y, rot, shape, skin, mirror = 1, size = HAND}) => {
  const fingers: [number, number, number][] =
    shape === 'open' ? [[-28, 26, 10], [-9, 31, 10], [9, 30, 10], [26, 24, 10], [-75, 20, 9]]
      : shape === 'point' ? [[0, 34, 10], [-70, 15, 9]]
        : shape === 'relaxed' ? [[-12, 20, 10], [8, 21, 10], [-60, 14, 9]] : [];
  const big = shape === 'fist' || shape === 'grip';
  const f = (ang: number, len: number, w: number, k: number, col: string, extra: number) => {
    const a = ang * D2R;
    return <line key={k} x1={0} y1={6} x2={Math.sin(a) * len * mirror} y2={6 + Math.cos(a) * len} stroke={col} strokeWidth={w + extra} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${size})`}>
      {fingers.map(([a, l, w], i) => f(a, l, w, i, OL, 8))}
      <ellipse cx={0} cy={2} rx={big ? 17 : 15} ry={big ? 17 : 18} fill={skin} stroke={OL} strokeWidth={5} />
      {fingers.map(([a, l, w], i) => f(a, l, w, i + 10, skin, 0))}
      {shape === 'point' && <circle cx={8 * mirror} cy={14} r={9} fill={skin} stroke={OL} strokeWidth={4} />}
      {big && <path d="M-10,10 Q0,16 10,10" stroke={OL} strokeWidth={3} fill="none" />}
    </g>
  );
};

/** pulseira de saldo de vida (todos têm uma, no pulso esquerdo). frac = 0..1, glow = brilho extra */
export const LifeBand: React.FC<{frac: number; glow?: number; col?: string; t: number}> = ({frac, glow = 0, col = C.gold, t}) => {
  const segs = 10;
  return (
    <g>
      {glow > 0 && <circle cx={0} cy={0} r={34 + glow * 40} fill={col} opacity={0.18 + glow * 0.3} />}
      <rect x={-22} y={-12} width={44} height={22} rx={8} fill="#1A1622" stroke={OL} strokeWidth={4} />
      {Array.from({length: segs}).map((_, i) => {
        const on = i / segs < frac;
        const last = on && (i + 1) / segs >= frac && frac < 0.25;
        return <rect key={i} x={-18 + i * 3.7} y={-7} width={2.6} height={12} fill={on ? col : '#3A3344'}
          opacity={last ? 0.4 + 0.6 * (Math.sin(t * 14) > 0 ? 1 : 0) : 1} />;
      })}
    </g>
  );
};

export const PhoneProp: React.FC<{rot?: number; glow?: string}> = ({rot = 0, glow}) => (
  <g transform={`rotate(${rot})`}>
    {glow && <ellipse cx={0} cy={-10} rx={70} ry={90} fill={glow} opacity={0.14} />}
    <rect x={-32} y={-62} width={64} height={118} rx={12} fill="#14161F" stroke={OL} strokeWidth={6} />
    <circle cx={-14} cy={-46} r={5} fill="#2C3040" />
  </g>
);

const EXPR: Record<Expr, {brow: number; browY: number; eye: number; lid: number; pup: number; mouth: string}> = {
  neutral:    {brow: 0,   browY: 0,   eye: 1,    lid: 0,  pup: 1,    mouth: 'flat'},
  smile:      {brow: -3,  browY: -4,  eye: 0.95, lid: 0, pup: 1,    mouth: 'smile'},
  smirk:      {brow: 6,   browY: 0,   eye: 0.9,  lid: 0.22,  pup: 1,    mouth: 'smirk'},
  sarcastic:  {brow: 8,   browY: -2,  eye: 0.85, lid: 0.32,  pup: 1,    mouth: 'smirk'},
  worried:    {brow: -16, browY: -6,  eye: 1.05, lid: 0, pup: 0.95, mouth: 'frown'},
  sad:        {brow: -18, browY: -2,  eye: 0.9,  lid: 0.22, pup: 1,    mouth: 'frown'},
  weak:       {brow: -12, browY: 2,   eye: 0.75, lid: 0.5, pup: 1,    mouth: 'flat'},
  tender:     {brow: -10, browY: -2,  eye: 0.85, lid: 0.18, pup: 1,    mouth: 'smile'},
  surprised:  {brow: -6,  browY: -14, eye: 1.25, lid: 0,    pup: 0.85, mouth: 'o'},
  shock:      {brow: -10, browY: -20, eye: 1.35, lid: 0,    pup: 0.6,  mouth: 'shock'},
  fear:       {brow: -18, browY: -10, eye: 1.2,  lid: 0,    pup: 0.65, mouth: 'fear'},
  angry:      {brow: 18,  browY: 8,   eye: 0.95, lid: 0.12, pup: 0.9,  mouth: 'grit'},
  determined: {brow: 14,  browY: 5,   eye: 0.95, lid: 0.08,  pup: 1,    mouth: 'tight'},
  cold:       {brow: 6,   browY: 2,   eye: 0.8,  lid: 0.32, pup: 0.9,  mouth: 'smirk'},
};

export const blink = (t: number, seed = 0) => {
  const period = 2.9 + (seed % 4) * 0.6;
  const p = (t + seed * 0.37) % period;
  return p < 0.13 ? 1 - Math.abs(p - 0.065) / 0.065 : 0;
};

export type ToonProps = {
  t: number; look: Look; pose?: Pose; expr?: Expr;
  lookX?: number; lookY?: number;
  talk?: number; vis?: Viseme;              // boca: abertura (0..1) e fonema
  facing?: 'front' | 'side'; dir?: 1 | -1; walk?: number; run?: number;
  phone?: 'none' | 'L' | 'R' | 'ear'; phoneGlow?: string;
  band?: number; bandGlow?: number;         // pulseira de saldo (fração) no pulso esquerdo
  tremble?: number; x?: number; y?: number; scale?: number; seed?: number;
  noLegs?: boolean; tint?: string; tintAmt?: number; faceLight?: string;
  holdR?: React.ReactNode; holdL?: React.ReactNode;
  nArm?: [number, number];                   // vista lateral: ombro/cotovelo do braço próximo
};

/* ================================== ROSTO ================================== */
const Mouth: React.FC<{expr: Expr; talk: number; vis: Viseme; mx: number; my: number; look: Look; s?: number}> = ({expr, talk, vis, mx, my, look, s = 1}) => {
  const ink = '#3A1018', tongue = '#C4505E', lip = look.lips ?? OL;
  if (talk > 0.07 && vis !== 'M') {
    const o = clamp(talk, 0, 1);
    const [w, h] = vis === 'O' ? [13 + o * 5, 9 + o * 18] : vis === 'U' ? [10 + o * 3, 8 + o * 12] : vis === 'E' ? [24 + o * 6, 5 + o * 14] : vis === 'I' ? [20 + o * 4, 4 + o * 10] : [19 + o * 6, 8 + o * 24];
    return (
      <g transform={`translate(${mx},${my}) scale(${s})`}>
        <ellipse cx={0} cy={h * 0.3} rx={w} ry={h} fill={ink} stroke={lip} strokeWidth={look.lips ? 6 : 5} />
        {(vis === 'A' || vis === 'E' || vis === 'I') && h > 9 && <path d={`M${-w * 0.7},${h * 0.3 - h * 0.75} Q0,${h * 0.3 - h * 0.95} ${w * 0.7},${h * 0.3 - h * 0.75} L${w * 0.6},${h * 0.3 - h * 0.5} L${-w * 0.6},${h * 0.3 - h * 0.5} Z`} fill="#fff" />}
        {h > 12 && <ellipse cx={0} cy={h * 0.3 + h * 0.55} rx={w * 0.55} ry={h * 0.3} fill={tongue} />}
      </g>
    );
  }
  const m = EXPR[expr].mouth;
  const st = (d: string) => <path d={d} stroke={lip} strokeWidth={look.lips ? 8 : 6} strokeLinecap="round" fill="none" />;
  return (
    <g transform={`translate(${mx},${my}) scale(${s})`}>
      {m === 'smile' && st('M-20,-4 Q0,14 20,-4')}
      {m === 'flat' && st('M-15,0 Q0,4 15,0')}
      {m === 'smirk' && st('M-16,4 Q4,6 20,-8')}
      {m === 'frown' && st('M-17,6 Q0,-6 17,6')}
      {m === 'tight' && st('M-17,1 L17,1')}
      {m === 'grit' && <g><rect x={-20} y={-8} width={40} height={16} rx={6} fill="#fff" stroke={OL} strokeWidth={5} /><path d="M-20,0 L20,0" stroke={OL} strokeWidth={3} /></g>}
      {m === 'o' && <ellipse cx={0} cy={2} rx={11} ry={14} fill={ink} stroke={OL} strokeWidth={4} />}
      {m === 'shock' && <g><ellipse cx={0} cy={6} rx={17} ry={25} fill={ink} stroke={OL} strokeWidth={5} /><ellipse cx={0} cy={19} rx={9} ry={6} fill={tongue} /></g>}
      {m === 'fear' && <g><path d="M-24,6 Q0,-12 24,6 Q20,22 0,22 Q-20,22 -24,6 Z" fill={ink} stroke={OL} strokeWidth={5} /><path d="M-16,0 Q0,-8 16,0" stroke="#fff" strokeWidth={5} fill="none" /></g>}
    </g>
  );
};

const FaceFront: React.FC<{look: Look; expr: Expr; t: number; lookX: number; lookY: number; talk: number; vis: Viseme; seed: number}> = ({look, expr, t, lookX, lookY, talk, vis, seed}) => {
  const E = EXPR[expr];
  const fx = lookX * 22, fy = lookY * 11;
  const bl = blink(t, seed);
  const eyeR = look.female ? 19 : 16;
  const eyeH = 20 * E.eye * (1 - bl * 0.94);
  const lid = clamp(E.lid + bl, 0, 1);
  const pr = 9.5 * E.pup;
  const browW = look.brow ?? (look.female ? 7 : 10);
  return (
    <g>
      {/* bochechas */}
      {look.blush && <><ellipse cx={-56 + fx} cy={-688 + fy} rx={18} ry={9} fill={look.blush} opacity={0.45} /><ellipse cx={56 + fx} cy={-688 + fy} rx={18} ry={9} fill={look.blush} opacity={0.45} /></>}
      {/* olhos */}
      {[-36, 36].map((ex, i) => {
        const cx = ex + fx, cy = -726 + fy;
        return (
          <g key={ex}>
            <ellipse cx={cx} cy={cy} rx={eyeR} ry={Math.max(2, eyeH)} fill="#fff" stroke={OL} strokeWidth={4.5} />
            {eyeH > 5 && (
              <>
                <circle cx={cx + lookX * 6} cy={cy + 2 + lookY * 5} r={Math.min(pr, eyeH)} fill={look.eyeColor ?? '#3B2416'} />
                <circle cx={cx + lookX * 6} cy={cy + 2 + lookY * 5} r={Math.min(pr * 0.55, eyeH * 0.6)} fill="#0C0A10" />
                <circle cx={cx + lookX * 6 + 3.5} cy={cy - 2 + lookY * 5} r={2.8} fill="#fff" />
              </>
            )}
            {/* pálpebra superior (expressões de sarcasmo, cansaço) */}
            {lid > 0.05 && eyeH > 3 && (
              <path d={`M${cx - eyeR - 2},${cy - eyeH - 2} L${cx + eyeR + 2},${cy - eyeH - 2} L${cx + eyeR + 2},${cy - eyeH + eyeH * 2 * lid} Q${cx},${cy - eyeH + eyeH * 2 * lid + 4} ${cx - eyeR - 2},${cy - eyeH + eyeH * 2 * lid} Z`}
                fill={look.skin} stroke={OL} strokeWidth={4} />
            )}
            {look.female && <path d={`M${cx + (i ? 1 : -1) * eyeR * 0.6},${cy - eyeH * 0.85} l${(i ? 1 : -1) * 10},-8 M${cx + (i ? 1 : -1) * eyeR * 0.95},${cy - eyeH * 0.4} l${(i ? 1 : -1) * 11},-4`} stroke={OL} strokeWidth={4} strokeLinecap="round" />}
          </g>
        );
      })}
      {/* sobrancelhas */}
      <g stroke={look.hairShade} strokeWidth={browW} strokeLinecap="round">
        <line x1={-56 + fx} y1={-770 + E.browY + fy - E.brow * 0.5} x2={-18 + fx} y2={-770 + E.browY + fy + E.brow * 0.5} />
        <line x1={18 + fx} y1={-770 + E.browY + fy + E.brow * 0.5 - (expr === 'sarcastic' ? 12 : 0)} x2={56 + fx} y2={-770 + E.browY + fy - E.brow * 0.5 - (expr === 'sarcastic' ? 16 : 0)} />
      </g>
      {/* nariz */}
      <path d={`M${fx * 1.1 - 2},-704 Q${fx * 1.1 + 9},-688 ${fx * 1.1 - 5},-683`} stroke={OL} strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} />
      <Mouth expr={expr} talk={talk} vis={vis} mx={fx * 0.9} my={-660 + fy * 0.6} look={look} />
      {look.glasses && (
        <g stroke={OL} strokeWidth={5} fill="#C9E4FF" fillOpacity={0.12}>
          <rect x={-66 + fx} y={-748 + fy} width={56} height={40} rx={8} />
          <rect x={10 + fx} y={-748 + fy} width={56} height={40} rx={8} />
          <path d={`M${-10 + fx},${-730 + fy} L${10 + fx},${-730 + fy}`} fill="none" />
        </g>
      )}
      {(expr === 'fear' || expr === 'shock' || expr === 'worried') && <path d="M84,-776 Q93,-756 84,-746 Q75,-756 84,-776 Z" fill="#BFE6FF" stroke={OL} strokeWidth={3} />}
    </g>
  );
};

/* ================================ CABELO ================================ */
const HairBack: React.FC<{look: Look; t: number; sway: number}> = ({look, t, sway}) => {
  const h = look.hair;
  if (look.hairStyle === 'wavy') {
    const s = Math.sin(t * 1.6) * 3 + sway * 0.3;
    return <Fill col={look.hairShade} d={`M-108,-760 Q-140,-640 ${-128 + s},-560 Q-112,-540 -96,-556 Q-84,-536 -66,-552 L66,-552 Q84,-536 96,-556 Q112,-540 ${128 + s},-560 Q140,-640 108,-760 Z`} />;
  }
  if (look.hairStyle === 'ponytail') {
    return <g transform={`rotate(${-sway + 14}, 58, -800)`}><Fill col={h} d="M44,-806 C130,-790 150,-690 118,-600 C108,-660 84,-720 40,-760 Z" /></g>;
  }
  if (look.hairStyle === 'bun') return <Fill col={h} d="M-40,-830 a40,34 0 1,1 80,0 a40,34 0 1,1 -80,0" />;
  return null;
};

const HairFront: React.FC<{look: Look; fx: number; t: number}> = ({look, fx, t}) => {
  const h = look.hair, hs = look.hairShade;
  switch (look.hairStyle) {
    case 'puff': {
      // ZARA: black puff alto e cacheado, mecha magenta caindo na testa
      const puffs: [number, number, number][] = [[0, -862, 66], [-52, -842, 46], [52, -842, 46], [-30, -896, 40], [30, -896, 40], [0, -920, 34], [-72, -800, 30], [72, -800, 30]];
      const b = Math.sin(t * 2.2) * 2;
      return (
        <g>
          {puffs.map(([x, y, r], i) => <circle key={i} cx={x} cy={y + b * (i % 2 ? 1 : -1)} r={r} fill={h} stroke={OL} strokeWidth={OW} />)}
          {puffs.map(([x, y, r], i) => <circle key={`i${i}`} cx={x} cy={y + b * (i % 2 ? 1 : -1)} r={r - OW / 2} fill={h} />)}
          {[[-20, -880], [26, -868], [-44, -846], [8, -906], [46, -830]].map(([x, y], i) => <path key={`c${i}`} d={`M${x - 10},${y} q10,-12 20,0`} stroke={hs} strokeWidth={5} fill="none" strokeLinecap="round" />)}
          <Fill col={h} d={`M-100,-712 Q-104,-806 0,-812 Q104,-806 100,-712 Q86,-772 46,-786 Q${fx * 0.4},-776 ${-40 + fx * 0.3},-788 Q-86,-776 -100,-712 Z`} />
          {look.streak && <Fill col={look.streak} d={`M${-46 + fx * 0.3},-790 C${-86 + fx * 0.3},-770 ${-80 + fx * 0.3},-730 ${-66 + fx * 0.3},-706 C${-66 + fx * 0.3},-736 ${-54 + fx * 0.3},-760 ${-28 + fx * 0.3},-784 Z`} />}
        </g>
      );
    }
    case 'messy':
      // DANTE: laterais raspadas, topete bagunçado caindo sobre o olho direito
      return (
        <g>
          <path d="M-98,-720 Q-100,-790 -80,-800 L-80,-720 Z M98,-720 Q100,-790 80,-800 L80,-720 Z" fill={hs} opacity={0.9} />
          <Fill col={h} d={`M-92,-756 Q-100,-842 -10,-850 Q70,-858 98,-790 Q102,-760 94,-742 L82,-772 L70,-746 Q${50 + fx * 0.5},-770 ${30 + fx * 0.5},-740 L${18 + fx * 0.5},-764 Q${0 + fx * 0.5},-750 ${-30 + fx * 0.4},-770 L-56,-752 L-70,-776 Z`} />
          <Fill col={h} d={`M${28 + fx * 0.5},-800 C${80 + fx * 0.5},-790 ${74 + fx * 0.5},-736 ${58 + fx * 0.6},-712 C${50 + fx * 0.6},-744 ${36 + fx * 0.5},-764 ${8 + fx * 0.5},-776 Z`} />
          <path d="M-60,-826 q30,-16 60,-8 M10,-834 q30,-6 52,10" stroke={hs} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'wavy':
      // HELENA: risca no meio, ondas emoldurando o rosto, mecha grisalha
      return (
        <g>
          <Fill col={h} d={`M-104,-660 Q-120,-760 -90,-806 Q-40,-846 0,-834 Q40,-846 90,-806 Q120,-760 104,-660 Q96,-700 84,-730 Q70,-790 ${10 + fx * 0.3},-800 Q${-10 + fx * 0.3},-790 -30,-790 Q-70,-786 -84,-730 Q-96,-700 -104,-660 Z`} />
          <path d={`M${-30 + fx * 0.3},-822 Q-70,-800 -88,-740`} stroke="#B9B4BD" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M60,-806 q20,30 28,70 M-60,-806 q-20,30 -28,70" stroke={hs} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'slick':
      // CIRO: penteado para trás, risca lateral, loiro-prateado
      return (
        <g>
          <Fill col={h} d="M-98,-724 Q-108,-830 -10,-846 Q86,-850 100,-760 Q102,-740 96,-722 Q90,-780 40,-796 Q-20,-806 -60,-786 Q-90,-770 -98,-724 Z" />
          <path d="M-62,-808 Q-10,-838 60,-814 M-40,-826 Q10,-846 76,-800 M-74,-790 Q-20,-818 40,-806" stroke={hs} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'bun':
      return <Fill col={h} d={`M-100,-708 Q-106,-836 0,-830 Q104,-834 100,-708 Q94,-772 66,-790 Q${10 + fx},-800 ${-40 + fx * 0.6},-800 Q-84,-786 -100,-708 Z`} />;
    case 'ponytail':
      return <Fill col={h} d={`M-100,-700 Q-108,-836 0,-830 Q104,-834 100,-706 Q94,-770 66,-790 Q${10 + fx},-800 ${-40 + fx * 0.6},-800 Q-84,-786 -100,-700 Z`} />;
    case 'cap':
      return (
        <g>
          <Fill col={look.capColor ?? '#2B2F3A'} d="M-98,-736 Q-100,-850 0,-852 Q100,-850 98,-736 Z" />
          <Fill col={look.capColor ?? '#2B2F3A'} d="M-70,-744 Q0,-770 110,-740 Q118,-726 100,-722 Q0,-744 -70,-730 Z" />
        </g>
      );
    default:
      return <Fill col={h} d={`M-98,-712 Q-104,-840 0,-832 Q104,-838 98,-712 Q92,-770 70,-786 Q${20 + fx},-778 ${-20 + fx},-790 Q-70,-784 -98,-712 Z`} />;
  }
};

/* ================================ CORPO ================================ */
const handRotFront = (s: number, a2: number) => (-s * a2) / D2R;

const ArmFront: React.FC<{side: 1 | -1; sh: number; el: number; look: Look; hand: HandShape; handRot?: number; prop?: React.ReactNode; fs?: number; band?: number; bandGlow?: number; t: number}> =
  ({side, sh, el, look, hand, handRot, prop, fs = 1, band, bandGlow = 0, t}) => {
  const s = side, sx = side * SHX, sy = SHY;
  const a1 = sh * D2R, a2 = (sh - el) * D2R;
  const ex = sx + s * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
  const hx = ex + s * Math.sin(a2) * L2 * fs, hy = ey + Math.cos(a2) * L2 * fs;
  const long = look.top && look.top !== 'gown' && look.top !== 'none';
  const sleeve = long ? (look.topColor ?? look.shirt) : look.shirt;
  const sleeveEnd = long ? 0.82 : 0;
  const mx = sx + s * Math.sin(a1) * L1 * 0.45, my = sy + Math.cos(a1) * L1 * 0.45;
  const wx = lerp(ex, hx, 0.8), wy = lerp(ey, hy, 0.8);
  const puff = look.top === 'puffer';
  return (
    <g>
      <Stroke d={`M${sx},${sy} L${ex},${ey} L${hx},${hy}`} w={28} col={look.skin} />
      {long ? <Stroke d={`M${sx},${sy} L${ex},${ey} L${lerp(ex, hx, sleeveEnd)},${lerp(ey, hy, sleeveEnd)}`} w={puff ? 50 : 40} col={sleeve} />
        : <Stroke d={`M${sx},${sy} L${mx},${my}`} w={46} col={sleeve} />}
      {puff && <path d={`M${lerp(sx, ex, 0.5) - 18},${lerp(sy, ey, 0.5)} l36,0 M${lerp(ex, hx, 0.4) - 18},${lerp(ey, hy, 0.4)} l36,0`} stroke={look.topShade} strokeWidth={4} />}
      {band !== undefined && side === 1 && <g transform={`translate(${wx},${wy}) rotate(${handRotFront(s, a2)})`}><LifeBand frac={band} glow={bandGlow} t={t} /></g>}
      <Hand x={hx} y={hy} rot={handRot ?? handRotFront(s, a2)} shape={hand} skin={look.skin} mirror={-s} />
      {prop && <g transform={`translate(${hx},${hy})`}>{prop}</g>}
    </g>
  );
};

const LegFront: React.FC<{hx: number; lift: number; side: 1 | -1; look: Look}> = ({hx, lift, side, look}) => {
  const footY = -lift, kneeY = lerp(-360, footY, 0.5) - lift * 0.15, kneeX = hx + side * (6 + lift * 0.25), fx = hx + side * 8;
  return (
    <g>
      <Stroke d={`M${hx},-360 L${kneeX},${kneeY} L${fx},${footY - 22}`} w={50} col={look.pants} />
      <Fill col={look.shoe} d={`M${fx - 32},${footY - 2} Q${fx - 32},${footY - 40} ${fx},${footY - 40} Q${fx + 36},${footY - 38} ${fx + 40},${footY - 4} Z`} />
      <rect x={fx - 34} y={footY - 10} width={76} height={12} rx={6} fill={look.sole} stroke={OL} strokeWidth={5} />
    </g>
  );
};

const TorsoFront: React.FC<{look: Look; br: number}> = ({look, br}) => {
  const b = look.build ?? 1, w = 74 * b, top = -600 + br * 0.4;
  const shirtD = `M${-w},${top} Q${-w - 10},-520 ${-w + 8},-352 L${w - 8},-352 Q${w + 10},-520 ${w},${top} Q0,${top - 18} ${-w},${top} Z`;
  const tc = look.topColor ?? look.shirt, ts = look.topShade ?? look.shirtShade;
  return (
    <g>
      <Fill col={look.shirt} d={shirtD} />
      <path d={`M18,${top - 4} Q${w + 6},-590 ${w + 4},-520 Q${w},-430 ${w - 8},-352 L40,-352 Q52,-480 18,${top - 4} Z`} fill={look.shirtShade} opacity={0.55} />
      {look.top === 'gown' && [[-40, -540], [10, -500], [-20, -440], [40, -460], [30, -560], [-50, -400]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={look.shirtShade} />)}
      {look.top === 'puffer' && (
        <g>
          {/* jaqueta puffer cropped aberta */}
          <Fill col={tc} d={`M${-w - 6},${top - 4} Q${-w - 18},-520 ${-w - 4},-440 L-22,-436 L-28,${top + 6} Q-50,${top - 14} ${-w - 6},${top - 4} Z`} />
          <Fill col={tc} d={`M${w + 6},${top - 4} Q${w + 18},-520 ${w + 4},-440 L22,-436 L28,${top + 6} Q50,${top - 14} ${w + 6},${top - 4} Z`} />
          <path d={`M${-w - 10},-540 L-26,-536 M${-w - 8},-486 L-24,-484 M${w + 10},-540 L26,-536 M${w + 8},-486 L24,-484`} stroke={ts} strokeWidth={5} />
          <Fill col={tc} d={`M-46,${top - 10} Q0,${top - 34} 46,${top - 10} L40,${top + 10} Q0,${top - 8} -40,${top + 10} Z`} />
        </g>
      )}
      {look.top === 'coat' && (
        <g>
          <Fill col={tc} d={`M${-w - 8},${top - 4} Q${-w - 20},-460 ${-w - 22},-200 L-40,-200 L-24,${top + 4} Z`} />
          <Fill col={tc} d={`M${w + 8},${top - 4} Q${w + 20},-460 ${w + 22},-200 L40,-200 L24,${top + 4} Z`} />
          <Fill col={ts} d={`M-24,${top + 4} L-58,${top + 4} L-34,-500 Z`} />
          <Fill col={ts} d={`M24,${top + 4} L58,${top + 4} L34,-500 Z`} />
          {/* capuz do moletom atrás do pescoço */}
          <Fill col={look.shirtShade} d={`M-50,${top - 6} Q0,${top - 46} 50,${top - 6} Q0,${top - 20} -50,${top - 6} Z`} />
        </g>
      )}
      {(look.top === 'suit' || look.top === 'blazer') && (
        <g>
          <Fill col={tc} d={`M${-w - 6},${top - 4} Q${-w - 14},-480 ${-w - 6},-330 L-4,-330 L-6,-470 L-30,${top + 2} Z`} />
          <Fill col={tc} d={`M${w + 6},${top - 4} Q${w + 14},-480 ${w + 6},-330 L4,-330 L6,-470 L30,${top + 2} Z`} />
          <Fill col={ts} d={`M-30,${top + 2} L-58,${top + 8} L-10,-500 Z`} />
          <Fill col={ts} d={`M30,${top + 2} L58,${top + 8} L10,-500 Z`} />
          {look.trim && <path d={`M-30,${top + 2} L-6,-470 M30,${top + 2} L6,-470`} stroke={look.trim} strokeWidth={6} />}
          {look.tie && <Fill col={look.tie} d={`M-9,${top + 6} L9,${top + 6} L13,-470 L0,-450 L-13,-470 Z`} w={5} />}
          {look.pin && <g transform="translate(-48,-540)"><circle r={11} fill={look.pin} stroke={OL} strokeWidth={4} /><path d="M-5,-6 L5,-6 L-5,6 L5,6 Z" fill="none" stroke={OL} strokeWidth={2.5} /></g>}
        </g>
      )}
      {look.top === 'hoodie' && <Fill col={look.shirtShade} d={`M-56,${top - 6} Q0,${top - 40} 56,${top - 6} Q0,${top + 14} -56,${top - 6} Z`} />}
      {look.bag && <><path d={`M-50,${top} L-58,-430 M50,${top} L58,-430`} stroke="#1E1B26" strokeWidth={14} strokeLinecap="round" /><path d={`M-50,${top} L-58,-430 M50,${top} L58,-430`} stroke={C.red} strokeWidth={6} strokeLinecap="round" /></>}
      {look.locket && <g><path d={`M-30,${top + 2} Q0,-548 30,${top + 2}`} stroke={C.goldDeep} strokeWidth={3} fill="none" /><g transform="translate(0,-546)"><circle r={13} fill={C.gold} stroke={OL} strokeWidth={4} /><path d="M-5,-6 L5,-6 L-5,6 L5,6 Z" fill="none" stroke={OL} strokeWidth={2.5} /></g></g>}
      <rect x={-68 * b} y={-372} width={136 * b} height={30} rx={10} fill={look.pants} stroke={OL} strokeWidth={5} />
    </g>
  );
};

/* ============================== PERSONAGEM ============================== */
export const Toon: React.FC<ToonProps> = (p) => {
  if (p.facing === 'side') return <ToonSide {...p} />;
  const {t, look, pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8}, expr = 'neutral', lookX = 0, lookY = 0, talk = 0, vis = 'A', run = 0,
    phone = 'none', phoneGlow, band, bandGlow = 0, tremble = 0, x = 0, y = 0, scale = 1, seed = 2, noLegs = false, holdR, holdL, faceLight} = p;
  const br = Math.sin(t * 2.1) * 4;
  const cyc = t * 15;
  const liftL = run * Math.max(0, Math.sin(cyc)) * 120, liftR = run * Math.max(0, Math.sin(cyc + Math.PI)) * 120;
  const bob = run * Math.abs(Math.sin(cyc)) * -18;
  const tr = tremble ? Math.sin(t * 55) * 3 * tremble : 0;
  const fx = lookX * 22;
  const head = (pose.head ?? 0) + talk * Math.sin(t * 11) * 1.5;
  const sway = Math.sin(t * 2.3) * 5 - lookX * 10;
  let ps = pose;
  if (phone === 'ear' && !pose.lT) ps = {...pose, lT: {x: 96, y: -700}, lHand: 'grip'};
  const R = ps.rT ? armIK(-1, ps.rT.x, ps.rT.y, ps.rFs ?? 1) : [ps.rSh, ps.rEl];
  const L = ps.lT ? armIK(1, ps.lT.x, ps.lT.y, ps.lFs ?? 1) : [ps.lSh, ps.lEl];
  const ph = <PhoneProp glow={phoneGlow} />;
  return (
    <g transform={`translate(${x + tr},${y + bob}) scale(${scale})`}>
      {!noLegs && <ellipse cx={0} cy={4} rx={115} ry={18} fill="#000" opacity={0.35} />}
      <g transform={`rotate(${ps.lean ?? 0}, 0, -360)`}>
        <g transform={`rotate(${head * 0.5}, 0, -620)`}><HairBack look={look} t={t} sway={sway} /></g>
      </g>
      {!noLegs && <><LegFront hx={-32} lift={liftR} side={-1} look={look} /><LegFront hx={32} lift={liftL} side={1} look={look} /></>}
      <g transform={`rotate(${ps.lean ?? 0}, 0, -360) translate(0, ${br * 0.3})`}>
        <TorsoFront look={look} br={br} />
        <Stroke d="M0,-640 L0,-596" w={36} col={look.skin} />
        <g transform={`rotate(${head}, 0, -620) translate(0, ${br * 0.2})`}>
          {/* orelhas */}
          {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 92 + fx * 0.3} cy={-718} rx={15} ry={21} fill={look.skin} stroke={OL} strokeWidth={OW} />)}
          {look.hoops && [-1, 1].map((sd) => <circle key={`h${sd}`} cx={sd * 94 + fx * 0.3} cy={-680} r={15} fill="none" stroke={look.hoops} strokeWidth={5} />)}
          {look.earcuff && <path d={`M${88 + fx * 0.3},-736 a8,10 0 0,1 10,14`} stroke="#C9CED8" strokeWidth={5} fill="none" />}
          <ellipse cx={0} cy={-722} rx={92} ry={102} fill={look.skin} stroke={OL} strokeWidth={OW} />
          <path d={`M60,-800 Q96,-760 86,-680 Q70,-640 40,-626 Q74,-690 60,-800 Z`} fill={look.skinShade} opacity={0.45} />
          {look.stubble && <path d="M-74,-690 Q-66,-620 0,-622 Q66,-620 74,-690 Q60,-646 0,-646 Q-60,-646 -74,-690 Z" fill={look.stubble} opacity={0.45} />}
          <FaceFront look={look} expr={expr} t={t} lookX={lookX} lookY={lookY} talk={talk} vis={vis} seed={seed} />
          <HairFront look={look} fx={fx} t={t} />
          {faceLight && <ellipse cx={0} cy={-700} rx={92} ry={96} fill={faceLight} opacity={0.13} />}
        </g>
        <ArmFront side={-1} sh={R[0]} el={R[1]} look={look} hand={ps.rHand ?? (phone === 'R' ? 'grip' : 'relaxed')} handRot={ps.rHandRot} fs={ps.rFs} prop={phone === 'R' ? ph : holdR} t={t} />
        <ArmFront side={1} sh={L[0]} el={L[1]} look={look} hand={ps.lHand ?? (phone === 'L' || phone === 'ear' ? 'grip' : 'relaxed')} handRot={ps.lHandRot} fs={ps.lFs}
          prop={phone === 'L' || phone === 'ear' ? <g transform={phone === 'ear' ? 'rotate(170)' : ''}>{ph}</g> : holdL} band={band} bandGlow={bandGlow} t={t} />
      </g>
    </g>
  );
};

/* ============================== VISTA LATERAL ============================== */
const ToonSide: React.FC<ToonProps> = ({t, look, expr = 'neutral', lookY = 0, talk = 0, vis = 'A', walk = 0, run = 0, dir = 1, phone = 'none', phoneGlow, tremble = 0, x = 0, y = 0, scale = 1, seed = 2, band, bandGlow = 0, pose, nArm}) => {
  const speed = run > 0 ? 11 : 7;
  const amt = Math.max(walk, run);
  const ph = t * speed * (amt > 0 ? 1 : 0);
  const sw = amt > 0 ? Math.sin(ph) : 0;
  const reach = run > 0 ? 44 : 26;
  const legA = sw * reach, legB = -legA;
  const kneeA = amt > 0 ? Math.max(0, Math.cos(ph)) * (run > 0 ? 70 : 34) : 0, kneeB = amt > 0 ? Math.max(0, -Math.cos(ph)) * (run > 0 ? 70 : 34) : 0;
  const bob = amt > 0 ? -Math.abs(Math.cos(ph)) * (run > 0 ? 22 : 8) : 0;
  const lean = (pose?.lean ?? 0) + (run > 0 ? 12 : 0);
  const tr = tremble ? Math.sin(t * 55) * 3 * tremble : 0;
  const br = Math.sin(t * 2.1) * 3;
  const E = EXPR[expr];
  const bl = blink(t, seed);
  const eyeH = 17 * E.eye * (1 - bl * 0.92);
  const armSw = run > 0 ? 60 : 24;
  const nSh = nArm ? nArm[0] : phone !== 'none' ? 40 : -sw * armSw + 6, nEl = nArm ? nArm[1] : phone !== 'none' ? 110 : run > 0 ? 90 : 18;
  const fSh = sw * armSw + 6, fEl = run > 0 ? 90 : 18;
  const tc = look.top && look.top !== 'none' && look.top !== 'gown' ? (look.topColor ?? look.shirt) : look.shirt;
  const leg = (ang: number, knee: number, near: boolean) => {
    const a = ang * D2R, b = (ang - knee) * D2R;
    const kx = Math.sin(a) * 180, ky = -360 + Math.cos(a) * 180;
    const fx = kx + Math.sin(b) * 170, fy = ky + Math.cos(b) * 170;
    return (
      <g>
        <Stroke d={`M0,-360 L${kx},${ky} L${fx},${fy}`} w={46} col={near ? look.pants : '#191A22'} />
        <Fill col={look.shoe} d={`M${fx - 26},${fy + 18} Q${fx - 26},${fy - 14} ${fx + 6},${fy - 14} Q${fx + 50},${fy - 8} ${fx + 54},${fy + 18} Z`} />
        <rect x={fx - 28} y={fy + 12} width={84} height={11} rx={5} fill={look.sole} stroke={OL} strokeWidth={4} />
      </g>
    );
  };
  const arm = (sh: number, el: number, near: boolean) => {
    const a1 = sh * D2R, a2 = (sh + el) * D2R;
    const ex = Math.sin(a1) * L1, ey = SHY + Math.cos(a1) * L1;
    const hx = ex + Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
    const long = tc !== look.shirt;
    return (
      <g>
        <Stroke d={`M0,${SHY} L${ex},${ey} L${hx},${hy}`} w={26} col={near ? look.skin : look.skinShade} />
        <Stroke d={long ? `M0,${SHY} L${ex},${ey} L${lerp(ex, hx, 0.8)},${lerp(ey, hy, 0.8)}` : `M0,${SHY} L${Math.sin(a1) * L1 * 0.42},${SHY + Math.cos(a1) * L1 * 0.42}`} w={look.top === 'puffer' ? 48 : 40} col={near ? tc : (look.topShade ?? look.shirtShade)} />
        {near && band !== undefined && <g transform={`translate(${lerp(ex, hx, 0.82)},${lerp(ey, hy, 0.82)}) rotate(${-a2 / D2R + 90})`}><LifeBand frac={band} glow={bandGlow} t={t} /></g>}
        <Hand x={hx} y={hy} rot={-a2 / D2R} shape={run > 0 ? 'fist' : 'relaxed'} skin={near ? look.skin : look.skinShade} />
        {near && phone !== 'none' && <g transform={`translate(${hx + 10},${hy - 20}) rotate(${-a2 / D2R - 160})`}><PhoneProp glow={phoneGlow} /></g>}
      </g>
    );
  };
  const mx = 72, my = -662 + lookY * 6;
  const hairSide = () => {
    switch (look.hairStyle) {
      case 'puff':
        return (
          <g>
            {[[-10, -862, 64], [-58, -838, 44], [36, -846, 42], [-30, -900, 38], [14, -902, 36], [-80, -790, 30]].map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r} fill={look.hair} stroke={OL} strokeWidth={OW} />)}
            {[[-10, -862, 64], [-58, -838, 44], [36, -846, 42], [-30, -900, 38], [14, -902, 36], [-80, -790, 30]].map(([px, py, r], i) => <circle key={`i${i}`} cx={px} cy={py} r={r - OW / 2} fill={look.hair} />)}
            <Fill col={look.hair} d="M-92,-700 Q-104,-820 4,-818 Q90,-822 98,-764 Q60,-788 20,-784 Q-40,-778 -60,-700 Z" />
            {look.streak && <Fill col={look.streak} d="M60,-790 C96,-770 92,-736 84,-716 C78,-740 66,-760 40,-776 Z" />}
          </g>
        );
      case 'cap':
        return <g><Fill col={look.capColor ?? '#2B2F3A'} d="M-92,-730 Q-100,-852 4,-852 Q96,-850 98,-736 Z" /><Fill col={look.capColor ?? '#2B2F3A'} d="M60,-744 L150,-738 Q156,-726 140,-722 L60,-728 Z" /></g>;
      case 'ponytail':
        return <g><g transform={`rotate(${-sw * 10 - 4}, -70, -790)`}><Fill col={look.hair} d="M-74,-800 C-150,-790 -176,-700 -150,-610 C-140,-680 -112,-740 -64,-764 Z" /></g><Fill col={look.hair} d="M-90,-690 Q-104,-830 4,-826 Q90,-830 98,-760 Q60,-790 20,-786 Q-40,-780 -60,-700 Q-70,-660 -90,-660 Z" /></g>;
      case 'bun':
        return <g><Fill col={look.hair} d="M-118,-800 a34,30 0 1,1 68,0 a34,30 0 1,1 -68,0" /><Fill col={look.hair} d="M-90,-690 Q-104,-830 4,-826 Q90,-830 98,-760 Q60,-790 20,-786 Q-40,-780 -60,-700 Q-70,-660 -90,-660 Z" /></g>;
      default:
        return <Fill col={look.hair} d="M-90,-700 Q-100,-834 4,-828 Q94,-832 98,-756 Q56,-786 20,-780 Q-40,-774 -64,-710 Q-74,-680 -90,-680 Z" />;
    }
  };
  return (
    <g transform={`translate(${x + tr},${y + bob}) scale(${dir * scale},${scale})`}>
      <ellipse cx={0} cy={4} rx={95} ry={14} fill="#000" opacity={0.3} />
      {arm(fSh, fEl, false)}
      {leg(legB, kneeB, false)}
      {leg(legA, kneeA, true)}
      <g transform={`rotate(${lean}, 0, -360) translate(0, ${br * 0.3})`}>
        <Fill col={look.shirt} d="M-50,-600 Q-62,-480 -52,-352 L52,-352 Q66,-470 50,-600 Q0,-616 -50,-600 Z" />
        {tc !== look.shirt && <Fill col={tc} d={`M-56,-604 Q-70,-480 -58,${look.top === 'coat' ? -200 : look.top === 'puffer' ? -440 : -340} L${look.top === 'coat' ? 30 : 20},${look.top === 'coat' ? -200 : look.top === 'puffer' ? -440 : -340} L24,-604 Q-10,-616 -56,-604 Z`} />}
        {look.bag && <Fill col="#1E1B26" d="M-150,-600 L-56,-600 L-56,-420 L-150,-420 Z" />}
        {look.bag && <rect x={-140} y={-570} width={74} height={18} fill={C.red} stroke={OL} strokeWidth={4} />}
        <rect x={-54} y={-372} width={108} height={30} rx={10} fill={look.pants} stroke={OL} strokeWidth={5} />
        <Stroke d="M2,-640 L2,-596" w={36} col={look.skin} />
        <g transform={`rotate(${lookY * 10}, 0, -640)`}>
          <ellipse cx={4} cy={-722} rx={92} ry={100} fill={look.skin} stroke={OL} strokeWidth={OW} />
          <path d="M90,-724 Q114,-700 92,-688" fill={look.skin} stroke={OL} strokeWidth={5} />
          {look.stubble && <path d="M10,-640 Q60,-628 86,-670 L86,-640 Q50,-612 10,-622 Z" fill={look.stubble} opacity={0.45} />}
          {hairSide()}
          <ellipse cx={-10} cy={-716} rx={15} ry={21} fill={look.skin} stroke={OL} strokeWidth={OW} />
          {look.hoops && <circle cx={-10} cy={-680} r={14} fill="none" stroke={look.hoops} strokeWidth={5} />}
          <line x1={38} y1={-768 + E.browY + E.brow * 0.4} x2={74} y2={-768 + E.browY - E.brow * 0.4} stroke={look.hairShade} strokeWidth={look.brow ?? (look.female ? 7 : 10)} strokeLinecap="round" />
          <ellipse cx={58} cy={-726} rx={14} ry={Math.max(1.5, eyeH)} fill="#fff" stroke={OL} strokeWidth={4} />
          {eyeH > 4 && <circle cx={65} cy={-723 + lookY * 5} r={Math.min(8 * E.pup, eyeH)} fill="#0C0A10" />}
          {look.female && eyeH > 4 && <path d={`M70,${-726 - eyeH * 0.8} l12,-6`} stroke={OL} strokeWidth={4} strokeLinecap="round" />}
          <Mouth expr={expr} talk={talk} vis={vis} mx={mx} my={my} look={look} s={0.8} />
        </g>
        {arm(nSh, nEl, true)}
      </g>
    </g>
  );
};

/** variação de figurante determinística (cor de pele, cabelo e roupa) */
export const extraLook = (seed: number, base: Partial<Look> = {}): Look => {
  const skins = [['#F1C7A5', '#D9A784'], ['#C98E66', '#A9714E'], ['#8D5A3B', '#6E432B'], ['#E8B48F', '#C99370'], ['#5E3B27', '#47291A']];
  const hairs = [['#1B1714', '#0E0B09'], ['#4A2E1F', '#341F14'], ['#C9A15B', '#A47F3F'], ['#2A2A33', '#191920']];
  const tops = ['#3D4A6B', '#6B3D5A', '#2F6B5E', '#7A5A2E', '#4E4E5E', '#5A3D7A'];
  const styles: Look['hairStyle'][] = ['short', 'bun', 'ponytail', 'cap', 'short'];
  const r = (k: string) => rnd(`${seed}${k}`);
  const [sk, ss] = skins[Math.floor(r('s') * skins.length)];
  const [hc, hs] = hairs[Math.floor(r('h') * hairs.length)];
  const st = styles[Math.floor(r('st') * styles.length)];
  return {
    name: 'extra', skin: sk, skinShade: ss, hair: hc, hairShade: hs, hairStyle: st, female: st === 'bun' || st === 'ponytail',
    shirt: tops[Math.floor(r('t') * tops.length)], shirtShade: '#2A2A36', top: r('j') < 0.4 ? 'hoodie' : 'none',
    pants: '#23263A', shoe: '#1A1B22', sole: '#C9CDD8', capColor: tops[Math.floor(r('c') * tops.length)], ...base,
  };
};
