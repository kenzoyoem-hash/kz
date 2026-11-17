import React from 'react';
import {Palette, Rig, RigProps} from './Rig';
import {C} from '../styles/theme';
import {MAYA_PAL} from './Maya';

/** MAYA DO FUTURO (2041) — mesmo modelo-base de Maya; cabelo mais longo, roupa futurista escura,
 * postura rígida. Costuras luminosas vermelhas (cor narrativa de anomalia). */
export const FUTURE_MAYA_PAL: Palette = {
  ...MAYA_PAL,
  hair: '#3F2A20', hairShade: '#2E1F18',
  jacket: '#1B1F2D', jacketShade: '#121521',
  tee: '#0B0D14', pants: '#141826', pantsShade: '#0F121D', shoes: '#07080C',
  hairStyle: 'future', jacketStyle: 'coat', accent: C.red,
};
export const FutureMaya: React.FC<Omit<RigProps, 'pal'>> = (p) => <Rig {...p} pal={FUTURE_MAYA_PAL} />;
