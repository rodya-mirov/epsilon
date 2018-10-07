const exists = val => val !== null && val !== undefined;

// TODO: unit tests
export class Optional {
  constructor(val) {
    this.val = val;
    this.present = exists(val);
  }

  static empty() {
    return new Optional(null);
  }

  static of(val) {
    return new Optional(val);
  }

  map(fn) {
    return this.present ? new Optional(fn(this.val)) : this;
  }

  filter(fn) {
    if (this.present && fn(this.val)) {
      return this;
    } else {
      return Optional.empty();
    }
  }

  toArr() {
    return this.present ? [this.val,] : [];
  }

  orElse(defVal) {
    return this.present ? this.val : defVal;
  }
}
