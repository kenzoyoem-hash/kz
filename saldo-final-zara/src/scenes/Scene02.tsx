import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {AgencyBack, AGENCY} from '../sets/Sets';
import {Toon} from '../characters/Toon';
import {ZARA_DELIVERY, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {Vignette} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {FoodBag} from './Scene01';
import {C} from '../styles/theme';
import {ease, kf, prog, shake, wobble} from '../lib/anim';

/** CENA 02 — A LIGAÇÃO (12,4–19,6 s): o hospital avisa que o saldo da mãe está zerando. */
export const Scene02: React.FC<{t: number}> = ({t}) => {
  const tHosp = wordAt('l06', 'hospital'), tZer = wordAt('l06', 'zerando');
  const zar = say('ZARA', t);
  const running = t >= 19.0;
  const pose = posekf(t, [
    [12.4, {rSh: 20, rEl: 60, lSh: 10, lEl: 14, rHand: 'grip'}],
    [12.9, {rSh: 20, rEl: 60, lSh: 0, lEl: 0, lT: {x: 60, y: -420}, lHand: 'grip', rHand: 'grip'}],
    [13.3, {rSh: 20, rEl: 60, lSh: 0, lEl: 0, lT: {x: 96, y: -700}, lHand: 'grip', rHand: 'grip', head: 4}],
    [tZer, {rSh: 20, rEl: 60, lSh: 0, lEl: 0, lT: {x: 96, y: -700}, lHand: 'grip', rHand: 'grip', head: -4}],
    [16.6, {rSh: 34, rEl: 30, lSh: 0, lEl: 0, lT: {x: 96, y: -700}, lHand: 'grip', rHand: 'open', lean: -3}],
    [18.4, {rSh: 50, rEl: 40, lSh: 0, lEl: 0, lT: {x: 96, y: -700}, lHand: 'grip', rHand: 'open', lean: 2}],
  ]);
  const bagFall = prog(t, 18.4, 18.8, ease.in);
  const sk = shake(t, tZer, 12, 0.5, 4);
  const z = kf(t, [[12.4, 2.3], [tZer - 0.1, 2.6, ease.linear], [tZer + 0.15, 3.1, ease.out], [19.6, 3.0]]);
  const buzz = t > 12.4 && t < 13.0 ? wobble(t * 60, 1) * 4 : 0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 1880 + sk.x, y: 1050 + sk.y, z}} bg="#E9DFC7">
        <Layer depth={0.85}><AgencyBack t={t} /><rect x={-600} y={-800} width={3600} height={3000} fill="#0A0A14" opacity={prog(t, tHosp, tZer + 0.5) * 0.45} /></Layer>
        <Layer depth={1}>
          {!running ? (
            <Toon t={t} look={ZARA_DELIVERY} pose={pose} x={1880 + buzz} y={AGENCY.floor} scale={0.62} band={0.82} phone={t > 13.0 ? 'ear' : 'none'}
              expr={exprAt(t, [[12.4, 'sarcastic'], [12.9, 'neutral'], [tHosp, 'worried'], [tZer, 'shock'], [16.6, 'fear'], [17.6, 'angry']])}
              talk={zar.talk} vis={zar.vis} lookX={t > 13.3 ? 0.3 : 0} holdR={bagFall === 0 ? <FoodBag /> : undefined} tremble={t > tZer ? 0.4 : 0} seed={1} />
          ) : (
            <Toon t={t} look={ZARA_DELIVERY} facing="side" run={1} dir={1} x={kf(t, [[19.0, 1880], [19.6, 2120, ease.in]])} y={AGENCY.floor} scale={0.62} expr="fear" band={0.82} seed={1} />
          )}
          {bagFall > 0 && (
            <g transform={`translate(${1820 + bagFall * 20},${1240 + bagFall * 250}) rotate(${bagFall * 60})`}><FoodBag /></g>
          )}
          {t > 12.4 && t < 13.0 && <g stroke={C.outline} strokeWidth={5} strokeLinecap="round">
            <path d="M1960,1250 q12,10 0,20 M1975,1240 q18,20 0,40" fill="none" /></g>}
        </Layer>
      </Stage>
      <Vignette amt={0.55 + prog(t, tZer, tZer + 0.4) * 0.25} />
    </AbsoluteFill>
  );
};
