import React from 'react';
import {AbsoluteFill} from 'remotion';
import {StairSection, STAIR, Landing, StairDoor, Shadow} from '../../sets/Stairs';
import {Stairwell, LOOKS} from '../../sets/Building';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Man} from '../../characters/Man';
import {Phone, CCTV, MessageBubble, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp} from '../../lib/anim';
import {useT, scene, mouthOf} from './shared';
import {VIG, Tag, biaPath, MAN_SPOT} from './ScenesA';

const CLOCK0 = 23 * 3600 + 47 * 60 + 12;
const BLUE_MAN = [{look: LOOKS.homemAzul, phase: 0}];
const RAIL: Pose = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 48, nEl: -6, nHand: 'grip', fSh: 12, fEl: 20};
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const MID = STAIR.flightB(1, 0); // patamar intermediário entre o 6º e o 5º (onde o homem para)

/** homem subindo o lance B(1) de baixo para cima: 43,0s → 46,0s */
const manPos = (T: number) => {
  if (T < 43.0) return {...MAN_SPOT, walking: false};
  if (T < 46.0) return {...STAIR.flightB(1, tw(T, 43.0, 46.0, 1, 0, ease.linear)), walking: true};
  return {...MID, walking: false};
};
/** a Bia recua um degrau quando ele começa a subir */
const biaBack = (T: number) => (T < 45.0 ? biaPath(T) : {x: tw(T, 45.0, 45.8, 250, 190, ease.inOut), y: STAIR.landingY(0) + 350, dir: 1 as const, walking: false});

const Section: React.FC<{T: number; cx: number; cy: number; z: number; shadow?: number; manPose?: Pose}> = ({T, cx, cy, z, shadow = 0, manPose}) => {
  const b = biaBack(T), m = manPos(T);
  return (
    <SvgCamera cx={cx} cy={cy} zoom={z}>
      <StairSection t={T} floorTop={7} floors={3} light={1} front={shadow > 0 ? <Shadow t={T} x={860} y={STAIR.landingY(0) + 4} scale={0.6} opacity={shadow} /> : undefined}>
        <Bia t={T} x={b.x} y={b.y} scale={0.62} facing="side" dir={1} pose={RAIL} expr="fear" lookY={0.8} />
        <Man t={T} x={m.x} y={m.y} scale={0.62} facing={m.walking ? 'side' : 'front'} dir={-1} walk={m.walking ? 1 : 0} expr="worried" lookY={-1} pose={manPose ?? REST} />
      </StairSection>
    </SvgCamera>
  );
};

