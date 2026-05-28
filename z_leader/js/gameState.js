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
  // oil exporters
  364: { oil: 82, food: 32, industry: 36, minerals: 46, tech: 24 },  // Iran
  368: { oil: 88, food: 28, industry: 28, minerals: 38, tech: 16 },  // Iraq
  414: { oil: 96, food:  8, industry: 32, minerals: 36, tech: 28 },  // Kuwait
  634: { oil: 92, food:  8, industry: 32, minerals: 30, tech: 32 },  // Qatar
  682: { oil: 96, food: 10, industry: 42, minerals: 42, tech: 34 },  // Saudi Arabia
  784: { oil: 88, food:  8, industry: 48, minerals: 34, tech: 54 },  // UAE
  566: { oil: 68, food: 52, industry: 28, minerals: 42, tech: 16 },  // Nigeria
  578: { oil: 72, food: 46, industry: 58, minerals: 48, tech: 58 },  // Norway
  862: { oil: 78, food: 52, industry: 28, minerals: 58, tech: 16 },  // Venezuela
  643: { oil: 92, food: 58, industry: 72, minerals: 70, tech: 52 },  // Russia
  840: { oil: 78, food: 92, industry: 96, minerals: 56, tech: 96 },  // USA
  124: { oil: 62, food: 76, industry: 68, minerals: 66, tech: 64 },  // Canada
  // food powerhouses
  76:  { oil: 32, food: 82, industry: 52, minerals: 66, tech: 32 },  // Brazil
  32:  { oil: 25, food: 78, industry: 42, minerals: 62, tech: 28 },  // Argentina
  // industrial / tech powers
  156: { oil: 42, food: 72, industry: 96, minerals: 74, tech: 68 },  // China
  276: { oil:  8, food: 62, industry: 92, minerals: 44, tech: 84 },  // Germany
  392: { oil:  4, food: 52, industry: 92, minerals: 28, tech: 90 },  // Japan
  410: { oil:  4, food: 58, industry: 82, minerals: 24, tech: 88 },  // South Korea
  826: { oil: 32, food: 58, industry: 78, minerals: 38, tech: 76 },  // UK
  528: { oil: 18, food: 58, industry: 78, minerals: 30, tech: 72 },  // Netherlands
  752: { oil: 10, food: 52, industry: 78, minerals: 50, tech: 74 },  // Sweden
  724: { oil:  8, food: 56, industry: 72, minerals: 38, tech: 54 },  // Spain
  616: { oil: 12, food: 72, industry: 68, minerals: 52, tech: 56 },  // Poland
  // minerals exporters (not previously in data)
  152: { oil: 20, food: 56, industry: 44, minerals: 88, tech: 30 },  // Chile (copper/lithium)
  36:  { oil: 48, food: 72, industry: 58, minerals: 80, tech: 60 },  // Australia (iron/coal)
  710: { oil: 18, food: 58, industry: 48, minerals: 76, tech: 38 },  // South Africa (gold)
  180: { oil: 18, food: 34, industry: 18, minerals: 82, tech: 10 },  // DRC (cobalt)
  894: { oil:  8, food: 48, industry: 18, minerals: 80, tech: 12 },  // Zambia (copper)
  604: { oil: 14, food: 52, industry: 32, minerals: 78, tech: 22 },  // Peru (copper/silver)
  324: { oil: 14, food: 46, industry: 16, minerals: 76, tech: 10 },  // Guinea (bauxite)
  68:  { oil: 14, food: 52, industry: 22, minerals: 72, tech: 14 },  // Bolivia (lithium)
  398: { oil: 44, food: 46, industry: 38, minerals: 70, tech: 24 },  // Kazakhstan
  516: { oil: 12, food: 36, industry: 22, minerals: 66, tech: 16 },  // Namibia (uranium)
  // mixed
  12:  { oil: 55, food: 35, industry: 30, minerals: 38, tech: 18 },  // Algeria
  170: { oil: 32, food: 56, industry: 36, minerals: 48, tech: 22 },  // Colombia
  356: { oil: 22, food: 68, industry: 72, minerals: 54, tech: 58 },  // India
  360: { oil: 52, food: 68, industry: 62, minerals: 64, tech: 26 },  // Indonesia
  484: { oil: 58, food: 52, industry: 58, minerals: 60, tech: 32 },  // Mexico
  586: { oil: 14, food: 52, industry: 36, minerals: 46, tech: 22 },  // Pakistan
  764: { oil: 26, food: 72, industry: 58, minerals: 42, tech: 36 },  // Thailand
  792: { oil: 22, food: 62, industry: 62, minerals: 48, tech: 38 },  // Turkey
  804: { oil: 16, food: 68, industry: 48, minerals: 60, tech: 36 },  // Ukraine
  704: { oil: 16, food: 72, industry: 52, minerals: 46, tech: 30 },  // Vietnam
  // tech hubs
  376: { oil:  4, food: 28, industry: 52, minerals: 18, tech: 80 },  // Israel
  246: { oil:  6, food: 56, industry: 52, minerals: 30, tech: 76 },  // Finland
  756: { oil:  2, food: 52, industry: 68, minerals: 28, tech: 74 },  // Switzerland
  372: { oil:  4, food: 52, industry: 48, minerals: 18, tech: 66 },  // Ireland
  56:  { oil: 14, food: 52, industry: 68, minerals: 30, tech: 60 },  // Belgium
};

