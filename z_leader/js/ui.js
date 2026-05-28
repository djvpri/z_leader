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
      document.getElementById('panel-relations').style.display = 'none';
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

    // Relations section — only for player's own country
    const isPlayer = sid === GameState.playerCountryId;
    if (isPlayer && GameState.playerCountryId) {
      this._renderRelations(c);
      document.getElementById('panel-relations').style.display = 'block';
    } else {
      document.getElementById('panel-relations').style.display = 'none';
    }

    const hasPlayer = Boolean(GameState.playerCountryId);
    const isEnemy   = c.relation === 'enemy';
    const isAlly    = c.relation === 'ally';

    document.getElementById('btn-play-as').style.display          = hasPlayer ? 'none' : 'block';
    document.getElementById('btn-declare-war').style.display      = (hasPlayer && !isPlayer && !isEnemy) ? 'block' : 'none';
    document.getElementById('btn-propose-alliance').style.display = (hasPlayer && !isPlayer && !isAlly) ? 'block' : 'none';
    document.getElementById('btn-make-peace').style.display       = (hasPlayer && !isPlayer && isEnemy) ? 'block' : 'none';
  },

  _renderRelations(playerCountry) {
    const alliesList  = document.getElementById('panel-allies-list');
    const enemiesList = document.getElementById('panel-enemies-list');

    document.getElementById('panel-allies-count').textContent  = playerCountry.allies.length;
    document.getElementById('panel-enemies-count').textContent = playerCountry.enemies.length;

    alliesList.innerHTML = playerCountry.allies.length === 0
      ? '<span style="color:#334155;font-size:11px">None</span>'
      : playerCountry.allies.map(aid => {
          const a = GameState.getCountry(aid);
          const name = a ? a.name : `#${aid}`;
          return `<span class="rel-tag" title="${name}">${name}</span>`;
        }).join('');

    enemiesList.innerHTML = playerCountry.enemies.length === 0
      ? '<span style="color:#334155;font-size:11px">None</span>'
      : playerCountry.enemies.map(eid => {
          const e = GameState.getCountry(eid);
          const name = e ? e.name : `#${eid}`;
          return `<span class="rel-tag enemy" title="${name}">${name}</span>`;
        }).join('');
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

    // Refresh relations if player's country is open
    if (GameState.selectedCountryId === GameState.playerCountryId) {
      this._renderRelations(p);
    }
  },
};
