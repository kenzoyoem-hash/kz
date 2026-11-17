import React, {createContext, useContext} from 'react';

/** Câmera 2.5D: cada <Layer depth> se move proporcionalmente à profundidade (parallax).
 * depth 1 = plano dos personagens; < 1 = mais distante; > 1 = primeiro plano. */
export type Cam = {x: number; y: number; z: number; r?: number};
const CamCtx = createContext<Cam>({x: 540, y: 960, z: 1});
export const useCam = () => useContext(CamCtx);

export const Stage: React.FC<{cam: Cam; bg?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({cam, bg, children, style}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, background: bg, ...style}}>
    <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>
  </svg>
);

export const Layer: React.FC<{depth?: number; children: React.ReactNode; opacity?: number}> = ({depth = 1, children, opacity}) => {
  const c = useCam();
  const z = 1 + (c.z - 1) * depth;
  const cx = 540 + (c.x - 540) * depth, cy = 960 + (c.y - 960) * depth;
  return (
    <g opacity={opacity} transform={`translate(540 960) rotate(${(c.r ?? 0) * Math.min(1, depth)}) scale(${z}) translate(${-cx} ${-cy})`}>
      {children}
    </g>
  );
};
