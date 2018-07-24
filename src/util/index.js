const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default {
  isUndefined(u) {

    return u === null || u === undefined;
  },
  searchInConst(constant, key) {

    if (!key) return;

    const constantKeys = Object.keys(constant);
    const matchedKey = constantKeys.filter(constKey => constant[constKey].key === key);

    return matchedKey ? constant[matchedKey].label : undefined;
  },
  isPromise(p) {
    return !this.isUndefined(p) && typeof p.then === 'function'
  },
  isObject(o) {

    return !this.isUndefined(o) && typeof o === 'object';
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
  sortJsonFN(props) {

    return (a, b) => {

      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const name = prop.name;
        const reverse = prop.reverse;

        //Getting as path ( if was sent x.y.z.o )
        const aProp = this.getDeepJsonProperty(a,name);
        const bProp = this.getDeepJsonProperty(b,name);

        if(aProp === undefined && bProp !== undefined)
          return 1;
        if(bProp === undefined && aProp !== undefined)
          return -1;

        if (aProp < bProp)
          return reverse ? 1 : -1;
        if (aProp > bProp)
          return reverse ? -1 : 1;
      }
      return 0;
    };

  },
  getDeepJsonProperty(json, path) {

    //Cloning the original json ( in order to break the reference )
    let obj = Object.create(json);
    path = path.split('.');

    for (let i = 0; i < path.length; i++) {

      if(!this.isObject(obj)) return undefined;
      obj = obj[path[i]];
    }
    return obj;
  },
  promiseAllObjectProperties(object) {

    if (!this.isObject(object)) {
    }

    const keys = Object.keys(object);
    const promises = keys.map(key => object[key]);

    return Promise.all(promises).then(res => {
      return res.reduce((resolvedObject, property, index) => {
        resolvedObject[keys[index]] = property;
        return resolvedObject;
      }, {});
    });
  },
  updateById(array, item) {

    const _array = [...array];
    const index = array.findIndex(i => i.id === item.id);

    _array.splice(index, 1, item);
    return _array;
  },
  toIdsMap(array) {

    return array ? array.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {}) : {};
  }
}

// *** Overrides *** //
// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
