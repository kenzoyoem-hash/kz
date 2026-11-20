import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptCorridor, AP} from '../../sets/Hall6';
import {TechHallDoor, SecurityRoom, SecurityReverse, KeyboardClose, FEEDS} from '../../sets/SecurityRoom';
import {Backpack} from '../../sets/ElevatorSets';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Clara} from '../../characters/Clara';
import {VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 7 — "VOCÊ NUNCA ESTEVE NO CONTROLE" (após EP. 6; venceu B: investigar a segurança). Máx. 90 s.
 * NÃO revelar a origem das escolhas, os espectadores nem o despertador (reservado ao EP. 8).
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const DAVI_BAG: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
const bg = (el: React.ReactNode, extra?: React.ReactNode) => <AbsoluteFill style={{background: C.bg}}>{el}<Vignette strength={VIG} />{extra}</AbsoluteFill>;

/* ── personagens: posições fixas ── */
type P = {pose?: Pose; expr?: any; lookX?: number; lookY?: number; mouthOff?: boolean; x?: number};
const mB = (T: number, p: P) => (p.mouthOff ? 0 : mouthOf('BIA', T, 1.2));
const mD = (T: number, p: P) => (p.mouthOff ? 0 : mouthOf('DAVI', T, 1.2));
const mC = (T: number, p: P) => (p.mouthOff ? 0 : mouthOf('CLARA_LIVRE', T, 1.2));

/** contraplano na sala (de frente): Davi | Bia | Clara */
const Reverse: React.FC<{T: number; cx: number; cy: number; z: number; davi?: P; bia?: P; clara?: P; camRot?: number}> = ({T, cx, cy, z, davi, bia, clara, camRot}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <SecurityReverse t={T} camRot={camRot}>
      {davi && <Davi t={T} x={davi.x ?? 250} y={1800} pose={davi.pose ?? DAVI_BAG} holdR={BAG} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? 0.3} lookY={davi.lookY ?? 0} mouth={mD(T, davi)} />}
      {clara && <Clara t={T} x={clara.x ?? 830} y={1800} pose={clara.pose ?? REST} expr={clara.expr ?? 'worried'} lookX={clara.lookX ?? -0.3} lookY={clara.lookY ?? 0} mouth={mC(T, clara)} />}
      {bia && <Bia t={T} x={bia.x ?? 540} y={1830} scale={1.02} pose={bia.pose ?? POSES.phoneL} phone="L" expr={bia.expr ?? 'worried'} lookX={bia.lookX ?? 0} lookY={bia.lookY ?? 0} mouth={mB(T, bia)} />}
    </SecurityReverse>
  </SvgCamera>
);
const closeOn = {davi: {cx: 270, cy: 1080}, bia: {cx: 540, cy: 1100}, clara: {cx: 820, cy: 1080}};

/** monitor principal em tela cheia (texto sempre legível) */
const Screen: React.FC<{children: React.ReactNode; title?: string; red?: boolean}> = ({children, title = 'SISTEMA PREDIAL · SEGURANÇA', red}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <div style={{position: 'absolute', left: 50, right: 50, top: 300, height: 1180, background: '#05070c', borderRadius: 26, border: '14px solid #1c2130', boxShadow: `0 0 80px ${red ? C.red : C.blue}44`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, background: red ? '#3a0a10' : '#121a30', borderRadius: '12px 12px 0 0', fontFamily: FONT.mono, color: red ? '#ffb3ba' : '#9fb6e0', fontSize: 28, lineHeight: '70px', paddingLeft: 30}}>● {title}</div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 110, bottom: 40}}>{children}</div>
    </div>
  </AbsoluteFill>
);
const Row: React.FC<{text: string; k: number; color?: string; hi?: number}> = ({text, k, color = '#e8eefc', hi = 0}) => (
  <div style={{fontFamily: FONT.mono, fontSize: 52, color, opacity: clamp(k * 4), padding: '18px 20px', marginBottom: 22, lineHeight: 1.15, borderRadius: 10,
    background: hi > 0 ? `rgba(255,45,61,${0.25 * hi})` : 'rgba(255,255,255,0.04)', border: hi > 0 ? `3px solid rgba(255,45,61,${hi})` : '3px solid transparent'}}>{text}</div>
);

