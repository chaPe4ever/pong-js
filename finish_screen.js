export default class FinishScreen {
  constructor() {}

  display({ ctx, winnerName, onRestartGameCb }) {
    if (typeof ctx === "undefined") {
      console.warn("Canvas context 'ctx' is not defined.");
      return;
    }

    const handleKeyDown = (event) => {
      const { key } = event;
      if (key === "Escape") {
        window.removeEventListener("keydown", handleKeyDown);
        onRestartGameCb();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.save();
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.textAlign = "center";
    ctx.fillText(`${winnerName} Wins!`, centerX, centerY);
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Press (Esc) to start over`, centerX, centerY - 50);
    ctx.restore();
  }
}
