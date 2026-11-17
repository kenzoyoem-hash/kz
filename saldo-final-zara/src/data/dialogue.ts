/** Falas do EP. 01. O roteiro-fonte é script.json; os tempos reais (após a síntese das vozes)
 * vêm de cues.generated.json (gerado por pipeline/tts.py). */
import cues from './cues.generated.json';
import script from './script.json';
import env from './voice_env.generated.json';

export type Word = {w: string; s: number; e: number};
export type Cue = {id: string; scene: number; who: string; text: string; start: number; end: number; src: string; words: Word[]};
export const CUES = cues as Cue[];
export const SCRIPT = script;
export const HIGHLIGHT = new Set((script.highlight as string[]).map((w) => norm(w)));

export function norm(w: string) {
  return w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}
export const cue = (id: string) => CUES.find((c) => c.id === id)!;
/** início (s) da n-ésima palavra que começa com `w` numa fala */
export const wordAt = (id: string, w: string, nth = 0) => {
  const ws = cue(id).words.filter((x) => norm(x.w).startsWith(norm(w)));
  return (ws[nth] ?? ws[0] ?? {s: cue(id).start}).s;
};
const ENV = env as Record<string, number[]>;
/** intensidade da voz (0..1) de um personagem no instante t — usada para gesticular junto com a fala */
export const voiceAt = (who: string, t: number) => {
  const a = ENV[who];
  if (!a) return 0;
  const f = Math.floor(t * 30);
  return a[Math.max(0, Math.min(a.length - 1, f))] ?? 0;
};
export const speaking = (who: string, t: number) => CUES.some((c) => c.who === who && t >= c.start && t <= c.end);

/** boca sincronizada: abertura pela intensidade real da voz + formato pelo fonema da palavra falada */
import type {Viseme} from '../characters/Toon';
const VMAP: [RegExp, Viseme][] = [[/[aáàâã]/, 'A'], [/[eéê]/, 'E'], [/[ií]/, 'I'], [/[oóôõ]/, 'O'], [/[uú]/, 'U'], [/[mbp]/, 'M']];
export const mouthAt = (who: string, t: number): {talk: number; vis: Viseme} => {
  const c = CUES.find((q) => q.who === who && t >= q.start - 0.02 && t <= q.end + 0.05);
  if (!c) return {talk: 0, vis: 'M'};
  const env = voiceAt(who, t);
  const w = c.words.find((x) => t >= x.s && t <= x.e + 0.04);
  if (!w) return {talk: env * 0.5, vis: 'E'};
  const letters = w.w.toLowerCase().replace(/[^a-záàâãéêíóôõúç]/g, '');
  const k = Math.min(letters.length - 1, Math.max(0, Math.floor(((t - w.s) / Math.max(0.05, w.e - w.s)) * letters.length)));
  const ch = letters[k] ?? 'a';
  const vis = (VMAP.find(([re]) => re.test(ch))?.[1]) ?? (k % 2 ? 'E' : 'A');
  // micro-fechamentos entre sílabas deixam a fala mais natural
  const syl = 0.55 + 0.45 * Math.abs(Math.sin((t - w.s) * 22));
  return {talk: Math.min(1, env * 1.15) * syl, vis};
};
