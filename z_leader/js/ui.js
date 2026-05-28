'use strict';

const OUTCOME_MSG = {
  decisive: { text: 'Decisive Victory', type: 'war' },
  victory:  { text: 'Victory',          type: 'war' },
  stalemate:{ text: 'Stalemate',        type: 'warning' },
  defeat:   { text: 'Defeat',           type: 'danger' },
};

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

    document.getElementById('btn-attack').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const result = GameState.attack(id);
      if (!result) {
        Notifications.show('Attack on cooldown — wait until next quarter.', 'warning', 4000);
        return;
      }
      WorldMap.refresh();
      this.showCountryPanel(id);
      this.updateHUD();
      const om = OUTCOME_MSG[result.outcome] || OUTCOME_MSG.stalemate;
      Notifications.show(
        `<b>${om.text}</b> vs ${result.targetName}! Your strength ${result.atkStr} vs ${result.defStr}.`,
        om.type, 8000
      );
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

    // Budget sliders
    document.getElementById('sld-tax').addEventListener('input', (e) => {
      GameState.setPlayerBudget('taxRate', Number(e.target.value) / 100);
      document.getElementById('lbl-tax').textContent = e.target.value + '%';
      this._updateBudgetSummary();
    });
    document.getElementById('sld-mil').addEventListener('input', (e) => {
      GameState.setPlayerBudget('militaryAlloc', Number(e.target.value) / 100);
      document.getElementById('lbl-mil').textContent = e.target.value + '%';
      this._updateBudgetSummary();
    });
    document.getElementById('sld-dev').addEventListener('input', (e) => {
      GameState.setPlayerBudget('devAlloc', Number(e.target.value) / 100);
      document.getElementById('lbl-dev').textContent = e.target.value + '%';
      this._updateBudgetSummary();
    });

    document.getElementById('btn-trade').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Propose trade agreement with ${c.name}?`)) {
        GameState.proposeTrade(id);
        this.showCountryPanel(id);
        this.updateHUD();
      }
    });

    document.getElementById('btn-cancel-trade').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Cancel trade agreement with ${c.name}?`)) {
        GameState.cancelTrade(id);
        Notifications.show(`Trade with <b>${c.name}</b> cancelled.`, 'warning', 4000);
        this.showCountryPanel(id);
        this.updateHUD();
      }
    });

    document.getElementById('btn-sanction').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Impose economic sanctions on ${c.name}?`)) {
        GameState.imposeSanctions(id);
        this.showCountryPanel(id);
      }
    });

    document.getElementById('btn-lift-sanctions').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      GameState.liftSanctions(id);
      this.showCountryPanel(id);
    });

    document.getElementById('btn-demand-tribute').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const ok = GameState.demandTribute(id);
      if (!ok) {
        Notifications.show('Cannot demand tribute — need 2× strength and non-empty treasury.', 'warning', 4000);
        return;
      }
      this.showCountryPanel(id);
      this.updateHUD();
    });

    document.getElementById('btn-annex').addEventListener('click', () => {
      const id = GameState.selectedCountryId;
      if (!id || id === GameState.playerCountryId) return;
      const c = GameState.getCountry(id);
      if (!c) return;
      if (confirm(`Annex ${c.name}? Their territory will be permanently absorbed into your nation.`)) {
        const ok = GameState.annex(id);
        if (!ok) {
          Notifications.show('Cannot annex — enemy must be devastated (< 50K troops) and at war.', 'warning', 4000);
          return;
        }
        WorldMap.refresh();
        this.showCountryPanel(id);
        this.updateHUD();
      }
    });

    // Recruit buttons (event delegation)
    document.getElementById('panel-recruit').addEventListener('click', (e) => {
      const btn = e.target.closest('.recruit-btn');
      if (!btn) return;
      const type = btn.dataset.type;
      const ok = GameState.recruitUnits(type);
      if (!ok) {
        Notifications.show('Insufficient treasury to recruit.', 'warning', 4000);
      } else {
        this.updateHUD();
        const p = GameState.getCountry(GameState.playerCountryId);
        if (p) this._renderMilIntel(p);
      }
    });
  },

  showCountryPanel(id) {
    const sid = String(id);
    const c   = GameState.getCountry(sid);

    document.getElementById('panel-empty').style.display   = 'none';
    document.getElementById('panel-country').style.display = 'block';

    if (!c) {
      document.getElementById('panel-country-name').textContent = 'Unknown Territory';
      ['panel-gdp','panel-population','panel-military','panel-treasury','panel-status']
        .forEach(el => { document.getElementById(el).textContent = 'N/A'; });
      ['panel-budget','panel-recruit','panel-relations','panel-mil-intel'].forEach(el => {
        document.getElementById(el).style.display = 'none';
      });
      document.getElementById('panel-actions').style.display = 'none';
      return;
    }

    const isTerritory = c.occupiedBy === GameState.playerCountryId;

    document.getElementById('panel-actions').style.display = isTerritory ? 'none' : 'block';
    document.getElementById('panel-country-name').textContent = c.name;
    document.getElementById('panel-gdp').textContent        = `$${c.gdp.toFixed(0)}B/yr`;
    document.getElementById('panel-population').textContent = `${c.population.toFixed(1)}M`;
    document.getElementById('panel-military').textContent   = `${c.military.toFixed(0)}K`;
    document.getElementById('panel-treasury').textContent   = `$${c.treasury.toFixed(0)}B`;

    const statusMap = { player: 'You', ally: 'Ally', enemy: 'Enemy', neutral: 'Neutral' };
    document.getElementById('panel-status').textContent = isTerritory ? 'Your Territory' : (statusMap[c.relation] || 'Neutral');

    // Military intel — always visible
    document.getElementById('panel-mil-intel').style.display = 'block';
    this._renderMilIntel(c);

    // Resources — always visible
    this._renderResources(c);

    const isPlayer  = sid === GameState.playerCountryId;
    const hasPlayer = Boolean(GameState.playerCountryId);
    const isEnemy   = c.relation === 'enemy';
    const isAlly    = c.relation === 'ally';

    // Budget + Recruit — player only
    if (isPlayer) {
      this._renderBudgetSliders(c);
      this._updateBudgetSummary();
      document.getElementById('panel-budget').style.display  = 'block';
      document.getElementById('panel-recruit').style.display = 'block';
    } else {
      document.getElementById('panel-budget').style.display  = 'none';
      document.getElementById('panel-recruit').style.display = 'none';
    }

    // Tech — player only
    if (isPlayer) {
      this._renderTechPanel();
      document.getElementById('panel-tech').style.display = 'block';
    } else {
      document.getElementById('panel-tech').style.display = 'none';
    }

    // Relations — player only
    if (isPlayer) {
      this._renderRelations(c);
      document.getElementById('panel-relations').style.display = 'block';
    } else {
      document.getElementById('panel-relations').style.display = 'none';
    }

    // Diplomatic state
    const player       = hasPlayer ? GameState.getCountry(GameState.playerCountryId) : null;
    const isTrade      = player && player.tradePartners.includes(sid);
    const isSanctioning= player && c.sanctionedBy.includes(GameState.playerCountryId);
    const myStr        = hasPlayer ? GameState.calcStrength(GameState.playerCountryId) : 0;
    const canTribute   = isEnemy && myStr >= GameState.calcStrength(sid) * 2 && c.treasury > 10;

    // Buttons
    document.getElementById('btn-play-as').style.display          = hasPlayer ? 'none' : 'block';
    document.getElementById('btn-attack').style.display           = (hasPlayer && !isPlayer && !isAlly) ? 'block' : 'none';
    document.getElementById('btn-propose-alliance').style.display = (hasPlayer && !isPlayer && !isAlly && !isEnemy) ? 'block' : 'none';
    document.getElementById('btn-make-peace').style.display       = (hasPlayer && !isPlayer && isEnemy) ? 'block' : 'none';
    document.getElementById('btn-trade').style.display            = (hasPlayer && !isPlayer && !isEnemy && !isTrade) ? 'block' : 'none';
    document.getElementById('btn-cancel-trade').style.display     = (hasPlayer && !isPlayer && isTrade) ? 'block' : 'none';
    document.getElementById('btn-sanction').style.display         = (hasPlayer && !isPlayer && !isAlly && !isSanctioning) ? 'block' : 'none';
    document.getElementById('btn-lift-sanctions').style.display   = (hasPlayer && !isPlayer && isSanctioning) ? 'block' : 'none';
    document.getElementById('btn-demand-tribute').style.display   = (hasPlayer && canTribute) ? 'block' : 'none';
    document.getElementById('btn-annex').style.display            = (hasPlayer && GameState.canAnnex(sid)) ? 'block' : 'none';

    // Disable attack button if on cooldown
    document.getElementById('btn-attack').disabled = !GameState.attackReady;
  },

  _renderMilIntel(c) {
    const u  = c.units || { infantry: 0, tanks: 0, artillery: 0, fighters: 0 };
    const sid = GameState.playerCountryId ? String(c === GameState.getCountry(GameState.selectedCountryId) ? GameState.selectedCountryId : '') : '';
    const id  = Object.keys(GameState.countries).find(k => GameState.countries[k] === c) || '';
    const str = GameState.calcStrength(id);

    document.getElementById('intel-strength').textContent  = str.toLocaleString();
    document.getElementById('intel-infantry').textContent  = u.infantry.toLocaleString() + 'K';
    document.getElementById('intel-tanks').textContent     = u.tanks.toLocaleString() + 'K';
    document.getElementById('intel-artillery').textContent = u.artillery.toLocaleString() + 'K';
    document.getElementById('intel-fighters').textContent  = u.fighters.toLocaleString() + 'K';
  },

  _renderResources(c) {
    const res = c.resources || { oil: 0, food: 0, industry: 0 };
    document.getElementById('rbar-oil').style.width  = res.oil  + '%';
    document.getElementById('rbar-food').style.width = res.food + '%';
    document.getElementById('rbar-ind').style.width  = res.industry + '%';
    document.getElementById('rval-oil').textContent  = res.oil;
    document.getElementById('rval-food').textContent = res.food;
    document.getElementById('rval-ind').textContent  = res.industry;
  },

  _renderBudgetSliders(c) {
    const b = c.budget;
    const taxPct = Math.round(b.taxRate * 100);
    const milPct = Math.round(b.militaryAlloc * 100);
    const devPct = Math.round(b.devAlloc * 100);
    document.getElementById('sld-tax').value = taxPct;
    document.getElementById('sld-mil').value = milPct;
    document.getElementById('sld-dev').value = devPct;
    document.getElementById('lbl-tax').textContent = taxPct + '%';
    document.getElementById('lbl-mil').textContent = milPct + '%';
    document.getElementById('lbl-dev').textContent = devPct + '%';
  },

  _updateBudgetSummary() {
    if (!GameState.playerCountryId) return;
    const b = GameState.calcBudget(GameState.playerCountryId);
    if (!b) return;
    const fmt = v => `$${Math.abs(v).toFixed(1)}B`;
    document.getElementById('b-revenue').textContent = '+' + fmt(b.revenue);
    document.getElementById('b-mil').textContent     = '-' + fmt(b.milSpend);
    document.getElementById('b-dev').textContent     = '-' + fmt(b.devSpend);
    const netEl = document.getElementById('b-net');
    netEl.textContent = (b.toTreasury >= 0 ? '+' : '') + fmt(b.toTreasury);
    netEl.className   = b.toTreasury >= 0 ? 'pos' : 'neg';
  },

  _renderRelations(p) {
    document.getElementById('panel-allies-count').textContent  = p.allies.length;
    document.getElementById('panel-enemies-count').textContent = p.enemies.length;

    document.getElementById('panel-allies-list').innerHTML = p.allies.length === 0
      ? '<span style="color:#334155;font-size:11px">None</span>'
      : p.allies.map(aid => {
          const a = GameState.getCountry(aid);
          return `<span class="rel-tag">${a ? a.name : '#' + aid}</span>`;
        }).join('');

    document.getElementById('panel-enemies-list').innerHTML = p.enemies.length === 0
      ? '<span style="color:#334155;font-size:11px">None</span>'
      : p.enemies.map(eid => {
          const e = GameState.getCountry(eid);
          return `<span class="rel-tag enemy">${e ? e.name : '#' + eid}</span>`;
        }).join('');

    const trade = p.tradePartners || [];
    document.getElementById('panel-trade-count').textContent  = trade.length;
    document.getElementById('panel-trade-list').innerHTML = trade.length === 0
      ? '<span style="color:#334155;font-size:11px">None</span>'
      : trade.map(tid => {
          const t = GameState.getCountry(tid);
          return `<span class="rel-tag trade">${t ? t.name : '#' + tid}</span>`;
        }).join('');
  },

  _renderTechPanel() {
    const branches = { military: [], economy: [], industry: [] };
    for (const [id, tech] of Object.entries(TECH_TREE)) {
      branches[tech.branch].push({ id, ...tech });
    }

    for (const [branch, techs] of Object.entries(branches)) {
      const row = document.getElementById('tech-row-' + branch);
      if (!row) continue;
      row.innerHTML = '';
      techs.sort((a, b) => a.tier - b.tier).forEach(t => {
        let state;
        if (GameState.unlockedTechs.has(t.id))                           state = 'done';
        else if (GameState.currentResearch === t.id)                     state = 'researching';
        else if (!t.prereq || GameState.unlockedTechs.has(t.prereq))     state = 'available';
        else                                                              state = 'locked';

        const div = document.createElement('div');
        div.className = 'tech-item tech-' + state;
        div.title     = t.desc + (state === 'available' ? ` — $${t.cost}B, ${t.quarters}Q` : '');

        const sub = state === 'done'         ? '✓'
                  : state === 'researching'  ? `${GameState.researchProgress}/${t.quarters}Q`
                  : state === 'available'    ? `$${t.cost}B`
                  :                           '🔒';
        div.innerHTML = `<span class="tech-name">${t.name}</span><span class="tech-sub">${sub}</span>`;

        if (state === 'available') {
          div.addEventListener('click', () => {
            const ok = GameState.startResearch(t.id);
            if (!ok) {
              Notifications.show('Cannot start — insufficient treasury or already researching.', 'warning', 4000);
            } else {
              this._renderTechPanel();
              this._updateBudgetSummary();
            }
          });
        }
        row.appendChild(div);
      });
    }

    // Progress bar
    const prog = document.getElementById('tech-in-progress');
    if (GameState.currentResearch) {
      const t = TECH_TREE[GameState.currentResearch];
      prog.style.display = 'block';
      document.getElementById('tech-current-name').textContent = t.name;
      document.getElementById('tech-prog-n').textContent       = GameState.researchProgress;
      document.getElementById('tech-prog-total').textContent   = t.quarters;
      document.getElementById('tech-prog-fill').style.width    =
        Math.round(GameState.researchProgress / t.quarters * 100) + '%';
    } else {
      prog.style.display = 'none';
    }
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
    document.getElementById('hud-strength').textContent = GameState.calcStrength(GameState.playerCountryId).toLocaleString();
    document.getElementById('game-date').textContent  = `Year ${GameState.year} Q${GameState.quarter}`;

    // Refresh open panel if it's player's country
    if (GameState.selectedCountryId === GameState.playerCountryId) {
      document.getElementById('panel-gdp').textContent      = `$${p.gdp.toFixed(0)}B/yr`;
      document.getElementById('panel-treasury').textContent = `$${p.treasury.toFixed(0)}B`;
      document.getElementById('panel-military').textContent = `${p.military.toFixed(0)}K`;
      this._renderMilIntel(p);
      this._updateBudgetSummary();
      this._renderRelations(p);
      this._renderTechPanel();
    }

    // Re-enable attack button when cooldown resets
    if (GameState.attackReady) {
      document.getElementById('btn-attack').disabled = false;
    }
  },
};
