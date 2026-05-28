'use strict';

const UI = {
  init() {
    document.getElementById('btn-start-dismiss').addEventListener('click', () => {
      document.getElementById('start-modal').style.display = 'none';
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
      if (!GameState.playerCountryId) return;
      GameState.paused = !GameState.paused;
      document.getElementById('btn-pause').textContent = GameState.paused ? 'Resume' : 'Pause';
    });

    document.getElementById('btn-play-as').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id) return;
      GameState.setPlayer(id);
      WorldMap.refresh();
      this.updateHUD();
      document.getElementById('btn-pause').disabled = false;
      document.getElementById('start-modal').style.display = 'none';
      this.showCountryPanel(id);
    });

    document.getElementById('btn-declare-war').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Declare war on ${c.name}?`)) {
        GameState.declareWar(id);
        WorldMap.refresh();
        this.showCountryPanel(id);
      }
    });

    document.getElementById('btn-propose-alliance').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Form alliance with ${c.name}?`)) {
        GameState.proposeAlliance(id);
        WorldMap.refresh();
        this.showCountryPanel(id);
      }
    });

    document.getElementById('btn-make-peace').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Propose peace with ${c.name}?`)) {
        GameState.makePeace(id);
        WorldMap.refresh();
        this.showCountryPanel(id);
      }
    });
  },

  showCountryPanel(id) {
    const sid = String(id);
    const c = GameState.getCountry(sid);

    document.getElementById('panel-empty').style.display = 'none';
    document.getElementById('panel-country').style.display = 'block';

    if (!c) {
      document.getElementById('panel-country-name').textContent = 'Unknown Territory';
      ['panel-gdp','panel-population','panel-military','panel-treasury','panel-status']
        .forEach(el => { document.getElementById(el).textContent = 'N/A'; });
      document.getElementById('panel-actions').style.display = 'none';
      return;
    }

    document.getElementById('panel-actions').style.display = 'block';
    document.getElementById('panel-country-name').textContent = c.name;
    document.getElementById('panel-gdp').textContent        = `$${c.gdp.toFixed(0)}B/yr`;
    document.getElementById('panel-population').textContent = `${c.population.toFixed(1)}M`;
    document.getElementById('panel-military').textContent   = `${c.military.toFixed(0)}K`;
    document.getElementById('panel-treasury').textContent   = `$${c.treasury.toFixed(0)}B`;

    const statusMap = { player: 'You', ally: 'Ally', enemy: 'Enemy', neutral: 'Neutral' };
    document.getElementById('panel-status').textContent = statusMap[c.relation] || 'Neutral';

    const isPlayer = sid === GameState.playerCountryId;
    const hasPlayer = Boolean(GameState.playerCountryId);
    const isEnemy = c.relation === 'enemy';

    document.getElementById('btn-play-as').style.display         = hasPlayer ? 'none' : 'block';
    document.getElementById('btn-declare-war').style.display     = (hasPlayer && !isPlayer && !isEnemy) ? 'block' : 'none';
    document.getElementById('btn-propose-alliance').style.display= (hasPlayer && !isPlayer && c.relation !== 'ally') ? 'block' : 'none';
    document.getElementById('btn-make-peace').style.display      = (hasPlayer && !isPlayer && isEnemy) ? 'block' : 'none';
  },

  hidePanelCountry() {
    document.getElementById('panel-empty').style.display   = 'block';
    document.getElementById('panel-country').style.display = 'none';
  },

  updateHUD() {
    if (!GameState.playerCountryId) return;
    const p = GameState.getCountry(GameState.playerCountryId);
    if (!p) return;
    document.getElementById('player-country-name').textContent = p.name;
    document.getElementById('treasury').textContent   = p.treasury.toFixed(0);
    document.getElementById('gdp').textContent        = p.gdp.toFixed(0);
    document.getElementById('population').textContent = p.population.toFixed(1);
    document.getElementById('military').textContent   = p.military.toFixed(0);
    document.getElementById('game-date').textContent  = `Year ${GameState.year} Q${GameState.quarter}`;

    if (GameState.selectedCountryId === GameState.playerCountryId) {
      this.showCountryPanel(GameState.playerCountryId);
    }
  },
};
