import React from 'react';
import {Look, Pose, Toon, ToonProps} from './Toon';
import {C} from '../styles/theme';

/** corpo cinza-claro, igual em todo o elenco (estilo SALDO FINAL) */
export const SKIN = '#C9CDD6', SKIN_SHADE = '#A9AEBB';

/** ELENCO OFICIAL — não alterar aparência entre episódios (ver GUIA_DE_CONTINUIDADE.md). */
export const ZARA: Look = {
  name: 'Zara Vilar', female: true,
  skin: SKIN, skinShade: SKIN_SHADE,
  hair: '#17110E', hairShade: '#0B0807', hairStyle: 'puff', streak: C.magenta, eyeColor: '#4A2A14',
  shirt: '#17151C', shirtShade: '#0C0B10', top: 'puffer', topColor: '#F2B233', topShade: '#C4861A',
  pants: '#4B5A3A', shoe: '#F2F2F5', sole: C.magenta, hoops: C.gold, build: 0.92,
};
export const ZARA_DELIVERY: Look = {...ZARA, bag: true};
export const DANTE: Look = {
  name: 'Dante Reis',
  skin: SKIN, skinShade: SKIN_SHADE, hair: '#1D1A22', hairShade: '#0E0C12', hairStyle: 'messy', eyeColor: '#2D6B5E',
  shirt: '#1B1B22', shirtShade: '#101016', top: 'coat', topColor: '#1F4F4C', topShade: '#163937',
  pants: '#15161D', shoe: '#0E0E12', sole: '#2A2B33', earcuff: true, build: 1.02,
};
export const HELENA: Look = {
  name: 'Helena Vilar', female: true,
  skin: SKIN, skinShade: SKIN_SHADE,
  hair: '#2A1C16', hairShade: '#1A110D', hairStyle: 'wavy', eyeColor: '#4A2A14',
  shirt: '#BFD6EA', shirtShade: '#94B2CC', top: 'gown', pants: '#BFD6EA', shoe: '#E6E6EA', sole: '#C0C0C8', locket: true, build: 0.95,
};
export const CIRO: Look = {
  name: 'Ciro Voss',
  skin: SKIN, skinShade: SKIN_SHADE, hair: '#D9D3C4', hairShade: '#A9A293', hairStyle: 'slick', eyeColor: '#5B7A99',
  shirt: '#F2F2F5', shirtShade: '#CFCFD8', top: 'suit', topColor: '#2B2D38', topShade: '#1C1E27', tie: '#A3162A', pin: C.gold,
  pants: '#2B2D38', shoe: '#0E0E12', sole: '#1A1A20', build: 1.05,
};
export const ATENDENTE: Look = {
  name: 'Atendente Áurea', female: true,
  skin: SKIN, skinShade: SKIN_SHADE,
  hair: '#5A3420', hairShade: '#3F2315', hairStyle: 'bun',
  shirt: '#F2F2F5', shirtShade: '#D5D5DD', top: 'blazer', topColor: '#ECE3CC', topShade: '#CBBF9F', trim: C.gold,
  pants: '#2A2B36', shoe: '#1A1A20', sole: '#2A2A30', build: 0.92,
};
export const JOVEM: Look = {
  name: 'Jovem no guichê', female: true,
  skin: SKIN, skinShade: SKIN_SHADE, hair: '#3A2418', hairShade: '#24160F', hairStyle: 'ponytail',
  shirt: '#6A4C9C', shirtShade: '#4E3778', top: 'hoodie', pants: '#22243A', shoe: '#E6E6EA', sole: '#B9BCC8', build: 0.9,
};
export const RAPAZ: Look = {
  name: 'Rapaz da fila',
  skin: SKIN, skinShade: SKIN_SHADE, hair: '#14110F', hairShade: '#0B0908', hairStyle: 'cap', capColor: '#C2402C',
  shirt: '#2F6B4E', shirtShade: '#214D38', top: 'hoodie', pants: '#22243A', shoe: '#F2F2F5', sole: '#2F6B4E',
};

const mk = (look: Look) => (p: Omit<ToonProps, 'look'>) => <Toon look={look} {...p} />;
export const Zara = mk(ZARA);
export const Dante = mk(DANTE);
export const Helena = mk(HELENA);
export const Ciro = mk(CIRO);

/** poses reutilizáveis */
export const P: Record<string, Pose> = {
  idle: {rSh: 8, rEl: 8, lSh: 8, lEl: 8},
  relaxed: {rSh: 12, rEl: 20, lSh: 10, lEl: 14},
  handsHips: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -84, y: -392}, lT: {x: 84, y: -392}, rHand: 'fist', lHand: 'fist'},
  armsCrossed: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: 50, y: -470}, lT: {x: -50, y: -480}, rHand: 'grip', lHand: 'grip', rFs: 0.8, lFs: 0.8},
  shrug: {rSh: 30, rEl: 100, lSh: 30, lEl: 100, rHand: 'open', lHand: 'open', rHandRot: 200, lHandRot: -200, head: 6},
  handsUp: {rSh: 60, rEl: 120, lSh: 60, lEl: 120, rHand: 'open', lHand: 'open', rHandRot: 180, lHandRot: 180},
  point: {rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -190, y: -560}, rHand: 'point', rHandRot: 90},
  pointFwd: {rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -40, y: -560}, rFs: 0.5, rHand: 'point', rHandRot: 160},
  wristOut: {rSh: 10, rEl: 14, lSh: 0, lEl: 0, lT: {x: 150, y: -560}, lHand: 'open', lHandRot: -60},
  wristLook: {rSh: 10, rEl: 14, lSh: 0, lEl: 0, lT: {x: 40, y: -600}, lFs: 0.7, lHand: 'relaxed', head: 6},
  coverMouth: {rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -4, y: -650}, rHand: 'open', rHandRot: 160},
  headHands: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -96, y: -780}, lT: {x: 96, y: -780}, rHand: 'open', lHand: 'open', rHandRot: 200, lHandRot: -200},
  hold: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -30, y: -470}, lT: {x: 30, y: -470}, rHand: 'grip', lHand: 'grip', rFs: 0.6, lFs: 0.6},
  reachFwd: {rSh: 0, rEl: 0, lSh: 10, lEl: 10, rT: {x: -20, y: -520}, rFs: 0.4, rHand: 'open', rHandRot: 170},
  weapon: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -150, y: -700}, lT: {x: -60, y: -520}, rHand: 'grip', lHand: 'grip'},
  phoneLook: {rSh: 8, rEl: 10, lSh: 0, lEl: 0, lT: {x: 40, y: -480}, lFs: 0.6, lHand: 'grip', head: 8},
  tapPhone: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, lT: {x: 40, y: -480}, lFs: 0.6, lHand: 'grip', rT: {x: 30, y: -505}, rFs: 0.7, rHand: 'point', rHandRot: 230, head: 8},
  holdHand: {rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -150, y: -400}, rHand: 'grip', head: 10},
  offer: {rSh: 0, rEl: 0, lSh: 8, lEl: 10, rT: {x: -150, y: -520}, rHand: 'open', rHandRot: 230},
  lapel: {rSh: 0, rEl: 0, lSh: 8, lEl: 8, rT: {x: -40, y: -560}, rFs: 0.6, rHand: 'grip', head: -4},
  wave: {rSh: 0, rEl: 0, lSh: 8, lEl: 10, rT: {x: -160, y: -720}, rHand: 'open', rHandRot: 190},
};
