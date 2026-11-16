import React from 'react';
import {AbsoluteFill} from 'remotion';
import {StairSection, STAIR, StairGap, Landing, StairDoor, Shadow} from '../../sets/Stairs';
import {Stairwell, LOOKS} from '../../sets/Building';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Man} from '../../characters/Man';
import {Phone, CCTV, MessageBubble, VoteCard} from '../../ui/UI';
import {Stamp} from '../../ui/PhoneScreens';
import {SvgCamera, Glitch, Flash, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, shake, clamp} from '../../lib/anim';
import {useT, scene, mouthOf} from './shared';

const CLOCK0 = 23 * 3600 + 47 * 60 + 12;
const BLUE_MAN = [{look: LOOKS.homemAzul, phase: 0}];
const cs = (t: number, t0: number, amp: number, dur: number, seed = 1) => { const s = shake(t, t0, amp, dur, seed); return {sx: s.x, sy: s.y}; };

const explain = (T: number): Pose => mixPose(
  {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -130, y: -520}, lT: {x: 110, y: -560}, rFs: 0.75, lFs: 0.75, rHand: 'open', lHand: 'open', rHandRot: 120, lHandRot: -150},
  {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -100, y: -580}, lT: {x: 140, y: -500}, rFs: 0.75, lFs: 0.75, rHand: 'open', lHand: 'point', rHandRot: 150, lHandRot: -120},
  0.5 + 0.5 * Math.sin(T * 4.2));

