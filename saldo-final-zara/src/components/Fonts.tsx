import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT} from '../styles/theme';

const faces: [string, string][] = [
  [FONT.title, 'Montserrat-Black.woff2'],
  [FONT.bold, 'Montserrat-ExtraBold.woff2'],
  [FONT.semi, 'Montserrat-SemiBold.woff2'],
  [FONT.mono, 'JetBrainsMono-Bold.woff2'],
];
// carrega as fontes locais antes do primeiro quadro (textos reais, nunca gerados como imagem)
if (typeof document !== 'undefined') {
  const h = delayRender('fontes');
  Promise.all(faces.map(([fam, file]) => {
    const f = new FontFace(fam, `url(${staticFile('fonts/' + file)})`);
    (document.fonts as any).add(f);
    return f.load();
  })).then(() => continueRender(h)).catch(() => continueRender(h));
}
export const Fonts = () => null;
