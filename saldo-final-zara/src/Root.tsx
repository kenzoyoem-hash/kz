import React from 'react';
import {Composition} from 'remotion';
import {Episode01} from './Episode01';
import {CharacterSheet} from './CharacterSheet';
import {DURATION_FRAMES, FPS} from './data/timeline';
import './components/Fonts';

export const RemotionRoot: React.FC = () => (
  <>
    {/* versão final: animação + legendas + cartela de votação (camada de edição) */}
    <Composition id="EP01" component={Episode01} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{textLayer: true}} />
    {/* versão limpa: só animação e áudio, sem nenhum texto (para editar) */}
    <Composition id="EP01-limpo" component={Episode01} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{textLayer: false}} />
    <Composition id="Personagens" component={CharacterSheet} durationInFrames={90} fps={FPS} width={1080} height={1920} />
  </>
);
