import Router from 'koa-router';
import axios from 'axios';
import { getBookInfo } from '../services/book-info';
import { getSearchResults } from '../services/search';

const router = new Router();

router.get('/v2/book/:id', async (ctx, next) => {
    // Only for valid Douban book ID (numbers) as path param
    if (isNaN(ctx.params.id)) return next();

    const url = 'https://book.douban.com/subject/' + ctx.params.id;
    const resp = await axios.get(url);
    ctx.body = getBookInfo(resp.data, url);
});

router.get('/v2/book/isbn/:isbn', async ctx => {
    const { isbn } = ctx.params;
    const url =
        'https://book.douban.com/subject_search?search_text=' +
        encodeURIComponent(isbn);
    const book = await getSearchResults(url);
    const pageUrl = book[0].url;

    const resp = await axios.get(pageUrl);
    ctx.body = getBookInfo(resp.data, pageUrl);
});

router.get('/v2/book/search', async ctx => {
    const { q } = ctx.query;
    const url =
        'https://book.douban.com/subject_search?search_text=' +
        encodeURIComponent(q);
    try {
        const books = await getSearchResults(url);
        ctx.body = {
            count: books.length,
            books: books
        };
    } catch (e) {
        console.log(e);
    }
});

export default router;
