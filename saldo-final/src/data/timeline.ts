/** Linha do tempo oficial do EP. 01 (segundos). 89 s = 2670 quadros a 30 fps. */
export const FPS = 30;
export const DURATION_S = 89;
export const DURATION_FRAMES = DURATION_S * FPS; // 2670 (limite absoluto: 2700)

export const SCENES = [
  {n: 1,  id: 'gancho',        title: 'Gancho',                         start: 0,  end: 3},
  {n: 2,  id: 'mundo',         title: 'Um mundo onde vida é dinheiro',  start: 3,  end: 11},
  {n: 3,  id: 'boletos',       title: 'Os boletos',                     start: 11, end: 18},
  {n: 4,  id: 'proposta',      title: 'A proposta',                     start: 18, end: 26},
  {n: 5,  id: 'noah',          title: 'O aviso de Noah',                start: 26, end: 35},
  {n: 6,  id: 'venda',         title: 'A venda',                        start: 35, end: 43},
  {n: 7,  id: 'dinheiro',      title: 'O dinheiro caiu',                start: 43, end: 50},
  {n: 8,  id: 'descoberta',    title: 'A descoberta',                   start: 50, end: 58},
  {n: 9,  id: 'ligacao',       title: 'A ligação impossível',           start: 58, end: 68},
  {n: 10, id: 'aviso-final',   title: 'O aviso final',                  start: 68, end: 77},
  {n: 11, id: 'votacao',       title: 'Votação',                        start: 77, end: 89},
] as const;

/** posição vertical (centro) das legendas por trecho — fora da área de UI das redes e dos textos de tela */
export const CAPTION_Y: {from: number; y: number}[] = [
  {from: 0, y: 1330},
  {from: 3, y: 1420},
  {from: 11, y: 1440},
  {from: 19.0, y: 1500},  // insert do celular: legenda abaixo da tela do app
  {from: 21.4, y: 1440},
  {from: 26, y: 1000},    // videochamada dividida: legenda na divisória
  {from: 35, y: 1440},
  {from: 43, y: 1440},
  {from: 50, y: 1440},
  {from: 53.0, y: 1560},
  {from: 55.0, y: 1440},
  {from: 58, y: 1440},
  {from: 68, y: 1460},
  {from: 77, y: 1560},
];
