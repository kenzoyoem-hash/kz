import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../styles/theme';
import {ease, prog, tw} from '../lib/anim';
import {wordAt} from '../data/dialogue';

/** CAMADA DE EDIÇÃO (só na versão final "EP01"): título de abertura e cartela da votação A/B.
 * A versão "EP01-limpo" sai sem nenhum texto, como pedem as regras visuais da série. */
export const TextLayer: React.FC<{t: number}> = ({t}) => {
  const title = prog(t, 0.2, 0.5, ease.out) * (1 - prog(t, 2.0, 2.3));
  const v = prog(t, 79.2, 79.7, ease.out);
  const tA = wordAt('l24', 'A', 1), tB = wordAt('l24', 'B');
  const hiA = t > tA && t < tA + 0.6 ? 1 : 0, hiB = t > tB && t < tB + 0.6 ? 1 : 0;
  const card = (y: number, letter: string, l1: string, l2: string, col: string, k: number, hi: number) => (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, opacity: k, transform: `translateX(${(1 - k) * (letter === 'A' ? -400 : 400)}px) scale(${1 + hi * 0.05})`,
      display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(10,8,16,0.88)', border: `6px solid ${col}`, borderRadius: 34, padding: '22px 28px',
      boxShadow: `0 0 ${30 + hi * 40}px ${col}`}}>
      <div style={{width: 110, height: 110, borderRadius: 55, background: col, border: '6px solid #0A0A10', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.title, fontSize: 76, color: '#0A0A10'}}>{letter}</div>
      <div style={{fontFamily: FONT.title, fontSize: 44, lineHeight: 1.12, color: '#fff', textTransform: 'uppercase'}}>{l1}<br />{l2}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {title > 0 && (
        <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: title, transform: `scale(${tw(t, 0.2, 2.3, 0.94, 1.04)})`}}>
          <div style={{fontFamily: FONT.title, fontSize: 92, color: '#fff', letterSpacing: 6, WebkitTextStroke: '12px #0A0A10', paintOrder: 'stroke fill'}}>SALDO FINAL</div>
          <div style={{fontFamily: FONT.title, fontSize: 44, color: C.gold, WebkitTextStroke: '9px #0A0A10', paintOrder: 'stroke fill'}}>EP. 1 · QUANTO VALE SUA VIDA?</div>
        </div>
      )}
      {v > 0 && (
        <>
          <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: v, fontFamily: FONT.title, fontSize: 70, color: '#fff',
            WebkitTextStroke: '12px #0A0A10', paintOrder: 'stroke fill', lineHeight: 1.05}}>O QUE A ZARA<br />DEVE FAZER?</div>
          {card(380, 'A', 'VENDER 10 ANOS DE VIDA', 'PARA SALVAR A MÃE', C.gold, v, hiA)}
          {card(620, 'B', 'RECUSAR E DESCOBRIR', 'QUEM CONTROLA O SISTEMA', C.teal, prog(t, 79.5, 80.0, ease.out), hiB)}
        </>
      )}
    </AbsoluteFill>
  );
};