/* ───────── CENA 1 — A ESCOLHA (0–8s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  if (t < 5.2) {
    return bg(<SvgCamera cx={2320} cy={kf(t, [[0, 1000], [5.2, 985]])} zoom={kf(t, [[0, 0.95], [5.2, 1.0]])}>
      <AptCorridor t={T} open604={1}>
        <Davi t={T} x={AP.davi.x} y={AP.floorY + 2} pose={DAVI_BAG} holdR={BAG} expr="worried" lookX={0.7} mouth={0} />
        <Clara t={T} x={AP.clara.x + 40} y={AP.floorY + 30} expr="worried" lookX={0.7} mouth={0} />
        <Bia t={T} x={AP.bia.x} y={AP.floorY + 2} pose={POSES.phoneL} phone="L" expr="worried" lookX={T > 3.9 ? -1 : 0.6} mouth={0} />
      </AptCorridor>
    </SvgCamera>);
  }
  if (t < 6.0) return bg(<SvgCamera cx={AP.door(601).x + 300} cy={1000} zoom={1.15}><AptCorridor t={T} open604={1} knock601={T > 5.4 && T < 5.8 ? 1 : 0} /></SvgCamera>);
  return bg(<SvgCamera cx={AP.bia.x - 60} cy={800} zoom={2.3}>
    <AptCorridor t={T} open604={1}><Bia t={T} x={AP.bia.x} y={AP.floorY + 2} pose={POSES.phoneL} phone="L" expr="determined" lookX={-0.6} mouth={mouthOf('BIA', T, 1.2)} /></AptCorridor>
  </SvgCamera>);
};

/* ───────── CENA 2 — A SALA DE SEGURANÇA (8–23s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 8 + t;
  const hall = (open: number, cx: number, cy: number, z: number, who: {d?: P; b?: P; c?: P}) => bg(
    <SvgCamera cx={cx} cy={cy} zoom={z}>
      <TechHallDoor open={open}>
        {who.c && <Clara t={T} x={900} y={1880} scale={1.0} expr={who.c.expr ?? 'worried'} lookX={who.c.lookX ?? -0.5} mouth={mC(T, who.c)} />}
        {who.d && <Davi t={T} x={who.d.x ?? 300} y={1880} pose={who.d.pose ?? DAVI_BAG} holdR={BAG} expr={who.d.expr ?? 'suspicious'} lookX={who.d.lookX ?? 0.5} mouth={mD(T, who.d)} />}
        {who.b && <Bia t={T} x={640} y={1900} pose={POSES.phoneL} phone="L" expr={who.b.expr ?? 'worried'} lookX={who.b.lookX ?? -0.5} mouth={mB(T, who.b)} />}
      </TechHallDoor>
    </SvgCamera>);
  if (t < 2.3) return hall(0.15, 560, 1100, kf(t, [[0, 0.95], [2.3, 1.02]]), {d: {mouthOff: true}, b: {mouthOff: true}, c: {mouthOff: true}});
  if (t < 4.5) return hall(0.15, 300, 1050, 2.0, {d: {expr: 'suspicious', lookX: 0.6}});
  if (t < 6.4) return hall(0.15, 640, 1070, 2.0, {b: {expr: 'suspicious', lookX: -0.7}});
  if (t < 9.6) {
    // Davi empurra a porta com cuidado: a sala está vazia, os monitores ligados
    const push: Pose = {...DAVI_BAG, lSh: 0, lEl: 0, lT: {x: 160, y: -620}, lFs: 0.9, lHand: 'open', lHandRot: -120};
    return hall(tw(T, 14.6, 16.0, 0.15, 0.95, ease.inOut), 520, 1100, 1.1, {d: {x: 340, pose: mixPose(DAVI_BAG, push, tw(T, 14.3, 14.6, 0, 1)), expr: 'suspicious', lookX: 0.8, mouthOff: true}, b: {mouthOff: true, lookX: 0}, c: {mouthOff: true}});
  }
  // dentro da sala (de costas): a câmera revela o interior devagar
  return bg(<SvgCamera cx={kf(t, [[9.6, 380], [15, 600]])} cy={kf(t, [[9.6, 760], [15, 900]])} zoom={kf(t, [[9.6, 1.5], [15, 1.05]])}>
    <SecurityRoom t={T}>
      <Davi t={T} x={240} y={1900} facing="back" pose={DAVI_BAG} holdR={BAG} />
      <Clara t={T} x={860} y={1900} facing="back" />
      <Bia t={T} x={560} y={1920} facing="back" />
    </SecurityRoom>
  </SvgCamera>);
};

/* ───────── CENA 3 — AS GRAVAÇÕES (23–39s) ───────── */
const LOGS = ['ELEVADOR — ROTA ATIVADA', 'CÂMERA 06 — VÍDEO SUBSTITUÍDO', 'PORTA 604 — LIBERADA', 'PORTA 601 — BLOQUEADA'];
export const S3: React.FC = () => {
  const t = useT(); const T = 23 + t;
  if (t < 3.8) {
    // close nos monitores: elevador, corredor do 6º, porta 604
    const f = (x: number, y: number, k: keyof typeof FEEDS) => (
      <div style={{position: 'absolute', left: x, top: y, width: 900, height: 420, borderRadius: 16, overflow: 'hidden', border: '10px solid #0b0d12'}}>
        <svg viewBox={FEEDS[k].vb} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}>{FEEDS[k].view}</svg>
        <div style={{position: 'absolute', inset: 0, background: '#3d6bff', opacity: 0.22}} />
        <div style={{position: 'absolute', left: 16, top: 10, fontFamily: FONT.mono, fontSize: 36, color: '#e8eefc', textShadow: '0 2px 4px #000'}}>{FEEDS[k].label}</div>
        <div style={{position: 'absolute', right: 16, top: 10, fontFamily: FONT.mono, fontSize: 32, color: C.red}}>● REC</div>
      </div>
    );
    return <AbsoluteFill style={{background: '#0b0f18', transform: `scale(${kf(t, [[0, 1.0], [3.8, 1.04]])})`}}>{f(90, 180, 'elev')}{f(90, 640, 'hall')}{f(90, 1100, 'door604')}</AbsoluteFill>;
  }
  if (t < 5.4) {
    // Davi se aproxima do computador principal
    return bg(<SvgCamera cx={540} cy={kf(t, [[3.8, 1000], [5.4, 1080]])} zoom={kf(t, [[3.8, 1.2], [5.4, 1.5]])}>
      <SecurityRoom t={T}><Davi t={T} x={360} y={1900} facing="back" pose={DAVI_BAG} holdR={BAG} /><Bia t={T} x={700} y={1940} facing="back" /></SecurityRoom>
    </SvgCamera>);
  }
  if (t < 8.6) return <Screen>{LOGS.map((l, i) => <Row key={l} text={l} k={t - 5.6 - i * 0.45} />)}</Screen>;
  if (t < 11.4) return bg(<Reverse T={T} {...closeOn.davi} z={2.3} davi={{expr: 'worried', lookX: 0.2}} />);
  if (t < 13.6) return bg(<Reverse T={T} {...closeOn.bia} z={2.3} bia={{expr: 'determined', lookX: 0}} />);
  return <Screen>{LOGS.map((l, i) => <Row key={l} text={l} k={9} hi={i === 1 ? tw(T, 36.8, 37.2, 0, 1) : 0} color={i === 1 ? '#ffd2d6' : '#e8eefc'} />)}</Screen>;
};

