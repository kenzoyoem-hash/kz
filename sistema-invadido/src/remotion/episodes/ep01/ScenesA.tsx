import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Apartment, APT} from '../../sets/Apartment';
import {Corridor, ExitHall, LOOKS} from '../../sets/Building';
import {Bia, POSES, mixPose, Pose} from '../../characters/Bia';

/** Bia de costas puxando a maçaneta: mão esquerda (lado direito da tela) na alavanca */
const BX = 1400, BY = 1352, BS = 0.95;
const handlePose = (pull: number): Pose => ({...POSES.handle, lT: {x: (APT.handle.x + 40 - BX - pull) / BS, y: (APT.handle.y - BY) / BS}, rT: {x: (APT.handle.x - 60 - BX - pull) / BS, y: (APT.handle.y - 40 - BY) / BS}});
import {Phone, CCTV, RuleCard, Timer, HackerTV} from '../../ui/UI';
import {SvgCamera, Glitch, Flash, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, shake, clamp, noise1} from '../../lib/anim';
import {useT, scene, LiveFeed, s2Pose, voiceEnv, remainingAt, flicker} from './shared';

/* ───────────── CENA 1 — O GANCHO (0–6,2s) ───────────── */
export const S1: React.FC = () => {
  const t = useT();
  const T = scene('s1_gancho').start + t;
  if (t < 3.4) {
    const z = kf(t, [[0, 1.4], [0.28, 1.0, ease.expo], [3.4, 1.12, ease.linear]]);
    const sh = shake(t, 0.05, 26, 0.45);
    const viewers = kf(t, [[0, 27150], [0.9, 27483, ease.out]]) + (t > 1.3 ? Math.floor(Math.sin(t * 3) * 3) : 0);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #182340, #04060c 70%)'}}>
        <AbsoluteFill style={{transform: `translate(${sh.x}px,${sh.y}px) scale(${z}) rotate(${-2 + t * 0.4}deg)`}}>
          <Phone x={540} y={980} w={900} h={1780} rot={0}>
            <LiveFeed t={t} T={T} pose={POSES.phoneBoth} expr="surprised" viewers={viewers} uiScale={1.15} />
          </Phone>
        </AbsoluteFill>
        <Flash amount={tw(t, 0, 0.15, 0.3, 0)} />
      </AbsoluteFill>
    );
  }
  // revelação: câmera se afasta do celular até a sala
  const k = t - 3.4;
  const z = kf(k, [[0, 4.2], [0.55, 1.12, ease.expo], [2.8, 1.55, ease.inOut]]);
  const cy = kf(k, [[0, 1060], [0.55, 1150, ease.expo], [2.8, 990]]);
  const cx = kf(k, [[0, 950], [0.55, 930, ease.expo], [2.8, 905]]);
  const sh = shake(t, 3.7, 28, 0.55, 3);
  const look = kf(t, [[4.9, 0], [5.15, -0.8, ease.out], [5.6, -0.8], [5.85, 0.6, ease.out]]);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={cx} cy={cy} zoom={z} sx={sh.x} sy={sh.y}>
        <Apartment t={T} light={0.72}>
          <Bia t={T} x={900} y={1640} pose={POSES.phoneBoth} expr={k < 0.3 ? 'surprised' : 'shock'} phone="L" phoneLit lookX={look} lookY={look !== 0 ? -0.2 : 0.3} tremble={0.4} />
        </Apartment>
      </SvgCamera>
      <Flash amount={tw(k, 0, 0.2, 0.55, 0)} />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 2 — A INVASÃO (6,2–15,2s) ───────────── */
