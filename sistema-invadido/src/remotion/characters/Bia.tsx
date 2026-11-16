import React from 'react';
import {C} from '../theme';
import {lerp} from '../lib/anim';
import {Person, PersonProps, Pose, Look, Expr, armIK, HandShape} from './Person';

/**
 * BIA — protagonista. Modelo FIXO da série (não alterar aparência entre episódios):
 * 22 anos, cabelo preto em rabo de cavalo, camiseta branca com faixa vermelha horizontal,
 * calça preta, tênis brancos.
 */
export type {Pose, Expr, HandShape};
export {armIK};

export const BIA_LOOK: Look = {
  skin: C.skin, skinShade: C.skinShade, hair: C.hair, hairStyle: 'ponytail',
  shirt: C.shirt, shirtShade: C.shirtShade, stripe: C.stripe, pants: C.pants, shoe: C.shoe, sole: '#b9bfcc',
};

export const POSES: Record<string, Pose> = {
  idle: {rSh: 8, rEl: 8, lSh: 8, lEl: 8},
  phoneL: {rSh: 8, rEl: 10, lSh: 0, lEl: 0, lT: {x: 40, y: -470}, lFs: 0.6, lHand: 'grip'},
  phoneBoth: {rSh: 22, rEl: 122, lSh: 22, lEl: 122},
  phoneFace: {rSh: 10, rEl: 10, lSh: 30, lEl: 150},
  raiseR: {rSh: 165, rEl: 8, lSh: 18, lEl: 118, rHand: 'open', rHandRot: 180},
  reach: {rSh: 70, rEl: 20, lSh: 12, lEl: 20, rHand: 'open'},
  scared: {rSh: 25, rEl: 135, lSh: 25, lEl: 135, rHand: 'fist', lHand: 'fist'},
  handle: {rSh: 40, rEl: 110, lSh: 40, lEl: 110, rHand: 'grip', lHand: 'grip'},
  run: {rSh: 30, rEl: 80, lSh: 30, lEl: 80, lean: 4, rHand: 'fist', lHand: 'fist'},
  // novos gestos (EP. 2+)
  phoneEar: {rSh: 10, rEl: 12, lSh: 0, lEl: 0, lT: {x: 92, y: -700}, lHand: 'grip'}, // celular no ouvido (mão esquerda)
  stop: {rSh: 0, rEl: 0, lSh: 10, lEl: 14, rT: {x: -150, y: -640}, rHand: 'open', rHandRot: 180}, // "Para!" palma aberta
  coverMouth: {rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -4, y: -650}, rHand: 'open', rHandRot: 160}, // mão na boca
  pointPhone: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, lT: {x: 40, y: -470}, lFs: 0.6, lHand: 'grip', rT: {x: 30, y: -500}, rFs: 0.7, rHand: 'point', rHandRot: 230}, // toca na tela
  hugSelf: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: 60, y: -520}, lT: {x: -60, y: -530}, rHand: 'grip', lHand: 'grip'},
  armsOut: {rSh: 60, rEl: 30, lSh: 60, lEl: 30, rHand: 'open', lHand: 'open'}, // equilíbrio / defesa
  push: {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -60, y: -640}, lT: {x: 60, y: -640}, rHand: 'open', lHand: 'open'}, // empurra porta (de costas)
};

const mixT = (a?: {x: number; y: number}, b?: {x: number; y: number}, k = 0) => (a || b) ? {x: lerp((a ?? b)!.x, (b ?? a)!.x, k), y: lerp((a ?? b)!.y, (b ?? a)!.y, k)} : undefined;
const ang = (p: Pose, side: 1 | -1) => (side < 0 ? (p.rT ? armIK(-1, p.rT.x, p.rT.y, p.rFs ?? 1) : [p.rSh, p.rEl]) : (p.lT ? armIK(1, p.lT.x, p.lT.y, p.lFs ?? 1) : [p.lSh, p.lEl]));

/** interpola poses (resolve IK antes, para a transição ficar suave) */
export const mixPose = (a: Pose, b: Pose, k: number): Pose => {
  const ra = ang(a, -1), rb = ang(b, -1), la = ang(a, 1), lb = ang(b, 1);
  return {
    rSh: lerp(ra[0], rb[0], k), rEl: lerp(ra[1], rb[1], k), lSh: lerp(la[0], lb[0], k), lEl: lerp(la[1], lb[1], k),
    lean: lerp(a.lean ?? 0, b.lean ?? 0, k),
    rFs: lerp(a.rFs ?? 1, b.rFs ?? 1, k), lFs: lerp(a.lFs ?? 1, b.lFs ?? 1, k),
    rHand: k < 0.5 ? a.rHand : b.rHand, lHand: k < 0.5 ? a.lHand : b.lHand,
    rHandRot: a.rHandRot !== undefined || b.rHandRot !== undefined ? lerp(a.rHandRot ?? b.rHandRot!, b.rHandRot ?? a.rHandRot!, k) : undefined,
    lHandRot: a.lHandRot !== undefined || b.lHandRot !== undefined ? lerp(a.lHandRot ?? b.lHandRot!, b.lHandRot ?? a.lHandRot!, k) : undefined,
    nSh: a.nSh !== undefined && b.nSh !== undefined ? lerp(a.nSh, b.nSh, k) : b.nSh ?? a.nSh,
    nEl: a.nEl !== undefined && b.nEl !== undefined ? lerp(a.nEl, b.nEl, k) : b.nEl ?? a.nEl,
    fSh: a.fSh !== undefined && b.fSh !== undefined ? lerp(a.fSh, b.fSh, k) : b.fSh ?? a.fSh,
    fEl: a.fEl !== undefined && b.fEl !== undefined ? lerp(a.fEl, b.fEl, k) : b.fEl ?? a.fEl,
    nHand: k < 0.5 ? a.nHand : b.nHand, fHand: k < 0.5 ? a.fHand : b.fHand,
  };
};
void mixT;

export const Bia: React.FC<Omit<PersonProps, 'look'>> = (p) => <Person look={BIA_LOOK} {...p} />;
