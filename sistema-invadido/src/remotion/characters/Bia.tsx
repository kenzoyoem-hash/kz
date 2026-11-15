import React from 'react';
import {C} from '../theme';
import {blink, lerp} from '../lib/anim';

/**
 * BIA — protagonista. Modelo FIXO da série (não alterar aparência entre episódios):
 * 22 anos, cabelo preto em rabo de cavalo, camiseta branca com faixa vermelha horizontal,
 * calça preta, tênis brancos.
 *
 * Coordenadas locais: origem no chão entre os pés, eixo Y para cima negativo. Altura ~840.
 */
export type Expr = 'neutral' | 'surprised' | 'fear' | 'suspicious' | 'determined' | 'shock';

export type Pose = {
  rSh: number; // braço direito (lado esquerdo da tela): ângulo do ombro a partir de "para baixo", positivo = para fora
  rEl: number; // dobra do cotovelo (positivo = antebraço vai para dentro/para cima)
  lSh: number;
  lEl: number;
  lean?: number; // inclinação do tronco (graus)
  rT?: {x: number; y: number}; // alvo da mão direita (coordenadas locais) — usa IK em vez dos ângulos
  lT?: {x: number; y: number};
};

/** IK de dois ossos: devolve [ombro, cotovelo] para a mão alcançar o alvo */
export const armIK = (side: 1 | -1, tx: number, ty: number): [number, number] => {
  const sx = side * 70, sy = -582, L1 = 150, L2 = 138;
  const dx = tx - sx, dy = ty - sy;
  const d = Math.min(L1 + L2 - 1, Math.max(20, Math.hypot(dx, dy)));
  const th = Math.atan2(side * dx, dy);
  const a = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const b = Math.acos((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2));
  return [((th + a) * 180) / Math.PI, 180 - (b * 180) / Math.PI];
};

export const POSES: Record<string, Pose> = {
  idle: {rSh: 8, rEl: 8, lSh: 8, lEl: 8},
  phoneL: {rSh: 8, rEl: 10, lSh: 18, lEl: 118}, // celular na mão esquerda, na frente do peito
  phoneBoth: {rSh: 22, rEl: 122, lSh: 22, lEl: 122},
  phoneFace: {rSh: 10, rEl: 10, lSh: 30, lEl: 150}, // celular perto do rosto
  raiseR: {rSh: 165, rEl: 8, lSh: 18, lEl: 118}, // levanta o braço direito (com celular na esquerda)
  reach: {rSh: 70, rEl: 20, lSh: 12, lEl: 20},
  scared: {rSh: 25, rEl: 135, lSh: 25, lEl: 135}, // mãos perto do rosto
  handle: {rSh: 40, rEl: 110, lSh: 40, lEl: 110}, // costas: duas mãos na maçaneta (altura do peito)
  run: {rSh: 30, rEl: 80, lSh: 30, lEl: 80, lean: 4},
};

export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({
  rSh: lerp(a.rSh, b.rSh, k), rEl: lerp(a.rEl, b.rEl, k),
  lSh: lerp(a.lSh, b.lSh, k), lEl: lerp(a.lEl, b.lEl, k),
  lean: lerp(a.lean ?? 0, b.lean ?? 0, k),
});

type Props = {
  t: number; // tempo em segundos (para respiração, piscar, rabo de cavalo)
  pose?: Pose;
  expr?: Expr;
  lookX?: number; // -1..1 (vira o rosto/olhos)
  lookY?: number; // -1..1
  mouth?: number; // 0..1 abertura para fala
  run?: number; // 0..1 intensidade da corrida (ciclo das pernas)
  facing?: 'front' | 'back';
  phone?: 'none' | 'L' | 'R';
  phoneLit?: boolean; // tela do celular acesa iluminando o rosto
  pupil?: number; // multiplicador do tamanho da pupila
  tremble?: number; // tremor de medo
  x?: number; y?: number; scale?: number;
};

const D2R = Math.PI / 180;

