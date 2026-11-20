import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptCorridor, HandleClose, ReaderOpen, AP} from '../../sets/Hall6';
import {Backpack} from '../../sets/ElevatorSets';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Clara} from '../../characters/Clara';
import {Phone, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 6 — "A PORTA QUE NÃO DEVERIA ABRIR" (após EP. 5; venceu A: tentar salvar Clara). Máx. 90 s.
 * Corredor dos apartamentos do 6º: Davi (1960) à esquerda do 604, Bia (2660) à direita, Clara na porta (2360).
 * A porta 601 fica no fim do corredor (esquerda); a ÁREA TÉCNICA no outro extremo (direita).
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const DAVI_BAG: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
const TOOL = <g transform="rotate(-20)"><rect x={-6} y={-90} width={12} height={70} rx={4} fill="#c3cad8" /><rect x={-14} y={-30} width={28} height={50} rx={10} fill="#d8b44a" /></g>;
const D604 = AP.door(604), D601 = AP.door(601);

type P = {x?: number; pose?: Pose; expr?: any; lookX?: number; lookY?: number; mouthOff?: boolean; phoneLit?: boolean; holdL?: React.ReactNode};
const Corr: React.FC<{T: number; cx: number; cy: number; z: number; davi?: P; bia?: P; clara?: P; open?: number; knock601?: number}> = ({T, cx, cy, z, davi, bia, clara, open = 1, knock601 = 0}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <AptCorridor t={T} open604={open} knock601={knock601} camRot={0}
      inDoor={clara && open > 0.3 ? <Clara t={T} x={clara.x ?? AP.clara.x} y={AP.floorY + 2} pose={clara.pose ?? REST} expr={clara.expr ?? 'worried'} lookX={clara.lookX ?? 0} lookY={clara.lookY ?? 0} mouth={clara.mouthOff ? 0 : mouthOf('CLARA_LIVRE', T, 1.2)} /> : undefined}>
      {davi && <Davi t={T} x={davi.x ?? AP.davi.x} y={AP.floorY + 2} pose={davi.pose ?? DAVI_BAG} holdR={BAG} holdL={davi.holdL} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? 0.7} lookY={davi.lookY ?? 0} mouth={davi.mouthOff ? 0 : mouthOf('DAVI', T, 1.2)} />}
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
const Msg: React.FC<{t: number; lines: string[]; gap?: number; glitch?: boolean; T?: number; colors?: string[]}> = ({t, lines, gap = 1.5, glitch, T = 0, colors}) => (
  <div style={{position: 'absolute', inset: 0, background: '#07080d', paddingTop: 440, boxSizing: 'border-box', textAlign: 'center'}}>
    {lines.map((l, i) => (
      <div key={l} style={{margin: '40px 50px 0', background: `${colors?.[i] ?? C.red}1f`, border: `4px solid ${colors?.[i] ?? C.red}`, borderRadius: 30, padding: '36px 28px', fontFamily: FONT.title, fontSize: 62, color: '#fff', lineHeight: 1.12, opacity: clamp((t - i * gap) * 5),
        transform: glitch && i === 1 && Math.floor(T * 12) % 8 === 0 ? 'translateX(10px)' : 'none'}}>{l}</div>
    ))}
    {glitch && <Glitch amount={Math.floor(T * 12) % 8 === 0 && t > gap ? 0.35 : 0} seed={67} />}
  </div>
);
/** plano a três (Davi | Clara na porta | Bia) */
const Three = (T: number, o: {davi?: P; bia?: P; clara?: P; z?: number; cx?: number; cy?: number} = {}) =>
  bg(<Corr T={T} cx={o.cx ?? 2310} cy={o.cy ?? 1000} z={o.z ?? 1.0} davi={o.davi ?? {}} bia={o.bia ?? {}} clara={o.clara ?? {}} />);

/* ───────── CENA 1 — A ESCOLHA (0–8s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  if (t < 2.6) return <PhoneShot T={T} glow={C.red}><Msg t={9} lines={['SE ABRIR ESSA PORTA, OUTRA SERÁ TRANCADA.']} /></PhoneShot>;
  return bg(<Corr T={T} cx={2310} cy={kf(t, [[2.6, 1000], [8, 980]])} z={kf(t, [[2.6, 1.0], [8, 1.06]])} open={0}
    davi={{lookX: T > 6.9 ? 0.6 : 0.7, expr: 'worried'}} bia={{expr: T > 5.2 ? 'determined' : 'worried', lookX: -0.8}} />);
};

/* ───────── CENA 2 — A ABERTURA (8–24,4s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 8 + t;
  const withTool: Pose = {...DAVI_BAG, lSh: 0, lEl: 0, lT: {x: 130, y: -560}, lFs: 0.8, lHand: 'grip'};
  if (t < 4.6) {
    // Davi tira uma ferramenta da mochila e fala junto ao leitor
    const k = tw(T, 8.4, 9.0, 0, 1, ease.inOut);
    return bg(<Corr T={T} cx={AP.davi.x + 120} cy={kf(t, [[0, 900], [4.6, 870]])} z={1.8} open={0} davi={{pose: mixPose(DAVI_BAG, withTool, k), holdL: k > 0.5 ? TOOL : undefined, expr: 'determined', lookX: 0.7, lookY: k > 0.5 ? 0.2 : 0.4}} />);
  }
  if (t < 6.4) return bg(<Corr T={T} cx={AP.bia.x - 120} cy={780} z={2.2} open={0} bia={{expr: 'worried', lookX: -0.7, lookY: -0.8}} />);
  if (t < 9.2) return bg(<SvgCamera cx={540} cy={860} zoom={1.0}><ReaderOpen k={tw(T, 14.8, 15.8, 0, 1, ease.inOut)} off={T > 16.4} t={T} /></SvgCamera>);
  if (t < 11.2) return bg(<Corr T={T} cx={AP.davi.x + 120} cy={870} z={1.9} open={0} davi={{pose: withTool, holdL: TOOL, expr: T > 17.8 ? 'neutral' : 'determined', lookX: 0.7}} />);
  if (t < 12.8) return bg(<SvgCamera cx={540} cy={1060} zoom={1.0}><HandleClose reach={tw(T, 19.2, 20.2, 0.3, 1, ease.out)} t={0} /></SvgCamera>);
  // Bia gira a maçaneta e abre: a porta se abre para dentro e Clara aparece
  const open = tw(T, 21.0, 22.4, 0, 1, ease.inOut);
  return bg(<Corr T={T} cx={D604.x + 160} cy={kf(t, [[12.8, 1000], [16.4, 960]])} z={kf(t, [[12.8, 1.2], [16.4, 1.35]])} open={open}
    davi={{pose: withTool, holdL: TOOL, expr: 'surprised', lookX: 0.8}} bia={{expr: 'surprised', lookX: -0.9}} clara={{expr: 'fear', lookX: 0.4, mouthOff: true}} />);
};

/* ───────── CENA 3 — CLARA (24,4–39s) ───────── */
export const S3: React.FC = () => {
  const t = useT(); const T = 24.4 + t;
  const claraClose = (expr: any, lookX = 0.5, cy = 820) => bg(<Corr T={T} cx={AP.clara.x} cy={cy} z={2.3} clara={{expr, lookX}} />);
  if (t < 2.4) return claraClose('surprised', 0.6);
  if (t < 3.8) return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.3} bia={{expr: 'worried', lookX: -0.9}} clara={{mouthOff: true, lookX: 0.6}} />);
  if (t < 7.2) return claraClose('worried', 0.5);
  if (t < 8.8) return bg(<Corr T={T} cx={AP.davi.x + 100} cy={820} z={2.2} davi={{expr: 'surprised', lookX: 0.8}} />);
  if (t < 12.0) return claraClose('fear', -0.3, 830);
  // Bia e Davi trocam olhares
  return Three(T, {davi: {expr: 'worried', lookX: 0.9, mouthOff: true}, bia: {expr: 'suspicious', lookX: -0.9, mouthOff: true}, clara: {expr: 'worried', lookX: 0, mouthOff: true}, z: kf(t, [[12, 1.0], [14.6, 1.08]])});
};

