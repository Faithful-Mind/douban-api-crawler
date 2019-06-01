import cheerio from 'cheerio';

export function getBookInfo(pageBody: string, url: string) {
    // remove unneccessary spaces and line breaks in body
    const $ = cheerio.load(pageBody.replace(/\s*\n\s*/g, ''));
    $('#info').find('br').replaceWith('\n'); // preserver <br />

    // convert meta info columns to object keys
    const bookKeys: { [key: string]: string } = {};
    const arr2d = $('#info').text().split('\n');
    arr2d.forEach(e => {
        const keyValue = e.split(':');
        if (keyValue[0]) {
            bookKeys[keyValue[0].trim()] = keyValue[1].trim();
        }
    });

    const {
        ISBN: isbn,
        作者: authors,
        出版社: publisher,
        定价: price
    } = bookKeys;
    const bookInfo: { [key: string]: string } = Object.assign(
        {},
        { isbn, authors, publisher, price }
    );

    // add other info
    bookInfo.title = $('#wrapper > h1 > span').text().trim();
    bookInfo.rating = $('.rating_num').text().trim();
    bookInfo.tags = $('#db-tags-section > div')
        .text()
        .trim()
        .replace(/\s+/g, ',');
    bookInfo.summary = $('#link-report .intro').text().trim();
    bookInfo.image = $('#mainpic > a > img').prop('src');
    bookInfo.url = url;

    return bookInfo;
}