/* ───────── CENA 4 — AS ESCOLHAS (39–53s) ───────── */
const DECISOES = ['DECISÃO 01 — ELEVADOR', 'DECISÃO 02 — CONFIAR EM DAVI', 'DECISÃO 03 — INVESTIGAR 604', 'DECISÃO 04 — SALVAR CLARA', 'DECISÃO 05 — INVESTIGAR SEGURANÇA'];
export const S4: React.FC = () => {
  const t = useT(); const T = 39 + t;
  if (t < 2.0) {
    const point: Pose = {...REST, rSh: 0, rEl: 0, rT: {x: -200, y: -600}, rFs: 0.9, rHand: 'point', rHandRot: 100};
    return bg(<Reverse T={T} {...closeOn.clara} z={2.1} clara={{pose: mixPose(REST, point, tw(T, 39.2, 39.6, 0, 1)), expr: 'surprised', lookX: -0.4, lookY: 0.4}} />);
  }
  if (t < 6.8) return <Screen title="HISTÓRICO DE DECISÕES">{DECISOES.map((d, i) => <Row key={d} text={d} k={t - 2.2 - i * 0.55} />)}</Screen>;
  if (t < 9.2) return bg(<Reverse T={T} {...closeOn.bia} z={2.3} bia={{expr: 'confused', lookX: 0, lookY: 0.3}} />);
  if (t < 11.6) return bg(<Reverse T={T} {...closeOn.davi} z={2.3} davi={{expr: 'determined', lookX: 0.3}} />);
  // Bia encara a tela (de costas, aproximando)
  return bg(<SvgCamera cx={540} cy={kf(t, [[11.6, 1050], [14, 1120]])} zoom={kf(t, [[11.6, 1.4], [14, 2.0]])}>
    <SecurityRoom t={T}><Bia t={T} x={560} y={1940} facing="back" /></SecurityRoom>
  </SvgCamera>);
};

