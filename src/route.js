const Koa = require('koa');
const route = require('koa-route'); //koa-router 是一个处理路由的中间件

const app = new Koa(); //创建一个App实例

const db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' },
};

const pets = {
  list: (ctx) => {
    const names = Object.keys(db);
    ctx.body = 'pets: ' + names.join(', ');
  },

  show: (ctx, name) => {
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet.name + ' is a ' + pet.species;
  },
};

app.use(route.get('/pets', pets.list));
app.use(route.get('/pets/:name', pets.show));

//监听端口启动服务
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
