import React from 'react';
import {Stage, Layer, Cam} from '../components/Camera';
import {ApartmentBack, ApartmentFront, ApartmentMid, RoomLight} from '../components/Background';
import {C} from '../styles/theme';

/** Palco do apartamento da Maya (mesmo cenário em todas as cenas internas), com camadas de profundidade. */
export const AptStage: React.FC<{
  t: number; cam: Cam; children?: React.ReactNode; front?: React.ReactNode; over?: React.ReactNode;
  fridgeOpen?: number; dark?: number; tint?: string; billsLifted?: boolean; lamp?: number;
  phoneOnSofa?: number; phoneGlow?: string; phoneBuzz?: number; windowGlow?: number;
}> = ({t, cam, children, front, over, fridgeOpen = 0, dark = 0, tint, billsLifted, lamp = 1, phoneOnSofa = 0, phoneGlow, phoneBuzz = 0, windowGlow = 1}) => (
  <Stage cam={cam} bg={C.ink}>
    <Layer depth={0.92}>
      <ApartmentBack t={t} fridgeOpen={fridgeOpen} light={lamp} windowGlow={windowGlow} />
    </Layer>
    <Layer depth={1}>
      <ApartmentMid t={t} billsLifted={billsLifted} phoneOnSofa={phoneOnSofa} phoneGlow={phoneGlow} phoneBuzz={phoneBuzz} />
      {children}
      <ApartmentFront />
      {front}
    </Layer>
    <Layer depth={1.3}>
      {/* primeiro plano: planta desfocada no canto (profundidade) */}
      <g opacity={0.95}>
        <path d="M-120,2200 C-60,1900 -10,1800 60,1700 C30,1850 20,1980 40,2200 Z" fill="#070A14" />
        <path d="M-40,2200 C40,1960 120,1880 230,1820 C150,1940 110,2050 100,2200 Z" fill="#090D1A" />
        <path d="M1260,2300 C1300,2050 1380,1960 1500,1900 C1430,2050 1420,2150 1430,2300 Z" fill="#070A14" />
      </g>
    </Layer>
    <RoomLight dark={dark} tint={tint} />
    {over}
  </Stage>
);