export const S2: React.FC = () => {
  const t = useT();
  const T = scene('s2_invasao').start + t;
  if (t < 4.2) {
    const pose = s2Pose(t);
    const z = kf(t, [[0, 1.3], [4.2, 1.42, ease.linear]]);
    const viewers = 27483 + t * 520;
    const phoneIn = tw(t, 0.1, 0.5, 0, 1, ease.back);
    const echo = s2Pose(t - 1.0);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={1060} cy={1120} zoom={z}>
          <Apartment t={T} light={0.7}>
            <Bia t={T} x={900} y={1640} pose={pose} expr={t < 1.0 ? 'suspicious' : 'surprised'} phone="L" phoneLit lookX={t < 2.4 ? 0.25 : 0.5} lookY={0.2} />
          </Apartment>
        </SvgCamera>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - phoneIn) * 900}px)`}}>
          <Phone x={790} y={1150} w={430} h={820} rot={5}>
            <LiveFeed t={t} T={T - 1.0} pose={echo} viewers={viewers} uiScale={0.42} banner={false} expr={t - 1 < 1.0 ? 'suspicious' : 'surprised'} lookX={t - 1 < 2.4 ? 0.25 : 0.5} />
          </Phone>
          <div style={{position: 'absolute', left: 600, top: 690, background: C.yellow, color: '#000', fontFamily: FONT.title, fontSize: 34, padding: '4px 16px', borderRadius: 10, transform: 'rotate(5deg)', opacity: echo.rSh > 60 ? 1 : 0.0}}>AO VIVO · +1s</div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < 7.0) {
    // procurando câmeras nos cantos
    const k = t;
    const cx = kf(k, [[4.2, 900], [4.6, 420, ease.inOut], [5.4, 420], [5.65, 1430, ease.inOut], [6.3, 1430], [6.55, 900, ease.inOut]]);
    const cy = kf(k, [[4.2, 930], [4.6, 330, ease.inOut], [5.4, 330], [5.65, 340, ease.inOut], [6.3, 340], [6.55, 920, ease.inOut]]);
    const z = kf(k, [[4.2, 2.0], [4.6, 2.3], [6.3, 2.3], [6.55, 2.1]]);
    const lx = kf(k, [[4.2, 0], [4.45, -1], [5.4, -1], [5.6, 1], [6.4, 1], [6.6, 0]]);
    const ly = kf(k, [[4.2, 0], [4.45, -1], [6.4, -1], [6.6, 0.1]]);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={cx} cy={cy} zoom={z}>
          <Apartment t={T} light={0.62}>
            <Bia t={T} x={900} y={1640} pose={POSES.phoneL} expr="suspicious" phone="L" lookX={lx} lookY={ly} />
          </Apartment>
        </SvgCamera>
        <div style={{position: 'absolute', left: 50, top: 150, background: 'rgba(0,0,0,0.55)', borderRadius: 14, padding: '8px 18px', fontFamily: FONT.title, fontSize: 38, color: '#fff'}}>
          <span style={{color: C.red}}>● AO VIVO</span> 👁 {Math.round(29700 + (t - 4.2) * 1400).toLocaleString('pt-BR')}
        </div>
      </AbsoluteFill>
    );
  }
  // a TV acende sozinha
  const k = t - 7.0;
  const on = k < 0.35 ? (Math.sin(k * 80) > 0 ? 1 : 0.15) : 1;
  const z = kf(k, [[0, 1.2], [0.3, 1.25], [2.0, 2.35, ease.inOut]]);
  const cx = kf(k, [[0, 1050], [2.0, 990]]);
  const cy = kf(k, [[0, 1150], [2.0, 870]]);
  const sh = shake(k, 0.0, 14, 0.4, 5);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={cx} cy={cy} zoom={z} sx={sh.x} sy={sh.y}>
        <Apartment t={T} light={0.55} tvOn={on} tvColor={C.red} tvContent={<HackerTV t={k} mode="compromised" />}>
          <Bia t={T} x={900} y={1640} pose={POSES.phoneL} expr="surprised" phone="L" lookX={0.7} lookY={-0.3} />
        </Apartment>
      </SvgCamera>
      <Glitch amount={k < 0.45 ? 0.9 : k > 1.1 && k < 1.35 ? 0.6 : 0} seed={2} />
      <Flash amount={tw(k, 0, 0.12, 0.35, 0)} color="#ffdddd" />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 3 — O HACKER (15,2–27,2s) ───────────── */
export const S3: React.FC = () => {
  const t = useT();
  const T = scene('s3_hacker').start + t;
  const henv = voiceEnv('HACKER', T);
  const locked = t > 0.7;
  if (t < 2.0) {
    // luzes piscam, fechadura trava, Bia corre até a porta
    const light = flicker(t, 0, 1.5);
    const run = tw(t, 1.0, 1.15, 0, 1) * (t < 1.95 ? 1 : 0);
    const bx = kf(t, [[1.0, 900], [1.95, BX, ease.inOut]]);
    const by = kf(t, [[1.0, 1640], [1.95, BY, ease.inOut]]);
    const sc = kf(t, [[1.0, 1], [1.95, 0.95]]);
    const back = t > 1.05;
    const cx = kf(t, [[0, 1050], [2.0, 1250]]);
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={cx} cy={1120} zoom={1.15} {...(() => { const s = shake(t, 0.7, 12, 0.35, 7); return {sx: s.x, sy: s.y}; })()}>
          <Apartment t={T} light={light * 0.75} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={t} mode="compromised" />} locked={locked} lockBlink>
            <Bia t={T} x={bx} y={by} scale={sc} pose={back ? POSES.run : POSES.phoneL} expr="shock" phone={back ? 'none' : 'L'} lookY={t < 1 ? -0.9 : 0} lookX={t < 1 ? Math.sin(t * 6) * 0.6 : 0.5} run={run} facing={back ? 'back' : 'front'} />
          </Apartment>
        </SvgCamera>
      </AbsoluteFill>
    );
  }
  const handleShot = (k: number, z0: number, z1: number) => {
    const pull = Math.sin(k * 22) * 7;
    return (
      <SvgCamera cx={APT.handle.x - 10} cy={930} zoom={kf(k, [[0, z0], [1.4, z1]])} sx={pull * 0.5}>
        <Apartment t={T} light={0.55} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={k} mode="hacker" env={henv} />} locked lockBlink doorShake={1}>
          <Bia t={T} x={BX + pull} y={BY} scale={BS} pose={handlePose(pull)} facing="back" />
        </Apartment>
      </SvgCamera>
    );
  };
  if (t < 3.4) {
    return (
      <AbsoluteFill style={{background: C.bg}}>
        {handleShot(t - 2.0, 3.0, 3.3)}
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: FONT.mono, fontSize: 72, color: C.red, textShadow: `0 0 20px ${C.red}`, opacity: Math.sin(t * 10) > 0 ? 1 : 0.4}}>🔒 TRANCADA</div>
      </AbsoluteFill>
    );
  }
  const tvShot = (k: number, mode: 'hacker' | 'exits') => (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={990} cy={858} zoom={kf(k, [[0, 2.45], [2.0, 2.7, ease.linear]])}>
        <Apartment t={T} light={0.45} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={k} mode={mode} env={henv} />} />
      </SvgCamera>
      <Glitch amount={k < 0.25 ? 0.7 : henv > 0.8 ? 0.25 : 0} seed={3} />
      <Vignette strength={0.5} color="60,0,6" />
    </AbsoluteFill>
  );
  if (t < 5.4) return tvShot(t - 3.4, 'hacker');
  if (t < 6.8) {
    const k = t - 5.4;
    return (
      <AbsoluteFill style={{background: C.bg}}>
        <SvgCamera cx={1300} cy={1020} zoom={1.7}>
          <Apartment t={T} light={0.42} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={k} mode="hacker" env={henv} />} locked lockBlink doorShake={k < 1 ? 1 : 0}>
            <Bia t={T} x={BX + Math.sin(k * 22) * 7} y={BY} scale={BS} pose={handlePose(Math.sin(k * 22) * 7)} facing="back" />
          </Apartment>
        </SvgCamera>
        <Vignette strength={0.6} color="60,0,6" />
      </AbsoluteFill>
    );
  }
  if (t < 8.2) return tvShot(t - 6.8, 'exits');
  // Bia vira, encostada na porta: câmera se aproxima do rosto assustado
  const k = t - 8.2;
  const z = kf(k, [[0, 1.5], [3.0, 3.4, ease.inOut]]);
  const cy = kf(k, [[0, 1000], [3.0, 660, ease.inOut]]);
  const beat = (T - 24.6) % 0.652;
  const pulse = T > 24.6 ? Math.exp(-beat * 9) : 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={APT.handle.x} cy={cy} zoom={z * (1 + pulse * 0.015)}>
        <Apartment t={T} light={0.38} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={k} mode="hacker" env={henv} />} locked lockBlink>
          <Bia t={T} x={APT.handle.x} y={1352} scale={0.95} pose={mixPose(POSES.idle, POSES.scared, tw(k, 0.6, 1.4, 0, 1))} expr="fear" tremble={1} lookX={-0.35} pupil={0.8} />
        </Apartment>
      </SvgCamera>
      <Vignette strength={0.55 + pulse * 0.35} color="90,0,10" />
    </AbsoluteFill>
  );
};

/* ───────────── CENA 4 — A PRIMEIRA REGRA (27,2–35,6s) ───────────── */
export const S4: React.FC = () => {
  const t = useT();
  const T = scene('s4_regra').start + t;
  const clock = 23 * 3600 + 46 * 60 + 40 + T - 27;
  if (t < 6.4) {
    const zoomFeed = t > 1.4 && t < 2.2;
    const z = kf(t, [[0, 1.08], [0.35, 1.0, ease.expo], [6.4, 1.05]]);
    const dim = tw(t, 2.15, 2.4, 0, 0.55);
    const feeds = [
      {label: 'CAM 03 · 3º ANDAR', el: <Corridor t={T} floor={3} who={[{look: LOOKS.senhora, action: 'bang', x: 120, y: 700, s: 1.0}]} />},
      {label: 'CAM 05 · 5º ANDAR', el: <Corridor t={T} floor={5} who={[{look: LOOKS.rapaz, action: 'run', x: 520, y: 640, s: 0.9, dir: -1, vx: -140}]} />},
      {label: 'CAM 01 · PORTARIA', el: <ExitHall t={T} />},
      {label: 'CAM 09 · 2º ANDAR', el: <Corridor t={T} floor={2} who={[{look: LOOKS.vizinho, action: 'bang', x: 480, y: 690, s: 0.95, dir: -1}, {look: LOOKS.moca, action: 'run', x: 180, y: 560, s: 0.6, vx: 60}]} />},
    ];
    return (
      <AbsoluteFill style={{background: '#04060c'}}>
        <AbsoluteFill style={{transform: `scale(${z})`}}>
          <Phone x={540} y={990} w={1000} h={1900} hands>
            <div style={{position: 'absolute', inset: 0, background: '#000'}}>
              {zoomFeed ? (
                <CCTV t={T} label={feeds[1].label} clock={clock}>{feeds[1].el}</CCTV>
              ) : (
                feeds.map((f, i) => (
                  <div key={i} style={{position: 'absolute', left: (i % 2) * 50 + '%', top: 130 + Math.floor(i / 2) * 830, width: '50%', height: 820, padding: 4, boxSizing: 'border-box'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                      <CCTV t={T + i} label={f.label} clock={clock} small glitch={t < 0.3 ? 0.8 : 0}>{f.el}</CCTV>
                    </div>
                  </div>
                ))
              )}
              <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dim}} />
            </div>
          </Phone>
        </AbsoluteFill>
        {t > 2.2 && <RuleCard t={t - 2.2} n={1} text="APENAS UMA ROTA DE FUGA SERÁ LIBERADA." y={380} />}
        {t > 3.8 && <Timer t={t} remaining={remainingAt(T)} y={1000} size={1.15} appear={tw(t, 3.8, 4.15, 0, 1, ease.back)} />}
        <Glitch amount={t < 0.3 ? 0.8 : t > 2.2 && t < 2.45 ? 0.7 : 0} seed={4} />
      </AbsoluteFill>
    );
  }
  // volta para a Bia olhando o celular
  const k = t - 6.4;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <SvgCamera cx={kf(k, [[0, 980], [2, 940]])} cy={kf(k, [[0, 1080], [2, 990]])} zoom={kf(k, [[0, 1.5], [2, 1.85]])}>
        <Apartment t={T} light={0.4} tvOn={1} tvColor={C.red} tvContent={<HackerTV t={k} mode="hacker" env={0.1} />} locked lockBlink>
          <Bia t={T} x={900} y={1640} pose={POSES.phoneBoth} expr="fear" phone="L" phoneLit lookY={0.5} tremble={0.5} />
        </Apartment>
      </SvgCamera>
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};

export {clamp, noise1};
