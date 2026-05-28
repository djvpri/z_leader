'use strict';

const COUNTRY_DATA = {
  4:   { name: 'Afghanistan',       gdp: 20,    population: 40,   military: 170, treasury: 10  },
  12:  { name: 'Algeria',           gdp: 191,   population: 45,   military: 317, treasury: 200 },
  24:  { name: 'Angola',            gdp: 75,    population: 34,   military: 107, treasury: 80  },
  32:  { name: 'Argentina',         gdp: 641,   population: 45,   military: 95,  treasury: 300 },
  36:  { name: 'Australia',         gdp: 1693,  population: 26,   military: 58,  treasury: 1200},
  50:  { name: 'Bangladesh',        gdp: 460,   population: 170,  military: 160, treasury: 200 },
  56:  { name: 'Belgium',           gdp: 594,   population: 11,   military: 30,  treasury: 500 },
  68:  { name: 'Bolivia',           gdp: 44,    population: 12,   military: 46,  treasury: 60  },
  76:  { name: 'Brazil',            gdp: 1920,  population: 215,  military: 360, treasury: 900 },
  104: { name: 'Myanmar',           gdp: 65,    population: 55,   military: 406, treasury: 50  },
  116: { name: 'Cambodia',          gdp: 28,    population: 17,   military: 124, treasury: 30  },
  120: { name: 'Cameroon',          gdp: 45,    population: 27,   military: 23,  treasury: 40  },
  124: { name: 'Canada',            gdp: 2140,  population: 38,   military: 68,  treasury: 1400},
  152: { name: 'Chile',             gdp: 317,   population: 19,   military: 80,  treasury: 280 },
  156: { name: 'China',             gdp: 17963, population: 1412, military: 2035,treasury: 6000},
  170: { name: 'Colombia',          gdp: 344,   population: 51,   military: 295, treasury: 250 },
  178: { name: 'Congo',             gdp: 12,    population: 6,    military: 10,  treasury: 15  },
  180: { name: 'DR Congo',          gdp: 55,    population: 100,  military: 134, treasury: 40  },
  214: { name: 'Dominican Rep.',    gdp: 94,    population: 11,   military: 53,  treasury: 80  },
  218: { name: 'Ecuador',           gdp: 107,   population: 18,   military: 41,  treasury: 90  },
  818: { name: 'Egypt',             gdp: 476,   population: 102,  military: 440, treasury: 400 },
  231: { name: 'Ethiopia',          gdp: 126,   population: 123,  military: 138, treasury: 80  },
  246: { name: 'Finland',           gdp: 281,   population: 6,    military: 21,  treasury: 300 },
  250: { name: 'France',            gdp: 2778,  population: 68,   military: 270, treasury: 1600},
  266: { name: 'Gabon',             gdp: 19,    population: 2,    military: 6,   treasury: 20  },
  276: { name: 'Germany',           gdp: 4072,  population: 84,   military: 183, treasury: 2000},
  288: { name: 'Ghana',             gdp: 77,    population: 33,   military: 16,  treasury: 60  },
  300: { name: 'Greece',            gdp: 220,   population: 11,   military: 140, treasury: 180 },
  320: { name: 'Guatemala',         gdp: 82,    population: 17,   military: 21,  treasury: 60  },
  324: { name: 'Guinea',            gdp: 15,    population: 13,   military: 45,  treasury: 10  },
  340: { name: 'Honduras',          gdp: 28,    population: 10,   military: 16,  treasury: 25  },
  348: { name: 'Hungary',           gdp: 185,   population: 10,   military: 31,  treasury: 160 },
  356: { name: 'India',             gdp: 3385,  population: 1380, military: 1455,treasury: 1500},
  360: { name: 'Indonesia',         gdp: 1319,  population: 273,  military: 395, treasury: 700 },
  364: { name: 'Iran',              gdp: 702,   population: 85,   military: 610, treasury: 500 },
  368: { name: 'Iraq',              gdp: 264,   population: 41,   military: 194, treasury: 200 },
  372: { name: 'Ireland',           gdp: 504,   population: 5,    military: 10,  treasury: 400 },
  376: { name: 'Israel',            gdp: 522,   population: 9,    military: 170, treasury: 500 },
  380: { name: 'Italy',             gdp: 2058,  population: 60,   military: 165, treasury: 1100},
  384: { name: 'Ivory Coast',       gdp: 71,    population: 27,   military: 25,  treasury: 60  },
  392: { name: 'Japan',             gdp: 4231,  population: 125,  military: 247, treasury: 2200},
  400: { name: 'Jordan',            gdp: 44,    population: 10,   military: 101, treasury: 40  },
  398: { name: 'Kazakhstan',        gdp: 225,   population: 19,   military: 74,  treasury: 200 },
  404: { name: 'Kenya',             gdp: 110,   population: 54,   military: 24,  treasury: 80  },
  408: { name: 'North Korea',       gdp: 30,    population: 26,   military: 1280,treasury: 20  },
  410: { name: 'South Korea',       gdp: 1665,  population: 52,   military: 599, treasury: 1300},
  414: { name: 'Kuwait',            gdp: 134,   population: 4,    military: 17,  treasury: 400 },
  418: { name: 'Laos',              gdp: 19,    population: 7,    military: 29,  treasury: 15  },
  422: { name: 'Lebanon',           gdp: 23,    population: 7,    military: 72,  treasury: 20  },
  430: { name: 'Liberia',           gdp: 4,     population: 5,    military: 2,   treasury: 5   },
  434: { name: 'Libya',             gdp: 45,    population: 7,    military: 76,  treasury: 60  },
  458: { name: 'Malaysia',          gdp: 407,   population: 33,   military: 109, treasury: 350 },
  484: { name: 'Mexico',            gdp: 1293,  population: 130,  military: 277, treasury: 600 },
  504: { name: 'Morocco',           gdp: 134,   population: 37,   military: 196, treasury: 150 },
  508: { name: 'Mozambique',        gdp: 15,    population: 33,   military: 11,  treasury: 10  },
  516: { name: 'Namibia',           gdp: 13,    population: 3,    military: 9,   treasury: 15  },
  524: { name: 'Nepal',             gdp: 36,    population: 30,   military: 96,  treasury: 25  },
  528: { name: 'Netherlands',       gdp: 1012,  population: 17,   military: 47,  treasury: 800 },
  566: { name: 'Nigeria',           gdp: 477,   population: 218,  military: 223, treasury: 300 },
  578: { name: 'Norway',            gdp: 579,   population: 5,    military: 28,  treasury: 800 },
  586: { name: 'Pakistan',          gdp: 376,   population: 231,  military: 651, treasury: 200 },
  591: { name: 'Panama',            gdp: 63,    population: 4,    military: 12,  treasury: 60  },
  598: { name: 'Papua New Guinea',  gdp: 27,    population: 10,   military: 3,   treasury: 20  },
  604: { name: 'Peru',              gdp: 242,   population: 33,   military: 90,  treasury: 180 },
  608: { name: 'Philippines',       gdp: 404,   population: 113,  military: 137, treasury: 300 },
  616: { name: 'Poland',            gdp: 688,   population: 38,   military: 185, treasury: 600 },
  620: { name: 'Portugal',          gdp: 250,   population: 10,   military: 27,  treasury: 200 },
  634: { name: 'Qatar',             gdp: 237,   population: 3,    military: 12,  treasury: 500 },
  642: { name: 'Romania',           gdp: 301,   population: 19,   military: 70,  treasury: 250 },
  643: { name: 'Russia',            gdp: 2062,  population: 144,  military: 1330,treasury: 2500},
  682: { name: 'Saudi Arabia',      gdp: 1108,  population: 35,   military: 227, treasury: 2000},
  686: { name: 'Senegal',           gdp: 28,    population: 17,   military: 19,  treasury: 20  },
  706: { name: 'Somalia',           gdp: 8,     population: 17,   military: 20,  treasury: 5   },
  710: { name: 'South Africa',      gdp: 419,   population: 60,   military: 79,  treasury: 250 },
  724: { name: 'Spain',             gdp: 1418,  population: 47,   military: 120, treasury: 900 },
  736: { name: 'Sudan',             gdp: 34,    population: 44,   military: 109, treasury: 20  },
  752: { name: 'Sweden',            gdp: 585,   population: 10,   military: 67,  treasury: 500 },
  756: { name: 'Switzerland',       gdp: 807,   population: 9,    military: 21,  treasury: 800 },
  760: { name: 'Syria',             gdp: 10,    population: 22,   military: 142, treasury: 10  },
  764: { name: 'Thailand',          gdp: 502,   population: 71,   military: 361, treasury: 400 },
  792: { name: 'Turkey',            gdp: 906,   population: 84,   military: 355, treasury: 700 },
  800: { name: 'Uganda',            gdp: 45,    population: 48,   military: 46,  treasury: 30  },
  804: { name: 'Ukraine',           gdp: 200,   population: 44,   military: 900, treasury: 200 },
  784: { name: 'UAE',               gdp: 507,   population: 10,   military: 63,  treasury: 700 },
  826: { name: 'United Kingdom',    gdp: 3070,  population: 67,   military: 148, treasury: 1800},
  840: { name: 'United States',     gdp: 25462, population: 331,  military: 1395,treasury: 8000},
  858: { name: 'Uruguay',           gdp: 77,    population: 4,    military: 24,  treasury: 70  },
  860: { name: 'Uzbekistan',        gdp: 80,    population: 36,   military: 65,  treasury: 60  },
  862: { name: 'Venezuela',         gdp: 106,   population: 29,   military: 235, treasury: 80  },
  704: { name: 'Vietnam',           gdp: 366,   population: 98,   military: 482, treasury: 300 },
  887: { name: 'Yemen',             gdp: 21,    population: 34,   military: 79,  treasury: 15  },
  894: { name: 'Zambia',            gdp: 22,    population: 19,   military: 16,  treasury: 20  },
  716: { name: 'Zimbabwe',          gdp: 28,    population: 16,   military: 29,  treasury: 15  },
};

