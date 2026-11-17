import React from 'react';
import {C} from '../styles/theme';
import {rnd, wobble} from '../lib/anim';
import {useCam} from '../components/Camera';

/* Cenários oficiais de SALDO FINAL — 2D com contorno preto, sem nenhum texto (a edição adiciona os textos). */
const OL = C.outline;
const R: React.FC<{x: number; y: number; w: number; h: number; f: string; r?: number; sw?: number; o?: number}> = ({x, y, w, h, f, r = 0, sw = 5, o = 1}) =>
  <rect x={x} y={y} width={w} height={h} rx={r} fill={f} stroke={OL} strokeWidth={sw} opacity={o} />;

/** símbolo da Áurea: ampulheta dentro de um círculo (sem letras) */
export const AureaLogo: React.FC<{x: number; y: number; s?: number; col?: string; glow?: number}> = ({x, y, s = 1, col = C.gold, glow = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 && <circle r={90} fill={col} opacity={0.2 * glow} />}
    <circle r={58} fill="#1C1724" stroke={OL} strokeWidth={6} />
    <circle r={48} fill="none" stroke={col} strokeWidth={6} />
    <path d="M-20,-30 L20,-30 L4,-2 L4,2 L20,30 L-20,30 L-4,2 L-4,-2 Z" fill={col} stroke={OL} strokeWidth={3} />
  </g>
);

/** tubo de vidro no teto com anos (partículas douradas) correndo dentro */
export const GoldTube: React.FC<{x0: number; x1: number; y: number; t: number; speed?: number; boost?: number}> = ({x0, x1, y, t, speed = 260, boost = 0}) => {
  const n = Math.floor((x1 - x0) / 46);
  return (
    <g>
      <rect x={x0} y={y - 22} width={x1 - x0} height={44} rx={22} fill="#2A2533" stroke={OL} strokeWidth={6} />
      {Array.from({length: n}).map((_, i) => {
        const px = x0 + ((i * 46 + t * speed * (1 + boost)) % (x1 - x0));
        return <circle key={i} cx={px} cy={y + wobble(t * 3 + i, i) * 6} r={7 + (i % 3) * 2} fill={i % 4 ? C.gold : C.goldLight} opacity={0.75 + 0.25 * boost} />;
      })}
      <rect x={x0 + 10} y={y - 16} width={x1 - x0 - 20} height={8} rx={4} fill="#fff" opacity={0.18} />
    </g>
  );
};

/** cidade noturna (camadas) com a TORRE DA ÁUREA — mesmo seed = mesma cidade em todos os episódios */
export const Skyline: React.FC<{seed: string; x0: number; x1: number; base: number; minH: number; maxH: number; col: string; t: number; winP?: number}> = ({seed, x0, x1, base, minH, maxH, col, t, winP = 0.2}) => {
  const out: React.ReactNode[] = [];
  let x = x0, i = 0;
  while (x < x1) {
    const w = 90 + rnd(`${seed}w${i}`) * 120, h = minH + rnd(`${seed}h${i}`) * (maxH - minH);
    out.push(<rect key={i} x={x} y={base - h} width={w} height={h + 400} fill={col} stroke={OL} strokeWidth={5} />);
    const cols = Math.floor(w / 26), rows = Math.floor(h / 34);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = rnd(`${seed}${i}.${r}.${c}`);
      if (v < winP) out.push(<rect key={`${i}-${r}-${c}`} x={x + 10 + c * 26} y={base - h + 22 + r * 34} width={12} height={16} fill={v < winP * 0.3 ? C.magenta : v < winP * 0.6 ? C.goldLight : C.blue} opacity={0.75} />);
    }
    x += w + 6; i++;
  }
  return <g>{out}</g>;
};
export const AureaTower: React.FC<{x: number; base: number; s?: number; t: number; glow?: number}> = ({x, base, s = 1, t, glow = 0}) => (
  <g transform={`translate(${x},${base}) scale(${s})`}>
    <circle cx={0} cy={-1180} r={220 + glow * 160} fill={C.gold} opacity={0.12 + glow * 0.25} />
    <path d="M-110,0 L-80,-1000 L0,-1120 L80,-1000 L110,0 Z" fill="#1E1A28" stroke={OL} strokeWidth={6} />
    <path d="M-40,0 L-30,-990 L0,-1060 L30,-990 L40,0 Z" fill="#2A2436" />
    {Array.from({length: 22}).map((_, i) => <rect key={i} x={-70 + (i % 2) * 80} y={-960 + Math.floor(i / 2) * 84} width={60} height={10} fill={C.gold} opacity={0.35 + 0.3 * Math.sin(t * 2 + i)} />)}
    <path d="M-34,-1180 L34,-1180 L8,-1140 L8,-1130 L34,-1090 L-34,-1090 L-8,-1130 L-8,-1140 Z" fill={C.gold} stroke={OL} strokeWidth={5} opacity={0.8 + 0.2 * glow} />
    <rect x={-3} y={-1300} width={6} height={120} fill="#1E1A28" />
    <circle cx={0} cy={-1302} r={8} fill={C.red} opacity={0.6 + 0.4 * Math.sin(t * 4)} />
  </g>
);
export const NightSky: React.FC<{x?: number; y?: number; w?: number; h?: number}> = ({x = -800, y = -800, w = 4000, h = 3200}) => (
  <g>
    <defs>
      <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#090B16" /><stop offset="0.6" stopColor="#1A1838" /><stop offset="1" stopColor="#3A2350" />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill="url(#nsky)" />
  </g>
);

