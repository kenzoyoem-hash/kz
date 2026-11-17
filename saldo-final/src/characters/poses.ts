import {Pose, P, mixPose} from './Rig';
import {clamp, ease, lerp} from '../lib/anim';

/** Biblioteca de poses reutilizáveis (todas as personagens usam o mesmo rig). */
export const POSES = {
  stand: P({}),
  standRelax: P({aL: [8, 12], aR: [-6, 14], head: 2}),
  sit: P({lL: [88, -86], lR: [82, -84], lean: -4, aL: [20, 30], aR: [24, 40], head: 2}),
  sitSlump: P({lL: [80, -70], lR: [74, -66], lean: -18, aL: [40, 0], aR: [-20, 10], head: -14, look: 0.1, lookY: -0.6}),
  sitFlop: P({lL: [84, -64], lR: [70, -58], lean: -24, aL: [110, 10], aR: [100, 20], head: -18, look: 0, lookY: -1}),
  sitPhone: P({lL: [88, -86], lR: [82, -84], lean: 6, aL: [30, 70], aR: [38, 108], head: 12, look: 0.75, lookY: 0.8}),
  sitPhoneBoth: P({lL: [88, -86], lR: [82, -84], lean: 10, aL: [44, 96], aR: [40, 104], head: 14, look: 0.8, lookY: 0.9}),
  sitExcited: P({lL: [86, -80], lR: [80, -78], lean: 14, aL: [140, 30], aR: [60, 100], head: -6, look: 0.2, lookY: -0.3, sh: 0.4}),
  sitDeadpan: P({lL: [88, -86], lR: [82, -84], lean: -6, aL: [18, 20], aR: [30, 70], head: 14, look: 0, lookY: 0.2, sh: 0}),
  standPhone: P({aL: [10, 14], aR: [36, 110], head: 16, look: 0.8, lookY: 0.9}),
  standPhoneEar: P({aL: [14, 30], aR: [20, 158], head: -4, look: 0.3, lookY: 0}),
  cheer: P({aL: [168, 10], aR: [160, 20], head: -14, look: 0, lookY: -0.8, lL: [10, -20], lR: [-14, -10], sh: 0.3}),
  shock: P({aL: [150, 120], aR: [150, 125], head: -4, look: 0, lookY: 0, lean: -8, sh: 1, lL: [-6, -2], lR: [10, -4]}),
  scared: P({aL: [60, 80], aR: [70, 90], head: 8, lean: -6, sh: 1, look: 0.2}),
  pointBack: P({aL: [-80, 6], aR: [-10, 10], head: 4, look: -0.8, lean: -2}),
  reach: P({aR: [80, 10], aL: [10, 10], lean: 10, head: 6, look: 1}),
  shrug: P({aL: [36, 90], aR: [40, 92], head: 10, look: 0, sh: 0.8}),
  handHip: P({aL: [30, -70], aR: [44, 96], head: 12, look: 0.1}),
  headHands: P({aL: [150, 132], aR: [146, 136], head: 6, lean: 2, sh: 0.6, look: 0}),
  armsUp: P({aL: [150, 20], aR: [140, 26], head: -8, look: 0, sh: 0.7}),
  rigid: P({aL: [2, 4], aR: [24, 150], head: -2, look: 0.2, lean: -2}),
};

/** pose-chave ao longo do tempo: [[t, pose, easing?], ...] */
export type PK = [number, Pose, ((x: number) => number)?][];
export const posekf = (t: number, keys: PK): Pose => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i];
    const [t1, b, e] = keys[i + 1];
    if (t <= t1) return mixPose(a, b, (e ?? ease.inOut)(clamp((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
};

/** ciclo de caminhada (fase em ciclos) — pernas, braços e leve balanço do tronco */
export const walk = (phase: number, amt = 1, base: Pose = POSES.stand): Pose => {
  const a = phase * Math.PI * 2;
  const s = Math.sin(a), c2 = Math.cos(a);
  return {
    ...base,
    lean: base.lean + 4 * amt,
    lL: [28 * s * amt, -Math.max(0, -c2) * 42 * amt - 4],
    lR: [-28 * s * amt, -Math.max(0, c2) * 42 * amt - 4],
    aL: [-24 * s * amt + 4, 16],
    aR: [24 * s * amt - 4, 18],
    y: -Math.abs(Math.cos(a)) * 6 * amt,
    head: base.head + Math.sin(a * 2) * 1.5,
  };
};
/** caminhada de x0 a x1 entre t0 e t1 — devolve x atual e a pose */
export const walkTo = (t: number, t0: number, t1: number, x0: number, x1: number, stride = 1.6, base?: Pose) => {
  const k = clamp((t - t0) / (t1 - t0));
  const x = lerp(x0, x1, ease.sine(k));
  const moving = t > t0 && t < t1;
  const amt = moving ? Math.min(1, Math.min(k, 1 - k) * 6) : 0;
  return {x, pose: walk(((t - t0) * stride) % 1, amt, base), moving};
};
