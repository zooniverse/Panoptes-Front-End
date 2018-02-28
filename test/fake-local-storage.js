class FakeLocalStorage {
  constructor() {
    this.storage = {};
  }

  getItem(key) {
    if (key in this.storage) {
      return this.storage[key];
    } else {
      return null;
    }
  }

  setItem(key, value) {
    this.storage[key] = value.toString();
  }

  removeItem(key) {
    delete this.storage[key];
  }

  get length() {
    return Object.keys(this.storage).length;
  }

  key(i) {
    let keys = Object.keys(this.storage);
    return keys[i] || null;
  }
}

export default FakeLocalStorage;
