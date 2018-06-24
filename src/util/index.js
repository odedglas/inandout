export default {
  searchInConst: (constant, key) => {

    const constantKeys = Object.keys(constant);
    const matchedKey = constantKeys.filter( constKey => constant[constKey].key === key);

    return matchedKey ? constant[matchedKey].label : undefined;
  }
}