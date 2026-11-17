import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hall6, CameraClose, Door604, H6} from '../../sets/Hall6';
import {Backpack} from '../../sets/ElevatorSets';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Phone, CCTV, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 4 — "A PROVA QUE NÃO EXISTE" (após 3A; venceu A: continuar com Davi). Máx. 90 s.
 * Corredor do 6º, posições do fim do 3A: Bia (1130) e Davi (1380). Elevador REAL aberto (0.42).
 * Pista: na gravação falsa o elevador está FECHADO.
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const DAVI_BAG: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
const REC_CLOCK = 23 * 3600 + 41 * 60 + 8;

type P = {x?: number; pose?: Pose; expr?: any; lookX?: number; lookY?: number; mouthOff?: boolean; phoneLit?: boolean};
const Hall: React.FC<{T: number; cx: number; cy: number; z: number; davi?: P; bia?: P; camRot?: number; open?: number}> = ({T, cx, cy, z, davi, bia, camRot = 0, open = 0.42}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <Hall6 open={open} readerState="denied" camRot={camRot}>
      {davi && <Davi t={T} x={davi.x ?? H6.daviEnd.x} y={H6.floorY + 2} pose={davi.pose ?? DAVI_BAG} holdR={BAG} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? -0.7} lookY={davi.lookY ?? 0} mouth={davi.mouthOff ? 0 : mouthOf('DAVI', T, 1.2)} />}
      {bia && <Bia t={T} x={bia.x ?? H6.biaEnd.x} y={H6.floorY + 2} pose={bia.pose ?? POSES.phoneL} phone="L" phoneLit={bia.phoneLit} expr={bia.expr ?? 'worried'} lookX={bia.lookX ?? 0.7} lookY={bia.lookY ?? 0} mouth={bia.mouthOff ? 0 : mouthOf('BIA', T, 1.2)} />}
    </Hall6>
  </SvgCamera>
);
const bg = (el: React.ReactNode, extra?: React.ReactNode) => <AbsoluteFill style={{background: C.bg}}>{el}<Vignette strength={VIG} />{extra}</AbsoluteFill>;
const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);
const Tag: React.FC<{text: string; color: string; y: number}> = ({text, color, y}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center'}}>
    <span style={{display: 'inline-block', background: 'rgba(0,0,0,0.75)', border: `4px solid ${color}`, color: '#fff', fontFamily: FONT.title, fontSize: 46, padding: '8px 26px', borderRadius: 16}}>{text}</span>
  </div>
);

/** A GRAVAÇÃO FALSA (mesma do EP. 3A): elevador FECHADO. zoom = Bia ampliando a porta; circle destaca a porta. */
const Recording: React.FC<{T: number; zoom?: number; circle?: number; distort?: number}> = ({T, zoom = 1, circle = 0, distort = 0}) => (
  <CCTV t={T} label="CÂMERA 06 — GRAVAÇÃO" clock={REC_CLOCK + Math.floor(Math.max(0, T - 10.6)) % 4} tint="#4a7dff" glitch={0.1 + distort * 0.8}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '38% 45%'}}>
      <svg viewBox="80 300 900 1600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <Hall6 open={0}>
          <g transform={distort > 0 ? `translate(470,0) skewX(${distort * 18}) scale(${1 + distort * 0.25},1) translate(-470,0)` : undefined}>
            <Davi t={T} x={470} y={H6.floorY + 2} pose={{...REST, lSh: 0, lEl: 0, lT: {x: 92, y: -700}, lHand: 'grip'}} phone="L" expr="neutral" lookX={0.3} mouth={mouthOf('DAVI_REC', T, 1.2)} />
          </g>
          {circle > 0 && <ellipse cx={450} cy={1000} rx={300} ry={520} fill="none" stroke={C.red} strokeWidth={14} opacity={circle} />}
        </Hall6>
      </svg>
    </div>
  </CCTV>
);

