import * as fs from 'fs';
import { chromium, Browser, Page, test, expect } from '@playwright/test';
import { SitemapPage } from '../helpers/SitemapPage';
import { InteriorPage } from '../helpers/InteriorPage';


test.beforeEach(async ({ page }, testInfo) => {
    
    testInfo.setTimeout(testInfo.timeout + 120000);
  });

test('Crawl Website', async () => {

  test.setTimeout(3600000);
  const sitemap = 'https://example.com/sitemap.xml';
  const logfile = 'crawl.log';

  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const sitemapPage = new SitemapPage(sitemap);
  const page: Page = await context.newPage();

  try {
   
    await sitemapPage.initialize();
    await sitemapPage.getLinks();
    const links = sitemapPage.getLinksList();

    
    fs.writeFileSync(logfile, 'Starting crawl...\n');

    for (const link of links) {
      if (link !== null) {
        try {
          await page.goto(link); 

          const interiorPage = new InteriorPage(link, page);

          try {
            
            await interiorPage.getInteriorLinks();
            await interiorPage.getInteriorImages();
            await interiorPage.getInteriorCSS();
            await interiorPage.getInteriorJS();
            await expect(interiorPage.getInteriorJS()).not.toBeNull();
            await expect(interiorPage.getInteriorJS()).not.toBeNull();

            fs.appendFileSync(logfile, `Crawling ${link}...\n`);
            fs.appendFileSync(logfile, `Interior Links: ${interiorPage.getInteriorLinksList()}\n`);
            fs.appendFileSync(logfile, `Interior Images: ${interiorPage.getInteriorImagesList()}\n`);
            fs.appendFileSync(logfile, `Interior CSS: ${interiorPage.getInteriorCSSList()}\n`);
            fs.appendFileSync(logfile, `Interior JS: ${interiorPage.getInteriorJSList()}\n`);
            fs.appendFileSync(logfile, '------------------------------\n');
          } catch (err) {
            console.error(`Error while crawling ${link}:`, err);
          }
        } catch (err) {
          if (err.message === 'Navigation timeout') {
            console.error(`Timeout occurred while opening ${link}`);
          } else {
            console.error(`Error while opening ${link}:`, err);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sitemapPage.close();
    await browser.close();
  }
});

