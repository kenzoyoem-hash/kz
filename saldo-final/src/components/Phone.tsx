import React from 'react';
import {C, FONT} from '../styles/theme';
import {clamp, ease, prog, rnd, tw, wobble} from '../lib/anim';
import {TempoIcon} from './Background';

/* =====================================================================
 * CELULAR + APP TEMPO (plataforma de negociação de anos de vida)
 * Tela em coordenadas locais 0..600 x 0..1180. Todos os textos são tipografia real.
 * ===================================================================== */
export const SW = 600, SH = 1180;

const T: React.FC<{x: number; y: number; s: number; c?: string; f?: string; a?: 'start' | 'middle' | 'end'; o?: number; ls?: number; children: React.ReactNode}> =
  ({x, y, s, c = C.white, f = FONT.bold, a = 'middle', o = 1, ls = 0, children}) => (
    <text x={x} y={y} fontSize={s} fill={c} fontFamily={f} textAnchor={a} opacity={o} letterSpacing={ls}>{children}</text>
  );

/** aparelho grande (insert) segurado pela mão da Maya */
export const PhoneInsert: React.FC<{x?: number; y?: number; s?: number; r?: number; children: React.ReactNode; glow?: string; hand?: boolean; thumb?: {x: number; y: number; press?: number} | null}> =
  ({x = 540, y = 900, s = 1, r = 0, children, glow = C.blue, hand = true, thumb = null}) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <defs>
      <clipPath id="screenClip"><rect x={-SW / 2} y={-SH / 2} width={SW} height={SH} rx={46} /></clipPath>
      <radialGradient id="phoneHalo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={glow} stopOpacity="0.35" /><stop offset="1" stopColor={glow} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={0} cy={0} rx={620} ry={900} fill="url(#phoneHalo)" />
    {hand && (
      <g>
        {/* palma por trás do aparelho e manga verde-musgo (jaqueta da Maya) */}
        <path d="M-120,1500 L-60,560 Q0,480 200,520 Q360,560 360,700 L300,1500 Z" fill={C.moss} />
        <ellipse cx={40} cy={600} rx={250} ry={120} fill={C.skinShade} />
        <rect x={-346} y={160} width={46} height={66} rx={23} fill={C.skinShade} />
        <rect x={-350} y={236} width={50} height={70} rx={25} fill={C.skinShade} />
        <rect x={-344} y={316} width={44} height={64} rx={22} fill={C.skinShade} />
      </g>
    )}
    <rect x={-SW / 2 - 18} y={-SH / 2 - 18} width={SW + 36} height={SH + 36} rx={62} fill="#151A2B" />
    <rect x={-SW / 2 - 18} y={-SH / 2 - 18} width={SW + 36} height={SH + 36} rx={62} fill="none" stroke="#2B3352" strokeWidth={4} />
    <g clipPath="url(#screenClip)">
      <g transform={`translate(${-SW / 2},${-SH / 2})`}>{children}</g>
    </g>
    <rect x={-60} y={-SH / 2 + 14} width={120} height={30} rx={15} fill="#05070C" />
    {hand && <rect x={294} y={200} width={50} height={120} rx={25} fill={C.skin} />}
    {thumb && (
      <g transform={`translate(${thumb.x - SW / 2},${thumb.y - SH / 2})`}>
        {(thumb.press ?? 0) > 0 && <circle cx={0} cy={-6} r={30 + 120 * (thumb.press ?? 0)} fill="none" stroke={C.white} strokeWidth={6} opacity={1 - (thumb.press ?? 0)} />}
        <path d="M-28,10 Q-34,-30 0,-38 Q34,-30 30,10 L60,420 L-80,420 Z" fill={C.skin} />
        <path d="M-18,-6 Q0,-26 18,-6" stroke={C.skinShade} strokeWidth={6} fill="none" opacity={0.6} />
      </g>
    )}
  </g>
);

