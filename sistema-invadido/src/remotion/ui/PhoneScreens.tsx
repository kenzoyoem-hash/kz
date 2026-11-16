import React from 'react';
import {C, FONT} from '../theme';
import {clamp, ease, tw} from '../lib/anim';

const abs: React.CSSProperties = {position: 'absolute'};

/** Resultado da votação do episódio anterior (tela do celular) */
export const VoteResult: React.FC<{t: number; a: number; b: number; aLabel: string; bLabel: string; winner: 'A' | 'B'; stamp: string}> = ({t, a, b, aLabel, bLabel, winner, stamp}) => {
  const ka = tw(t, 0.2, 1.2, 0, a, ease.out), kb = tw(t, 0.2, 1.2, 0, b, ease.out);
  const st = tw(t, 1.5, 1.8, 0, 1, ease.back);
  const bar = (letter: string, label: string, v: number, col: string, win: boolean) => (
    <div style={{marginTop: 40, opacity: win || t < 1.4 ? 1 : 0.55}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.title, color: '#fff', fontSize: 46}}>
        <span><span style={{background: col, borderRadius: 12, padding: '0 16px', marginRight: 14}}>{letter}</span>{label}</span>
        <span>{Math.round(v)}%</span>
      </div>
      <div style={{marginTop: 14, height: 46, borderRadius: 23, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
        <div style={{width: `${v}%`, height: '100%', background: col, borderRadius: 23, boxShadow: win ? `0 0 30px ${col}` : 'none'}} />
      </div>
    </div>
  );
  return (
    <div style={{...abs, inset: 0, background: 'linear-gradient(#0d1324, #05070d)', padding: '200px 60px 0', boxSizing: 'border-box'}}>
      <div style={{fontFamily: FONT.mono, color: C.red, fontSize: 34, letterSpacing: 3}}>● SISTEMA DO PRÉDIO</div>
      <div style={{fontFamily: FONT.title, color: '#fff', fontSize: 74, marginTop: 20, lineHeight: 1.05}}>VOTAÇÃO<br />ENCERRADA</div>
      {bar('A', aLabel, ka, C.blue, winner === 'A')}
      {bar('B', bLabel, kb, C.red, winner === 'B')}
      <div style={{...abs, left: 0, right: 0, top: 1150, textAlign: 'center', transform: `scale(${st}) rotate(-6deg)`, opacity: clamp(st * 2)}}>
        <span style={{display: 'inline-block', border: `8px solid ${C.green}`, color: C.green, fontFamily: FONT.title, fontSize: 64, padding: '10px 30px', borderRadius: 18}}>{stamp}</span>
      </div>
    </div>
  );
};

/** Chamada em andamento / encerrada */
export const CallScreen: React.FC<{t: number; name: string; seconds: number; ended?: boolean; avatar?: React.ReactNode}> = ({t, name, seconds, ended = false, avatar}) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0'), ss = String(Math.floor(seconds) % 60).padStart(2, '0');
  return (
    <div style={{...abs, inset: 0, background: 'linear-gradient(#1a1f2e, #07090f)', textAlign: 'center', fontFamily: FONT.bold, color: '#fff'}}>
      <div style={{...abs, top: '22%', left: '50%', width: 300, height: 300, marginLeft: -150, borderRadius: 300, overflow: 'hidden', background: '#2a3045', border: '6px solid #fff', filter: ended ? 'grayscale(1) brightness(0.6)' : 'none'}}>{avatar}</div>
      <div style={{...abs, top: '45%', left: 0, right: 0, fontSize: 130, fontFamily: FONT.title}}>{name}</div>
      <div style={{...abs, top: '57%', left: 0, right: 0, fontSize: 52, fontFamily: FONT.mono, color: ended ? C.red : '#aab3c7'}}>{ended ? 'CHAMADA ENCERRADA' : `${mm}:${ss}`}</div>
      {!ended && (
        <div style={{...abs, top: '64%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, height: 80, alignItems: 'center'}}>
          {Array.from({length: 16}).map((_, i) => <div key={i} style={{width: 10, borderRadius: 5, background: '#aab3c7', height: 12 + Math.abs(Math.sin(t * 9 + i * 0.8)) * 60}} />)}
        </div>
      )}
      <div style={{...abs, bottom: '12%', left: '50%', marginLeft: -75, width: 150, height: 150, borderRadius: 150, background: ended ? '#444' : C.red, fontSize: 70, lineHeight: '150px'}}>✕</div>
    </div>
  );
};

/** Polegar deslizando para atender (sobreposição sobre a tela de chamada) */
export const ThumbAnswer: React.FC<{t: number}> = ({t}) => {
  const x = tw(t, 0.1, 0.55, 0, 1, ease.inOut);
  return (
    <div style={{...abs, right: '14%', bottom: `${4 + x * 6}%`, width: 170, height: 300, borderRadius: '85px 85px 60px 60px', background: C.skin, transform: `translateX(${(1 - x) * 160}px) rotate(-18deg)`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
      <div style={{...abs, left: 30, top: 18, width: 110, height: 90, borderRadius: 50, background: '#f0c2a2', opacity: 0.8}} />
    </div>
  );
};

/** Carimbo grande sobre a imagem ("FALSA", "REAL"...) */
export const Stamp: React.FC<{t: number; text: string; color: string; x: number; y: number; rot?: number; size?: number}> = ({t, text, color, x, y, rot = -8, size = 1}) => {
  const k = tw(t, 0, 0.25, 2.2, 1, ease.out);
  return (
    <div style={{...abs, left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(${rot}deg)`, opacity: clamp(t * 6)}}>
      <span style={{display: 'inline-block', border: `${10 * size}px solid ${color}`, color, fontFamily: FONT.title, fontSize: 110 * size, padding: `${6 * size}px ${30 * size}px`, borderRadius: 22 * size, background: 'rgba(0,0,0,0.45)', textShadow: `0 0 20px ${color}88`}}>{text}</span>
    </div>
  );
};
