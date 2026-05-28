'use strict';

const WorldMap = {
  svg: null,
  g: null,
  projection: null,
  path: null,
  zoom: null,
  width: 0,
  height: 0,

  COLORS: {
    player:      '#4ade80',
    ally:        '#86efac',
    enemy:       '#f87171',
    neutral:     '#2d3f55',
    unknown:     '#1a2d3d',
    ocean:       '#0b1a2a',
    graticule:   '#0f2033',
    border:      '#111e2d',
    selected:    '#fbbf24',
  },

  HOVER: {
    player:  '#22c55e',
    ally:    '#4ade80',
    enemy:   '#ef4444',
    neutral: '#3d5470',
    unknown: '#253040',
  },

  init() {
    const container = document.getElementById('map-container');
    this.width  = container.clientWidth;
    this.height = container.clientHeight;

    this.svg = d3.select('#world-map')
      .attr('width',  this.width)
      .attr('height', this.height);

    // Ocean
    this.svg.append('rect')
      .attr('width',  this.width)
      .attr('height', this.height)
      .attr('fill',   this.COLORS.ocean);

    this.projection = d3.geoNaturalEarth1()
      .scale(this.width / 6.3)
      .translate([this.width / 2, this.height / 2]);

    this.path = d3.geoPath().projection(this.projection);

    this.zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    this.svg.call(this.zoom);
    this.g = this.svg.append('g');

    this._loadMap();

    // Click on ocean deselects
    this.svg.on('click', () => {
      GameState.selectedCountryId = null;
      UI.hidePanelCountry();
      this.refresh();
    });

    // Resize handler
    window.addEventListener('resize', () => this._onResize());
  },

  _loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(world => {
        document.getElementById('loading').style.display = 'none';

        const graticule = d3.geoGraticule();
        this.g.append('path')
          .datum(graticule())
          .attr('d', this.path)
          .attr('fill', 'none')
          .attr('stroke', this.COLORS.graticule)
          .attr('stroke-width', 0.4);

        const countries = topojson.feature(world, world.objects.countries);

        this.g.selectAll('.country')
          .data(countries.features)
          .join('path')
          .attr('class', 'country')
          .attr('d', this.path)
          .attr('fill', d => this._fillColor(d.id))
          .attr('stroke', this.COLORS.border)
          .attr('stroke-width', 0.5)
          .on('click', (event, d) => {
            event.stopPropagation();
            GameState.selectedCountryId = String(d.id);
            this.refresh();
            UI.showCountryPanel(d.id);
          })
          .on('mouseover', (event, d) => {
            if (String(d.id) !== GameState.selectedCountryId) {
              d3.select(event.currentTarget).attr('fill', this._hoverColor(d.id));
            }
            const c = GameState.getCountry(d.id);
            if (c) this._showTooltip(event, c.name);
          })
          .on('mousemove', (event) => this._moveTooltip(event))
          .on('mouseout',  (event, d) => {
            if (String(d.id) !== GameState.selectedCountryId) {
              d3.select(event.currentTarget).attr('fill', this._fillColor(d.id));
            }
            this._hideTooltip();
          });

        // Country borders (mesh)
        this.g.append('path')
          .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
          .attr('d', this.path)
          .attr('fill', 'none')
          .attr('stroke', this.COLORS.border)
          .attr('stroke-width', 0.4)
          .attr('pointer-events', 'none');
      })
      .catch(err => {
        document.getElementById('loading').textContent = 'Error loading map: ' + err.message;
      });
  },

  _fillColor(id) {
    const sid = String(id);
    if (sid === GameState.selectedCountryId) return this.COLORS.selected;
    const c = GameState.getCountry(id);
    if (!c) return this.COLORS.unknown;
    if (c.occupiedBy === GameState.playerCountryId) return '#14532d'; // dark green = annexed territory
    return this.COLORS[c.relation] || this.COLORS.neutral;
  },

  _hoverColor(id) {
    const c = GameState.getCountry(id);
    if (!c) return this.HOVER.unknown;
    if (c.occupiedBy === GameState.playerCountryId) return '#166534';
    return this.HOVER[c.relation] || this.HOVER.neutral;
  },

  refresh() {
    this.g.selectAll('.country')
      .attr('fill', d => this._fillColor(d.id));
  },

  _showTooltip(event, name) {
    const t = document.getElementById('map-tooltip');
    t.textContent = name;
    t.style.display = 'block';
    t.style.left = (event.pageX + 14) + 'px';
    t.style.top  = (event.pageY - 32) + 'px';
  },

  _moveTooltip(event) {
    const t = document.getElementById('map-tooltip');
    t.style.left = (event.pageX + 14) + 'px';
    t.style.top  = (event.pageY - 32) + 'px';
  },

  _hideTooltip() {
    document.getElementById('map-tooltip').style.display = 'none';
  },

  _onResize() {
    const container = document.getElementById('map-container');
    this.width  = container.clientWidth;
    this.height = container.clientHeight;
    this.svg.attr('width', this.width).attr('height', this.height);
    this.projection
      .scale(this.width / 6.3)
      .translate([this.width / 2, this.height / 2]);
    this.path = d3.geoPath().projection(this.projection);
    this.g.selectAll('path').attr('d', this.path);
  },
};