/** chuva (traços) — usada na rua e vista pelas janelas */
export const Rain: React.FC<{t: number; x?: number; y?: number; w?: number; h?: number; n?: number; o?: number; ang?: number}> = ({t, x = -300, y = -300, w = 1700, h = 2600, n = 120, o = 0.35, ang = 12}) => (
  <g opacity={o}>
    {Array.from({length: n}).map((_, i) => {
      const px = x + rnd(`rx${i}`) * w, sp = 1400 + rnd(`rs${i}`) * 600;
      const py = y + ((rnd(`ry${i}`) * h + t * sp) % h);
      return <line key={i} x1={px} y1={py} x2={px - ang} y2={py + 60} stroke="#A9C7FF" strokeWidth={3} strokeLinecap="round" />;
    })}
  </g>
);

/* ============================ AGÊNCIA ÁUREA ============================
 * Mundo: chão em y = 1500. Balcão dos guichês x 120–980 (guichê central em x 540), fila x 1000–2050,
 * porta de vidro em x 2150. Tubos dourados no teto levam os anos vendidos para a direita (para a torre). */
export const AGENCY = {floor: 1500, counterTop: 1200, scanner: {x: 640, y: 1188}, attendant: 540, door: 2200};

export const AgencyBack: React.FC<{t: number; boost?: number}> = ({t, boost = 0}) => (
  <g>
    <rect x={-600} y={-800} width={3600} height={2300} fill="#E9DFC7" />
    {/* faixas verticais de mármore e luz quente */}
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={-500 + i * 240} y={-800} width={120} height={2300} fill="#DCCFB0" />)}
    <rect x={-600} y={420} width={3600} height={18} fill={C.gold} stroke={OL} strokeWidth={5} />
    {/* logotipo grande */}
    <AureaLogo x={540} y={640} s={1.9} glow={0.6} />
    {/* telões de propaganda: família sorrindo + barra dourada (sem texto) */}
    {[[1200, 560], [1760, 560]].map(([x, y], i) => (
      <g key={i}>
        <R x={x} y={y} w={380} h={240} f="#1C1724" r={14} sw={7} />
        <rect x={x + 16} y={y + 16} width={348} height={208} rx={8} fill={i ? '#3B2A55' : '#2E3B5C'} />
        {[0, 1, 2].map((k) => <g key={k}><circle cx={x + 100 + k * 90} cy={y + 100 + (k === 1 ? -10 : 0)} r={26 + (k === 1 ? 6 : 0)} fill={['#E2B08C', '#8D5A3B', '#F1C7A5'][k]} stroke={OL} strokeWidth={4} /><path d={`M${x + 70 + k * 90},${y + 190} q30,-60 60,0`} fill={['#E0469B', C.gold, C.teal][k]} stroke={OL} strokeWidth={4} /></g>)}
        <rect x={x + 40} y={y + 200} width={300 * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.8 + i)))} height={12} rx={6} fill={C.gold} />
      </g>
    ))}
    {/* painel de senha: ampulheta + pontos (sem números) */}
    <R x={140} y={520} w={170} h={110} f="#1C1724" r={12} sw={6} />
    <path d="M190,545 L220,545 L208,575 L220,605 L190,605 L202,575 Z" fill={C.gold} />
    {[0, 1, 2].map((k) => <circle key={k} cx={244 + k * 18} cy={575} r={6} fill={k <= Math.floor(t * 2) % 3 ? C.goldLight : '#3A3344'} />)}
    {/* tubos no teto */}
    <GoldTube x0={-300} x1={3000} y={250} t={t} boost={boost} />
    <GoldTube x0={-300} x1={3000} y={330} t={t + 2} speed={200} boost={boost * 0.6} />
    {/* porta de vidro com a noite chuvosa lá fora */}
    <R x={2120} y={760} w={420} h={740} f="#141A30" r={8} sw={8} />
    <rect x={2140} y={780} width={380} height={700} fill="#1E2848" />
    <Rain t={t} x={2140} y={780} w={380} h={700} n={30} o={0.5} />
    <rect x={2326} y={760} width={8} height={740} fill={OL} />
    {/* chão brilhante */}
    <rect x={-600} y={1500} width={3600} height={900} fill="#C9B994" stroke={OL} strokeWidth={6} />
    {Array.from({length: 18}).map((_, i) => <rect key={i} x={-600 + i * 200} y={1500} width={4} height={900} fill="#B6A57F" />)}
    {/* plantas */}
    {[60, 1040].map((x) => <g key={x}><R x={x} y={1380} w={90} h={120} f="#3A3045" r={10} /><path d={`M${x + 45},1380 q-60,-120 -20,-200 q20,90 20,200 q10,-130 60,-170 q-10,100 -60,170`} fill="#3E7A52" stroke={OL} strokeWidth={5} /></g>)}
    {/* faixas e postes da fila */}
    {[1100, 1400, 1700, 2000].map((x, i, a) => <g key={x}>
      {i < a.length - 1 && <path d={`M${x},1360 Q${x + 150},1390 ${x + 300},1360`} stroke={C.goldDeep} strokeWidth={10} fill="none" />}
      <rect x={x - 8} y={1350} width={16} height={150} fill="#B48A3A" stroke={OL} strokeWidth={4} />
      <circle cx={x} cy={1350} r={14} fill={C.gold} stroke={OL} strokeWidth={4} />
    </g>)}
  </g>
);

