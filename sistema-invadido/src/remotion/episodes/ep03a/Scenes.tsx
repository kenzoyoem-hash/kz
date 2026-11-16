import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CabInterior, DoorsInside, Backpack, EV} from '../../sets/ElevatorSets';
import {Hall6, ReaderClose, H6} from '../../sets/Hall6';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Hand} from '../../characters/Person';
import {Phone, CCTV, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 3A — "NÃO CONFIE EM MIM" (venceu A no EP. 2B: confiar na voz de fora).
 * Elevador parado no 6º → Davi abre a porta à força → corredor do 6º → porta de manutenção.
 * Sem caminhadas: deslocamentos por corte. Narrador só na abertura e na votação.
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const BADGE = (
  <g transform="translate(-6,-10) rotate(-10)">
    <rect x={-22} y={-60} width={44} height={60} rx={5} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={2} />
    <rect x={-18} y={-56} width={36} height={12} rx={2} fill="#2f6fd6" />
  </g>
);
const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);

/* ── cabine (mesma do EP. 2B), Bia na posição fixa ── */
const Cab: React.FC<{T: number; cx?: number; cy?: number; z?: number; expr?: any; lookX?: number; lookY?: number; pose?: Pose; back?: number; tremble?: number}> =
  ({T, cx = 540, cy = 1060, z = 1, expr = 'worried', lookX = 0, lookY = 0, pose = POSES.phoneBoth, back = 0, tremble = 0}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <CabInterior floor="6" light={0.85} bag={<Backpack x={EV.bag.x} y={EV.bag.y} />}>
      <Bia t={T} x={EV.bia.x} y={EV.bia.y - back * 34} scale={EV.bia.s * (1 - back * 0.04)} pose={pose} phone="both" expr={expr} lookX={lookX} lookY={lookY} tremble={tremble} mouth={mouthOf('BIA', T, 1.2)} />
    </CabInterior>
  </SvgCamera>
);

/* ── corredor do 6º: Davi junto ao elevador, Bia à direita ── */
type HallProps = {T: number; cx: number; cy: number; z: number; davi?: {x: number; pose?: Pose; expr?: any; lookX?: number; lookY?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; phone?: any; mouthOff?: boolean};
  bia?: {x: number; pose?: Pose; expr?: any; lookX?: number; lookY?: number; holdR?: React.ReactNode; phone?: any; phoneLit?: boolean}; reader?: 'idle' | 'denied'; open?: number};
const Hall: React.FC<HallProps> = ({T, cx, cy, z, davi, bia, reader = 'idle', open = 0.42}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <Hall6 open={open} readerState={reader}>
      {davi && <Davi t={T} x={davi.x} y={H6.floorY + 2} pose={davi.pose ?? REST} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? 0} lookY={davi.lookY ?? 0}
        holdR={davi.holdR} holdL={davi.holdL} phone={davi.phone ?? 'none'} mouth={davi.mouthOff ? 0 : mouthOf('DAVI', T, 1.2)} />}
      {bia && <Bia t={T} x={bia.x} y={H6.floorY + 2} pose={bia.pose ?? POSES.phoneL} phone={bia.phone ?? 'L'} phoneLit={bia.phoneLit} expr={bia.expr ?? 'worried'} lookX={bia.lookX ?? 0} lookY={bia.lookY ?? 0} holdR={bia.holdR} mouth={mouthOf('BIA', T, 1.2)} />}
    </Hall6>
  </SvgCamera>
);
const bg = (el: React.ReactNode) => <AbsoluteFill style={{background: C.bg}}>{el}<Vignette strength={VIG} /></AbsoluteFill>;

