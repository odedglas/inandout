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
  isObject(o) {

    return o !== null && typeof o === 'object';
  },
  isEmptyObject(o) {

    return this.isObject(o) && Object.keys(o).length === 0
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
  sortJsonFN: (props) => {

    return function (a, b) {

      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const name = prop.name;
        const reverse = prop.reverse;

        //Getting as path ( if was sent x.y.z.o )
        const aProp = a[name];
        const bProp = b[name];

        if (aProp < bProp)
          return reverse ? 1 : -1;
        if (aProp > bProp)
          return reverse ? -1 : 1;
      }
      return 0;
    };

  },
}

// *** Overrides *** //
// eslint-disable-next-line
String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
