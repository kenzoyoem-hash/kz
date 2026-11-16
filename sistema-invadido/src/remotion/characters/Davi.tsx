import React from 'react';
import {Person, PersonProps, Look} from './Person';

/** DAVI — funcionário da manutenção (~30 anos). Aparência FIXA da série. */
export const DAVI_LOOK: Look = {
  skin: '#c98f6b', skinShade: '#a87455', hair: '#5a3a22', hairStyle: 'short',
  shirt: '#5f7690', shirtShade: '#4d6178', longSleeves: true, pants: '#3e4f63', shoe: '#2a2f38', sole: '#1c1f26',
  brow: 10, badge: 'DAVI',
};
/** chaveiro metálico (desenhado preso à mão; origem = centro da mão) */
export const Keychain: React.FC<{swing?: number}> = ({swing = 0}) => (
  <g transform={`rotate(${swing})`}>
    <circle cx={0} cy={26} r={14} fill="none" stroke="#c9cfdb" strokeWidth={5} />
    {[-18, 0, 18].map((a, i) => (
      <g key={i} transform={`translate(0,38) rotate(${a})`}>
        <rect x={-5} y={0} width={10} height={46} rx={3} fill={i === 1 ? '#d8b44a' : '#b8c0cf'} />
        <rect x={-9} y={0} width={18} height={14} rx={7} fill={i === 1 ? '#d8b44a' : '#b8c0cf'} />
      </g>
    ))}
  </g>
);
export const Davi: React.FC<Omit<PersonProps, 'look'>> = (p) => <Person look={DAVI_LOOK} seed={7} {...p} />;