/* ───────── CENA 1 — A ESCOLHA DO PÚBLICO (0–8s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  const lower = tw(T, 4.9, 5.4, 0, 1, ease.inOut);
  const pose = mixPose({...POSES.phoneL, lT: {x: 30, y: -560}, lFs: 0.7, lHand: 'grip'}, POSES.phoneL, lower);
  return bg(<Hall T={T} cx={1255} cy={kf(t, [[0, 1000], [8, 980]])} z={kf(t, [[0, 1.45], [8, 1.52]])}
    bia={{pose, expr: T > 5.4 ? 'determined' : 'suspicious', lookX: 0.7, lookY: lower < 0.5 ? 0.4 : 0, phoneLit: lower < 0.5}}
    davi={{expr: T > 7.2 ? 'neutral' : 'worried', lookX: -0.7}} />);
};

/* ───────── CENA 2 — O DETALHE ERRADO (8–25s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 8 + t;
  if (t < 2.6) {
    // Davi se aproxima (corte) e aponta para o celular, sem tocar
    const point: Pose = {...DAVI_BAG, lSh: 0, lEl: 0, lT: {x: -170, y: -560}, lFs: 0.85, lHand: 'point', lHandRot: -250};
    return bg(<Hall T={T} cx={1220} cy={980} z={1.6} davi={{x: H6.daviEnd.x - 90, pose: mixPose(DAVI_BAG, point, tw(T, 8.3, 8.8, 0, 1, ease.inOut)), expr: 'confused', lookX: -0.8, lookY: 0.4}}
      bia={{expr: 'suspicious', lookY: 0.5, phoneLit: true}} />);
  }
  if (t < 5.0) return <PhoneShot T={T}><Recording T={T} /></PhoneShot>;
  if (t < 7.6) {
    // "Olha a porta. Ela tá fechada." — dedo do Davi aponta, Bia amplia e a porta fica destacada
    const z = tw(T, 14.4, 15.2, 1, 1.4, ease.inOut);
    return (
      <PhoneShot T={T}>
        <Recording T={T} zoom={z} circle={tw(T, 15.1, 15.4, 0, 1)} />
        <div style={{position: 'absolute', right: -40, bottom: 260 + tw(T, 13.0, 13.5, -300, 0, ease.out), width: 120, height: 360, borderRadius: 60, background: '#c98f6b', transform: 'rotate(-28deg)', opacity: T < 14.6 ? 1 : 0}} />
      </PhoneShot>
    );
  }
  if (t < 8.9) return bg(<Hall T={T} cx={H6.biaEnd.x} cy={800} z={2.5} bia={{expr: 'confused', lookX: 0.8}} />);
  if (t < 11.2) return bg(<Hall T={T} cx={H6.daviEnd.x - 90} cy={790} z={2.5} davi={{x: H6.daviEnd.x - 90, expr: 'determined', lookX: -0.8}} />);
  if (t < 13.4) {
    // FLASH do EP. 3A: Davi tinha aberto a porta à mão; Bia saiu do elevador
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{filter: 'grayscale(0.7) brightness(1.15) contrast(0.95)'}}>
          <Hall T={T} cx={720} cy={1020} z={1.08} davi={{x: H6.davi.x, expr: 'neutral', lookX: 0.6, mouthOff: true}} bia={{x: H6.bia.x, expr: 'worried', lookX: -0.6, mouthOff: true}} />
        </AbsoluteFill>
        <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(255,255,255,0.55)'}} />
        <Tag text="MOMENTOS ANTES: PORTA ABERTA" color={C.green} y={250} />
      </AbsoluteFill>
    );
  }
  if (t < 15.2) {
    return <PhoneShot T={T}><Recording T={T} zoom={1.4} circle={1} /><Tag text="NA GRAVAÇÃO: FECHADA" color={C.red} y={140} /></PhoneShot>;
  }
  return bg(<Hall T={T} cx={560} cy={1000} z={1.25} />, <Tag text="AGORA: ABERTA" color={C.green} y={250} />);
};

/* ───────── CENA 3 — A GRAVAÇÃO FOI ALTERADA (25–40s) ───────── */
export const S3: React.FC = () => {
  const t = useT(); const T = 25 + t;
  if (t < 2.4) return bg(<Hall T={T} cx={H6.biaEnd.x} cy={800} z={2.5} bia={{expr: 'surprised', lookX: T < 25.9 ? -0.9 : 0.1, lookY: T < 25.9 ? 0 : 0.6, phoneLit: true}} />);
  if (t < 4.8) return bg(<Hall T={T} cx={H6.daviEnd.x - 90} cy={790} z={2.5} davi={{x: H6.daviEnd.x - 90, expr: 'determined', lookX: -0.8}} />);
  if (t < 6.8) return <PhoneShot T={T}><Recording T={T} distort={T > 30.2 && T < 30.9 ? 1 : 0} /></PhoneShot>;
  if (t < 9.2) return bg(<Hall T={T} cx={H6.biaEnd.x} cy={800} z={2.5} bia={{expr: 'worried', lookX: 0.8}} />);
  if (t < 11.8) {
    // ele olha para a câmera do corredor e não responde
    return bg(<Hall T={T} cx={H6.daviEnd.x - 160} cy={kf(t, [[9.2, 820], [11.8, 700]])} z={2.0} davi={{x: H6.daviEnd.x - 90, expr: 'worried', lookX: tw(T, 34.4, 35.0, -0.8, -0.7), lookY: tw(T, 34.4, 35.0, 0, -1), mouthOff: true}} />);
  }
  return bg(<SvgCamera cx={540} cy={760} zoom={kf(t, [[11.8, 1.0], [15, 1.12]])}><CameraClose rot={0} led={Math.sin(T * 3) > -0.3 ? 1 : 0.5} /></SvgCamera>);
};

