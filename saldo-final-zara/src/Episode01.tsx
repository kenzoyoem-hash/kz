import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SCENES, FPS} from './data/timeline';
import {Subtitles} from './components/Subtitles';
import {Flash, Grain} from './components/Effects';
import {TextLayer} from './components/TextLayer';
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

const COMPONENTS = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09];
const FLASHES: [number, string, number, number][] = [
  [12.4, '#FFFFFF', 0.08, 0.5], [19.6, '#FFFFFF', 0.12, 0.7], [24.6, '#FFFFFF', 0.12, 0.6], [38.7, '#F5B83D', 0.18, 0.5],
  [42.95, '#2EC4B6', 0.1, 0.4], [58.3, '#3FA7FF', 0.15, 0.6], [77.4, '#FFFFFF', 0.12, 0.6],
];

/** SALDO FINAL — EP. 01: QUANTO VALE SUA VIDA? (89 s). textLayer=false gera a versão limpa, sem nenhum texto. */
export const Episode01: React.FC<{textLayer: boolean}> = ({textLayer}) => {
  const t = useCurrentFrame() / FPS;
  const idx = SCENES.findIndex((s) => t >= s.start && t < s.end);
  const Scene = COMPONENTS[idx === -1 ? COMPONENTS.length - 1 : idx];
  const fl = FLASHES.map(([ft, col, w, a]) => ({col, a: bump(t, ft, w) * a})).sort((p, q) => q.a - p.a)[0];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Scene t={t} />
      <Grain t={t} amt={0.05} />
      <Flash amt={fl.a} col={fl.col} />
      {textLayer && <Subtitles t={t} />}
      {textLayer && <TextLayer t={t} />}
      <Audio src={staticFile('audio/mix_ep01.wav')} />
    </AbsoluteFill>
  );
};