/* ───────── CENA 4 — A CONSEQUÊNCIA (39–53s) ───────── */
export const S4: React.FC = () => {
  const t = useT(); const T = 39 + t;
  if (t < 1.0) return Three(T, {davi: {lookX: -0.9, expr: 'surprised', mouthOff: true}, bia: {lookX: -0.9, expr: 'surprised', mouthOff: true}, clara: {lookX: -0.8, expr: 'fear', mouthOff: true}});
  if (t < 4.4) return <PhoneShot T={T} vib={t < 1.6}><Msg t={t - 1.2} lines={['PORTA 604: LIBERADA', 'PORTA 601: BLOQUEADA']} colors={[C.green, C.red]} gap={1.4} /></PhoneShot>;
  if (t < 6.4) return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.3} bia={{expr: 'fear', lookX: -0.5, lookY: 0.3, phoneLit: true}} clara={{mouthOff: true}} />);
  if (t < 8.6) return bg(<Corr T={T} cx={AP.davi.x + 60} cy={820} z={2.2} davi={{expr: 'worried', lookX: -0.9}} />);
  if (t < 10.6) return bg(<Corr T={T} cx={AP.clara.x} cy={820} z={2.3} clara={{expr: 'fear', lookX: -0.6}} />);
  // ninguém responde: o corredor vazio, com a porta 601 ao fundo
  return bg(<Corr T={T} cx={kf(t, [[10.6, 620], [14, 470]])} cy={1000} z={kf(t, [[10.6, 0.95], [14, 1.08]])} />);
};

