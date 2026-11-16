import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Apartment, APT} from '../../sets/Apartment';
import {Hallway, AptDoorFromHall, StairDoor, StairSection, STAIR, StairGap, Landing} from '../../sets/Stairs';
import {Stairwell, LOOKS} from '../../sets/Building';
import {Bia, POSES, mixPose} from '../../characters/Bia';
import {Man} from '../../characters/Man';
import {Phone, CCTV, IncomingCall} from '../../ui/UI';
import {VoteResult, CallScreen, ThumbAnswer, Stamp} from '../../ui/PhoneScreens';
import {SvgCamera, Glitch, Flash, Vignette} from '../../fx/Fx';
import {C} from '../../theme';
import {kf, ease, tw, shake} from '../../lib/anim';
import {useT, scene, mouthOf, BiaAvatar} from './shared';

const cs = (t: number, t0: number, amp: number, dur: number, seed = 1) => { const s = shake(t, t0, amp, dur, seed); return {sx: s.x, sy: s.y}; };

const CLOCK0 = 23 * 3600 + 47 * 60 + 12;
const BLUE_MAN = [{look: LOOKS.homemAzul, phase: 0}];

/* ───────── CENA 1 — A ESCOLHA (0–7s) ───────── */
export const S1: React.FC = () => {
  const t = useT();
  const T = scene('s1_escolha').start + t;
  if (t < 2.6) {
    const z = kf(t, [[0, 1.12], [0.3, 1.0, ease.expo], [2.6, 1.06, ease.linear]]);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #182340, #04060c 70%)'}}>
        <AbsoluteFill style={{transform: `scale(${z}) rotate(${-1.5 + t * 0.5}deg)`}}>
          <Phone x={540} y={980} w={900} h={1780}>
            <VoteResult t={t + 0.25} a={64} b={36} aLabel="ESCADAS" bLabel="ELEVADOR" winner="A" stamp="ROTA LIBERADA: ESCADA B" />
          </Phone>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (t < 4.4) {
    // fechadura destrava: LED fica verde, a mão da Bia puxa a maçaneta
    const k = t - 2.6;
    const unlocked = T > 3.05;
    const pull = tw(k, 1.0, 1.6, 0, 1);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={APT.lock.x - 30} cy={920} zoom={kf(k, [[0, 3.6], [1.8, 3.9, ease.linear]])} {...cs(k, 0.45, 10, 0.3)}>
          <Apartment t={T} light={0.6} locked={!unlocked}>
            <Bia t={T} x={1400 - pull * 20} y={1352} scale={0.95} facing="back" pose={{...POSES.handle, lT: {x: (APT.handle.x + 40 - 1400 + pull * 20) / 0.95, y: (APT.handle.y - 1352) / 0.95}, rT: {x: -40, y: -470}}} />
          </Apartment>
        </SvgCamera>
        {unlocked && <Stamp t={T - 3.05} text="DESTRAVADA" color={C.green} x={540} y={420} size={0.8} />}
      </AbsoluteFill>
    );
  }
  if (t < 5.8) {
    // vista do corredor: a porta abre e a Bia sai para o escuro
    const k = t - 4.4;
    const open = tw(k, 0, 0.8, 0, 1, ease.inOut);
    const step = tw(k, 0.6, 1.4, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1080} zoom={kf(k, [[0, 1.1], [1.4, 1.22]])}>
          <AptDoorFromHall t={T} open={open}>
            <g style={{filter: `brightness(${0.25 + step * 0.35})`}}>
              <Bia t={T} x={540} y={1500 + step * 280} scale={0.95 + step * 0.18} expr="worried" run={step > 0 && step < 1 ? 0.25 : 0} lookX={-0.3} phone="L" pose={POSES.phoneL} />
            </g>
          </AptDoorFromHall>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  // flash: "a câmera estava mostrando uma GRAVAÇÃO"
  const k = t - 5.8;
  const lt = (T - 5.8) % 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${1.05 + k * 0.05})`}}>
        <CCTV t={T} label="CAM 07 · ESCADA B" clock={CLOCK0 + lt} tint={C.blue} glitch={k < 0.2 ? 0.9 : 0.25} highlightClock={1}>
          <Stairwell t={lt + 1} people={BLUE_MAN} loop={3} />
        </CCTV>
      </AbsoluteFill>
      <Stamp t={k - 0.15} text="⟲ GRAVAÇÃO" color={C.red} x={540} y={820} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 2 — A LIGAÇÃO (7–17,6s) ───────── */
export const S2: React.FC = () => {
  const t = useT();
  const T = scene('s2_ligacao').start + t;
  const hall = (z: number, cy: number, el: React.ReactNode, cx = 540) => (
    <SvgCamera cx={cx} cy={cy} zoom={z}>
      <Hallway t={T} light={0.75}>{el}</Hallway>
    </SvgCamera>
  );
  if (t < 1.6) {
    const vib = Math.sin(T * 70) * 2;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {hall(kf(t, [[0, 1.25], [1.6, 1.45]]), 1150, <Bia t={T} x={540 + vib} y={1720} scale={1.05} phone="both" phoneLit expr="surprised" lookY={0.5} />)}
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 2.4) {
    const k = t - 1.6;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540 + Math.sin(T * 70) * (k < 0.5 ? 5 : 0)} y={980} w={780} h={1520} rot={-2} hands={false}>
          {k < 0.55 ? <IncomingCall t={T} name="VOCÊ" avatar={<BiaAvatar t={T} />} /> : <CallScreen t={T} name="VOCÊ" seconds={0} avatar={<BiaAvatar t={T} />} />}
          <ThumbAnswer t={k} />
        </Phone>
      </AbsoluteFill>
    );
  }
  if (t < 5.2) {
    const k = t - 2.4;
    const pose = mixPose(POSES.phoneL, POSES.phoneEar, tw(k, 0, 0.4, 0, 1, ease.out));
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {hall(kf(k, [[0, 1.5], [2.8, 1.75]]), kf(k, [[0, 1150], [2.8, 1080]]), <Bia t={T} x={540} y={1720} scale={1.05} pose={pose} phone="L" expr="confused" lookX={-0.4} />)}
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 9.2) {
    const k = t - 5.2;
    const fear = k > 2.6;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {hall(kf(k, [[0, 2.6], [2.4, 2.9], [2.6, 3.4, ease.expo], [4, 3.6]]), kf(k, [[0, 1000], [2.6, 960]]), <Bia t={T} x={540} y={1720} scale={1.05} pose={POSES.phoneEar} phone="L" expr={fear ? 'fear' : 'confused'} lookX={fear ? 0.2 : -0.6} pupil={fear ? 0.7 : 1} />)}
        <Vignette strength={0.65} />
      </AbsoluteFill>
    );
  }
  if (t < 10.0) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540} y={980} w={780} h={1520} rot={-2}>
          <CallScreen t={T} name="VOCÊ" seconds={7} ended avatar={<BiaAvatar t={T} />} />
        </Phone>
        <Glitch amount={t < 9.4 ? 0.6 : 0} seed={21} />
      </AbsoluteFill>
    );
  }
  const k = t - 10.0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {hall(1.6, 1120, <Bia t={T} x={540} y={1720} scale={1.05} phone="both" phoneLit expr="confused" lookY={0.6} />)}
      <Vignette strength={0.6} />
      <Flash amount={tw(k, 0, 0.1, 0.0, 0)} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 3 — A DESCIDA (17,6–26,4s) ───────── */
export const S3: React.FC = () => {
  const t = useT();
  const T = scene('s3_descida').start + t;
  if (t < 1.6) {
    // empurra a porta corta-fogo
    const open = tw(t, 0.15, 0.9, 0, 1, ease.out);
    const walkIn = tw(t, 0.8, 1.6, 0, 1);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1100} zoom={kf(t, [[0, 1.15], [1.6, 1.35]])} {...cs(t, 0.1, 12, 0.3)}>
          <StairDoor t={T} open={open}>
            <Bia t={T} x={540} y={1800 - walkIn * 260} scale={1.12 - walkIn * 0.2} facing="back" pose={walkIn > 0 ? POSES.idle : POSES.push} run={walkIn > 0 && walkIn < 1 ? 0.3 : 0} />
          </StairDoor>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  // descida em corte lateral: corrimão na mão; para ao ouvir a voz (21,6s)
  const stopT = 21.75;
  const walking = T < stopT;
  const u = walking ? tw(T, 19.2, stopT, 0, 0.62, ease.linear) : 0.62;
  const p = STAIR.flightA(0, u);
  const sc = 0.62;
  const rail = {rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 48, nEl: -6, nHand: 'grip' as const, fSh: 20, fEl: 20, lean: walking ? 6 : 2};
  if (t < 5.8) {
    const z = walking ? 1.55 : kf(T, [[stopT, 1.55], [stopT + 0.25, 2.3, ease.expo], [23.4, 2.45]]);
    const sh = shake(T, 21.6, 16, 0.35, 31);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={p.x} cy={p.y - 300} zoom={z} sx={sh.x} sy={sh.y}>
          <StairSection t={T} floorTop={7} floors={3} light={0.7}>
            <Bia t={T} x={p.x} y={p.y} scale={sc} facing="side" dir={-1} walk={walking ? 1 : 0} pose={rail} expr={walking ? 'worried' : 'shock'} lookY={walking ? 0.3 : 0.9} />
          </StairSection>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  // close no rosto paralisado, olhando para baixo
  const k = t - 5.8;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={kf(k, [[0, 1050], [2.6, 990]])} zoom={kf(k, [[0, 2.1], [2.6, 2.5]])}>
        <Landing t={T} floor={6} light={0.75}>
          <Bia t={T} x={540} y={1760} scale={1.0} expr="fear" lookY={1} lookX={0.2} phone="L" pose={POSES.phoneL} tremble={0.4} />
        </Landing>
      </SvgCamera>
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 4 — O HOMEM DO VÍDEO (26,4–35,6s) ───────── */
export const S4: React.FC = () => {
  const t = useT();
  const T = scene('s4_homem').start + t;
  if (t < 1.6) {
    // debruça no corrimão para olhar o vão
    const lean = tw(t, 0, 0.8, 2, 22, ease.inOut);
    const p = STAIR.flightA(0, 0.62);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={p.x - 40} cy={p.y - 260} zoom={kf(t, [[0, 2.2], [1.6, 2.5]])}>
          <StairSection t={T} floorTop={7} floors={3} light={0.65}>
            <Bia t={T} x={p.x} y={p.y} scale={0.62} facing="side" dir={-1} pose={{rSh: 0, rEl: 0, lSh: 0, lEl: 0, nSh: 62, nEl: -20, nHand: 'grip', fSh: 50, fEl: -10, fHand: 'grip', lean}} expr="worried" lookY={1} />
          </StairSection>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  const gap = (z: number, look: number, extra?: React.ReactNode) => (
    <SvgCamera cx={540} cy={1000} zoom={z}>
      <StairGap t={T} bottom={<g>
        <Man t={T} x={540} y={1040} scale={0.075} lookY={-1} lookX={look} expr="worried" pose={{rSh: 10, rEl: 10, lSh: 10, lEl: 10}} />
        {extra}
      </g>} />
    </SvgCamera>
  );
  if (t < 2.4) {
    const k = t - 1.6;
    return <AbsoluteFill style={{background: '#000'}}>{gap(kf(k, [[0, 1.0], [0.8, 1.6]]), 0)}<Vignette strength={0.7} /></AbsoluteFill>;
  }
  if (t < 3.2) {
    // flash da gravação: é a mesma roupa
    const lt = 1.4;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: 'scale(1.6)', transformOrigin: '60% 45%'}}>
          <CCTV t={T} label="CAM 07 · ESCADA B" clock={CLOCK0 + lt} tint={C.blue} glitch={0.35}>
            <Stairwell t={lt} people={BLUE_MAN} loop={3} />
          </CCTV>
        </AbsoluteFill>
        <Stamp t={t - 2.45} text="MESMA ROUPA" color={C.yellow} x={540} y={1180} size={0.7} />
      </AbsoluteFill>
    );
  }
  if (t < 4.8) {
    const k = t - 3.2;
    return <AbsoluteFill style={{background: '#000'}}>{gap(kf(k, [[0, 1.8], [1.6, 4.2, ease.inOut]]), 0.2)}<Vignette strength={0.7} /></AbsoluteFill>;
  }
  if (t < 7.9) {
    // o homem olha para cima e implora (contra-plongée invertida: vemos de cima)
    const k = t - 4.8;
    const plead = 0.5 + 0.5 * Math.sin(T * 5);
    const pose = mixPose(
      {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -95, y: -600}, lT: {x: 95, y: -600}, rFs: 0.7, lFs: 0.7, rHand: 'open', lHand: 'open', rHandRot: 170, lHandRot: -170},
      {rSh: 0, rEl: 0, lSh: 0, lEl: 0, rT: {x: -120, y: -660}, lT: {x: 120, y: -660}, rFs: 0.8, lFs: 0.8, rHand: 'open', lHand: 'open', rHandRot: 175, lHandRot: -175},
      plead);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={kf(k, [[0, 1180], [3.1, 1080]])} zoom={kf(k, [[0, 1.55], [3.1, 1.85]])} rot={-4}>
          <Landing t={T} floor={5} light={0.7}>
            <Man t={T} x={540} y={1800} scale={1.0} pose={pose} expr="worried" lookY={-1} mouth={mouthOf('HOMEM', T, 1.8)} />
          </Landing>
        </SvgCamera>
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  const k = t - 7.9;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={990} zoom={kf(k, [[0, 2.4], [1.3, 2.6]])}>
        <Landing t={T} floor={6} light={0.75}>
          <Bia t={T} x={540} y={1760} scale={1.0} expr="suspicious" lookY={0.9} phone="L" pose={POSES.phoneL} />
        </Landing>
      </SvgCamera>
      <Vignette strength={0.65} />
    </AbsoluteFill>
  );
};
