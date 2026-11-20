import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SecurityRoom, SecurityReverse, KeyboardClose} from '../../sets/SecurityRoom';
import {Bedroom, PhoneOnStand, BR} from '../../sets/Bedroom';
import {Backpack} from '../../sets/ElevatorSets';
import {POSES, Pose, BiaHome, Bia} from '../../characters/Bia';
import {Davi} from '../../characters/Davi';
import {Clara} from '../../characters/Clara';
import {Phone} from '../../ui/UI';
import {SvgCamera, Vignette} from '../../fx/Fx';
import {C, FONT} from '../../theme';
import {kf, ease, tw, clamp, rnd} from '../../lib/anim';
import {useT, mouthOf} from './shared';

/**
 * EP. 8 — "VOCÊ ERA O SISTEMA" — GRANDE FINAL (após EP. 7; venceu B: descobrir quem controla). Máx. 90 s.
 * Sem narrador, sem votação. Ordem: origem → votações → espectadores → despertador → corte seco → quarto → notificação → TRANSMISSÃO 02.
 */
const VIG = 0.28;
const REST: Pose = {rSh: 8, rEl: 8, lSh: 8, lEl: 8};
const BAG = <g transform="translate(0,170)"><Backpack scale={0.42} tag={false} /></g>;
const DAVI_BAG: Pose = {...REST, rSh: 10, rEl: 14, rHand: 'grip'};
const bg = (el: React.ReactNode, extra?: React.ReactNode) => <AbsoluteFill style={{background: C.bg}}>{el}<Vignette strength={VIG} />{extra}</AbsoluteFill>;

type P = {pose?: Pose; expr?: any; lookX?: number; lookY?: number; mouth?: number; mouthOff?: boolean};
/** contraplano na sala de segurança (de frente), mesmas posições do EP. 7 */
const Reverse: React.FC<{T: number; cx: number; cy: number; z: number; davi?: P; bia?: P; clara?: P; dark?: number}> = ({T, cx, cy, z, davi, bia, clara, dark = 0}) => (
  <SvgCamera cx={cx} cy={cy} zoom={z}>
    <SecurityReverse t={T} camRot={28}>
      {davi && <Davi t={T} x={250} y={1800} pose={davi.pose ?? DAVI_BAG} holdR={BAG} expr={davi.expr ?? 'worried'} lookX={davi.lookX ?? 0.3} lookY={davi.lookY ?? 0} mouth={davi.mouth ?? (davi.mouthOff ? 0 : mouthOf('DAVI', T, 1.2))} />}
      {clara && <Clara t={T} x={830} y={1800} expr={clara.expr ?? 'worried'} lookX={clara.lookX ?? -0.3} lookY={clara.lookY ?? 0} mouth={clara.mouthOff ? 0 : mouthOf('CLARA_LIVRE', T, 1.2)} />}
      {bia && <Bia t={T} x={540} y={1830} scale={1.02} pose={bia.pose ?? POSES.phoneL} phone="L" expr={bia.expr ?? 'worried'} lookX={bia.lookX ?? 0} lookY={bia.lookY ?? 0} mouth={bia.mouthOff ? 0 : mouthOf('BIA', T, 1.2)} />}
      {dark > 0 && <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={dark} />}
    </SecurityReverse>
  </SvgCamera>
);
const ON = {davi: {cx: 270, cy: 1080}, bia: {cx: 540, cy: 1100}, clara: {cx: 820, cy: 1080}};

