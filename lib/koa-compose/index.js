'use strict';

/**
 * Expose compositor.
 */

module.exports = compose;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware) {
  // 先对中间件的每一项进行类型检查，middleware必须是数组，数组内的每一项必须是函数。
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }
  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  // compose()返回一个匿名函数的结果，该匿名函数自执行了 dispatch() 这个函数，并传入了0作为参数。
  return function (context, next) {
    // 记录上一次执行中间件的位置 #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      // 理论上 i 应该大于 index，因为每次执行一次都会把 i递增，
      // 如果相等或者小于，则说明next()执行了多次
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i; // 取到当前的中间件
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        // 传递了 context 和 next 函数两个参数。
        // context 就是 koa 中的上下文对象 context。
        // next 函数则是返回一个 dispatch(i+1) 的执行结果,
        // i+1 ，传递这个参数就相当于执行了下一个中间件，从而形成递归调用.
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

/* 
a.dispatch(i+1) 的递归
  如果自己写中间件，需要手动执行await next()。只有执行了 next 函数，才能正确地执行下一个中间件。
  因此每个中间件只能执行一次 next，如果在一个中间件内多次执行 next，就会出现问题。

b.为什么说通过 i<=index 就可以判断 next 执行多次？
  因为正常情况下 index 必定会小于等于 i。如果在一个中间件中调用多次 next，会导致多次执行 dispatch(i+1)。
  从代码上来看，每个中间件都有属于自己的一个闭包作用域，同一个中间件的 i 是不变的，而 index 是在闭包作用域外面的。
  当第一个中间件即 dispatch(0) 的 next() 调用时，此时应该是执行 dispatch(1)，在执行到下面这个判断。
c. async 本身返回的就是 Promise，为什么还要在使用 Promise.resolve() 包一层呢？
  这是为了兼容普通函数，使得普通函数也能正常使用
  
d. 中间件的执行机制?
    1)先执行第一个中间件（因为compose 会默认执行 dispatch(0)），该中间件返回 Promise，然后被 Koa 监听，执行对应的逻辑（成功或失败）。

    2)在执行第一个中间件的逻辑时，遇到 await next()时，会继续执行 dispatch(i+1)，也就是执行 dispatch(1)，会手动触发执行第二个中间件。
    这时候，第一个中间件 await next() 后面的代码就会被 pending，等待 await next() 返回 Promise，
    才会继续执行第一个中间件 await next() 后面的代码。

    3)同样的在执行第二个中间件的时候，遇到 await next() 的时候，会手动执行第三个中间件，await next() 后面的代码依然被 pending，
    等待 await 下一个中间件的 Promise.resolve。只有在接收到第三个中间件的 resolve 后才会执行后面的代码，
    然后第二个中间件会返回 Promise，被第一个中间件的 await 捕获，
    这时候才会执行第一个中间件的后续代码，然后再返回 Promise 。
    
    4)以此类推，如果有多个中间件的时候，会依照上面的逻辑不断执行，先执行第一个中间件，
    在 await next() 出 pending，继续执行第二个中间件，继续在 await next() 出 pending，
    继续执行第三个中间，直到最后一个中间件执行完，然后返回 Promise，
    然后倒数第二个中间件才执行后续的代码并返回Promise，
    然后是倒数第三个中间件，
    接着一直以这种方式执行直到第一个中间件执行完，
    并返回 Promise，从而实现文章开头那张图的执行顺序。
    
e.如果要写一个 koa2 的中间件，那么基本格式应该就长下面这样
    async function koaMiddleware(ctx, next){
        try{
            // do something
            await next()
            // do something
        }
        .catch(err){
            // handle err
        }    
    }

 */