/* ───────── CENA 4 — A CÂMERA ESTÁ OBSERVANDO (40–54s) ───────── */
export const S4: React.FC = () => {
  const t = useT(); const T = 40 + t;
  const rot = tw(T, 43.5, 44.4, 0, 14, ease.inOut);
  if (t < 3.4) return bg(<Hall T={T} cx={H6.biaEnd.x} cy={800} z={2.5} bia={{expr: 'fear', lookX: 0.2, lookY: -0.9}} />);
  if (t < 4.8) return bg(<SvgCamera cx={540} cy={760} zoom={1.1}><CameraClose rot={rot} /></SvgCamera>);
  if (t < 8.0) {
    // "Não olha pra ela. Vem comigo." — indica a passagem lateral
    const point: Pose = {...DAVI_BAG, lSh: 0, lEl: 0, lT: {x: 170, y: -560}, lFs: 0.9, lHand: 'point', lHandRot: -90};
    return bg(<Hall T={T} cx={1450} cy={980} z={1.4} camRot={14} davi={{x: H6.daviEnd.x - 90, pose: mixPose(DAVI_BAG, point, tw(T, 46.4, 46.9, 0, 1, ease.inOut)), expr: 'determined', lookX: -0.5}}
      bia={{expr: 'fear', lookX: 0.7}} />);
  }
  if (t < 9.6) {
    // ela começa a acompanhá-lo; o celular vibra; os dois param
    const stop = T > 49.2;
    return bg(<Hall T={T} cx={1450} cy={980} z={1.4} camRot={14} davi={{x: H6.daviEnd.x - 40, expr: stop ? 'worried' : 'determined', lookX: stop ? -0.8 : 0.6, mouthOff: true}}
      bia={{x: H6.biaEnd.x + 60, expr: stop ? 'fear' : 'worried', lookX: stop ? 0 : 0.8, lookY: stop ? 0.7 : 0}} />);
  }
  return bg(<Hall T={T} cx={H6.biaEnd.x + 60} cy={800} z={2.6} camRot={14} bia={{x: H6.biaEnd.x + 60, expr: 'fear', lookX: T < 51.8 ? 0.6 : 0, lookY: T < 51.8 ? 0 : 0.7, mouthOff: true}} />);
};