const Screen: React.FC<{children: React.ReactNode; title?: string; red?: boolean; z?: number}> = ({children, title = 'SISTEMA PREDIAL · SEGURANÇA', red, z = 1}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #141b2e, #020306 75%)', transform: `scale(${z})`}}>
    <div style={{position: 'absolute', left: 50, right: 50, top: 300, height: 1180, background: '#05070c', borderRadius: 26, border: '14px solid #1c2130', boxShadow: `0 0 80px ${red ? C.red : C.blue}44`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, background: red ? '#3a0a10' : '#121a30', fontFamily: FONT.mono, color: red ? '#ffb3ba' : '#9fb6e0', fontSize: 28, lineHeight: '70px', paddingLeft: 30}}>● {title}</div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 110, bottom: 40}}>{children}</div>
    </div>
  </AbsoluteFill>
);
const Big: React.FC<{text: string; k: number; color?: string; size?: number; mt?: number}> = ({text, k, color = '#fff', size = 66, mt = 0}) => (
  <div style={{fontFamily: FONT.title, fontSize: size, color, textAlign: 'center', lineHeight: 1.15, opacity: clamp(k * 4), marginTop: mt}}>{text}</div>
);

/* ───────── CENA 1 — A ÚLTIMA ESCOLHA (0–9s) ───────── */
export const S1: React.FC = () => {
  const t = useT(); const T = t;
  const buttons = (sel: number) => (
    <Screen red title="MENSAGEM">
      <div style={{display: 'flex', flexDirection: 'column', gap: 50, marginTop: 260, alignItems: 'center'}}>
        <div style={{fontFamily: FONT.title, fontSize: 56, color: '#fff', background: '#16306a', border: `5px solid ${C.blue}`, borderRadius: 18, padding: '22px 40px', width: 760, textAlign: 'center'}}>ENCERRAR CONEXÃO</div>
        <div style={{fontFamily: FONT.title, fontSize: 56, color: '#fff', background: sel > 0 ? '#b0182a' : '#5a0f18', border: `5px solid ${sel > 0 ? '#fff' : C.red}`, borderRadius: 18, padding: '22px 40px', width: 760, textAlign: 'center', transform: `scale(${1 + sel * 0.06})`, boxShadow: sel > 0 ? `0 0 50px ${C.red}` : 'none'}}>IDENTIFICAR ORIGEM</div>
      </div>
    </Screen>
  );
  if (t < 1.4) return buttons(0);
  if (t < 4.7) return bg(<Reverse T={T} {...ON.davi} z={2.3} davi={{expr: 'worried', lookX: 0.4}} />);
  if (t < 6.9) return bg(<Reverse T={T} {...ON.bia} z={2.3} bia={{expr: 'determined', lookX: -0.6}} />);
  if (t < 7.6) return bg(<SvgCamera cx={540} cy={1060} zoom={1.05}><KeyboardClose reach={tw(T, 6.9, 7.4, 0.6, 1, ease.out)} /></SvgCamera>);
  if (t < 8.1) return buttons(1);
  // a tela escurece: RASTREANDO CONEXÃO… / close no rosto iluminado pelo monitor
  if (t < 8.6) return <Screen><Big text="RASTREANDO CONEXÃO…" k={9} size={60} mt={420} color="#9fb6e0" /></Screen>;
  return bg(<Reverse T={T} {...ON.bia} cy={1060} z={2.6} bia={{expr: 'determined', lookY: 0.15, mouthOff: true}} />);
};