/* ───────── CENA 5 — CONTROLE EXTERNO (53–66,8s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 53 + t;
  if (t < 3.6) {
    return (
      <Screen red title="AVISO DO SISTEMA">
        <div style={{textAlign: 'center', marginTop: 200}}>
          <div style={{fontFamily: FONT.title, fontSize: 74, color: C.red, opacity: clamp((t - 0.2) * 5), textShadow: `0 0 30px ${C.red}88`}}>CONEXÃO EXTERNA ATIVA</div>
          <div style={{marginTop: 70, fontFamily: FONT.mono, fontSize: 52, color: '#fff', opacity: clamp((t - 1.6) * 5)}}>CONTROLE REMOTO<br />HABILITADO</div>
        </div>
      </Screen>
    );
  }
  if (t < 6.0) return bg(<Reverse T={T} {...closeOn.bia} z={2.3} bia={{expr: 'worried', lookX: -0.6}} />);
  if (t < 8.8) return bg(<Reverse T={T} {...closeOn.davi} z={2.3} davi={{expr: 'determined', lookX: 0.4}} />);
  if (t < 11.0) return bg(<Reverse T={T} {...closeOn.clara} z={2.2} clara={{expr: 'fear', lookX: 0.2, lookY: -0.1}} />);
  if (t < 12.0) {
    // a câmera do teto gira na direção dos três
    return bg(<Reverse T={T} cx={420} cy={900} z={0.95} camRot={tw(T, 64.0, 64.8, -20, 28, ease.inOut)} davi={{mouthOff: true, lookX: 0.2}} bia={{mouthOff: true, lookY: 0.2}} clara={{mouthOff: true, lookX: -0.2}} />);
  }
  return bg(<Reverse T={T} {...closeOn.bia} z={2.5} camRot={28} bia={{expr: 'fear', lookX: -0.8, lookY: -0.8}} />);
};

/* ───────── CENA 6 — A ÚLTIMA MENSAGEM (66,8–77s) ───────── */
export const S6: React.FC = () => {
  const t = useT(); const T = 66.8 + t;
  if (t < 3.6) {
    const second = T > 68.3;
    return (
      <Screen red title="MENSAGEM">
        <div style={{textAlign: 'center', marginTop: second ? 70 : 250}}>
          {!second && <div style={{fontFamily: FONT.title, fontSize: 70, color: '#fff', lineHeight: 1.15, opacity: clamp((t - 0.1) * 5)}}>VOCÊ CHEGOU LONGE DEMAIS, BIA.</div>}
          {second && (
            <>
              <div style={{fontFamily: FONT.title, fontSize: 62, color: '#fff', lineHeight: 1.15}}>AGORA VOCÊ PODE DESCOBRIR QUEM ESTÁ NO CONTROLE.</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 70, alignItems: 'center', opacity: clamp((T - 68.9) * 4)}}>
                <div style={{fontFamily: FONT.title, fontSize: 52, color: '#fff', background: '#16306a', border: `5px solid ${C.blue}`, borderRadius: 18, padding: '18px 40px', width: 720}}>ENCERRAR CONEXÃO</div>
                <div style={{fontFamily: FONT.title, fontSize: 52, color: '#fff', background: '#5a0f18', border: `5px solid ${C.red}`, borderRadius: 18, padding: '18px 40px', width: 720}}>IDENTIFICAR ORIGEM</div>
              </div>
            </>
          )}
          <Glitch amount={T > 68.2 && T < 68.45 ? 0.6 : 0} seed={68} />
        </div>
      </Screen>
    );
  }
  if (t < 6.6) return bg(<Reverse T={T} {...closeOn.davi} z={2.3} davi={{expr: 'determined', lookX: 0.4}} />);
  if (t < 9.0) return bg(<Reverse T={T} {...closeOn.clara} z={2.2} clara={{expr: 'worried', lookX: -0.4}} />);
  // a mão da Bia se aproxima do teclado… corte seco antes de escolher
  return bg(<SvgCamera cx={540} cy={1060} zoom={kf(t, [[9, 1.0], [10.2, 1.08]])}><KeyboardClose reach={tw(T, 75.9, 76.9, 0, 0.8, ease.out)} /></SvgCamera>);
};