/* ───────── CENA 1 — A DECISÃO (0–16s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  if (t < 7.4) return bg(<Cab T={T} cx={EV.bia.x} cy={kf(t, [[0, 1000], [7.4, 960]])} z={kf(t, [[0, 1.55], [7.4, 1.68]])} lookX={T > 6.8 ? 0 : -0.3} lookY={T > 6.8 ? -0.05 : 0.5} />);
  if (t < 10.4) return bg(<Cab T={T} cx={EV.bia.x} cy={830} z={2.6} expr="worried" lookY={-0.05} />);
  if (t < 13.6) return bg(<SvgCamera cx={540} cy={1000} zoom={kf(t, [[10.4, 1.0], [13.6, 1.05]])}><DoorsInside t={T} feet={1} /></SvgCamera>);
  // recua dois passos (corte): encostada no fundo, olhos fixos na porta — medo e um fio de esperança
  return bg(<Cab T={T} z={1.05} expr="worried" back={1} lookY={-0.05} />);
};

/* ───────── CENA 2 — A PORTA SE ABRE (16–31s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 16 + t;
  const open = T < 16.8 ? 0.006 : T < 17.4 ? tw(T, 16.8, 17.4, 0.006, 0.18, ease.out) : tw(T, 17.8, 18.8, 0.18, 0.42, ease.out);
  const gapHands = (o: number): Pose => ({...REST, rT: {x: -(370 * o + 10) / 1.2, y: (1000 - 1580) / 1.2}, lT: {x: (370 * o + 10) / 1.2, y: (1000 - 1580) / 1.2}, rHand: 'grip', lHand: 'grip'});
  const outsideDavi = (pose: Pose, expr: any, mouthMin = 0) => (
    <Davi t={T} x={540} y={1580} scale={1.2} pose={pose} expr={expr} lookY={0.1} mouth={Math.max(mouthMin, mouthOf('DAVI', T, 1.2))} />
  );
  if (t < 3.0) {
    // a alavanca de manutenção entra na fresta e a porta abre aos trancos
    return bg(<SvgCamera cx={540} cy={1000} zoom={1.0}><DoorsInside t={T} open={open} tool={T > 16.3 && T < 17.9 ? 1 : 0} outside={T > 17.6 ? outsideDavi(gapHands(open), 'worried', 0.12) : null} /></SvgCamera>);
  }
  if (t < 7.6) return bg(<SvgCamera cx={540} cy={kf(t, [[3, 820], [7.6, 790]])} zoom={kf(t, [[3, 1.6], [7.6, 1.72]])}><DoorsInside t={T} open={0.42} outside={outsideDavi(gapHands(0.42), 'worried', 0.08)} /></SvgCamera>);
  if (t < 10.9) return bg(<Cab T={T} cx={EV.bia.x} cy={850} z={2.4} expr={T > 24.8 ? 'neutral' : 'worried'} back={1} lookY={-0.05} />);
  if (t < 13.4) {
    // "Vem. Devagar." — um gesto calmo de mão
    const beckon: Pose = {...REST, lSh: 8, lEl: 8, rT: {x: -150, y: -560}, rFs: 0.8, rHand: 'open', rHandRot: 140};
    return bg(<SvgCamera cx={540} cy={820} zoom={1.65}><DoorsInside t={T} open={0.42} outside={outsideDavi(mixPose(gapHands(0.42), beckon, tw(T, 27.0, 27.5, 0, 1, ease.inOut)), 'neutral')} /></SvgCamera>);
  }
  // ela pega a mochila vermelha (close na mão segurando a alça)
  const lift = tw(T, 30.0, 30.6, 0, 1, ease.inOut);
  return bg(
    <SvgCamera cx={EV.bag.x + 20} cy={EV.bag.y - 140} zoom={3.4}>
      <CabInterior floor="6" light={0.85} bag={<Backpack x={EV.bag.x} y={EV.bag.y - lift * 60} />}>
        <Hand x={EV.bag.x} y={EV.bag.y - 225 - lift * 60} rot={180} shape="grip" skin={C.skin} shade={C.skinShade} size={1.7} />
        <path d={`M${EV.bag.x - 30},${EV.bag.y - 560 - lift * 60} L${EV.bag.x + 30},${EV.bag.y - 560 - lift * 60} L${EV.bag.x + 20},${EV.bag.y - 235 - lift * 60} L${EV.bag.x - 20},${EV.bag.y - 235 - lift * 60} Z`} fill={C.skin} />
        <rect x={EV.bag.x - 44} y={EV.bag.y - 640 - lift * 60} width={88} height={110} rx={30} fill={C.shirt} />
      </CabInterior>
    </SvgCamera>
  );
};

/* ───────── CENA 3 — A MOCHILA (31–50s) ───────── */
export const S3: React.FC = () => {
  const t = useT(); const T = 31 + t;
  const handed = T > 33.9;
  const biaHold: Pose = handed ? POSES.phoneL : {...POSES.phoneL, rSh: 0, rEl: 0, rT: {x: -150, y: -420}, rFs: 0.9, rHand: 'grip'};
  const daviBag: Pose = handed ? {...REST, rSh: 10, rEl: 14, rHand: 'grip'} : REST;
  if (t < 5.9) {
    // plano a dois com movimento lateral suave; ela entrega a mochila (fica com caderno e chave)
    return bg(<Hall T={T} cx={kf(t, [[0, 820], [5.9, 900]])} cy={1060} z={1.08}
      davi={{x: H6.davi.x, pose: daviBag, expr: 'neutral', lookX: 0.6, holdR: handed ? BAG : undefined}}
      bia={{x: H6.bia.x, pose: biaHold, expr: 'worried', lookX: -0.6, holdR: handed ? undefined : BAG}} />);
  }
  if (t < 10.0) return bg(<Hall T={T} cx={H6.bia.x} cy={800} z={2.3} bia={{x: H6.bia.x, expr: 'worried', lookX: -0.7}} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag}} />);
  if (t < 12.4) return bg(<Hall T={T} cx={H6.davi.x} cy={790} z={2.4} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag, expr: 'worried', lookX: 0.7}} />);
  if (t < 16.8) return bg(<Hall T={T} cx={H6.bia.x - 40} cy={820} z={2.2} bia={{x: H6.bia.x, expr: 'suspicious', lookX: -0.7}} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag}} />);
  // ele olha devagar para o elevador e não responde
  const turn = tw(T, 48.0, 48.9, 0.7, -1, ease.inOut);
  return bg(<Hall T={T} cx={H6.davi.x} cy={790} z={kf(t, [[16.8, 2.4], [19, 2.6]])} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag, expr: 'worried', lookX: turn, mouthOff: true}} />);
};

