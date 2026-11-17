import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {AgencyBack, AgencyCounter, AGENCY} from '../sets/Sets';
import {Toon, extraLook} from '../characters/Toon';
import {ATENDENTE, JOVEM, RAPAZ, ZARA_DELIVERY, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {YearStream, Vignette} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {bump, ease, kf, prog} from '../lib/anim';

/** sacola de entrega na mão da Zara */
export const FoodBag: React.FC = () => (
  <g transform="translate(0,10)">
    <path d="M-34,0 L34,0 L42,90 L-42,90 Z" fill="#C9935A" stroke={C.outline} strokeWidth={5} />
    <path d="M-16,0 Q0,-26 16,0" stroke={C.outline} strokeWidth={6} fill="none" />
    <rect x={-42} y={40} width={84} height={14} fill={C.red} stroke={C.outline} strokeWidth={3} />
  </g>
);

/** CENA 01 — AGÊNCIA ÁUREA (0–12,4 s): vender anos é tão normal quanto pagar um boleto. */
export const Scene01: React.FC<{t: number}> = ({t}) => {
  const F = AGENCY.floor;
  const tConf = wordAt('l03', 'confirmado');
  const scan = prog(t, 4.6, 5.0) * (1 - prog(t, 6.4, 6.9));
  const band = kf(t, [[4.8, 0.62], [6.2, 0.5]]);
  // câmera: close no leitor dourado -> atendente -> balcão -> fila -> porta (Zara chega)
  const camX = kf(t, [[0, 640], [1.5, 560, ease.out], [2.3, 600], [4.2, 650], [6.8, 700], [8.4, 1420, ease.inOut], [9.6, 1830, ease.inOut], [12.4, 1860]]);
  const camY = kf(t, [[0, 1170], [1.5, 1060, ease.out], [4.2, 1100], [6.8, 1110], [8.4, 1130], [9.6, 1060], [12.4, 1050]]);
  const z = kf(t, [[0, 3.4], [1.5, 2.1, ease.out], [2.3, 1.75], [4.2, 1.9], [6.8, 1.8], [8.4, 1.6], [9.6, 2.05], [12.4, 2.25]]);
  const att = say('ATENDENTE', t), jov = say('JOVEM', t), raz = say('RAPAZ', t), zar = say('ZARA', t);
  const attPose = posekf(t, [[0, P.idle], [0.25, P.wave], [1.6, P.wave], [2.1, P.idle], [tConf - 0.2, P.idle], [tConf, {...P.pointFwd, head: -4}], [6.4, P.idle]]);
  // Zara: entra pela porta (lateral) e vira de frente com a sacola erguida
  const zFront = t >= 9.55;
  const zx = zFront ? 1880 : kf(t, [[8.5, 2260], [9.55, 1890, ease.linear]]);
  const zPose = posekf(t, [[9.55, P.idle], [9.9, {...P.wave, rT: {x: -150, y: -660}, rHand: 'grip'}], [11.6, {...P.wave, rT: {x: -150, y: -660}, rHand: 'grip'}], [12.4, {rSh: 20, rEl: 60, lSh: 10, lEl: 14, rHand: 'grip'}]]);
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: camY, z}} bg="#E9DFC7">
        <Layer depth={0.92}><AgencyBack t={t} boost={bump(t, 5.6, 1.2)} /></Layer>
        <Layer depth={1}>
          {/* atendente atrás do balcão */}
          <Toon t={t} look={ATENDENTE} pose={attPose} expr={exprAt(t, [[0, 'smile'], [4.0, 'smile']])} x={AGENCY.attendant} y={F} scale={0.6}
            talk={att.talk} vis={att.vis} lookX={t < 2.3 ? 0 : 0.6} band={1} seed={3} />
          <AgencyCounter t={t} scan={scan} />
          {/* jovem no guichê (vista lateral), estende o pulso no leitor */}
          <Toon t={t} look={JOVEM} facing="side" dir={-1} x={800} y={F} scale={0.6} expr={exprAt(t, [[0, 'sad'], [5.0, 'worried'], [6.6, 'sad']])}
            talk={jov.talk} vis={jov.vis} nArm={t > 4.4 ? [62, 22] : [10, 18]} band={band} bandGlow={scan} seed={5} />
          <YearStream t={t} t0={4.9} t1={6.2} from={[700, 1150]} to={[640, 1180]} bend={-30} n={30} seed="j1" size={6} />
          <YearStream t={t} t0={5.3} t1={6.8} from={[640, 1170]} to={[980, 250]} bend={-80} n={60} seed="j2" size={7} />
          {/* fila: todos no celular */}
          {[1160, 1360, 1560, 1760].map((x, i) => (
            i === 1 ? <Toon key={i} t={t} look={RAPAZ} facing="side" dir={-1} x={x} y={F} scale={0.6} phone="R" phoneGlow={C.blue}
              expr={exprAt(t, [[0, 'neutral'], [6.8, 'sarcastic']])} talk={raz.talk} vis={raz.vis} lookY={0.4} seed={9} />
              : <Toon key={i} t={t} look={extraLook([3, 11, 27, 40][i])} facing="side" dir={-1} x={x} y={F} scale={0.6} phone="R" phoneGlow={C.blue} lookY={0.5} seed={i} expr="neutral" />
          ))}
          {/* Zara entregadora */}
          {zFront ? (
            <Toon t={t} look={ZARA_DELIVERY} pose={zPose} expr={exprAt(t, [[9.55, 'smile'], [10.4, 'sarcastic']])} x={zx} y={F} scale={0.62}
              talk={zar.talk} vis={zar.vis} lookX={-0.4} band={0.82} holdR={<FoodBag />} seed={1} />
          ) : t > 8.5 && (
            <Toon t={t} look={ZARA_DELIVERY} facing="side" dir={-1} walk={1} x={zx} y={F} scale={0.62} expr="neutral" band={0.82} seed={1} />
          )}
        </Layer>
      </Stage>
      <Vignette amt={0.45} />
    </AbsoluteFill>
  );
};
