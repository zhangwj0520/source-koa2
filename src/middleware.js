const Koa = require('koa');
const app = new Koa(); //创建一个App实例

const mid1 = async (ctx, next) => {
  console.log('1');
  await next();
  console.log('2');
};
const mid2 = async (ctx, next) => {
  console.log('3');
  await next();
  console.log('4');
};
const mid3 = async (ctx, next) => {
  console.log('5');
  await next();
  console.log('6');
};

app.use(mid1);
app.use(mid2);
app.use(mid3);

//监听端口启动服务
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