/* ───────── CENA 5 — A DESCOBERTA (53–66,9s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 53 + t;
  const hold: Pose = {...REST, lSh: 0, lEl: 0, lT: {x: 230, y: -420}, lFs: 0.95, lHand: 'grip'};
  if (t < 3.4) {
    // Clara segura discretamente o braço da Bia
    const k = tw(T, 53.1, 53.6, 0, 1, ease.inOut);
    return bg(<Corr T={T} cx={2510} cy={880} z={1.6} clara={{pose: mixPose(REST, hold, k), expr: 'fear', lookX: 0.8}} bia={{expr: 'surprised', lookX: -0.9, mouthOff: true}} />);
  }
  if (t < 4.5) return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.3} bia={{expr: 'worried', lookX: -0.9}} clara={{pose: hold, mouthOff: true}} />);
  if (t < 7.5) return bg(<Corr T={T} cx={AP.clara.x} cy={820} z={2.3} clara={{pose: hold, expr: 'fear', lookX: 0.6}} />);
  if (t < 9.1) return bg(<Corr T={T} cx={AP.davi.x + 60} cy={820} z={2.2} davi={{expr: 'suspicious', lookX: 0.9}} />);
  if (t < 11.4) {
    const nod = T > 62.3 && T < 62.9 ? Math.max(0, Math.sin((T - 62.3) * Math.PI * 2 / 0.6)) * 0.7 : 0;
    return bg(<Corr T={T} cx={AP.clara.x} cy={820} z={2.3} clara={{pose: hold, expr: 'worried', lookX: -0.3, lookY: nod}} />);
  }
  return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.4} bia={{expr: 'suspicious', lookY: 0.6, phoneLit: true}} clara={{pose: hold, mouthOff: true}} />);
};

/* ───────── CENA 6 — A NOVA ARMADILHA (66,9–76,8s) ───────── */
export const S6: React.FC = () => {
  const t = useT(); const T = 66.9 + t;
  if (t < 3.3) return <PhoneShot T={T} vib={t < 0.6} glow={C.red}><Msg t={t - 0.1} lines={['VOCÊ SALVOU UMA PARTICIPANTE.', 'MAS ACABOU DE CRIAR OUTRA PRISIONEIRA.']} gap={1.6} glitch T={T} /></PhoneShot>;
  if (t < 4.1) return bg(<Corr T={T} cx={D601.x + 300} cy={1000} z={1.15} knock601={T > 70.4 && T < 70.8 ? 1 : 0} />);
  if (t < 5.9) return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.3} bia={{expr: 'shock', lookX: -1}} clara={{mouthOff: true}} />);
  if (t < 8.3) {
    // Davi se prepara para ir ao 601; Clara aponta para a passagem da área técnica (direita)
    const point: Pose = {...REST, lSh: 0, lEl: 0, lT: {x: 230, y: -640}, lFs: 0.95, lHand: 'point', lHandRot: -90};
    return Three(T, {davi: {x: AP.davi.x - 50, expr: 'determined', lookX: -1, mouthOff: true}, bia: {expr: 'fear', lookX: -0.9, mouthOff: true},
      clara: {pose: mixPose(REST, point, tw(T, 73.0, 73.4, 0, 1, ease.out)), expr: 'fear', lookX: 0.9}});
  }
  // Bia olha para o 601… e para a passagem
  return bg(<Corr T={T} cx={AP.bia.x - 60} cy={800} z={2.5} bia={{expr: 'fear', lookX: T < 75.9 ? -1 : 1, mouthOff: true}} clara={{mouthOff: true}} />);
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
        <svg viewBox={`${D601.x - 110} 300 540 1920`} width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><AptCorridor t={T} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: show}}>
        <svg viewBox={`${AP.passage.x - 270} 300 540 1920`} width={540} height={1920} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute'}}><AptCorridor t={T} /></svg>
        <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
      </div>
      <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: show}} />
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: show}}>
        <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: '3px solid #fff', borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: '#fff', fontSize: 44, letterSpacing: 2}}>VOCÊ DECIDE O DESTINO DE BIA</span>
      </div>
      <div style={{filter: `drop-shadow(0 0 ${8 + glow * 14}px ${C.blue})`}}><VoteCard letter="A" text="AJUDAR NO 601" color={C.blue} x={30} y={780} w={490} k={show} active={0} /></div>
      <div style={{filter: `drop-shadow(0 0 ${8 + (1 - glow) * 14}px ${C.red})`}}><VoteCard letter="B" text="INVESTIGAR A SEGURANÇA" color={C.red} x={560} y={780} w={490} k={show} active={0} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', opacity: tw(T, 82.2, 82.6, 0, 1)}}>
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
