import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bia, POSES} from './characters/Bia';
import {Man} from './characters/Man';
import {Clara} from './characters/Clara';
import {Davi} from './characters/Davi';
import {C, FONT} from './theme';

/** Folha de modelo: poses/gestos, vistas e personagens (referência de consistência) */
export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const cells: [string, React.ReactNode][] = [
    ['idle', <Bia t={t} />],
    ['phone both', <Bia t={t} phone="both" phoneLit expr="surprised" />],
    ['phoneEar', <Bia t={t} pose={POSES.phoneEar} phone="L" expr="confused" />],
    ['stop', <Bia t={t} pose={POSES.stop} expr="determined" mouth={0.6} />],
    ['coverMouth', <Bia t={t} pose={POSES.coverMouth} expr="fear" />],
    ['pointPhone', <Bia t={t} pose={POSES.pointPhone} phone="L" expr="suspicious" />],
    ['costas: empurrar', <Bia t={t} pose={POSES.push} facing="back" />],
    ['lado: andando', <Bia t={t} facing="side" walk={1} />],
    ['lado: corrimão', <Bia t={t} facing="side" dir={-1} pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 55, nEl: -10, nHand: 'grip', lean: 12}} expr="worried" lookY={0.8} />],
    ['homem: implorando', <Man t={t} pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -90, y: -600}, lT: {x: 90, y: -600}, rFs: 0.7, lFs: 0.7, rHand: 'open', lHand: 'open', rHandRot: 170, lHandRot: -170}} expr="worried" mouth={0.5} lookY={-0.8} />],
    ['homem: lado', <Man t={t} facing="side" dir={-1} walk={1} expr="fear" />],
    ['clara', <Clara t={t} expr="worried" />],
    ['clara costas', <Clara t={t} facing="back" />],
    ['davi', <Davi t={t} />],
  ];
  return (
    <AbsoluteFill style={{background: C.night}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        {cells.map(([name, el], i) => (
          <g key={name} transform={`translate(${180 + (i % 3) * 360}, ${i < 3 ? 480 : i < 6 ? 900 : i < 9 ? 1320 : 1740})`}>
            <g transform="scale(0.5)">{el}</g>
            <text x={0} y={-440} fill={C.gray} fontFamily={FONT.mono} fontSize={26} textAnchor="middle">{name}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
