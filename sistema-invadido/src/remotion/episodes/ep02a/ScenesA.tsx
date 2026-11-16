import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Apartment, APT} from '../../sets/Apartment';
import {AptDoorFromHall} from '../../sets/Stairs';
import {LandingSet, FireDoor, FeetOnSteps, LS} from '../../sets/Landings';
import {Resident, ResidentLook} from '../../characters/Resident';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';
import {Phone, CCTV, IncomingCall} from '../../ui/UI';
import {CallScreen, ThumbAnswer} from '../../ui/PhoneScreens';
import {SvgCamera, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, rnd, clamp} from '../../lib/anim';
import {useT, mouthOf, BiaAvatar} from './shared';

/**
 * EP. 2A — "A CÂMERA MENTIU". Planos fixos + cortes; nenhuma caminhada animada.
 * Bia: 7º andar (corredor → patamar do 7º) → desce UM lance → patamar do 6º (posição fixa LS.bia).
 */
export const VIG = 0.28;
const DARK: ResidentLook = {shirt: '#1b2029', pants: '#141821', skin: '#232934', hair: '#10131a', hairStyle: 'short'};
export const REC_CLOCK = 22 * 3600 + 46 * 60 + 57; // 22:46:57 — horário congelado da gravação

/** fundo de tela de celular centralizada (sem mãos) */
const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);

/** texto vermelho com pequeno efeito digital (letras surgem + leve tremida) */
const DigitalText: React.FC<{t: number; text: string; size: number; color?: string; delay?: number}> = ({t, text, size, color = C.red, delay = 0}) => {
  const k = t - delay;
  const n = Math.max(delay === 0 ? 3 : 0, Math.floor(clamp(k / 0.5) * text.length));
  const jit = k < 0.6 ? (rnd(`dj${Math.floor(k * 30)}${text}`) - 0.5) * 8 : 0;
  return (
    <div style={{fontFamily: FONT.mono, fontSize: size, color, letterSpacing: 2, transform: `translateX(${jit}px)`, textShadow: `0 0 18px ${color}88`, minHeight: size * 1.2}}>
      {text.slice(0, n)}{k > 0 && k < 0.7 && <span style={{opacity: 0.6}}>█</span>}
    </div>
  );
};

/** feed da câmera (mesmo enquadramento do patamar real) */
export const LandingFeed: React.FC<{T: number; floor: 6 | 7; people?: React.ReactNode; doorOpen?: number}> = ({floor, people, doorOpen = 0}) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
    <LandingSet floor={floor} flightPeople={people} doorOpen={doorOpen} />
  </svg>
);

/** três silhuetas descendo o lance curto em loop (gravação) */
export const LoopPeople: React.FC<{T: number}> = ({T}) => {
  const L = 2.4;
  return (
    <g>
      {[0, 0.8, 1.6].map((ph, i) => {
        const u = ((T + ph) % L) / L;
        const x = 640 + u * 460, y = LS.floorY + Math.max(0, u * 460 - 120) * (62 / 52);
        return <Resident key={i} t={(T + ph) % L} look={DARK} action="walk" dir={1} x={x} y={y} scale={2.0} />;
      })}
    </g>
  );
};

