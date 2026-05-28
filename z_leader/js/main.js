'use strict';

let _prevYear = 2026;
let _warnedLow = false;
let _warnedBankrupt = false;
let _prevAllies = 0;
let _prevEnemies = 0;

function _checkEvents() {
  const p = GameState.getCountry(GameState.playerCountryId);
  if (!p) return;

  // New year
  if (GameState.year !== _prevYear) {
    Notifications.show(`Year <b>${GameState.year}</b> begins. GDP: $${p.gdp.toFixed(0)}B | Treasury: $${p.treasury.toFixed(0)}B`, 'year', 7000);
    _prevYear = GameState.year;
    _warnedLow = false;
    _warnedBankrupt = false;
  }

  // Treasury warnings
  if (p.treasury < 0 && !_warnedBankrupt) {
    Notifications.show(`Treasury bankrupt! $${p.treasury.toFixed(0)}B — military costs exceed income.`, 'danger', 9000);
    _warnedBankrupt = true;
    _warnedLow = true;
  } else if (p.treasury < 250 && p.treasury >= 0 && !_warnedLow) {
    Notifications.show(`Treasury running low: $${p.treasury.toFixed(0)}B. Consider reducing military.`, 'warning', 7000);
    _warnedLow = true;
  }

  if (p.treasury >= 250) {
    _warnedLow = false;
    _warnedBankrupt = false;
  }

  // Alliance / enemy count change
  const curAllies   = p.allies.length;
  const curEnemies  = p.enemies.length;
  if (curAllies > _prevAllies)  Notifications.show(`You now have <b>${curAllies}</b> allied nation${curAllies > 1 ? 's' : ''}.`, 'info');
  if (curEnemies > _prevEnemies) Notifications.show(`You are at war with <b>${curEnemies}</b> nation${curEnemies > 1 ? 's' : ''}.`, 'warning');
  _prevAllies  = curAllies;
  _prevEnemies = curEnemies;

  // Random world event (5% chance per tick)
  if (Math.random() < 0.05) _randomWorldEvent();
}

const WORLD_EVENTS = [
  { msg: 'Global commodity prices surge — resource-rich nations benefit.',  type: 'event' },
  { msg: 'International trade summit convenes. Diplomatic ties strengthen.', type: 'event' },
  { msg: 'Regional tensions rising in Southeast Asia.',                      type: 'event' },
  { msg: 'New military technology deployed by major powers.',               type: 'event' },
  { msg: 'Economic slowdown detected in emerging markets.',                 type: 'warning' },
  { msg: 'Energy prices spike globally due to supply disruptions.',         type: 'warning' },
  { msg: 'UN resolution passes calling for international cooperation.',     type: 'info'  },
  { msg: 'Ceasefire brokered between two regional powers.',                type: 'peace' },
  { msg: 'Coup attempt reported in an unstable nation.',                    type: 'event' },
  { msg: 'Record harvest season boosts agricultural economies.',            type: 'milestone' },
];

function _randomWorldEvent() {
  const ev = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
  Notifications.show(ev.msg, ev.type, 6000);
}

window.addEventListener('DOMContentLoaded', () => {
  GameState.init();
  WorldMap.init();
  UI.init();

  _prevYear = GameState.year;

  // Game loop: 1 quarter every 4 seconds
  setInterval(() => {
    if (GameState.paused || !GameState.playerCountryId) return;
    GameState.tickUpdate();
    UI.updateHUD();
    _checkEvents();
  }, 4000);
});