/* ───────── CENA 2 — A ORIGEM (9–23s) ───────── */
const NetMap: React.FC<{T: number; k: number}> = ({T, k}) => (
  <svg viewBox="0 0 900 700" width="100%" height={700} style={{display: 'block'}}>
    {Array.from({length: 46}).map((_, i) => {
      const a = rnd(`na${i}`) * Math.PI * 2, r = 120 + rnd(`nr${i}`) * 300;
      const x = 450 + Math.cos(a) * r * 1.05, y = 350 + Math.sin(a) * r * 0.75;
      const vis = clamp((k - i / 46) * 3);
      return (
        <g key={i} opacity={vis}>
          <line x1={450} y1={350} x2={x} y2={y} stroke="#3d6bff" strokeWidth={2} opacity={0.35} />
          <circle cx={x} cy={y} r={7 + 3 * Math.sin(T * 4 + i)} fill={C.red} opacity={0.85} />
        </g>
      );
    })}
    <circle cx={450} cy={350} r={36} fill="#3d8bff" />
    <text x={450} y={420} fontSize={30} textAnchor="middle" fontFamily={FONT.mono} fill="#cfe0ff">PRÉDIO</text>
  </svg>
);
export const S2: React.FC = () => {
  const t = useT(); const T = 9 + t;
  if (t < 3.8) {
    return (
      <Screen title="RASTREAMENTO DE CONEXÕES">
        <NetMap T={T} k={tw(T, 9.0, 10.4, 0, 1)} />
        <Big text="ORIGEM IDENTIFICADA" k={T - 10.6} size={60} mt={30} color={C.red} />
        <Big text="CONTROLE DISTRIBUÍDO" k={T - 11.6} size={54} mt={20} />
      </Screen>
    );
  }
  if (t < 5.8) return bg(<Reverse T={T} {...ON.bia} z={2.3} bia={{expr: 'confused', lookY: 0.2}} />);
  if (t < 7.8) return bg(<Reverse T={T} {...ON.davi} z={2.3} davi={{expr: 'suspicious', lookX: 0.4, lookY: 0.2}} />);
  if (t < 9.8) return bg(<Reverse T={T} {...ON.clara} z={2.2} clara={{expr: 'worried', lookX: -0.3}} />);
  return (
    <Screen title="RASTREAMENTO DE CONEXÕES" z={kf(t, [[9.8, 1.0], [14, 1.08]])}>
      <NetMap T={T} k={1} />
      <Big text="MÚLTIPLOS OPERADORES CONECTADOS" k={T - 19.0} size={56} mt={30} color={C.red} />
    </Screen>
  );
};

/* ───────── CENA 3 — AS VOTAÇÕES (23–38s) ───────── */
const ESCOLHAS = ['ESCOLHA 01 — ELEVADOR', 'ESCOLHA 02 — CONFIAR EM DAVI', 'ESCOLHA 03 — INVESTIGAR 604', 'ESCOLHA 04 — SALVAR CLARA', 'ESCOLHA 05 — INVESTIGAR SEGURANÇA', 'ESCOLHA 06 — IDENTIFICAR ORIGEM'];
const Ballot: React.FC = () => (
  <svg viewBox="0 0 40 40" width={46} height={46} style={{flexShrink: 0}}><rect x={3} y={14} width={34} height={22} rx={4} fill="none" stroke={C.yellow} strokeWidth={3} /><rect x={12} y={4} width={16} height={18} rx={2} fill={C.yellow} /><path d="M15,12 l3,3 l6,-6" stroke="#111" strokeWidth={3} fill="none" /></svg>
);
const History: React.FC<{t: number; banner?: number}> = ({t, banner = 0}) => (
  <Screen title="HISTÓRICO">
    {ESCOLHAS.map((e, i) => (
      <div key={e} style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.mono, fontSize: 40, color: '#e8eefc', opacity: clamp((t - i * 0.6) * 4), padding: '12px 14px', marginBottom: 14, borderRadius: 10, background: 'rgba(255,255,255,0.04)', lineHeight: 1.15}}>
        <Ballot /><span>{e}</span>
      </div>
    ))}
    {banner > 0 && <div style={{marginTop: 20, textAlign: 'center', fontFamily: FONT.title, fontSize: 50, color: '#fff', background: '#8a1020', border: `5px solid ${C.red}`, borderRadius: 16, padding: '16px 10px', opacity: banner, boxShadow: `0 0 50px ${C.red}88`}}>DECISÕES RECEBIDAS EXTERNAMENTE</div>}
  </Screen>
);
export const S3: React.FC = () => {
  const t = useT(); const T = 23 + t;
  if (t < 6.0) return <History t={t - 0.3} />;
  if (t < 8.6) return bg(<Reverse T={T} {...ON.bia} z={2.3} bia={{expr: 'surprised', lookY: 0.2}} />);
  if (t < 10.8) return <History t={9} banner={tw(T, 31.7, 32.1, 0, 1)} />;
  if (t < 12.8) return bg(<Reverse T={T} {...ON.bia} z={2.5} bia={{expr: 'fear', lookY: 0.3}} />);
  return bg(<Reverse T={T} {...ON.davi} z={2.3} davi={{expr: 'worried', lookX: 0.5}} />);
};

