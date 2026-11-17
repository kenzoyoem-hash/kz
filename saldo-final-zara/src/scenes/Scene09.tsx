import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {Toon} from '../characters/Toon';
import {ZARA, DANTE, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {AureaTerminal} from '../sets/Sets';
import {Dust, Vignette} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {ease, kf, prog} from '../lib/anim';

/** CENA 09 — VOTAÇÃO (77,4–89 s): Zara fala direto com o público. À esquerda o brilho dourado da Áurea (A),
 * à direita a silhueta do Dante (B). A cartela com o texto A/B entra na camada de edição. */
export const Scene09: React.FC<{t: number}> = ({t}) => {
  const zar = say('ZARA', t);
  const tCom = wordAt('l24', 'Comenta');
  const tA = wordAt('l24', 'A', 1), tB = wordAt('l24', 'B');
  const pose = posekf(t, [
    [77.4, {...P.idle, head: 4}],
    [78.4, {...P.wristLook, head: 6}],
    [80.0, {...P.wristLook, head: 6}],
    [80.6, {...P.handsUp, head: -2}],
    [tCom - 0.1, P.relaxed],
    [tCom + 0.25, P.pointFwd, ease.out],
    [tA, {...P.offer, rT: {x: -190, y: -560}}],
    [tB, {rSh: 10, rEl: 12, lSh: 0, lEl: 0, lT: {x: 190, y: -560}, lHand: 'open', lHandRot: -230}],
    [tB + 0.6, P.handsHips],
    [89, P.handsHips],
  ]);
  const lookX = t > tB + 0.8 ? Math.sin((t - tB) * 1.4) * 0.8 : t > tA && t < tB ? -0.7 : t > tB ? 0.7 : 0;
  const leftGlow = 0.5 + 0.5 * (t > tA && t < tB + 0.1 ? 1 : 0) + (t > tB + 0.8 ? 0.3 * Math.sin(t * 2) : 0);
  const rightGlow = 0.5 + 0.5 * (t > tB ? 1 : 0);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: kf(t, [[77.4, 930], [89, 900]]), z: kf(t, [[77.4, 1.55], [89, 1.8]])}} bg="#06070D">
        <Layer depth={0.6}>
          <rect x={-1000} y={-1000} width={1540} height={4000} fill={C.gold} opacity={0.08 * leftGlow} />
          <rect x={540} y={-1000} width={1540} height={4000} fill={C.teal} opacity={0.08 * rightGlow} />
          <AureaTerminal x={140} y={1500} t={t} mode="transfer" k={1} s={1.1} />
          <circle cx={140} cy={1080} r={260} fill={C.gold} opacity={0.18 * leftGlow} />
          <g opacity={0.9}><Toon t={t} look={DANTE} pose={P.armsCrossed} x={960} y={1500} scale={0.7} expr="cold" lookX={-0.6} tint="#000" seed={4} /></g>
          <rect x={700} y={500} width={600} height={1100} fill="#06070D" opacity={0.55} />
          <circle cx={960} cy={1000} r={300} fill={C.teal} opacity={0.12 * rightGlow} />
        </Layer>
        <Layer depth={0.8}><Dust t={t} n={40} col={C.gold} opacity={0.4} speed={25} /></Layer>
        <Layer depth={1}>
          <Toon t={t} look={ZARA} pose={pose} x={540} y={1500} scale={0.7} band={0.82} bandGlow={t > 78.4 && t < 80.6 ? 0.7 : 0}
            expr={exprAt(t, [[77.4, 'sad'], [78.4, 'worried'], [80.2, 'angry'], [tCom, 'determined'], [tB + 0.8, 'sarcastic']])}
            talk={zar.talk} vis={zar.vis} lookX={lookX} faceLight={t > tA && t < tB ? C.gold : undefined} seed={1} />
        </Layer>
      </Stage>
      <Vignette amt={0.7} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - prog(t, 77.4, 77.7)}} />
    </AbsoluteFill>
  );
};
