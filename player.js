export default class Player {
  constructor() {
    this.uid = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    this.name = `Player(${crypto
      .getRandomValues(new Uint32Array(1))[0]
      .toString(10)
      .substring(0, 3)})`;
    this.score = 0;
  }

  updateName(name) {
    this.name = name;
  }
}
