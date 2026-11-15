import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bia, POSES, Expr} from './characters/Bia';
import {Resident, LOOKS} from './characters/Resident';
import {C, FONT} from './theme';

/** Folha de modelo dos personagens (referência de consistência para todos os episódios) */
export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const exprs: Expr[] = ['neutral', 'surprised', 'shock', 'fear', 'suspicious', 'determined'];
  return (
    <AbsoluteFill style={{background: C.night}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <text x={540} y={110} fill={C.white} fontFamily={FONT.title} fontSize={64} textAnchor="middle">BIA — MODELO</text>
        <Bia t={t} x={200} y={1000} scale={0.95} pose={POSES.idle} />
        <Bia t={t} x={540} y={1000} scale={0.95} pose={POSES.phoneL} phone="L" phoneLit expr="surprised" />
        <Bia t={t} x={880} y={1000} scale={0.95} pose={POSES.idle} facing="back" />
        {exprs.map((e, i) => (
          <g key={e} transform={`translate(${180 + (i % 3) * 360}, ${i < 3 ? 1260 : 1660})`}>
            <clipPath id={`c${i}`}><rect x={-160} y={-170} width={320} height={330} rx={30} /></clipPath>
            <rect x={-160} y={-170} width={320} height={330} rx={30} fill={C.wall} />
            <g clipPath={`url(#c${i})`}><g transform="translate(0, 700)"><Bia t={t} expr={e} pose={POSES.idle} lookX={i === 4 ? 0.6 : 0} /></g></g>
            <text x={0} y={210} fill={C.gray} fontFamily={FONT.mono} fontSize={30} textAnchor="middle">{e}</text>
          </g>
        ))}
      <Resident t={t} look={LOOKS.homemAzul} action="walk" x={200} y={1900} scale={0.55} />
        <Resident t={t} look={LOOKS.senhora} action="bang" x={420} y={1900} scale={0.55} />
        <Resident t={t} look={LOOKS.rapaz} action="run" x={640} y={1900} scale={0.55} dir={-1} />
        <Resident t={t} look={LOOKS.moca} action="push" x={860} y={1900} scale={0.55} />
      </svg>
    </AbsoluteFill>
  );
};
