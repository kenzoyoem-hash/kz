import React from 'react';

/** Morador genérico (aparece só nas câmeras de segurança). Vista lateral simplificada. */
export type ResidentLook = {shirt: string; pants: string; skin: string; hair: string; hairStyle?: 'short' | 'bun' | 'bald' | 'cap'};
export const LOOKS: Record<string, ResidentLook> = {
  homemAzul: {shirt: '#2f6fd6', pants: '#2a2f3d', skin: '#d9a383', hair: '#2b1d14', hairStyle: 'short'}, // homem de blusa azul (escada)
  senhora: {shirt: '#8a4f9e', pants: '#3b3346', skin: '#f0c7a8', hair: '#c9c9cf', hairStyle: 'bun'},
  rapaz: {shirt: '#3fa36b', pants: '#1f2430', skin: '#8d5a3b', hair: '#111', hairStyle: 'cap'},
  moca: {shirt: '#e0a33a', pants: '#24324a', skin: '#c58b66', hair: '#3a2416', hairStyle: 'bun'},
  senhor: {shirt: '#9aa3b5', pants: '#3a3a3a', skin: '#e8b896', hair: '#777', hairStyle: 'bald'},
  vizinho: {shirt: '#b8423a', pants: '#20242e', skin: '#a8724f', hair: '#1a1a1a', hairStyle: 'short'},
};

type Props = {
  t: number; look: ResidentLook; action?: 'idle' | 'walk' | 'run' | 'bang' | 'push';
  dir?: 1 | -1; x?: number; y?: number; scale?: number; speed?: number;
};

export const Resident: React.FC<Props> = ({t, look, action = 'idle', dir = 1, x = 0, y = 0, scale = 1, speed = 1}) => {
  const moving = action === 'walk' || action === 'run';
  const f = action === 'run' ? 13 * speed : 7 * speed;
  const amp = action === 'run' ? 38 : action === 'walk' ? 24 : 0;
  const ph = t * f;
  const legA = Math.sin(ph) * amp, legB = -legA;
  const bob = moving ? -Math.abs(Math.sin(ph)) * (action === 'run' ? 10 : 5) : 0;
  let armA = -legA * 0.9, armB = legA * 0.9;
  if (action === 'bang') { const k = Math.max(0, Math.sin(t * 9)); armA = -80 - k * 50; armB = -60 - Math.max(0, Math.sin(t * 9 + 2)) * 50; }
  if (action === 'push') { armA = -85 + Math.sin(t * 6) * 6; armB = -80 + Math.sin(t * 6 + 1) * 6; }
  const lean = action === 'run' ? 10 : action === 'push' ? 14 : action === 'bang' ? 6 : 0;
  const limb = (ang: number, len: number, w: number, col: string, ox: number, oy: number) => {
    const a = (ang * Math.PI) / 180;
    return <path d={`M${ox},${oy} L${ox + Math.sin(a) * len},${oy + Math.cos(a) * len}`} stroke={col} strokeWidth={w} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x},${y + bob}) scale(${dir * scale},${scale})`}>
      <ellipse cx={0} cy={2} rx={46} ry={8} fill="#000" opacity={0.35} />
      {limb(legB, 130, 26, look.pants, 0, -130)}
      {limb(armB, 100, 18, look.shirt, 0, -250)}
      <g transform={`rotate(${lean}, 0, -130)`}>
        <rect x={-34} y={-268} width={68} height={150} rx={26} fill={look.shirt} />
        <circle cx={6} cy={-310} r={42} fill={look.skin} />
        {look.hairStyle === 'short' && <path d="M-36,-318 Q-30,-358 8,-354 Q46,-352 46,-320 Q20,-336 -36,-318 Z" fill={look.hair} />}
        {look.hairStyle === 'bun' && <><path d="M-36,-314 Q-30,-358 8,-354 Q46,-350 44,-316 Q10,-340 -36,-314 Z" fill={look.hair} /><circle cx={-30} cy={-340} r={18} fill={look.hair} /></>}
        {look.hairStyle === 'cap' && <><path d="M-38,-316 Q-34,-360 8,-356 Q48,-354 46,-318 Z" fill={look.hair} /><rect x={20} y={-326} width={46} height={10} rx={5} fill={look.hair} /></>}
        {look.hairStyle === 'bald' && <path d="M-36,-300 Q-40,-330 -26,-338" stroke={look.hair} strokeWidth={10} fill="none" />}
        <circle cx={28} cy={-314} r={5} fill="#111" />
      </g>
      {limb(legA, 130, 26, look.pants, 0, -130)}
      {limb(armA, 100, 18, look.shirt, 0, -250)}
    </g>
  );
};
