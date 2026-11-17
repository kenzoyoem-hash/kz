import {Easing, interpolate, random} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ease = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  sine: Easing.inOut(Easing.sin),
  expo: Easing.out(Easing.exp),
  back: Easing.out(Easing.back(1.6)),
  linear: (x: number) => x,
};
/** valor entre t0 e t1 (segundos) com easing */
export const tw = (t: number, t0: number, t1: number, a: number, b: number, e: (x: number) => number = ease.inOut) =>
  interpolate(t, [t0, t1], [a, b], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
/** 0..1 entre t0 e t1 */
export const prog = (t: number, t0: number, t1: number, e: (x: number) => number = ease.inOut) => tw(t, t0, t1, 0, 1, e);

/** keyframes numéricos: [[tempo, valor, easing?], ...] */
export type KF = [number, number, ((x: number) => number)?][];
export const kf = (t: number, keys: KF) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1, e] = keys[i + 1];
    if (t <= t1) return tw(t, t0, t1, v0, v1, e ?? ease.inOut);
  }
  return keys[keys.length - 1][1];
};
/** ruído suave determinístico (-1..1) */
export const wobble = (t: number, seed = 0) =>
  Math.sin(t * 1.7 + seed * 13.1) * 0.5 + Math.sin(t * 3.3 + seed * 7.7) * 0.3 + Math.sin(t * 7.1 + seed * 3.3) * 0.2;
/** tremor (câmera/mão) com decaimento */
export const shake = (t: number, t0: number, amp = 20, dur = 0.5, seed = 1) => {
  if (t < t0 || t > t0 + dur) return {x: 0, y: 0};
  const k = 1 - (t - t0) / dur;
  return {x: wobble(t * 30, seed) * amp * k, y: wobble(t * 30, seed + 5) * amp * k};
};
export const rnd = (s: string | number) => random(s);
export const inRange = (t: number, a: number, b: number) => t >= a && t < b;
/** pulso 0..1..0 centrado em tc */
export const bump = (t: number, tc: number, w: number) => clamp(1 - Math.abs(t - tc) / w);
