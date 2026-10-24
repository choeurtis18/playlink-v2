// Rend les slides de règles en fichiers prêts à uploader dans le back-office.
// Usage : node docs/rules-assets/render.mjs <jeu> [--main=#hex] [--secondary=#hex] [--safe]
// Les .html contenant des @keyframes sont exportés en MP4 (boucle 4 s), les autres en WebP.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = dirname(fileURLToPath(import.meta.url));
const [game, ...flags] = process.argv.slice(2);
if (!game) throw new Error('Usage : node render.mjs <jeu> [--main=#hex] [--secondary=#hex] [--safe]');
const opts = Object.fromEntries(flags.map((f) => f.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? '1']));

const FPS = 30;
const DURATION = 4;
const srcDir = join(root, 'slides', game);
const outDir = join(root, 'out', game);
mkdirSync(outDir, { recursive: true });

const query = new URLSearchParams(Object.fromEntries(['main', 'secondary', 'safe'].filter((k) => opts[k]).map((k) => [k, opts[k]])));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

for (const file of readdirSync(srcDir).filter((f) => f.endsWith('.html')).sort()) {
  const name = file.replace(/\.html$/, '');
  await page.goto(`${pathToFileURL(join(srcDir, file))}?${query}`);
  await page.evaluate(() => document.fonts.ready);
  const animated = readFileSync(join(srcDir, file), 'utf8').includes('@keyframes');

  if (!animated) {
    const png = join(outDir, `${name}.png`);
    await page.screenshot({ path: png });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-quality', '85', join(outDir, `${name}.webp`)]);
    rmSync(png);
  } else {
    const frames = join(outDir, `.${name}-frames`);
    mkdirSync(frames, { recursive: true });
    for (let i = 0; i < FPS * DURATION; i++) {
      await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), (i * 1000) / FPS);
      await page.screenshot({ path: join(frames, `${String(i).padStart(4, '0')}.png`) });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', '-an',
      join(outDir, `${name}.mp4`)]);
    // Image fixe de secours (aperçu / poster)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(frames, '0045.png'), '-quality', '85', join(outDir, `${name}.webp`)]);
    rmSync(frames, { recursive: true });
  }
  console.log('✓', name);
}
await browser.close();
