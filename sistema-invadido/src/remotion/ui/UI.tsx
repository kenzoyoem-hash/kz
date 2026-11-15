import React from 'react';
import {C, FONT} from '../theme';
import {clamp, ease, rnd, tw} from '../lib/anim';

const abs: React.CSSProperties = {position: 'absolute'};

/** Celular em primeiro plano (moldura + mãos). A tela recebe children (HTML). */
export const Phone: React.FC<{
  x: number; y: number; w: number; h: number; rot?: number; hands?: boolean; children?: React.ReactNode; glow?: string;
}> = ({x, y, w, h, rot = 0, hands = true, children, glow = C.cyan}) => (
  <div style={{...abs, left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
    <div style={{...abs, inset: -60, borderRadius: 120, background: `radial-gradient(closest-side, ${glow}33, transparent)`}} />
    <div style={{...abs, inset: 0, borderRadius: w * 0.12, background: '#0b0d14', border: '6px solid #262c3c', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}} />
    <div style={{...abs, left: w * 0.04, top: w * 0.04, right: w * 0.04, bottom: w * 0.04, borderRadius: w * 0.09, overflow: 'hidden', background: '#000'}}>
      {children}
    </div>
    <div style={{...abs, left: w / 2 - w * 0.13, top: w * 0.06, width: w * 0.26, height: w * 0.065, borderRadius: 40, background: '#000'}} />
    {hands && (
      <>
        <div style={{...abs, left: -w * 0.16, top: h * 0.45, width: w * 0.26, height: h * 0.5, borderRadius: w * 0.13, background: C.skin}} />
        <div style={{...abs, left: -w * 0.1, top: h * 0.32, width: w * 0.16, height: h * 0.1, borderRadius: 40, background: C.skin, transform: 'rotate(-12deg)'}} />
        <div style={{...abs, right: -w * 0.12, top: h * 0.4, width: w * 0.18, height: h * 0.09, borderRadius: 40, background: C.skin}} />
        <div style={{...abs, right: -w * 0.13, top: h * 0.51, width: w * 0.18, height: h * 0.09, borderRadius: 40, background: C.skin}} />
        <div style={{...abs, right: -w * 0.12, top: h * 0.62, width: w * 0.17, height: h * 0.09, borderRadius: 40, background: C.skin}} />
      </>
    )}
  </div>
);

const COMMENTS = [
  ['@luana.rx', 'ela não sabe 😳'], ['@kauã_77', 'É AO VIVO MESMO??'], ['@dudinha', 'olha atrás dela'],
  ['@vitor.m', 'chama a polícia!!'], ['@nanda', 'como tão filmando isso?'], ['@pedro_hq', 'o prédio inteiro tá vendo'],
  ['@bia_fã', 'SAI DAÍ'], ['@ghost404', 'kkkk ela vai surtar'], ['@carol.s', 'isso é real?'], ['@mano.t', 'VIRA PRA CÂMERA'],
  ['@jhow', 'tô arrepiado'], ['@anônimo', '👁👁👁'], ['@lari', 'ela mora sozinha né?'], ['@r.santos', 'alguém ajuda ela'],
];

/** Interface de live: AO VIVO, contador, comentários subindo, corações */
export const LiveUI: React.FC<{t: number; viewers: number; scale?: number; showBanner?: boolean}> = ({t, viewers, scale = 1, showBanner = true}) => {
  const s = scale;
  const n = Math.round(viewers).toLocaleString('pt-BR');
  const rowH = 74 * s;
  const scroll = t * 2.6; // comentários por segundo
  const first = Math.floor(scroll);
  return (
    <div style={{...abs, inset: 0, fontFamily: FONT.bold, color: '#fff'}}>
      <div style={{...abs, left: 0, right: 0, top: 0, height: 260 * s, background: 'linear-gradient(rgba(0,0,0,0.65), transparent)'}} />
      <div style={{...abs, left: 0, right: 0, bottom: 0, height: 700 * s, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'}} />
      <div style={{...abs, left: 30 * s, top: 70 * s, display: 'flex', gap: 14 * s, alignItems: 'center'}}>
        <div style={{width: 64 * s, height: 64 * s, borderRadius: 64, background: '#333', border: `${4 * s}px solid ${C.red}`, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          <div style={{width: 40 * s, height: 40 * s, borderRadius: 40, background: '#555', marginBottom: -12 * s}} />
        </div>
        <div style={{fontSize: 26 * s, fontFamily: FONT.semi}}>usuário_desconhecido</div>
      </div>
      <div style={{...abs, right: 30 * s, top: 74 * s, display: 'flex', gap: 10 * s}}>
        <div style={{background: C.red, padding: `${6 * s}px ${16 * s}px`, borderRadius: 10 * s, fontSize: 28 * s, fontFamily: FONT.title, opacity: Math.sin(t * 6) > -0.6 ? 1 : 0.6}}>● AO VIVO</div>
        <div style={{background: 'rgba(0,0,0,0.55)', padding: `${6 * s}px ${14 * s}px`, borderRadius: 10 * s, fontSize: 28 * s}}>👁 {n}</div>
      </div>
      {showBanner && (
        <div style={{...abs, left: 0, right: 0, top: 170 * s, textAlign: 'center'}}>
          <span style={{background: 'rgba(0,0,0,0.6)', border: `${3 * s}px solid ${C.red}`, padding: `${8 * s}px ${22 * s}px`, borderRadius: 14 * s, fontSize: 40 * s, fontFamily: FONT.title, letterSpacing: 1}}>
            {n} <span style={{color: C.red}}>PESSOAS ASSISTINDO</span>
          </span>
        </div>
      )}
      <div style={{...abs, left: 30 * s, bottom: 120 * s, width: '72%', height: rowH * 5, overflow: 'hidden'}}>
        {Array.from({length: 7}).map((_, i) => {
          const idx = first - i;
          if (idx < 0) return null;
          const [u, c] = COMMENTS[idx % COMMENTS.length];
          const yy = (scroll - idx) * rowH; // sobe com o tempo
          const op = clamp(1 - yy / (rowH * 5));
          return (
            <div key={idx} style={{...abs, left: 0, bottom: yy, display: 'flex', gap: 12 * s, alignItems: 'center', opacity: op, fontSize: 30 * s}}>
              <div style={{width: 46 * s, height: 46 * s, borderRadius: 46, background: `hsl(${(idx * 67) % 360},55%,55%)`, flexShrink: 0}} />
              <div><span style={{color: '#cfd6e6', fontFamily: FONT.semi, fontSize: 24 * s}}>{u}</span><br />{c}</div>
            </div>
          );
        })}
      </div>
      {Array.from({length: 8}).map((_, i) => {
        const p = (t * 0.7 + i / 8) % 1;
        return <div key={i} style={{...abs, right: (40 + Math.sin(p * 9 + i) * 26) * s, bottom: (140 + p * 520) * s, fontSize: 52 * s, opacity: 1 - p, transform: `scale(${0.6 + p * 0.6})`}}>{['❤️', '😱', '❤️', '👀'][i % 4]}</div>;
      })}
    </div>
  );
};

/** Moldura de câmera de segurança */
export const CCTV: React.FC<{
  t: number; label: string; clock: number; children: React.ReactNode; tint?: string; glitch?: number; small?: boolean; noSignal?: boolean; highlightClock?: number;
}> = ({t, label, clock, children, tint = '#4a7dff', glitch = 0, small = false, noSignal = false, highlightClock = 0}) => {
  const fs = small ? 22 : 34;
  const hh = Math.floor(clock / 3600) % 24, mm = Math.floor(clock / 60) % 60, ss = Math.floor(clock) % 60;
  const ts = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  const jx = glitch ? (rnd(`gx${Math.floor(t * 30)}`) - 0.5) * 40 * glitch : 0;
  return (
    <div style={{...abs, inset: 0, overflow: 'hidden', background: '#000'}}>
      <div style={{...abs, inset: 0, transform: `translateX(${jx}px)`, filter: `saturate(0.55) contrast(1.1) brightness(0.95)`}}>{children}</div>
      <div style={{...abs, inset: 0, background: tint, mixBlendMode: 'color', opacity: 0.35}} />
      <div style={{...abs, inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 5px)'}} />
      <div style={{...abs, inset: 0, boxShadow: 'inset 0 0 160px rgba(0,0,0,0.85)'}} />
      {glitch > 0 && Array.from({length: 6}).map((_, i) => {
        const r = rnd(`gl${i}-${Math.floor(t * 20)}`);
        return <div key={i} style={{...abs, left: 0, right: 0, top: `${r * 100}%`, height: 6 + r * 40, background: i % 2 ? 'rgba(255,45,61,0.45)' : 'rgba(111,211,255,0.4)', transform: `translateX(${(r - 0.5) * 120}px)`, opacity: glitch}} />;
      })}
      {noSignal && (
        <div style={{...abs, inset: 0, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, color: '#ddd', fontSize: fs * 1.5}}>
          <div style={{...abs, inset: 0, opacity: 0.35, background: `repeating-linear-gradient(${Math.floor(t * 30) * 37}deg, #fff 0 1px, #000 1px 3px)`}} />
          <span style={{position: 'relative', background: '#000', padding: '8px 20px'}}>SEM SINAL</span>
        </div>
      )}
      <div style={{...abs, left: 18, top: 16, fontFamily: FONT.mono, fontSize: fs, color: '#e8eefc', textShadow: '0 2px 4px #000'}}>{label}</div>
      <div style={{...abs, right: 18, top: 16, fontFamily: FONT.mono, fontSize: fs, color: C.red, opacity: Math.sin(t * 5) > 0 ? 1 : 0.25}}>● REC</div>
      <div style={{...abs, left: 18, bottom: 14, fontFamily: FONT.mono, fontSize: fs, color: '#e8eefc', textShadow: '0 2px 4px #000', padding: '2px 8px', borderRadius: 10, outline: highlightClock > 0 ? `${5}px solid rgba(255,45,61,${highlightClock})` : 'none', outlineOffset: 4}}>
        15/11 {ts}
      </div>
    </div>
  );
};

/** Card de regra (estilo "REGRA Nº 1") */
export const RuleCard: React.FC<{t: number; n: number; text: string; y?: number}> = ({t, n, text, y = 560}) => {
  const k = tw(t, 0, 0.35, 0, 1, ease.back);
  const chars = Math.floor(tw(t, 0.3, 1.6, 0, text.length, ease.linear));
  return (
    <div style={{...abs, left: 70, right: 70, top: y, transform: `scale(${k}) rotate(${(1 - k) * -6}deg)`, opacity: clamp(k * 2)}}>
      <div style={{background: 'rgba(8,10,18,0.92)', border: `5px solid ${C.red}`, borderRadius: 28, padding: '34px 40px 40px', textAlign: 'center', boxShadow: `0 0 60px ${C.red}66`}}>
        <div style={{display: 'inline-block', background: C.red, color: '#fff', fontFamily: FONT.title, fontSize: 44, padding: '6px 26px', borderRadius: 12, marginTop: -70, letterSpacing: 2}}>REGRA Nº {n}</div>
        <div style={{color: '#fff', fontFamily: FONT.title, fontSize: 62, lineHeight: 1.15, marginTop: 18}}>
          {text.slice(0, chars)}<span style={{opacity: Math.sin(t * 12) > 0 ? 1 : 0}}>▌</span>
        </div>
      </div>
    </div>
  );
};

/** Cronômetro (TEMPO RESTANTE) */
export const Timer: React.FC<{t: number; remaining: number; x?: number; y?: number; size?: number; label?: string; appear?: number; frozen?: boolean}> = ({t, remaining, x = 540, y = 300, size = 1, label = 'TEMPO RESTANTE', appear = 1, frozen = false}) => {
  const r = Math.max(0, Math.ceil(remaining));
  const txt = `${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`;
  const frac = remaining - Math.floor(remaining);
  const pulse = frozen ? 1 : 1 + (frac > 0.8 ? (frac - 0.8) * 0.6 : 0);
  const blink = frozen ? (Math.sin(t * 4) > 0 ? 1 : 0.55) : remaining < 11 ? (frac > 0.5 ? 1 : 0.55) : 1;
  return (
    <div style={{...abs, left: x - 300 * size, top: y - 90 * size, width: 600 * size, textAlign: 'center', transform: `scale(${appear * pulse})`, opacity: clamp(appear * 3)}}>
      <div style={{fontFamily: FONT.title, color: '#fff', fontSize: 32 * size, letterSpacing: 4, textShadow: '0 3px 8px #000'}}>{label}</div>
      <div style={{display: 'inline-block', marginTop: 6 * size, background: 'rgba(10,0,2,0.8)', border: `${5 * size}px solid ${C.red}`, borderRadius: 20 * size, padding: `${2 * size}px ${30 * size}px`, fontFamily: FONT.mono, fontSize: 110 * size, color: C.red, opacity: blink, textShadow: `0 0 ${24 * size}px ${C.red}`}}>{txt}</div>
    </div>
  );
};

/** Mensagem recebida (notificação grande) */
export const MessageBubble: React.FC<{t: number; from: string; text: string; y?: number}> = ({t, from, text, y = 220}) => {
  const k = tw(t, 0, 0.35, 0, 1, ease.back);
  return (
    <div style={{...abs, left: 60, right: 60, top: y - (1 - k) * 200, opacity: clamp(k * 2)}}>
      <div style={{background: 'rgba(20,22,32,0.96)', borderRadius: 34, padding: '26px 30px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', border: `3px solid ${C.red}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 70, height: 70, borderRadius: 18, background: C.red, color: '#fff', fontFamily: FONT.title, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>!</div>
          <div style={{fontFamily: FONT.semi, color: '#aab3c7', fontSize: 30}}>{from} · agora</div>
        </div>
        <div style={{fontFamily: FONT.title, color: '#fff', fontSize: 60, marginTop: 14, lineHeight: 1.1}}>{text}</div>
      </div>
    </div>
  );
};

/** Card de votação A/B */
export const VoteCard: React.FC<{letter: 'A' | 'B'; text: string; color: string; x: number; y: number; w: number; k: number; active: number}> = ({letter, text, color, x, y, w, k, active}) => (
  <div style={{...abs, left: x, top: y, width: w, transform: `scale(${k * (1 + active * 0.07)})`, opacity: clamp(k * 2), textAlign: 'center'}}>
    <div style={{background: 'rgba(6,8,14,0.88)', border: `6px solid ${color}`, borderRadius: 34, padding: '26px 16px 30px', boxShadow: `0 0 ${30 + active * 60}px ${color}${active > 0.3 ? 'cc' : '66'}`}}>
      <div style={{width: 130, height: 130, margin: '0 auto', borderRadius: 130, background: color, color: '#fff', fontFamily: FONT.title, fontSize: 96, lineHeight: '130px'}}>{letter}</div>
      <div style={{fontFamily: FONT.title, color: '#fff', fontSize: 50, lineHeight: 1.08, marginTop: 18}}>{text}</div>
    </div>
  </div>
);

/** Chamada recebida */
export const IncomingCall: React.FC<{t: number; name: string; avatar?: React.ReactNode}> = ({t, name, avatar}) => (
  <div style={{...abs, inset: 0, background: 'linear-gradient(#1a1f2e, #07090f)', fontFamily: FONT.bold, color: '#fff', textAlign: 'center'}}>
    <div style={{...abs, top: '12%', left: 0, right: 0, fontSize: 40, fontFamily: FONT.semi, color: '#aab3c7', letterSpacing: 3}}>CHAMADA RECEBIDA</div>
    <div style={{...abs, top: '22%', left: '50%', width: 300, height: 300, marginLeft: -150, borderRadius: 300, overflow: 'hidden', background: '#2a3045', border: '6px solid #fff', transform: `scale(${1 + Math.max(0, Math.sin(t * 14)) * 0.04})`}}>{avatar}</div>
    <div style={{...abs, top: '45%', left: 0, right: 0, fontSize: 130, fontFamily: FONT.title, color: C.white}}>{name}</div>
    <div style={{...abs, top: '57%', left: 0, right: 0, fontSize: 34, color: '#aab3c7'}}>celular</div>
    <div style={{...abs, bottom: '12%', left: '18%', width: 150, height: 150, borderRadius: 150, background: C.red, fontSize: 70, lineHeight: '150px'}}>✕</div>
    <div style={{...abs, bottom: '12%', right: '18%', width: 150, height: 150, borderRadius: 150, background: C.green, fontSize: 70, lineHeight: '150px', transform: `rotate(${Math.sin(t * 30) * 12}deg)`}}>✆</div>
  </div>
);

/** Conteúdo da TV do hacker (viewBox 0 0 428 238) */
export const HackerTV: React.FC<{t: number; env?: number; mode: 'compromised' | 'hacker' | 'exits'}> = ({t, env = 0, mode}) => {
  const g = Math.floor(t * 24);
  return (
    <g>
      <rect width={428} height={238} fill={mode === 'compromised' ? '#14040a' : '#06070c'} />
      {Array.from({length: 40}).map((_, i) => <rect key={i} x={0} y={i * 6} width={428} height={2} fill="#fff" opacity={0.03} />)}
      {mode === 'compromised' && (
        <g>
          <text x={214 + (rnd(`tvx${g}`) - 0.5) * 6} y={96} fill={C.red} fontSize={30} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800}>⚠ ALERTA</text>
          <text x={214} y={140} fill="#fff" fontSize={25} textAnchor="middle" fontFamily={FONT.title}>SISTEMA DO PRÉDIO</text>
          <text x={214 + (rnd(`tvy${g}`) - 0.5) * 8} y={176} fill={C.red} fontSize={30} textAnchor="middle" fontFamily={FONT.title}>COMPROMETIDO</text>
          {rnd(`tvg${g}`) > 0.6 && <rect x={0} y={rnd(`tvh${g}`) * 238} width={428} height={14} fill={C.cyan} opacity={0.35} />}
        </g>
      )}
      {mode === 'hacker' && (
        <g>
          <g transform={`translate(214, 92) scale(${1 + env * 0.18})`}>
            <path d="M0,-62 L58,40 L-58,40 Z" fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-5} y={-26} width={10} height={36} rx={4} fill={C.red} />
            <circle cx={0} cy={24} r={6} fill={C.red} />
          </g>
          {Array.from({length: 31}).map((_, i) => {
            const h = 4 + env * 60 * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + t * 18)));
            return <rect key={i} x={60 + i * 10} y={196 - h / 2} width={6} height={h} rx={3} fill={C.red} opacity={0.9} />;
          })}
          <text x={214} y={232} fill="#ff98a0" fontSize={13} textAnchor="middle" fontFamily={FONT.mono}>TRANSMISSÃO PRIORITÁRIA · TODOS OS APARTAMENTOS</text>
        </g>
      )}
      {mode === 'exits' && (
        <g fontFamily={FONT.mono} fontWeight={800}>
          <text x={24} y={40} fill={C.red} fontSize={22}>SAÍDAS DO PRÉDIO</text>
          {['PORTARIA', 'GARAGEM', 'ESCADA B', 'ELEVADOR'].map((s, i) => (
            <g key={s} opacity={t > i * 0.25 ? 1 : 0}>
              <text x={24} y={84 + i * 40} fill="#fff" fontSize={22}>{s}</text>
              <text x={404} y={84 + i * 40} fill={C.red} fontSize={22} textAnchor="end">■ BLOQUEADA</text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
