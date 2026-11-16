import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Apartment, APT} from '../../sets/Apartment';
import {Hallway, AptDoorFromHall, StairDoor, StairSection, STAIR, Landing} from '../../sets/Stairs';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Man} from '../../characters/Man';
import {Phone, IncomingCall} from '../../ui/UI';
import {VoteResult, CallScreen, ThumbAnswer} from '../../ui/PhoneScreens';
import {SvgCamera, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw} from '../../lib/anim';
import {useT, scene, mouthOf, BiaAvatar} from './shared';

/**
 * EP. 2A (versão 2): narrativa LINEAR numa única geografia de escada:
 * Bia desce do 7º (lance A) para o lance B; o homem está no patamar do 5º; a silhueta fica no 7º.
 */
export const VIG = 0.3;

/** posição da Bia na descida (lance A inteiro, depois metade do lance B) */
export const biaPath = (T: number) => {
  const yL = STAIR.landingY(0) + 350; // patamar intermediário entre o 7º e o 6º
  if (T < 18.0) return {...STAIR.flightA(0, 0), dir: -1 as const, walking: false};
  if (T < 21.4) return {...STAIR.flightA(0, tw(T, 18.0, 21.4, 0, 1, ease.linear)), dir: -1 as const, walking: true};
  if (T < 22.0) return {x: tw(T, 21.4, 22.0, 360, 250), y: yL, dir: -1 as const, walking: true};
  return {x: 250, y: yL, dir: 1 as const, walking: false};
};
export const MAN_SPOT = {x: 900, y: STAIR.landingY(2)}; // patamar do 5º andar

export const Tag: React.FC<{text: string; color?: string; y?: number; k?: number}> = ({text, color = C.yellow, y = 250, k = 1}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: k}}>
    <span style={{display: 'inline-block', background: 'rgba(0,0,0,0.7)', border: `4px solid ${color}`, color: '#fff', fontFamily: FONT.title, fontSize: 44, padding: '8px 26px', borderRadius: 16}}>{text}</span>
  </div>
);

