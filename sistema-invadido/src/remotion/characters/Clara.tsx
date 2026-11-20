import React from 'react';
import {Person, PersonProps, Look} from './Person';

/** CLARA (~30 anos) — moradora do 604. Aparência FIXA da série a partir do EP. 6:
 *  pele morena clara, cabelo castanho-escuro ondulado na altura dos ombros, olhos castanhos,
 *  blusa verde-oliva de manga curta, calça jeans azul-escura, tênis cinza. */
export const CLARA_LOOK: Look = {
  skin: '#c48a64', skinShade: '#a5714f', hair: '#3b2418', hairStyle: 'wavy',
  shirt: '#6b7a3a', shirtShade: '#57642f', pants: '#253554', shoe: '#8a8f99', sole: '#6b707a',
};
export const Clara: React.FC<Omit<PersonProps, 'look'>> = (p) => <Person look={CLARA_LOOK} seed={9} {...p} />;
