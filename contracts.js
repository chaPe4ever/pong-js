export default class CanvasItem {
  _position(...args) {
    throw new Error(
      "You must implement the position() method in a subclass. Signature: position(" +
        args.join(", ") +
        ")"
    );
  }
  _move(...args) {
    throw new Error(
      "You must implement the move() method in a subclass. Signature: position(" +
        args.join(", ") +
        ")"
    );
  }

  _checkCollision(...args) {
    throw new Error(
      "You must implement the checkCollision() method in a subclass. Signature: position(" +
        args.join(", ") +
        ")"
    );
  }

  render(...args) {
    throw new Error(
      "You must implement the render() method in a subclass. Signature: position(" +
        args.join(", ") +
        ")"
    );
  }
}
