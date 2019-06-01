import Router from 'koa-router';
import axios from 'axios';
import { getBookInfo } from '../services/book-info';

const router = new Router();

router.get('/v2/book/:id', async ctx => {
    const url = 'https://book.douban.com/subject/'+ ctx.params.id;
    const resp = await axios.get(url);
    ctx.body = getBookInfo(resp.data, url);
});

export default router;