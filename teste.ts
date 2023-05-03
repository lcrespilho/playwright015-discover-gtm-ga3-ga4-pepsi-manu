import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    args: ['--start-maximized'],
    headless: false,
    devtools: false,
  });
  const context = await browser.newContext({
    viewport: null,
  });
  const page = await context.newPage();

  const response = await page.goto('https://clipsy.rs');
  console.log('page.content():', await page.evaluate('document.documentElement.innerText'));

  await page.close();
  await context.close();
  await browser.close();
})();
