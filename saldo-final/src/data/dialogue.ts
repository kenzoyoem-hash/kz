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
