import puppeteer from 'puppeteer';
import { browserOpts } from '../../config';
import { BookInfo } from '../types/BookInfo';

interface BookItem extends BookInfo {
    meta?: string;
}

export async function getSearchResults(url: string): Promise<BookItem[]> {
    const browser = await puppeteer.launch(browserOpts);
    const page = await browser.newPage();

    await page.goto(url);
    const books = await page.$$eval('#root div.item-root', arr => {
        return arr.map(e => {
            const a = e.querySelector('a.title-text') as HTMLAnchorElement;
            const img = e.querySelector<HTMLImageElement>('img');
            const meta = e.querySelector<HTMLElement>('.meta.abstract');
            const rating = e.querySelector<HTMLElement>('.rating_nums');

            const bookItem: BookItem = { title: a.innerText, url: a.href };

            if (img) bookItem.image = img.src;
            if (rating) bookItem.rating = rating.innerText;
            if (meta) bookItem.meta = meta.innerText;
            return bookItem;
        });
    });

    await page.close();
    await browser.close();
    return books;
}
