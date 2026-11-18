import React from 'react';
import {blink, lerp} from '../lib/anim';

/**
 * PERSON — esqueleto 2D compartilhado por todos os personagens em close (Bia, homem de blusa azul…).
 * Coordenadas locais: origem no chão entre os pés, Y para cima negativo. Altura ~840.
 * Vistas: 'front' | 'back' | 'side' (dir = 1 olha para a direita, -1 para a esquerda).
 */
export type Expr = 'neutral' | 'surprised' | 'fear' | 'suspicious' | 'determined' | 'shock' | 'worried' | 'confused';
export type HandShape = 'relaxed' | 'open' | 'point' | 'fist' | 'grip';

export type Pose = {
  // vista frontal/costas: ombro a partir de "para baixo", positivo = para fora; cotovelo positivo = antebraço para dentro/cima
  rSh: number; rEl: number; lSh: number; lEl: number;
  lean?: number;
  rT?: {x: number; y: number}; // alvo da mão (IK) em coordenadas locais
  lT?: {x: number; y: number};
  rHand?: HandShape; lHand?: HandShape;
  rHandRot?: number; lHandRot?: number; // rotação manual da mão (graus; 180 = dedos para cima)
  rFs?: number; lFs?: number; // escorço do antebraço (0.4..1): antebraço apontando para a câmera fica mais curto
  // vista lateral: braço próximo (n) e distante (f), positivo = para frente
  nSh?: number; nEl?: number; fSh?: number; fEl?: number;
  nHand?: HandShape; fHand?: HandShape;
};

export type Look = {
  skin: string; skinShade: string; hair: string; hairStyle: 'ponytail' | 'short';
  shirt: string; shirtShade: string; stripe?: string; longSleeves?: boolean;
  pants: string; shoe: string; sole: string; brow?: number; stubble?: string;
  badge?: string; // crachá no peito (texto)
};

const D2R = Math.PI / 180;
const L1 = 150, L2 = 138, SHX = 70, SHY = -582;
const HAND = 1.3;

export const armIK = (side: 1 | -1, tx: number, ty: number, fs = 1): [number, number] => {
  const sx = side * SHX, sy = SHY, L2 = 138 * fs;
  const dx = tx - sx, dy = ty - sy;
  const d = Math.min(L1 + L2 - 1, Math.max(20, Math.hypot(dx, dy)));
  const th = Math.atan2(side * dx, dy);
  const a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const b = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2))));
  // duas soluções possíveis: escolhe a que deixa o cotovelo mais para FORA do corpo
  const cand = [th + a, th - a].map((sh) => {
    const ex = sx + side * Math.sin(sh) * L1;
    return {sh, out: side * ex};
  });
  const best = cand[0].out >= cand[1].out ? cand[0] : cand[1];
  const el = 180 - (b * 180) / Math.PI;
  return [(best.sh * 180) / Math.PI, best === cand[0] ? el : -el];
};

