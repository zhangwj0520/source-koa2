/**
 *
 * @param { any } proto 代理的对象
 * @param { string } target 被代理的对象
 */
function Delegator(proto, target) {
  return new _Delegator(proto, target);
}
class _Delegator {
  constructor(proto, target) {
    this.proto = proto;
    this.target = target;
  }
  /**
   * Delegate method `name`.
   *
   * @param {String} name
   * @return {Delegator} self
   * @api public
   */
  method(name) {
    const proto = this.proto;
    const target = this.target;
    proto[name] = function () {
      return this[target][name].apply(this[target], arguments);
    };
    return this;
  }

  /**
   * Delegator accessor `name`.
   *
   * @param {String} name
   * @return {Delegator} self
   * @api public
   */
  access(name) {
    const proto = this.proto;
    const target = this.target;
    Object.defineProperty(proto, name, {
      set: function (val) {
        return (this[target][name] = val);
      },
      get: function () {
        return this[target][name];
      },
    });
    return this;
  }
}
module.exports = Delegator;
