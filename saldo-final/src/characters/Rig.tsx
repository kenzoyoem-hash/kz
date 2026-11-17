import React from 'react';
import {clamp, lerp, wobble} from '../lib/anim';

/**
 * RIG OFICIAL DOS PERSONAGENS DE SALDO FINAL
 * Humanoide 2D minimalista: cabeça redonda sem rosto, corpo geométrico, braços e pernas finos.
 * Articulações: tronco (inclinação), cabeça (inclinação + direção do rosto), ombros/cotovelos, quadris/joelhos.
 * Unidade: 1 = 1 px na escala 1. Pés no chão em y = 0 (o quadril é calculado pela pose das pernas).
 * Ângulos em graus: 0 = membro pendurado para baixo, 90 = para a frente (direção `facing`), 180 = para cima.
 */
export type Pose = {
  lean: number;            // inclinação do tronco (+ = para a frente)
  head: number;            // inclinação da cabeça em relação ao tronco (+ = para a frente / baixo)
  look: number;            // direção do rosto: 0 = câmera, 1 = para onde o corpo aponta, -1 = para trás
  lookY: number;           // -1 olhando para cima, 1 para baixo
  aL: [number, number];    // braço de trás: ombro, cotovelo
  aR: [number, number];    // braço da frente: ombro, cotovelo
  lL: [number, number];    // perna de trás: quadril, joelho
  lR: [number, number];    // perna da frente: quadril, joelho
  y: number;               // deslocamento vertical (pulo: negativo)
  sh: number;              // ombros erguidos (tensão, riso) 0..1
};

export const BASE: Pose = {lean: 0, head: 0, look: 0.35, lookY: 0, aL: [6, 8], aR: [-4, 10], lL: [3, 0], lR: [-3, 0], y: 0, sh: 0};

export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({
  lean: lerp(a.lean, b.lean, k), head: lerp(a.head, b.head, k), look: lerp(a.look, b.look, k), lookY: lerp(a.lookY, b.lookY, k),
  aL: [lerp(a.aL[0], b.aL[0], k), lerp(a.aL[1], b.aL[1], k)], aR: [lerp(a.aR[0], b.aR[0], k), lerp(a.aR[1], b.aR[1], k)],
  lL: [lerp(a.lL[0], b.lL[0], k), lerp(a.lL[1], b.lL[1], k)], lR: [lerp(a.lR[0], b.lR[0], k), lerp(a.lR[1], b.lR[1], k)],
  y: lerp(a.y, b.y, k), sh: lerp(a.sh, b.sh, k),
});
export const P = (o: Partial<Pose>): Pose => ({...BASE, ...o});

export type Palette = {
  skin: string; skinShade: string; hair: string; hairShade: string;
  jacket: string; jacketShade: string; tee: string; pants: string; pantsShade: string; shoes: string;
  hairStyle: 'maya' | 'noah' | 'future' | 'short' | 'bun' | 'cap' | 'slick' | 'none';
  jacketStyle: 'open' | 'closed' | 'coat' | 'overall' | 'suit';
  accent?: string;         // detalhes luminosos (Maya do futuro, figurantes ricos)
  height?: number;         // multiplicador de altura (Noah é ligeiramente mais alto)
};

// geometria base
const TH = 92, SHN = 90, T = 128, HR = 37, UA = 76, LA = 70, NECK = 10;
const rad = (d: number) => (d * Math.PI) / 180;
const dir = (a: number) => ({x: Math.sin(rad(a)), y: Math.cos(rad(a))});

/** mistura de cores hex (para luz da cena / silhueta) */
export function mixHex(a: string, b: string, k: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, k));
  const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, k));
  const bl = Math.round(lerp(pa & 255, pb & 255, k));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

export type RigProps = {
  t: number;
  pose: Pose | ((t: number) => Pose);
  pal: Palette;
  x: number; y: number; s?: number; facing?: 1 | -1;
  voice?: number;          // 0..1 intensidade da fala (gesto sincronizado)
  tremble?: number;        // 0..1 tremor das mãos/corpo
  prop?: 'phone' | 'phoneEar' | 'phoneBoth' | 'bill' | null;
  propGlow?: string;       // cor da tela do celular
  faceGlow?: number;       // luz da tela no rosto 0..1
  dark?: number;           // 0 = luz normal, 1 = silhueta
  darkColor?: string;
  shadow?: boolean;
  breathe?: number;        // amplitude da respiração
  opacity?: number;
};