/** Mão desenhada apontando ao longo de +Y local; rot em graus SVG */
export const Hand: React.FC<{x: number; y: number; rot: number; shape: HandShape; skin: string; shade: string; mirror?: number; size?: number}> = ({x, y, rot, shape, skin, shade, mirror = 1, size = 1}) => {
  const f = (ang: number, len: number, w = 10) => {
    const a = ang * D2R;
    return <line x1={0} y1={6} x2={Math.sin(a) * len * mirror} y2={6 + Math.cos(a) * len} stroke={skin} strokeWidth={w} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${size})`}>
      {shape === 'open' && <>{f(-28, 26)}{f(-9, 30)}{f(9, 29)}{f(26, 24)}{f(-75, 20, 9)}</>}
      {shape === 'point' && <>{f(0, 34)}<circle cx={8 * mirror} cy={14} r={9} fill={skin} />{f(-70, 15, 9)}</>}
      {shape === 'relaxed' && <>{f(-12, 20)}{f(8, 21)}{f(-60, 14, 9)}</>}
      <ellipse cx={0} cy={2} rx={shape === 'fist' || shape === 'grip' ? 17 : 15} ry={shape === 'fist' || shape === 'grip' ? 17 : 18} fill={skin} />
      {(shape === 'fist' || shape === 'grip') && <path d={`M${-10},10 Q0,16 10,10`} stroke={shade} strokeWidth={3} fill="none" />}
    </g>
  );
};

const handRotFront = (s: number, a2: number) => (-s * a2) / D2R;

type ArmProps = {side: 1 | -1; sh: number; el: number; look: Look; hand: HandShape; handRot?: number; prop?: React.ReactNode; dim?: boolean; fs?: number};
const ArmFront: React.FC<ArmProps> = ({side, sh, el, look, hand, handRot, prop, dim, fs = 1}) => {
  const s = side, sx = side * SHX, sy = SHY;
  const a1 = sh * D2R, a2 = (sh - el) * D2R;
  const ex = sx + s * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
  const hx = ex + s * Math.sin(a2) * L2 * fs, hy = ey + Math.cos(a2) * L2 * fs;
  const sl = look.longSleeves ? 1 : 62 / L1;
  const mx = sx + s * Math.sin(a1) * L1 * sl, my = sy + Math.cos(a1) * L1 * sl;
  const skin = dim ? look.skinShade : look.skin;
  return (
    <g>
      <path d={`M${sx},${sy} L${ex},${ey} L${hx},${hy}`} stroke={skin} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {look.longSleeves ? (
        <path d={`M${sx},${sy} L${ex},${ey} L${lerp(ex, hx, 0.8)},${lerp(ey, hy, 0.8)}`} stroke={look.shirt} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ) : (
        <path d={`M${sx},${sy} L${mx},${my}`} stroke={look.shirt} strokeWidth={46} strokeLinecap="round" />
      )}
      <Hand x={hx} y={hy} rot={handRot ?? handRotFront(s, a2)} shape={hand} skin={skin} shade={look.skinShade} mirror={-s} size={HAND} />
      {prop && <g transform={`translate(${hx},${hy})`}>{prop}</g>}
    </g>
  );
};

/** celular visto por trás (Bia segurando) */
export const PhoneProp: React.FC<{lit?: boolean; rot?: number}> = ({rot = 0}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-32} y={-62} width={64} height={118} rx={12} fill="#0d0f16" stroke="#2b3142" strokeWidth={4} />
    <circle cx={-15} cy={-46} r={5} fill="#1f2433" />
  </g>
);

const Leg: React.FC<{hx: number; hy: number; lift: number; side: 1 | -1; look: Look}> = ({hx, hy, lift, side, look}) => {
  const footY = -lift;
  const kneeY = lerp(hy, footY, 0.5) - lift * 0.15;
  const kneeX = hx + side * (6 + lift * 0.25);
  const fx = hx + side * 8;
  return (
    <g>
      <path d={`M${hx},${hy} L${kneeX},${kneeY} L${fx},${footY - 22}`} stroke={look.pants} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${fx - 30},${footY - 4} Q${fx - 30},${footY - 38} ${fx},${footY - 38} Q${fx + 34},${footY - 36} ${fx + 38},${footY - 6} Z`} fill={look.shoe} />
      <rect x={fx - 32} y={footY - 8} width={72} height={10} rx={5} fill={look.sole} />
    </g>
  );
};

export type PersonProps = {
  t: number; look: Look; pose?: Pose; expr?: Expr;
  lookX?: number; lookY?: number; mouth?: number; run?: number; walk?: number; // walk: velocidade do ciclo de passos (vista lateral)
  facing?: 'front' | 'back' | 'side'; dir?: 1 | -1;
  phone?: 'none' | 'L' | 'R' | 'both'; phoneLit?: boolean; pupil?: number; tremble?: number;
  x?: number; y?: number; scale?: number; seed?: number;
  holdR?: React.ReactNode; holdL?: React.ReactNode; // objeto preso à mão (chaveiro, chave…)
};