/** balcão dos guichês (fica NA FRENTE da atendente e atrás de quem está na fila) */
export const AgencyCounter: React.FC<{t: number; scan?: number}> = ({t, scan = 0}) => (
  <g>
    {/* divisórias de vidro */}
    {[150, 380, 700, 930].map((x) => <rect key={x} x={x - 6} y={860} width={12} height={340} fill="#BFD4E6" stroke={OL} strokeWidth={4} opacity={0.9} />)}
    <rect x={150} y={860} width={780} height={20} fill="#BFD4E6" stroke={OL} strokeWidth={4} opacity={0.6} />
    <R x={100} y={1190} w={900} h={40} f="#F4ECD8" r={10} sw={6} />
    <R x={120} y={1230} w={860} h={270} f="#2A2333" sw={6} />
    <rect x={120} y={1300} width={860} height={14} fill={C.gold} />
    {/* leitor de pulso */}
    <g transform="translate(640,1188)">
      <ellipse cx={0} cy={0} rx={70} ry={18} fill="#1C1724" stroke={OL} strokeWidth={5} />
      <ellipse cx={0} cy={-4} rx={52} ry={11} fill={C.gold} opacity={0.4 + 0.6 * scan} />
      {scan > 0 && <ellipse cx={0} cy={-60} rx={60 + scan * 20} ry={80} fill={C.gold} opacity={0.18 * scan} />}
    </g>
    {/* monitor do guichê (de costas para o público) */}
    <R x={380} y={1080} w={150} h={100} f="#1C1724" r={8} />
    <rect x={448} y={1180} width={14} height={12} fill={OL} />
    <rect x={390} y={1090} width={130} height={80} rx={4} fill={C.gold} opacity={0.08 + 0.05 * Math.sin(t * 3)} />
  </g>
);

/* =============================== HOSPITAL ===============================
 * Quarto 2D: cama à esquerda (Helena sentada, centro x 380), monitor cardíaco na parede,
 * suporte de soro à esquerda da cama, terminal da Áurea à direita da cama (x 700), janela à direita
 * com a cidade e a torre da Áurea (x 760–1060), porta no extremo direito (x 1180). Chão em y = 1500. */