const RESOURCE_DATA = {
  12:  { oil: 55, food: 35, industry: 30 }, 32:  { oil: 25, food: 78, industry: 42 },
  36:  { oil: 48, food: 72, industry: 58 }, 76:  { oil: 32, food: 82, industry: 52 },
  124: { oil: 62, food: 76, industry: 68 }, 152: { oil: 20, food: 56, industry: 44 },
  156: { oil: 42, food: 72, industry: 96 }, 170: { oil: 32, food: 56, industry: 36 },
  276: { oil: 8,  food: 62, industry: 92 }, 356: { oil: 22, food: 68, industry: 72 },
  360: { oil: 52, food: 68, industry: 62 }, 364: { oil: 82, food: 32, industry: 36 },
  368: { oil: 88, food: 28, industry: 28 }, 392: { oil: 4,  food: 52, industry: 92 },
  410: { oil: 4,  food: 58, industry: 82 }, 414: { oil: 96, food: 8,  industry: 32 },
  484: { oil: 58, food: 52, industry: 58 }, 528: { oil: 18, food: 58, industry: 78 },
  566: { oil: 68, food: 52, industry: 28 }, 578: { oil: 72, food: 46, industry: 58 },
  586: { oil: 14, food: 52, industry: 36 }, 616: { oil: 12, food: 72, industry: 68 },
  634: { oil: 92, food: 8,  industry: 32 }, 643: { oil: 92, food: 58, industry: 72 },
  682: { oil: 96, food: 10, industry: 42 }, 710: { oil: 18, food: 58, industry: 48 },
  724: { oil: 8,  food: 56, industry: 72 }, 752: { oil: 10, food: 52, industry: 78 },
  764: { oil: 26, food: 72, industry: 58 }, 792: { oil: 22, food: 62, industry: 62 },
  804: { oil: 16, food: 68, industry: 48 }, 784: { oil: 88, food: 8,  industry: 48 },
  826: { oil: 32, food: 58, industry: 78 }, 840: { oil: 78, food: 92, industry: 96 },
  862: { oil: 78, food: 52, industry: 28 }, 704: { oil: 16, food: 72, industry: 52 },
};

