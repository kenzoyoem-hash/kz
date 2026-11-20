import React from 'react';
import {Composition, Folder} from 'remotion';
import {CharacterSheet} from './CharacterSheet';
import {Ep01, EP01_FRAMES} from './episodes/ep01/Ep01';
import {Ep02a, EP02A_FRAMES} from './episodes/ep02a/Ep02a';
import {Ep02b, EP02B_FRAMES} from './episodes/ep02b/Ep02b';
import {Ep03a, EP03A_FRAMES} from './episodes/ep03a/Ep03a';
import {Ep04, EP04_FRAMES} from './episodes/ep04/Ep04';
import {Ep05, EP05_FRAMES} from './episodes/ep05/Ep05';
import {Ep06, EP06_FRAMES} from './episodes/ep06/Ep06';
import './Fonts';

export const Root: React.FC = () => (
  <>
    <Folder name="Episodios">
      <Composition id="EP01" component={Ep01} durationInFrames={EP01_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP02A" component={Ep02a} durationInFrames={EP02A_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP02B" component={Ep02b} durationInFrames={EP02B_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP03A" component={Ep03a} durationInFrames={EP03A_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP04" component={Ep04} durationInFrames={EP04_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP05" component={Ep05} durationInFrames={EP05_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="EP06" component={Ep06} durationInFrames={EP06_FRAMES} fps={30} width={1080} height={1920} />
    </Folder>
    <Folder name="Modelos">
      <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1080} height={1920} />
    </Folder>
  </>
);