/* ───────── CENA 5 — A NOVA MENSAGEM (54–68s) ───────── */
const Msg: React.FC<{t: number; lines: string[]}> = ({t, lines}) => (
  <div style={{position: 'absolute', inset: 0, background: '#07080d', paddingTop: 440, boxSizing: 'border-box', textAlign: 'center'}}>
    {lines.map((l, i) => (
      <div key={l} style={{margin: '40px 50px 0', background: 'rgba(255,45,61,0.12)', border: `4px solid ${C.red}`, borderRadius: 30, padding: '36px 28px', fontFamily: FONT.title, fontSize: 62, color: '#fff', lineHeight: 1.12, opacity: clamp((t - i * 2.4) * 5)}}>{l}</div>
    ))}
  </div>
);
export const S5: React.FC = () => {
  const t = useT(); const T = 54 + t;
  if (t < 0.6) return <PhoneShot T={T}><div style={{position: 'absolute', inset: 0, background: '#000'}} /></PhoneShot>;
  if (t < 5.8) return <PhoneShot T={T} glow={C.red}><Msg t={t - 0.6} lines={['VOCÊ DESCOBRIU A GRAVAÇÃO.', 'MAS AINDA NÃO ENTENDEU O JOGO.']} /></PhoneShot>;
  if (t < 7.4) return bg(<Hall T={T} cx={H6.biaEnd.x + 60} cy={800} z={2.6} camRot={14} bia={{x: H6.biaEnd.x + 60, expr: 'confused', lookY: 0.6, phoneLit: true}} />);
  if (t < 9.4) return bg(<Hall T={T} cx={H6.daviEnd.x - 40} cy={790} z={2.5} camRot={14} davi={{x: H6.daviEnd.x - 40, expr: 'confused', lookX: -0.8, lookY: 0.4}} />);
  if (t < 10.6) return bg(<Hall T={T} cx={H6.biaEnd.x + 60} cy={800} z={2.6} camRot={14} bia={{x: H6.biaEnd.x + 60, expr: 'worried', lookX: 0.8, mouthOff: true}} />);
  // a tela muda: interferência curta e silêncio
  return (
    <PhoneShot T={T}>
      <div style={{position: 'absolute', inset: 0, background: '#000'}} />
      <Glitch amount={T > 64.6 && T < 65.1 ? 0.9 : 0} seed={64} />
    </PhoneShot>
  );
};

/* ───────── CENA 6 — O CLIFFHANGER (68–77s) ───────── */
const Clandestine: React.FC<{t: number; T: number; cam?: boolean}> = ({t, T, cam = false}) => (
  <div style={{position: 'absolute', inset: 0, background: '#030305', textAlign: 'center'}}>
    <div style={{position: 'absolute', left: 40, top: 110, fontFamily: FONT.mono, fontSize: 30, color: C.red, opacity: Math.sin(T * 5) > 0 ? 1 : 0.4}}>● TRANSMISSÃO</div>
    <div style={{position: 'absolute', right: 40, top: 108, display: 'flex', gap: 6, alignItems: 'flex-end'}}>
      {[14, 22, 30, 38].map((h, i) => <div key={i} style={{width: 10, height: h, background: i < 3 ? C.red : '#3a1015'}} />)}
    </div>
    <div style={{position: 'absolute', left: 30, right: 30, top: cam ? 230 : 560, fontFamily: FONT.title, color: '#fff', fontSize: 74, lineHeight: 1.12}}>
      <div style={{opacity: clamp(t * 5)}}>VOCÊ NÃO É A ÚNICA</div>
      <div style={{color: C.red, opacity: clamp((t - 1.2) * 5), textShadow: `0 0 24px ${C.red}88`}}>PARTICIPANTE.</div>
    </div>
    {cam && (
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, height: 820, border: `4px solid ${C.red}`, borderRadius: 18, overflow: 'hidden'}}>
        <CCTV t={T} label="APARTAMENTO 604" clock={23 * 3600 + 52 * 60 + Math.floor(T - 60)} tint="#ff2d3d" glitch={0.06}>
          <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
            <Door604 knock={(T > 73.6 && T < 73.9) || (T > 74.2 && T < 74.5) || (T > 74.8 && T < 75.1) ? 1 : 0} t={T} />
          </svg>
        </CCTV>
      </div>
    )}
  </div>
);
export const S6: React.FC = () => {
  const t = useT(); const T = 68 + t;
  if (t < 2.4) return <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{transform: `scale(${kf(t, [[0, 1.12], [2.4, 1.18]])})`}}><PhoneShot T={T}><Clandestine t={t - 0.2} T={T} /></PhoneShot></AbsoluteFill></AbsoluteFill>;
  if (t < 4.2) return bg(<Hall T={T} cx={H6.biaEnd.x + 60} cy={800} z={2.8} camRot={14} bia={{x: H6.biaEnd.x + 60, expr: 'shock', lookY: 0.6, phoneLit: true}} />);
  if (t < 7.2) return <PhoneShot T={T}><Clandestine t={9} T={T} cam /></PhoneShot>;
  if (t < 8.6) return bg(<Hall T={T} cx={H6.biaEnd.x + 60} cy={800} z={2.8} camRot={14} bia={{x: H6.biaEnd.x + 60, expr: 'fear', lookX: 1, mouthOff: true}} />);
  return <AbsoluteFill style={{background: '#000'}} />;
};

