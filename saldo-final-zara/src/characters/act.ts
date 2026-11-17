import {Expr, Pose, armIK} from './Toon';
import {clamp, ease, lerp} from '../lib/anim';
import {mouthAt} from '../data/dialogue';

const ang = (p: Pose, side: 1 | -1): number[] => (side < 0 ? (p.rT ? armIK(-1, p.rT.x, p.rT.y, p.rFs ?? 1) : [p.rSh, p.rEl]) : (p.lT ? armIK(1, p.lT.x, p.lT.y, p.lFs ?? 1) : [p.lSh, p.lEl]));
/** interpola poses (resolve o IK antes, para a transição ficar suave) */
export const mixPose = (a: Pose, b: Pose, k: number): Pose => {
  const ra = ang(a, -1), rb = ang(b, -1), la = ang(a, 1), lb = ang(b, 1);
  const hr = a.rHandRot !== undefined || b.rHandRot !== undefined, hl = a.lHandRot !== undefined || b.lHandRot !== undefined;
  return {
    rSh: lerp(ra[0], rb[0], k), rEl: lerp(ra[1], rb[1], k), lSh: lerp(la[0], lb[0], k), lEl: lerp(la[1], lb[1], k),
    lean: lerp(a.lean ?? 0, b.lean ?? 0, k), head: lerp(a.head ?? 0, b.head ?? 0, k),
    rFs: lerp(a.rFs ?? 1, b.rFs ?? 1, k), lFs: lerp(a.lFs ?? 1, b.lFs ?? 1, k),
    rHand: k < 0.5 ? a.rHand : b.rHand, lHand: k < 0.5 ? a.lHand : b.lHand,
    rHandRot: hr ? lerp(a.rHandRot ?? b.rHandRot!, b.rHandRot ?? a.rHandRot!, k) : undefined,
    lHandRot: hl ? lerp(a.lHandRot ?? b.lHandRot!, b.lHandRot ?? a.lHandRot!, k) : undefined,
  };
};
export type PK = [number, Pose, ((x: number) => number)?][];
/** poses-chave no tempo (transições de ~0,3 s com easing) */
export const posekf = (t: number, keys: PK): Pose => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i], [t1, b, e] = keys[i + 1];
    if (t <= t1) return mixPose(a, b, (e ?? ease.inOut)(clamp((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
};
/** expressão vigente: [[t, expr], ...] */
export const exprAt = (t: number, keys: [number, Expr][]): Expr => {
  let e = keys[0][1];
  for (const [kt, ke] of keys) if (t >= kt) e = ke;
  return e;
};
/** boca do personagem (abertura + fonema) */
export const say = (who: string, t: number) => mouthAt(who, t);