export const Rig: React.FC<RigProps> = (pr) => {
  const {t, pal, x, y, s = 1, facing = 1, voice = 0, tremble = 0, prop = null, propGlow = '#36B7FF',
    faceGlow = 0, dark = 0, darkColor = '#0A1020', shadow = true, breathe = 1, opacity = 1} = pr;
  const fn = typeof pr.pose === 'function' ? pr.pose : null;
  const p0 = fn ? fn(t) : (pr.pose as Pose);
  const prev = fn ? fn(t - 0.1) : p0;
  const hgt = pal.height ?? 1;
  const c = (hex: string) => (dark > 0 ? mixHex(hex, darkColor, dark) : hex);

  // movimento secundário: respiração, fala, tremor
  const br = Math.sin(t * 2.3) * breathe;
  const talk = voice * (Math.sin(t * 13) * 0.6 + wobble(t * 3, 4) * 0.4);
  const tr = tremble * wobble(t * 38, 2);
  const p: Pose = {
    ...p0,
    head: p0.head + talk * 4 + br * 0.6,
    lean: p0.lean + br * 0.5 + talk * 1.2,
    aR: [p0.aR[0] + tr * 3 + talk * 3, p0.aR[1] + tr * 4],
    aL: [p0.aL[0] - tr * 2 + talk * 2, p0.aL[1] + tr * 3],
  };
  // inércia do cabelo: atraso em relação ao movimento da cabeça e do tronco
  const sway = clamp(((p0.head + p0.lean) - (prev.head + prev.lean)) * -0.9 + (p0.y - prev.y) * 0.08, -16, 16);

  // pernas -> altura do quadril
  const legPts = (l: [number, number]) => {
    const k = dir(l[0]), sh = dir(l[0] + l[1]);
    return {knee: {x: k.x * TH, y: k.y * TH}, ankle: {x: k.x * TH + sh.x * SHN, y: k.y * TH + sh.y * SHN}};
  };
  const LL = legPts(p.lL), LR = legPts(p.lR);
  const hipH = Math.max(LL.ankle.y, LR.ankle.y);
  const hip = {x: 0, y: -hipH + p.y};
  const up = {x: Math.sin(rad(p.lean)), y: -Math.cos(rad(p.lean))};
  const torsoS = 1 + br * 0.008;
  const at = (d: number, side: number) => ({   // ponto no tronco: d acima do quadril, deslocado `side` na lateral
    x: hip.x + up.x * d * torsoS - up.y * side, y: hip.y + up.y * d * torsoS + up.x * side,
  });
  const shY = T - 14 - p.sh * 7;
  const shR = at(shY, 4), shL = at(shY, -12);
  const neck = at(T, -2);
  const hAng = p.lean + p.head;
  const hu = {x: Math.sin(rad(hAng)), y: -Math.cos(rad(hAng))};
  const hc = {x: neck.x + hu.x * (NECK + HR - 4), y: neck.y + hu.y * (NECK + HR - 4)};

  const arm = (sh: {x: number; y: number}, a: [number, number]) => {
    const u = dir(a[0] + p.lean), l = dir(a[0] + a[1] + p.lean);
    const e = {x: sh.x + u.x * UA, y: sh.y + u.y * UA};
    const w = {x: e.x + l.x * LA, y: e.y + l.y * LA};
    return {e, w, ang: a[0] + a[1] + p.lean};
  };
  const AR = arm(shR, p.aR), AL = arm(shL, p.aL);

  const shoe = (ank: {x: number; y: number}, hipX: number, col: string) => (
    <g transform={`translate(${hipX + ank.x},${hip.y + ank.y})`}>
      <path d="M-9,-7 Q-10,6 0,7 L22,7 Q27,6 25,0 Q22,-6 10,-8 Z" fill={col} />
    </g>
  );
  const leg = (L: ReturnType<typeof legPts>, hipX: number, col: string, shoeCol: string) => (
    <g>
      <path d={`M${hipX},${hip.y} L${hipX + L.knee.x},${hip.y + L.knee.y} L${hipX + L.ankle.x},${hip.y + L.ankle.y}`}
        stroke={col} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {shoe(L.ankle, hipX, shoeCol)}
    </g>
  );
  const armEl = (sh: {x: number; y: number}, A: ReturnType<typeof arm>, col: string, skinC: string) => (
    <g>
      <path d={`M${sh.x},${sh.y} L${A.e.x},${A.e.y} L${A.w.x},${A.w.y}`} stroke={col} strokeWidth={13}
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={A.w.x} cy={A.w.y} r={8.5} fill={skinC} />
    </g>
  );

  // celular na mão da frente
  const phoneEl = () => {
    if (!prop || prop === 'bill') return null;
    const w = AR.w;
    const ang = prop === 'phoneEar' ? hAng + 10 : AR.ang - 180 + 8;
    return (
      <g transform={`translate(${w.x},${w.y}) rotate(${-ang + (prop === 'phoneEar' ? 0 : 0)})`}>
        <rect x={-10} y={-34} width={20} height={36} rx={4} fill={c('#1B2133')} />
        <rect x={-10} y={-34} width={20} height={36} rx={4} fill="none" stroke={propGlow} strokeWidth={1.6} opacity={0.9} />
        <circle cx={0} cy={-16} r={26} fill={propGlow} opacity={0.12} />
      </g>
    );
  };
  const billEl = () => {
    if (prop !== 'bill') return null;
    const w = AR.w;
    return (
      <g transform={`translate(${w.x},${w.y}) rotate(${-(AR.ang - 180) + 10})`}>
        <rect x={-14} y={-46} width={30} height={40} rx={2} fill={c('#E6E8EF')} />
        <rect x={-9} y={-40} width={20} height={4} fill={c('#9AA0B0')} />
        <rect x={-9} y={-32} width={14} height={3} fill={c('#9AA0B0')} />
        <rect x={-9} y={-20} width={20} height={7} fill={c('#FF3B4E')} />
      </g>
    );
  };

  const look = clamp(p.look, -1, 1);
  return (
    <g opacity={opacity}>
      {shadow && (
        <ellipse cx={x + hip.x * s * facing} cy={y + 2} rx={62 * s * clamp(1 + p.y / 300, 0.5, 1)} ry={11 * s}
          fill="#000" opacity={0.32 * clamp(1 + p.y / 250, 0.3, 1)} />
      )}
      <g transform={`translate(${x},${y}) scale(${s * facing},${s * hgt})`}>
        {/* braço e perna de trás (mais escuros) */}
        {leg(LL, -7, c(pal.pantsShade), c(pal.shoes))}
        {armEl(shL, AL, c(pal.jacketShade), c(pal.skinShade))}
        {/* cabelo de trás */}
        <g transform={`translate(${hc.x},${hc.y}) rotate(${hAng})`}>
          <HairBack style={pal.hairStyle} col={c(pal.hairShade)} look={look} sway={sway} t={t} />
        </g>
        {leg(LR, 6, c(pal.pants), c(pal.shoes))}
        {/* pescoço */}
        <path d={`M${neck.x},${neck.y + 6} L${neck.x + hu.x * 14},${neck.y + hu.y * 14}`} stroke={c(pal.skinShade)} strokeWidth={14} strokeLinecap="round" />
        {/* tronco */}
        <g transform={`translate(${hip.x},${hip.y}) rotate(${p.lean}) scale(1,${torsoS})`}>
          <Torso pal={pal} c={c} look={look} />
        </g>
        {/* cabeça */}
        <g transform={`translate(${hc.x},${hc.y}) rotate(${hAng})`}>
          {/* volume: base sombreada + esfera clara deslocada para o lado do rosto */}
          <ellipse cx={0} cy={0} rx={HR} ry={HR + 2} fill={c(pal.skinShade)} />
          <ellipse cx={look * 5 + 2} cy={-3} rx={HR - 4} ry={HR - 2} fill={c(pal.skin)} />
          {/* plano do rosto (sem traços): indica para onde a personagem olha */}
          <ellipse cx={look * 15} cy={p.lookY * 9 + 4} rx={22 - Math.abs(look) * 6} ry={25} fill="#FFFFFF" opacity={dark > 0.6 ? 0.03 : 0.13} />
          {faceGlow > 0 && <ellipse cx={look * 18 + 8} cy={6} rx={34} ry={34} fill={propGlow} opacity={0.14 * faceGlow} />}
          <HairFront style={pal.hairStyle} col={c(pal.hair)} look={look} sway={sway} accent={pal.accent} />
        </g>
        {/* braço da frente */}
        {armEl(shR, AR, c(pal.jacket), c(pal.skin))}
        {phoneEl()}
        {billEl()}
      </g>
    </g>
  );
};