const AppBg: React.FC<{tone?: 'normal' | 'red' | 'dark'}> = ({tone = 'normal'}) => (
  <g>
    <defs>
      <linearGradient id={`appbg-${tone}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone === 'red' ? '#2A0B16' : '#151B38'} />
        <stop offset="1" stopColor={tone === 'red' ? '#12060D' : C.ink} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={SW} height={SH} fill={`url(#appbg-${tone})`} />
    <circle cx={520} cy={120} r={260} fill={tone === 'red' ? C.red : C.purple} opacity={0.12} />
    <circle cx={60} cy={1000} r={240} fill={C.blue} opacity={0.08} />
  </g>
);
const StatusBar: React.FC = () => (
  <g>
    <T x={44} y={44} s={24} f={FONT.semi} a="start">23:47</T>
    <rect x={500} y={28} width={44} height={20} rx={5} fill="none" stroke={C.white} strokeWidth={2.5} />
    <rect x={504} y={32} width={12} height={12} rx={2} fill={C.red} />
  </g>
);
const AppHeader: React.FC<{col?: string}> = ({col = C.gold}) => (
  <g>
    <StatusBar />
    <TempoIcon x={72} y={120} s={1.1} col={col} />
    <T x={104} y={136} s={46} f={FONT.title} a="start" ls={6}>TEMPO</T>
    <T x={106} y={168} s={18} f={FONT.semi} a="start" c="#8C93B8" ls={2}>MERCADO DE ANOS DE VIDA</T>
    <rect x={40} y={196} width={520} height={2} fill="#262E52" />
  </g>
);
const Button: React.FC<{y: number; label: string; col?: string; k?: number; pulse?: number}> = ({y, label, col = C.purple, k = 1, pulse = 0}) => (
  <g opacity={k} transform={`translate(300,${y}) scale(${1 + pulse * 0.04}) translate(-300,${-y})`}>
    <rect x={60} y={y - 50} width={480} height={100} rx={50} fill={col} />
    <rect x={60} y={y - 50} width={480} height={100} rx={50} fill="none" stroke={C.white} strokeWidth={3} opacity={0.25 + pulse * 0.5} />
    <T x={300} y={y + 13} s={36} f={FONT.title} ls={3}>{label}</T>
  </g>
);
/** barra de saldo de vida (dourado = anos) */
const LifeBar: React.FC<{y: number; from: number; to: number; k: number; label?: string}> = ({y, from, to, k, label = 'SALDO ESTIMADO DE VIDA'}) => {
  const max = 80, w = 480;
  const cur = from - (from - to) * k;
  return (
    <g>
      <T x={60} y={y - 18} s={20} f={FONT.semi} a="start" c="#8C93B8" ls={2}>{label}</T>
      <T x={540} y={y - 18} s={26} f={FONT.title} a="end" c={C.gold}>{Math.round(cur)} ANOS</T>
      <rect x={60} y={y} width={w} height={22} rx={11} fill="#20284A" />
      <rect x={60} y={y} width={(w * cur) / max} height={22} rx={11} fill={C.gold} />
      {to < from && <rect x={60 + (w * to) / max} y={y} width={(w * (from - to)) / max} height={22} rx={4} fill={C.goldLight}
        opacity={k < 1 ? 0.5 + 0.5 * Math.sin(k * 30) : 0} />}
    </g>
  );
};

/** CENA 04 — proposta de 5 anos por R$ 80 mil */
export const ScreenProposal: React.FC<{k: number}> = ({k}) => {
  const a = prog(k, 0.05, 0.3, ease.back), b = prog(k, 0.25, 0.5, ease.back), c = prog(k, 0.45, 0.7);
  return (
    <g>
      <AppBg /><AppHeader />
      <T x={300} y={280} s={24} f={FONT.semi} c={C.blue} ls={4}>NOVA PROPOSTA PARA VOCÊ</T>
      <rect x={50} y={310} width={500} height={430} rx={30} fill="#1B2246" stroke={C.gold} strokeWidth={3} opacity={0.95} />
      <g transform={`translate(300,470) scale(${a})`}>
        <T x={0} y={0} s={150} f={FONT.title} c={C.gold}>5 ANOS</T>
      </g>
      <T x={300} y={548} s={34} f={FONT.semi} c="#AEB4D6" o={b}>por</T>
      <g transform={`translate(300,660) scale(${b})`}>
        <T x={0} y={0} s={104} f={FONT.title}>R$ 80.000</T>
      </g>
      <g opacity={c}><LifeBar y={830} from={58} to={58} k={0} /></g>
      <T x={300} y={940} s={22} f={FONT.semi} c="#7F86AA" o={c}>Pagamento instantâneo · sem envelhecimento físico</T>
      <Button y={1050} label="VENDER AGORA" k={c} pulse={Math.max(0, Math.sin(k * 18)) * c} />
    </g>
  );
};

/** CENA 06 — confirmação da venda */
export const ScreenConfirm: React.FC<{k: number; press?: number; done?: number}> = ({k, press = 0, done = 0}) => (
  <g>
    <AppBg /><AppHeader />
    <T x={300} y={300} s={46} f={FONT.title} ls={2}>CONFIRMAR VENDA</T>
    <rect x={50} y={350} width={500} height={330} rx={30} fill="#1B2246" />
    <T x={300} y={450} s={96} f={FONT.title} c={C.gold}>5 ANOS</T>
    <path d="M270,490 L300,520 L330,490" stroke="#8C93B8" strokeWidth={6} fill="none" />
    <T x={300} y={620} s={84} f={FONT.title}>R$ 80.000</T>
    <LifeBar y={780} from={58} to={53} k={done} label="SEU SALDO APÓS A VENDA" />
    <T x={300} y={900} s={24} f={FONT.semi} c={C.red} o={0.9}>Esta operação é irreversível.</T>
    {done < 0.5 ? (
      <Button y={1040} label="CONFIRMAR" col={press > 0 ? '#6A2FE0' : C.purple} pulse={press > 0 ? 0 : Math.max(0, Math.sin(k * 20))} />
    ) : (
      <g>
        <circle cx={300} cy={1040} r={54} fill={C.blue} />
        <path d="M274,1040 L294,1060 L330,1020" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </g>
);

/** CENA 07 — dinheiro caiu */
export const ScreenReceived: React.FC<{k: number}> = ({k}) => {
  const v = Math.round(tw(k, 0.1, 0.65, 0, 80000, ease.out));
  const txt = 'R$ ' + v.toLocaleString('pt-BR') + ',00';
  const a = prog(k, 0, 0.2, ease.back);
  return (
    <g>
      <AppBg /><AppHeader />
      <g transform={`translate(300,380) scale(${a})`}>
        <circle cx={0} cy={0} r={90} fill={C.blue} opacity={0.2} />
        <circle cx={0} cy={0} r={64} fill={C.blue} />
        <path d="M-28,0 L-8,22 L32,-22" stroke={C.white} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <T x={300} y={540} s={36} f={FONT.title} ls={2}>TRANSFERÊNCIA RECEBIDA</T>
      <T x={300} y={680} s={64} f={FONT.title} c={C.gold}>+ {txt}</T>
      <LifeBar y={820} from={58} to={53} k={1} />
      <T x={300} y={930} s={22} f={FONT.semi} c="#7F86AA">5 anos transferidos com sucesso</T>
    </g>
  );
};

/** CENA 08 — detalhes da transação e a revelação */
export const ScreenDetails: React.FC<{k: number; reveal: number; t: number}> = ({k, reveal, t}) => {
  const rows: [string, string][] = [['VENDEDORA', 'MAYA'], ['QUANTIDADE', '5 ANOS'], ['VALOR', 'R$ 80.000'], ['STATUS', 'CONCLUÍDA']];
  const g = reveal > 0 && reveal < 0.35 ? wobble(t * 60, 3) * 14 : 0;
  return (
    <g>
      <AppBg tone={reveal > 0.2 ? 'red' : 'normal'} /><AppHeader col={reveal > 0.2 ? C.red : C.gold} />
      <T x={60} y={290} s={34} f={FONT.title} a="start" ls={1}>DETALHES DA TRANSAÇÃO</T>
      <T x={60} y={330} s={20} f={FONT.mono} a="start" c="#6F77A0">ID #TMP-5Y-80K-0001</T>
      {rows.map(([a, b], i) => (
        <g key={a} opacity={prog(k, 0.05 + i * 0.06, 0.15 + i * 0.06)}>
          <T x={60} y={420 + i * 86} s={22} f={FONT.semi} a="start" c="#8C93B8" ls={2}>{a}</T>
          <T x={540} y={420 + i * 86} s={34} f={FONT.title} a="end" c={b === '5 ANOS' ? C.gold : C.white}>{b}</T>
          <rect x={60} y={444 + i * 86} width={480} height={2} fill="#262E52" />
        </g>
      ))}
      <rect x={40} y={790} width={520} height={250} rx={26} fill={reveal > 0 ? '#3A0D1C' : '#1B2246'} stroke={reveal > 0 ? C.red : '#2C3560'} strokeWidth={4} />
      <T x={300} y={860} s={30} f={FONT.title} c={reveal > 0 ? C.red : '#8C93B8'} ls={4}>COMPRADORA:</T>
      {reveal <= 0 ? (
        <g>
          {[0, 1, 2].map((i) => <circle key={i} cx={260 + i * 40} cy={950} r={12} fill={C.white} opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * 8 - i))} />)}
        </g>
      ) : (
        <g transform={`translate(${300 + g},960) scale(${tw(reveal, 0, 0.25, 1.6, 1, ease.out)})`}>
          <T x={-3} y={0} s={70} f={FONT.title} c={C.blue} o={0.6 * (reveal < 0.4 ? 1 : 0)}>MAYA — 2041</T>
          <T x={3} y={0} s={70} f={FONT.title} c={C.magenta} o={0.6 * (reveal < 0.4 ? 1 : 0)}>MAYA — 2041</T>
          <T x={0} y={0} s={70} f={FONT.title} c={C.white}>MAYA — 2041</T>
        </g>
      )}
      {reveal > 0.3 && <T x={300} y={1110} s={22} f={FONT.mono} c={C.red} o={0.5 + 0.5 * Math.sin(t * 10)}>ERRO: DATA DE ORIGEM INVÁLIDA</T>}
    </g>
  );
};

/** CENA 09 — chamada recebida / em andamento / encerrada */
export const ScreenCall: React.FC<{state: 'incoming' | 'active' | 'ended'; t: number; since: number}> = ({state, t, since}) => {
  const g = rnd(Math.floor(t * 12)) < 0.25;
  return (
    <g>
      <AppBg tone="dark" />
      <StatusBar />
      <T x={300} y={200} s={26} f={FONT.semi} c={state === 'ended' ? C.red : '#8C93B8'} ls={4}>
        {state === 'incoming' ? 'CHAMADA RECEBIDA' : state === 'active' ? 'EM CHAMADA' : 'CHAMADA ENCERRADA'}
      </T>
      <circle cx={300} cy={420} r={130} fill="#1E2546" />
      {state === 'incoming' && [0, 1, 2].map((i) => {
        const k = ((t * 0.8 + i / 3) % 1);
        return <circle key={i} cx={300} cy={420} r={130 + k * 120} fill="none" stroke={C.red} strokeWidth={4} opacity={1 - k} />;
      })}
      <circle cx={300} cy={380} r={46} fill="#3A4370" />
      <path d="M220,500 Q300,420 380,500 Z" fill="#3A4370" />
      {g && state !== 'ended' && <T x={306} y={650} s={44} f={FONT.title} c={C.red} o={0.8}>NÚMERO DESCONHECIDO</T>}
      <T x={300} y={650} s={44} f={FONT.title} c={C.white}>NÚMERO DESCONHECIDO</T>
      {state === 'active' && (
        <g>
          <T x={300} y={720} s={32} f={FONT.mono} c={C.blue}>00:{String(Math.floor(Math.max(0, since))).padStart(2, '0')}</T>
          {Array.from({length: 24}).map((_, i) => {
            const h = 10 + Math.abs(wobble(t * 9 + i * 0.7, i)) * 70;
            return <rect key={i} x={84 + i * 18} y={860 - h / 2} width={10} height={h} rx={5} fill={C.red} opacity={0.8} />;
          })}
        </g>
      )}
      {state === 'incoming' && (
        <g>
          <circle cx={170} cy={1020} r={58} fill={C.red} />
          <circle cx={430} cy={1020} r={58} fill="#2FBF71" />
          <path d="M405,1020 q25,-30 50,0" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M145,1028 q25,24 50,0" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      )}
      {state === 'ended' && <T x={300} y={740} s={30} f={FONT.mono} c={C.red}>SINAL PERDIDO</T>}
    </g>
  );
};

/** notificação vermelha que interrompe a comemoração (CENA 07) */
export const AlertBanner: React.FC<{k: number; t: number; y?: number}> = ({k, t, y = 150}) => {
  const yy = tw(k, 0, 1, -260, y, ease.back);
  const p = 0.75 + 0.25 * Math.sin(t * 14);
  return (
    <g transform={`translate(540,${yy})`}>
      <rect x={-470} y={-80} width={940} height={170} rx={36} fill="#2A0912" opacity={0.96} />
      <rect x={-470} y={-80} width={940} height={170} rx={36} fill="none" stroke={C.red} strokeWidth={5} opacity={p} />
      <path d="M-380,30 L-340,-40 L-300,30 Z" fill={C.red} />
      <rect x={-344} y={-16} width={8} height={26} rx={3} fill="#2A0912" />
      <circle cx={-340} cy={20} r={5} fill="#2A0912" />
      <text x={-270} y={-12} fill={C.red} fontFamily={FONT.semi} fontSize={28} letterSpacing={3}>TEMPO · AGORA</text>
      <text x={-270} y={44} fill={C.white} fontFamily={FONT.title} fontSize={44}>ANOMALIA NA TRANSAÇÃO</text>
    </g>
  );
};
