import { log } from 'console';
import { chromium } from 'playwright';
import type { Page, Response, Request } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: false,
  });
  const context = await browser.newContext({
    viewport: null,
  });
  const page = await context.newPage();

  //const site = 'musclemilkliftingproject.com/';
  const site = 'louren.co.in/redirect302/redirect301/www.example.com';
  const siteHttp = `http://${site}`;
  const siteHttps = `https://${site}`;

  let redirects = [];
  let request: Request | null;
  try {
    request = (await page.goto(siteHttps, { waitUntil: 'domcontentloaded' }))?.request()!;
  } catch (error) {
    request = (await page.goto(siteHttp, { waitUntil: 'domcontentloaded' }))?.request()!;
  }
  let previousRequest: Request | null = request;
  redirects.push(request.url());
  while ((previousRequest = previousRequest.redirectedFrom())) {
    redirects.push(previousRequest.url());
  }
  redirects.pop();
  redirects.reverse();
  console.log(redirects);
  // await page.waitForTimeout(10000);
  await page.close();
  await context.close();
  await browser.close();
})();