const DEFAULT_RESOURCES = { oil: 18, food: 42, industry: 28, minerals: 22, tech: 15 };
const DEFAULT_BUDGET = { taxRate: 0.20, militaryAlloc: 0.30, devAlloc: 0.30 };

const TECH_TREE = {
  // Military branch
  tactics:        { name: 'Tactics',            branch: 'military', tier: 1, cost: 100, quarters: 2, prereq: null,
                    desc: '+15% combat strength' },
  armor_doctrine: { name: 'Armor Doctrine',     branch: 'military', tier: 2, cost: 220, quarters: 3, prereq: 'tactics',
                    desc: 'Tanks/artillery ×1.5 in strength' },
  nuclear:        { name: 'Nuclear Arsenal',    branch: 'military', tier: 3, cost: 500, quarters: 5, prereq: 'armor_doctrine',
                    desc: 'AI reluctant to declare war on you' },
  // Economy branch
  trade_networks: { name: 'Trade Networks',     branch: 'economy',  tier: 1, cost: 80,  quarters: 2, prereq: null,
                    desc: 'Trade GDP bonus ×2 per partner' },
  banking:        { name: 'Banking System',     branch: 'economy',  tier: 2, cost: 180, quarters: 3, prereq: 'trade_networks',
                    desc: '+0.5% treasury interest per quarter' },
  econ_hegemony:  { name: 'Econ. Hegemony',    branch: 'economy',  tier: 3, cost: 400, quarters: 4, prereq: 'banking',
                    desc: 'Sanctions damage −80%' },
  // Industry branch
  resource_ext:   { name: 'Resource Extraction',branch: 'industry', tier: 1, cost: 100, quarters: 2, prereq: null,
                    desc: '+50% resource GDP bonus' },
  heavy_industry: { name: 'Heavy Industry',     branch: 'industry', tier: 2, cost: 200, quarters: 3, prereq: 'resource_ext',
                    desc: 'Dev alloc GDP boost ×2' },
  adv_mfg:        { name: 'Adv. Manufacturing', branch: 'industry', tier: 3, cost: 400, quarters: 4, prereq: 'heavy_industry',
                    desc: 'Military maintenance cost ×0.5' },
};

// Leader traits and their player bonuses
const TRAIT_BONUS = {
  militarist:    '+10% Combat Strength',
  economist:     '+GDP Growth /quarter',
  industrialist: '+20% Resource GDP',
  diplomat:      '+25% Trade Income',
  nationalist:   '+25% War Income',
  reformer:      '+2% Tax Efficiency',
};

