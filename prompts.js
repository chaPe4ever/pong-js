export default class Prompts {
  constructor(prompts) {
    this.prompts = prompts;
  }

  start() {
    for (const key in this.prompts) {
      const answer = prompt(key, "");
      this.prompts[key] = answer;
    }
  }
}