/* ───────── CENA 4 — A MENSAGEM (50–64,4s) ───────── */
export const S4: React.FC = () => {
  const t = useT(); const T = 50 + t;
  const daviBag: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
  if (t < 3.0) {
    return (
      <PhoneShot T={T} vib={t < 0.6} glow={C.red}>
        <div style={{position: 'absolute', inset: 0, background: '#0b0d14', paddingTop: 560, boxSizing: 'border-box', textAlign: 'center'}}>
          <div style={{fontFamily: FONT.mono, fontSize: 34, color: '#8a94a8', letterSpacing: 3}}>MENSAGEM · DESCONHECIDO</div>
          <div style={{margin: '40px 50px 0', background: 'rgba(255,45,61,0.12)', border: `4px solid ${C.red}`, borderRadius: 30, padding: '40px 30px', fontFamily: FONT.title, fontSize: 70, color: '#fff', lineHeight: 1.12}}>NÃO CONFIE NO FUNCIONÁRIO.</div>
        </div>
      </PhoneShot>
    );
  }
  if (t < 6.2) {
    return bg(<Hall T={T} cx={895} cy={900} z={1.6} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag, expr: T > 54.6 ? 'confused' : 'worried', lookX: 0.6}}
      bia={{x: H6.bia.x, expr: 'worried', lookX: 0, lookY: 0.7, phoneLit: true}} />);
  }
  if (t < 9.4) {
    // ela vira o celular na direção dele
    const show: Pose = {...POSES.phoneL, lT: {x: -110, y: -500}, lFs: 0.95, lHand: 'grip'};
    return bg(<Hall T={T} cx={895} cy={900} z={1.6} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag, expr: 'worried', lookX: 0.6, lookY: 0.2}}
      bia={{x: H6.bia.x, pose: mixPose(POSES.phoneL, show, tw(T, 56.3, 56.8, 0, 1, ease.inOut)), expr: 'suspicious', lookX: -0.7}} />);
  }
  return bg(<Hall T={T} cx={H6.davi.x} cy={790} z={kf(t, [[9.4, 2.4], [14.4, 2.55]])} davi={{x: H6.davi.x, holdR: BAG, pose: daviBag, expr: T > 60 ? 'worried' : 'confused', lookX: 0.7}} />);
};