const Arm: React.FC<{side: 1 | -1; sh: number; el: number; sx: number; sy: number; phone?: boolean; back?: boolean}> = ({side, sh, el, sx, sy, phone, back}) => {
  // side -1 = braço direito da Bia (lado esquerdo da tela), +1 = braço esquerdo
  const s = side; // braços simétricos: 'para fora' depende só do lado da tela
  const a1 = sh * D2R, a2 = (sh - el) * D2R;
  const L1 = 150, L2 = 138;
  const ex = sx + s * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
  const hx = ex + s * Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
  const mx = sx + s * Math.sin(a1) * 62, my = sy + Math.cos(a1) * 62;
  return (
    <g>
      <path d={`M${sx},${sy} L${ex},${ey} L${hx},${hy}`} stroke={C.skin} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* manga curta branca */}
      <path d={`M${sx},${sy} L${mx},${my}`} stroke={C.shirt} strokeWidth={46} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={19} fill={C.skin} />
      {phone && !back && (
        <g transform={`translate(${hx},${hy - 6}) rotate(${s * -8})`}>
          <rect x={-30} y={-58} width={60} height={112} rx={12} fill="#0d0f16" stroke="#2b3142" strokeWidth={4} />
          <circle cx={-14} cy={-42} r={5} fill="#1f2433" />
          <circle cx={hx > 0 ? 0 : 0} cy={0} r={0} />
          {/* dedos */}
          <rect x={-36} y={-6} width={16} height={30} rx={8} fill={C.skin} />
          <rect x={22} y={-14} width={14} height={26} rx={7} fill={C.skin} />
        </g>
      )}
    </g>
  );
};

const Leg: React.FC<{hx: number; hy: number; lift: number; side: 1 | -1}> = ({hx, hy, lift, side}) => {
  const footY = -lift;
  const kneeY = lerp(hy, footY, 0.5) - lift * 0.15;
  const kneeX = hx + side * (6 + lift * 0.25);
  const fx = hx + side * 8;
  return (
    <g>
      <path d={`M${hx},${hy} L${kneeX},${kneeY} L${fx},${footY - 22}`} stroke={C.pants} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* tênis branco */}
      <path d={`M${fx - 30},${footY - 4} Q${fx - 30},${footY - 38} ${fx},${footY - 38} Q${fx + 34},${footY - 36} ${fx + 40 * side * 0 + 38},${footY - 6} Z`} fill={C.shoe} />
      <rect x={fx - 32} y={footY - 8} width={72} height={10} rx={5} fill="#b9bfcc" />
    </g>
  );
};

