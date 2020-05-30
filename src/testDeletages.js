const delegate = require('../lib/delegates/class');

const target = {
  request: {
    name: 'laozhang',
    say: function () {
      console.log('Hello');
    },
  },
};

delegate(target, 'request').access('name').method('say');

console.log(target.name); // laozhang
target.name = 'zhangweijie';
console.log(target.name); // zhangweijie
console.log(target.name); // zhangweijie
console.log(target.name); // zhangweijie
target.say(); // Hello
