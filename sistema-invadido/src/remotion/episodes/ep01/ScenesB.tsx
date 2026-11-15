import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Apartment, APT} from '../../sets/Apartment';
import {Stairwell, Elevator, LOOKS} from '../../sets/Building';
import {Bia, POSES} from '../../characters/Bia';
import {Phone, CCTV, MessageBubble, VoteCard, IncomingCall, Timer} from '../../ui/UI';
import {SvgCamera, Glitch, Flash, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, shake, clamp} from '../../lib/anim';
import {useT, scene, voiceEnv, remainingAt} from './shared';

const CLOCK0 = 23 * 3600 + 47 * 60 + 12;
const stairPeople = [
  {look: LOOKS.senhora, phase: 0.0, speed: 0.28},
  {look: LOOKS.rapaz, phase: 1.6, speed: 0.33},
  {look: LOOKS.senhor, phase: 3.0, speed: 0.25},
];
const BLUE_MAN = [{look: LOOKS.homemAzul, phase: 0}];

/** Bia em close com o celular iluminando o rosto */
// close-ups com a janela/cidade ao fundo (Bia perto da janela, x = 430)
const BiaClose: React.FC<{T: number; z: number; cy?: number; expr: any; lookX?: number; mouth?: number; pose?: any; light?: number; tremble?: number; pupil?: number}> = ({T, z, cy = 930, expr, lookX = 0, mouth = 0, pose = POSES.phoneBoth, light = 0.5, tremble = 0, pupil = 1}) => (
  <SvgCamera cx={430} cy={cy} zoom={z}>
    <Apartment t={T} light={light} locked lockBlink>
      <Bia t={T} x={430} y={1640} pose={pose} expr={expr} phone="L" phoneLit lookX={lookX} lookY={0.35} mouth={mouth} tremble={tremble} pupil={pupil} />
    </Apartment>
  </SvgCamera>
);