/* ───────── CENA 5 — A CONTRADIÇÃO (35,6–46,2s) ───────── */
export const S5: React.FC = () => {
  const t = useT();
  const T = scene('s5_contradicao').start + t;
  if (t < 1.6) {
    // pega o celular e toca na tela (um toque)
    const pose = mixPose(POSES.phoneL, POSES.pointPhone, tw(t, 0.1, 0.5, 0, 1, ease.inOut));
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1150} zoom={1.8}>
          <Landing t={T} floor={6} light={1}><Bia t={T} x={540} y={1760} pose={pose} phone="L" phoneLit expr="suspicious" lookY={0.7} /></Landing>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 5.0) {
    // NO CELULAR: ele continua descendo (a gravação em loop)
    const lt = (T - 37.2) % 3;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540} y={1000} w={820} h={1560}>
          <CCTV t={T} label="CAM 07 · ESCADA B" clock={CLOCK0 + lt} tint={C.blue}><Stairwell t={lt} people={BLUE_MAN} loop={3} /></CCTV>
        </Phone>
        <Tag text="NO CELULAR: ELE ESTÁ DESCENDO" color={C.blue} y={110} />
      </AbsoluteFill>
    );
  }
  if (t < 7.4) {
    // NA ESCADA: ele está parado, olhando para ela
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Section T={T} cx={720} cy={1180} z={1.0} />
        <Tag text="NA ESCADA: ELE ESTÁ PARADO" color={C.yellow} y={250} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // ele começa a subir; ela recua um degrau
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Section T={T} cx={kf(t, [[7.4, 720], [10.6, 560]])} cy={kf(t, [[7.4, 1180], [10.6, 1000]])} z={kf(t, [[7.4, 1.0], [10.6, 1.3]])} />
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 6 — O AVISO (46,2–57,6s) ───────── */
export const S6: React.FC = () => {
  const t = useT();
  const T = scene('s6_aviso').start + t;
  const biaShot = (pose: Pose, expr: any, z: number, cy: number) => (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={cy} zoom={z}>
        <Landing t={T} floor={6} light={1}><Bia t={T} x={540} y={1760} pose={pose} phone="L" expr={expr} mouth={mouthOf('BIA', T)} lookY={0.6} /></Landing>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
  const holdPhone: Pose = {...POSES.phoneL};
  if (t < 2.0) {
    // "Para!": a mão sobe UMA vez e fica
    const stop: Pose = {...POSES.stop, lT: {x: 40, y: -470}, lFs: 0.6, lHand: 'grip'};
    return biaShot(mixPose(holdPhone, stop, tw(T, 46.4, 46.7, 0, 1, ease.out)), 'determined', 1.8, 1080);
  }
  if (t < 7.0) {
    // o homem explica: mãos abertas no peito; ao falar das câmeras, aponta para cima e mantém
    const open: Pose = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -90, y: -540}, lT: {x: 90, y: -540}, rFs: 0.7, lFs: 0.7, rHand: 'open', lHand: 'open', rHandRot: 140, lHandRot: -140};
    const point: Pose = {...open, lT: {x: 150, y: -720}, lFs: 0.9, lHand: 'point', lHandRot: -200};
    const pose = mixPose(mixPose(REST, open, tw(T, 48.4, 48.8, 0, 1, ease.inOut)), point, tw(T, 50.3, 50.7, 0, 1, ease.inOut));
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1100} zoom={kf(t, [[2, 1.7], [7, 1.85]])}>
          <Landing t={T} floor={5} light={1}><Man t={T} x={540} y={1800} pose={pose} expr="worried" lookY={-0.7} mouth={mouthOf('HOMEM', T, 1.8)} /></Landing>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 9.6) {
    return biaShot(holdPhone, 'suspicious', kf(t, [[7, 2.1], [9.6, 2.3]]), 1000);
  }
  // close no homem: ele olha para algo ATRÁS dela. "Não se vira."
  const sees = T > 55.7;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={1000} zoom={kf(t, [[9.6, 2.6], [11.4, 3.2]])}>
        <Landing t={T} floor={5} light={1}>
          <Man t={T} x={540} y={1800} expr={sees ? 'shock' : 'worried'} lookY={-1} lookX={sees ? -0.5 : 0} pupil={sees ? 0.6 : 1} mouth={mouthOf('HOMEM', T, 2.4)} pose={REST} />
        </Landing>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 7 — O PERIGO (57,6–65,2s) ───────── */
export const S7: React.FC = () => {
  const t = useT();
  const T = scene('s7_perigo').start + t;
  const bubble = T > 58.6 && T < 63.4 ? <MessageBubble t={T - 58.6} from="DESCONHECIDO" text="VOCÊ NÃO DEVERIA TER ESCUTADO ELE." y={240} /> : null;
  if (t < 4.0) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={kf(t, [[0, 1020], [4, 980]])} zoom={kf(t, [[0, 2.0], [4, 2.2]])}>
          <Landing t={T} floor={6} light={0.9}>
            <Bia t={T} x={540} y={1760} pose={POSES.phoneL} phone="L" phoneLit={T > 58.6} expr="fear" lookX={0.8} lookY={0.1} pupil={0.65} />
          </Landing>
        </SvgCamera>
        <Vignette strength={VIG} />
        {bubble}
      </AbsoluteFill>
    );
  }
  // plano geral: o homem abaixo, a Bia no meio e uma silhueta no 7º andar, acima dela
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Section T={T} cx={640} cy={kf(t, [[4, 900], [7.6, 860]])} z={kf(t, [[4, 1.1], [7.6, 0.95]])} shadow={tw(t, 4.4, 6.0, 0, 0.8)}
        manPose={{rSh: 0, rEl: 0, lSh: 8, lEl: 8, rT: {x: -120, y: -620}, rFs: 0.8, rHand: 'open', rHandRot: 170}} />
      <Vignette strength={VIG} />
      {bubble && <div style={{opacity: tw(T, 62.8, 63.4, 1, 0)}}>{bubble}</div>}
    </AbsoluteFill>
  );
};

