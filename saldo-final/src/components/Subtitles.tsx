import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUES, Cue, HIGHLIGHT, Word, norm} from '../data/dialogue';
import {CAPTION_Y} from '../data/timeline';
import {C, FONT} from '../styles/theme';
import {clamp} from '../lib/anim';

/** Legendas sincronizadas palavra a palavra (tempos reais das vozes geradas).
 * Branco com destaque roxo na palavra falada; palavras-chave em lilás. Blocos curtos (até 3 palavras). */
type Chunk = {cue: Cue; words: Word[]; s: number; e: number};

const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const c of CUES) {
    // 1) frases separadas pela pontuação; 2) cada frase em blocos equilibrados de até 3 palavras / ~16 letras
    const phrases: Word[][] = [];
    let cur: Word[] = [];
    c.words.forEach((w) => { cur.push(w); if (/[.?!…,]$/.test(w.w)) { phrases.push(cur); cur = []; } });
    if (cur.length) phrases.push(cur);
    for (const ph of phrases) {
      const chars = ph.map((w) => w.w).join(' ').length;
      const n = Math.max(Math.ceil(ph.length / 3), Math.ceil(chars / 17));
      const size = Math.ceil(ph.length / n);
      for (let i = 0; i < ph.length; i += size) {
        const ws = ph.slice(i, i + size);
        out.push({cue: c, words: ws, s: ws[0].s, e: ws[ws.length - 1].e});
      }
    }
  }
  // duração de exibição: até o próximo bloco (no máximo +0,45 s após a última palavra)
  return out.map((ch, i) => ({...ch, s: ch.s - 0.06, e: Math.min(ch.e + 0.45, out[i + 1] ? out[i + 1].s - 0.06 : 1e9)}));
})();

const yAt = (t: number) => {
  let y = CAPTION_Y[0].y;
  for (const k of CAPTION_Y) if (t >= k.from) y = k.y;
  return y;
};

export const Subtitles: React.FC<{t: number}> = ({t}) => {
  const ch = chunks.find((c) => t >= c.s && t < c.e);
  if (!ch) return null;
  const y = yAt(ch.s + 0.06);
  const pop = clamp((t - ch.s) / 0.12);
  const scale = 0.82 + 0.18 * (1 - Math.pow(1 - pop, 3));
  const future = ch.cue.who === 'MAYA_FUTURO';
  const noah = ch.cue.who === 'NOAH';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 70, right: 70, top: y, transform: `translateY(-50%) scale(${scale})`, opacity: pop,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px'}}>
        {ch.words.map((w, i) => {
          const active = t >= w.s - 0.04 && (i === ch.words.length - 1 ? true : t < ch.words[i + 1].s - 0.04);
          const key = HIGHLIGHT.has(norm(w.w));
          return (
            <span key={i} style={{
              fontFamily: FONT.title, fontSize: 74, lineHeight: 1.12, letterSpacing: 1,
              color: active ? '#FFFFFF' : key ? '#C9A6FF' : C.white,
              textTransform: 'uppercase', fontStyle: future ? 'italic' : 'normal',
              padding: '2px 14px', borderRadius: 16,
              background: active ? (future ? 'rgba(200,40,70,0.92)' : noah ? 'rgba(54,140,255,0.9)' : 'rgba(138,69,255,0.92)') : 'transparent',
              WebkitTextStroke: active ? '0px' : '3px rgba(6,8,18,0.9)', paintOrder: 'stroke fill',
              textShadow: '0 6px 18px rgba(0,0,0,0.65)',
              transform: active ? 'scale(1.06)' : 'none',
            }}>{w.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** exporta as legendas em SRT (usado por scripts/export-srt) */
export const toSRT = () => {
  const f = (s: number) => {
    const ms = Math.round(s * 1000);
    const p = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
  };
  return CUES.map((c, i) => `${i + 1}\n${f(c.start)} --> ${f(c.end + 0.3)}\n${c.text}\n`).join('\n');
};
