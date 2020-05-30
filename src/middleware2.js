const Koa = require('koa');
const app = new Koa(); //创建一个App实例

const indent = (n) => new Array(n).fill('-').join('');

const mid1 = async (ctx, next) => {
  ctx.body = `<h3>请求 => 第一层中间件</h3>`;
  await next();
  ctx.body += `<h3>响应 <= 第一层中间件</h3>`;
};
const mid2 = async (ctx, next) => {
  ctx.body += `<h3>${indent(4)}请求 => 第二层中间件</h3>`;
  await next();
  ctx.body += `<h3>${indent(4)}响应 <= 第二层中间件</h3>`;
};
const mid3 = async (ctx, next) => {
  ctx.body += `<p style="color:#f60">${indent(12)}Koa 核心 处理业务</p>`;
};

app.use(mid1);
app.use(mid2);
app.use(mid3);

//监听端口启动服务
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
