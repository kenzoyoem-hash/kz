import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Maya} from './characters/Maya';
import {Noah} from './characters/Noah';
import {FutureMaya} from './characters/FutureMaya';
import {Extra} from './characters/Extras';
import {POSES, walk} from './characters/poses';
import {C, FONT} from './styles/theme';

/** Folha de modelos oficiais (continuidade visual). Composição "Personagens" no Remotion Studio. */
export const CharacterSheet: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const label = (x: number, y: number, s: string) => (
    <text x={x} y={y} fill={C.white} fontFamily={FONT.bold} fontSize={34} textAnchor="middle">{s}</text>
  );
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <text x={540} y={110} fill={C.white} fontFamily={FONT.title} fontSize={64} textAnchor="middle">SALDO FINAL</text>
        <text x={540} y={160} fill={C.purple} fontFamily={FONT.semi} fontSize={30} textAnchor="middle">MODELOS OFICIAIS DOS PERSONAGENS</text>
        <rect x={0} y={700} width={1080} height={4} fill="#1E2A48" />
        <Maya t={t} pose={POSES.stand} x={200} y={700} s={1.25} />
        <Noah t={t} pose={POSES.standRelax} x={540} y={700} s={1.25} facing={-1} />
        <FutureMaya t={t} pose={POSES.rigid} x={880} y={700} s={1.25} facing={-1} />
        {label(200, 770, 'MAYA · 22')}{label(540, 770, 'NOAH · 23')}{label(880, 770, 'MAYA · 2041')}
        <rect x={0} y={1250} width={1080} height={4} fill="#1E2A48" />
        <Maya t={t} pose={(tt) => walk(tt * 1.6)} x={140} y={1250} s={0.95} />
        <Maya t={t} pose={POSES.cheer} x={340} y={1250} s={0.95} />
        <Maya t={t} pose={POSES.standPhone} prop="phone" faceGlow={1} x={540} y={1250} s={0.95} />
        <Maya t={t} pose={POSES.shock} x={740} y={1250} s={0.95} facing={-1} />
        <Maya t={t} pose={POSES.standPhoneEar} prop="phoneEar" x={940} y={1250} s={0.95} facing={-1} />
        <rect x={60} y={1700} width={960} height={4} fill="#1E2A48" />
        <rect x={120} y={1600} width={220} height={20} fill="#2A2350" />
        <Maya t={t} pose={POSES.sitPhone} prop="phone" faceGlow={1} x={230} y={1700} s={0.95} />
        <Extra kind="worker" t={t} pose={POSES.stand} x={480} y={1700} s={0.95} />
        <Extra kind="rich" t={t} pose={POSES.armsUp} x={640} y={1700} s={0.95} facing={-1} />
        <Extra kind="p1" t={t} pose={(tt) => walk(tt * 1.5 + 0.3)} x={800} y={1700} s={0.95} />
        <Extra kind="p2" t={t} pose={(tt) => walk(tt * 1.5)} x={950} y={1700} s={0.95} facing={-1} />
      </svg>
    </AbsoluteFill>
  );
};