/* ───────── CENA 1 — A ESCOLHA (0–7,6s) ───────── */
export const S1: React.FC = () => {
  const t = useT();
  const T = scene('s1_escolha').start + t;
  if (t < 2.2) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #182340, #04060c 70%)'}}>
        <AbsoluteFill style={{transform: `scale(${kf(t, [[0, 1.04], [2.2, 1.0]])})`}}>
          <Phone x={540} y={980} w={900} h={1780}>
            <VoteResult t={t + 0.6} a={64} b={36} aLabel="ESCADAS" bLabel="ELEVADOR" winner="A" stamp="ROTA LIBERADA: ESCADA B" />
          </Phone>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (t < 4.2) {
    // dentro de casa: a luz da fechadura fica verde e ela gira a maçaneta
    const unlocked = T > 2.95;
    const pull = tw(T, 3.3, 3.9, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={1440} cy={1000} zoom={2.2}>
          <Apartment t={T} light={0.85} locked={!unlocked}>
            <Bia t={T} x={1400 - pull * 30} y={1352} scale={0.95} facing="back"
              pose={{...POSES.idle, lT: {x: (APT.handle.x + 40 - 1400 + pull * 30) / 0.95, y: (APT.handle.y - 1352) / 0.95}, lHand: 'grip'}} />
          </Apartment>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // no corredor: a porta abre e ela sai
  const k = t - 4.2;
  const open = tw(k, 0, 0.8, 0, 1, ease.inOut);
  const step = tw(k, 0.6, 1.8, 0, 1, ease.inOut);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={1100} zoom={1.15}>
        <AptDoorFromHall t={T} open={open}>
          <Bia t={T} x={540} y={1500 + step * 300} scale={0.95 + step * 0.2} expr="worried" run={step > 0.02 && step < 0.98 ? 0.2 : 0} lookX={k > 2.2 ? -0.5 : 0} phone="L" pose={POSES.phoneL} />
        </AptDoorFromHall>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 2 — A LIGAÇÃO (7,6–16,2s) ───────── */
export const S2: React.FC = () => {
  const t = useT();
  const T = scene('s2_ligacao').start + t;
  const hall = (z: number, cy: number, el: React.ReactNode) => (
    <SvgCamera cx={540} cy={cy} zoom={z}><Hallway t={T} light={1}>{el}</Hallway></SvgCamera>
  );
  if (t < 1.0) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {hall(1.4, 1150, <Bia t={T} x={540} y={1720} scale={1.05} phone="both" phoneLit expr="surprised" lookY={0.5} />)}
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 1.8) {
    const k = t - 1.0;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540} y={980} w={780} h={1520} hands={false}>
          {k < 0.6 ? <IncomingCall t={T} name="VOCÊ" avatar={<BiaAvatar t={T} />} /> : <CallScreen t={T} name="VOCÊ" seconds={0} avatar={<BiaAvatar t={T} />} />}
          <ThumbAnswer t={k} />
        </Phone>
      </AbsoluteFill>
    );
  }
  if (t < 7.2) {
    // ouve com o celular no ouvido (um único movimento de levar ao ouvido, depois parada)
    const k = t - 1.8;
    const pose = mixPose(POSES.phoneL, POSES.phoneEar, tw(k, 0, 0.5, 0, 1, ease.inOut));
    const close = k > 2.8;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {hall(close ? kf(k, [[2.8, 2.6], [5.4, 2.8]]) : kf(k, [[0, 1.6], [2.8, 1.75]]), close ? 980 : 1120,
          <Bia t={T} x={540} y={1720} scale={1.05} pose={pose} phone="L" expr={T > 13.6 ? 'fear' : 'confused'} lookX={-0.3} />)}
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 7.9) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540} y={980} w={780} h={1520} hands={false}>
          <CallScreen t={T} name="VOCÊ" seconds={5} ended avatar={<BiaAvatar t={T} />} />
        </Phone>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {hall(1.6, 1120, <Bia t={T} x={540} y={1720} scale={1.05} phone="both" phoneLit expr="confused" lookY={0.6} />)}
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 3 — A DESCIDA (16,2–26,8s) ───────── */
const RAIL: Pose = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 48, nEl: -6, nHand: 'grip', fSh: 12, fEl: 20};
export const S3: React.FC = () => {
  const t = useT();
  const T = scene('s3_descida').start + t;
  if (t < 1.8) {
    const open = tw(t, 0.2, 0.9, 0, 1, ease.out);
    const walkIn = tw(t, 0.9, 1.8, 0, 1);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1100} zoom={1.2}>
          <StairDoor t={T} open={open}>
            <Bia t={T} x={540} y={1800 - walkIn * 260} scale={1.12 - walkIn * 0.2} facing="back" pose={walkIn > 0 ? POSES.idle : POSES.push} run={walkIn > 0.02 && walkIn < 0.98 ? 0.25 : 0} />
          </StairDoor>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  const p = biaPath(T);
  const stopped = T >= 22.0;
  const z = stopped ? kf(T, [[22.0, 1.5], [22.4, 1.9, ease.out], [26.8, 2.0]]) : 1.5;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={p.x} cy={p.y - 280} zoom={z}>
        <StairSection t={T} floorTop={7} floors={3} light={1}>
          <Bia t={T} x={p.x} y={p.y} scale={0.62} facing="side" dir={p.dir} walk={p.walking ? 1 : 0}
            pose={stopped ? {...RAIL, nSh: 40, nEl: -10} : RAIL} expr={stopped ? 'shock' : 'worried'} lookY={stopped ? 0.9 : 0.3} />
        </StairSection>
      </SvgCamera>
      {stopped && <Tag text="↓ ALGUNS ANDARES ABAIXO" color={C.cyan} y={300} k={tw(T, 22.4, 22.8, 0, 1)} />}
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 4 — O HOMEM DO VÍDEO (26,8–35,6s) ───────── */
export const S4: React.FC = () => {
  const t = useT();
  const T = scene('s4_homem').start + t;
  const p = biaPath(T);
  if (t < 4.8) {
    // plano único que liga os dois: a câmera desce da Bia (debruçada) até o homem (olhando para cima)
    const cx = kf(t, [[0, p.x], [0.6, p.x], [2.2, MAN_SPOT.x, ease.inOut], [3.4, MAN_SPOT.x], [4.8, 700, ease.inOut]]);
    const cy = kf(t, [[0, p.y - 260], [0.6, p.y - 260], [2.2, MAN_SPOT.y - 260, ease.inOut], [3.4, MAN_SPOT.y - 260], [4.8, 1180, ease.inOut]]);
    const z = kf(t, [[0, 1.8], [2.2, 1.8], [3.4, 1.9], [4.8, 1.0, ease.inOut]]);
    const lean = tw(t, 0, 0.5, 2, 20, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={cx} cy={cy} zoom={z}>
          <StairSection t={T} floorTop={7} floors={3} light={1}>
            <Bia t={T} x={p.x} y={p.y} scale={0.62} facing="side" dir={1} pose={{...RAIL, nSh: 62, nEl: -20, lean}} expr="worried" lookY={1} />
            <Man t={T} x={MAN_SPOT.x} y={MAN_SPOT.y} scale={0.62} expr="worried" lookY={-1} pose={{rSh: 8, rEl: 8, lSh: 8, lEl: 8}} />
          </StairSection>
        </SvgCamera>
        {t > 2.0 && <Tag text="A BLUSA AZUL DA GRAVAÇÃO" color={C.blue} y={300} k={tw(t, 2.0, 2.4, 0, 1)} />}
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // close no homem pedindo ajuda: um gesto (mãos sobem) e fica parado
  const k = t - 4.8;
  const plead: Pose = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -95, y: -590}, lT: {x: 95, y: -590}, rFs: 0.7, lFs: 0.7, rHand: 'open', lHand: 'open', rHandRot: 170, lHandRot: -170};
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={kf(k, [[0, 1120], [4, 1060]])} zoom={kf(k, [[0, 1.6], [4, 1.75]])}>
        <Landing t={T} floor={5} light={1}>
          <Man t={T} x={540} y={1800} pose={mixPose({rSh: 8, rEl: 8, lSh: 8, lEl: 8}, plead, tw(T, 31.8, 32.3, 0, 1, ease.inOut))} expr="worried" lookY={-1} mouth={mouthOf('HOMEM', T, 1.8)} />
        </Landing>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};
