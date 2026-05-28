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
  204: { name: 'Benin',             gdp: 17,    population: 13,   military: 7,   treasury: 15  },
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
  540: { name: 'New Caledonia',     gdp: 9,     population: 0.3,  military: 1,   treasury: 10  },
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
        gdp: data.gdp,
        treasury: data.treasury,
        allies: [],
        enemies: [],
        relation: 'neutral',
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
  },

  updateRelations() {
    if (!this.playerCountryId) return;
    const player = this.countries[this.playerCountryId];
    for (const [id, country] of Object.entries(this.countries)) {
      if (id === this.playerCountryId) {
        country.relation = 'player';
      } else if (player.allies.includes(id)) {
        country.relation = 'ally';
      } else if (player.enemies.includes(id)) {
        country.relation = 'enemy';
      } else {
        country.relation = 'neutral';
      }
    }
  },

  declareWar(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.allies = player.allies.filter(id => id !== tid);
    player.enemies = [...new Set([...player.enemies, tid])];
    const target = this.countries[tid];
    if (target) {
      target.allies = target.allies.filter(id => id !== this.playerCountryId);
      target.enemies = [...new Set([...target.enemies, this.playerCountryId])];
    }
    this.updateRelations();
  },

  proposeAlliance(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.enemies = player.enemies.filter(id => id !== tid);
    player.allies = [...new Set([...player.allies, tid])];
    const target = this.countries[tid];
    if (target) {
      target.enemies = target.enemies.filter(id => id !== this.playerCountryId);
      target.allies = [...new Set([...target.allies, this.playerCountryId])];
    }
    this.updateRelations();
  },

  makePeace(targetId) {
    const tid = String(targetId);
    const player = this.countries[this.playerCountryId];
    player.enemies = player.enemies.filter(id => id !== tid);
    const target = this.countries[tid];
    if (target) target.enemies = target.enemies.filter(id => id !== this.playerCountryId);
    this.updateRelations();
  },

  tickUpdate() {
    this.quarter++;
    if (this.quarter > 4) { this.quarter = 1; this.year++; }

    for (const country of Object.values(this.countries)) {
      const revenue = country.gdp * 0.20 / 4;
      const expense = country.military * 0.008 / 4;
      country.treasury += revenue - expense;
      country.gdp *= 1.0008;
    }
  },
};
