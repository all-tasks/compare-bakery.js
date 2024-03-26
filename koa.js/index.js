import Koa from 'koa';

const api = new Koa();

api.use(async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
}).listen(3300);

export default api;