const Torso: React.FC<{pal: Palette; c: (h: string) => string; look: number}> = ({pal, c, look}) => {
  const top = -T;
  const st = pal.jacketStyle;
  const hem = st === 'coat' ? 58 : st === 'suit' ? 22 : 14;
  const body = `M-27,${hem} L-28,${top + 24} Q-28,${top + 4} -10,${top + 2} L14,${top + 2} Q31,${top + 4} 30,${top + 24} L${st === 'coat' ? 33 : 29},${hem} Q2,${hem + 6} -27,${hem} Z`;
  const off = look * 6;
  return (
    <g>
      <path d={body} fill={c(pal.jacket)} />
      {/* lado de trás em sombra (volume) */}
      <path d={`M-27,${hem} L-28,${top + 24} Q-28,${top + 4} -10,${top + 2} L-6,${top + 2} Q-14,${top + 40} -12,${hem + 3} Z`} fill={c(pal.jacketShade)} opacity={0.85} />
      {st === 'open' && (
        <>
          <path d={`M${4 + off},${top + 4} L${20 + off},${top + 4} L${18 + off},${hem - 2} L${6 + off},${hem - 2} Z`} fill={c(pal.tee)} />
          <path d={`M${2 + off},${top + 3} L${10 + off},${top + 30} L${4 + off},${top + 30} Z`} fill={c(pal.jacketShade)} />
          <path d={`M${22 + off},${top + 3} L${14 + off},${top + 30} L${21 + off},${top + 30} Z`} fill={c(pal.jacketShade)} />
        </>
      )}
      {st === 'closed' && <path d={`M${-2 + off},${top + 6} L${26},${top + 6}`} stroke={c(pal.tee)} strokeWidth={5} />}
      {st === 'coat' && (
        <>
          {/* sobretudo futurista: gola alta e costuras luminosas */}
          <path d={`M-14,${top - 6} L20,${top - 6} L24,${top + 12} L-18,${top + 12} Z`} fill={c(pal.jacketShade)} />
          <path d={`M${10 + off},${top + 12} L${8 + off},${hem - 4}`} stroke={pal.accent ?? '#FF3B4E'} strokeWidth={2.4} opacity={0.9} />
          <path d={`M-24,${top + 60} L28,${top + 60}`} stroke={pal.accent ?? '#FF3B4E'} strokeWidth={1.6} opacity={0.5} />
        </>
      )}
      {st === 'overall' && (
        <>
          <rect x={-22} y={top + 40} width={46} height={hem - top - 40} rx={6} fill={c(pal.tee)} />
          <path d={`M-14,${top + 4} L-12,${top + 42} M18,${top + 4} L16,${top + 42}`} stroke={c(pal.tee)} strokeWidth={5} />
        </>
      )}
      {st === 'suit' && (
        <>
          <path d={`M${2 + off},${top + 4} L${22 + off},${top + 4} L${12 + off},${top + 50} Z`} fill={c(pal.tee)} />
          <path d={`M${12 + off},${top + 10} L${12 + off},${top + 46}`} stroke={pal.accent ?? '#F2C14E'} strokeWidth={4} />
        </>
      )}
    </g>
  );
};

