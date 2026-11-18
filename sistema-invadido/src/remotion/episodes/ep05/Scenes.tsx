import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hall6, AptCorridor, HandleClose, CameraClose, ReaderClose, Door604, H6, AP} from '../../sets/Hall6';
import {Backpack} from '../../sets/ElevatorSets';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Phone, CCTV, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 5 — "O APARTAMENTO 604" (após EP. 4; venceu A: investigar o 604). Máx. 90 s.
 * Clara só aparece pela voz, atrás da porta. Bia não abre a porta antes da votação.
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const DAVI_BAG: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
const D604 = AP.door(604);

type P = {x?: number; pose?: Pose; expr?: any; lookX?: number; lookY?: number; mouthOff?: boolean; phoneLit?: boolean};
const Corr: React.FC<{T: number; cx: number; cy: number; z: number; davi?: P; bia?: P; knock?: number; camRot?: number}> = ({T, cx, cy, z, davi, bia, knock = 0, camRot = 0}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <AptCorridor t={T} knock={knock} camRot={camRot}>
      {davi && <Davi t={T} x={davi.x ?? AP.davi.x} y={AP.floorY + 2} pose={davi.pose ?? DAVI_BAG} holdR={BAG} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? 0.7} lookY={davi.lookY ?? 0} mouth={davi.mouthOff ? 0 : mouthOf('DAVI', T, 1.2)} />}
      {bia && <Bia t={T} x={bia.x ?? AP.bia.x} y={AP.floorY + 2} pose={bia.pose ?? POSES.phoneL} phone="L" phoneLit={bia.phoneLit} expr={bia.expr ?? 'worried'} lookX={bia.lookX ?? -0.8} lookY={bia.lookY ?? 0} mouth={bia.mouthOff ? 0 : mouthOf('BIA', T, 1.2)} />}
    </AptCorridor>
  </SvgCamera>
);
const bg = (el: React.ReactNode, extra?: React.ReactNode) => <AbsoluteFill style={{background: C.bg}}>{el}<Vignette strength={VIG} />{extra}</AbsoluteFill>;
const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);
const Msg: React.FC<{t: number; lines: string[]; gap?: number; glitch?: boolean; T?: number}> = ({t, lines, gap = 2.1, glitch, T = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: '#07080d', paddingTop: 440, boxSizing: 'border-box', textAlign: 'center'}}>
    {lines.map((l, i) => (
      <div key={l} style={{margin: '40px 50px 0', background: 'rgba(255,45,61,0.12)', border: `4px solid ${C.red}`, borderRadius: 30, padding: '36px 28px', fontFamily: FONT.title, fontSize: 62, color: '#fff', lineHeight: 1.12, opacity: clamp((t - i * gap) * 5),
        transform: glitch && Math.floor(T * 12) % 9 === 0 ? 'translateX(10px)' : 'none'}}>{l}</div>
    ))}
    {glitch && <Glitch amount={Math.floor(T * 12) % 9 === 0 ? 0.35 : 0} seed={65} />}
  </div>
);
/** plano fixo da porta 604 (Bia ao lado) — Clara só pela voz */
const DoorFixed: React.FC<{T: number; knock?: number; biaExpr?: any; biaLookX?: number}> = ({T, knock = 0, biaExpr = 'worried', biaLookX = -0.9}) =>
  bg(<Corr T={T} cx={D604.x + 250} cy={1000} z={1.25} knock={knock} bia={{expr: biaExpr, lookX: biaLookX, mouthOff: true}} />);

