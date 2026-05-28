'use strict';

let _tradeCom = 'oil';

const TRAIT_CFG = {
  militarist:    { icon: '🪖', cls: 'trait-militarist',    label: 'Militarist',    bonus: '+10% Combat Strength'  },
  economist:     { icon: '💼', cls: 'trait-economist',     label: 'Economist',     bonus: '+GDP Growth /quarter'  },
  industrialist: { icon: '⚙',  cls: 'trait-industrialist', label: 'Industrialist', bonus: '+20% Resource GDP'     },
  diplomat:      { icon: '🤝', cls: 'trait-diplomat',      label: 'Diplomat',      bonus: '+25% Trade Income'     },
  nationalist:   { icon: '⚑',  cls: 'trait-nationalist',   label: 'Nationalist',   bonus: '+25% War Income'       },
  reformer:      { icon: '📋', cls: 'trait-reformer',      label: 'Reformer',      bonus: '+2% Tax Efficiency'    },
};

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

    document.querySelectorAll('.tr-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tr-tab').forEach(b => b.classList.remove('tr-active'));
        btn.classList.add('tr-active');
        _tradeCom = btn.dataset.com;
        this._renderTradeRankings(_tradeCom);
      });
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
      document.getElementById('btn-save').disabled  = false;
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

    // Spy buttons
    document.getElementById('btn-spy-sabotage').addEventListener('click', () => {
      const id = GameState.selectedCountryId; if (!id) return;
      const r = GameState.doSpy(id, 'sabotage');
      Notifications.show(r.success ? `Sabotage successful on <b>${r.name}</b>!` : `Sabotage operation failed.`, r.success ? 'milestone' : 'warning', 4000);
      this.showCountryPanel(id); this.updateHUD();
    });
    document.getElementById('btn-spy-unrest').addEventListener('click', () => {
      const id = GameState.selectedCountryId; if (!id) return;
      const r = GameState.doSpy(id, 'unrest');
      Notifications.show(r.success ? `Civil unrest incited in <b>${r.name}</b>!` : `Operation failed — agent compromised.`, r.success ? 'milestone' : 'warning', 4000);
      this.showCountryPanel(id);
    });
    document.getElementById('btn-spy-tech').addEventListener('click', () => {
      const id = GameState.selectedCountryId; if (!id) return;
      const r = GameState.doSpy(id, 'steal_tech');
      Notifications.show(r.success ? `Technology stolen from <b>${r.name}</b>! GDP bonus gained.` : `Tech theft failed.`, r.success ? 'milestone' : 'warning', 4000);
      this.showCountryPanel(id); this.updateHUD();
    });

    // Charts modal
    document.getElementById('btn-charts').addEventListener('click', () => {
      document.getElementById('charts-modal').style.display = 'flex';
      this._renderCharts();
    });
    document.getElementById('btn-charts-close').addEventListener('click', () => {
      document.getElementById('charts-modal').style.display = 'none';
    });

    // Build buttons
    const BUILD_LABELS = { oil: 'Oil Refinery', food: 'Agri Complex', industry: 'Industrial Zone', minerals: 'Mineral Mine', tech: 'Tech Hub' };
    ['oil', 'food', 'industry', 'minerals', 'tech'].forEach(com => {
      const btn = document.getElementById('btn-build-' + com);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const ok = GameState.buildFactory(com);
        if (!ok) {
          Notifications.show('Cannot build — insufficient treasury or max level reached.', 'warning', 4000);
          return;
        }
        const p = GameState.getCountry(GameState.playerCountryId);
        if (p) {
          this._renderBuild(GameState.playerCountryId, p);
          this._renderResources(p);
          this._renderTrade(GameState.playerCountryId, p);
          this._updateBudgetSummary();
          this.updateHUD();
          Notifications.show(`${BUILD_LABELS[com]} built! +20 ${com} production (now: ${Math.round(p.resources[com])}).`, 'milestone', 4000);
        }
      });
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

    const isTerritory = c.occupiedBy !== null && c.occupiedBy === GameState.playerCountryId;

    document.getElementById('panel-actions').style.display = isTerritory ? 'none' : 'block';
    document.getElementById('panel-country-name').textContent = c.name;
    document.getElementById('panel-gdp').textContent        = `$${c.gdp.toFixed(0)}B/yr`;
    document.getElementById('panel-population').textContent = `${c.population.toFixed(1)}M`;
    document.getElementById('panel-military').textContent   = `${c.military.toFixed(0)}K`;
    document.getElementById('panel-treasury').textContent   = `$${c.treasury.toFixed(0)}B`;

    const statusMap  = { player: 'You', ally: 'Ally', enemy: 'Enemy', neutral: 'Neutral' };
    const statusText = isTerritory ? 'Your Territory' : (statusMap[c.relation] || 'Neutral');
    const statusKey  = isTerritory ? 'territory' : (c.relation || 'neutral');
    const statusEl   = document.getElementById('panel-status');
    statusEl.textContent = statusText;
    statusEl.className   = `status-badge status-${statusKey}`;
    document.getElementById('panel-country').dataset.relation = statusKey;

    // Military intel — always visible
    document.getElementById('panel-mil-intel').style.display = 'block';
    this._renderMilIntel(c);

    // Stability + blocks — always visible
    this._renderStability(sid, c);
    this._renderBlocks(sid);

    // Resources — always visible
    this._renderResources(c);

    // Trade balance — always visible
    this._renderTrade(sid, c);

    const isPlayer  = sid === GameState.playerCountryId;
    const hasPlayer = Boolean(GameState.playerCountryId);
    const isEnemy   = c.relation === 'enemy';
    const isAlly    = c.relation === 'ally';

    // Espionage — non-player countries when player exists and not an ally
    const showSpy = hasPlayer && !isPlayer && !isTerritory && c.relation !== 'ally';
    document.getElementById('panel-spy').style.display = showSpy ? 'block' : 'none';

    // Budget + Build + Recruit — player only
    if (isPlayer) {
      this._renderBudgetSliders(c);
      this._updateBudgetSummary();
      this._renderBuild(sid, c);
      document.getElementById('panel-budget').style.display  = 'block';
      document.getElementById('panel-build').style.display   = 'block';
      document.getElementById('panel-recruit').style.display = 'block';
    } else {
      document.getElementById('panel-budget').style.display  = 'none';
      document.getElementById('panel-build').style.display   = 'none';
      document.getElementById('panel-recruit').style.display = 'none';
    }

    // Tech + Victory Progress — player only
    if (isPlayer) {
      this._renderTechPanel();
      this._renderVictoryProgress();
      document.getElementById('panel-tech').style.display     = 'block';
      document.getElementById('panel-progress').style.display = 'block';
    } else {
      document.getElementById('panel-tech').style.display     = 'none';
      document.getElementById('panel-progress').style.display = 'none';
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

    // Leader card — rendered last so it never blocks button setup above
    this._renderLeader(sid, c);
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

  _renderLeader(id, c) {
    const leader = c.leader;
    if (!leader) return;
    const cfg = TRAIT_CFG[leader.trait] || { icon: '👤', cls: 'trait-neutral', label: leader.trait, bonus: '' };
    const isPlayer = String(id) === GameState.playerCountryId;

    const iconEl  = document.getElementById('leader-icon');
    const nameEl  = document.getElementById('leader-name');
    const titleEl = document.getElementById('leader-title');
    const badge   = document.getElementById('leader-trait-badge');
    if (!iconEl || !nameEl || !titleEl || !badge) return; // HTML not yet loaded

    iconEl.textContent  = cfg.icon;
    nameEl.textContent  = leader.name;
    titleEl.textContent = leader.title;
    badge.textContent = cfg.label;
    badge.className   = 'trait-badge ' + cfg.cls;

    const bonusEl = document.getElementById('leader-bonus');
    if (bonusEl) {
      if (isPlayer && cfg.bonus) {
        bonusEl.textContent   = 'Bonus: ' + cfg.bonus;
        bonusEl.style.display = 'block';
      } else {
        bonusEl.style.display = 'none';
      }
    }
  },

  _renderBuild(id, c) {
    const facs = c.factories || { oil: 0, food: 0, industry: 0 };
    const MAX  = 5;
    for (const com of ['oil', 'food', 'industry', 'minerals', 'tech']) {
      const n      = facs[com] || 0;
      const lvlEl  = document.getElementById('bl-' + com);
      const costEl = document.getElementById('bc-' + com);
      const btnEl  = document.getElementById('btn-build-' + com);
      if (!lvlEl || !costEl || !btnEl) continue;
      lvlEl.textContent = `Lv ${n}/${MAX}`;
      if (n >= MAX) {
        btnEl.textContent = 'MAX LEVEL';
        btnEl.disabled    = true;
      } else {
        costEl.textContent = 30 * (n + 1);
        btnEl.disabled     = c.treasury < 30 * (n + 1);
      }
    }
  },

  _renderResources(c) {
    const res = c.resources || {};
    const setRes = (barId, valId, v) => {
      const el = document.getElementById(barId); if (el) el.style.width = Math.min(100, v || 0) + '%';
      const vl = document.getElementById(valId); if (vl) vl.textContent = Math.round(v || 0);
    };
    setRes('rbar-oil',  'rval-oil',  res.oil);
    setRes('rbar-food', 'rval-food', res.food);
    setRes('rbar-ind',  'rval-ind',  res.industry);
    setRes('rbar-min',  'rval-min',  res.minerals);
    setRes('rbar-tech', 'rval-tech', res.tech);
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
    const p   = GameState.getCountry(GameState.playerCountryId);
    const fmt = v => `$${Math.abs(v).toFixed(1)}B`;
    document.getElementById('b-revenue').textContent = '+' + fmt(b.revenue);
    document.getElementById('b-mil').textContent     = '-' + fmt(b.milSpend);
    document.getElementById('b-dev').textContent     = '-' + fmt(b.devSpend);
    const netEl = document.getElementById('b-net');
    netEl.textContent = (b.toTreasury >= 0 ? '+' : '') + fmt(b.toTreasury);
    netEl.className   = b.toTreasury >= 0 ? 'pos' : 'neg';
    const tradeEl = document.getElementById('b-trade');
    if (tradeEl) {
      tradeEl.textContent = (b.tradeBal >= 0 ? '+' : '-') + fmt(b.tradeBal);
      tradeEl.className   = b.tradeBal >= 0 ? 'pos' : 'neg';
    }
    const totalEl = document.getElementById('b-total');
    if (totalEl) {
      totalEl.textContent = (b.net >= 0 ? '+' : '-') + fmt(b.net);
      totalEl.className   = b.net >= 0 ? 'pos' : 'neg';
    }
    // Inflation
    const inflEl = document.getElementById('b-inflation');
    if (inflEl && p) {
      const infl = p.inflation || 0;
      inflEl.textContent = infl.toFixed(1) + '%';
      inflEl.className   = infl > 15 ? 'neg' : infl > 8 ? 'warn' : 'pos';
    }
    // Debt interest rate
    const drEl = document.getElementById('b-debtrate');
    if (drEl && p) {
      if (p.treasury >= 0) {
        drEl.textContent = '—'; drEl.className = 'flat';
      } else {
        const dr = Math.abs(p.treasury) / Math.max(p.gdp, 1);
        const rate = dr < 0.5 ? 3 : dr < 1.0 ? 6 : 12;
        drEl.textContent = rate + '%/yr'; drEl.className = 'neg';
      }
    }
  },

  _renderTrade(id, c) {
    const tb  = GameState.calcTradeBalance(id);
    const fmtV = v => (v >= 0 ? '+' : '-') + '$' + Math.abs(v).toFixed(1) + 'B';
    const setRow = (valId, badgeId, val) => {
      const valEl   = document.getElementById(valId);
      const badgeEl = document.getElementById(badgeId);
      if (!valEl || !badgeEl) return;
      valEl.textContent = fmtV(val);
      valEl.className   = 'trade-val ' + (val >= 0 ? 'pos' : 'neg');
      badgeEl.textContent = val >= 0 ? 'EXPORT' : 'IMPORT';
      badgeEl.className   = 'trade-badge ' + (val >= 0 ? 'export' : 'import');
    };
    setRow('trade-val-oil',  'trade-badge-oil',  tb.oil);
    setRow('trade-val-food', 'trade-badge-food', tb.food);
    setRow('trade-val-ind',  'trade-badge-ind',  tb.industry);
    setRow('trade-val-min',  'trade-badge-min',  tb.minerals);
    setRow('trade-val-tech', 'trade-badge-tech', tb.tech);
    const totalEl = document.getElementById('trade-total');
    if (totalEl) {
      totalEl.textContent = fmtV(tb.total);
      totalEl.className   = tb.total >= 0 ? 'pos' : 'neg';
    }
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
    this._renderCommodityMarket();
    this._renderLeaderboard();
    this._renderTradeRankings(_tradeCom);
  },

  _renderVictoryProgress() {
    const p = GameState.getCountry(GameState.playerCountryId);
    if (!p) return;

    const annexed    = Object.values(GameState.countries).filter(c => c.occupiedBy === GameState.playerCountryId).length;
    const controlled = 1 + annexed;
    document.getElementById('vp-dom').style.width  = Math.min(100, controlled / 20 * 100) + '%';
    document.getElementById('vp-dom-txt').textContent = `${controlled}/20`;

    const ecoPct = Math.min(100, p.gdp / 30000 * 100);
    document.getElementById('vp-eco').style.width  = ecoPct + '%';
    document.getElementById('vp-eco-txt').textContent = Math.round(ecoPct) + '%';

    const allies = p.allies.length, techs = GameState.unlockedTechs.size;
    const dipPct = Math.min(100, (allies / 8 * 0.6 + techs / 5 * 0.4) * 100);
    document.getElementById('vp-dip').style.width  = dipPct + '%';
    document.getElementById('vp-dip-txt').textContent = `${allies}a/${techs}t`;
  },

  _renderLeaderboard() {
    const el = document.getElementById('lb-entries');
    if (!el) return;
    const pid = GameState.playerCountryId;
    const rows = Object.entries(GameState.countries)
      .filter(([, c]) => !c.occupiedBy)
      .map(([id, c]) => ({ id, name: c.name, str: GameState.calcStrength(id), isPlayer: id === pid }))
      .sort((a, b) => b.str - a.str)
      .slice(0, 12);

    const medals = ['🥇','🥈','🥉'];
    el.innerHTML = rows.map((r, i) =>
      `<div class="lb-row${r.isPlayer ? ' lb-player' : ''}">` +
      `<span class="lb-rank${i < 3 ? ' lb-rank-' + (i+1) : ''}">${medals[i] || (i + 1)}</span>` +
      `<span class="lb-name">${r.name}</span>` +
      `<span class="lb-val">${r.str.toLocaleString()}</span>` +
      `</div>`
    ).join('');
  },

  _sparkline(history, color) {
    if (history.length < 2) return '';
    const W = 56, H = 20;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const rng = (max - min) || 0.01;
    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1)) * W;
      const y = H - ((v - min) / rng) * (H - 2) - 1;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return `<svg width="${W}" height="${H}" style="overflow:visible;display:block">` +
      `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<circle cx="${(history.length - 1) / (history.length - 1) * W}" cy="${H - ((history[history.length - 1] - min) / rng) * (H - 2) - 1}" r="2" fill="${color}"/>` +
      `</svg>`;
  },

  _renderCommodityMarket() {
    // Economic cycle badge
    const cycleEl = document.getElementById('eco-cycle-badge');
    if (cycleEl) {
      const ec = GameState._economicCycle || { phase: 'normal', quartersLeft: 0 };
      const label = ec.phase === 'boom' ? '🚀 Boom' : ec.phase === 'recession' ? '📉 Recession' : '⚖ Normal';
      cycleEl.textContent = label;
      cycleEl.className   = 'eco-badge eco-' + ec.phase;
    }

    const COM_CFG = [
      { key: 'oil',      sparkId: 'cm-spark-oil',  trendId: 'cm-trend-oil',  priceId: 'cm-price-oil',  sdId: 'cm-sd-oil'  },
      { key: 'food',     sparkId: 'cm-spark-food', trendId: 'cm-trend-food', priceId: 'cm-price-food', sdId: 'cm-sd-food' },
      { key: 'industry', sparkId: 'cm-spark-ind',  trendId: 'cm-trend-ind',  priceId: 'cm-price-ind',  sdId: 'cm-sd-ind'  },
      { key: 'minerals', sparkId: 'cm-spark-min',  trendId: 'cm-trend-min',  priceId: 'cm-price-min',  sdId: 'cm-sd-min'  },
      { key: 'tech',     sparkId: 'cm-spark-tech', trendId: 'cm-trend-tech', priceId: 'cm-price-tech', sdId: 'cm-sd-tech' },
    ];
    for (const cfg of COM_CFG) {
      const price   = GameState.commodityPrices[cfg.key];
      const history = GameState.priceHistory[cfg.key];
      const prev    = history.length >= 2 ? history[history.length - 2] : price;

      const cls      = price > 1.08 ? 'up' : price < 0.92 ? 'down' : 'flat';
      const trendChr = price > prev * 1.003 ? '▲' : price < prev * 0.997 ? '▼' : '→';
      const trendCls = price > prev * 1.003 ? 'up' : price < prev * 0.997 ? 'down' : 'flat';
      const color    = cls === 'up' ? '#4ade80' : cls === 'down' ? '#f87171' : '#475569';

      const sparkEl = document.getElementById(cfg.sparkId);
      if (sparkEl) sparkEl.innerHTML = this._sparkline(history, color);

      const trendEl = document.getElementById(cfg.trendId);
      if (trendEl) { trendEl.textContent = trendChr; trendEl.className = 'cm-trend ' + trendCls; }

      const priceEl = document.getElementById(cfg.priceId);
      if (priceEl) { priceEl.textContent = price.toFixed(2) + '×'; priceEl.className = 'cm-price ' + cls; }

      // Supply / demand stats
      const stats = (GameState._tradeStats || {})[cfg.key];
      const sdEl  = document.getElementById(cfg.sdId);
      if (sdEl && stats) {
        const r = stats.ratio;
        const statusLabel = r > 1.15 ? 'Oversupply' : r < 0.87 ? 'Shortage' : 'Balanced';
        const statusCls   = r > 1.15 ? 'sd-glut'    : r < 0.87 ? 'sd-short'  : 'sd-bal';
        sdEl.innerHTML =
          `S:<b>${stats.supply}</b> D:<b>${stats.demand}</b>` +
          ` — <span class="${statusCls}">${statusLabel}</span>` +
          ` <span class="sd-vol">Vol:${stats.volume}</span>`;
      }
    }
  },

  _renderTradeRankings(commodity) {
    const el = document.getElementById('tr-list');
    if (!el) return;
    const pid = GameState.playerCountryId;

    const rows = Object.entries(GameState.countries)
      .filter(([, c]) => !c.occupiedBy)
      .map(([id, c]) => {
        const tb  = GameState.calcTradeBalance(id);
        return { id, name: c.name, val: tb[commodity] || 0 };
      });

    const exporters = rows.filter(r => r.val > 0).sort((a, b) => b.val - a.val).slice(0, 5);
    const importers = rows.filter(r => r.val < 0).sort((a, b) => a.val - b.val).slice(0, 5);
    const maxAbs    = Math.max(...rows.map(r => Math.abs(r.val)), 0.01);

    const fmtV = v => (v >= 0 ? '+' : '-') + '$' + Math.abs(v).toFixed(1) + 'B';

    const renderGroup = (title, items, cls) => {
      if (!items.length) return '';
      return `<div class="tr-group-title ${cls}">${title}</div>` +
        items.map(r => {
          const pct = Math.abs(r.val) / maxAbs * 100;
          const isP = r.id === pid;
          return `<div class="tr-row${isP ? ' tr-player' : ''}">` +
            `<span class="tr-name">${r.name}</span>` +
            `<div class="tr-bar-wrap"><div class="tr-bar ${cls}" style="width:${pct.toFixed(1)}%"></div></div>` +
            `<span class="tr-val ${cls}">${fmtV(r.val)}</span>` +
            `</div>`;
        }).join('');
    };

    el.innerHTML = renderGroup('▲ Exporters', exporters, 'export') +
                   renderGroup('▼ Importers', importers, 'import');
  },

  _renderStability(id, c) {
    const stab   = c.stability || 70;
    const fillEl = document.getElementById('stab-fill');
    const valEl  = document.getElementById('stab-val');
    const statEl = document.getElementById('stab-status');
    if (!fillEl) return;
    fillEl.style.width = Math.max(0, Math.min(100, stab)) + '%';
    fillEl.className   = 'stab-fill ' + (stab >= 70 ? 'stab-high' : stab >= 40 ? 'stab-mid' : 'stab-low');
    if (valEl) valEl.textContent = Math.round(stab);
    if (statEl) {
      const label = stab >= 80 ? 'Stable' : stab >= 60 ? 'Normal' : stab >= 40 ? 'Unstable' : stab >= 20 ? 'Volatile' : 'Crisis';
      const cls   = stab >= 60 ? 'stab-ok' : stab >= 40 ? 'stab-warn' : 'stab-crit';
      statEl.textContent = label;
      statEl.className   = 'stab-status ' + cls;
    }
  },

  _renderBlocks(id) {
    const el = document.getElementById('panel-blocks');
    if (!el) return;
    const blocks = GameState.getCountryBlocks ? GameState.getCountryBlocks(id) : [];
    if (!blocks || blocks.length === 0) { el.innerHTML = ''; return; }
    el.innerHTML = blocks.map(b => {
      const tip = b.bonus.commodity === 'all'
        ? `+${(b.bonus.rate * 100) | 0}% all trade`
        : `+${(b.bonus.rate * 100) | 0}% ${b.bonus.commodity}`;
      return `<span class="block-badge" title="${tip}">${b.icon} ${b.name}</span>`;
    }).join('');
  },

  _renderCharts() {
    const canvas = document.getElementById('charts-canvas');
    const legend = document.getElementById('charts-legend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const PAD = { top: 16, right: 16, bottom: 36, left: 60 };

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1f2d';
    ctx.fillRect(0, 0, W, H);

    const pid = GameState.playerCountryId;
    const valid = Object.entries(GameState.countries)
      .filter(([, c]) => !c.occupiedBy && c.gdpHistory && c.gdpHistory.length > 1)
      .map(([id, c]) => ({ id, c }));

    const top5 = valid.filter(x => x.id !== pid).sort((a, b) => b.c.gdp - a.c.gdp).slice(0, 5);
    const subjects = pid && GameState.getCountry(pid) ? [{ id: pid, c: GameState.getCountry(pid) }, ...top5] : top5;

    const COLORS = ['#4ade80','#60a5fa','#f87171','#fbbf24','#c084fc','#38bdf8'];
    let maxLen = 0, minGdp = Infinity, maxGdp = 0;
    subjects.forEach(({ c }) => {
      if (!c || !c.gdpHistory) return;
      maxLen = Math.max(maxLen, c.gdpHistory.length);
      c.gdpHistory.forEach(v => { minGdp = Math.min(minGdp, v); maxGdp = Math.max(maxGdp, v); });
    });

    if (maxLen < 2) {
      ctx.fillStyle = '#475569'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Not enough data yet. Wait a few quarters.', PAD.left + 8, H / 2);
      if (legend) legend.innerHTML = '';
      return;
    }

    minGdp = Math.max(0, minGdp * 0.9);
    maxGdp = maxGdp * 1.05;
    const gRange = maxGdp - minGdp || 1;
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top  - PAD.bottom;

    // Grid lines + Y labels
    for (let g = 0; g <= 4; g++) {
      const y = PAD.top + (1 - g / 4) * chartH;
      ctx.strokeStyle = '#1e3548'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      const v = minGdp + gRange * (g / 4);
      const lbl = v >= 1000 ? (v / 1000).toFixed(1) + 'T' : Math.round(v) + 'B';
      ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('$' + lbl, PAD.left - 4, y + 4);
    }

    // Lines
    subjects.forEach(({ id, c }, i) => {
      if (!c || !c.gdpHistory || c.gdpHistory.length < 2) return;
      ctx.strokeStyle = COLORS[i % COLORS.length];
      ctx.lineWidth   = id === pid ? 2.5 : 1.5;
      ctx.beginPath();
      c.gdpHistory.forEach((v, j) => {
        const x = PAD.left + (j / (maxLen - 1)) * chartW;
        const y = PAD.top  + (1 - (v - minGdp) / gRange) * chartH;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // X labels
    const startYr = GameState.year - Math.floor(maxLen / 4);
    ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';  ctx.fillText(String(startYr), PAD.left, H - 6);
    ctx.textAlign = 'right'; ctx.fillText(String(GameState.year), W - PAD.right, H - 6);

    // Legend
    if (legend) {
      legend.innerHTML = subjects.map(({ id, c }, i) => {
        if (!c) return '';
        const mark = id === pid ? ' (You)' : '';
        return `<span class="chart-legend-item"><span class="chart-legend-dot" style="background:${COLORS[i % COLORS.length]}"></span>${c.name}${mark}</span>`;
      }).join('');
    }
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
      this._renderStability(GameState.playerCountryId, p);
      this._renderTrade(GameState.playerCountryId, p);
      this._updateBudgetSummary();
      this._renderRelations(p);
      this._renderTechPanel();
      this._renderVictoryProgress();
    }

    // Re-enable attack button when cooldown resets
    if (GameState.attackReady) {
      document.getElementById('btn-attack').disabled = false;
    }

    // Update overview panels when no country panel open
    if (!GameState.selectedCountryId) {
      this._renderCommodityMarket();
      this._renderLeaderboard();
      this._renderTradeRankings(_tradeCom);
    }
  },
};
