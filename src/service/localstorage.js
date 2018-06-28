
const get = (name) => {

  const item = window.localStorage.getItem(name);

  return item ? JSON.parse(item) : item;
};

const set = (name, value) => {

  if(value) {

    value = JSON.stringify(value);
  }

  window.localStorage.setItem(name, value);
};

const remove = name => {

  const item = get(name);

  item && window.localStorage.removeItem(name);
};

export default {
  get,
  set,
  remove
}