/* ───────── CENA 7 — VOTAÇÃO (77–87s) ───────── */
export const S7: React.FC = () => {
  const t = useT(); const T = 77 + t;
  if (t < 0.4) return <AbsoluteFill style={{background: '#000'}} />;
  const show = tw(t, 0.4, 0.9, 0, 1, ease.out);
  const glow = 0.5 + 0.5 * Math.sin(T * 3);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox="0 0 1080 1920" width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><Door604 /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox={`${H6.daviEnd.x - 400} 300 540 1920`} width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
          <Hall6 open={0.42} readerState="denied" camRot={14}>
            <Davi t={T} x={H6.daviEnd.x - 40} y={H6.floorY + 2} pose={DAVI_BAG} holdR={BAG} expr="worried" lookX={-0.6} />
            <Bia t={T} x={H6.biaEnd.x + 60} y={H6.floorY + 2} pose={POSES.phoneL} phone="L" expr="worried" lookX={0.6} />
          </Hall6>
        </svg>
        <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
      </div>
      <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: show}} />
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: show}}>
        <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: '3px solid #fff', borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: '#fff', fontSize: 44, letterSpacing: 2}}>VOCÊ DECIDE O DESTINO DE BIA</span>
      </div>
      <div style={{filter: `drop-shadow(0 0 ${8 + glow * 14}px ${C.blue})`}}><VoteCard letter="A" text="INVESTIGAR O 604" color={C.blue} x={30} y={780} w={490} k={show} active={0} /></div>
      <div style={{filter: `drop-shadow(0 0 ${8 + (1 - glow) * 14}px ${C.red})`}}><VoteCard letter="B" text="SEGUIR COM DAVI" color={C.red} x={560} y={780} w={490} k={show} active={0} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', opacity: tw(T, 82.0, 82.4, 0, 1)}}>
        <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 70, padding: '10px 36px', borderRadius: 22}}>
          COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>!
        </div>
      </div>
      <Glitch amount={T > 86.7 ? 0.8 : 0} seed={86} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 8 — ENCERRAMENTO (87–90s) ───────── */
export const S8: React.FC = () => {
  const t = useT();
  const k = tw(t, 0.25, 0.7, 0, 1, ease.out);
  const flick = t > 1.6 && t < 1.68 ? 0.25 : 1;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{opacity: k * flick}}>
        <div style={{fontFamily: FONT.mono, color: C.red, fontSize: 40, letterSpacing: 6, textShadow: `0 0 20px ${C.red}`}}>● TRANSMISSÃO INTERROMPIDA</div>
        <div style={{marginTop: 60, fontFamily: FONT.title, color: '#fff', fontSize: 120, lineHeight: 1, letterSpacing: 4}}>SISTEMA</div>
        <div style={{fontFamily: FONT.title, color: C.red, fontSize: 120, lineHeight: 1.05, letterSpacing: 4, textShadow: `0 0 30px ${C.red}88`, transform: `translateX(${flick < 1 ? 14 : 0}px)`}}>INVADIDO</div>
        <div style={{marginTop: 60, fontFamily: FONT.bold, color: '#aab3c7', fontSize: 46, letterSpacing: 8, opacity: clamp((t - 0.9) * 2.5)}}>CONTINUA…</div>
      </div>
    </AbsoluteFill>
  );
};
