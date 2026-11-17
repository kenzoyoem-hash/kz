import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ZARA, DANTE, HELENA, CIRO, ATENDENTE, JOVEM, RAPAZ, P} from './characters/Cast';
import {Toon} from './characters/Toon';
import {C} from './styles/theme';

/** Folha de modelos oficiais (sem textos — os nomes ficam no guia de continuidade). */
export const CharacterSheet: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{background: '#1A1E2E'}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <rect x={0} y={900} width={1080} height={6} fill="#2A3048" />
        <Toon t={t} look={ZARA} pose={P.handsHips} expr="sarcastic" x={150} y={900} scale={0.62} band={0.8} />
        <Toon t={t} look={DANTE} pose={P.armsCrossed} expr="smirk" x={410} y={900} scale={0.62} band={0.5} />
        <Toon t={t} look={HELENA} pose={P.idle} expr="tender" x={670} y={900} scale={0.6} band={0.05} />
        <Toon t={t} look={CIRO} pose={P.lapel} expr="cold" x={930} y={900} scale={0.64} band={1} />
        <rect x={0} y={1750} width={1080} height={6} fill="#2A3048" />
        <Toon t={t} look={ZARA} pose={P.headHands} expr="shock" x={140} y={1380} scale={0.42} noLegs />
        <Toon t={t} look={ZARA} pose={P.weapon} expr="angry" x={340} y={1380} scale={0.42} noLegs />
        <Toon t={t} look={ZARA} pose={P.phoneLook} phone="L" phoneGlow="#3FA7FF" expr="worried" x={540} y={1380} scale={0.42} noLegs />
        <Toon t={t} look={ZARA} pose={P.pointFwd} expr="determined" x={740} y={1380} scale={0.42} noLegs />
        <Toon t={t} look={ZARA} pose={P.coverMouth} expr="sad" x={940} y={1380} scale={0.42} noLegs />
        <Toon t={t} look={ZARA} facing="side" run={1} x={150} y={1750} scale={0.42} band={0.8} />
        <Toon t={t} look={ATENDENTE} pose={P.wave} expr="smile" x={390} y={1750} scale={0.42} />
        <Toon t={t} look={JOVEM} facing="side" expr="sad" x={600} y={1750} scale={0.42} dir={-1} />
        <Toon t={t} look={RAPAZ} facing="side" phone="R" expr="neutral" x={780} y={1750} scale={0.42} />
        <Toon t={t} look={ZARA} facing="side" walk={1} x={960} y={1750} scale={0.42} dir={-1} />
      </svg>
    </AbsoluteFill>
  );
};
