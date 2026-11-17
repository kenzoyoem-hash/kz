/** Linha do tempo do EP. 01 — "Quanto vale sua vida?" (segundos). 89 s = 2670 quadros. */
export const FPS = 30;
export const DURATION_S = 89;
export const DURATION_FRAMES = DURATION_S * FPS;
export const SCENES = [
  {n: 1, id: 'agencia', start: 0, end: 12.4},
  {n: 2, id: 'ligacao', start: 12.4, end: 19.6},
  {n: 3, id: 'corrida', start: 19.6, end: 24.6},
  {n: 4, id: 'hospital', start: 24.6, end: 38.6},
  {n: 5, id: 'saque', start: 38.6, end: 53.3},
  {n: 6, id: 'segredo', start: 53.3, end: 58.3},
  {n: 7, id: 'ciro', start: 58.3, end: 72.0},
  {n: 8, id: 'cliffhanger', start: 72.0, end: 77.4},
  {n: 9, id: 'votacao', start: 77.4, end: 89},
] as const;
export const CAPTION_Y: {from: number; y: number}[] = [{from: 0, y: 1440}, {from: 77.4, y: 1560}];
