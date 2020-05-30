const Koa = require('koa');

const app = new Koa(); //创建一个App实例

// 一切的流程都是中间件
app.use(async (ctx, next) => {
  await next();
  if (ctx.request.path == '/about') {
    ctx.response.type = 'html';
    ctx.response.body = 'this is about page <a href="/">Go Index Page</a>';
  } else {
    ctx.response.body = 'this is index page';
  }
});

//监听端口启动服务
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
