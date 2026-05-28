'use strict';

// ISO 3166-1 numeric codes as keys
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

// Natural resource index (0–100) for major countries; others use defaults
const RESOURCE_DATA = {
  12:  { oil: 55, food: 35, industry: 30 }, // Algeria
  32:  { oil: 25, food: 78, industry: 42 }, // Argentina
  36:  { oil: 48, food: 72, industry: 58 }, // Australia
  76:  { oil: 32, food: 82, industry: 52 }, // Brazil
  124: { oil: 62, food: 76, industry: 68 }, // Canada
  152: { oil: 20, food: 56, industry: 44 }, // Chile
  156: { oil: 42, food: 72, industry: 96 }, // China
  170: { oil: 32, food: 56, industry: 36 }, // Colombia
  276: { oil: 8,  food: 62, industry: 92 }, // Germany
  356: { oil: 22, food: 68, industry: 72 }, // India
  360: { oil: 52, food: 68, industry: 62 }, // Indonesia
  364: { oil: 82, food: 32, industry: 36 }, // Iran
  368: { oil: 88, food: 28, industry: 28 }, // Iraq
  392: { oil: 4,  food: 52, industry: 92 }, // Japan
  410: { oil: 4,  food: 58, industry: 82 }, // South Korea
  414: { oil: 96, food: 8,  industry: 32 }, // Kuwait
  484: { oil: 58, food: 52, industry: 58 }, // Mexico
  528: { oil: 18, food: 58, industry: 78 }, // Netherlands
  566: { oil: 68, food: 52, industry: 28 }, // Nigeria
  578: { oil: 72, food: 46, industry: 58 }, // Norway
  586: { oil: 14, food: 52, industry: 36 }, // Pakistan
  616: { oil: 12, food: 72, industry: 68 }, // Poland
  634: { oil: 92, food: 8,  industry: 32 }, // Qatar
  643: { oil: 92, food: 58, industry: 72 }, // Russia
  682: { oil: 96, food: 10, industry: 42 }, // Saudi Arabia
  710: { oil: 18, food: 58, industry: 48 }, // South Africa
  724: { oil: 8,  food: 56, industry: 72 }, // Spain
  752: { oil: 10, food: 52, industry: 78 }, // Sweden
  764: { oil: 26, food: 72, industry: 58 }, // Thailand
  792: { oil: 22, food: 62, industry: 62 }, // Turkey
  804: { oil: 16, food: 68, industry: 48 }, // Ukraine
  784: { oil: 88, food: 8,  industry: 48 }, // UAE
  826: { oil: 32, food: 58, industry: 78 }, // UK
  840: { oil: 78, food: 92, industry: 96 }, // USA
  862: { oil: 78, food: 52, industry: 28 }, // Venezuela
  704: { oil: 16, food: 72, industry: 52 }, // Vietnam
};

const DEFAULT_RESOURCES = { oil: 18, food: 42, industry: 28 };

const DEFAULT_BUDGET = { taxRate: 0.20, militaryAlloc: 0.30, devAlloc: 0.30 };

const GameState = {
  playerCountryId: null,
  selectedCountryId: null,
  countries: {},
  year: 2026,
  quarter: 1,
  paused: true,

  init() {
    for (const [id, data] of Object.entries(COUNTRY_DATA)) {
      this.countries[id] = {
        ...data,
        allies: [],
        enemies: [],
        relation: 'neutral',
        resources: { ...(RESOURCE_DATA[id] || DEFAULT_RESOURCES) },
        budget: { ...DEFAULT_BUDGET },
      };
    }
  },

  getCountry(id) {
    return this.countries[String(id)] || null;
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
      if (id === this.playerCountryId)          country.relation = 'player';
      else if (player.allies.includes(id))      country.relation = 'ally';
      else if (player.enemies.includes(id))     country.relation = 'enemy';
      else                                       country.relation = 'neutral';
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
      Notifications.show(`War declared on <b>${target.name}</b>! Mobilize your forces.`, 'war', 7000);
    }
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

  setPlayerBudget(field, value) {
    if (!this.playerCountryId) return;
    this.countries[this.playerCountryId].budget[field] = value;
  },

  // Returns quarterly income breakdown for a country
  calcBudget(id) {
    const c = this.countries[String(id)];
    if (!c) return null;
    const b           = c.budget;
    const revenue     = c.gdp * b.taxRate / 4;
    const milSpend    = revenue * b.militaryAlloc;
    const devSpend    = revenue * b.devAlloc;
    const toTreasury  = revenue - milSpend - devSpend;
    return { revenue, milSpend, devSpend, toTreasury };
  },

  tickUpdate() {
    this.quarter++;
    if (this.quarter > 4) { this.quarter = 1; this.year++; }

    for (const [id, country] of Object.entries(this.countries)) {
      const b          = country.budget;
      const revenue    = country.gdp * b.taxRate / 4;
      const milSpend   = revenue * b.militaryAlloc;
      const devSpend   = revenue * b.devAlloc;
      country.treasury += revenue - milSpend - devSpend;

      // Military: maintenance vs. spending
      const maintenance = country.military * 0.0012; // quarterly upkeep in $B
      const milSurplus  = milSpend - maintenance;
      if (milSurplus > 0) {
        country.military += milSurplus / 12; // $12B per 1K new troops
      } else {
        country.military = Math.max(1, country.military + milSurplus * 2);
      }

      // GDP growth: base + dev boost + resource bonus - war penalty
      const res         = country.resources;
      const resBonus    = (res.oil + res.food + res.industry) / 250000;
      const devBoost    = b.devAlloc * b.taxRate * 0.04;
      const warPenalty  = id === this.playerCountryId
        ? country.enemies.length * 0.0025
        : 0;
      const growth      = Math.max(0.0005, 0.0015 + devBoost + resBonus - warPenalty);
      country.gdp      *= 1 + growth;
    }
  },
};