/* ───────── CENA 5 — O ACESSO BLOQUEADO (64,4–84,6s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 64.4 + t;
  const toReader = (k: number): Pose => mixPose({...REST, rSh: 10, rEl: 14, rHand: 'grip'}, {...REST, rSh: 10, rEl: 14, rHand: 'grip', lSh: 0, lEl: 0, lT: {x: H6.reader.x - H6.daviReader.x - 40, y: H6.reader.y - H6.floorY}, lHand: 'grip'}, k);
  const at = (cx: number, cy: number, z: number, k: number, expr: any, lookX = 0.8, readerSt: 'idle' | 'denied' = 'idle', biaExpr: any = 'suspicious') =>
    bg(<Hall T={T} cx={cx} cy={cy} z={z} reader={readerSt} davi={{x: H6.daviReader.x, pose: toReader(k), expr, lookX, holdR: BAG, holdL: k > 0.5 ? BADGE : undefined}} bia={{x: H6.biaBehind.x, expr: biaExpr, lookX: 0.7}} />);
  if (t < 2.4) return at(1430, 1060, 1.15, tw(T, 64.6, 65.2, 0, 1, ease.inOut), 'neutral', 0.8, T > 65.4 ? 'denied' : 'idle');
  if (t < 3.8) return bg(<SvgCamera cx={540} cy={900} zoom={1.0}><ReaderClose card={tw(T, 66.8, 67.1, 0.6, 1, ease.out)} denied={T > 67.2 || T < 67.0} blink={Math.sin(T * 10) > 0} /></SvgCamera>);
  if (t < 6.2) return bg(<Hall T={T} cx={H6.daviReader.x} cy={790} z={2.4} reader="denied" davi={{x: H6.daviReader.x, pose: toReader(1), holdR: BAG, holdL: BADGE, expr: 'determined', lookX: 0.5}} />);
  if (t < 8.2) return bg(<Hall T={T} cx={H6.biaBehind.x} cy={800} z={2.4} reader="denied" bia={{x: H6.biaBehind.x, expr: 'suspicious', lookX: 0.8, lookY: 0.3}} />);
  if (t < 14.8) {
    // ele se vira para ela; no fim guarda o crachá
    const down = tw(T, 78.0, 78.6, 1, 0, ease.inOut);
    return at(1350, 1000, 1.45, down, 'worried', -0.8, 'denied', 'suspicious');
  }
  if (t < 17.4) return bg(<Hall T={T} cx={H6.daviReader.x} cy={790} z={2.5} reader="denied" davi={{x: H6.daviReader.x, pose: toReader(0), holdR: BAG, expr: 'worried', lookX: -0.7}} />);
  if (t < 19.2) return bg(<SvgCamera cx={540} cy={1020} zoom={kf(t, [[17.4, 1.6], [19.2, 1.9]])}><ReaderClose card={0} denied blink={Math.sin(T * 6) > 0} /></SvgCamera>);
  return bg(<Hall T={T} cx={H6.biaBehind.x + 4} cy={760} z={3.4} reader="denied" bia={{x: H6.biaBehind.x, expr: 'suspicious', lookX: 0.9}} />);
};

/* ───────── CENA 6 — A GRAVAÇÃO (84,6–98s) ───────── */
const Recording: React.FC<{T: number}> = ({T}) => (
  <CCTV t={T} label="CÂMERA 06 — GRAVAÇÃO" clock={23 * 3600 + 41 * 60 + 8 + Math.floor(T - 84)} tint="#4a7dff" glitch={0.14}>
    <svg viewBox="80 300 900 1600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
      <Hall6 open={0}>
        <Davi t={T} x={470} y={H6.floorY + 2} pose={mixPose(REST, {...REST, lSh: 0, lEl: 0, lT: {x: 92, y: -700}, lHand: 'grip'}, 1)} phone="L" expr="neutral" lookX={0.3} mouth={mouthOf('DAVI_REC', T, 1.2)} />
      </Hall6>
    </svg>
  </CCTV>
);
export const S6: React.FC = () => {
  const t = useT(); const T = 84.6 + t;
  const daviBag: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
  if (t < 3.8) return <PhoneShot T={T} vib={t < 0.6}><Recording T={T} /></PhoneShot>;
  if (t < 7.0) return bg(<Hall T={T} cx={H6.biaBehind.x} cy={800} z={2.5} bia={{x: H6.biaBehind.x, expr: 'fear', lookY: T < 88.9 ? 0.7 : 0, lookX: T < 88.9 ? 0 : 0.8, phoneLit: true}} />);
  if (t < 9.8) return bg(<Hall T={T} cx={H6.daviReader.x} cy={790} z={2.5} davi={{x: H6.daviReader.x, holdR: BAG, pose: daviBag, expr: T > 92.3 ? 'shock' : 'confused', lookX: -0.8, lookY: T < 91.8 ? 0.5 : 0}} />);
  if (t < 12.4) return bg(<Hall T={T} cx={H6.biaBehind.x} cy={800} z={2.6} bia={{x: H6.biaBehind.x, expr: 'determined', lookX: 0.8, phoneLit: true}} />);
  return bg(<Hall T={T} cx={H6.daviReader.x} cy={790} z={2.7} davi={{x: H6.daviReader.x, holdR: BAG, pose: daviBag, expr: 'shock', lookX: -0.8, mouthOff: true}} />);
};