/* ───────── CENA 1 — A DECISÃO (0–8s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  if (t < 2.6) {
    // a mensagem anterior ainda está na tela, com a imagem da porta 604
    return (
      <PhoneShot T={T}>
        <div style={{position: 'absolute', inset: 0, background: '#030305', textAlign: 'center'}}>
          <div style={{position: 'absolute', left: 40, top: 110, fontFamily: FONT.mono, fontSize: 30, color: C.red}}>● TRANSMISSÃO</div>
          <div style={{position: 'absolute', left: 30, right: 30, top: 230, fontFamily: FONT.title, color: '#fff', fontSize: 74, lineHeight: 1.12}}>
            VOCÊ NÃO É A ÚNICA<div style={{color: C.red}}>PARTICIPANTE.</div>
          </div>
          <div style={{position: 'absolute', left: 90, right: 90, top: 560, height: 820, border: `4px solid ${C.red}`, borderRadius: 18, overflow: 'hidden'}}>
            <CCTV t={T} label="APARTAMENTO 604" clock={23 * 3600 + 52 * 60 + 20} tint="#ff2d3d" glitch={0.06}>
              <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}><Door604 /></svg>
            </CCTV>
          </div>
        </div>
      </PhoneShot>
    );
  }
  const nod = T > 7.5 && T < 8 ? Math.sin((T - 7.5) * Math.PI * 2) * 0.6 : 0;
  return bg(<SvgCamera cx={1255} cy={kf(t, [[0, 1000], [8, 980]])} zoom={kf(t, [[0, 1.45], [8, 1.52]])}>
    <Hall6 open={0.42} readerState="denied" camRot={14}>
      <Davi t={T} x={H6.daviEnd.x - 40} y={H6.floorY + 2} pose={DAVI_BAG} holdR={BAG} expr="worried" lookX={-0.7} lookY={Math.max(0, nod)} mouth={0} />
      <Bia t={T} x={H6.biaEnd.x + 60} y={H6.floorY + 2} pose={POSES.phoneL} phone="L" phoneLit={T < 5.6} expr={T > 5.8 ? 'determined' : 'worried'} lookX={T > 5.6 ? 0.7 : 0} lookY={T > 5.6 ? 0 : 0.6} mouth={mouthOf('BIA', T, 1.2)} />
    </Hall6>
  </SvgCamera>);
};

/* ───────── CENA 2 — A PORTA 604 (8–22s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 8 + t;
  if (t < 3.2) {
    // a câmera acompanha pelo corredor: 601… 602… 603… até chegar ao 604, onde os dois estão
    return bg(<Corr T={T} cx={kf(t, [[0, 600], [3.2, 2330, ease.inOut]])} cy={1000} z={1.0} bia={{expr: 'worried', lookX: -0.8, mouthOff: true}} davi={{lookX: 0.5, mouthOff: true}} />);
  }
  if (t < 6.4) return bg(<Corr T={T} cx={AP.davi.x + 40} cy={kf(t, [[3.2, 860], [6.4, 820]])} z={2.0} davi={{expr: 'worried', lookX: T < 12.6 ? -0.6 : 0.7, lookY: T < 12.6 ? -1 : 0}} />);
  if (t < 8.4) return bg(<Corr T={T} cx={AP.bia.x - 100} cy={830} z={2.2} bia={{expr: 'worried', lookX: -1}} />);
  if (t < 10.6) return <DoorFixed T={T} knock={(T > 16.6 && T < 16.9) || (T > 17.2 && T < 17.5) || (T > 17.8 && T < 18.1) ? 1 : 0} biaExpr={T > 16.7 ? 'surprised' : 'worried'} />;
  return <DoorFixed T={T} biaExpr="surprised" biaLookX={-0.9} />;
};

/* ───────── CENA 3 — A MULHER DO APARTAMENTO (22–39,4s) ───────── */
export const S3: React.FC = () => {
  const t = useT(); const T = 22 + t;
  if (t < 4.8) return bg(<Corr T={T} cx={AP.bia.x - 140} cy={830} z={2.1} bia={{expr: 'worried', lookX: -1}} />);
  if (t < 6.8) {
    // Davi observa o leitor ao lado da porta (luz vermelha)
    return bg(<Corr T={T} cx={AP.reader.x + 60} cy={940} z={1.35} davi={{expr: 'determined', lookX: 0.6, lookY: -0.1}} bia={{expr: 'worried', lookX: -1, mouthOff: true}} />);
  }
  if (t < 8.6) return bg(<Corr T={T} cx={AP.bia.x - 100} cy={830} z={2.3} bia={{expr: 'suspicious', lookX: -1}} />);
  if (t < 11.8) return <DoorFixed T={T} biaExpr="worried" />;
  return bg(<Corr T={T} cx={AP.bia.x - 150} cy={kf(t, [[11.8, 830], [17.4, 800]])} z={kf(t, [[11.8, 2.2], [17.4, 2.45]])} bia={{x: AP.bia.x - 30, expr: T > 35.6 ? 'fear' : 'surprised', lookX: -1}} />);
};

/* ───────── CENA 4 — O UNIFORME (39,4–51s) ───────── */
const FakeMemory: React.FC<{T: number}> = ({T}) => (
  <CCTV t={T} label="CÂMERA 06 — GRAVAÇÃO" clock={23 * 3600 + 41 * 60 + 9} tint="#4a7dff" glitch={0.2}>
    <svg viewBox="80 300 900 1600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
      <Hall6 open={0}><Davi t={T} x={860} y={H6.floorY + 2} pose={{...REST, lSh: 0, lEl: 0, lT: {x: 92, y: -700}, lHand: 'grip'}} phone="L" expr="neutral" lookX={-0.4} /></Hall6>
    </svg>
  </CCTV>
);
export const S4: React.FC = () => {
  const t = useT(); const T = 39.4 + t;
  if (t < 1.2) return bg(<Corr T={T} cx={AP.bia.x - 120} cy={830} z={2.3} bia={{x: AP.bia.x - 30, expr: 'suspicious', lookX: -1}} />);
  if (t < 4.0) {
    // plano curto do uniforme: azul, crachá com o símbolo da manutenção
    return bg(<Corr T={T} cx={AP.davi.x + 30} cy={kf(t, [[1.2, 960], [4, 940]])} z={3.6} davi={{expr: 'worried', lookY: 0.9, mouthOff: true}} />);
  }
  if (t < 7.2) return bg(<Corr T={T} cx={AP.davi.x + 40} cy={820} z={2.1} davi={{expr: 'surprised', lookX: 0.8, lookY: T < 43.9 ? 0.9 : 0}} />);
  // ela não responde: lembra da gravação falsificada
  const mem = tw(T, 48.2, 48.5, 0, 1) * tw(T, 49.8, 50.2, 1, 0);
  return bg(<Corr T={T} cx={AP.bia.x - 120} cy={830} z={kf(t, [[7.2, 2.4], [11.6, 2.6]])} bia={{x: AP.bia.x - 30, expr: 'suspicious', lookX: -0.8, mouthOff: true}} />,
    mem > 0 ? <div style={{position: 'absolute', left: 140, top: 240, width: 800, height: 1100, opacity: mem * 0.85, borderRadius: 20, overflow: 'hidden', border: `4px solid ${C.blue}`}}><FakeMemory T={T} /></div> : null);
};

