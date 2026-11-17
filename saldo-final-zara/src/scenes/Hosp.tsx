import React from 'react';
import {Stage, Layer, Cam} from '../components/Camera';
import {HospitalBack, BedBack, BedFront, IVPole, AureaTerminal} from '../sets/Sets';
import {C} from '../styles/theme';

/** posições fixas no quarto (continuidade) */
export const POS = {helena: 380, iv: 700, zara: 830, terminal: 1010, dante: 1310, floor: 1500, helenaY: 1500, helenaS: 0.7, s: 0.66};

/** palco do quarto de hospital: fundo, cabeceira, Helena (children), colcha, demais personagens (front) */
export const HospStage: React.FC<{t: number; cam: Cam; helena?: React.ReactNode; front?: React.ReactNode; over?: React.ReactNode;
  towerGlow?: number; alarm?: number; ivInHand?: boolean; term?: 'idle' | 'transfer' | 'glitch'; termK?: number; red?: number; dark?: number}> =
  ({t, cam, helena, front, over, towerGlow = 0, alarm = 0, ivInHand = false, term = 'idle', termK = 0, red = 0, dark = 0}) => (
  <Stage cam={cam} bg="#CFE0E6">
    <Layer depth={0.92}><HospitalBack t={t} towerGlow={towerGlow} alarm={alarm} /></Layer>
    <Layer depth={1}>
      <BedBack />
      {helena}
      <BedFront />
      {!ivInHand && <IVPole x={POS.iv} y={POS.floor} />}
      <AureaTerminal x={POS.terminal} y={POS.floor} t={t} mode={term} k={termK} />
      {front}
    </Layer>
    {red > 0 && <rect x={-2000} y={-2000} width={6000} height={6000} fill={C.red} opacity={red} />}
    {dark > 0 && <rect x={-2000} y={-2000} width={6000} height={6000} fill="#05060C" opacity={dark} />}
    {over}
  </Stage>
);
