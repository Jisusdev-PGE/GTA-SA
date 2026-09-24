import { Game } from "./core/Game.js";

const game = new Game(document.querySelector("#game"));
const start = document.querySelector("#startButton");

start.addEventListener("click", () => {
  document.body.classList.add("playing");
  game.start();
});

window.addEventListener("keydown", e => {
  if (e.code === "Escape") document.exitPointerLock?.();
});

game.boot();
