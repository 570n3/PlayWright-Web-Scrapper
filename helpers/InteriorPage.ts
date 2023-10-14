import { Browser, Page } from '@playwright/test';

export class InteriorPage {
  private url: string;
  private page: Page;
  private interiorLinks: string[] = [];
  private interiorImages: string[] = [];
  private interiorCSS: string[] = [];
  private interiorJS: string[] = [];

  constructor(url: string, page: Page) {
    this.url = url;
    this.page = page;
  }

  async getInteriorLinks() {
    const linkElements = await this.page.$$('a');
    this.interiorLinks = await Promise.all(
      linkElements.map(async (linkElement) => {
        const href = await linkElement.getAttribute('href');
        return href || ''; 
      })
    );
  }

  async getInteriorImages() {
    const imageElements = await this.page.$$('img');
    this.interiorImages = await Promise.all(
      imageElements.map(async (imageElement) => {
        const src = await imageElement.getAttribute('src');
        return src || ''; 
      })
    );
  }

  async getInteriorCSS() {
    const cssElements = await this.page.$$('link');
    this.interiorCSS = await Promise.all(
      cssElements.map(async (cssElement) => {
        const href = await cssElement.getAttribute('href');
        return href || ''; 
      })
    );
  }

  async getInteriorJS() {
    const jsElements = await this.page.$$('script');
    this.interiorJS = await Promise.all(
      jsElements.map(async (jsElement) => {
        const src = await jsElement.getAttribute('src');
        return src || ''; 
      })
    );
  }

  getInteriorLinksList() {
    return this.interiorLinks;
  }

  getInteriorImagesList() {
    return this.interiorImages;
  }

  getInteriorCSSList() {
    return this.interiorCSS;
  }

  getInteriorJSList() {
    return this.interiorJS;
  }
}
