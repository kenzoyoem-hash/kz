import React from 'react';
import {Palette, Rig, RigProps} from './Rig';
import {C} from '../styles/theme';

/** Figurantes reutilizáveis da São Paulo futurista. */
const base = {skin: C.skin, skinShade: C.skinShade, height: 1} as const;
export const EXTRAS: Record<string, Palette> = {
  worker: {...base, hair: '#2B2F3A', hairShade: '#1E222C', jacket: '#5A6274', jacketShade: '#454C5C', tee: '#E39B3A', pants: '#3A4152', pantsShade: '#2C3240', shoes: '#15171D', hairStyle: 'cap', jacketStyle: 'overall'},
  rich: {...base, hair: '#C9B48A', hairShade: '#A8936B', jacket: '#E6E8EF', jacketShade: '#C3C7D3', tee: '#1A1D27', pants: '#D5D8E2', pantsShade: '#B4B8C4', shoes: '#2A2016', hairStyle: 'slick', jacketStyle: 'suit', accent: C.gold, height: 1.03},
  p1: {...base, hair: '#1A1C22', hairShade: '#121318', jacket: '#3B2F5E', jacketShade: '#2C2347', tee: '#8A45FF', pants: '#1D2130', pantsShade: '#161925', shoes: '#0E0F14', hairStyle: 'short', jacketStyle: 'closed'},
  p2: {...base, hair: '#5B3B2A', hairShade: '#45291C', jacket: '#7A3A5E', jacketShade: '#5E2C48', tee: '#E6E8EF', pants: '#24283A', pantsShade: '#1B1E2C', shoes: '#0E0F14', hairStyle: 'bun', jacketStyle: 'closed'},
  p3: {...base, hair: '#101114', hairShade: '#0A0B0E', jacket: '#2E4A5E', jacketShade: '#223747', tee: '#36B7FF', pants: '#1B1E2B', pantsShade: '#141722', shoes: '#0E0F14', hairStyle: 'noah', jacketStyle: 'open', height: 1.05},
};
export const Extra: React.FC<Omit<RigProps, 'pal'> & {kind: keyof typeof EXTRAS}> = ({kind, ...p}) => <Rig {...p} pal={EXTRAS[kind]} />;
