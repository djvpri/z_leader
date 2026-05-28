'use strict';

window.addEventListener('DOMContentLoaded', () => {
  GameState.init();
  WorldMap.init();
  UI.init();

  // Game loop: 1 quarter every 4 seconds
  setInterval(() => {
    if (GameState.paused || !GameState.playerCountryId) return;
    GameState.tickUpdate();
    UI.updateHUD();
  }, 4000);
});