/* ───────────── CENA 5 — AS DUAS SAÍDAS (35,6–46,4s) ───────────── */
export const S5: React.FC = () => {
  const t = useT();
  const T = scene('s5_saidas').start + t;
  const clock = CLOCK0 - 20 + T - 35;
  if (t < 5.4) {
    const inL = tw(t, 0, 0.45, -600, 0, ease.expo);
    const inR = tw(t, 0.05, 0.5, 600, 0, ease.expo);
    const bad = tw(t, 3.55, 3.7, 0, 1) * tw(t, 3.7, 4.6, 1, 0.25);
    const z = kf(t, [[0, 1.0], [5.4, 1.06, ease.linear]]);
    const panel = (x: number, label: string, color: string, el: React.ReactNode, cam: string) => (
      <div style={{position: 'absolute', left: x, top: 470, width: 520, height: 900}}>
        <div style={{position: 'absolute', inset: 0, border: `5px solid ${color}`, borderRadius: 22, overflow: 'hidden', boxShadow: `0 0 40px ${color}55`}}>
          <CCTV t={T} label={cam} clock={clock} small glitch={t < 0.4 ? 0.7 : bad * 0.8} tint={color}>{el}</CCTV>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: -90, textAlign: 'center', fontFamily: FONT.title, fontSize: 50, color: '#fff'}}>
          <span style={{background: color, padding: '6px 22px', borderRadius: 14}}>{label}</span>
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontSize: 240, color: C.red, opacity: bad * 0.9, textShadow: '0 0 40px #000'}}>?</div>
      </div>
    );
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121a30, #03050a)'}}>
        <AbsoluteFill style={{transform: `scale(${z})`}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${inL}px)`}}>
            {panel(20, 'ESCADA', C.blue, <Stairwell t={T} people={stairPeople} />, 'CAM 07 · ESCADA B')}
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${inR}px)`}}>
            {panel(540, 'ELEVADOR', C.red, <Elevator t={T} open={1} floor={7} inside={Math.sin(T * 17) > 0.85 ? '#7d8698' : '#c9d4e8'} />, 'CAM 12 · ELEV. SERVIÇO')}
          </div>
        </AbsoluteFill>
        <Glitch amount={bad * 0.7} seed={5} />
        <Flash amount={bad * 0.25} color={C.red} />
      </AbsoluteFill>
    );
  }
  if (t < 7.4) {
    const k = t - 5.4;
    const lx = Math.sin(k * 5) > 0 ? 0.85 : -0.85;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <BiaClose T={T} z={kf(k, [[0, 2.3], [2, 2.6]])} expr="fear" lookX={lx} />
        <Vignette strength={0.6} />
      </AbsoluteFill>
    );
  }
  if (t < 9.4) {
    const k = t - 7.4;
    const stairs = k < 1.0;
    const slide = tw(k % 1.0, 0, 0.2, stairs ? -1080 : 1080, 0, ease.expo);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: `translateX(${slide}px) scale(${1.05 + (k % 1) * 0.06})`}}>
          {stairs ? (
            <CCTV t={T} label="CAM 07 · ESCADA B" clock={clock} tint={C.blue}><Stairwell t={T} people={stairPeople} /></CCTV>
          ) : (
            <CCTV t={T} label="CAM 12 · ELEV. SERVIÇO" clock={clock} tint={C.red}><Elevator t={T} open={1} floor={7} /></CCTV>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const k = t - 9.4;
  const sh = shake(k, 0, 20, 0.4, 9);
  return (
    <AbsoluteFill style={{background: C.bg, transform: `translate(${sh.x}px,${sh.y}px)`}}>
      <BiaClose T={T} z={kf(k, [[0, 2.3], [0.25, 2.75, ease.expo], [1.4, 2.85]])} expr="determined" lookX={0} />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 6 — A PISTA (46,4–57,6s) ───────────── */
const LOOP0 = 46.6;
const stairLoop = (T: number, glitch: number, z: number, hi = 0, noSignal = false) => {
  const lt = T < LOOP0 ? 0 : (T - LOOP0) % 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 75%'}}>
        <CCTV t={T} label="CAM 07 · ESCADA B" clock={CLOCK0 + lt} tint={C.blue} glitch={glitch} highlightClock={hi} noSignal={noSignal}>
          <Stairwell t={lt} people={BLUE_MAN} loop={3} />
        </CCTV>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const S6: React.FC = () => {
  const t = useT();
  const T = scene('s6_pista').start + t;
  if (t < 3.8) {
    const rew = T > 49.4 && T < 49.75 ? 1 : 0;
    return (
      <AbsoluteFill>
        {stairLoop(T, rew * 0.9 + (t < 0.25 ? 0.6 : 0), kf(t, [[0, 1.0], [3.8, 1.12]]), T > 49.4 ? tw(T, 49.4, 49.6, 0, 1) : 0)}
        {T > 49.4 && T < 50.2 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: FONT.mono, fontSize: 120, color: '#fff', opacity: rew ? 1 : 0.7, textShadow: '0 0 20px #000'}}>⏪</div>
        )}
      </AbsoluteFill>
    );
  }
  if (t < 6.0) {
    const k = t - 3.8;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <BiaClose T={T} z={kf(k, [[0, 2.5], [2.2, 2.9]])} cy={kf(k, [[0, 950], [2.2, 900]])} expr="suspicious" pose={POSES.phoneFace} mouth={voiceEnv('BIA', T) * 1.4} lookX={0.15} />
        <Vignette strength={0.65} />
      </AbsoluteFill>
    );
  }
  if (t < 7.0) {
    return stairLoop(T, 0.9, 1.15, 1);
  }
  const k = t - 7.0;
  const g = (k > 1.2 && k < 1.5) || (k > 2.6 && k < 2.8) ? 0.9 : 0.15;
  const nosig = k > 2.0 && k < 2.3;
  return (
    <AbsoluteFill>
      {stairLoop(T, g, kf(k, [[0, 1.15], [4.2, 1.6, ease.inOut]]), 0, nosig)}
      <AbsoluteFill style={{background: '#000', opacity: tw(k, 3.0, 4.2, 0, 0.45)}} />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 7 — A AMEAÇA (57,6–65,2s) ───────────── */
export const S7: React.FC = () => {
  const t = useT();
  const T = scene('s7_ameaca').start + t;
  const clock = CLOCK0 + 40 + T - 57;
  const msg = T > 60.2 && T < 63.5;
  const bubble = msg ? <MessageBubble t={T - 60.2} from="DESCONHECIDO" text="VOCÊ NÃO ESTÁ SOZINHA NO ANDAR." y={460} /> : null;
  if (t < 2.6) {
    const open = tw(T, 58.2, 60.0, 0, 1, ease.inOut);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: `scale(${kf(t, [[0, 1.0], [0.6, 1.0], [2.6, 1.3]])})`, transformOrigin: '50% 72%'}}>
          <CCTV t={T} label="CAM 12 · ELEV. SERVIÇO" clock={clock} tint={C.red} glitch={t < 0.15 ? 0.6 : 0}>
            <Elevator t={T} open={open} floor={T < 57.6 ? 6 : 7} arrow={T < 58.4} />
          </CCTV>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (t < 3.6) {
    const k = t - 2.6;
    const sh = shake(k, 0.0, 18, 0.4, 11);
    return (
      <AbsoluteFill style={{background: C.bg, transform: `translate(${sh.x}px,${sh.y}px)`}}>
        <BiaClose T={T} z={1.75} cy={1040} expr="shock" />
        <Vignette strength={0.6} />
        {bubble}
        <Glitch amount={T > 60.45 && T < 60.75 ? 0.9 : 0} seed={7} />
      </AbsoluteFill>
    );
  }
  if (t < 6.0) {
    const k = t - 3.6;
    const shadow = kf(k, [[0, 0], [2.4, 0.75, ease.linear]]);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={kf(k, [[0, 1380], [2.4, 1450]])} cy={kf(k, [[0, 1180], [2.4, 1230]])} zoom={kf(k, [[0, 1.45], [2.4, 1.95]])}>
          <Apartment t={T} light={0.28} locked lockBlink corridorLight={1} underDoorShadow={shadow}>
            <Bia t={T} x={1180} y={1760} scale={1.12} pose={POSES.idle} facing="back" tremble={0.6} />
          </Apartment>
        </SvgCamera>
        <Vignette strength={0.7} />
        {bubble && <div style={{opacity: tw(T, 63.0, 63.5, 1, 0)}}>{bubble}</div>}
      </AbsoluteFill>
    );
  }
  const k = t - 6.0;
  const z = kf(k, [[0, 2.2], [1.45, 8.5, ease.in]]);
  const cy = kf(k, [[0, 930], [1.45, 905, ease.in]]);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={900} cy={cy} zoom={z} {...(() => { const s = shake(k, 1.1, 14, 0.5, 13); return {sx: s.x, sy: s.y}; })()}>
        <Apartment t={T} light={0.4} locked lockBlink>
          <Bia t={T} x={900} y={1640} pose={POSES.scared} expr="fear" tremble={1} pupil={0.55 + Math.sin(T * 30) * 0.08} lookX={0.4} />
        </Apartment>
      </SvgCamera>
      <AbsoluteFill style={{background: C.red, mixBlendMode: 'multiply', opacity: tw(k, 0.6, 1.5, 0, 0.5)}} />
      <Flash amount={tw(k, 1.45, 1.6, 0, 0.8)} />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 8 — A VOTAÇÃO (65,2–76,4s) ───────────── */
export const S8: React.FC = () => {
  const t = useT();
  const T = scene('s8_votacao').start + t;
  const clock = CLOCK0 + 50 + T - 65;
  if (t < 8.8) {
    const split = tw(t, 0, 0.4, 0, 1, ease.expo);
    const kA = tw(T, 65.4, 65.75, 0, 1, ease.back);
    const kB = tw(T, 65.6, 65.95, 0, 1, ease.back);
    const both = T > 69.2 ? 0.5 + 0.5 * Math.sin(T * 6) : 0;
    const aAct = Math.max(T > 65.8 && T < 67.4 ? 1 : 0, both);
    const bAct = Math.max(T > 67.4 && T < 69.0 ? 1 : 0, T > 69.2 ? 0.5 + 0.5 * Math.sin(T * 6 + Math.PI) : 0);
    const cta = tw(T, 69.2, 69.55, 0, 1, ease.back);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * -1920}px)`}}>
          <div style={{position: 'absolute', left: -270, top: 0, width: 1080, height: 1920}}>
            <CCTV t={T} label="" clock={clock} tint={C.blue}><Stairwell t={T} people={stairPeople} /></CCTV>
          </div>
          <div style={{position: 'absolute', inset: 0, background: C.blue, mixBlendMode: 'multiply', opacity: 0.55}} />
        </div>
        <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - split) * 1920}px)`}}>
          <div style={{position: 'absolute', left: -270, top: 0, width: 1080, height: 1920}}>
            <CCTV t={T} label="" clock={clock} tint={C.red}><Elevator t={T} open={1} floor={7} /></CCTV>
          </div>
          <div style={{position: 'absolute', inset: 0, background: C.red, mixBlendMode: 'multiply', opacity: 0.5}} />
        </div>
        <div style={{position: 'absolute', left: 534, top: 0, width: 12, height: 1920, background: '#fff', boxShadow: '0 0 30px #fff', opacity: split}} />
        <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.7), transparent 30%, transparent 60%, rgba(0,0,0,0.75))'}} />
        <Timer t={T} remaining={remainingAt(T)} y={560} size={0.62} label="VOTAÇÃO ABERTA" frozen appear={split} />
        <VoteCard letter="A" text="DESCER PELAS ESCADAS" color={C.blue} x={30} y={830} w={490} k={kA} active={aAct} />
        <VoteCard letter="B" text="ENTRAR NO ELEVADOR" color={C.red} x={560} y={830} w={490} k={kB} active={bAct} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center', transform: `scale(${cta})`, opacity: clamp(cta * 2)}}>
          <div style={{display: 'inline-block', background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 72, padding: '12px 40px', borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>
            COMENTA <span style={{color: C.blue}}>A</span> OU <span style={{color: C.red}}>B</span>
          </div>
          <div style={{fontSize: 80, marginTop: 6, transform: `translateY(${Math.sin(T * 8) * 12}px)`}}>👇</div>
          <div style={{fontFamily: FONT.bold, fontSize: 36, color: '#fff', marginTop: 4, textShadow: '0 2px 8px #000'}}>a mais votada decide o EP. 2</div>
        </div>
        <Glitch amount={t < 0.3 ? 0.7 : 0} seed={8} />
      </AbsoluteFill>
    );
  }
  if (t < 9.9) {
    const k = t - 8.8;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: `scale(${kf(k, [[0, 2.1], [1.1, 2.5, ease.linear]])})`, transformOrigin: '50% 70%'}}>
          <CCTV t={T} label="CAM 12 · ELEV. SERVIÇO" clock={clock} tint={C.red}>
            <Elevator t={T} open={1} floor={7} backpackShake={1} ringGlow={1} />
          </CCTV>
        </AbsoluteFill>
        <Vignette strength={0.7} color="80,0,8" />
      </AbsoluteFill>
    );
  }
  if (t < 10.8) {
    const k = t - 9.9;
    const vib = Math.sin(T * 70) * 6;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141b2e, #020306)'}}>
        <Phone x={540 + vib} y={980} w={780} h={1520} rot={-3}>
          <IncomingCall t={T} name="VOCÊ" avatar={
            <svg viewBox="-150 -880 300 300" width="100%" height="100%"><rect x={-150} y={-880} width={300} height={300} fill="#2a3045" /><Bia t={T} expr="neutral" /></svg>
          } />
        </Phone>
        <Glitch amount={k < 0.2 ? 0.9 : 0} seed={9} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: '#000'}} />;
};
