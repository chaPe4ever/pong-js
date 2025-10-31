export default class InitScreen {
  constructor() {}

  display({
    prompts,
    settings,
    leftPlayer,
    rightPlayer,
    score,
    onDoneSetupCb,
    onStartGameCb,
  }) {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        window.removeEventListener("keydown", handleKeyDown);
        onStartGameCb();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Setup
    prompts.start();
    const firstPlayerName = prompts.prompts["What's the first player's name?"];
    if (firstPlayerName) {
      settings.playerSettings.firstPlayerName = firstPlayerName;
      leftPlayer.updateName(settings.playerSettings.firstPlayerName);
    }
    const secondPlayerName = prompts.prompts["What's next player's name?"];
    if (secondPlayerName) {
      settings.playerSettings.secondPlayerName = secondPlayerName;
      rightPlayer.updateName(settings.playerSettings.secondPlayerName);
    }
    const maxScore = prompts.prompts["What should be the winning score?"];
    if (maxScore) {
      settings.scoreSettings.maxScore = parseInt(maxScore);
      score.settings = settings.scoreSettings;
    }

    onDoneSetupCb();

    // Display startup info
    const ctx = settings.ctx;
    ctx.save();
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      "Press (SPACE) to start the game",
      settings.canvas.width / 2,
      settings.canvas.height / 2 - 50
    );
    ctx.restore();
  }
}
