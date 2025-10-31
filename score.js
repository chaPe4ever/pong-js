export default class Score {
  constructor({ player1, player2, settings }) {
    this.player1 = player1;
    this.player2 = player2;
    this.settings = settings;
  }

  display(ctx) {
    if (typeof ctx === "undefined") {
      console.warn("Canvas context 'ctx' is not defined.");
      return;
    }

    const centerX = ctx.canvas.width / 2;
    const nameY = 30;
    const scoreY = 80;

    // Player 1 keyboard indicators (left side)
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "right";
    ctx.fillText("W ▲", centerX - 200, nameY - 10);
    ctx.fillText("S ▼", centerX - 200, nameY + 10);

    // Player 1 name (left side)
    ctx.font = "24px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    ctx.fillText(this.player1.name, centerX - 60, nameY);

    // Draw "VS" in the middle
    ctx.textAlign = "center";
    ctx.fillText("VS", centerX, nameY);

    // Player 2 name (right side)
    ctx.textAlign = "left";
    ctx.fillText(this.player2.name, centerX + 60, nameY);

    // Player 2 keyboard indicators (right side)
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "left";
    ctx.fillText("▲ ↑", centerX + 200, nameY - 10);
    ctx.fillText("▼ ↓", centerX + 200, nameY + 10);

    // Player 1 score (left side)
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx.textAlign = "right";
    ctx.fillText(this.player1.score ?? 0, centerX - 100, scoreY);

    // Draw player 2 score (right side)
    ctx.textAlign = "left";
    ctx.fillText(this.player2.score ?? 0, centerX + 100, scoreY);
  }

  total() {
    return this.player1.score + this.player2.score;
  }

  maxScore() {
    return Math.max(this.player1.score, this.player2.score);
  }

  checkForWinner({ onWinnerCb }) {
    console.log(this.settings.maxScore);
    console.log(this.maxScore());
    console.log(this.maxScore() >= this.settings.maxScore);
    if (this.maxScore() >= this.settings.maxScore) {
      onWinnerCb();
    }
  }

  checkForSpeedIncrease({ numOfGoals, ballVelocity, onSpeeIncreaseCb }) {
    if (
      this.total() > 0 &&
      (this.total() % numOfGoals === 0 || this.total() % (numOfGoals + 1) === 0)
    ) {
      if (Math.abs(ballVelocity) < 10) {
        onSpeeIncreaseCb();
      }
    }
  }

  updateScores(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  getWinnerName() {
    const sortedScorePlayer = [this.player1, this.player2].sort(
      (a, b) => b.score - a.score
    );
    return sortedScorePlayer[0].name;
  }
}