/* ───────── CENA 7 — VOTAÇÃO FINAL (77–87s) ───────── */
export const S7: React.FC = () => {
  const t = useT(); const T = 77 + t;
  if (t < 0.4) return <AbsoluteFill style={{background: '#000'}} />;
  const show = tw(t, 0.4, 0.9, 0, 1, ease.out);
  const glow = 0.5 + 0.5 * Math.sin(T * 3);
  return (
    <AbsoluteFill style={{background: '#081024'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox="0 300 540 1920" width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><SecurityRoom t={T} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox="540 300 540 1920" width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><SecurityRoom t={T} mainGlow={C.red} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
      </div>
      <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: show}} />
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: show}}>
        <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: `3px solid ${C.yellow}`, borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: C.yellow, fontSize: 46, letterSpacing: 2}}>A ÚLTIMA ESCOLHA É SUA</span>
      </div>
      <div style={{filter: `drop-shadow(0 0 ${8 + glow * 14}px ${C.blue})`}}><VoteCard letter="A" text="DESLIGAR O SISTEMA" color={C.blue} x={30} y={780} w={490} k={show} active={0} /></div>
      <div style={{filter: `drop-shadow(0 0 ${8 + (1 - glow) * 14}px ${C.red})`}}><VoteCard letter="B" text="DESCOBRIR QUEM CONTROLA" color={C.red} x={560} y={780} w={490} k={show} active={0} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', opacity: tw(T, 82.9, 83.3, 0, 1)}}>
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
