import React from 'react';
import {staticFile, continueRender, delayRender} from 'remotion';

const faces = [
  ['Montserrat Black', 'Montserrat-Black.woff2'],
  ['Montserrat ExtraBold', 'Montserrat-ExtraBold.woff2'],
  ['Montserrat SemiBold', 'Montserrat-SemiBold.woff2'],
  ['JetBrains Mono', 'JetBrainsMono-Bold.woff2'],
];
// carrega as fontes antes do primeiro frame (evita fallback no render)
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(faces.map(([fam, file]) => {
    const f = new FontFace(fam, `url(${staticFile('fonts/' + file)})`);
    (document.fonts as any).add(f);
    return f.load();
  })).then(() => continueRender(h)).catch(() => continueRender(h));
}
export const Fonts: React.FC = () => null;