/* ───────── CENA 4 — O PÚBLICO ERA O SISTEMA (38–53s) ───────── */
const COMMENTS = ['A', 'B', 'VAI PRO ELEVADOR!', 'CONFIA NO DAVI!', 'SALVA A CLARA!', 'DESCOBRE QUEM CONTROLA!', 'B', 'A'];
export const S4: React.FC = () => {
  const t = useT(); const T = 38 + t;
  if (t < 4.6) {
    // comentários e votos simulados (sem nomes, perfis ou interfaces reais)
    return (
      <Screen title="ENTRADAS RECEBIDAS">
        {COMMENTS.map((c, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, opacity: clamp((t - 0.2 - i * 0.45) * 4), marginLeft: (i % 2) * 60}}>
            <div style={{width: 64, height: 64, borderRadius: 64, background: ['#3a4560', '#4a3a56', '#35504a', '#584a3a'][i % 4], flexShrink: 0}} />
            <div style={{fontFamily: FONT.title, fontSize: c.length < 3 ? 60 : 44, color: c === 'A' ? '#9fc0ff' : c === 'B' ? '#ffb3ba' : '#fff', background: 'rgba(255,255,255,0.07)', borderRadius: 22, padding: '10px 26px'}}>{c}</div>
          </div>
        ))}
      </Screen>
    );
  }
  if (t < 7.0) return bg(<Reverse T={T} {...ON.bia} z={2.4} bia={{expr: 'shock', lookY: 0.2}} />);
  if (t < 10.4) return <Screen red title="SISTEMA"><Big text="OS ESPECTADORES DETERMINARAM SUAS DECISÕES." k={T - 45.3} size={58} mt={380} /></Screen>;
  // ela olha direto para a lente: "Então… foram vocês?"
  return bg(<Reverse T={T} cx={540} cy={1060} z={kf(t, [[10.4, 2.7], [15, 2.9]])} bia={{expr: 'determined', lookX: 0, lookY: 0}} />);
};

/* ───────── CENA 5 — O SOM QUE NÃO PERTENCE ÀQUELE LUGAR (53–62s) ───────── */
export const S5: React.FC = () => {
  const t = useT(); const T = 53 + t;
  const flick = T > 56.6 && T < 56.75 ? 0.75 : 0;
  if (t < 4.4) {
    const look = T < 54.8 ? 0 : T < 55.8 ? -0.8 : 0.8;
    return bg(<Reverse T={T} cx={540} cy={1060} z={2.9} bia={{expr: T < 54.6 ? 'determined' : 'confused', lookX: look, lookY: 0}} dark={flick} />);
  }
  // Davi abre a boca para responder… mas a fala não é ouvida
  if (t < 5.6) return bg(<Reverse T={T} {...ON.davi} z={2.3} davi={{expr: 'confused', lookX: 0.4, mouth: tw(T, 57.5, 57.8, 0, 0.5)}} />);
  return bg(<Reverse T={T} cx={540} cy={1060} z={2.9} bia={{expr: 'confused', lookX: 0, lookY: 0, mouthOff: true}} />);
};

