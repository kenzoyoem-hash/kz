import React from 'react';
import {Palette, Rig, RigProps} from './Rig';
import {C} from '../styles/theme';

/** NOAH — 23 anos, melhor amigo. Ligeiramente mais alto que Maya. */
export const NOAH_PAL: Palette = {
  skin: C.skin, skinShade: C.skinShade,
  hair: '#121317', hairShade: '#0B0C10',        // cabelo preto curto
  jacket: '#3D6CA8', jacketShade: '#2D5284',    // jaqueta jeans azul
  tee: '#8E939E',                               // camiseta cinza
  pants: '#1F2333', pantsShade: '#171A27',      // calça escura
  shoes: '#D9DCE4',
  hairStyle: 'noah', jacketStyle: 'open', height: 1.06,
};
export const Noah: React.FC<Omit<RigProps, 'pal'>> = (p) => <Rig {...p} pal={NOAH_PAL} />;
