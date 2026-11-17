import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SCENES, FPS} from './data/timeline';
import {Subtitles} from './components/Subtitles';
import {Flash, Grain} from './components/Effects';
import {bump} from './lib/anim';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene11} from './scenes/Scene11';

const COMPONENTS = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11];

/** transições luminosas entre cenas: [tempo, cor, largura] */
const FLASHES: [number, string, number, number?][] = [
  [3.0, '#FFFFFF', 0.12], [11.0, '#8A45FF', 0.16], [26.0, '#36B7FF', 0.1], [35.0, '#090E1B', 0.2],
  [41.0, '#36B7FF', 0.25, 0.45], [43.0, '#F2C14E', 0.12], [53.55, '#FF3B4E', 0.14], [68.0, '#FF3B4E', 0.12], [75.5, '#FFFFFF', 0.12], [77.0, '#090E1B', 0.25],
];

/** SALDO FINAL — EP. 01: CINCO ANOS POR R$ 80 MIL (89 s, 1080×1920, 30 fps) */
export const Episode01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = SCENES.findIndex((s) => t >= s.start && t < s.end);
  const Scene = COMPONENTS[idx === -1 ? COMPONENTS.length - 1 : idx];
  const flash = FLASHES.map(([ft, col, w, amp]) => ({col, a: bump(t, ft, w) * (amp ?? (col === '#090E1B' ? 1 : 0.85))})).sort((a, b) => b.a - a.a)[0];
  return (
    <AbsoluteFill style={{background: '#090E1B'}}>
      <Scene t={t} />
      <Grain t={t} amt={0.06} />
      <Flash amt={flash.a} col={flash.col} />
      <Subtitles t={t} />
      <Audio src={staticFile('audio/mix_ep01.wav')} />
    </AbsoluteFill>
  );
};
