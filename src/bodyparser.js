const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // 处理post请求，把 koa2 上下文的表单数据解析到 ctx.request.body 中

const app = new Koa(); //创建一个App实例
const router = Router(); // 实例化路由
app.use(bodyParser());

// 表单
router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>表单</h1>
      <form action="/login" method="post">
          <p>Name: <input name="name" value="koa2"></p>
          <p>Password: <input name="password" type="password"></p>
          <p><input type="submit" value="Submit"></p>
      </form>`;
});

router.post('/login', async (ctx, next) => {
  const { name, password } = ctx.request.body;

  console.log(name, password);

  ctx.response.body = `<h4>Hello, ${name}!</h4>`;
});

app.use(router.routes());

//监听端口启动服务
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
