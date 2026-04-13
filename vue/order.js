class Order {
  static #id_increase = 0;

  constructor(table, food) {
    Order.#id_increase += 1;
    this.id = Order.#id_increase;
    this.food = food;
    this.status = 1;

    Object.defineProperty(this, 'table_id', {
      value: table,
      enumerable: true,
      writable: false,
      configurable: false,
    });
  }
}

module.exports = Order;
