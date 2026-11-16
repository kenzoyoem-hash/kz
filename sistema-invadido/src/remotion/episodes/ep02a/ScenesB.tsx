import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LandingSet, KeyInLock, TechCorridor, LS} from '../../sets/Landings';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Davi, Keychain} from '../../characters/Davi';
import {Phone, CCTV, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, mouthOf} from './shared';
import {VIG} from './ScenesA';

const LIVE_CLOCK = 23 * 3600 + 49 * 60 + 2;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const KEYS_DOWN: Pose = {...REST, rSh: 10, rEl: 12, rHand: 'grip'};
const KEYS_UP: Pose = {rSh: 0, rEl: 0, lSh: 8, lEl: 8, rT: {x: -120, y: -660}, rFs: 0.8, rHand: 'grip'};
const holdPhone = POSES.phoneL;

const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);

/** imagem FALSIFICADA da CAM 12: um único quadro de Bia atravessando a porta atrás de Davi */
const FakeFeed: React.FC<{T: number; glitch: number; drift: number}> = ({T, glitch, drift}) => (
  <CCTV t={T} label="CAM 12 — CORREDOR TÉCNICO" clock={LIVE_CLOCK + Math.floor(T - 63)} tint="#4a7dff" glitch={glitch}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + drift * 0.05}) translateX(${drift * -14}px)`}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <TechCorridor>
          <Davi t={0.4} x={520} y={1260} scale={0.5} facing="back" />
          <Bia t={0.4} x={690} y={1720} scale={0.82} facing="back" />
        </TechCorridor>
      </svg>
    </div>
    <div style={{position: 'absolute', right: 24, top: 70, background: C.red, color: '#fff', fontFamily: FONT.mono, fontSize: 34, padding: '4px 14px', borderRadius: 8}}>● AO VIVO</div>
  </CCTV>
);

/** patamar do 6º com Bia (posição fixa) e Davi (na porta / em frente / ao lado) */
const Landing6: React.FC<{T: number; cx: number; cy: number; z: number; door?: number; davi?: 'inDoor' | 'front' | 'side' | 'none';
  daviPose?: Pose; daviExpr?: any; daviLook?: number; biaPose?: Pose; biaExpr?: any; biaLookX?: number; biaLookY?: number; red?: number; blue?: number; phoneLit?: boolean; doorInside?: string}> =
  ({T, cx, cy, z, door = 0, davi = 'front', daviPose = KEYS_DOWN, daviExpr = 'worried', daviLook = 0.6, biaPose = holdPhone, biaExpr = 'suspicious', biaLookX = -0.6, biaLookY = 0, red = 0, blue = 0, phoneLit = false, doorInside}) => {
  const D = davi === 'side' ? LS.daviSide : LS.davi;
  const daviEl = davi === 'none' ? null : (
    <Davi t={T} x={D.x} y={D.y} scale={D.s} pose={daviPose} expr={daviExpr} lookX={daviLook} mouth={mouthOf('DAVI', T, 1.2)} holdR={<Keychain swing={Math.sin(T * 2) * 4} />} />
  );
  return (
    <SvgCamera cx={cx} cy={cy} zoom={z}>
      <LandingSet floor={6} gate doorOpen={door} redLight={red} blueLight={blue} doorInside={doorInside ?? '#0b0f17'} inDoor={davi === 'inDoor' ? daviEl : undefined}>
        {davi !== 'inDoor' && daviEl}
        <Bia t={T} x={LS.bia.x} y={LS.bia.y} scale={LS.bia.s} phone="L" pose={biaPose} expr={biaExpr} lookX={biaLookX} lookY={biaLookY} phoneLit={phoneLit} mouth={mouthOf('BIA', T, 1.2)} />
      </LandingSet>
    </SvgCamera>
  );
};

/* ───────── CENA 5 — O FUNCIONÁRIO (37–49,6s) ───────── */
export const S5: React.FC = () => {
  const t = useT();
  const T = 37 + t;
  if (t < 3.6) {
    // plano médio: a porta técnica abre devagar (Davi já está atrás dela)
    const door = tw(T, 38.4, 40.4, 0, 0.85, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Landing6 T={T} cx={kf(t, [[0, 520], [3.6, 470]])} cy={1080} z={kf(t, [[0, 1.0], [3.6, 1.08]])} door={door} davi="inDoor" daviPose={KEYS_DOWN} biaExpr="worried" biaLookX={tw(T, 38.2, 38.6, -0.2, -0.9)} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 9.0) {
    // Davi na abertura da porta, falando; um único gesto de mão em "outro caminho"
    const gesture = tw(T, 45.0, 45.4, 0, 1, ease.inOut);
    const pose = mixPose(KEYS_DOWN, {...KEYS_DOWN, lSh: 0, lEl: 0, lT: {x: 130, y: -560}, lFs: 0.8, lHand: 'open', lHandRot: -120}, gesture);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Landing6 T={T} cx={300} cy={kf(t, [[3.6, 1060], [9, 1020]])} z={kf(t, [[3.6, 1.75], [9, 1.85]])} door={0.85} davi="inDoor" daviPose={pose} daviLook={0.5} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // close em Bia, desconfiada; Davi espera em frente à porta (que se fecha e trava atrás dele)
  const door = tw(T, 46.0, 46.5, 0.85, 0, ease.in);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Landing6 T={T} cx={kf(t, [[9, 560], [12.6, 600]])} cy={820} z={kf(t, [[9, 1.75], [12.6, 1.9]])} door={door} davi="front" daviLook={0.5} biaExpr="suspicious" biaLookX={-0.7} />
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 6 — O HACKER INTERFERE (49,6–60,4s) ───────── */
export const S6: React.FC = () => {
  const t = useT();
  const T = 49.6 + t;
  if (t < 2.0) {
    return (
      <PhoneShot T={T} vib={t < 0.8} glow={C.red}>
        <div style={{position: 'absolute', inset: 0, background: '#12040a', textAlign: 'center', paddingTop: 520, boxSizing: 'border-box'}}>
          <div style={{fontFamily: FONT.title, fontSize: 96, color: C.red, letterSpacing: 6, textShadow: `0 0 30px ${C.red}`}}>⚠ ALERTA</div>
          <div style={{fontFamily: FONT.title, fontSize: 64, color: '#fff', marginTop: 50, padding: '0 50px', lineHeight: 1.15, opacity: clamp((t - 0.3) * 4)}}>NÃO CONFIE NO FUNCIONÁRIO.</div>
        </div>
      </PhoneShot>
    );
  }
  if (t < 6.0) {
    // rosto de Bia com a luz vermelha do celular; os olhos vão do celular para Davi
    const toDavi = T > 53.6;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Landing6 T={T} cx={LS.bia.x} cy={790} z={kf(t, [[2, 2.5], [6, 2.7]])} red={0.7} phoneLit biaExpr={toDavi ? 'suspicious' : 'worried'} biaLookX={toDavi ? -0.8 : 0.1} biaLookY={toDavi ? 0 : 0.7} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 9.2) {
    // Davi levanta devagar o chaveiro metálico
    const up = tw(T, 55.9, 57.1, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Landing6 T={T} cx={300} cy={kf(t, [[6, 1020], [9.2, 980]])} z={kf(t, [[6, 1.75], [9.2, 1.9]])} davi="front" daviPose={mixPose(KEYS_DOWN, KEYS_UP, up)} daviExpr="determined" daviLook={0.5} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // Bia alterna o olhar: Davi → celular (sem mudar de posição)
  const look = T < 59.5 ? {x: -0.8, y: 0} : {x: 0.1, y: 0.7};
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Landing6 T={T} cx={LS.bia.x} cy={790} z={2.7} red={0.3} biaExpr="worried" biaLookX={look.x} biaLookY={look.y} davi="front" daviPose={KEYS_UP} />
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 7 — A IMAGEM IMPOSSÍVEL (60,4–67,6s) ───────── */
export const S7: React.FC = () => {
  const t = useT();
  const T = 60.4 + t;
  if (t < 1.8) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={560} cy={1000} zoom={kf(t, [[0, 1.0], [1.8, 1.05]])}>
          <KeyInLock insert={tw(T, 60.5, 60.8, 0, 1, ease.out)} turn={tw(T, 60.9, 61.4, 0, 1, ease.inOut)} />
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  const medium = (
    <AbsoluteFill style={{background: C.bg}}>
      <Landing6 T={T} cx={480} cy={1080} z={1.05} door={0.85} doorInside="#2c3442" davi="side" daviPose={KEYS_DOWN} daviLook={0.6} biaExpr="worried" biaLookX={-0.6} />
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
  if (t < 3.2) return medium;
  if (t < 5.4) {
    return <PhoneShot T={T} vib={t < 3.7}><FakeFeed T={T} glitch={t < 3.5 ? 0.25 : 0.05} drift={(t - 3.2) / 2.2} /></PhoneShot>;
  }
  // corte para a realidade: ela continua parada do lado de fora
  return medium;
};

/* ───────── CENA 8 — NOVA VOTAÇÃO (67,6–76s) ───────── */
export const S8: React.FC = () => {
  const t = useT();
  const T = 67.6 + t;
  if (t < 6.6) {
    const split = tw(t, 0, 0.4, 0, 1, ease.expo);
    const kA = tw(T, 67.8, 68.15, 0, 1, ease.back), kB = tw(T, 68.0, 68.35, 0, 1, ease.back);
    const aAct = T > 69.4 && T < 70.4 ? 1 : 0, bAct = T > 70.6 && T < 71.6 ? 1 : 0;
    const cta = tw(T, 71.8, 72.15, 0, 1, ease.back);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * -1920}px)`}}>
          <svg viewBox="140 260 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
            <LandingSet floor={6} gate doorOpen={0.85} doorInside="#2c3442" blueLight={1}>
              <Davi t={T} x={LS.daviSide.x - 40} y={LS.daviSide.y} scale={LS.daviSide.s} pose={KEYS_DOWN} expr="worried" lookX={0.4} holdR={<Keychain />} />
            </LandingSet>
          </svg>
        </div>
        <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * 1920}px)`}}>
          <svg viewBox="560 260 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
            <LandingSet floor={6} gate redLight={1}>
              <Bia t={T} x={LS.bia.x} y={LS.bia.y} scale={LS.bia.s} phone="L" pose={holdPhone} expr="worried" lookX={0.3} lookY={0.4} />
            </LandingSet>
          </svg>
        </div>
        <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
        <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 64%, rgba(0,0,0,0.7))'}} />
        <VoteCard letter="A" text="SEGUIR DAVI" color={C.blue} x={30} y={1120} w={490} k={kA} active={aAct} />
        <VoteCard letter="B" text="CONTINUAR SOZINHA" color={C.red} x={560} y={1120} w={490} k={kB} active={bAct} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1610, textAlign: 'center', transform: `scale(${cta})`, opacity: clamp(cta * 2)}}>
          <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 64, padding: '10px 36px', borderRadius: 22}}>
            COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < 8.4) {
    // close na transmissão falsa: Bia "já dentro"; breve interferência e corte seco
    const k = t - 6.6;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: `scale(${1.15 + k * 0.05})`}}>
          <FakeFeed T={T} glitch={T > 75.4 ? 0.9 : 0.08} drift={k / 1.8} />
        </AbsoluteFill>
        <Glitch amount={T > 75.4 ? 0.8 : 0} seed={88} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: '#000'}} />;
};