/** corredor do 7º com a porta da escada (lado do corredor) */
const CorridorStairDoor: React.FC<{children?: React.ReactNode; open?: number}> = ({children, open = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#1c2540" />
    <rect x={-300} y={LS.floorY} width={1680} height={800} fill="#141b30" />
    <rect x={430} y={150} width={220} height={26} rx={8} fill="#dfe7f5" opacity={0.6} />
    <rect x={100} y={420} width={360} height={60} rx={8} fill="#16a34a" />
    <text x={280} y={462} fontSize={30} textAnchor="middle" fontFamily={FONT.title} fill="#eafff0">SAÍDA DE EMERGÊNCIA</text>
    <FireDoor open={open} label="7" toward={false} inside="#0c111c" />
    {children}
  </g>
);

/* ───────── CENA 1 — A ESCOLHA FOI FEITA (0–8s) ───────── */
export const S1: React.FC = () => {
  const t = useT();
  const T = t;
  if (t < 3.2) {
    return (
      <PhoneShot T={T}>
        <div style={{position: 'absolute', inset: 0, background: '#05070c', padding: '560px 30px 0', boxSizing: 'border-box', textAlign: 'center'}}>
          <DigitalText t={t} text="VOTAÇÃO ENCERRADA" size={72} delay={0} />
          <div style={{height: 50}} />
          <DigitalText t={t} text="ROTA A LIBERADA" size={84} delay={0.9} color="#ff4b57" />
        </div>
      </PhoneShot>
    );
  }
  if (t < 5.6) {
    const unlocked = T > 4.1;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={APT.lock.x} cy={APT.lock.y - 10} zoom={kf(t, [[3.2, 5.2], [5.6, 5.5, ease.linear]])}>
          <Apartment t={T} light={0.9} locked={!unlocked} />
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 7.6) {
    // Bia de frente para a porta (de costas para a câmera), celular na mão, mão na maçaneta
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={1420} cy={1000} zoom={1.9}>
          <Apartment t={T} light={0.9}>
            <Bia t={T} x={1360} y={1352} scale={0.95} facing="back"
              pose={{...POSES.idle, lT: {x: (APT.handle.x + 30 - 1360) / 0.95, y: (APT.handle.y - 1352) / 0.95}, lHand: 'grip', rSh: 8, rEl: 20}} />
          </Apartment>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // corte: lado do corredor — a porta abre e ela olha para o corredor
  const open = tw(T, 7.6, 8.4, 0.35, 1, ease.out);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={1060} zoom={1.25}>
        <AptDoorFromHall t={T} open={open}>
          <Bia t={T} x={540} y={1500} scale={0.95} phone="L" pose={POSES.phoneL} expr="worried" lookX={tw(T, 8.8, 9.2, 0, -0.8, ease.inOut)} />
        </AptDoorFromHall>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 2 — A LIGAÇÃO MISTERIOSA (8–17s) ───────── */
const AT_DOOR = {x: 700, y: 1470, s: 1.0};
export const S2: React.FC = () => {
  const t = useT();
  const T = 10 + t;
  const atDoor = (pose: Pose, expr: any, z: number, cx: number, cy: number, extra: Partial<React.ComponentProps<typeof Bia>> = {}) => (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={cx} cy={cy} zoom={z}>
        <CorridorStairDoor><Bia t={T} x={AT_DOOR.x} y={AT_DOOR.y} scale={AT_DOOR.s} pose={pose} phone="L" expr={expr} {...extra} /></CorridorStairDoor>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
  if (t < 2.0) return atDoor(POSES.phoneL, t < 0.6 ? 'neutral' : 'surprised', kf(t, [[0, 1.15], [2, 1.22]]), 560, 1060, {phoneLit: t > 0.4, lookY: t > 0.6 ? 0.6 : 0, tremble: t > 0.4 ? 0.15 : 0});
  if (t < 4.2) {
    const k = t - 2.0;
    return (
      <PhoneShot T={T} vib={k < 1.1}>
        {k < 1.2 ? <IncomingCall t={T} name="VOCÊ" avatar={<BiaAvatar t={T} />} /> : <CallScreen t={T} name="VOCÊ" seconds={0} avatar={<BiaAvatar t={T} />} />}
        <ThumbAnswer t={(k - 0.7) * 0.8} />
      </PhoneShot>
    );
  }
  if (t < 7.4) {
    // leva o celular ao ouvido (um movimento) e fica parada
    return atDoor(mixPose(POSES.phoneL, POSES.phoneEar, tw(T, 14.2, 14.7, 0, 1, ease.inOut)), 'surprised', kf(t, [[4.2, 1.4], [7.4, 1.5]]), 640, 1000);
  }
  if (t < 9.8) {
    // close: sobrancelhas franzidas, olhos arregalados — "Quem tá falando?"
    return atDoor(POSES.phoneEar, 'fear', kf(t, [[7.4, 2.6], [9.8, 2.75]]), AT_DOOR.x, 770, {mouth: mouthOf('BIA', T, 1.2)});
  }
  if (t < 11.0) {
    return <PhoneShot T={T}><CallScreen t={T} name="VOCÊ" seconds={4} ended avatar={<BiaAvatar t={T} />} /></PhoneShot>;
  }
  // olha para a porta, hesita e coloca a mão na maçaneta (de costas, uma vez)
  const reach = tw(T, 21.6, 22.2, 0, 1, ease.inOut);
  const lever = {x: LS.door.x + LS.door.w - 70, y: LS.door.y + 421};
  const bx = 250;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={330} cy={1060} zoom={1.45}>
        <CorridorStairDoor>
          <Bia t={T} x={bx} y={1470} facing="back" pose={mixPose(POSES.idle, {...POSES.idle, lT: {x: lever.x - bx + 20, y: lever.y - 1470}, lHand: 'grip'}, reach)} />
        </CorridorStairDoor>
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 3 — AS CÂMERAS ESTÃO MENTINDO (17–27,4s) ───────── */
export const S3: React.FC = () => {
  const t = useT();
  const T = 23 + t;
  if (t < 2.0) {
    // abre a porta da escada (a porta abre para dentro da escada, longe da câmera)
    const lever = {x: LS.door.x + LS.door.w - 70, y: LS.door.y + 421};
    const open = tw(T, 23.4, 24.4, 0, 0.9, ease.out);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={330} cy={1060} zoom={1.45}>
          <CorridorStairDoor open={open}>
            <Bia t={T} x={250} y={1470} facing="back" pose={{...POSES.idle, lT: {x: lever.x - 250 + 20 - open * 120, y: lever.y - 1470}, lHand: 'grip'}} />
          </CorridorStairDoor>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  const real = (z: number) => (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={620} cy={1150} zoom={z}><LandingSet floor={7} doorOpen={0.3} doorInside="#24314f" /></SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
  if (t < 4.8) return real(kf(t, [[2.0, 1.0], [4.8, 1.04]]));
  if (t < 8.6) {
    // no celular: CAM 07 — ESCADA, 22:46:57 congelado, três silhuetas descendo em loop
    return (
      <PhoneShot T={T}>
        <CCTV t={T} label="CAM 07 — ESCADA" clock={REC_CLOCK} tint={C.blue}>
          <LandingFeed T={T} floor={7} people={<LoopPeople T={T} />} />
        </CCTV>
      </PhoneShot>
    );
  }
  // de volta ao MESMO enquadramento real: vazio
  return real(kf(t, [[8.6, 1.0], [12.4, 1.1]]));
};

/* ───────── CENA 4 — O CAMINHO BLOQUEADO (27,4–37s) ───────── */
export const S4: React.FC = () => {
  const t = useT();
  const T = 35.4 + t;
  if (t < 3.4) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(t, [[0, 520], [3.4, 740]])} cy={kf(t, [[0, 900], [3.4, 1070]])} zoom={1.0}><FeetOnSteps t={t + 0.0} /></SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  const landing = (cx: number, cy: number, z: number, bia: React.ReactNode) => (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={cx} cy={cy} zoom={z}><LandingSet floor={6} gate>{bia}</LandingSet></SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
  const B = (expr: any, extra: Partial<React.ComponentProps<typeof Bia>> = {}) => <Bia t={T} x={LS.bia.x} y={LS.bia.y} scale={LS.bia.s} phone="L" pose={POSES.phoneL} expr={expr} {...extra} />;
  if (t < 6.0) return landing(620, 1050, kf(t, [[3.4, 1.0], [6.0, 1.05]]), B('worried', {lookX: -0.3}));
  if (t < 8.8) {
    // olha para baixo: só o lance seguinte, fechado pela grade
    return landing(880, 1380, kf(t, [[6.0, 1.55], [8.8, 1.7]]), null);
  }
  // close no rosto: "Não… não pode ser."
  return landing(LS.bia.x, 790, kf(t, [[8.8, 2.6], [11.2, 2.8]]), B('fear', {lookY: 0.7, mouth: mouthOf('BIA', T, 1.3)}));
};
