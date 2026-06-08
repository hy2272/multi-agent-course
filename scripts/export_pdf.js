const { chromium } = require('playwright');
const path = require('path');

async function exportDeck(file) {
  const abs = path.resolve(file);
  const out = abs.replace(/\.html$/, '.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('file://' + abs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); // let fonts / charts settle

  // Force ALL slides visible & stacked so every one prints (defeats the
  // transform/active-only navigation that would otherwise show just slide 1).
  await page.addStyleTag({ content: `
    * { animation: none !important; transition: none !important; }
    html, body { overflow: visible !important; height: auto !important; width: auto !important; }
    #deck, .presentation { display: block !important; transform: none !important; width: 1280px !important; height: auto !important; overflow: visible !important; }
    .slide {
      flex: none !important;
      position: relative !important;
      left: auto !important; top: auto !important; right: auto !important; bottom: auto !important;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      page-break-after: always;
      break-after: page;
      width: 1280px !important;
      min-height: 720px !important;
      height: 720px !important;
      overflow: hidden !important;
    }
    .slide [data-anim] { opacity: 1 !important; transform: none !important; }
    #nav-dots, .nav-dots, #slide-counter, .slide-counter, .nav-arrows { display: none !important; }
  `});
  await page.waitForTimeout(400);

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  await page.pdf({
    path: out,
    width: '1280px',
    height: '720px',
    printBackground: true,
    pageRanges: '1-' + slideCount,
  });
  await browser.close();
  console.log('Saved:', out, '(' + slideCount + ' slides)');
}

(async () => {
  for (const f of process.argv.slice(2)) {
    await exportDeck(f);
  }
})();
