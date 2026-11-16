import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ElevatorHall, CabInterior, PanelClose, IntercomClose, DoorsInside, BagItems, NotebookPage, LobbyFeed, Backpack, EV} from '../../sets/ElevatorSets';
import {Bia, POSES} from '../../characters/Bia';
import {Hand} from '../../characters/Person';
import {Phone, CCTV, VoteCard} from '../../ui/UI';
import {SvgCamera, Vignette, Glitch} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp, rnd, shake} from '../../lib/anim';
import {useT, mouthOf, voiceEnv} from './shared';

/**
 * EP. 2B — "O ELEVADOR NÃO VAI PARA O TÉRREO" (Rota B). Planos fixos + cortes.
 * Bia: corredor do 7º → entra no elevador → cabine para no 6º. Mochila vermelha (EP. 1) no canto.
 */
const VIG = 0.28;
const LIVE = 23 * 3600 + 49 * 60 + 40;
const cs = (t: number, t0: number, amp: number, dur: number, seed = 1) => { const s = shake(t, t0, amp, dur, seed); return {sx: s.x, sy: s.y}; };

const PhoneShot: React.FC<{children: React.ReactNode; T: number; vib?: boolean; glow?: string}> = ({children, T, vib = false, glow}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)'}}>
    <Phone x={540 + (vib ? Math.sin(T * 70) * 4 : 0)} y={980} w={800} h={1560} glow={glow}>{children}</Phone>
  </AbsoluteFill>
);
const DigitalText: React.FC<{t: number; text: string; size: number; color?: string; delay?: number}> = ({t, text, size, color = C.red, delay = 0}) => {
  const k = t - delay;
  const n = Math.max(delay === 0 ? 3 : 0, Math.floor(clamp(k / 0.5) * text.length));
  const jit = k < 0.6 ? (rnd(`dj${Math.floor(k * 30)}${text}`) - 0.5) * 8 : 0;
  return <div style={{fontFamily: FONT.mono, fontSize: size, color, letterSpacing: 2, transform: `translateX(${jit}px)`, textShadow: `0 0 18px ${color}88`, minHeight: size * 1.2}}>{text.slice(0, n)}</div>;
};
const HackerMsg: React.FC<{t: number; text: string}> = ({t, text}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0b0d14', paddingTop: 460, boxSizing: 'border-box', textAlign: 'center'}}>
    <div style={{fontFamily: FONT.mono, fontSize: 34, color: '#8a94a8', letterSpacing: 3}}>MENSAGEM · DESCONHECIDO</div>
    <div style={{margin: '40px 50px 0', background: 'rgba(255,45,61,0.12)', border: `4px solid ${C.red}`, borderRadius: 30, padding: '40px 30px', fontFamily: FONT.title, fontSize: 70, color: '#fff', lineHeight: 1.12, opacity: clamp((t - 0.2) * 5)}}>{text}</div>
  </div>
);
/** imagem FABRICADA da CAM 04: Bia saindo do elevador na portaria (quadro único com deriva de câmera) */
const FakeLobby: React.FC<{T: number; drift: number; glitch?: number}> = ({T, drift, glitch = 0.06}) => (
  <CCTV t={T} label="CAM 04 — PORTARIA" clock={LIVE + Math.floor(T - 32)} tint="#4a7dff" glitch={glitch}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + drift * 0.05}) translateX(${drift * -12}px)`}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <LobbyFeed><Bia t={0.6} x={430} y={1560} scale={0.62} facing="back" /></LobbyFeed>
      </svg>
    </div>
    <div style={{position: 'absolute', right: 24, top: 70, background: C.red, color: '#fff', fontFamily: FONT.mono, fontSize: 34, padding: '4px 14px', borderRadius: 8}}>● AO VIVO</div>
  </CCTV>
);

/** cabine: plano geral ou close, sempre com Bia na posição fixa */
const Cab: React.FC<{T: number; cx?: number; cy?: number; z?: number; light?: number; floor?: string; expr?: any; lookX?: number; lookY?: number; pose?: any; phoneLit?: boolean; tremble?: number; red?: number; bagOpen?: number; sh?: {sx: number; sy: number}; biaY?: number}> =
  ({T, cx = 540, cy = 1060, z = 1, light = 1, floor = '7', expr = 'worried', lookX = 0, lookY = 0, pose = POSES.phoneL, phoneLit = false, tremble = 0, red = 0, bagOpen = 0, sh, biaY}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z} {...(sh ?? {})}>
    <CabInterior light={light} floor={floor} red={red} bag={<Backpack x={EV.bag.x} y={EV.bag.y} open={bagOpen} />}>
      <Bia t={T} x={EV.bia.x} y={biaY ?? EV.bia.y} scale={EV.bia.s} pose={pose} phone="L" phoneLit={phoneLit} expr={expr} lookX={lookX} lookY={lookY} tremble={tremble} mouth={mouthOf('BIA', T, 1.2)} />
    </CabInterior>
  </SvgCamera>
);
const flick = (T: number) => {
  if (T < 23.7 || T > 25.4) return 1;
  const s = Math.sin(T * 41) + Math.sin(T * 97) * 0.7;
  return s > 0.5 ? 1 : s > -0.4 ? 0.45 : 0.12;
};

/* ───────── CENA 1 — A ESCOLHA (0–10,4s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  if (t < 3.0) {
    return (
      <PhoneShot T={T}>
        <div style={{position: 'absolute', inset: 0, background: '#05070c', padding: '560px 30px 0', boxSizing: 'border-box', textAlign: 'center'}}>
          <DigitalText t={t} text="VOTAÇÃO ENCERRADA" size={72} />
          <div style={{height: 50}} />
          <DigitalText t={t} text="ELEVADOR ESCOLHIDO" size={78} delay={0.9} color="#ff4b57" />
        </div>
      </PhoneShot>
    );
  }
  if (t < 8.0) {
    // o elevador chega; as portas abrem devagar; Bia (no corredor) respira e fala
    const open = tw(T, 4.0, 5.6, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(t, [[3, 620], [8, 660]])} cy={1060} zoom={kf(t, [[3, 1.08], [8, 1.16]])}>
          <ElevatorHall open={open} floor={T < 3.4 ? 8 : 7} arrow={T < 3.4}>
            <Bia t={T} x={900} y={1500} scale={0.95} pose={POSES.phoneL} phone="L" expr="worried" lookX={-0.7} mouth={mouthOf('BIA', T, 1.2)} />
          </ElevatorHall>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  // corte: ela já está dentro da cabine; as portas se fecham
  const open = tw(T, 8.6, 10.2, 1, 0, ease.inOut);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={540} cy={1040} zoom={1.15}>
        <ElevatorHall open={open} floor={7} inside={<Bia t={T} x={540} y={1470} scale={0.82} pose={POSES.phoneL} phone="L" expr="worried" />} />
      </SvgCamera>
      <Vignette strength={VIG} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 2 — A MOCHILA (10,4–20,8s) ───────── */
export const S2: React.FC = () => {
  const t = useT(); const T = 10.4 + t;
  if (t < 2.4) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1100} zoom={1.0}><PanelClose floor="7" pressed={T > 11.2} finger={tw(T, 10.6, 11.2, 0, 1, ease.out) * (T < 12.2 ? 1 : tw(T, 12.2, 12.8, 1, 0))} /></SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 4.8) return <AbsoluteFill style={{background: C.bg}}><Cab T={T} z={kf(t, [[2.4, 1.0], [4.8, 1.06]])} expr="confused" lookX={T > 13.0 ? -0.8 : 0} lookY={T > 13.0 ? 0.9 : 0} /><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 7.2) {
    // ela se aproxima (corte): close na mochila e na etiqueta
    return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bag.x + 40} cy={EV.bag.y - 120} z={kf(t, [[4.8, 3.6], [7.2, 3.9]])} /><Vignette strength={VIG} /></AbsoluteFill>;
  }
  if (t < 9.2) return <PhoneShot T={T} vib={t < 7.8} glow={C.red}><HackerMsg t={t - 7.2} text="NÃO TOQUE NA MOCHILA." /></PhoneShot>;
  return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x} cy={830} z={2.6} expr="fear" lookY={0.6} phoneLit /><Vignette strength={VIG} /></AbsoluteFill>;
};

/* ───────── CENA 3 — O PRIMEIRO ERRO (20,8–32,6s) ───────── */
export const S3: React.FC = () => {
  const t = useT(); const T = 20.8 + t;
  if (t < 2.8) {
    return <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={700} zoom={1.25}><PanelClose floor={T < 22.4 ? '7' : '6'} arrow pressed /></SvgCamera><Vignette strength={VIG} /></AbsoluteFill>;
  }
  if (t < 6.0) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <Cab T={T} z={1.05} light={flick(T)} floor="6" expr="shock" lookY={T < 24.4 ? -0.8 : 0.2} tremble={0.6} sh={cs(T, 23.7, 26, 0.5, 3)} />
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 7.2) return <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={420} zoom={2.0}><PanelClose floor="6" /></SvgCamera></AbsoluteFill>;
  if (t < 9.0) return <PhoneShot T={T} vib={t < 7.7} glow={C.red}><HackerMsg t={t - 7.2} text="VOCÊ JÁ CHEGOU AO TÉRREO." /></PhoneShot>;
  return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x + 20} cy={830} z={kf(t, [[9, 2.5], [11.8, 2.7]])} floor="6" expr="confused" lookX={0.8} /><Vignette strength={VIG} /></AbsoluteFill>;
};

/* ───────── CENA 4 — A CÂMERA MENTIU (32,6–45,6s) ───────── */
export const S4: React.FC = () => {
  const t = useT(); const T = 32.6 + t;
  if (t < 3.4) return <PhoneShot T={T} vib={t < 0.5}><FakeLobby T={T} drift={t / 3.4} glitch={t < 0.3 ? 0.3 : 0.06} /></PhoneShot>;
  if (t < 6.6) return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x} cy={850} z={kf(t, [[3.4, 2.4], [6.6, 2.6]])} floor="6" expr="shock" lookY={0.6} phoneLit /><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 9.8) return <PhoneShot T={T}><FakeLobby T={T} drift={1 + (t - 6.6) / 3.2} /></PhoneShot>;
  return <AbsoluteFill style={{background: C.bg}}><Cab T={T} z={kf(t, [[9.8, 1.0], [13, 1.08]])} floor="6" expr="worried" lookX={-0.4} lookY={0.4} /><Vignette strength={VIG} /></AbsoluteFill>;
};

/* ───────── CENA 5 — A PROVA (45,6–57s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 45.6 + t;
  if (t < 2.8) {
    // ela abre a mochila (close: mão na aba, que se abre)
    const open = tw(T, 46.0, 47.4, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={EV.bag.x} cy={EV.bag.y - 120} zoom={3.4}>
          <CabInterior floor="6" bag={<Backpack x={EV.bag.x} y={EV.bag.y} open={open} tag />}>
            <Hand x={EV.bag.x - 30 + open * 10} y={EV.bag.y - 190 - open * 40} rot={170} shape="grip" skin={C.skin} shade={C.skinShade} size={1.6} />
          </CabInterior>
        </SvgCamera>
        <Vignette strength={VIG} />
      </AbsoluteFill>
    );
  }
  if (t < 5.4) return <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={1060} zoom={kf(t, [[2.8, 1.0], [5.4, 1.05]])}><BagItems /></SvgCamera><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 8.0) return <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={kf(t, [[5.4, 760], [8, 1050]])} zoom={1.15}><NotebookPage reveal={tw(T, 51.1, 53.2, 0, 1, ease.linear)} /></SvgCamera></AbsoluteFill>;
  return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x} cy={840} z={kf(t, [[8, 2.4], [11.4, 2.6]])} floor="6" expr="worried" lookY={0.7} /><Vignette strength={VIG} /></AbsoluteFill>;
};

/* ───────── CENA 6 — O INTERFONE (57–71,6s) ───────── */
export const S6: React.FC = () => {
  const t = useT(); const T = 57 + t;
  const lvl = voiceEnv('INTERFONE', T);
  const icom = (led: 'green' | 'red' | 'off', z: number) => <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={980} zoom={z}><IntercomClose led={led} level={lvl} /></SvgCamera><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 3.6) return icom(T > 56.9 ? 'green' : 'off', kf(t, [[0, 1.0], [3.6, 1.06]]));
  if (t < 7.6) return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x + 30} cy={850} z={2.4} floor="6" expr="suspicious" lookX={0.9} /><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 9.6) return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x} cy={830} z={2.7} floor="6" expr="suspicious" lookX={0.7} /><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 12.8) return icom('green', kf(t, [[9.6, 1.05], [12.8, 1.25]]));
  // olha de novo para o crachá do Davi (na mão)
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2a3045, #0b0e15 75%)'}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform="translate(390,620) rotate(-6)">
          <rect x={0} y={0} width={300} height={400} rx={20} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={6} />
          <rect x={20} y={20} width={260} height={70} rx={10} fill="#2f6fd6" />
          <text x={150} y={70} fontSize={40} textAnchor="middle" fontFamily={FONT.title} fill="#fff">MANUTENÇÃO</text>
          <circle cx={150} cy={190} r={60} fill="#c9cfdb" />
          <text x={150} y={330} fontSize={70} textAnchor="middle" fontFamily={FONT.title} fill="#1a1f2e">DAVI</text>
        </g>
        <path d="M430,1960 L470,1150 Q540,1080 640,1150 L700,1960 Z" fill={C.skin} />
        <ellipse cx={555} cy={1080} rx={120} ry={95} fill={C.skin} />
        <rect x={430} y={1000} width={70} height={110} rx={35} fill={C.skin} transform="rotate(-20 465 1055)" />
        <rect x={610} y={990} width={64} height={120} rx={32} fill={C.skin} transform="rotate(15 642 1050)" />
        <path d="M470,1110 Q555,1150 640,1110" stroke={C.skinShade} strokeWidth={8} fill="none" />
      </svg>
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

/* ───────── CENA 7 — ALGUÉM DO OUTRO LADO (71,6–81,6s) ───────── */
export const S7: React.FC = () => {
  const t = useT(); const T = 71.6 + t;
  const knock = (T > 71.6 && T < 72.6) || (T > 75.4 && T < 76.4) ? 1 : 0;
  const doors = (z: number) => <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={1000} zoom={z} {...cs(T, knock ? Math.floor(T * 3.6) / 3.6 : -9, 10, 0.2, 7)}><DoorsInside t={T} shake={knock} feet={1} /></SvgCamera><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 2.0) return doors(1.0);
  if (t < 3.8) return <AbsoluteFill style={{background: C.bg}}><Cab T={T} cx={EV.bia.x} cy={830} z={2.6} floor="6" expr="fear" lookY={-0.1} /><Vignette strength={VIG} /></AbsoluteFill>;
  if (t < 7.0) return doors(kf(t, [[3.8, 1.05], [7, 1.15]]));
  if (t < 8.6) return <AbsoluteFill style={{background: C.bg}}><SvgCamera cx={540} cy={980} zoom={1.15}><IntercomClose led="red" level={voiceEnv('INTERFONE', T)} /></SvgCamera><Vignette strength={VIG} /></AbsoluteFill>;
  // ela recua (corte): encostada no fundo da cabine
  return <AbsoluteFill style={{background: C.bg}}><Cab T={T} z={1.05} floor="6" expr="fear" pose={POSES.hugSelf} biaY={EV.bia.y - 30} tremble={0.6} /><Vignette strength={VIG} /></AbsoluteFill>;
};

/* ───────── CENA 8 — A DECISÃO (81,6–94s) ───────── */
export const S8: React.FC = () => {
  const t = useT(); const T = 81.6 + t;
  if (t < 9.0) {
    const split = tw(t, 0, 0.4, 0, 1, ease.expo);
    const kA = tw(T, 82.0, 82.35, 0, 1, ease.back), kB = tw(T, 82.2, 82.55, 0, 1, ease.back);
    const aAct = T > 84.6 && T < 86.4 ? 1 : 0, bAct = T > 82.4 && T < 84.4 ? 1 : 0;
    const cta = tw(T, 88.6, 88.95, 0, 1, ease.back);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * -1920}px)`}}>
          <svg viewBox="270 0 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice"><DoorsInside t={T} feet={1} /></svg>
          <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.45}} />
        </div>
        <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * 1920}px)`}}>
          <svg viewBox="270 0 540 1920" width={540} height={1920} style={{position: 'absolute'}} preserveAspectRatio="xMidYMid slice"><IntercomClose led="red" level={0.2} /></svg>
          <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.35}} />
        </div>
        <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
        <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 28%, transparent 62%, rgba(0,0,0,0.7))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', opacity: split}}>
          <span style={{display: 'inline-block', background: 'rgba(5,7,12,0.92)', border: '3px solid #fff', borderRadius: 18, padding: '10px 26px', fontFamily: FONT.title, color: '#fff', fontSize: 44, letterSpacing: 2}}>VOCÊ DECIDE O DESTINO DE BIA</span>
        </div>
        <VoteCard letter="A" text="CONFIAR NA VOZ DO LADO DE FORA" color={C.blue} x={30} y={760} w={490} k={kA} active={aAct} />
        <VoteCard letter="B" text="OBEDECER À CENTRAL DE SEGURANÇA" color={C.red} x={560} y={760} w={490} k={kB} active={bAct} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', transform: `scale(${cta})`, opacity: clamp(cta * 2)}}>
          <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 70, padding: '10px 36px', borderRadius: 22}}>
            COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>!
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < 12.2) {
    // último segundo: a voz de fora grita, a porta treme — corte seco
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={540} cy={1000} zoom={kf(t, [[9, 1.1], [12.2, 1.35]])} {...cs(T, 90.6, 16, 0.6, 9)}><DoorsInside t={T} shake={T < 91.6 ? 1 : 0.3} feet={1} /></SvgCamera>
        <Vignette strength={VIG} />
        <Glitch amount={T > 93.6 ? 0.6 : 0} seed={92} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: '#000'}} />;
};