/* ───────── CENA 5 — A MENSAGEM DO HACKER (51–65s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 51 + t;
  if (t < 4.2) return <PhoneShot T={T} vib={t < 0.6} glow={C.red}><Msg t={t - 0.3} lines={['VOCÊ ENCONTROU A OUTRA PARTICIPANTE.', 'MAS NÃO PODE SALVAR TODO MUNDO.']} /></PhoneShot>;
  if (t < 6.4) return bg(<Corr T={T} cx={AP.bia.x - 120} cy={830} z={2.4} bia={{x: AP.bia.x - 30, expr: 'fear', lookY: 0.6, phoneLit: true}} />);
  if (t < 8.2) return bg(<Corr T={T} cx={AP.davi.x} cy={kf(t, [[6.4, 820], [8.2, 720]])} z={2.0} davi={{expr: 'determined', lookX: -0.6, lookY: -1}} />);
  if (t < 9.3) return bg(<SvgCamera cx={540} cy={760} zoom={1.1}><CameraClose rot={0} led={0.5 + 0.5 * Math.sin(T * 2.4)} /></SvgCamera>);
  return <DoorFixed T={T} knock={(T > 62.4 && T < 62.6) || (T > 62.62 && T < 62.82) || (T > 62.84 && T < 63.04) ? 1 : 0} biaExpr="fear" />;
};

/* ───────── CENA 6 — A AMEAÇA (65–76,8s) ───────── */
export const S6: React.FC = () => {
  const t = useT(); const T = 65 + t;
  if (t < 2.4) return <PhoneShot T={T} vib={t < 0.6} glow={C.red}><Msg t={t - 0.2} lines={['SE ABRIR ESSA PORTA, OUTRA SERÁ TRANCADA.']} glitch T={T} /></PhoneShot>;
  if (t < 5.0) return bg(<Corr T={T} cx={2320} cy={1000} z={0.95} bia={{x: AP.bia.x - 30, expr: 'fear', lookX: -0.8}} davi={{expr: 'worried', lookX: 0.8, mouthOff: true}} />);
  if (t < 8.0) return bg(<Corr T={T} cx={AP.davi.x + 40} cy={820} z={2.1} davi={{expr: 'worried', lookX: T < 70.6 ? 1 : 0.7, lookY: T < 70.6 ? 0.1 : 0}} />);
  if (t < 9.2) return <DoorFixed T={T} biaExpr="fear" />;
  // a mão hesita perto da maçaneta… corte seco antes de tocar
  return bg(<SvgCamera cx={540} cy={1060} zoom={kf(t, [[9.2, 1.0], [11.8, 1.12]])}><HandleClose reach={tw(T, 74.3, 75.4, 0, 0.8, ease.out)} t={T} /></SvgCamera>);
};

/* ───────── CENA 7 — VOTAÇÃO (76,8–87s) ───────── */
export const S7: React.FC = () => {
  const t = useT(); const T = 76.8 + t;
  if (t < 0.4) return <AbsoluteFill style={{background: '#000'}} />;
  const show = tw(t, 0.4, 0.9, 0, 1, ease.out);
  const glow = 0.5 + 0.5 * Math.sin(T * 3);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox={`${D604.x - 110} 300 540 1920`} width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><AptCorridor t={T} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox="0 0 1080 1920" width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><CameraClose rot={0} led={0.5 + 0.5 * Math.sin(T * 2.4)} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
      </div>
      <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: show}} />
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: show}}>
        <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: '3px solid #fff', borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: '#fff', fontSize: 44, letterSpacing: 2}}>VOCÊ DECIDE O DESTINO DE BIA</span>
      </div>
      <div style={{filter: `drop-shadow(0 0 ${8 + glow * 14}px ${C.blue})`}}><VoteCard letter="A" text="TENTAR SALVAR CLARA" color={C.blue} x={30} y={780} w={490} k={show} active={0} /></div>
      <div style={{filter: `drop-shadow(0 0 ${8 + (1 - glow) * 14}px ${C.red})`}}><VoteCard letter="B" text="IR À SALA DE SEGURANÇA" color={C.red} x={560} y={780} w={490} k={show} active={0} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', opacity: tw(T, 81.4, 81.8, 0, 1)}}>
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

export {ReaderClose};