/** mecha de cabelo pendente com ondas e balanço */
const lock = (x: number, top: number, len: number, w: number, sway: number, waves = 3) => {
  const bx = x + sway * len / 60;
  let d = `M${x - w / 2},${top} C${x - w / 2 - 6},${top + len * 0.4} ${bx - w / 2 - 4},${top + len * 0.7} ${bx - w / 2},${top + len}`;
  const step = w / waves;
  for (let i = 0; i < waves; i++) {
    const x0 = bx - w / 2 + step * i;
    d += ` Q${x0 + step / 2},${top + len + 9} ${x0 + step},${top + len - (i === waves - 1 ? 0 : 2)}`;
  }
  d += ` C${bx + w / 2 + 4},${top + len * 0.7} ${x + w / 2 + 6},${top + len * 0.4} ${x + w / 2},${top} Z`;
  return d;
};

const HairBack: React.FC<{style: Palette['hairStyle']; col: string; look: number; sway: number; t: number}> = ({style, col, look, sway, t}) => {
  const idle = Math.sin(t * 1.3) * 1.5;
  if (style === 'maya') {
    return (
      <g fill={col}>
        <ellipse cx={-4 - look * 6} cy={-6} rx={42} ry={40} />
        <path d={lock(-30 - look * 8, -10, 66, 30, sway + idle, 3)} />
        <path d={lock(26 - look * 22, -10, 62, 26, sway + idle, 3)} opacity={Math.max(0, 1 - Math.abs(look) * 1.1)} />
      </g>
    );
  }
  if (style === 'future') {
    return (
      <g fill={col}>
        <ellipse cx={-4 - look * 6} cy={-6} rx={41} ry={40} />
        <path d={lock(-28 - look * 8, -10, 104, 32, sway * 0.6 + idle * 0.5, 2)} />
        <path d={lock(26 - look * 22, -10, 98, 26, sway * 0.6 + idle * 0.5, 2)} opacity={Math.max(0, 1 - Math.abs(look) * 1.1)} />
      </g>
    );
  }
  if (style === 'bun') return <circle cx={-26 - look * 10} cy={-30} r={17} fill={col} />;
  return null;
};

