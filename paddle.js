import CanvasItem from "./contracts.js";

export const Direction = {
  NONE: "none",
  UP: "up",
  DOWN: "down",
};

export default class Paddle extends CanvasItem {
  constructor({ x, settings, moveUpKey, moveDownKey }) {
    super();
    this.settings = settings;
    this.x = x;
    this.y = this.settings.canvas.height / 2;
    this.moveUpKey = moveUpKey;
    this.moveDownKey = moveDownKey;
    this.moveDirection = Direction.NONE;
    this._initListeners();
  }

  _initListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case this.moveUpKey:
          this.moveDirection = Direction.UP;
          break;
        case this.moveDownKey:
          this.moveDirection = Direction.DOWN;
          break;
        default:
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case this.moveUpKey:
          this.moveDirection = Direction.NONE;
          break;
        case this.moveDownKey:
          this.moveDirection = Direction.NONE;
          break;

        default:
          break;
      }
    });
  }

  _position(ctx, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.fillRect(
      this.x,
      this.y,
      this.settings.paddleSettings.width,
      this.settings.paddleSettings.height
    );
  }

  _move(canvasHeight) {
    switch (this.moveDirection) {
      case Direction.UP:
        if (this.y - this.settings.paddleSettings.vPadding >= 0) {
          this.y -= this.settings.paddleSettings.velocity;
        }
        break;
      case Direction.DOWN:
        if (
          this.y +
            this.settings.paddleSettings.height +
            this.settings.paddleSettings.vPadding <=
          canvasHeight
        ) {
          this.y += this.settings.paddleSettings.velocity;
        }
        break;
      default:
        // Do nothing
        break;
    }
  }

  _checkCollision(ballX, ballY, radius, collitionCb) {
    if (
      ballX + radius >= this.x &&
      ballX + radius <=
        this.x +
          this.settings.paddleSettings.width +
          this.settings.paddleSettings.vPadding &&
      ballY + radius >= this.y &&
      ballY + radius <= this.y + this.settings.paddleSettings.height
    ) {
      collitionCb();
    }
  }

  render({ ballX, ballY, collitionCb, fillStyle = "white" }) {
    this._position(this.settings.ctx, fillStyle);
    this._move(this.settings.canvas.height);
    this._checkCollision(
      ballX,
      ballY,
      this.settings.ballSettings.radius,
      collitionCb
    );
  }
}