/* ───────── CENA 6 — O DESPERTAR (62–74s) ───────── */
/** cobertor sobre as pernas (Bia sentada na cama): curvo, com dobras */
const SIT_BLANKET = (
  <g>
    <path d="M10,1260 Q120,1150 300,1175 Q420,1190 520,1160 Q640,1135 740,1200 L745,1548 L5,1548 Z" fill="#e9edf5" />
    <path d="M90,1300 Q260,1240 420,1290 M380,1250 Q520,1210 690,1270" stroke="#cfd6e3" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
const SLEEPING_CLIP = <clipPath id="bedClip"><rect x={0} y={0} width={740} height={1500} /></clipPath>;
const Blanket = <path d="M60,1160 Q300,1110 560,1150 Q700,1170 740,1170 L740,1320 L10,1320 L10,1200 Q30,1160 60,1160 Z" fill="#e9edf5" />;
export const S6: React.FC = () => {
  const t = useT(); const T = 62 + t;
  // primeiro quadro após o corte: o celular no criado-mudo, o mesmo bip
  if (t < 2.6) return <AbsoluteFill style={{background: '#9a7a5e'}}><SvgCamera cx={540} cy={960} zoom={1.0}><PhoneOnStand ringing t={T} /></SvgCamera></AbsoluteFill>;
  if (t < 4.6) {
    // Bia dormindo; desperta assustada (sem exagero)
    const awake = T > 66.0;
    return (
      <AbsoluteFill style={{background: '#e9e2d6'}}>
        <SvgCamera cx={420} cy={1120} zoom={1.7}>
          <Bedroom>
            <defs>{SLEEPING_CLIP}</defs>
            <g clipPath="url(#bedClip)">
              <g transform={`translate(${BR.pillow.x + 540},${BR.pillow.y - 6}) rotate(-90) scale(0.75)`}>
                <BiaHome t={T} sleep={!awake} expr={awake ? 'surprised' : 'neutral'} lookY={awake ? -0.6 : 0} />
              </g>
            </g>
            {Blanket}
          </Bedroom>
        </SvgCamera>
      </AbsoluteFill>
    );
  }
  if (t < 5.8) {
    // sentada na cama, olha ao redor: o quarto está normal
    return (
      <AbsoluteFill style={{background: '#e9e2d6'}}>
        <SvgCamera cx={520} cy={1020} zoom={1.15}>
          <Bedroom front={SIT_BLANKET}>
            <BiaHome t={T} x={360} y={1520} expr="worried" lookX={T < 67.2 ? -0.7 : 0.7} />
          </Bedroom>
        </SvgCamera>
      </AbsoluteFill>
    );
  }
  if (t < 6.6) {
    // pega o celular e desliga o alarme (o som para em 67,8 s)
    const off = T > 67.8;
    return (
      <AbsoluteFill style={{background: '#9a7a5e'}}>
        <SvgCamera cx={540} cy={960} zoom={1.0}><PhoneOnStand ringing={!off} t={T} /></SvgCamera>
        <div style={{position: 'absolute', left: 560 + tw(T, 67.4, 67.8, 120, 0), top: 1130 + tw(T, 67.4, 67.8, 200, 0), width: 120, height: 420, borderRadius: 60, background: C.skin, transform: 'rotate(-20deg)'}} />
      </AbsoluteFill>
    );
  }
  // silêncio. A mão no rosto… "Meu Deus… foi só um sonho." Alívio.
  const face: Pose = {...REST, rSh: 0, rEl: 0, rT: {x: -10, y: -740}, rFs: 0.85, rHand: 'open', rHandRot: 170};
  const handOnFace = T > 68.7 && T < 70.0;
  return (
    <AbsoluteFill style={{background: '#e9e2d6'}}>
      <SvgCamera cx={380} cy={kf(t, [[6.6, 900], [12, 880]])} zoom={kf(t, [[6.6, 1.8], [12, 1.95]])}>
        <Bedroom front={SIT_BLANKET}>
          <BiaHome t={T} x={360} y={1520} pose={handOnFace ? face : POSES.phoneL} phone="L" expr={T > 72.3 ? 'neutral' : 'worried'} lookY={0.3} mouth={mouthOf('BIA', T, 1.1)} />
        </Bedroom>
      </SvgCamera>
    </AbsoluteFill>
  );
};

/* ───────── CENA 7 — A NOTIFICAÇÃO IMPOSSÍVEL (74–84s) ───────── */
const Notif: React.FC<{k: number; title: string; body: string; big?: boolean}> = ({k, title, body, big}) => (
  <div style={{margin: '0 26px 26px', background: 'rgba(240,243,250,0.95)', borderRadius: 30, padding: '26px 30px', opacity: clamp(k * 4), transform: `translateY(${(1 - clamp(k * 4)) * -30}px)`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.semi, fontSize: 30, color: '#4a5266'}}>
      <div style={{width: 46, height: 46, borderRadius: 12, background: '#11131c', color: C.red, fontFamily: FONT.title, fontSize: 30, textAlign: 'center', lineHeight: '46px'}}>●</div>
      {title}<span style={{marginLeft: 'auto', fontSize: 26}}>agora</span>
    </div>
    <div style={{fontFamily: FONT.title, fontSize: big ? 50 : 46, color: '#11131c', marginTop: 16, lineHeight: 1.15, textAlign: big ? 'center' : 'left'}}>{body}</div>
  </div>
);
export const S7: React.FC = () => {
  const t = useT(); const T = 74 + t;
  if (t < 2.0) {
    return (
      <AbsoluteFill style={{background: '#e9e2d6'}}>
        <SvgCamera cx={380} cy={900} zoom={1.7}>
          <Bedroom front={SIT_BLANKET}>
            <BiaHome t={T} x={360} y={1520} pose={POSES.phoneL} phone="L" expr="neutral" lookY={T > 75.6 ? 0.7 : 0.1} lookX={T > 75.6 ? 0.2 : -0.3} />
          </Bedroom>
        </SvgCamera>
      </AbsoluteFill>
    );
  }
  if (t < 8.0) {
    // close no aparelho: notificação simples, sem glitch
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #efe8dc, #cfc5b5 80%)'}}>
        <Phone x={540} y={980} w={820} h={1580} glow="#ffffff">
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#1c2438, #0d1222)'}}>
            <div style={{textAlign: 'center', marginTop: 150, fontFamily: FONT.semi, fontSize: 150, color: '#f4f6fb'}}>07:01</div>
            <div style={{textAlign: 'center', fontFamily: FONT.semi, fontSize: 34, color: '#aab3c7', marginBottom: 60}}>quarta-feira</div>
            <Notif k={T - 76.2} title="SISTEMA INVADIDO" body="OBRIGADO POR PARTICIPAR, BIA." />
            <Notif k={T - 79.0} title="SISTEMA INVADIDO" body="OS ESPECTADORES ESCOLHERAM: ACORDAR." big />
          </div>
        </Phone>
      </AbsoluteFill>
    );
  }
  // horror silencioso: ela ergue os olhos do celular
  return (
    <AbsoluteFill style={{background: '#e9e2d6'}}>
      <SvgCamera cx={360} cy={860} zoom={2.7}>
        <Bedroom front={SIT_BLANKET}>
          <BiaHome t={T} x={360} y={1520} pose={POSES.phoneL} phone="L" expr="fear" lookY={tw(T, 82.3, 83.0, 0.7, 0)} mouth={0} pupil={0.75} />
        </Bedroom>
      </SvgCamera>
    </AbsoluteFill>
  );
};

/* ───────── CENA 8 — A ÚLTIMA TRANSMISSÃO (84–90s): preto, a frase, preto ───────── */
export const S8: React.FC = () => {
  const t = useT();
  const k = tw(t, 1.0, 1.8, 0, 1, ease.inOut) * tw(t, 3.6, 4.2, 1, 0, ease.inOut);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      {k > 0 && <div style={{fontFamily: FONT.mono, fontSize: 64, color: C.red, letterSpacing: 4, textAlign: 'center', opacity: k}}>TRANSMISSÃO 02 INICIADA.</div>}
    </AbsoluteFill>
  );
};
