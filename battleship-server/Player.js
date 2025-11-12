
class Player {
  constructor(name) {
    this.name = name;
    this.id = Math.random().toString(36).substring(2, 15);
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ready = false;
  }
}

export { Player };
