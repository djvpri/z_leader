'use strict';

const MAJOR_POWER_IDS = new Set(['840', '156', '643', '276', '826', '250', '392', '356']);

const AI = {
  _bgNotifs: 0, // background notifications this tick (throttled)

  tick() {
    this._bgNotifs = 0;
    const pid = GameState.playerCountryId;
    for (const id of Object.keys(GameState.countries)) {
      if (id === pid) continue;
      this._process(id);
    }
  },

  _notify(msg, type, dur = 4000) {
    if (this._bgNotifs >= 2) return;
    this._bgNotifs++;
    Notifications.show(msg, type, dur);
  },

  _process(id) {
    const c = GameState.countries[id];
    if (!c || c.occupiedBy) return; // skip annexed territories
    this._adjustBudget(c);
    this._seekPeace(id, c);
    this._attackEnemies(id, c);
    this._declareWar(id, c);
    this._formAlliance(id, c);
    this._tradeDeals(id, c);
  },

  _adjustBudget(c) {
    if (c.enemies.length > 0) {
      c.budget.militaryAlloc = Math.min(0.65, c.budget.militaryAlloc + 0.04);
      c.budget.devAlloc      = Math.max(0.05, c.budget.devAlloc - 0.02);
    } else {
      c.budget.militaryAlloc += (0.30 - c.budget.militaryAlloc) * 0.08;
      c.budget.devAlloc      += (0.30 - c.budget.devAlloc)      * 0.08;
    }
  },

  _seekPeace(id, c) {
    if (c.enemies.length === 0) return;
    if (Math.random() > 0.07)   return;

    const myStr = GameState.calcStrength(id);
    let avgEnemyStr = 0;
    for (const eid of c.enemies) avgEnemyStr += GameState.calcStrength(eid);
    avgEnemyStr /= c.enemies.length;

    if (myStr >= avgEnemyStr * 0.4 && c.treasury >= 0) return;

    const eid   = c.enemies[0];
    const enemy = GameState.countries[eid];
    if (!enemy) return;

    this._makePeaceBetween(id, eid);

    const pid = GameState.playerCountryId;
    if (id === pid || eid === pid) {
      Notifications.show(`<b>${c.name}</b> proposes peace — you are no longer at war.`, 'peace', 6000);
      WorldNews.add(`${c.name} and ${enemy.name} sign a peace agreement.`);
    } else {
      this._notify(`<b>${c.name}</b> signs peace with <b>${enemy.name}</b>.`, 'peace');
      if (MAJOR_POWER_IDS.has(id) || MAJOR_POWER_IDS.has(eid)) {
        WorldNews.add(`${c.name} and ${enemy.name} end hostilities.`);
      }
    }
  },

  _attackEnemies(id, c) {
    if (c.enemies.length === 0) return;
    if (GameState.calcStrength(id) <= 0) return;
    if (Math.random() > 0.18)   return;

    const eid = c.enemies[Math.floor(Math.random() * c.enemies.length)];
    this._aiAttack(id, eid);
  },

  _aiAttack(atkId, defId) {
    const atk = GameState.countries[atkId];
    const def = GameState.countries[defId];
    if (!atk || !def) return;

    const atkStr = GameState.calcStrength(atkId);
    const defStr = GameState.calcStrength(defId);
    if (atkStr <= 0) return;
    const ratio = atkStr / (defStr * 1.25 + 1);

    let outcome, atkLoss, defLoss;
    if      (ratio >= 2.0) { outcome = 'decisive'; atkLoss = 0.05; defLoss = 0.65; }
    else if (ratio >= 1.0) { outcome = 'victory';  atkLoss = 0.15; defLoss = 0.40; }
    else if (ratio >= 0.6) { outcome = 'stalemate';atkLoss = 0.20; defLoss = 0.20; }
    else                   { outcome = 'defeat';   atkLoss = 0.30; defLoss = 0.08; }

    GameState._applyLosses(atkId, atkLoss);
    GameState._applyLosses(defId, defLoss);

    const pid = GameState.playerCountryId;
    if (defId === pid) {
      if (outcome === 'defeat') {
        Notifications.show(`<b>${atk.name}</b> attacked — you repelled them! (${atkStr} vs ${defStr})`, 'info', 6000);
      } else {
        const sev = outcome === 'decisive' ? 'danger' : outcome === 'victory' ? 'danger' : 'warning';
        Notifications.show(`<b>${atk.name}</b> attacks you! (${atkStr} vs ${defStr}) — ${outcome}.`, sev, 7000);
      }
    } else if (atkId !== pid) {
      if (MAJOR_POWER_IDS.has(atkId) || MAJOR_POWER_IDS.has(defId)) {
        if (Math.random() < 0.20) {
          this._notify(`<b>${atk.name}</b> strikes <b>${def.name}</b>. ${outcome}.`, 'war');
        }
        if (outcome === 'decisive' || outcome === 'victory') {
          WorldNews.add(`${atk.name} forces advance against ${def.name} — ${outcome}.`);
        }
      }
    }
  },

  _declareWar(id, c) {
    if (c.enemies.length >= 2) return;
    if (Math.random() > 0.015) return;

    const myStr      = GameState.calcStrength(id);
    const candidates = Object.keys(GameState.countries).filter(tid =>
      tid !== id && !c.allies.includes(tid) && !c.enemies.includes(tid)
    );
    if (candidates.length === 0) return;

    const pool = candidates
      .map(tid => ({ tid, str: GameState.calcStrength(tid) }))
      .filter(x => x.str > 0 && x.str < myStr * 1.5)
      .sort((a, b) => b.str - a.str)
      .slice(0, 6);

    if (pool.length === 0) return;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const target = GameState.countries[chosen.tid];
    if (!target) return;

    // Nuclear deterrence — player's nuclear arsenal deters AI aggression
    if (chosen.tid === GameState.playerCountryId && GameState.unlockedTechs.has('nuclear')) {
      if (Math.random() < 0.70) return;
    }

    this._declareWarBetween(id, chosen.tid);

    const pid = GameState.playerCountryId;
    if (chosen.tid === pid) {
      Notifications.show(`<b>${c.name}</b> declared war on you!`, 'war', 9000);
      WorldNews.add(`${c.name} declares war on ${target.name}!`);
    } else if (id !== pid) {
      if (MAJOR_POWER_IDS.has(id) || MAJOR_POWER_IDS.has(chosen.tid) || Math.random() < 0.15) {
        this._notify(`<b>${c.name}</b> declares war on <b>${target.name}</b>!`, 'war', 5000);
        WorldNews.add(`${c.name} declares war on ${target.name}!`);
      }
    }
  },

  _formAlliance(id, c) {
    if (c.allies.length >= 2)  return;
    if (Math.random() > 0.012) return;

    const pid        = GameState.playerCountryId;
    const candidates = Object.keys(GameState.countries).filter(tid =>
      tid !== id && tid !== pid &&
      !c.allies.includes(tid) && !c.enemies.includes(tid)
    );
    if (candidates.length === 0) return;

    const tid    = candidates[Math.floor(Math.random() * candidates.length)];
    const target = GameState.countries[tid];
    if (!target) return;

    this._allyBetween(id, tid);

    if (MAJOR_POWER_IDS.has(id) || MAJOR_POWER_IDS.has(tid) || Math.random() < 0.12) {
      this._notify(`<b>${c.name}</b> forms alliance with <b>${target.name}</b>.`, 'alliance');
      if (MAJOR_POWER_IDS.has(id) || MAJOR_POWER_IDS.has(tid)) {
        WorldNews.add(`${c.name} and ${target.name} forge a new alliance.`);
      }
    }
  },

  _tradeDeals(id, c) {
    if (Math.random() > 0.010) return;
    if ((c.tradePartners || []).length >= 3) return;

    const candidates = Object.keys(GameState.countries).filter(tid =>
      tid !== id &&
      !c.enemies.includes(tid) &&
      !(c.tradePartners || []).includes(tid)
    );
    if (candidates.length === 0) return;

    const tid    = candidates[Math.floor(Math.random() * candidates.length)];
    const target = GameState.countries[tid];
    if (!target) return;

    c.tradePartners = [...new Set([...(c.tradePartners || []), tid])];
    target.tradePartners = [...new Set([...(target.tradePartners || []), id])];
  },

  _declareWarBetween(id1, id2) {
    const c1 = GameState.countries[id1];
    const c2 = GameState.countries[id2];
    if (!c1 || !c2) return;
    c1.allies  = c1.allies.filter(x => x !== id2);
    c1.enemies = [...new Set([...c1.enemies, id2])];
    c2.allies  = c2.allies.filter(x => x !== id1);
    c2.enemies = [...new Set([...c2.enemies, id1])];
    // Cancel trade on war
    c1.tradePartners = (c1.tradePartners || []).filter(x => x !== id2);
    c2.tradePartners = (c2.tradePartners || []).filter(x => x !== id1);
    if (id1 === GameState.playerCountryId || id2 === GameState.playerCountryId) {
      GameState.updateRelations();
    }
  },

  _makePeaceBetween(id1, id2) {
    const c1 = GameState.countries[id1];
    const c2 = GameState.countries[id2];
    if (!c1 || !c2) return;
    c1.enemies = c1.enemies.filter(x => x !== id2);
    c2.enemies = c2.enemies.filter(x => x !== id1);
    if (id1 === GameState.playerCountryId || id2 === GameState.playerCountryId) {
      GameState.updateRelations();
    }
  },

  _allyBetween(id1, id2) {
    const c1 = GameState.countries[id1];
    const c2 = GameState.countries[id2];
    if (!c1 || !c2) return;
    c1.enemies = c1.enemies.filter(x => x !== id2);
    c1.allies  = [...new Set([...c1.allies, id2])];
    c2.enemies = c2.enemies.filter(x => x !== id1);
    c2.allies  = [...new Set([...c2.allies, id1])];
    if (id1 === GameState.playerCountryId || id2 === GameState.playerCountryId) {
      GameState.updateRelations();
    }
  },
};
