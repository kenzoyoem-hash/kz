import {Config} from '@remotion/cli/config';
import fs from 'fs';

// Navegador: REMOTION_CHROME (se definido) > Chromium pré-instalado > download automático do Remotion
const preinstalled = '/opt/pw-browsers/chromium';
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
else if (fs.existsSync(preinstalled)) Config.setBrowserExecutable(preinstalled);

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setPixelFormat('yuv420p');
Config.setDelayRenderTimeoutInMilliseconds(120000);
