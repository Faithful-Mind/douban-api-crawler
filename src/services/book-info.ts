import cheerio from 'cheerio';
import { BookInfo } from '../types/BookInfo';

export function getBookInfo(pageBody: string, url: string): BookInfo {
    // remove unneccessary spaces and line breaks in body
    const $ = cheerio.load(pageBody.replace(/\s*\n\s*/g, ' '));
    // preserve interested line breaks
    $('#info').find('br').replaceWith('\n');
    $('#link-report .intro p').append('\n');

    // convert meta info columns to object keys
    const bookKeys: { [key: string]: string | undefined } = {};
    const arr2d = $('#info').text().split('\n');
    arr2d.forEach(e => {
        const keyValue = e.split(':').map(e => e.trim());
        if (keyValue[0]) {
            bookKeys[keyValue[0]] = keyValue[1];
        }
    });
    const {
        ISBN: isbn,
        副标题: subtitle,
        作者: authors,
        出版社: publisher,
        定价: price
    } = bookKeys;

    const bookInfo: BookInfo = {
        title: $('#wrapper > h1 > span').text().trim(),
        rating: $('#interest_sectl .rating_num').text().trim(),
        tags: $('#db-tags-section > div').text().trim().replace(/\s+/g, ','),
        summary: $('#link-report .intro').last().text().trim(),
        image: $('#mainpic > a > img').prop('src'),
        url,
        // from meta object keys
        isbn,
        subtitle,
        authors: authors && authors.replace(/\s+编[\s\n]*$/g, ''),
        publisher,
        price
    };

    return bookInfo;
}
