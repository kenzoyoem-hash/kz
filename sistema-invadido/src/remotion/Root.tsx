import React from 'react';
import {Composition, Folder} from 'remotion';
import {CharacterSheet} from './CharacterSheet';
import {Ep01, EP01_FRAMES} from './episodes/ep01/Ep01';
import {Ep02a, EP02A_FRAMES} from './episodes/ep02a/Ep02a';
import './Fonts';

export const Root: React.FC = () => (
  <>
    <Folder name="Episodios">
      <Composition id="EP01" component={Ep01} durationInFrames={EP01_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP02A" component={Ep02a} durationInFrames={EP02A_FRAMES} fps={30} width={1080} height={1920} />
    </Folder>
    <Folder name="Modelos">
      <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1080} height={1920} />
    </Folder>
  </>
);
