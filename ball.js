import CanvasItem from "./contracts.js";

export default class Ball extends CanvasItem {
  constructor({ settings }) {
    super();
    this.settings = settings;
    this.x = this.settings.canvas.width / 2;
    this.y = this.settings.canvas.height / 2;
    this.velocityX = this.settings.ballSettings.velocity;
    this.velocityY = this.settings.ballSettings.velocity;
    this.rotation = 0;
  }

  _position() {
    const ctx = this.settings.ctx;
    const radius = this.settings.ballSettings.radius;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation); // Rotate for spinning effect

    // Draw solid white circle as base
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw black pentagons (soccer ball look)
    ctx.fillStyle = "black";

    // Center pentagon
    this._drawPentagon(ctx, 0, 0, radius * 0.4);

    // Draw dashed circle pattern
    ctx.strokeStyle = "black";
    ctx.lineWidth = radius * 0.3;

    const segments = 12;
    for (let i = 0; i < segments; i++) {
      if (i % 2 === 0) {
        // Only draw every other segment for dashed effect
        const startAngle = (i / segments) * 2 * Math.PI;
        const endAngle = ((i + 1) / segments) * 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.7, startAngle, endAngle);
        ctx.stroke();
      }
    }

    // Draw middle dashed line (equator)
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]); // Dashed pattern
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Outline
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  _drawPentagon(ctx, cx, cy, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  _move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Update rotation based on velocity for spinning effect
    this.rotation +=
      Math.sqrt(
        this.velocityX * this.velocityX + this.velocityY * this.velocityY
      ) * 0.05;
  }

  _checkCollision(onCollisionLeftCb, onCollisionRightCb) {
    // Ball collision with right canvas border
    if (
      this.x + this.settings.ballSettings.radius >=
      this.settings.canvas.width
    ) {
      onCollisionRightCb();
      this.velocityX *= -1;
    }
    // Ball collision with left canvas border
    if (this.x - this.settings.ballSettings.radius <= 0) {
      onCollisionLeftCb();
      this.velocityX *= -1;
    }
    // Ball collision with top or bottom canvas border
    if (
      this.y + this.settings.ballSettings.radius >=
        this.settings.canvas.height ||
      this.y - this.settings.ballSettings.radius <= 0
    ) {
      this.velocityY *= -1;
    }
  }

  render({ onCollisionLeftCb, onCollisionRightCb }) {
    this._position();
    this._move();
    this._checkCollision(onCollisionLeftCb, onCollisionRightCb);
  }

  smoothenCollition(paddleY, verticalVelocityLvl = 3) {
    this.velocityX *= -1;
    // Calculate where the ball hit the paddle (relative position)
    const paddleCenter = paddleY + this.settings.paddleSettings.height / 2;
    const hitPosition = this.y - paddleCenter;

    // Normalize the hit position (-1 to 1, where 0 is center)
    const normalizedHit =
      hitPosition / (this.settings.paddleSettings.height / 2);

    // Adjust vertical velocity based on hit position
    this.velocityY = normalizedHit * verticalVelocityLvl;
  }
}
