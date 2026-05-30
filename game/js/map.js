/*
  THE LONG HUNT — Interactive World Map (Popup System)
  
  HOW TO USE:
  1. Paste this into Story JavaScript AFTER script.js
  2. The map button is auto-added to the right sidebar
  3. Click "World Map" → popup opens with full interactive map
  4. Click a region → zooms into that region's locations
  5. Click a location → closes map & navigates to its passage
  
  Also available:
    <<worldmap>>       — opens the map popup
    <<regionmap "key">> — opens map zoomed to a specific region
    TWP.openMap()      — JS call to open map
*/

;(function () {
  'use strict';

  /* ==========================================================
     MAP DATA
     ========================================================== */

  var MAP_REGIONS = {
    valdmere: {
      name: 'Valdmere',
      desc: 'Trade city on the river delta',
      wx: 18, wy: 62,
      color: '#4a8c4a',
      icon: '🏙',
      locations: [
        { id: 'upper_city',      name: 'Upper City',        desc: 'Merchant estates & guild halls',      x: 55, y: 22, icon: '🏛', passage: 'UpperCity', locked: true },
        { id: 'market_district', name: 'Market District',   desc: 'Shops, stalls & the Broken Antler',   x: 45, y: 42, icon: '🏪', passage: 'MarketDistrict' },
        { id: 'broken_antler',   name: 'The Broken Antler', desc: 'Where it all began',                  x: 55, y: 50, icon: '🍺', passage: 'broken_antler' },
        { id: 'dockside',        name: 'Dockside',          desc: 'Warehouses & the Consortium HQ',      x: 30, y: 60, icon: '⚓', passage: 'Dockside' },
        { id: 'undercity',       name: 'The Undercity',     desc: 'Black market & unlicensed traders',   x: 50, y: 72, icon: '🕯', passage: 'Undercity' },
        { id: 'cistern',         name: 'Cistern District',  desc: "Ysolde's cellar workshop",            x: 60, y: 85, icon: '🧪', passage: 'CisternDistrict' },
        // { id: 'east_gate',       name: 'East Gate',         desc: 'Road to the Ashenmoor',               x: 85, y: 40, icon: '🚪', passage: 'EastGate' },
        { id: 'east_garrison',       name: 'East Gate/Garrison',         desc: 'Road to the Ashenmoor',               x: 85, y: 40, icon: '⚔', passage: 'east_garrison' },
      ]
    },
    greymire: {
      name: 'Greymire Mine',
      desc: 'Abandoned iron mine — goblin territory',
      wx: 32, wy: 55,
      color: '#6e5a3a',
      icon: '⛏',
      locations: [
        { id: 'mine_entrance',   name: 'Mine Entrance',     desc: 'Rotting timbers & sleeping sentries',  x: 30, y: 30, icon: '⛏', passage: 'MineEntrance' },
        { id: 'upper_tunnels',   name: 'Upper Tunnels',     desc: 'Goblin camp & crew quarters',          x: 50, y: 50, icon: '🕳', passage: 'UpperTunnels' },
        { id: 'storage_shaft',   name: 'Storage Shaft',     desc: 'Where the Consortium crates were',     x: 60, y: 75, icon: '📦', passage: 'StorageShaft' },
        { id: 'collapse_point',  name: 'The Collapse',      desc: "Where Aldric's leg was pinned",        x: 40, y: 65, icon: '💥', passage: 'CollapsePoint' },
      ]
    },
    ashenmoor: {
      name: 'Ashenmoor Road',
      desc: 'The road east from Valdmere',
      wx: 38, wy: 48,
      color: '#7a8c5a',
      icon: '🛤',
      locked: true,
      locations: [
        { id: 'ashenmoor_road',  name: 'Ashenmoor Road',     desc: 'Main trade route heading east',       x: 25, y: 50, icon: '🛤', passage: 'AshenmoorRoad' },
        { id: 'waypoint',        name: 'Roadside Waypoint',  desc: 'Stone fire ring & wooden bench',      x: 45, y: 40, icon: '🔥', passage: 'Waypoint' },
        { id: 'ruins_site',      name: "Surveyor's Ruins",   desc: "Hadden Marsh's assignment",           x: 70, y: 35, icon: '🏚', passage: 'RuinsSite' },
        { id: 'corsham_cross',   name: 'Corsham Crossroads', desc: 'Where the road branches northeast',  x: 80, y: 55, icon: '✚', passage: 'CorshamCross' },
      ]
    },
    corsham: {
      name: 'Corsham',
      desc: 'Foothill town — contracts & reputation',
      wx: 48, wy: 42,
      color: '#5a7a5a',
      icon: '🏘',
      locked: true,
      locations: [
        { id: 'corsham_arms',     name: 'Corsham Arms',       desc: 'The inn — your corner booth',         x: 45, y: 40, icon: '🏨', passage: 'CorshamArms' },
        { id: 'corsham_garrison', name: 'Garrison',           desc: 'Captain Brenn & the contract board',  x: 60, y: 25, icon: '⚔', passage: 'CorshamGarrison' },
        { id: 'corsham_market',   name: 'Market Square',      desc: "Gerta the tailor, Priya's apothecary",x: 40, y: 55, icon: '🏪', passage: 'CorshamMarket' },
        { id: 'corsham_mine',     name: 'Corsham Mine',       desc: 'Troll lair — cleared by Aldra',       x: 75, y: 70, icon: '⛏', passage: 'CorshamMine' },
        { id: 'priya_shop',      name: "Priya's Apothecary", desc: 'Herbs, potions & contraceptives',     x: 35, y: 68, icon: '🌿', passage: 'PriyaShop' },
      ]
    },
    thornfield: {
      name: 'Thornfield',
      desc: 'Priory town in the foothills',
      wx: 52, wy: 32,
      color: '#5a8c6a',
      icon: '⛪',
      locked: true,
      locations: [
        { id: 'thornfield_priory', name: 'Thornfield Priory',  desc: 'Ruined monastery — rare herbs',      x: 50, y: 25, icon: '⛪', passage: 'ThornfieldPriory' },
        { id: 'priorys_shadow',    name: "Priory's Shadow",    desc: 'Best tavern in Thornfield',           x: 45, y: 50, icon: '🍺', passage: 'PriorysShadow' },
        { id: 'drennen_apoth',     name: "Drennen's Shop",     desc: 'Apothecary — chronobrake source',     x: 60, y: 55, icon: '🧪', passage: 'DrennenShop' },
        { id: 'wolf_den',          name: 'Wolf Den',           desc: 'Dire wolf pack — cleared',            x: 80, y: 65, icon: '🐺', passage: 'WolfDen' },
      ]
    },
    blackthorn: {
      name: 'Blackthorn Market',
      desc: 'Seasonal trading fair at the crossroads',
      wx: 58, wy: 24,
      color: '#6a7a4a',
      icon: '🎪',
      locked: true,
      locations: [
        { id: 'market_grounds',  name: 'Market Grounds',    desc: 'Hundreds of stalls & tents',          x: 45, y: 45, icon: '🎪', passage: 'MarketGrounds' },
        { id: 'orin_weapons',    name: "Orin's Weapons",    desc: 'Half-dwarf weaponsmith — rapier',     x: 60, y: 35, icon: '🗡', passage: 'OrinWeapons' },
        { id: 'helda_stall',    name: "Helda's Textiles",  desc: 'Breast bands & fitted clothing',      x: 35, y: 55, icon: '🧵', passage: 'HeldaStall' },
        { id: 'performer_stage',name: "Performer's Stage",  desc: "Jorin's debut performance",           x: 50, y: 70, icon: '🎵', passage: 'PerformerStage' },
      ]
    },
    ashenmire: {
      name: 'Ashenmire Mountains',
      desc: 'High peaks — monastery & wyvern territory',
      wx: 66, wy: 18,
      color: '#5a6a7a',
      icon: '🏔',
      locked: true,
      locations: [
        { id: 'ashenmire_village', name: 'Ashenmire Village',    desc: "Mountain settlement — Edric's home", x: 35, y: 60, icon: '🏘', passage: 'AshenmireVillage' },
        { id: 'monastery',         name: 'Ashenmire Monastery', desc: 'Ancient ruins — rare alpine herbs',   x: 55, y: 25, icon: '🏛', passage: 'Monastery' },
        { id: 'wyvern_peak',       name: 'Wyvern Peak',         desc: 'Wyvern nesting grounds — DANGER',    x: 75, y: 15, icon: '🐉', passage: 'WyvernPeak' },
        { id: 'mountain_pass',     name: 'Ashenmire Pass',      desc: 'Narrow defile — ambush territory',   x: 25, y: 40, icon: '🏔', passage: 'AshenmirePass' },
        { id: 'bruna_inn',         name: "Bruna's Inn",         desc: 'Cozy mountain lodge',                x: 40, y: 70, icon: '🏨', passage: 'BrunaInn' },
      ]
    },
    willowmere: {
      name: 'Willowmere',
      desc: 'Riverside trading town',
      wx: 28, wy: 80,
      color: '#4a7a6a',
      icon: '🌳',
      locked: true,
      locations: [
        { id: 'willows_rest',   name: "Willow's Rest",    desc: 'Proper inn — clean rooms & bread',      x: 45, y: 40, icon: '🏨', passage: 'WillowsRest' },
        { id: 'wm_market',      name: 'Market Square',    desc: "Margil's clothier & the fountain",      x: 50, y: 55, icon: '⛲', passage: 'WMMarket' },
        { id: 'river_docks',    name: 'River Docks',      desc: 'Barge departure point',                 x: 30, y: 65, icon: '🚢', passage: 'RiverDocks' },
        { id: 'veradis_estate', name: 'Ashmore Estate',   desc: "Lady Veradis's townhouse",              x: 65, y: 30, icon: '🏰', passage: 'VeradisEstate' },
        { id: 'pirate_cove',    name: 'Pirate Cove',      desc: 'River pirate hideout — cleared',        x: 20, y: 80, icon: '☠', passage: 'PirateCove' },
      ]
    },
    river_route: {
      name: 'River Ashburn',
      desc: 'Barge route south to the coast',
      wx: 38, wy: 86,
      color: '#4a6a8c',
      icon: '🌊',
      locked: true,
      locations: [
        { id: 'fernhollow',     name: 'Fernhollow',       desc: 'Tiny riverside village',                x: 30, y: 35, icon: '🏘', passage: 'Fernhollow' },
        { id: 'river_ford',     name: 'Ashburn Ford',     desc: 'River crossing point',                  x: 50, y: 50, icon: '🌊', passage: 'RiverFord' },
        { id: 'the_gorge',      name: 'The Gorge',        desc: 'Narrow canyon — bandit ambush',         x: 70, y: 65, icon: '⚠', passage: 'TheGorge' },
      ]
    },
    seabreak: {
      name: 'Seabreak',
      desc: "Coastal jewel — the Merchant Mothers' city",
      wx: 55, wy: 90,
      color: '#4a7acc',
      icon: '⚓',
      locked: true,
      locations: [
        { id: 'harbor',        name: 'Harbor District',         desc: 'Ships, sailors & exotic markets',    x: 35, y: 45, icon: '⚓', passage: 'HarborDistrict' },
        { id: 'guild_hall',    name: "Merchant Mothers' Hall",  desc: 'Summit negotiations',                x: 55, y: 25, icon: '🏛', passage: 'GuildHall' },
        { id: 'training_hall', name: 'Training Hall',           desc: "Tournament & Nessa's lessons",       x: 72, y: 40, icon: '⚔', passage: 'TrainingHall' },
        { id: 'night_market',  name: 'Night Market',            desc: 'Lantern-lit bazaar after dark',      x: 42, y: 62, icon: '🏮', passage: 'NightMarket' },
        { id: 'ketta_armory',  name: "Ketta's Armory",          desc: "Women's combat gear specialist",     x: 65, y: 58, icon: '🛡', passage: 'KettaArmory' },
        { id: 'the_beach',     name: 'The Beach',               desc: 'Sand, surf & morning training',     x: 22, y: 78, icon: '🏖', passage: 'TheBeach' },
        { id: 'sb_townhouse',  name: 'Townhouse',               desc: 'Lodgings during the summit',        x: 58, y: 48, icon: '🏠', passage: 'SBTownhouse' },
      ]
    }
  };


  /* ==========================================================
     STATE
     ========================================================== */
  var currentView = 'world';


  /* ==========================================================
     POPUP DOM
     ========================================================== */

  function ensurePopup() {
    if (document.getElementById('map-popup-overlay')) return;

    var ov = document.createElement('div');
    ov.id = 'map-popup-overlay';
    ov.className = 'map-popup-overlay';
    ov.innerHTML =
      '<div class="map-popup-panel">' +
        '<div class="map-popup-header">' +
          '<button class="map-popup-back" id="map-back-btn">◂ World</button>' +
          '<span class="map-popup-title" id="map-title">⚜ World Map ⚜</span>' +
          '<button class="map-popup-close" id="map-close-btn">✕</button>' +
        '</div>' +
        '<div class="map-popup-canvas" id="map-canvas"></div>' +
        '<div class="map-popup-coords" id="map-coords"></div>' +
        '<div class="map-popup-legend" id="map-legend"></div>' +
      '</div>';
    document.body.appendChild(ov);

    ov.addEventListener('click', function (e) { if (e.target === ov) closeMap(); });
    document.getElementById('map-close-btn').addEventListener('click', closeMap);
    document.getElementById('map-back-btn').addEventListener('click', function () {
      currentView = 'world';
      draw();
    });
  }

  function openMap() {
    ensurePopup();
    currentView = 'world';
    draw();
    document.getElementById('map-popup-overlay').classList.add('open');
  }

  function closeMap() {
    var el = document.getElementById('map-popup-overlay');
    if (el) el.classList.remove('open');
  }


  /* ==========================================================
     MASTER DRAW
     ========================================================== */

  function draw() {
    var canvas = document.getElementById('map-canvas');
    var legend = document.getElementById('map-legend');
    var title  = document.getElementById('map-title');
    var back   = document.getElementById('map-back-btn');
    if (!canvas) return;

    canvas.innerHTML = '';
    legend.innerHTML = '';
    var coords = document.getElementById('map-coords');
    if (coords) coords.textContent = '';

    if (currentView === 'world') {
      title.textContent = '⚜ World Map ⚜';
      back.style.display = 'none';
      drawWorld(canvas);
      drawWorldLegend(legend);
    } else {
      var r = MAP_REGIONS[currentView];
      title.textContent = (r ? r.icon + ' ' + r.name : 'Unknown');
      back.style.display = '';
      drawRegion(canvas, currentView);
      drawRegionLegend(legend, currentView);
    }
  }


  /* ==========================================================
     WORLD MAP
     ========================================================== */

  function drawWorld(container) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = mkSvg(NS, 100, 100, 'map-svg');

    // -- Defs --
    var defs = document.createElementNS(NS, 'defs');

    // Bg gradient
    defs.appendChild(mkGrad(NS, 'wBg', 'radial',
      [{o:'0%',c:'#1e2e1e'},{o:'100%',c:'#0a140a'}]));

    // Water
    defs.appendChild(mkGrad(NS, 'wWater', 'linear',
      [{o:'0%',c:'#1a3a4a',a:'0.6'},{o:'100%',c:'#0a2a3a',a:'0.8'}],
      {x1:0,y1:0,x2:0,y2:1}));

    // Glow
    var gf = document.createElementNS(NS, 'filter');
    gf.id = 'wGlow';
    gf.setAttribute('x','-50%'); gf.setAttribute('y','-50%');
    gf.setAttribute('width','200%'); gf.setAttribute('height','200%');
    gf.innerHTML = '<feGaussianBlur stdDeviation="0.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(gf);

    // Animations
    var css = document.createElementNS(NS, 'style');
    css.textContent =
      '@keyframes wPulse{0%{r:2.8;opacity:.5}50%{r:4.2;opacity:.15}100%{r:2.8;opacity:.5}}' +
      '.w-pulse{animation:wPulse 2.5s ease-in-out infinite}' +
      '.w-rg:hover .w-dot{r:2.6;fill-opacity:1}' +
      '.w-rg:hover .w-label{fill:#fff}' +
      '@keyframes mcPulse{0%{r:4.5;opacity:.9}60%{r:8.5;opacity:0}100%{r:4.5;opacity:.9}}' +
      '.mc-pulse{animation:mcPulse 2s ease-out infinite}';
    defs.appendChild(css);
    svg.appendChild(defs);

    // Background
    R(svg, NS, 0, 0, 100, 100, 'url(#wBg)');

    // Coordinate grid
    for (var gi = 0; gi <= 100; gi += 10) {
      P(svg, NS, 'M0,'+gi+' L100,'+gi, 'none', '#2a3a2a', .15);
      P(svg, NS, 'M'+gi+',0 L'+gi+',100', 'none', '#2a3a2a', .15);
    }

    // Sea
    P(svg, NS, 'M38,96 Q50,80 64,78 Q80,76 100,82 L100,100 L0,100 L0,97 Q18,93 38,96Z', 'url(#wWater)');

    // River
    P(svg, NS, 'M15,58 Q20,62 22,68 Q24,74 26,78 Q28,82 32,86 Q36,90 42,88 Q48,86 52,92',
      'none', '#2a5a6a', 1.2, 'round', null, .7);

    // Mountains
    P(svg, NS, 'M56,10 L60,4 L64,12 L68,2 L72,10 L76,4 L80,12 L78,20 L74,14 L70,22 L66,15 L62,24 L58,18 L54,14Z',
      '#1a2a1a', '#2a3a2a', .3, null, null, .5);

    // Forests
    P(svg, NS, 'M30,40 Q34,36 38,40 Q42,36 46,40 L46,46 Q42,50 38,46 Q34,50 30,46Z', '#142014', null, 0, null, null, .35);
    P(svg, NS, 'M6,48 Q10,44 14,48 Q16,45 18,48 L18,53 Q15,56 12,53 Q9,56 6,53Z', '#142014', null, 0, null, null, .35);

    // Roads
    [
      {d:'M20,62 L30,56 L38,50 L48,44', w:.5},
      {d:'M48,44 L52,36 L54,30', w:.4},
      {d:'M54,30 L58,24 L60,20', w:.4},
      {d:'M60,20 L66,16 L70,14', w:.3, da:'1,.8'},
      {d:'M48,44 L40,58 L32,70 L28,78', w:.4},
      {d:'M28,80 L34,84 L42,86 L52,90', w:.6, da:'1.5,1'},
    ].forEach(function(r){
      P(svg, NS, r.d, 'none', '#4a3a2a', r.w, 'round', r.da||null, .6);
    });

    // Compass
    T(svg, NS, 92, 7, 'N', '3.5px', '#c9a84c');
    T(svg, NS, 92, 12, '▲', '2.5px', '#886622');

    // Water labels
    T(svg, NS, 24, 76, 'R. Ashburn', '1.8px', '#3a7a8a', true, -18);
    T(svg, NS, 72, 96, 'The Sundering Sea', '2.5px', '#2a5a6a', true);

    // Region markers
    Object.keys(MAP_REGIONS).forEach(function(k) {
      var r = MAP_REGIONS[k];
      var locked = !!r.locked;
      var dotColor = locked ? '#555' : r.color;

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'w-rg' + (locked ? ' w-locked' : ''));
      g.style.cursor = locked ? 'not-allowed' : 'pointer';

      // Tooltip (native browser tooltip)
      var title = document.createElementNS(NS, 'title');
      title.textContent = locked ? r.name + ' — Not yet accessible' : r.name;
      g.appendChild(title);

      // Pulse (hidden for locked)
      if (!locked) C(g, NS, r.wx, r.wy, 2.8, 'none', r.color, .3, .5, 'w-pulse');

      // Hit
      C(g, NS, r.wx, r.wy, 5.5, 'transparent');

      // Dot
      var dot = C(g, NS, r.wx, r.wy, 2, dotColor, '#000', .4, null, 'w-dot');
      if (!locked) dot.setAttribute('filter', 'url(#wGlow)');

      // Icon — lock for locked regions
      T(g, NS, r.wx, r.wy+.8, locked ? '🔒' : (r.icon||'•'), '2.2px', locked ? '#888' : null);

      // Label
      var lb = T(g, NS, r.wx, r.wy-4, r.name, '2.3px', locked ? '#666' : '#ddc06a');
      lb.setAttribute('class', 'w-label');

      if (!locked) g.addEventListener('click', function(){ currentView=k; draw(); });
      svg.appendChild(g);
    });

    // MC position marker
    var wSv = (typeof State !== 'undefined') ? State.variables : {};
    if (wSv.mcRegion && MAP_REGIONS[wSv.mcRegion]) {
      var mr = MAP_REGIONS[wSv.mcRegion];
      drawPlayerMarker(svg, NS, mr.wx, mr.wy, true);
    }

    attachCoordTracker(svg, 'wx', 'wy');
    container.appendChild(svg);
  }

  function drawWorldLegend(container) {
    container.innerHTML = '<span class="ml-title">Regions</span>';
    Object.keys(MAP_REGIONS).forEach(function(k) {
      var r = MAP_REGIONS[k];
      var locked = !!r.locked;
      var b = document.createElement('button');
      b.className = 'ml-item' + (locked ? ' ml-locked' : '');
      b.disabled = locked;
      b.title = locked ? 'Not yet accessible' : '';
      b.innerHTML = '<span class="ml-dot" style="background:' + (locked ? '#555' : r.color) + '"></span>' +
        '<span class="ml-name">' + r.name + (locked ? ' 🔒' : '') + '</span>' +
        '<span class="ml-desc">' + (locked ? 'Not yet accessible' : r.desc) + '</span>';
      if (!locked) b.addEventListener('click', function(){ currentView=k; draw(); });
      container.appendChild(b);
    });
  }


  /* ==========================================================
     REGION MAP
     ========================================================== */

  function drawRegion(container, key) {
    var region = MAP_REGIONS[key];
    if (!region) return;

    var NS = 'http://www.w3.org/2000/svg';
    var svg = mkSvg(NS, 100, 100, 'map-svg region-map-svg');

    var defs = document.createElementNS(NS, 'defs');
    var css = document.createElementNS(NS, 'style');
    css.textContent =
      '@keyframes lPulse{0%{opacity:.06}50%{opacity:.22}100%{opacity:.06}}' +
      '.l-glow{animation:lPulse 3s ease-in-out infinite}' +
      '.l-g:hover .l-glow{opacity:.3 !important}' +
      '.l-g:hover .l-name{fill:#fff}' +
      '.l-g:hover .l-desc{opacity:1}' +
      '.l-desc{opacity:0;transition:opacity .25s}' +
      '@keyframes mcPulse{0%{r:7;opacity:.9}60%{r:13;opacity:0}100%{r:7;opacity:.9}}' +
      '.mc-pulse{animation:mcPulse 2s ease-out infinite}';
    defs.appendChild(css);
    svg.appendChild(defs);

    // BG
    var bgs = {
      valdmere:'#121e12', greymire:'#1a1410', ashenmoor:'#141e14',
      corsham:'#141c14', thornfield:'#14201a', blackthorn:'#1a1e14',
      ashenmire:'#141a1e', willowmere:'#121e1a', river_route:'#101a1e',
      seabreak:'#101a20'
    };
    R(svg, NS, 0, 0, 100, 100, bgs[key]||'#121e12');

    // Grid
    for (var i=0;i<=100;i+=10) {
      P(svg,NS,'M0,'+i+' L100,'+i,'none','#1a2a1a',.15);
      P(svg,NS,'M'+i+',0 L'+i+',100','none','#1a2a1a',.15);
    }

    // Terrain decorations
    if (key==='seabreak'||key==='river_route') {
      R(svg,NS,0,88,100,12,'#0a2030',null,0,.5);
      T(svg,NS,50,95,'~ The Sundering Sea ~','2.5px','#2a5a6a',true);
    }
    if (key==='valdmere'||key==='willowmere'||key==='river_route') {
      P(svg,NS,'M0,72 Q20,65 40,70 Q60,76 80,68 Q95,64 100,70','none','#1a4a5a',1.5,'round',null,.4);
    }
    if (key==='ashenmire') {
      P(svg,NS,'M8,15 L18,5 L28,18 L38,3 L48,16 L58,7 L65,20','none','#3a4a3a',.6,null,null,.35);
    }
    if (key==='greymire') {
      for(var j=0;j<6;j++){
        C(svg,NS,15+Math.random()*70,15+Math.random()*70,1+Math.random()*2,'#2a2218',null,0,.25);
      }
    }
    if (key==='ashenmoor'||key==='thornfield') {
      for(var t=0;t<6;t++){
        T(svg,NS,10+Math.random()*80,10+Math.random()*80,'🌲','3px',null,null,null,null,.25);
      }
    }

    // Paths between locations
    var locs = region.locations;
    for (var n=0;n<locs.length-1;n++) {
      P(svg,NS,'M'+locs[n].x+','+locs[n].y+' L'+locs[n+1].x+','+locs[n+1].y,
        'none','#3a3a2a',.4,'round','2,1.2',.45);
    }

    // Border
    var br = R(svg,NS,1,1,98,98,'none',region.color,.4,.2);
    br.setAttribute('rx','1');
    br.setAttribute('stroke-dasharray','3,1.5');

    // Region name watermark
    T(svg,NS,50,10,region.name,'4px',region.color,null,null,null,.12);

    // Locations
    var rSv = (typeof State !== 'undefined') ? State.variables : {};
    locs.forEach(function(loc) {
      var locked = !!loc.locked;
      var pinColor = locked ? '#444' : region.color;

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'l-g' + (locked ? ' l-locked' : ''));
      g.style.cursor = locked ? 'not-allowed' : 'pointer';

      // Tooltip
      var title = document.createElementNS(NS, 'title');
      title.textContent = locked ? loc.name + ' — Not yet accessible' : loc.name;
      g.appendChild(title);

      // Glow (hidden for locked)
      if (!locked) C(g,NS,loc.x,loc.y,6,region.color,null,0,.06,'l-glow');
      // Pin bg
      C(g,NS,loc.x,loc.y,3,'#0e1a0e',pinColor,.5);
      // Icon
      T(g,NS,loc.x,loc.y+1.3, locked ? '🔒' : (loc.icon||'•'),'3.2px', locked ? '#666' : null);
      // Name
      var nm = T(g,NS,loc.x,loc.y-5.5,loc.name,'2.5px', locked ? '#555' : '#ddc06a');
      nm.setAttribute('class','l-name');
      // Desc
      var ds = T(g,NS,loc.x,loc.y+7, locked ? 'Not yet accessible' : (loc.desc||''),'1.8px','#8a9a8a',true);
      ds.setAttribute('class','l-desc');

      if (!locked) {
        g.addEventListener('click', function() {
          if (typeof State !== 'undefined') {
            State.variables.mcRegion   = key;
            State.variables.mcLocation = loc.id;
          }
          closeMap();
          setTimeout(function(){
            if (typeof Story!=='undefined' && Story.has(loc.passage)) {
              Engine.play(loc.passage);
            } else if (typeof TWP!=='undefined' && TWP.toast) {
              TWP.toast('Location "'+loc.passage+'" not accesible','danger');
            }
          }, 300);
        });
      }

      svg.appendChild(g);
    });

    // MC position marker
    if (rSv.mcRegion === key) {
      var px = null, py = null;
      if (rSv.mcLocation) {
        for (var li = 0; li < locs.length; li++) {
          if (locs[li].id === rSv.mcLocation) { px = locs[li].x; py = locs[li].y; break; }
        }
      }
      if (px == null && rSv.mcMapX != null) { px = rSv.mcMapX; py = rSv.mcMapY; }
      if (px != null) drawPlayerMarker(svg, NS, px, py, false);
    }

    attachCoordTracker(svg, 'x', 'y');
    container.appendChild(svg);
  }

  function drawRegionLegend(container, key) {
    var region = MAP_REGIONS[key];
    if (!region) return;
    container.innerHTML = '<span class="ml-title">Locations</span>';
    region.locations.forEach(function(loc) {
      var locked = !!loc.locked;
      var b = document.createElement('button');
      b.className = 'ml-item' + (locked ? ' ml-locked' : '');
      b.disabled = locked;
      b.title = locked ? 'Not yet accessible' : '';
      b.innerHTML = '<span class="ml-icon">' + (locked ? '🔒' : loc.icon) + '</span>' +
        '<span class="ml-name">' + loc.name + (locked ? ' 🔒' : '') + '</span>' +
        '<span class="ml-desc">' + (locked ? 'Not yet accessible' : loc.desc) + '</span>';
      if (!locked) {
        b.addEventListener('click', function() {
          if (typeof State !== 'undefined') {
            State.variables.mcRegion   = key;
            State.variables.mcLocation = loc.id;
          }
          closeMap();
          setTimeout(function(){
            if (typeof Story!=='undefined'&&Story.has(loc.passage)) Engine.play(loc.passage);
            else if(typeof TWP!=='undefined'&&TWP.toast) TWP.toast('Location "'+loc.passage+'" not accesible','danger');
          },300);
        });
      }
      container.appendChild(b);
    });
  }


  /* ==========================================================
     SVG HELPERS
     ========================================================== */

  function mkSvg(ns, w, h, cls) {
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 '+w+' '+h);
    s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    if (cls) s.setAttribute('class', cls);
    return s;
  }

  function R(par, ns, x, y, w, h, fill, stroke, sw, op) {
    var e = document.createElementNS(ns,'rect');
    e.setAttribute('x',x); e.setAttribute('y',y);
    e.setAttribute('width',w); e.setAttribute('height',h);
    if(fill)e.setAttribute('fill',fill);
    if(stroke)e.setAttribute('stroke',stroke);
    if(sw)e.setAttribute('stroke-width',sw);
    if(op!=null)e.setAttribute('opacity',op);
    par.appendChild(e); return e;
  }

  function P(par, ns, d, fill, stroke, sw, cap, dash, op) {
    var e = document.createElementNS(ns,'path');
    e.setAttribute('d',d);
    e.setAttribute('fill',fill||'none');
    if(stroke)e.setAttribute('stroke',stroke);
    if(sw)e.setAttribute('stroke-width',sw);
    if(cap)e.setAttribute('stroke-linecap',cap);
    if(dash)e.setAttribute('stroke-dasharray',dash);
    if(op!=null)e.setAttribute('opacity',op);
    par.appendChild(e); return e;
  }

  function C(par, ns, cx, cy, r, fill, stroke, sw, op, cls) {
    var e = document.createElementNS(ns,'circle');
    e.setAttribute('cx',cx); e.setAttribute('cy',cy); e.setAttribute('r',r);
    if(fill)e.setAttribute('fill',fill);
    if(stroke)e.setAttribute('stroke',stroke);
    if(sw)e.setAttribute('stroke-width',sw);
    if(op!=null)e.setAttribute('opacity',op);
    if(cls)e.setAttribute('class',cls);
    par.appendChild(e); return e;
  }

  function T(par, ns, x, y, text, size, fill, italic, rotate, cls, op) {
    var e = document.createElementNS(ns,'text');
    e.setAttribute('x',x); e.setAttribute('y',y);
    e.setAttribute('text-anchor','middle');
    e.setAttribute('font-family','Cinzel, serif');
    if(fill)e.setAttribute('fill',fill);
    if(size)e.setAttribute('font-size',size);
    if(italic)e.setAttribute('font-style','italic');
    if(rotate)e.setAttribute('transform','rotate('+rotate+' '+x+' '+y+')');
    if(cls)e.setAttribute('class',cls);
    if(op!=null)e.setAttribute('opacity',op);
    e.textContent = text;
    par.appendChild(e); return e;
  }

  function drawPlayerMarker(svg, NS, x, y, isWorld) {
    var g = document.createElementNS(NS, 'g');
    // Expanding pulse ring
    C(g, NS, x, y, isWorld ? 4.5 : 7, 'none', '#ffcc44', 0.9, null, 'mc-pulse');
    // Pin background
    C(g, NS, x, y, isWorld ? 2.5 : 4.2, '#1a0e00', '#ffcc44', 1);
    // Character icon
    T(g, NS, x, y + (isWorld ? 1 : 1.6), '⚔', isWorld ? '2.8px' : '4.6px');
    // "You" label
    var lbl = T(g, NS, x, y - (isWorld ? 5.5 : 9), '▶ You', isWorld ? '2.1px' : '2.4px', '#ffcc44');
    lbl.setAttribute('font-weight', 'bold');
    svg.appendChild(g);
  }

  function attachCoordTracker(svg, xLabel, yLabel) {
    var display = document.getElementById('map-coords');
    if (!display) return;
    svg.addEventListener('mousemove', function(e) {
      var pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse());
      var x = Math.round(Math.max(0, Math.min(100, p.x)));
      var y = Math.round(Math.max(0, Math.min(100, p.y)));
      display.textContent = xLabel + ': ' + x + '   ' + yLabel + ': ' + y;
    });
    svg.addEventListener('mouseleave', function() {
      display.textContent = '';
    });
  }

  function mkGrad(ns, id, type, stops, attrs) {
    var tag = type==='radial'?'radialGradient':'linearGradient';
    var e = document.createElementNS(ns, tag);
    e.id = id;
    if(attrs) Object.keys(attrs).forEach(function(k){e.setAttribute(k,attrs[k]);});
    stops.forEach(function(s){
      var st = document.createElementNS(ns,'stop');
      st.setAttribute('offset',s.o); st.setAttribute('stop-color',s.c);
      if(s.a)st.setAttribute('stop-opacity',s.a);
      e.appendChild(st);
    });
    return e;
  }


  /* ==========================================================
     WIRE RIGHT SIDEBAR BUTTON + KEYBOARD
     ========================================================== */

  function openLocationMap() {
    var region = (typeof State !== 'undefined' && State.variables.mcRegion) || 'valdmere';
    currentView = MAP_REGIONS[region] ? region : 'valdmere';
    ensurePopup(); draw();
    document.getElementById('map-popup-overlay').classList.add('open');
  }

  document.addEventListener('click', function(e) {
    if (e.target && e.target.closest('#rs-map-btn')) openMap();
    if (e.target && e.target.closest('#rs-loc-btn')) openLocationMap();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMap();
    if (e.key === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var tag = (e.target.tagName||'').toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        var ov = document.getElementById('map-popup-overlay');
        if (ov && ov.classList.contains('open')) closeMap();
        else openMap();
      }
    }
  });


  /* ==========================================================
     SUGARCUBE MACROS
     ========================================================== */

  if (typeof Macro !== 'undefined') {
    Macro.add('worldmap', { handler: function() { openMap(); } });
    Macro.add('regionmap', {
      handler: function() {
        currentView = this.args[0] || 'valdmere';
        ensurePopup(); draw();
        document.getElementById('map-popup-overlay').classList.add('open');
      }
    });
  }

  /* ==========================================================
     API
     ========================================================== */
  window.TWP = window.TWP || {};
  TWP.openMap = openMap;
  TWP.openLocationMap = openLocationMap;
  TWP.closeMap = closeMap;

})();



$(document).on('click', 'polygon.svg_obj_map', function () {
  const passage = $(this).data('passage');
  $('polygon.svg_obj_map').removeClass('active');
  $(this).addClass('active');
  Engine.play(passage);
});

$(document).on('click', 'polygon.svg_person_map', function () {
  const passage = $(this).data('passage');
  $('polygon.svg_person_map').removeClass('active');
  $(this).addClass('active');
  Engine.play(passage);
});

$(document).on('click', 'polygon.svg_main_map', function () {
  const passage = $(this).data('passage');
  $('polygon.svg_main_map').removeClass('active');
  $(this).addClass('active');
  Engine.play(passage);
});

$(document).on('click', 'polygon.svg_side_map', function () {
  const passage = $(this).data('passage');
  $('polygon.svg_side_map').removeClass('active');
  $(this).addClass('active');
  Engine.play(passage);
});


$(document).on('click', 'polygon.svg_person_map', function () {
  const passage = $(this).data('passage');
  $('polygon.svg_person_map').removeClass('active');
  $(this).addClass('active');
  Engine.play(passage);
});