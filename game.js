import Settings from "./settings.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Score from "./score.js";
import Player from "./player.js";
import Prompts from "./prompts.js";
import InitScreen from "./init_screen.js";
import FinishScreen from "./finish_screen.js";

const Status = {
  IDLE: "idle",
  INIT: "init",
  STARTED: "started",
  FINISHED: "finished",
};

export default class Game {
  constructor() {
    this.intervalId = null;
    this.status = Status.INIT;
    this.settings = new Settings({
      ballSettings: {
        velocity: 1,
        radius: 8,
        increaseSpeedEveryNumOfGoals: 2,
      },
      paddleSettings: {
        width: 12,
        height: 90,
        velocity: 2,
        hPadding: 15,
        vPadding: 10,
      },
      scoreSettings: {
        maxScore: 5,
      },
      playerSettings: {},
    });
    this.ball = new Ball({
      settings: this.settings,
    });
    this.leftPaddle = new Paddle({
      settings: this.settings,
      x: this.settings.paddleSettings.hPadding,
      moveUpKey: "w",
      moveDownKey: "s",
    });
    this.rightPaddle = new Paddle({
      settings: this.settings,
      x:
        this.settings.canvas.width -
        this.settings.paddleSettings.hPadding -
        this.settings.paddleSettings.width,
      moveUpKey: "ArrowUp",
      moveDownKey: "ArrowDown",
    });
    this.leftPlayer = new Player();
    this.rightPlayer = new Player();
    this.score = new Score({
      player1: this.leftPlayer,
      player2: this.rightPlayer,
      settings: this.settings.scoreSettings,
    });
    this.prompts = new Prompts({
      "What's the first player's name?": "",
      "What's next player's name?": "",
      "What should be the winning score?": "",
    });
    this.initScreen = new InitScreen();
    this.finishScreen = new FinishScreen();
  }

  _renderBg(fillStyle = "black") {
    this.settings.ctx.fillStyle = fillStyle;
    this.settings.ctx.fillRect(
      0,
      0,
      this.settings.canvas.width,
      this.settings.canvas.height
    );
  }

  renderGame() {
    this._renderBg();
    this.ball.render({
      onCollisionLeftCb: () => {
        this.rightPlayer.score += 1;
        this.score.updateScores(this.leftPlayer, this.rightPlayer);
        this.score.checkForSpeedIncrease({
          ballVelocity: this.ball.velocityX,
          numOfGoals: this.settings.ballSettings.increaseSpeedEveryNumOfGoals,
          onSpeeIncreaseCb: () => (this.ball.velocityX *= 1.2),
        });
        this.score.checkForWinner({
          onWinnerCb: () => {
            this.status = Status.FINISHED;
          },
        });
      },
      onCollisionRightCb: () => {
        this.leftPlayer.score += 1;
        this.score.updateScores(this.leftPlayer, this.rightPlayer);
        this.score.checkForWinner({
          onWinnerCb: () => {
            this.status = Status.FINISHED;
          },
        });
        this.score.checkForSpeedIncrease({
          ballVelocity: this.ball.velocityX,
          numOfGoals: this.settings.ballSettings.increaseSpeedEveryNumOfGoals,
          onSpeeIncreaseCb: () => (this.ball.velocityX *= 1.2),
        });
      },
    });
    this.leftPaddle.render({
      ballX: this.ball.x,
      ballY: this.ball.y,
      collitionCb: () => this.ball.smoothenCollition(this.leftPaddle.y),
    });
    this.rightPaddle.render({
      ballX: this.ball.x,
      ballY: this.ball.y,
      collitionCb: () => this.ball.smoothenCollition(this.rightPaddle.y),
    });
    this.score.display(this.settings.ctx);
  }

  start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        switch (this.status) {
          case Status.STARTED:
            this.renderGame();
            break;
          case Status.INIT:
            // Avoid looping over again as we need just one time init
            this.status = Status.IDLE;
            this.initScreen.display({
              prompts: this.prompts,
              settings: this.settings,
              leftPlayer: this.leftPlayer,
              rightPlayer: this.rightPlayer,
              score: this.score,
              onDoneSetupCb: () => this.renderGame(),
              onStartGameCb: () => (this.status = Status.STARTED),
            });
            break;
          case Status.IDLE:
            // Do nothing or show a loading screen
            break;
          case Status.FINISHED:
            // Avoid looping over again as we need just one time init
            this.status = Status.IDLE;
            this.finishScreen.display({
              ctx: this.settings.ctx,
              winnerName: this.score.getWinnerName(),
              onRestartGameCb: () => {
                clearInterval(this.intervalId);
                const NewGameClass = this.constructor;
                const newGame = new NewGameClass();
                newGame._renderBg("white");
                newGame.start();
              },
            });
            break;
          default:
            break;
        }
      }, 1);
    }
  }
}
