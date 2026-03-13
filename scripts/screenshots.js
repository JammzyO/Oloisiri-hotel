const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3040', { waitUntil: 'networkidle' });
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < scrollHeight; y += 250) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: './shot-hero2.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await page.screenshot({ path: './shot-full2.png', fullPage: true });
  for (const [name, y] of [['reservation',890],['welcome',1400],['amenities',2400],['suites',3400],['facilities',4400],['instagram',5400]]) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `./shot-${name}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
  await browser.close();
  console.log('done');
})();