/* ───────── CENA 5 — A CONTRADIÇÃO (35,6–46,4s) ───────── */
export const S5: React.FC = () => {
  const t = useT();
  const T = scene('s5_contradicao').start + t;
  if (t < 1.8) {
    // pega o celular e toca na tela
    const pose = mixPose(POSES.phoneL, POSES.pointPhone, tw(t, 0.1, 0.45, 0, 1, ease.out));
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1180} zoom={kf(t, [[0, 1.7], [1.8, 1.9]])}>
          <Landing t={T} floor={6} light={0.75}>
            <Bia t={T} x={540} y={1760} pose={pose} phone="L" phoneLit expr="suspicious" lookY={0.7} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 7.8) {
    // DUAS REALIDADES: no celular ele desce em loop; no vão, ele está parado olhando para ela
    const k = t - 1.8;
    const lt = (T - 37.4) % 3;
    const falsa = T > 40.0, real = T > 42.0;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <SvgCamera cx={540} cy={1000} zoom={kf(k, [[0, 2.6], [6, 3.0]])}>
          <StairGap t={T} bottom={<Man t={T} x={540} y={1040} scale={0.075} lookY={-1} expr="worried" />} />
        </SvgCamera>
        {real && (
          <div style={{position: 'absolute', left: 540 - 170, top: 700, width: 340, height: 420, border: `8px solid ${C.yellow}`, borderRadius: 200, boxShadow: `0 0 40px ${C.yellow}`, opacity: clamp((T - 42.0) * 5)}} />
        )}
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${tw(k, 0, 0.4, 700, 0, ease.out)}px)`}}>
          <Phone x={540} y={1430} w={560} h={1000} rot={4}>
            <CCTV t={T} label="CAM 07 · AO VIVO" clock={CLOCK0 + lt} tint={C.blue} small glitch={falsa ? 0.25 : 0}>
              <Stairwell t={lt} people={BLUE_MAN} loop={3} />
            </CCTV>
          </Phone>
        </div>
        {falsa && <Stamp t={T - 40.0} text="FALSA" color={C.red} x={540} y={1430} />}
        {real && <Stamp t={T - 42.0} text="REAL" color={C.yellow} x={540} y={560} rot={6} size={0.85} />}
        <Vignette strength={0.55} />
      </AbsoluteFill>
    );
  }
  // o homem começa a subir em direção a ela
  const k = t - 7.8;
  const up = tw(k, 0, 2.6, 0, 1, ease.inOut);
  const stepBob = Math.abs(Math.sin(k * 7)) * -14 * (up < 1 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={1060} zoom={1.45} rot={5} {...cs(k, 2.2, 8, 0.4)}>
        <Landing t={T} floor={5} light={0.6}>
          <Man t={T} x={540 + (1 - up) * 160} y={1500 + up * 330 + stepBob} scale={0.62 + up * 0.42} run={up < 1 ? 0.22 : 0} expr="worried" lookY={-0.9}
            pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -110, y: -560}, lT: {x: 70, y: -420}, rFs: 0.8, lFs: 0.9, rHand: 'open', lHand: 'grip', rHandRot: 170}} />
        </Landing>
      </SvgCamera>
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 6 — O AVISO (46,4–57,6s) ───────── */
export const S6: React.FC = () => {
  const t = useT();
  const T = scene('s6_aviso').start + t;
  if (t < 2.2) {
    // "Para! Quem é você?" — recua um degrau com a palma aberta
    const back = tw(t, 0, 0.5, 0, 1, ease.out);
    const pose = mixPose(POSES.phoneL, {...POSES.stop, lT: {x: 40, y: -470}, lFs: 0.6, lHand: 'grip'}, tw(t, 0.1, 0.35, 0, 1, ease.back));
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1060} zoom={kf(t, [[0, 1.9], [0.3, 1.7, ease.expo], [2.2, 1.8]])} {...cs(t, 0.2, 14, 0.3, 5)}>
          <Landing t={T} floor={6} light={0.75}>
            <Bia t={T} x={540} y={1760 - back * 60} scale={1.0 - back * 0.05} pose={pose} phone="L" expr="determined" mouth={mouthOf('BIA', T)} lookY={0.6} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 6.2) {
    const k = t - 2.2;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(k, [[0, 560], [4, 520]])} cy={1080} zoom={kf(k, [[0, 1.75], [4, 1.95]])} rot={-3}>
          <Landing t={T} floor={5} light={0.7}>
            <Man t={T} x={540} y={1840} scale={1.05} pose={explain(T)} expr="worried" lookY={-0.7} mouth={mouthOf('HOMEM', T, 1.8)} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 8.6) {
    // "Então o que elas estão escondendo?" — mão aberta, questionando
    const k = t - 6.2;
    const ask: Pose = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -140, y: -540}, rFs: 0.8, rHand: 'open', rHandRot: 110, lT: {x: 40, y: -470}, lFs: 0.6, lHand: 'grip'};
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={kf(k, [[0, 1000], [2.4, 960]])} zoom={kf(k, [[0, 2.2], [2.4, 2.5]])}>
          <Landing t={T} floor={6} light={0.75}>
            <Bia t={T} x={540} y={1760} pose={mixPose(POSES.phoneL, ask, tw(k, 0.1, 0.4, 0, 1))} phone="L" expr="suspicious" mouth={mouthOf('BIA', T)} lookY={0.6} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  // close no homem: os olhos dele vão para ALGO ATRÁS DELA. "Não se vira."
  const k = t - 8.6;
  const sees = T > 55.1;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={kf(k, [[0, 1000], [3, 1080]])} zoom={kf(k, [[0, 2.8], [0.5, 3.0], [1.0, 3.9, ease.expo], [3, 4.4]])} {...cs(T, 56.9, 18, 0.6, 9)}>
        <Landing t={T} floor={5} light={0.65}>
          <Man t={T} x={540} y={1840} scale={1.05} expr={sees ? 'shock' : 'worried'} lookY={sees ? -1 : -0.6} lookX={sees ? -0.5 : 0} pupil={sees ? 0.6 : 1}
            mouth={mouthOf('HOMEM', T, 3)} pose={{rSh: 10, rEl: 10, lSh: 10, lEl: 10}} />
        </Landing>
      </SvgCamera>
      <Vignette strength={0.7} />
      <Flash amount={tw(T, 56.9, 57.1, 0.4, 0)} color="#000" />
    </AbsoluteFill>
  );
};

/* ───────── CENA 7 — O PERIGO (57,6–65s) ───────── */
export const S7: React.FC = () => {
  const t = useT();
  const T = scene('s7_perigo').start + t;
  const bubble = T > 58.9 && T < 63.2 ? <MessageBubble t={T - 58.9} from="DESCONHECIDO" text="VOCÊ NÃO DEVERIA TER ESCUTADO ELE." y={300} /> : null;
  if (t < 4.2) {
    const vib = T > 58.9 && T < 59.9 ? Math.sin(T * 70) * 4 : 0;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={560} cy={kf(t, [[0, 1020], [4.2, 960]])} zoom={kf(t, [[0, 2.0], [4.2, 2.4]])}>
          <Landing t={T} floor={6} light={0.6} behind={<Shadow t={T} x={860} y={1180} scale={0.75} opacity={tw(t, 0.5, 3.5, 0, 0.35)} />}>
            <Bia t={T + 0.001} x={540 + vib} y={1760} pose={POSES.phoneL} phone="L" phoneLit={T > 58.9} expr="fear" lookX={0.9} lookY={0.1} tremble={0.7} pupil={0.6} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.7} />
        {bubble}
      </AbsoluteFill>
    );
  }
  // plano geral em corte: o homem abaixo, a Bia no meio, a escuridão acima
  const k = t - 4.2;
  const p = STAIR.flightA(1, 0.0);
  const m = STAIR.flightB(1, 0.55);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={620} cy={kf(k, [[0, 1000], [2.8, 900]])} zoom={kf(k, [[0, 1.2], [2.8, 0.98]])}>
        <StairSection t={T} floorTop={7} floors={3} light={0.55}
          front={<Shadow t={T} x={720} y={STAIR.landingY(0) + 4} scale={0.6} opacity={0.5} />}>
          <Bia t={T} x={p.x + 20} y={p.y} scale={0.62} facing="side" dir={-1} expr="fear" pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 30, nEl: 60, nHand: 'grip', fSh: 10, fEl: 20}} tremble={0.6} />
          <Man t={T} x={m.x} y={m.y} scale={0.62} facing="side" dir={-1} expr="worried" pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 120, nEl: 20, nHand: 'open', fSh: 10, fEl: 20}} />
        </StairSection>
      </SvgCamera>
      <Vignette strength={0.7} />
      {bubble && <div style={{opacity: tw(T, 62.6, 63.2, 1, 0)}}>{bubble}</div>}
    </AbsoluteFill>
  );
};

/* ───────── CENA 8 — NOVA VOTAÇÃO (65–75s) ───────── */
export const S8: React.FC = () => {
  const t = useT();
  const T = scene('s8_votacao').start + t;
  if (t < 7.0) {
    const split = tw(t, 0, 0.4, 0, 1, ease.expo);
    const kA = tw(T, 65.3, 65.65, 0, 1, ease.back), kB = tw(T, 65.5, 65.85, 0, 1, ease.back);
    const aAct = Math.max(T > 65.8 && T < 67.6 ? 1 : 0, T > 68.7 ? 0.5 + 0.5 * Math.sin(T * 6) : 0);
    const bAct = Math.max(T > 67.6 && T < 68.6 ? 1 : 0, T > 68.7 ? 0.5 + 0.5 * Math.sin(T * 6 + Math.PI) : 0);
    const cta = tw(T, 68.7, 69.05, 0, 1, ease.back);
    const m = STAIR.flightB(0, (T * 0.12) % 1);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * -1920}px)`}}>
          <svg viewBox={`${m.x - 300} ${m.y - 1150} 600 2133`} width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
            <StairSection t={T} floorTop={6} floors={2} light={0.8}>
              <Man t={T} x={m.x} y={m.y} scale={0.62} facing="side" dir={1} walk={1} expr="worried" pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 100, nEl: 40, nHand: 'open'}} />
            </StairSection>
          </svg>
          <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.5}} />
        </div>
        <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * 1920}px)`}}>
          <svg viewBox="270 300 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice">
            <StairDoor t={T} open={0} />
          </svg>
          <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.4}} />
        </div>
        <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
        <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.7), transparent 30%, transparent 60%, rgba(0,0,0,0.75))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT.title, color: '#fff', fontSize: 46, letterSpacing: 3, opacity: split, textShadow: '0 3px 10px #000'}}>O QUE A BIA FAZ?</div>
        <VoteCard letter="A" text="CONFIAR NO HOMEM E DESCER" color={C.blue} x={30} y={800} w={490} k={kA} active={aAct} />
        <VoteCard letter="B" text="CORRER DE VOLTA AO 7º ANDAR" color={C.red} x={560} y={800} w={490} k={kB} active={bAct} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center', transform: `scale(${cta})`, opacity: clamp(cta * 2)}}>
          <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 72, padding: '12px 40px', borderRadius: 24}}>
            COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>
          </div>
          <div style={{fontSize: 80, marginTop: 6, transform: `translateY(${Math.sin(T * 8) * 12}px)`}}>👇</div>
          <div style={{fontFamily: FONT.bold, fontSize: 36, color: '#fff', textShadow: '0 2px 8px #000'}}>a mais votada decide o EP. 3</div>
        </div>
        <Glitch amount={t < 0.3 ? 0.7 : 0} seed={81} />
      </AbsoluteFill>
    );
  }
  if (t < 9.6) {
    // último instante: a sombra de alguém parado atrás da Bia
    const k = t - 7.0;
    const sh = tw(k, 0.2, 1.3, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(k, [[0, 560], [2.6, 700]])} cy={kf(k, [[0, 1080], [2.6, 820]])} zoom={kf(k, [[0, 1.5], [2.2, 1.9], [2.6, 2.3, ease.in]])} {...cs(T, 73.2, 10, 0.6, 3)}>
          <Landing t={T} floor={6} light={0.55} behind={<Shadow t={T} x={800} y={1270} scale={0.95} opacity={sh} />}>
            <Bia t={T} x={500} y={1780} pose={POSES.phoneL} phone="L" phoneLit expr="worried" lookY={0.8} lookX={-0.2} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.75} />
        <Glitch amount={T > 74.4 ? 0.9 : 0} seed={82} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: '#000'}} />;
};
