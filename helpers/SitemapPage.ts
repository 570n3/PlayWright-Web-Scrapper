import { chromium, Browser, Page } from '@playwright/test';

export class SitemapPage {
  private sitemap: string;
  private browser: Browser;
  private page: Page;
  private links: (string | null)[] = [];

  constructor(sitemap: string) {
    this.sitemap = sitemap;
  }

  async initialize() {
    this.browser = await chromium.launch();
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    await this.page.goto(this.sitemap);
  }

  async getLinks() {
    const linkElements = await this.page.$$('loc');
    this.links = await Promise.all(
      linkElements.map(async (linkElement) => {
        const link = await linkElement.textContent();
        return link || null; 
      })
    );
  }

  getLinksList() {
    return this.links;
  }

  async close() {
    await this.browser.close();
  }
}
