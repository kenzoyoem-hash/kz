import React from 'react';
import {Person, PersonProps, Look} from './Person';

/** HOMEM DE BLUSA AZUL — o homem da gravação da Escada B (aparência fixa) */
export const MAN_LOOK: Look = {
  skin: '#d9a383', skinShade: '#b9835f', hair: '#2b1d14', hairStyle: 'short',
  shirt: '#2f6fd6', shirtShade: '#2457ad', longSleeves: true, pants: '#2a2f3d', shoe: '#3a3f4c', sole: '#22252e',
  brow: 11, stubble: '#5a3f2e',
};
export const Man: React.FC<Omit<PersonProps, 'look'>> = (p) => <Person look={MAN_LOOK} seed={5} {...p} />;
