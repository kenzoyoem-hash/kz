import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage, Layer} from '../components/Camera';
import {MAYA_S, NoahRoom} from '../components/Background';
import {Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {Noah} from '../characters/Noah';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt, wordAt} from '../data/dialogue';
import {C, FONT} from '../styles/theme';
import {ease, kf, prog, shake, tw, wobble} from '../lib/anim';

/** CENA 05 — O AVISO DE NOAH (00:26–00:35): videochamada em tela dividida. Humor e amizade. */
const PANEL_H = 880;

const Panel: React.FC<{top: number; slide: number; children: React.ReactNode; label: string; dot: string; t: number; border: string}> = ({top, slide, children, label, dot, t, border}) => (
  <div style={{position: 'absolute', left: 28, width: 1024, top, height: PANEL_H, borderRadius: 44, overflow: 'hidden',
    transform: `translateY(${(1 - slide) * (top < 900 ? -1000 : 1000)}px)`, boxShadow: `0 0 0 4px ${border}, 0 20px 60px rgba(0,0,0,0.6)`}}>
    <div style={{position: 'absolute', left: -28, top: -(960 - PANEL_H / 2), width: 1080, height: 1920}}>{children}</div>
    <div style={{position: 'absolute', left: 30, top: 26, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(9,14,27,0.7)',
      padding: '8px 20px', borderRadius: 30, fontFamily: FONT.bold, fontSize: 30, color: C.white, letterSpacing: 2}}>
      <div style={{width: 16, height: 16, borderRadius: 8, background: dot, opacity: 0.6 + 0.4 * Math.sin(t * 6)}} />{label}
    </div>
  </div>
);

/** mão aberta com cinco dedos empurrada para a câmera ("CINCO ANOS!") */
const FiveHand: React.FC<{x: number; y: number; s: number; r: number}> = ({x, y, s, r}) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <rect x={-70} y={60} width={140} height={260} rx={30} fill="#3D6CA8" />
    <ellipse cx={0} cy={20} rx={92} ry={100} fill={C.skin} />
    {[[-66, -60, -18], [-30, -96, -6], [8, -104, 4], [46, -88, 14]].map(([fx, fy, rr], i) => (
      <rect key={i} x={fx - 17} y={fy - 70} width={34} height={140} rx={17} fill={C.skin} transform={`rotate(${rr} ${fx} ${fy + 60})`} />
    ))}
    <rect x={64} y={-20} width={34} height={110} rx={17} fill={C.skin} transform="rotate(48 80 60)" />
    <ellipse cx={0} cy={30} rx={60} ry={50} fill={C.skinShade} opacity={0.35} />
  </g>
);

export const Scene05: React.FC<{t: number}> = ({t}) => {
  const tMaluca = wordAt('l08', 'maluca');
  const tCinco = wordAt('l08', 'CINCO');
  const tTele = wordAt('l09', 'telepatia');
  const tQuerido = wordAt('l09', 'querido');
  const slide = prog(t, 26.0, 26.35, ease.out);
  const noahPose = posekf(t, [
    [26.0, P({look: 0, aL: [8, 10], aR: [8, 10]})],
    [26.5, P({look: 0, lean: 10, head: 6, aL: [30, 40], aR: [34, 40]})],
    [tMaluca - 0.1, P({...POSES.headHands, lean: 12})],
    [tCinco - 0.35, P({...POSES.headHands, lean: 6})],
    [tCinco, P({look: 0, lean: 14, head: 4, aR: [92, 4], aL: [20, 30], sh: 0.4})],
    [29.9, P({look: 0, lean: 10, head: 4, aR: [88, 6], aL: [20, 30]})],
    [30.4, P({look: 0, lean: -4, head: 10, aL: [40, 112], aR: [44, 106]})],
    [33.0, P({look: 0, lean: -6, head: 14, aL: [40, 112], aR: [44, 106]})],
    [33.35, {...POSES.armsUp, lean: -8, head: -10}, ease.out],
    [35, {...POSES.armsUp, lean: -10, head: -14}],
  ]);
  const laugh = t > 33.1 ? 0.35 + 0.45 * Math.abs(Math.sin(t * 15)) : 0;
  const mayaPose = posekf(t, [
    [26.0, P({...POSES.sit, look: 0, aR: [64, 40], aL: [16, 20]})],
    [26.7, P({...POSES.sit, look: 0, lean: -14, head: -6, aR: [64, 40], aL: [16, 20], sh: 0.5})],   // recua com o grito
    [29.9, P({...POSES.sit, look: 0, lean: -10, head: 6, aR: [64, 40], aL: [16, 20]})],
    [30.4, P({...POSES.sit, look: 0, lean: 2, head: 14, aR: [64, 40], aL: [30, -70]})],
    [tQuerido - 0.1, P({...POSES.sit, look: 0, lean: 4, head: 16, aR: [64, 40], aL: [30, -70]})],
    [tQuerido + 0.2, P({...POSES.sit, look: 0, lean: 6, head: -12, aR: [64, 40], aL: [64, 84], sh: 0.6})],
    [33.2, P({...POSES.sit, look: 0, lean: 2, head: 6, aR: [64, 40], aL: [166, 140], sh: laugh})],
    [35, P({...POSES.sit, look: 0, lean: 4, head: 10, aR: [64, 40], aL: [166, 140], sh: laugh})],
  ]);
  const zN = kf(t, [[26, 2.0], [tCinco - 0.05, 2.05], [tCinco + 0.12, 2.75, ease.out], [29.9, 2.8], [30.2, 2.1, ease.inOut], [33.1, 2.15], [33.3, 2.4, ease.out], [35, 2.45]]);
  const sk = shake(t, tCinco, 14, 0.4, 2);
  const sk2 = shake(t, 33.3, 10, 0.6, 5);
  const zM = kf(t, [[26, 2.1], [tTele - 0.05, 2.15], [tTele + 0.1, 2.5, ease.out], [33.0, 2.55], [33.2, 2.2], [35, 2.3]]);
  const five = prog(t, tCinco - 0.05, tCinco + 0.18, ease.back) * (1 - prog(t, 29.9, 30.2));
  return (
    <AbsoluteFill style={{background: '#070A14'}}>
      <Panel top={70} slide={slide} label="NOAH" dot="#2FBF71" t={t} border="#36B7FF">
        <Stage cam={{x: 540 + sk.x + sk2.x, y: 1150 + sk.y, z: zN}} bg="#1B1530">
          <Layer depth={0.9}><NoahRoom t={t} /></Layer>
          <Layer depth={1}>
            <Noah t={t} pose={noahPose} x={540} y={1500} s={1.3} voice={voiceAt('NOAH', t)} shadow={false} />
          </Layer>
          {five > 0.01 && <FiveHand x={760} y={1240} s={five * 0.95} r={wobble(t * 4, 3) * 6 - 8} />}
        </Stage>
      </Panel>
      <Panel top={70 + PANEL_H + 40} slide={slide} label="VOCÊ" dot={C.red} t={t} border={C.purple}>
        <AptStage t={t} cam={{x: 760, y: 1170, z: zM}} dark={0.1}>
          <Maya t={t} pose={mayaPose} x={740} y={1500} s={MAYA_S} voice={voiceAt('MAYA', t)} faceGlow={0.6} />
        </AptStage>
      </Panel>
      <Vignette amt={0.45} />
    </AbsoluteFill>
  );
};