const PRESIDENT_DATA = {
  4:   { title: 'President',        name: 'Abdul Karim Wardak',   trait: 'militarist'    },
  12:  { title: 'President',        name: 'Rachid Benali',        trait: 'nationalist'   },
  24:  { title: 'President',        name: 'João Domingos',        trait: 'economist'     },
  32:  { title: 'President',        name: 'Valentín Herrera',     trait: 'reformer'      },
  36:  { title: 'Prime Minister',   name: 'James Whitfield',      trait: 'diplomat'      },
  50:  { title: 'Prime Minister',   name: 'Fatema Chowdhury',     trait: 'reformer'      },
  56:  { title: 'Prime Minister',   name: 'Marc Dehaene',         trait: 'diplomat'      },
  68:  { title: 'President',        name: 'Luis Mamani',          trait: 'nationalist'   },
  76:  { title: 'President',        name: 'Carlos Andrade',       trait: 'economist'     },
  104: { title: 'General',          name: 'Min Aung Zaw',         trait: 'militarist'    },
  116: { title: 'Prime Minister',   name: 'Hun Visal',            trait: 'nationalist'   },
  120: { title: 'President',        name: 'Paul Ndoumbe',         trait: 'nationalist'   },
  124: { title: 'Prime Minister',   name: 'Catherine Mackay',     trait: 'diplomat'      },
  152: { title: 'President',        name: 'Rodrigo Muñoz',        trait: 'economist'     },
  156: { title: 'Chairman',         name: 'Chen Yongkang',        trait: 'industrialist' },
  170: { title: 'President',        name: 'Alejandro Vargas',     trait: 'reformer'      },
  178: { title: 'President',        name: 'Denis Mbemba',         trait: 'nationalist'   },
  180: { title: 'President',        name: 'Jean-Baptiste Lumumba',trait: 'militarist'    },
  214: { title: 'President',        name: 'Rafael Méndez',        trait: 'economist'     },
  218: { title: 'President',        name: 'Andrés Montoya',       trait: 'reformer'      },
  818: { title: 'President',        name: 'Khalid El-Rashidi',    trait: 'militarist'    },
  231: { title: 'Prime Minister',   name: 'Dawit Bekele',         trait: 'reformer'      },
  246: { title: 'President',        name: 'Matti Virtanen',       trait: 'diplomat'      },
  250: { title: 'President',        name: 'Édouard Fontaine',     trait: 'diplomat'      },
  266: { title: 'President',        name: 'Omar Bongo Jr.',       trait: 'economist'     },
  276: { title: 'Chancellor',       name: 'Lena Hartmann',        trait: 'economist'     },
  288: { title: 'President',        name: 'Kwame Asante',         trait: 'diplomat'      },
  300: { title: 'Prime Minister',   name: 'Nikos Papadopoulos',   trait: 'economist'     },
  320: { title: 'President',        name: 'Miguel Fuentes',       trait: 'nationalist'   },
  324: { title: 'President',        name: 'Alpha Diallo',         trait: 'militarist'    },
  340: { title: 'President',        name: 'Claudia Espinoza',     trait: 'nationalist'   },
  348: { title: 'Prime Minister',   name: 'Zoltán Fekete',        trait: 'nationalist'   },
  356: { title: 'Prime Minister',   name: 'Amit Chandra',         trait: 'nationalist'   },
  360: { title: 'President',        name: 'Agus Purnomo',         trait: 'industrialist' },
  364: { title: 'President',        name: 'Ali Hosseini',         trait: 'militarist'    },
  368: { title: 'Prime Minister',   name: 'Hassan Al-Jabouri',    trait: 'militarist'    },
  372: { title: 'Taoiseach',        name: "Seamus O'Sullivan",    trait: 'diplomat'      },
  376: { title: 'Prime Minister',   name: 'David Ben-Levi',       trait: 'militarist'    },
  380: { title: 'Prime Minister',   name: 'Marco Ferretti',       trait: 'economist'     },
  384: { title: 'President',        name: 'Alassane Kouadio',     trait: 'economist'     },
  392: { title: 'Prime Minister',   name: 'Takeshi Yamamoto',     trait: 'industrialist' },
  400: { title: 'King',             name: 'Abdullah III',         trait: 'diplomat'      },
  398: { title: 'President',        name: 'Aibek Seitkali',       trait: 'industrialist' },
  404: { title: 'President',        name: 'Kamau Njoroge',        trait: 'economist'     },
  408: { title: 'Supreme Leader',   name: 'Kim Jong-nam',         trait: 'militarist'    },
  410: { title: 'President',        name: 'Lee Jae-hyun',         trait: 'industrialist' },
  414: { title: 'Emir',             name: 'Sheikh Sabah IV',      trait: 'economist'     },
  418: { title: 'President',        name: 'Thongsing Phomma',     trait: 'nationalist'   },
  422: { title: 'President',        name: 'Samir Khoury',         trait: 'reformer'      },
  430: { title: 'President',        name: 'Ellen Brewer',         trait: 'reformer'      },
  434: { title: 'Prime Minister',   name: 'Mohamed Dabaiba Jr.',  trait: 'nationalist'   },
  458: { title: 'Prime Minister',   name: 'Ahmad Ismail',         trait: 'economist'     },
  484: { title: 'President',        name: 'Claudia Torres',       trait: 'nationalist'   },
  504: { title: 'King',             name: 'Mohammed VII',         trait: 'diplomat'      },
  508: { title: 'President',        name: 'Felipe Nyusi Jr.',     trait: 'reformer'      },
  516: { title: 'President',        name: 'Netumbo Nandi',        trait: 'reformer'      },
  524: { title: 'President',        name: 'Ram Bahadur',          trait: 'nationalist'   },
  528: { title: 'Prime Minister',   name: 'Ruud van der Berg',    trait: 'diplomat'      },
  566: { title: 'President',        name: 'Emeka Okafor',         trait: 'nationalist'   },
  578: { title: 'Prime Minister',   name: 'Erik Solberg',         trait: 'diplomat'      },
  586: { title: 'Prime Minister',   name: 'Imran Nawaz',          trait: 'militarist'    },
  591: { title: 'President',        name: 'Laurentino Herrera',   trait: 'economist'     },
  598: { title: 'Prime Minister',   name: 'James Marape II',      trait: 'nationalist'   },
  604: { title: 'President',        name: 'Dina Castillo',        trait: 'reformer'      },
  608: { title: 'President',        name: 'Ramon Aquino',         trait: 'nationalist'   },
  616: { title: 'President',        name: 'Andrzej Kowalski',     trait: 'militarist'    },
  620: { title: 'Prime Minister',   name: 'António Melo',         trait: 'economist'     },
  634: { title: 'Emir',             name: 'Sheikh Tamim II',      trait: 'economist'     },
  642: { title: 'President',        name: 'Gheorghe Ionescu',     trait: 'reformer'      },
  643: { title: 'President',        name: 'Vladimir Petrov',      trait: 'militarist'    },
  682: { title: 'King',             name: 'Salman II',            trait: 'industrialist' },
  686: { title: 'President',        name: 'Bassirou Diallo',      trait: 'diplomat'      },
  706: { title: 'President',        name: 'Hassan Sheikh II',     trait: 'militarist'    },
  710: { title: 'President',        name: 'Sipho Dlamini',        trait: 'reformer'      },
  724: { title: 'Prime Minister',   name: 'Pedro Morales',        trait: 'economist'     },
  736: { title: 'Chairman',         name: 'Abdel Fattah Hemeti',  trait: 'militarist'    },
  752: { title: 'Prime Minister',   name: 'Anna Lindqvist',       trait: 'diplomat'      },
  756: { title: 'President',        name: 'Hans Müller',          trait: 'economist'     },
  760: { title: 'President',        name: 'Ahmad Al-Rashi',       trait: 'militarist'    },
  764: { title: 'Prime Minister',   name: 'Somchai Prasong',      trait: 'militarist'    },
  792: { title: 'President',        name: 'Recep Yilmaz',         trait: 'nationalist'   },
  800: { title: 'President',        name: 'Patrick Nkurunziza',   trait: 'nationalist'   },
  804: { title: 'President',        name: 'Volodymyr Kovalenko',  trait: 'militarist'    },
  784: { title: 'President',        name: 'Sultan Al-Mansouri',   trait: 'industrialist' },
  826: { title: 'Prime Minister',   name: 'William Clarke',       trait: 'diplomat'      },
  840: { title: 'President',        name: 'Michael Harrison',     trait: 'economist'     },
  858: { title: 'President',        name: 'Roberto Blanco',       trait: 'reformer'      },
  860: { title: 'President',        name: 'Bakhtiyor Tashkentov', trait: 'nationalist'   },
  862: { title: 'President',        name: 'Hugo Castillo',        trait: 'nationalist'   },
  704: { title: 'General Secretary',name: 'Nguyen Van Duc',       trait: 'nationalist'   },
  887: { title: 'President',        name: 'Rashad Al-Alimi II',   trait: 'militarist'    },
  894: { title: 'President',        name: 'Edgar Mwamba',         trait: 'reformer'      },
  716: { title: 'President',        name: 'Constantino Chiwenga', trait: 'nationalist'   },
};

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
  attackReady: true,
  unlockedTechs:    new Set(),
  currentResearch:  null,
  researchProgress: 0,
  commodityPrices: { oil: 1.0, food: 1.0, industry: 1.0, minerals: 1.0, tech: 1.0 },
  priceHistory:    { oil: [1.0], food: [1.0], industry: [1.0], minerals: [1.0], tech: [1.0] },
  _tradeStats:     {},
  _economicCycle:  { phase: 'normal', quartersLeft: 32 },

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
        leader:     { ...(PRESIDENT_DATA[id] || { title: 'President', name: 'Unknown', trait: 'nationalist' }) },
        factories:  { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0 },
        inflation:  0,
      };
    }
  },

  getCountry(id) { return this.countries[String(id)] || null; },

  calcStrength(id) {
    const c = this.countries[String(id)];
    if (!c) return 0;
    const u = c.units;
    const isPlayer = String(id) === this.playerCountryId;
    let tankMult = 5, artMult = 8;
    if (isPlayer && this.unlockedTechs.has('armor_doctrine')) { tankMult = 7.5; artMult = 12; }
    let str = u.infantry + u.tanks * tankMult + u.artillery * artMult + u.fighters * 6;
    if (isPlayer && this.unlockedTechs.has('tactics')) str = Math.round(str * 1.15);
    if (isPlayer && c.leader?.trait === 'militarist')  str = Math.round(str * 1.10);
    return Math.round(str);
  },

  setPlayer(countryId) {
    this.playerCountryId  = String(countryId);
    this.unlockedTechs    = new Set();
    this.currentResearch  = null;
    this.researchProgress = 0;
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
    Notifications.show(`Trade agreement with <b>${target.name}</b> — export income boosted each quarter.`, 'alliance', 5000);
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
    const natMult = (player.leader?.trait === 'nationalist') ? 1.25 : 1;
    const amount  = Math.max(10, Math.min(target.treasury * 0.25 * natMult, 500));
    target.treasury -= amount;
    player.treasury += amount;
    Notifications.show(`Tribute from <b>${target.name}</b>: +$${amount.toFixed(0)}B seized.`, 'milestone', 6000);
    return true;
  },

  startResearch(techId) {
    if (!this.playerCountryId) return false;
    if (this.currentResearch) return false;
    const tech = TECH_TREE[techId];
    if (!tech) return false;
    if (this.unlockedTechs.has(techId)) return false;
    if (tech.prereq && !this.unlockedTechs.has(tech.prereq)) return false;
    const player = this.countries[this.playerCountryId];
    if (player.treasury < tech.cost) return false;
    player.treasury -= tech.cost;
    this.currentResearch  = techId;
    this.researchProgress = 0;
    Notifications.show(`Research started: <b>${tech.name}</b> — ${tech.quarters} quarters.`, 'info', 5000);
    return true;
  },

  canAnnex(targetId) {
    if (!this.playerCountryId) return false;
    const tid    = String(targetId);
    const player = this.countries[this.playerCountryId];
    const target = this.countries[tid];
    if (!target || target.occupiedBy) return false;
    if (!player.enemies.includes(tid)) return false;
    return target.military < 50; // country must be devastated
  },

  annex(targetId) {
    if (!this.canAnnex(targetId)) return false;
    const tid    = String(targetId);
    const player = this.countries[this.playerCountryId];
    const target = this.countries[tid];

    const natMult = (player.leader?.trait === 'nationalist') ? 1.25 : 1;
    const gdpGain = target.gdp * 0.40 * natMult;
    const trsGain = Math.max(0, target.treasury * 0.25 * natMult);
    const milGain = Math.round(target.military * 0.50);

    player.gdp      += gdpGain;
    player.treasury += trsGain;

    const total = Math.max(1, target.military);
    for (const key of Object.keys(player.units)) {
      player.units[key] += Math.round(milGain * ((target.units[key] || 0) / total));
    }
    player.military = player.units.infantry + player.units.tanks + player.units.artillery + player.units.fighters;

    // Partial resource absorption
    const pRes = player.resources, tRes = target.resources;
    pRes.oil      = Math.min(100, pRes.oil      + Math.round(tRes.oil      * 0.30));
    pRes.food     = Math.min(100, pRes.food     + Math.round(tRes.food     * 0.30));
    pRes.industry = Math.min(100, pRes.industry + Math.round(tRes.industry * 0.30));

    // Mark territory and strip it
    target.occupiedBy    = this.playerCountryId;
    target.gdp           = 0;
    target.military      = 0;
    target.treasury      = 0;
    target.units         = { infantry: 0, tanks: 0, artillery: 0, fighters: 0 };
    target.enemies       = [];
    target.allies        = [];
    target.tradePartners = [];
    target.sanctionedBy  = [];

    // Remove from all other countries' relation lists
    for (const c of Object.values(this.countries)) {
      c.enemies       = c.enemies.filter(x => x !== tid);
      c.allies        = c.allies.filter(x => x !== tid);
      c.tradePartners = c.tradePartners.filter(x => x !== tid);
    }

    this.updateRelations();

    Notifications.show(
      `<b>${target.name}</b> annexed! +$${gdpGain.toFixed(0)}B GDP, +$${trsGain.toFixed(0)}B treasury, +${milGain}K troops.`,
      'milestone', 9000
    );
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
    const sid = String(id);
    const c = this.countries[sid];
    if (!c) return null;
    const b          = c.budget;
    const extra      = (sid === this.playerCountryId && c.leader?.trait === 'reformer') ? c.gdp * 0.02 / 4 : 0;
    const revenue    = c.gdp * b.taxRate / 4 + extra;
    const milSpend   = revenue * b.militaryAlloc;
    const devSpend   = revenue * b.devAlloc;
    const toTreasury = revenue - milSpend - devSpend;
    const tradeBal   = this.calcTradeBalance(id).total;
    const net        = toTreasury + tradeBal;
    return { revenue, milSpend, devSpend, toTreasury, tradeBal, net };
  },

  calcTradeBalance(id) {
    const sid = String(id);
    const c   = this.countries[sid];
    if (!c) return { oil: 0, food: 0, industry: 0, total: 0 };
    const BASE       = 40;
    const isPlayer   = sid === this.playerCountryId;
    const tradeMult  = (isPlayer && this.unlockedTechs.has('trade_networks')) ? 2 : 1;
    const dipMult    = (isPlayer && c.leader?.trait === 'diplomat') ? 1.25 : 1;
    const exportMult = (1 + c.tradePartners.length * 0.15 * tradeMult) * dipMult;
    const rates      = { oil: 0.006, food: 0.004, industry: 0.005, minerals: 0.0055, tech: 0.007 };
    const result     = { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0, total: 0 };
    for (const [key, rate] of Object.entries(rates)) {
      const surplus = ((c.resources[key] || 0) - BASE) / 100;
      const price   = this.commodityPrices[key] || 1;
      let mult;
      if (surplus >= 0) {
        // Exporters: seller's market bonus when supply is scarce
        mult = exportMult * (price > 1.3 ? 1.15 : 1.0);
      } else {
        // Importers: cheaper with a supplier trade partner; scarcity premium without one
        const hasSupplier = c.tradePartners.some(tid => {
          const partner = this.countries[tid];
          return partner && (partner.resources[key] || 0) > BASE + 20;
        });
        mult = hasSupplier ? 0.85 : (price > 1.3 ? 1.6 : 1.2);
      }
      result[key]   = c.gdp * surplus * rate * price * mult;
      result.total += result[key];
    }
    return result;
  },

  _tickCommodityMarket() {
    const BASE = 40;
    for (const com of ['oil', 'food', 'industry', 'minerals', 'tech']) {
      let totalSupply = 0;
      let totalDemand = 0;
      for (const c of Object.values(this.countries)) {
        if (c.occupiedBy) continue;
        const net = (c.resources[com] || 0) - BASE;
        if (net > 0) {
          totalSupply += net;
        } else if (net < 0) {
          // GDP-weighted demand: wealthier nations bid more aggressively on world markets
          totalDemand += Math.abs(net) * Math.sqrt(c.gdp / 500 + 1);
        }
      }

      // Supply/demand ratio drives price via log curve (1.0 = balanced, <1 = shortage, >1 = glut)
      const sdRatio        = totalDemand > 0 ? totalSupply / totalDemand : 1;
      const marketPressure = -Math.log(Math.max(0.1, Math.min(10, sdRatio))) * 0.06;
      const noise          = (Math.random() - 0.5) * 0.025;
      // Weak mean reversion — let market forces dominate
      const meanReversion  = (1.0 - this.commodityPrices[com]) * 0.02;

      this.commodityPrices[com] = Math.max(0.35, Math.min(2.5,
        this.commodityPrices[com] * (1 + marketPressure + noise + meanReversion)
      ));

      const hist = this.priceHistory[com];
      hist.push(+this.commodityPrices[com].toFixed(3));
      if (hist.length > 16) hist.shift();

      this._tradeStats[com] = {
        supply: Math.round(totalSupply),
        demand: Math.round(totalDemand),
        ratio:  +sdRatio.toFixed(2),
        volume: Math.round(Math.min(totalSupply, totalDemand)),
      };
    }
  },

  commodityShock(com, direction) {
    const magnitude = 0.10 + Math.random() * 0.15;
    const p = this.commodityPrices[com];
    this.commodityPrices[com] = Math.max(0.35, Math.min(2.5, p * (1 + direction * magnitude)));
  },

  buildCost(commodity) {
    if (!this.playerCountryId) return Infinity;
    const p = this.countries[this.playerCountryId];
    if (!p) return Infinity;
    const n = (p.factories || {})[commodity] || 0;
    if (n >= 5) return Infinity;
    return 30 * (n + 1);
  },

  buildFactory(commodity) {
    if (!this.playerCountryId) return false;
    const p = this.countries[this.playerCountryId];
    if (!p) return false;
    if (!p.factories) p.factories = { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0 };
    const n = p.factories[commodity] || 0;
    if (n >= 5) return false;
    const cost = 30 * (n + 1);
    if (p.treasury < cost) return false;
    p.treasury -= cost;
    p.factories[commodity]++;
    p.resources[commodity] += 20;
    return true;
  },

  checkVictory() {
    if (!this.playerCountryId) return null;
    const player = this.countries[this.playerCountryId];
    if (!player) return null;

    const annexed = Object.values(this.countries).filter(c => c.occupiedBy === this.playerCountryId).length;
    const controlled = 1 + annexed;

    if (controlled >= 20) {
      return { type: 'domination', title: 'World Domination',
               desc: `You control ${controlled} nations — a true empire spanning the globe.` };
    }
    if (player.gdp >= 30000) {
      return { type: 'economic', title: 'Economic Supremacy',
               desc: `Your GDP reached $${player.gdp.toFixed(0)}B — the world's dominant economic power.` };
    }
    if (player.allies.length >= 8 && player.enemies.length === 0 && this.unlockedTechs.size >= 5) {
      return { type: 'diplomatic', title: 'Diplomatic Victory',
               desc: `${player.allies.length} allied nations, zero enemies, ${this.unlockedTechs.size} technologies mastered.` };
    }
    return null;
  },

  save() {
    try {
      localStorage.setItem('z_leader_v1', JSON.stringify({
        v: 1,
        year:            this.year,
        quarter:         this.quarter,
        playerCountryId: this.playerCountryId,
        unlockedTechs:   [...this.unlockedTechs],
        currentResearch:  this.currentResearch,
        researchProgress: this.researchProgress,
        countries:        JSON.parse(JSON.stringify(this.countries)),
        commodityPrices:  { ...this.commodityPrices },
        priceHistory:     JSON.parse(JSON.stringify(this.priceHistory)),
        economicCycle:    { ...this._economicCycle },
      }));
      return true;
    } catch(e) { return false; }
  },

  load() {
    try {
      const raw = localStorage.getItem('z_leader_v1');
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (s.v !== 1) return false;
      this.countries        = s.countries;
      this.year             = s.year;
      this.quarter          = s.quarter;
      this.playerCountryId  = s.playerCountryId;
      this.unlockedTechs    = new Set(s.unlockedTechs);
      this.currentResearch  = s.currentResearch;
      this.researchProgress = s.researchProgress;
      const defPrices = { oil: 1.0, food: 1.0, industry: 1.0, minerals: 1.0, tech: 1.0 };
      this.commodityPrices  = { ...defPrices, ...(s.commodityPrices || {}) };
      const defHist = { oil: [1.0], food: [1.0], industry: [1.0], minerals: [1.0], tech: [1.0] };
      this.priceHistory     = { ...defHist, ...(s.priceHistory || {}) };
      // Patch old saves
      for (const [id, c] of Object.entries(this.countries)) {
        const rd = RESOURCE_DATA[id] || DEFAULT_RESOURCES;
        if (c.resources.minerals === undefined) c.resources.minerals = rd.minerals || DEFAULT_RESOURCES.minerals;
        if (c.resources.tech     === undefined) c.resources.tech     = rd.tech     || DEFAULT_RESOURCES.tech;
        if (!c.factories)             c.factories  = { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0 };
        if (c.inflation === undefined) c.inflation = 0;
      }
      this._economicCycle = s.economicCycle || { phase: 'normal', quartersLeft: 32 };
      this.paused           = false;
      this.attackReady      = true;
      if (this.playerCountryId) this.updateRelations();
      return true;
    } catch(e) { return false; }
  },

  tickUpdate() {
    this.quarter++;
    if (this.quarter > 4) { this.quarter = 1; this.year++; }
    const newYear = this.quarter === 1;
    this.attackReady = true;

    // Research progress
    if (this.currentResearch) {
      this.researchProgress++;
      const tech = TECH_TREE[this.currentResearch];
      if (this.researchProgress >= tech.quarters) {
        this.unlockedTechs.add(this.currentResearch);
        Notifications.show(`Research complete: <b>${tech.name}</b>! ${tech.desc}`, 'milestone', 7000);
        this.currentResearch  = null;
        this.researchProgress = 0;
      }
    }

    // ── Economic cycle management ────────────────────────────
    if (!this._economicCycle) this._economicCycle = { phase: 'normal', quartersLeft: 32 };
    this._economicCycle.quartersLeft--;
    if (this._economicCycle.quartersLeft <= 0) {
      const prevPhase = this._economicCycle.phase;
      const roll = Math.random();
      if (prevPhase === 'normal') {
        if (roll < 0.25) {
          this._economicCycle = { phase: 'boom', quartersLeft: 12 + Math.floor(Math.random() * 12) };
          Notifications.show('Global economic boom — growth accelerates worldwide.', 'milestone', 8000);
        } else if (roll < 0.50) {
          this._economicCycle = { phase: 'recession', quartersLeft: 8 + Math.floor(Math.random() * 8) };
          Notifications.show('Global recession begins — markets contract worldwide.', 'danger', 8000);
        } else {
          this._economicCycle.quartersLeft = 20 + Math.floor(Math.random() * 12);
        }
      } else {
        const endMsg = prevPhase === 'boom'
          ? 'Economic boom winds down — growth normalises.'
          : 'Recession ends — global recovery underway.';
        this._economicCycle = { phase: 'normal', quartersLeft: 20 + Math.floor(Math.random() * 12) };
        Notifications.show(endMsg, 'info', 6000);
      }
    }
    const cycleBonus = this._economicCycle.phase === 'boom' ? 0.0015
                     : this._economicCycle.phase === 'recession' ? -0.002 : 0;

    for (const [id, country] of Object.entries(this.countries)) {
      const b        = country.budget;
      const isPlayer = id === this.playerCountryId;
      const leader   = isPlayer ? country.leader : null;
      const extra    = (leader?.trait === 'reformer') ? country.gdp * 0.02 / 4 : 0;
      const revenue  = country.gdp * b.taxRate / 4 + extra;
      const milSpend = revenue * b.militaryAlloc;
      const devSpend = revenue * b.devAlloc;
      const tradeBal = this.calcTradeBalance(id);
      const netFlow  = revenue - milSpend - devSpend + tradeBal.total;
      country.treasury += netFlow;

      // Military maintenance & recruitment
      const maintMult   = (isPlayer && this.unlockedTechs.has('adv_mfg')) ? 0.5 : 1;
      const maintenance = country.military * 0.0012 * maintMult;
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

      // GDP growth with tech bonuses
      const res          = country.resources;
      const resMult      = (isPlayer && this.unlockedTechs.has('resource_ext')) ? 1.5 : 1;
      const leaderResMult= (leader?.trait === 'industrialist') ? 1.2 : 1;
      const resBonus     = (res.oil + res.food + res.industry) / 250000 * resMult * leaderResMult;
      const devMult      = (isPlayer && this.unlockedTechs.has('heavy_industry')) ? 2 : 1;
      const devBoost     = b.devAlloc * b.taxRate * 0.04 * devMult;
      const warPenalty   = isPlayer ? country.enemies.length * 0.0025 : 0;
      const sanctionMult = (isPlayer && this.unlockedTechs.has('econ_hegemony')) ? 0.2 : 1;
      const sanctionHit  = country.sanctionedBy.length * 0.005 * sanctionMult;
      const leaderGdpBns = (leader?.trait === 'economist') ? 0.001 : 0;

      // FDI: mitra dagang besar menginvestasikan modal di negara tuan rumah
      let fdiBonus = 0;
      for (const tid of country.tradePartners) {
        const partner = this.countries[tid];
        if (partner && !partner.occupiedBy) fdiBonus += Math.min(partner.gdp * 0.000006, 0.001);
      }

      // Energy vulnerability: importir minyak kena penalti GDP saat harga minyak tinggi
      const oilDeficit    = Math.max(0, 40 - (res.oil || 0));
      const oilPrice      = this.commodityPrices.oil || 1;
      const energyPenalty = (oilDeficit > 0 && oilPrice > 1.3)
        ? (oilDeficit / 40) * (oilPrice - 1.3) * 0.004 : 0;
      if (isPlayer && newYear && oilPrice > 1.5 && oilDeficit > 10) {
        Notifications.show('High oil prices are dragging GDP — build Oil Refineries or secure an oil supplier.', 'warning', 6000);
      }

      const inflPenalty  = (country.inflation || 0) * 0.0002;

      country.gdp *= 1 + Math.max(0.0005,
        0.0015 + devBoost + resBonus + leaderGdpBns + cycleBonus + fdiBonus
        - warPenalty - sanctionHit - inflPenalty - energyPenalty
      );

      if (isPlayer && this.unlockedTechs.has('banking') && country.treasury > 0) {
        country.treasury *= 1.005;
      }

      // Inflasi: naik saat defisit anggaran atau perang, turun saat surplus
      if (!country.occupiedBy) {
        const deficitPressure = Math.max(0, -netFlow) / Math.max(country.gdp * 0.25, 1);
        const warInflBoost    = (country.enemies || []).length > 0 ? 0.3 : 0;
        const cycleInflBoost  = this._economicCycle.phase === 'boom' ? 0.15 : 0;
        const inflTarget      = Math.min(25, deficitPressure * 8 + warInflBoost + cycleInflBoost);
        const prevInfl        = country.inflation || 0;
        country.inflation     = Math.max(0, prevInfl + (inflTarget - prevInfl) * 0.10);
        if (isPlayer && country.inflation > 15 && prevInfl <= 15) {
          Notifications.show(`Inflation at ${country.inflation.toFixed(1)}% — reduce deficit spending to stabilise.`, 'danger', 7000);
        } else if (isPlayer && country.inflation > 8 && prevInfl <= 8) {
          Notifications.show(`Inflation rising: ${country.inflation.toFixed(1)}%.`, 'warning', 5000);
        }
      }

      // Utang & bunga: treasury negatif = utang, bunga majemuk per kuartal
      if (country.treasury < 0 && !country.occupiedBy) {
        const debtRatio  = Math.abs(country.treasury) / Math.max(country.gdp, 1);
        const annualRate = debtRatio < 0.5 ? 0.03 : debtRatio < 1.0 ? 0.06 : 0.12;
        country.treasury += country.treasury * (annualRate / 4);
        // Default berdaulat: utang > 2× GDP
        if (country.treasury < -country.gdp * 2) {
          country.tradePartners = [];
          country.gdp           *= 0.80;
          country.inflation      = Math.max(country.inflation, 20);
          country.treasury       = -country.gdp * 0.5;
          if (isPlayer) Notifications.show('SOVEREIGN DEFAULT — all trade partners fled, GDP crashed 20%, debt restructured.', 'danger', 12000);
        }
      }

      // AI factory building: invest in most-deficient commodity when flush
      if (!isPlayer && !country.occupiedBy && country.treasury > 200 && Math.random() < 0.08) {
        if (!country.factories) country.factories = { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0 };
        let target = null, lowest = Infinity;
        for (const com of ['oil', 'food', 'industry', 'minerals', 'tech']) {
          if ((country.factories[com] || 0) >= 5) continue;
          if (country.resources[com] < lowest) { lowest = country.resources[com]; target = com; }
        }
        if (target) {
          const n    = country.factories[target] || 0;
          const cost = 30 * (n + 1);
          if (country.treasury >= cost) {
            country.treasury -= cost;
            country.factories[target]++;
            country.resources[target] += 20;
          }
        }
      }

      // Annual infrastructure decay: each factory level has 15% chance to drop 1 level per year
      if (newYear && !country.occupiedBy) {
        if (!country.factories) country.factories = { oil: 0, food: 0, industry: 0, minerals: 0, tech: 0 };
        const BUILD_NAMES = { oil: 'Oil Refinery', food: 'Agri Complex', industry: 'Industrial Zone', minerals: 'Mineral Mine', tech: 'Tech Hub' };
        const decayed = [];
        for (const com of ['oil', 'food', 'industry', 'minerals', 'tech']) {
          if ((country.factories[com] || 0) > 0 && Math.random() < 0.15) {
            country.factories[com]--;
            country.resources[com] = Math.max(0, (country.resources[com] || 0) - 20);
            if (isPlayer) decayed.push(BUILD_NAMES[com]);
          }
        }
        if (decayed.length > 0) {
          Notifications.show(
            `Infrastructure decay: <b>${decayed.join(', ')}</b> degraded by 1 level.`,
            'warning', 6000
          );
        }
      }
    }

    this._tickCommodityMarket();
  },
};
