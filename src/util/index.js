const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default {
  isUndefined(u) {

    return u === null || u === undefined;
  },
  searchInConst(constant, key) {

    const constantKeys = Object.keys(constant);
    const matchedKey = constantKeys.filter(constKey => constant[constKey].key === key);

    return matchedKey ? constant[matchedKey].label : undefined;
  },
  isPromise(p) {
    return !this.isUndefined(p) && typeof p.then === 'function'
  },
  whilePromise(promise, val, fn) {
    return promise(val).then(fn).then((wrapper) => {
      return !wrapper.done ? this.whilePromise(promise, wrapper.value, fn) : wrapper.value;
    });
  },
  randomAlphaNumeric(amount) {

    let text = "";

    for (let i = 0; i < amount; i++)
      text += abc.charAt(Math.floor(Math.random() * abc.length));

    return text;

  },
}

// *** Overrides *** //
String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