const HairFront: React.FC<{style: Palette['hairStyle']; col: string; look: number; sway: number; accent?: string}> = ({style, col, look, sway}) => {
  const o = look * 5;
  switch (style) {
    case 'maya':
      return (
        <g fill={col} transform={`translate(${o},0)`}>
          <path d="M-40,4 C-43,-30 -18,-46 4,-44 C28,-42 43,-24 39,2 C34,-12 26,-18 14,-19 C10,-10 0,-6 -8,-8 C-14,-14 -20,-12 -26,-10 C-32,-6 -36,-2 -40,4 Z" />
          <path d={`M-40,2 C-44,18 -42,34 -36,${44 + sway * 0.2} C-34,32 -34,18 -30,8 Z`} />
        </g>
      );
    case 'future':
      return (
        <g fill={col} transform={`translate(${o},0)`}>
          <path d="M-40,8 C-44,-30 -16,-46 6,-44 C28,-42 42,-26 40,-2 C30,-20 6,-24 -10,-20 C-22,-16 -32,-8 -40,8 Z" />
          <path d={`M-40,4 C-44,24 -42,46 -38,${62 + sway * 0.2} C-34,44 -34,24 -32,8 Z`} />
        </g>
      );
    case 'noah':
      return (
        <g fill={col} transform={`translate(${o},0)`}>
          <path d="M-38,-2 C-41,-32 -16,-46 6,-44 C28,-43 41,-30 38,-8 C34,-14 30,-18 24,-20 L22,-14 L16,-21 L10,-15 L4,-22 C-10,-24 -24,-20 -32,-10 C-35,-6 -37,-4 -38,-2 Z" />
        </g>
      );
    case 'short':
      return <path fill={col} transform={`translate(${o},0)`} d="M-38,-4 C-40,-34 -14,-45 6,-44 C28,-43 40,-30 38,-10 C28,-22 -10,-26 -38,-4 Z" />;
    case 'slick':
      return <path fill={col} transform={`translate(${o},0)`} d="M-38,-6 C-38,-36 -10,-44 10,-43 C30,-41 40,-28 39,-14 C20,-30 -14,-30 -38,-6 Z" />;
    case 'bun':
      return <path fill={col} transform={`translate(${o},0)`} d="M-38,0 C-40,-32 -14,-45 6,-44 C28,-43 40,-30 38,-8 C24,-26 -14,-28 -38,0 Z" />;
    case 'cap':
      return (
        <g fill={col} transform={`translate(${o},0)`}>
          <path d="M-36,-10 C-36,-38 -10,-44 6,-44 C26,-43 38,-32 37,-12 Z" />
          <path d="M20,-14 L62,-12 Q64,-6 58,-5 L18,-6 Z" />
        </g>
      );
    default:
      return null;
  }
};