/* ───────── CENA 8 — NOVA VOTAÇÃO (65,2–75s) ───────── */
export const S8: React.FC = () => {
  const t = useT();
  const T = scene('s8_votacao').start + t;
  if (t < 6.8) {
    const split = tw(t, 0, 0.4, 0, 1, ease.expo);
    const kA = tw(T, 65.4, 65.75, 0, 1, ease.back), kB = tw(T, 65.6, 65.95, 0, 1, ease.back);
    const aAct = T > 65.6 && T < 67.5 ? 1 : 0;
    const bAct = T > 67.6 && T < 68.6 ? 1 : 0;
    const cta = tw(T, 68.7, 69.05, 0, 1, ease.back);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * -1920}px)`}}>
          <svg viewBox={`${MID.x - 270} ${MID.y - 1150} 540 1920`} width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
            <StairSection t={T} floorTop={7} floors={3} light={1}>
              <Man t={T} x={MID.x} y={MID.y} scale={0.62} expr="worried" lookY={-1} pose={{rSh: 0, rEl: 0, lSh: 8, lEl: 8, rT: {x: -120, y: -620}, rFs: 0.8, rHand: 'open', rHandRot: 170}} />
            </StairSection>
          </svg>
          <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.4}} />
        </div>
        <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * 1920}px)`}}>
          <svg viewBox="270 300 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice"><StairDoor t={T} open={0} /></svg>
          <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.35}} />
        </div>
        <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
        <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.65), transparent 30%, transparent 62%, rgba(0,0,0,0.7))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT.title, color: '#fff', fontSize: 46, letterSpacing: 3, opacity: split, textShadow: '0 3px 10px #000'}}>O QUE A BIA FAZ?</div>
        <VoteCard letter="A" text="CONFIAR NO HOMEM E DESCER" color={C.blue} x={30} y={800} w={490} k={kA} active={aAct} />
        <VoteCard letter="B" text="CORRER DE VOLTA AO 7º ANDAR" color={C.red} x={560} y={800} w={490} k={kB} active={bAct} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center', transform: `scale(${cta})`, opacity: clamp(cta * 2)}}>
          <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 72, padding: '12px 40px', borderRadius: 24}}>
            COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>
          </div>
          <div style={{fontFamily: FONT.bold, fontSize: 36, color: '#fff', marginTop: 16, textShadow: '0 2px 8px #000'}}>a mais votada decide o EP. 3</div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < 9.4) {
    // a sombra de alguém parado atrás da Bia
    const k = t - 6.8;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(k, [[0, 560], [2.6, 680]])} cy={kf(k, [[0, 1080], [2.6, 860]])} zoom={kf(k, [[0, 1.5], [2.6, 1.9]])}>
          <Landing t={T} floor={6} light={0.85} behind={<Shadow t={T} x={800} y={1270} scale={0.95} opacity={tw(k, 0.3, 1.4, 0, 1, ease.inOut)} />}>
            <Bia t={T} x={500} y={1780} pose={POSES.phoneL} phone="L" phoneLit expr="worried" lookY={0.8} lookX={-0.2} />
          </Landing>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: '#000'}} />;
};