export const Bia: React.FC<Props> = ({
  t, pose = POSES.idle, expr = 'neutral', lookX = 0, lookY = 0, mouth = 0, run = 0,
  facing = 'front', phone = 'none', phoneLit = false, pupil = 1, tremble = 0, x = 0, y = 0, scale = 1,
}) => {
  const back = facing === 'back';
  const breathe = Math.sin(t * 2.1) * 4;
  const cyc = t * 15;
  const liftL = run * Math.max(0, Math.sin(cyc)) * 120;
  const liftR = run * Math.max(0, Math.sin(cyc + Math.PI)) * 120;
  const bob = run * Math.abs(Math.sin(cyc)) * -18;
  const tr = tremble ? Math.sin(t * 55) * 3 * tremble : 0;
  const lean = pose.lean ?? 0;
  const sway = 22 + Math.sin(t * 2.3) * 5 + run * Math.sin(cyc * 2) * 14 - lookX * 10;
  const bl = Math.max(blink(t, 2), expr === 'suspicious' ? 0.35 : 0);

  // parâmetros de expressão
  const E = {
    neutral:    {brow: 0, browY: 0, eye: 1, pup: 1},
    surprised:  {brow: -6, browY: -14, eye: 1.25, pup: 0.85},
    shock:      {brow: -10, browY: -20, eye: 1.35, pup: 0.6},
    fear:       {brow: -18, browY: -10, eye: 1.15, pup: 0.7},
    suspicious: {brow: 12, browY: 4, eye: 0.9, pup: 1},
    determined: {brow: 16, browY: 6, eye: 0.95, pup: 1},
  }[expr];
  const fx = lookX * 24, fy = lookY * 12;
  const eyeH = 19 * E.eye * (1 - bl * 0.92);
  const pr = 9 * E.pup * pupil;

  const mouthEl = (() => {
    const mo = mouth;
    const mx = fx * 0.9, my = -664 + fy * 0.6;
    if (mo > 0.08) return <ellipse cx={mx} cy={my} rx={10 + mo * 6} ry={4 + mo * 13} fill="#3a1418" />;
    switch (expr) {
      case 'surprised': return <ellipse cx={mx} cy={my} rx={11} ry={14} fill="#3a1418" />;
      case 'shock': return <g><ellipse cx={mx} cy={my + 4} rx={16} ry={23} fill="#3a1418" /><ellipse cx={mx} cy={my + 16} rx={9} ry={5} fill="#b5545c" /></g>;
      case 'fear': return <g><path d={`M${mx - 24},${my + 6} Q${mx},${my - 12} ${mx + 24},${my + 6} Q${mx + 20},${my + 22} ${mx},${my + 22} Q${mx - 20},${my + 22} ${mx - 24},${my + 6} Z`} fill="#3a1418" /><path d={`M${mx - 16},${my} Q${mx},${my - 8} ${mx + 16},${my}`} stroke="#fff" strokeWidth={5} fill="none" /></g>;
      case 'suspicious': return <path d={`M${mx - 16},${my + 3} L${mx + 16},${my - 4}`} stroke="#3a1418" strokeWidth={6} strokeLinecap="round" />;
      case 'determined': return <path d={`M${mx - 17},${my + 2} Q${mx},${my - 3} ${mx + 17},${my + 2}`} stroke="#3a1418" strokeWidth={6} strokeLinecap="round" fill="none" />;
      default: return <path d={`M${mx - 15},${my - 2} Q${mx},${my + 7} ${mx + 15},${my - 2}`} stroke="#3a1418" strokeWidth={6} strokeLinecap="round" fill="none" />;
    }
  })();

  const ponytail = (
    <g transform={`rotate(${back ? sway * 0.25 - 5 : -sway + 18}, ${back ? 0 : 58}, -800)`}>
      <path d={back ? 'M-16,-770 C-36,-700 -26,-640 0,-600 C26,-640 36,-700 16,-770 Z' : 'M44,-806 C130,-790 150,-690 118,-600 C108,-660 84,-720 40,-760 Z'} fill={C.hair} />
      <circle cx={back ? 0 : 50} cy={back ? -760 : -800} r={13} fill="#2a2a33" />
    </g>
  );

  return (
    <g transform={`translate(${x + tr},${y + bob}) scale(${scale})`}>
      <defs>
        <radialGradient id="biaPhoneGlow" cx="0.5" cy="0.85" r="0.75">
          <stop offset="0" stopColor={C.cyan} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* sombra no chão */}
      <ellipse cx={0} cy={4} rx={110} ry={18} fill="#000" opacity={0.35} />
      <Leg hx={-32} hy={-360} lift={liftR} side={-1} />
      <Leg hx={32} hy={-360} lift={liftL} side={1} />
      <g transform={`rotate(${lean}, 0, -360) translate(0, ${breathe * 0.3})`}>
        {/* tronco: camiseta branca com faixa vermelha */}
        <path d={`M-74,${-598 + breathe * 0.4} Q-84,-520 -66,-352 L66,-352 Q84,-520 74,${-598 + breathe * 0.4} Q0,${-616 + breathe * 0.4} -74,${-598 + breathe * 0.4} Z`} fill={C.shirt} />
        <path d="M18,-604 Q80,-590 78,-520 Q74,-430 66,-352 L40,-352 Q52,-480 18,-604 Z" fill={C.shirtShade} opacity={0.7} />
        <rect x={-80} y={-505} width={160} height={30} fill={C.stripe} />
        {/* cós da calça */}
        <rect x={-68} y={-372} width={136} height={30} rx={10} fill={C.pants} />
        {/* pescoço */}
        <rect x={-20} y={-632} width={40} height={40} rx={12} fill={back ? C.skinShade : C.skin} />
        {!back && <path d="M-26,-604 Q0,-588 26,-604" stroke={C.shirtShade} strokeWidth={6} fill="none" />}
        <g transform={`translate(0, ${breathe * 0.2})`}>
          {!back && ponytail}
          {/* orelhas */}
          <ellipse cx={-96 + fx * 0.3} cy={-718} rx={14} ry={20} fill={C.skinShade} />
          <ellipse cx={96 + fx * 0.3} cy={-718} rx={14} ry={20} fill={C.skinShade} />
          {/* cabeça */}
          <ellipse cx={0} cy={-722} rx={96} ry={104} fill={back ? C.hair : C.skin} />
          {back ? (
            <>
              <path d="M-96,-722 Q-90,-640 -60,-628 L60,-628 Q90,-640 96,-722 Z" fill={C.hair} />
              <path d="M-70,-780 Q-30,-800 -8,-764 M70,-780 Q30,-800 8,-764 M-84,-720 Q-40,-740 -14,-756 M84,-720 Q40,-740 14,-756" stroke="#2c2c36" strokeWidth={5} fill="none" opacity={0.5} />
              {ponytail}
            </>
          ) : (
            <>
              {/* cabelo (topo + franja lateral) */}
              <path d={`M-100,-700 Q-108,-836 0,-830 Q104,-834 100,-706 Q94,-770 66,-790 Q${10 + fx},-800 ${-40 + fx * 0.6},-800 Q-84,-786 -100,-700 Z`} fill={C.hair} />
              <path d={`M-62,-808 Q${-10 + fx},-822 ${50 + fx * 0.5},-806`} stroke="#2a2a33" strokeWidth={5} fill="none" opacity={0.6} />
              {/* sobrancelhas */}
              <g stroke={C.hair} strokeWidth={9} strokeLinecap="round">
                <line x1={-52 + fx} y1={-768 + E.browY + fy - E.brow * 0.5} x2={-18 + fx} y2={-768 + E.browY + fy + E.brow * 0.5} />
                <line x1={18 + fx} y1={-768 + E.browY + fy + E.brow * 0.5} x2={52 + fx} y2={-768 + E.browY + fy - E.brow * 0.5} />
              </g>
              {/* olhos */}
              {[-34, 34].map((ex) => (
                <g key={ex}>
                  <ellipse cx={ex + fx} cy={-726 + fy} rx={16} ry={Math.max(1.5, eyeH)} fill="#fff" />
                  {eyeH > 4 && <circle cx={ex + fx + lookX * 6} cy={-724 + fy + lookY * 5} r={Math.min(pr, eyeH)} fill="#151520" />}
                  {eyeH > 4 && <circle cx={ex + fx + lookX * 6 + 3} cy={-728 + fy + lookY * 5} r={2.6} fill="#fff" />}
                </g>
              ))}
              {/* nariz */}
              <path d={`M${fx * 1.1 - 2},-706 Q${fx * 1.1 + 8},-690 ${fx * 1.1 - 4},-686`} stroke={C.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
              {mouthEl}
              {(expr === 'fear' || expr === 'shock') && (
                <path d="M78,-770 Q86,-752 78,-744 Q70,-752 78,-770 Z" fill="#bfe6ff" opacity={0.9} />
              )}
              {phoneLit && <ellipse cx={0} cy={-690} rx={92} ry={86} fill="url(#biaPhoneGlow)" />}
            </>
          )}
        </g>
        <Arm side={-1} sh={pose.rT ? armIK(-1, pose.rT.x, pose.rT.y)[0] : pose.rSh} el={pose.rT ? armIK(-1, pose.rT.x, pose.rT.y)[1] : pose.rEl} sx={-70} sy={-582} phone={phone === 'R'} back={back} />
        <Arm side={1} sh={pose.lT ? armIK(1, pose.lT.x, pose.lT.y)[0] : pose.lSh} el={pose.lT ? armIK(1, pose.lT.x, pose.lT.y)[1] : pose.lEl} sx={70} sy={-582} phone={phone === 'L'} back={back} />
      </g>
    </g>
  );
};
