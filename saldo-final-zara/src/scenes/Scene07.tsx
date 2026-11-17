import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HospStage, POS} from './Hosp';
import {Toon} from '../characters/Toon';
import {ZARA, HELENA, DANTE, CIRO, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {Glitch, Scanlines, Vignette} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {bump, ease, kf, prog, rnd} from '../lib/anim';

/** holograma: personagem em azul translúcido com linhas e cintilação */
const Holo: React.FC<{t: number; k: number; children: React.ReactNode}> = ({t, k, children}) => {
  const fl = rnd(Math.floor(t * 18)) < 0.08 ? 0.4 : 1;
  return (
    <g opacity={k * fl * 0.92}>
      <defs>
        <filter id="holo"><feColorMatrix type="matrix" values="0.35 0.35 0.3 0 0.05  0.45 0.5 0.4 0 0.12  0.6 0.6 0.6 0 0.25  0 0 0 1 0" /></filter>
        <pattern id="hlines" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="3" fill="#BFE8FF" opacity="0.18" /></pattern>
      </defs>
      <g filter="url(#holo)">{children}</g>
      <rect x={POS.terminal - 170} y={600} width={340} height={480} fill="url(#hlines)" />
      <path d={`M${POS.terminal - 90},1080 L${POS.terminal - 170},640 L${POS.terminal + 170},640 L${POS.terminal + 90},1080 Z`} fill={C.blue} opacity={0.07} />
    </g>
  );
};

/** CENA 07 — CIRO VOSS (58,3–72 s): o holograma da Áurea faz a oferta; Dante "não existe". */
export const Scene07: React.FC<{t: number}> = ({t}) => {
  const zar = say('ZARA', t), dan = say('DANTE', t), ciro = say('CIRO', t);
  const tRapaz = wordAt('l21', 'rapaz');
  const holoK = prog(t, 58.4, 59.1, ease.out);
  const dx = kf(t, [[62.5, POS.dante], [63.3, 1170, ease.out]]);
  const cPose = posekf(t, [[58.4, P.lapel], [60.6, P.lapel], [61.0, P.offer], [62.6, P.offer], [63.0, P.lapel], [tRapaz - 0.3, P.lapel], [tRapaz, {rSh: 10, rEl: 12, lSh: 0, lEl: 0, lT: {x: 190, y: -560}, lHand: 'point', lHandRot: -90}], [69.6, P.lapel]]);
  const dPose = posekf(t, [[62.5, P.relaxed], [63.0, {...P.point, rT: {x: -200, y: -600}}], [66.2, {...P.point, rT: {x: -200, y: -600}}], [66.6, P.relaxed], [69.8, {...P.relaxed, head: -6}]]);
  const cam = t < 62.5 ? {x: POS.terminal, y: kf(t, [[58.3, 960], [62.5, 900]]), z: kf(t, [[58.3, 1.7], [62.5, 2.05]])}
    : t < 66.2 ? {x: 1090, y: 1000, z: kf(t, [[62.5, 1.55], [66.2, 1.7]])}
      : t < 69.6 ? {x: POS.terminal, y: 880, z: kf(t, [[66.2, 2.2], [69.6, 2.45]])}
        : t < 70.9 ? {x: POS.zara, y: 1010, z: 2.5}
          : {x: 1170, y: 1010, z: kf(t, [[70.9, 2.4], [72, 2.6]])};
  const ciroY = 1035;
  return (
    <Glitch amt={bump(t, 58.35, 0.15) + bump(t, 66.3, 0.08) * 0.5} t={t}>
      <HospStage t={t} cam={cam} towerGlow={0.5} term={t < 58.7 ? 'glitch' : 'idle'}
        helena={<Toon t={t} look={HELENA} pose={{rSh: 14, rEl: 40, lSh: 14, lEl: 40, head: 14}} expr="weak" x={POS.helena} y={POS.helenaY} scale={POS.helenaS} noLegs band={0.02} lookX={0.8} seed={6} />}
        front={<>
          <Toon t={t} look={ZARA} pose={posekf(t, [[58.3, {...P.hold, rT: {x: -60, y: -470}, lT: {x: 0, y: -470}}], [59, P.relaxed], [69.6, P.relaxed], [69.9, {...P.coverMouth, head: -4}]])}
            x={POS.zara} y={POS.floor} scale={POS.s} band={0.82} expr={exprAt(t, [[58.3, 'fear'], [60.5, 'angry'], [66.4, 'worried'], [69.6, 'shock']])}
            talk={zar.talk} vis={zar.vis} lookX={t > 69.6 ? 1 : 0.7} lookY={t < 69.6 ? -0.4 : 0} seed={1} />
          <Toon t={t} look={DANTE} pose={dPose} x={dx} y={POS.floor} scale={0.69} band={0.5}
            expr={exprAt(t, [[58.3, 'surprised'], [62.5, 'angry'], [66.4, 'cold'], [70.9, 'neutral']])} talk={dan.talk} vis={dan.vis} lookX={t > 70.9 ? -0.2 : -0.9} lookY={t < 70.9 ? -0.3 : 0.4} seed={4} />
          <Holo t={t} k={holoK}>
            <Toon t={t} look={CIRO} pose={cPose} x={POS.terminal} y={ciroY} scale={0.46} expr={exprAt(t, [[58.3, 'cold'], [tRapaz, 'smirk']])}
              talk={ciro.talk} vis={ciro.vis} lookX={t > tRapaz - 0.3 && t < 69.6 ? 0.7 : -0.5} noLegs seed={8} />
          </Holo>
        </>}
      />
      <Scanlines amt={0.06} t={t} />
      <Vignette amt={0.6} col="0,10,30" />
    </Glitch>
  );
};