const DEFAULT_RESOURCES = { oil: 18, food: 42, industry: 28 };
const DEFAULT_BUDGET    = { taxRate: 0.20, militaryAlloc: 0.30, devAlloc: 0.30 };

// Recruit packs: each costs $50B
const RECRUIT_PACKS = {
  infantry:  { amount: 100, cost: 50, label: 'Infantry  +100K — $50B' },
  tanks:     { amount: 10,  cost: 50, label: 'Armor     +10K  — $50B' },
  artillery: { amount: 5,   cost: 50, label: 'Artillery +5K   — $50B' },
  fighters:  { amount: 5,   cost: 50, label: 'Air Force +5K   — $50B' },
};

const GameState = {
  playerCountryId: null,
  selectedCountryId: null,
  countries: {},
  year: 2026,
  quarter: 1,
  paused: true,
  attackReady: true, // cooldown: one attack per quarter

  init() {
    for (const [id, data] of Object.entries(COUNTRY_DATA)) {
      const m = data.military;
      this.countries[id] = {
        ...data,
        allies:        [],
        enemies:       [],
        tradePartners: [],
        sanctionedBy:  [],
        relation:      'neutral',
        resources:  { ...(RESOURCE_DATA[id] || DEFAULT_RESOURCES) },
        budget:     { ...DEFAULT_BUDGET },
        units: {
          infantry:  Math.round(m * 0.70),
          tanks:     Math.round(m * 0.15),
          artillery: Math.round(m * 0.08),
          fighters:  Math.round(m * 0.07),
        },
        occupiedBy: null,
      };
    }
  },

  getCountry(id) { return this.countries[String(id)] || null; },

  calcStrength(id) {
    const c = this.countries[String(id)];
    if (!c) return 0;
    const u = c.units;
    return u.infantry + u.tanks * 5 + u.artillery * 8 + u.fighters * 6;
  },

  setPlayer(countryId) {
    this.playerCountryId = String(countryId);
    this.paused = false;
    this.updateRelations();
    const c = this.countries[this.playerCountryId];
    if (c) Notifications.show(`You are now leading <b>${c.name}</b>. Good luck!`, 'info', 6000);
  },

  updateRelations() {
    if (!this.playerCountryId) return;
    const player = this.countries[this.playerCountryId];
    for (const [id, country] of Object.entries(this.countries)) {
      if (id === this.playerCountryId)      country.relation = 'player';
      else if (player.allies.includes(id))  country.relation = 'ally';
      else if (player.enemies.includes(id)) country.relation = 'enemy';
      else                                   country.relation = 'neutral';
    }
  },

  declareWar(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.allies  = player.allies.filter(id => id !== tid);
    player.enemies = [...new Set([...player.enemies, tid])];
    const target = this.countries[tid];
    if (target) {
      target.allies  = target.allies.filter(id => id !== this.playerCountryId);
      target.enemies = [...new Set([...target.enemies, this.playerCountryId])];
    }
    // Cancel trade on war declaration
    player.tradePartners = player.tradePartners.filter(id => id !== tid);
    if (target) target.tradePartners = target.tradePartners.filter(id => id !== this.playerCountryId);
    this.updateRelations();
  },

  proposeAlliance(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.enemies = player.enemies.filter(id => id !== tid);
    player.allies  = [...new Set([...player.allies, tid])];
    const target = this.countries[tid];
    if (target) {
      target.enemies = target.enemies.filter(id => id !== this.playerCountryId);
      target.allies  = [...new Set([...target.allies, this.playerCountryId])];
      Notifications.show(`Alliance formed with <b>${target.name}</b>.`, 'alliance', 6000);
    }
    this.updateRelations();
  },

  makePeace(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.enemies = player.enemies.filter(id => id !== tid);
    const target = this.countries[tid];
    if (target) {
      target.enemies = target.enemies.filter(id => id !== this.playerCountryId);
      Notifications.show(`Peace established with <b>${target.name}</b>.`, 'peace', 6000);
    }
    this.updateRelations();
  },

  proposeTrade(targetId) {
    if (!this.playerCountryId) return false;
    const tid    = String(targetId);
    const player = this.countries[this.playerCountryId];
    const target = this.countries[tid];
    if (!target || player.enemies.includes(tid)) return false;
    if (player.tradePartners.includes(tid)) return false;
    player.tradePartners.push(tid);
    target.tradePartners.push(this.playerCountryId);
    Notifications.show(`Trade agreement with <b>${target.name}</b> — quarterly GDP bonus active.`, 'alliance', 5000);
    return true;
  },

  cancelTrade(targetId) {
    if (!this.playerCountryId) return;
    const tid    = String(targetId);
    const player = this.countries[this.playerCountryId];
    const target = this.countries[tid];
    player.tradePartners = player.tradePartners.filter(x => x !== tid);
    if (target) target.tradePartners = target.tradePartners.filter(x => x !== this.playerCountryId);
  },

  imposeSanctions(targetId) {
    if (!this.playerCountryId) return false;
    const tid    = String(targetId);
    const target = this.countries[tid];
    if (!target) return false;
    target.sanctionedBy = [...new Set([...target.sanctionedBy, this.playerCountryId])];
    this.cancelTrade(tid);
    Notifications.show(`Sanctions imposed on <b>${target.name}</b> — their GDP growth penalised.`, 'warning', 5000);
    return true;
  },

  liftSanctions(targetId) {
    if (!this.playerCountryId) return false;
    const tid    = String(targetId);
    const target = this.countries[tid];
    if (!target) return false;
    target.sanctionedBy = target.sanctionedBy.filter(x => x !== this.playerCountryId);
    Notifications.show(`Sanctions on <b>${target.name}</b> lifted.`, 'peace', 4000);
    return true;
  },

  demandTribute(targetId) {
    if (!this.playerCountryId) return false;
    const tid    = String(targetId);
    const player = this.countries[this.playerCountryId];
    const target = this.countries[tid];
    if (!player || !target) return false;
    if (!player.enemies.includes(tid)) return false;
    if (this.calcStrength(this.playerCountryId) < this.calcStrength(tid) * 2) return false;
    if (target.treasury < 10) return false;
    const amount = Math.max(10, Math.min(target.treasury * 0.25, 500));
    target.treasury -= amount;
    player.treasury += amount;
    Notifications.show(`Tribute from <b>${target.name}</b>: +$${amount.toFixed(0)}B seized.`, 'milestone', 6000);
    return true;
  },

  // Attack: auto-declares war, resolves combat, returns result
  attack(targetId) {
    if (!this.playerCountryId || !this.attackReady) return null;
    const tid = String(targetId);
    const target = this.countries[tid];
    if (!target) return null;

    // Auto-declare war
    const player = this.countries[this.playerCountryId];
    if (!player.enemies.includes(tid)) {
      this.declareWar(tid);
      Notifications.show(`War declared on <b>${target.name}</b>!`, 'war', 5000);
    }

    const atkStr = this.calcStrength(this.playerCountryId);
    const defStr = this.calcStrength(tid);
    const ratio  = atkStr / (defStr * 1.25 + 1);

    let outcome, atkLoss, defLoss;
    if      (ratio >= 2.0) { outcome = 'decisive'; atkLoss = 0.05; defLoss = 0.65; }
    else if (ratio >= 1.0) { outcome = 'victory';  atkLoss = 0.15; defLoss = 0.40; }
    else if (ratio >= 0.6) { outcome = 'stalemate';atkLoss = 0.20; defLoss = 0.20; }
    else                   { outcome = 'defeat';   atkLoss = 0.30; defLoss = 0.08; }

    this._applyLosses(this.playerCountryId, atkLoss);
    this._applyLosses(tid, defLoss);
    this.attackReady = false; // cooldown until next tick

    return { outcome, atkStr, defStr, targetName: target.name };
  },

  _applyLosses(id, ratio) {
    const c = this.countries[String(id)];
    if (!c) return;
    for (const key of Object.keys(c.units)) {
      c.units[key] = Math.max(0, Math.round(c.units[key] * (1 - ratio)));
    }
    c.military = Math.max(1, c.units.infantry + c.units.tanks + c.units.artillery + c.units.fighters);
  },

  recruitUnits(type) {
    if (!this.playerCountryId) return false;
    const pack = RECRUIT_PACKS[type];
    if (!pack) return false;
    const p = this.countries[this.playerCountryId];
    if (p.treasury < pack.cost) return false;
    p.treasury    -= pack.cost;
    p.units[type]  = (p.units[type] || 0) + pack.amount;
    p.military     = p.units.infantry + p.units.tanks + p.units.artillery + p.units.fighters;
    return true;
  },

  setPlayerBudget(field, value) {
    if (!this.playerCountryId) return;
    this.countries[this.playerCountryId].budget[field] = value;
  },

  calcBudget(id) {
    const c = this.countries[String(id)];
    if (!c) return null;
    const b          = c.budget;
    const revenue    = c.gdp * b.taxRate / 4;
    const milSpend   = revenue * b.militaryAlloc;
    const devSpend   = revenue * b.devAlloc;
    const toTreasury = revenue - milSpend - devSpend;
    return { revenue, milSpend, devSpend, toTreasury };
  },

  tickUpdate() {
    this.quarter++;
    if (this.quarter > 4) { this.quarter = 1; this.year++; }
    this.attackReady = true; // reset attack cooldown each quarter

    for (const [id, country] of Object.entries(this.countries)) {
      const b       = country.budget;
      const revenue = country.gdp * b.taxRate / 4;
      const milSpend= revenue * b.militaryAlloc;
      const devSpend= revenue * b.devAlloc;
      country.treasury += revenue - milSpend - devSpend;

      // Military maintenance & recruitment
      const maintenance = country.military * 0.0012;
      const milSurplus  = milSpend - maintenance;
      if (milSurplus > 0) {
        const newTroops = milSurplus / 12;
        // Distribute new troops proportionally to existing unit types
        const total = Math.max(1, country.military);
        for (const key of Object.keys(country.units)) {
          country.units[key] += Math.round(newTroops * (country.units[key] / total));
        }
      } else {
        this._applyLosses(id, Math.min(0.05, -milSurplus / (country.military + 1)));
      }
      country.military = Math.max(1,
        country.units.infantry + country.units.tanks + country.units.artillery + country.units.fighters
      );

      // GDP growth
      const res      = country.resources;
      const resBonus = (res.oil + res.food + res.industry) / 250000;
      const devBoost = b.devAlloc * b.taxRate * 0.04;
      const warPenalty = id === this.playerCountryId ? country.enemies.length * 0.0025 : 0;
      const tradeBonus  = country.tradePartners.length * 0.003;
      const sanctionHit = country.sanctionedBy.length  * 0.005;
      country.gdp *= 1 + Math.max(0.0005, 0.0015 + devBoost + resBonus - warPenalty + tradeBonus - sanctionHit);
    }
  },
};
