import React from 'react';
import {Palette, Rig, RigProps} from './Rig';
import {C} from '../styles/theme';

/** MAYA — 22 anos. Modelo oficial (não alterar proporções, cores, cabelo ou roupa). */
export const MAYA_PAL: Palette = {
  skin: C.skin, skinShade: C.skinShade,
  hair: '#4A3226', hairShade: '#36241B',       // castanho-escuro ondulado até os ombros
  jacket: C.moss, jacketShade: '#4A5F44',       // jaqueta verde-musgo
  tee: '#15161B',                               // camiseta preta
  pants: '#262B3B', pantsShade: '#1C2030',      // calça escura
  shoes: '#0C0D11',                             // tênis preto
  hairStyle: 'maya', jacketStyle: 'open', height: 1,
};
export const Maya: React.FC<Omit<RigProps, 'pal'>> = (p) => <Rig {...p} pal={MAYA_PAL} />;