export const HOSP = {floor: 1500, helena: 380, terminal: 700, iv: 150, door: 1260, window: {x: 760, y: 560, w: 330, h: 520}};

export const HospitalBack: React.FC<{t: number; towerGlow?: number; alarm?: number; dark?: number}> = ({t, towerGlow = 0, alarm = 0}) => {
  const cam = useCam();
  const px = (cam.x - 540) * 0.5;
  const W = HOSP.window;
  return (
    <g>
      <rect x={-800} y={-800} width={3400} height={2300} fill="#CFE0E6" />
      <rect x={-800} y={1080} width={3400} height={420} fill="#B9CFD6" />
      <rect x={-800} y={1072} width={3400} height={14} fill="#8FB0BA" stroke={OL} strokeWidth={4} />
      {/* janela com a cidade e a torre */}
      <defs><clipPath id="hwin"><rect x={W.x} y={W.y} width={W.w} height={W.h} /></clipPath></defs>
      <g clipPath="url(#hwin)">
        <g transform={`translate(${px},0)`}>
          <NightSky x={W.x - 400} y={W.y - 100} w={W.w + 900} h={W.h + 300} />
          <Skyline seed="hosp-far" x0={W.x - 400} x1={W.x + W.w + 500} base={W.y + W.h - 60} minH={60} maxH={240} col="#211D3A" t={t} winP={0.15} />
          <AureaTower x={W.x + 210} base={W.y + W.h + 40} s={0.42} t={t} glow={towerGlow} />
          <Skyline seed="hosp-near" x0={W.x - 400} x1={W.x + W.w + 500} base={W.y + W.h + 10} minH={20} maxH={110} col="#171429" t={t} winP={0.2} />
        </g>
        <Rain t={t} x={W.x} y={W.y} w={W.w} h={W.h} n={26} o={0.45} />
      </g>
      <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="none" stroke={OL} strokeWidth={14} />
      <rect x={W.x + W.w / 2 - 5} y={W.y} width={10} height={W.h} fill={OL} />
      <rect x={W.x - 20} y={W.y + W.h} width={W.w + 40} height={26} rx={4} fill="#E8EEF0" stroke={OL} strokeWidth={5} />
      {/* monitor cardíaco */}
      <R x={420} y={620} w={240} h={170} f="#14202A" r={14} sw={7} />
      <path d={(() => {
        let d = 'M440,705'; const ph = (t * 0.9) % 1;
        for (let i = 0; i <= 20; i++) {
          const x = 440 + i * 10; const k = ((i / 20) - ph + 1) % 1;
          const y = alarm > 0.5 ? 705 : k > 0.45 && k < 0.5 ? 650 : k > 0.5 && k < 0.55 ? 740 : 705;
          d += ` L${x},${y}`;
        }
        return d;
      })()} stroke={alarm > 0 ? C.red : '#4CF0A0'} strokeWidth={5} fill="none" strokeLinejoin="round" />
      <circle cx={630} cy={645} r={9} fill={alarm > 0 ? C.red : '#4CF0A0'} opacity={alarm > 0 ? (Math.sin(t * 16) > 0 ? 1 : 0.2) : 0.8} />
      {/* porta */}
      <R x={1180} y={760} w={260} h={740} f="#9DB8C2" r={6} sw={7} />
      <rect x={1200} y={790} width={90} height={160} rx={4} fill="#DCEBF0" stroke={OL} strokeWidth={4} />
      <circle cx={1210} cy={1150} r={12} fill="#C9CED8" stroke={OL} strokeWidth={4} />
      {/* luz fria do teto */}
      <rect x={200} y={300} width={600} height={24} rx={12} fill="#F4FBFF" stroke={OL} strokeWidth={5} />
      <rect x={-800} y={1500} width={3400} height={900} fill="#8FA9B2" stroke={OL} strokeWidth={6} />
      {Array.from({length: 16}).map((_, i) => <rect key={i} x={-800 + i * 220} y={1500} width={4} height={900} fill="#7E98A1" />)}
    </g>
  );
};