const EXPR: Record<Expr, {brow: number; browY: number; eye: number; pup: number}> = {
  neutral: {brow: 0, browY: 0, eye: 1, pup: 1},
  surprised: {brow: -6, browY: -14, eye: 1.25, pup: 0.85},
  shock: {brow: -10, browY: -20, eye: 1.35, pup: 0.6},
  fear: {brow: -18, browY: -10, eye: 1.15, pup: 0.7},
  worried: {brow: -14, browY: -6, eye: 1.05, pup: 0.9},
  suspicious: {brow: 12, browY: 4, eye: 0.9, pup: 1},
  determined: {brow: 16, browY: 6, eye: 0.95, pup: 1},
  confused: {brow: 0, browY: -4, eye: 1.05, pup: 0.95},
};

export const Person: React.FC<PersonProps> = (p) => {
  const {t, look, pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8}, expr = 'neutral', lookX = 0, lookY = 0, mouth = 0, run = 0,
    facing = 'front', dir = 1, phone = 'none', phoneLit = false, pupil = 1, tremble = 0, x = 0, y = 0, scale = 1, seed = 2, holdR, holdL} = p;
  if (facing === 'side') return <PersonSide {...p} />;
  const back = facing === 'back';
  const breathe = Math.sin(t * 2.1) * 4;
  const cyc = t * 15;
  const liftL = run * Math.max(0, Math.sin(cyc)) * 120;
  const liftR = run * Math.max(0, Math.sin(cyc + Math.PI)) * 120;
  const bob = run * Math.abs(Math.sin(cyc)) * -18;
  const tr = tremble ? Math.sin(t * 55) * 3 * tremble : 0;
  const sway = 22 + Math.sin(t * 2.3) * 5 + run * Math.sin(cyc * 2) * 14 - lookX * 10;
  const E = EXPR[expr];
  const bl = Math.max(blink(t, seed), expr === 'suspicious' ? 0.35 : 0);
  const fx = lookX * 24, fy = lookY * 12;
  const eyeH = 19 * E.eye * (1 - bl * 0.92);
  const pr = 9 * E.pup * pupil;
  const ponytailOn = look.hairStyle === 'ponytail';

  // celular com as duas mãos: IK automático para o centro do peito
  let ps: Pose = pose;
  if (phone === 'both' && !pose.rT && !pose.lT) ps = {...pose, rT: {x: -36, y: -462}, lT: {x: 36, y: -462}, rFs: 0.55, lFs: 0.55, rHand: 'grip', lHand: 'grip'};
  const R = ps.rT ? armIK(-1, ps.rT.x, ps.rT.y, ps.rFs ?? 1) : [ps.rSh, ps.rEl];
  const L = ps.lT ? armIK(1, ps.lT.x, ps.lT.y, ps.lFs ?? 1) : [ps.lSh, ps.lEl];
  const arms = (
    <>
      <ArmFront side={-1} sh={R[0]} el={R[1]} look={look} hand={ps.rHand ?? (phone === 'R' ? 'grip' : 'relaxed')} handRot={ps.rHandRot} fs={ps.rFs} prop={phone === 'R' && !back ? <PhoneProp /> : holdR} dim={back} />
      <ArmFront side={1} sh={L[0]} el={L[1]} look={look} hand={ps.lHand ?? (phone === 'L' ? 'grip' : 'relaxed')} handRot={ps.lHandRot} fs={ps.lFs} prop={phone === 'L' && !back ? <PhoneProp /> : holdL} dim={back} />
    </>
  );

  const mouthEl = (() => {
    const mx = fx * 0.9, my = -664 + fy * 0.6;
    const ink = '#3a1418';
    if (mouth > 0.08) { const m = Math.min(0.55, mouth); return <ellipse cx={mx} cy={my} rx={12 + m * 5} ry={4 + m * 13} fill={ink} />; }
    switch (expr) {
      case 'surprised': return <ellipse cx={mx} cy={my} rx={11} ry={14} fill={ink} />;
      case 'shock': return <g><ellipse cx={mx} cy={my + 4} rx={16} ry={23} fill={ink} /><ellipse cx={mx} cy={my + 16} rx={9} ry={5} fill="#b5545c" /></g>;
      case 'fear': return <g><path d={`M${mx - 24},${my + 6} Q${mx},${my - 12} ${mx + 24},${my + 6} Q${mx + 20},${my + 22} ${mx},${my + 22} Q${mx - 20},${my + 22} ${mx - 24},${my + 6} Z`} fill={ink} /><path d={`M${mx - 16},${my} Q${mx},${my - 8} ${mx + 16},${my}`} stroke="#fff" strokeWidth={5} fill="none" /></g>;
      case 'worried': return <path d={`M${mx - 16},${my + 5} Q${mx},${my - 6} ${mx + 16},${my + 5}`} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />;
      case 'confused': return <path d={`M${mx - 16},${my} Q${mx - 6},${my - 6} ${mx + 2},${my} T${mx + 16},${my - 2}`} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />;
      case 'suspicious': return <path d={`M${mx - 16},${my + 3} L${mx + 16},${my - 4}`} stroke={ink} strokeWidth={6} strokeLinecap="round" />;
      case 'determined': return <path d={`M${mx - 17},${my + 2} Q${mx},${my - 3} ${mx + 17},${my + 2}`} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />;
      default: return <path d={`M${mx - 15},${my - 2} Q${mx},${my + 7} ${mx + 15},${my - 2}`} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />;
    }
  })();

  const ponytail = ponytailOn ? (
    <g transform={`rotate(${back ? sway * 0.25 - 5 : -sway + 18}, ${back ? 0 : 58}, -800)`}>
      <path d={back ? 'M-16,-770 C-36,-700 -26,-640 0,-600 C26,-640 36,-700 16,-770 Z' : 'M44,-806 C130,-790 150,-690 118,-600 C108,-660 84,-720 40,-760 Z'} fill={look.hair} />
      <circle cx={back ? 0 : 50} cy={back ? -760 : -800} r={13} fill="#2a2a33" />
    </g>
  ) : null;

  return (
    <g transform={`translate(${x + tr},${y + bob}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={110} ry={18} fill="#000" opacity={0.35} />
      <Leg hx={-32} hy={-360} lift={liftR} side={-1} look={look} />
      <Leg hx={32} hy={-360} lift={liftL} side={1} look={look} />
      <g transform={`rotate(${ps.lean ?? 0}, 0, -360) translate(0, ${breathe * 0.3})`}>
        {/* de costas os braços ficam ATRÁS do tronco (antebraços estendidos à frente ficam ocultos) */}
        {back && arms}
        <path d={`M-74,${-598 + breathe * 0.4} Q-84,-520 -66,-352 L66,-352 Q84,-520 74,${-598 + breathe * 0.4} Q0,${-616 + breathe * 0.4} -74,${-598 + breathe * 0.4} Z`} fill={look.shirt} />
        <path d="M18,-604 Q80,-590 78,-520 Q74,-430 66,-352 L40,-352 Q52,-480 18,-604 Z" fill={look.shirtShade} opacity={0.7} />
        {look.stripe && <rect x={-80} y={-505} width={160} height={30} fill={look.stripe} />}
        {look.badge && !back && (
          <g transform="translate(22,-560)">
            <rect x={0} y={0} width={46} height={62} rx={5} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={2} />
            <rect x={4} y={4} width={38} height={12} rx={2} fill="#2f6fd6" />
            {/* símbolo da manutenção (chave inglesa) */}
            <path d="M13,10 L31,10 M29,6 a3,3 0 1,0 0.1,0 M15,14 a3,3 0 1,0 -0.1,0" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
            <circle cx={23} cy={30} r={8} fill="#c9cfdb" />
            <text x={23} y={54} fontSize={11} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fill="#1a1f2e">{look.badge}</text>
          </g>
        )}
        <rect x={-68} y={-372} width={136} height={30} rx={10} fill={look.pants} />
        <rect x={-20} y={-632} width={40} height={40} rx={12} fill={back ? look.skinShade : look.skin} />
        {!back && <path d="M-26,-604 Q0,-588 26,-604" stroke={look.shirtShade} strokeWidth={6} fill="none" />}
        <g transform={`translate(0, ${breathe * 0.2})`}>
          {!back && ponytail}
          <ellipse cx={-96 + fx * 0.3} cy={-718} rx={14} ry={20} fill={look.skinShade} />
          <ellipse cx={96 + fx * 0.3} cy={-718} rx={14} ry={20} fill={look.skinShade} />
          <ellipse cx={0} cy={-722} rx={96} ry={104} fill={back ? look.hair : look.skin} />
          {back ? (
            <>
              {ponytailOn ? <path d="M-96,-722 Q-90,-640 -60,-628 L60,-628 Q90,-640 96,-722 Z" fill={look.hair} /> : <path d="M-96,-722 Q-90,-660 -60,-650 L60,-650 Q90,-660 96,-722 Z" fill={look.hair} />}
              {ponytail}
            </>
          ) : (
            <>
              {look.stubble && <path d="M-80,-690 Q-70,-610 0,-612 Q70,-610 80,-690 Q60,-640 0,-640 Q-60,-640 -80,-690 Z" fill={look.stubble} opacity={0.5} />}
              {ponytailOn ? (
                <>
                  <path d={`M-100,-700 Q-108,-836 0,-830 Q104,-834 100,-706 Q94,-770 66,-790 Q${10 + fx},-800 ${-40 + fx * 0.6},-800 Q-84,-786 -100,-700 Z`} fill={look.hair} />
                  <path d={`M-62,-808 Q${-10 + fx},-822 ${50 + fx * 0.5},-806`} stroke="#2a2a33" strokeWidth={5} fill="none" opacity={0.6} />
                </>
              ) : (
                <path d={`M-98,-712 Q-104,-840 0,-832 Q104,-838 98,-712 Q92,-770 70,-786 Q${20 + fx},-778 ${-20 + fx},-790 Q-70,-784 -98,-712 Z`} fill={look.hair} />
              )}
              <g stroke={look.hair} strokeWidth={look.brow ?? 9} strokeLinecap="round">
                <line x1={-52 + fx} y1={-768 + E.browY + fy - E.brow * 0.5} x2={-18 + fx} y2={-768 + E.browY + fy + E.brow * 0.5} />
                <line x1={18 + fx} y1={-768 + E.browY + fy + E.brow * 0.5 + (expr === 'confused' ? -10 : 0)} x2={52 + fx} y2={-768 + E.browY + fy - E.brow * 0.5 + (expr === 'confused' ? -14 : 0)} />
              </g>
              {[-34, 34].map((ex) => (
                <g key={ex}>
                  <ellipse cx={ex + fx} cy={-726 + fy} rx={16} ry={Math.max(1.5, eyeH)} fill="#fff" />
                  {eyeH > 4 && <circle cx={ex + fx + lookX * 6} cy={-724 + fy + lookY * 5} r={Math.min(pr, eyeH)} fill="#151520" />}
                  {eyeH > 4 && <circle cx={ex + fx + lookX * 6 + 3} cy={-728 + fy + lookY * 5} r={2.6} fill="#fff" />}
                </g>
              ))}
              <path d={`M${fx * 1.1 - 2},-706 Q${fx * 1.1 + 8},-690 ${fx * 1.1 - 4},-686`} stroke={look.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
              {mouthEl}
              {(expr === 'fear' || expr === 'shock') && <path d="M78,-770 Q86,-752 78,-744 Q70,-752 78,-770 Z" fill="#bfe6ff" opacity={0.9} />}
              {phoneLit && <ellipse cx={0} cy={-690} rx={92} ry={86} fill="#6fd3ff" opacity={0.12} />}
            </>
          )}
        </g>
        {!back && arms}
        {phone === 'both' && !back && <g transform="translate(0,-472)"><PhoneProp /></g>}
        {phone === 'both' && !back && (
          <>
            <Hand x={-36} y={-462} rot={-100} shape="grip" skin={look.skin} shade={look.skinShade} size={HAND} />
            <Hand x={36} y={-462} rot={100} shape="grip" skin={look.skin} shade={look.skinShade} size={HAND} />
          </>
        )}
      </g>
    </g>
  );
};

/** VISTA LATERAL: andar, descer escadas, segurar corrimão, recuar */
const PersonSide: React.FC<PersonProps> = ({t, look, pose, expr = 'neutral', lookY = 0, mouth = 0, walk = 0, dir = 1, phone = 'none', tremble = 0, x = 0, y = 0, scale = 1, seed = 2}) => {
  const ph = t * 7 * walk;
  const sw = walk > 0 ? Math.sin(ph) : 0;
  const legA = sw * 26, legB = -legA;
  const kneeA = walk > 0 ? Math.max(0, Math.cos(ph)) * 34 : 0, kneeB = walk > 0 ? Math.max(0, -Math.cos(ph)) * 34 : 0;
  const bob = walk > 0 ? -Math.abs(Math.cos(ph)) * 8 : 0;
  const tr = tremble ? Math.sin(t * 55) * 3 * tremble : 0;
  const breathe = Math.sin(t * 2.1) * 3;
  const E = EXPR[expr];
  const bl = blink(t, seed);
  const eyeH = 17 * E.eye * (1 - bl * 0.92);
  const nSh = pose?.nSh ?? -sw * 24 + 6, nEl = pose?.nEl ?? 18, fSh = pose?.fSh ?? sw * 24 + 6, fEl = pose?.fEl ?? 18;
  const sway = 18 + Math.sin(t * 2.3) * 4 + sw * 8;
  const leg = (ang: number, knee: number, near: boolean) => {
    const a = ang * D2R, b = (ang - knee) * D2R;
    const kx = Math.sin(a) * 180, ky = -360 + Math.cos(a) * 180;
    const fx = kx + Math.sin(b) * 170, fy = ky + Math.cos(b) * 170;
    return (
      <g opacity={near ? 1 : 0.92}>
        <path d={`M0,-360 L${kx},${ky} L${fx},${fy}`} stroke={near ? look.pants : '#0c0d12'} strokeWidth={48} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${fx - 26},${fy + 18} Q${fx - 26},${fy - 14} ${fx + 6},${fy - 14} Q${fx + 50},${fy - 8} ${fx + 54},${fy + 18} Z`} fill={look.shoe} />
        <rect x={fx - 28} y={fy + 12} width={84} height={10} rx={5} fill={look.sole} />
      </g>
    );
  };
  const arm = (sh: number, el: number, near: boolean, hand: HandShape) => {
    const a1 = sh * D2R, a2 = (sh + el) * D2R;
    const ex = Math.sin(a1) * L1, ey = SHY + Math.cos(a1) * L1;
    const hx = ex + Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
    const skin = near ? look.skin : look.skinShade;
    const slv = look.longSleeves ? 1 : 0.42;
    return (
      <g>
        <path d={`M0,${SHY} L${ex},${ey} L${hx},${hy}`} stroke={skin} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M0,${SHY} L${Math.sin(a1) * L1 * slv},${SHY + Math.cos(a1) * L1 * slv}`} stroke={near ? look.shirt : look.shirtShade} strokeWidth={44} strokeLinecap="round" />
        <Hand x={hx} y={hy} rot={-a2 / D2R} shape={hand} skin={skin} shade={look.skinShade} size={HAND} />
        {near && phone !== 'none' && <g transform={`translate(${hx + 10},${hy - 20}) rotate(${-a2 / D2R - 160})`}><PhoneProp /></g>}
      </g>
    );
  };
  const mx = 70, my = -664 + lookY * 6;
  return (
    <g transform={`translate(${x + tr},${y + bob}) scale(${dir * scale},${scale})`}>
      <ellipse cx={0} cy={4} rx={90} ry={14} fill="#000" opacity={0.3} />
      {arm(fSh, fEl, false, pose?.fHand ?? 'relaxed')}
      {leg(legB, kneeB, false)}
      {leg(legA, kneeA, true)}
      <g transform={`rotate(${pose?.lean ?? 0}, 0, -360) translate(0, ${breathe * 0.3})`}>
        <path d="M-50,-600 Q-62,-480 -52,-352 L52,-352 Q66,-470 50,-600 Q0,-616 -50,-600 Z" fill={look.shirt} />
        <path d="M-50,-600 Q-62,-480 -52,-352 L-24,-352 Q-34,-480 -20,-608 Z" fill={look.shirtShade} opacity={0.7} />
        {look.stripe && <rect x={-58} y={-505} width={120} height={30} fill={look.stripe} />}
        <rect x={-54} y={-372} width={108} height={30} rx={10} fill={look.pants} />
        <rect x={-18} y={-634} width={38} height={42} rx={12} fill={look.skin} />
        <g transform={`rotate(${lookY * 10}, 0, -640)`}>
          {look.hairStyle === 'ponytail' && (
            <g transform={`rotate(${-(sway - 18) * 0.7 - 4}, -70, -790)`}>
              <path d="M-74,-800 C-150,-790 -176,-700 -150,-610 C-140,-680 -112,-740 -64,-764 Z" fill={look.hair} />
              <circle cx={-72} cy={-792} r={13} fill="#2a2a33" />
            </g>
          )}
          <ellipse cx={4} cy={-722} rx={94} ry={102} fill={look.skin} />
          <path d={`M88,-724 Q112,-700 92,-688`} fill={look.skin} stroke={look.skinShade} strokeWidth={4} />
          {look.stubble && <path d="M10,-640 Q60,-628 86,-670 L86,-640 Q50,-612 10,-622 Z" fill={look.stubble} opacity={0.5} />}
          <path d={look.hairStyle === 'ponytail' ? 'M-90,-690 Q-104,-830 4,-826 Q90,-830 98,-760 Q60,-790 20,-786 Q-40,-780 -60,-700 Q-70,-660 -90,-660 Z' : 'M-90,-700 Q-100,-834 4,-828 Q94,-832 98,-756 Q56,-786 20,-780 Q-40,-774 -64,-710 Q-74,-680 -90,-680 Z'} fill={look.hair} />
          <ellipse cx={-10} cy={-716} rx={14} ry={20} fill={look.skinShade} />
          <line x1={38} y1={-766 + E.browY + E.brow * 0.4} x2={72} y2={-766 + E.browY - E.brow * 0.4} stroke={look.hair} strokeWidth={look.brow ?? 9} strokeLinecap="round" />
          <ellipse cx={58} cy={-726} rx={13} ry={Math.max(1.5, eyeH)} fill="#fff" />
          {eyeH > 4 && <circle cx={64} cy={-724 + lookY * 5} r={Math.min(8 * E.pup, eyeH)} fill="#151520" />}
          {mouth > 0.08 ? <ellipse cx={mx} cy={my} rx={8 + mouth * 4} ry={3 + mouth * 12} fill="#3a1418" />
            : expr === 'shock' || expr === 'surprised' ? <ellipse cx={mx} cy={my} rx={8} ry={12} fill="#3a1418" />
            : <path d={`M${mx - 14},${my + (expr === 'fear' || expr === 'worried' ? 4 : 0)} Q${mx},${my + (expr === 'fear' || expr === 'worried' ? -4 : 5)} ${mx + 12},${my}`} stroke="#3a1418" strokeWidth={6} strokeLinecap="round" fill="none" />}
        </g>
        {arm(nSh, nEl, true, pose?.nHand ?? 'relaxed')}
      </g>
    </g>
  );
};