/* ───────── CENA 7 — O CONFRONTO (98–104,8s) ───────── */
export const S7: React.FC = () => {
  const t = useT(); const T = 98 + t;
  const daviBag: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip', lSh: 0, lEl: 0, lT: {x: -140, y: -560}, lFs: 0.8, lHand: 'open', lHandRot: -150};
  if (t < 4.6) {
    // ele dá um passo na direção dela; ela recua (corte entre posições)
    const stepped = T > 98.6;
    return bg(<Hall T={T} cx={1330} cy={980} z={1.4}
      davi={{x: stepped ? H6.daviReader.x - 120 : H6.daviReader.x, holdR: BAG, pose: daviBag, expr: 'worried', lookX: -0.8}}
      bia={{x: stepped ? H6.biaBehind.x - 70 : H6.biaBehind.x, expr: T > 101.9 ? 'worried' : 'fear', lookX: T > 102.0 ? 0 : 0.8, lookY: T > 102.0 ? 0.6 : 0}} />);
  }
  if (t < 5.8) return bg(<Hall T={T} cx={H6.biaBehind.x - 70} cy={800} z={2.6} bia={{x: H6.biaBehind.x - 70, expr: 'worried', lookX: 0.8}} />);
  // close em Davi: sem resposta. A música para.
  return bg(<Hall T={T} cx={H6.daviReader.x - 120} cy={790} z={2.8} davi={{x: H6.daviReader.x - 120, holdR: BAG, pose: {...REST, rSh: 10, rEl: 14, rHand: 'grip'}, expr: 'worried', lookX: -0.8, mouthOff: true}} />);
};

/* ───────── CENA 8 — VOTAÇÃO (104,8–113,6s) ───────── */
export const S8: React.FC = () => {
  const t = useT(); const T = 104.8 + t;
  if (t < 0.8) return <AbsoluteFill style={{background: '#000'}} />;
  const split = tw(t, 0.8, 1.3, 0, 1, ease.out);
  const kA = tw(T, 106.0, 106.4, 0, 1, ease.out), kB = tw(T, 106.2, 106.6, 0, 1, ease.out);
  const cta = tw(T, 111.6, 112.0, 0, 1, ease.out);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: split}}>
        <svg viewBox={`${H6.davi.x - 270} 300 540 1920`} width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
          <Hall6 open={0.42}><Davi t={T} x={H6.davi.x} y={H6.floorY + 2} pose={{...REST, rSh: 10, rEl: 14, rHand: 'grip'}} holdR={BAG} expr="worried" lookX={0.4} /></Hall6>
        </svg>
        <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', opacity: split}}>
        <svg viewBox={`${H6.bia.x - 270} 300 540 1920`} width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
          <Hall6 open={0.42}><Bia t={T} x={H6.bia.x} y={H6.floorY + 2} pose={POSES.phoneL} phone="L" expr="worried" lookX={-0.3} /></Hall6>
        </svg>
        <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
      </div>
      <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: split}}>
        <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: '3px solid #fff', borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: '#fff', fontSize: 44, letterSpacing: 2}}>VOCÊ DECIDE O DESTINO DE BIA</span>
      </div>
      <VoteCard letter="A" text="CONTINUAR COM DAVI" color={C.blue} x={30} y={780} w={490} k={kA} active={0} />
      <VoteCard letter="B" text="SEGUIR SOZINHA" color={C.red} x={560} y={780} w={490} k={kB} active={0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', opacity: cta}}>
        <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 70, padding: '10px 36px', borderRadius: 22}}>
          COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>!
        </div>
      </div>
      <Glitch amount={T > 113.3 ? 0.8 : 0} seed={113} />
    </AbsoluteFill>
  );
};

/* ───────── ENCERRAMENTO (113,6–117,6s) ───────── */
export const S9: React.FC = () => {
  const t = useT();
  const k = tw(t, 0.6, 1.2, 0, 1, ease.out);
  const flick = (t > 1.9 && t < 2.0) || (t > 2.6 && t < 2.66) ? 0.25 : 1;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{opacity: k * flick}}>
        <div style={{fontFamily: FONT.mono, color: C.red, fontSize: 40, letterSpacing: 6, textShadow: `0 0 20px ${C.red}`}}>● TRANSMISSÃO INTERROMPIDA</div>
        <div style={{marginTop: 60, fontFamily: FONT.title, color: '#fff', fontSize: 120, lineHeight: 1, letterSpacing: 4}}>SISTEMA</div>
        <div style={{fontFamily: FONT.title, color: C.red, fontSize: 120, lineHeight: 1.05, letterSpacing: 4, textShadow: `0 0 30px ${C.red}88`, transform: `translateX(${flick < 1 ? 14 : 0}px)`}}>INVADIDO</div>
        <div style={{marginTop: 60, fontFamily: FONT.bold, color: '#aab3c7', fontSize: 46, letterSpacing: 8, opacity: clamp((t - 1.6) * 2)}}>CONTINUA…</div>
      </div>
    </AbsoluteFill>
  );
};