/** suporte de soro (separado: Zara o pega como "arma" na cena 5) */
export const IVPole: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-6} y={-720} width={12} height={720} fill="#C9CED8" stroke={OL} strokeWidth={4} />
    <path d="M-60,-720 L60,-720" stroke={OL} strokeWidth={8} strokeLinecap="round" />
    <path d="M-60,-720 L60,-720" stroke="#C9CED8" strokeWidth={4} strokeLinecap="round" />
    <R x={-44} y={-700} w={52} h={86} f="#DDF1FF" r={14} sw={4} o={0.95} />
    <rect x={-40} y={-660} width={44} height={42} rx={10} fill="#9ED6FF" />
    <path d="M-18,-614 Q-30,-400 -10,-300" stroke="#9ED6FF" strokeWidth={4} fill="none" />
    <path d="M-50,0 L50,0" stroke={OL} strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** cama: cabeceira atrás da Helena; colcha na frente (cobre as pernas) */
export const BedBack: React.FC = () => (
  <g>
    <R x={150} y={900} w={460} h={330} f="#E8EEF0" r={30} sw={7} />
    <R x={180} y={960} w={400} h={140} f="#FFFFFF" r={50} sw={6} />
  </g>
);
export const BedFront: React.FC = () => (
  <g>
    <R x={120} y={1180} w={560} h={150} f="#7FA6C9" r={40} sw={7} />
    <path d="M150,1240 Q400,1270 650,1240" stroke="#6A8FB2" strokeWidth={6} fill="none" />
    <R x={130} y={1320} w={540} h={60} f="#C9D4DA" r={10} sw={6} />
    <rect x={160} y={1380} width={16} height={120} fill="#9AA6AE" stroke={OL} strokeWidth={4} />
    <rect x={624} y={1380} width={16} height={120} fill="#9AA6AE" stroke={OL} strokeWidth={4} />
  </g>
);

/** terminal da Áurea: tela com ícones (sem texto). mode: 'idle' | 'transfer' | 'glitch' */
export const AureaTerminal: React.FC<{x: number; y: number; t: number; mode?: 'idle' | 'transfer' | 'glitch'; k?: number; s?: number}> = ({x, y, t, mode = 'idle', k = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-10} y={-300} width={20} height={300} fill="#3A3344" stroke={OL} strokeWidth={4} />
    <path d="M-70,0 L70,0" stroke={OL} strokeWidth={12} strokeLinecap="round" />
    <R x={-110} y={-470} w={220} h={180} f="#1C1724" r={16} sw={7} />
    <g transform="translate(0,-380)">
      {mode === 'glitch' ? (
        <g>
          <rect x={-96} y={-76} width={192} height={152} rx={8} fill="#2A0E18" />
          {Array.from({length: 6}).map((_, i) => <rect key={i} x={-96 + rnd(`tg${Math.floor(t * 20)}${i}`) * 100} y={-70 + i * 24} width={40 + rnd(`tw${Math.floor(t * 20)}${i}`) * 80} height={8} fill={i % 2 ? C.red : C.gold} opacity={0.8} />)}
        </g>
      ) : mode === 'transfer' ? (
        <g>
          <rect x={-96} y={-76} width={192} height={152} rx={8} fill="#221C2E" />
          {/* duas pessoas (ícones) e dez segmentos dourados passando de uma para a outra */}
          {[-58, 58].map((px, i) => <g key={i}><circle cx={px} cy={-24} r={14} fill={i ? '#94B2CC' : C.gold} stroke={OL} strokeWidth={3} /><path d={`M${px - 22},12 q22,-34 44,0 Z`} fill={i ? '#94B2CC' : C.gold} stroke={OL} strokeWidth={3} /></g>)}
          {Array.from({length: 10}).map((_, i) => {
            const p = ((t * 0.9 + i / 10) % 1);
            return <rect key={i} x={-40 + p * 80 - 3} y={-6} width={6} height={14} rx={2} fill={C.gold} opacity={Math.sin(p * Math.PI)} />;
          })}
          <rect x={-80} y={42} width={160} height={14} rx={7} fill="#3A3344" />
          <rect x={-80} y={42} width={160 * k} height={14} rx={7} fill={C.gold} />
        </g>
      ) : (
        <g><rect x={-96} y={-76} width={192} height={152} rx={8} fill="#221C2E" /><AureaLogo x={0} y={0} s={0.9} glow={0.4 + 0.2 * Math.sin(t * 3)} /></g>
      )}
    </g>
  </g>
);
