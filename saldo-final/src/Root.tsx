import React from 'react';
import {Composition} from 'remotion';
import {Episode01} from './Episode01';
import {CharacterSheet} from './CharacterSheet';
import {DURATION_FRAMES, FPS} from './data/timeline';
import './components/Fonts';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="EP01" component={Episode01} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Personagens" component={CharacterSheet} durationInFrames={90} fps={FPS} width={1080} height={1920} />
  </>
);
