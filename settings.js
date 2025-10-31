const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

export default class Settings {
  constructor({ ballSettings, paddleSettings, playerSettings, scoreSettings }) {
    this.ballSettings = ballSettings;
    this.paddleSettings = paddleSettings;
    this.playerSettings = playerSettings;
    this.scoreSettings = scoreSettings;
    this.canvas = canvas;
    this.ctx = ctx;
  }
}

export class BallSettings {
  constructor({ velocity, radius, increaseSpeedEveryNumOfGoals }) {
    this.velocity = velocity;
    this.radius = radius;
    this.increaseSpeedEveryNumOfGoals = increaseSpeedEveryNumOfGoals;
  }
}

export class PaddleSettings {
  constructor({ width, height, velocity, hPadding, vPadding }) {
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.hPadding = hPadding;
    this.vPadding = vPadding;
  }
}

export class PlayerSettings {
  constructor({ firstPlayerName, secondPlayerName }) {
    this.firstPlayerName = firstPlayerName;
    this.secondPlayerName = secondPlayerName;
  }
}

export class ScoreSettings {
  constructor({ maxScore }) {
    this.maxScore = maxScore;
  }
}
