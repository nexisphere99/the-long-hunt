/* ============================================================
   THE LONG HUNT — Twine SugarCube JavaScript
   Custom macros, sidebars, popup menu, dialog system
   ============================================================ */

   ;(function () {
    'use strict';
  
    /* ==========================================================
       SECTION 1: DOM SCAFFOLDING
       Build the left sidebar, right sidebar, popup overlay,
       menu toggle, mobile toggles, and toast container
       ========================================================== */
  
    function buildScaffolding() {
      // ---- LEFT SIDEBAR ----
      if (!document.getElementById('left-sidebar')) {
        var left = document.createElement('div');
        left.id = 'left-sidebar';
        left.innerHTML =
          '<div class="sidebar-header">' +
            '<div class="char-name" id="ls-char-name">The Long Hunt</div>' +
            '<div class="char-title" id="ls-char-title">Chapter 1 - Version 0.0.3</div>' +
          '</div>' +
          '<div class="body-viewer">' +
            '<div class="body-img-wrap">' +
              '<img id="ls-body-img" alt="Character">' +
              '<div class="body-img-unavailable" id="ls-body-unavailable">Not Available</div>' +
            '</div>' +
            '<div class="body-viewer-btns">' +
              '<button class="body-ctrl-btn" id="ls-body-rotate">🔄 Back</button>' +
              '<button class="body-ctrl-btn" id="ls-body-dress">👗 Undress</button>' +
            '</div>' +
          '</div>' +
          '<div id="ls-stats"></div>' +
          '<div id="ls-nav"></div>' +
          '<div class="sidebar-footer">' +
            // '<div class="day-display" id="ls-day">Day 1</div>' +
            // '<div class="time-display" id="ls-time">Morning</div>' +
          '</div>';
        document.body.appendChild(left);
      }
  
      // ---- RIGHT SIDEBAR ----
      if (!document.getElementById('right-sidebar')) {
        var right = document.createElement('div');
        right.id = 'right-sidebar';
        right.innerHTML =
          '<div class="sidebar-header">Inventory</div>' +
          '<div id="rs-inventory"></div>' +
          '<div id="rs-companions"></div>' +
          '<div class="rs-stats-section">' +
            '<div class="rs-stats-title">Stats</div>' +
            '<div id="rs-stats"></div>' +
          '</div>' +
          '<div class="rs-map-btn-wrap">' +
            '<button class="rs-map-btn" id="rs-loc-btn" aria-label="Open location map">📍 Location Map</button>' +
            '<button class="rs-map-btn" id="rs-map-btn" aria-label="Open world map">🗺 World Map</button>' +
          '</div>';
        document.body.appendChild(right);
      }
  
      // ---- POPUP OVERLAY (replaces default ui-bar) ----
      if (!document.getElementById('popup-overlay')) {
        var popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.id = 'popup-overlay';
        popup.innerHTML =
          '<div class="popup-panel">' +
            '<div class="popup-header">' +
              '<span class="popup-title">⚜ Game Menu</span>' +
              '<button class="popup-close" id="popup-close-btn" aria-label="Close menu">✕</button>' +
            '</div>' +
            '<div class="popup-body" id="popup-body">' +
              buildPopupMenuItems() +
            '</div>' +
          '</div>';
        document.body.appendChild(popup);
  
        // Close on overlay click (outside panel)
        popup.addEventListener('click', function (e) {
          if (e.target === popup) closePopup();
        });
  
        // Close button
        document.getElementById('popup-close-btn').addEventListener('click', closePopup);
      }
  
      // ---- TOP BUTTON GROUP (Menu + Objectives, top center) ----
      if (!document.getElementById('top-btn-group')) {
        var topGroup = document.createElement('div');
        topGroup.id = 'top-btn-group';

        var toggle = document.createElement('button');
        toggle.id = 'menu-toggle';
        toggle.textContent = 'Menu';
        toggle.setAttribute('aria-label', 'Open game menu');
        toggle.addEventListener('click', openPopup);
        topGroup.appendChild(toggle);

        var objToggle = document.createElement('button');
        objToggle.id = 'objectives-toggle';
        objToggle.textContent = 'Objectives';
        objToggle.setAttribute('aria-label', 'Open objectives');
        objToggle.addEventListener('click', openObjectivesPopup);
        topGroup.appendChild(objToggle);

        document.body.appendChild(topGroup);
      }

      // ---- OBJECTIVES POPUP ----
      if (!document.getElementById('objectives-overlay')) {
        var objOverlay = document.createElement('div');
        objOverlay.id = 'objectives-overlay';
        objOverlay.className = 'objectives-overlay';
        objOverlay.innerHTML =
          '<div class="objectives-panel">' +
            '<div class="objectives-header">' +
              '<span class="objectives-title">⚔ Objectives</span>' +
              '<button class="objectives-close" id="objectives-close-btn" aria-label="Close objectives">✕</button>' +
            '</div>' +
            '<div class="objectives-body" id="objectives-body"></div>' +
          '</div>';
        document.body.appendChild(objOverlay);

        objOverlay.addEventListener('click', function (e) {
          if (e.target === objOverlay) closeObjectivesPopup();
        });
        document.getElementById('objectives-close-btn').addEventListener('click', closeObjectivesPopup);
      }

      // ---- STAT CHANGE NOTIFICATION CONTAINER ----
      if (!document.getElementById('stat-notif-container')) {
        var sn = document.createElement('div');
        sn.id = 'stat-notif-container';
        document.body.appendChild(sn);
      }

      // ---- MOBILE SIDEBAR TOGGLES ----
      if (!document.getElementById('toggle-left-sidebar')) {
        var tl = document.createElement('button');
        tl.id = 'toggle-left-sidebar';
        tl.className = 'mobile-toggle';
        tl.innerHTML = '☰';
        tl.setAttribute('aria-label', 'Toggle character panel');
        tl.addEventListener('click', function () {
          document.getElementById('left-sidebar').classList.toggle('open');
          document.getElementById('right-sidebar').classList.remove('open');
        });
        document.body.appendChild(tl);
      }
  
      if (!document.getElementById('toggle-right-sidebar')) {
        var tr = document.createElement('button');
        tr.id = 'toggle-right-sidebar';
        tr.className = 'mobile-toggle';
        tr.innerHTML = '⛁';
        tr.setAttribute('aria-label', 'Toggle inventory panel');
        tr.addEventListener('click', function () {
          document.getElementById('right-sidebar').classList.toggle('open');
          document.getElementById('left-sidebar').classList.remove('open');
        });
        document.body.appendChild(tr);
      }
  
      // ---- TOAST CONTAINER ----
      if (!document.getElementById('twp-toast')) {
        var toast = document.createElement('div');
        toast.id = 'twp-toast';
        toast.className = 'twp-toast';
        document.body.appendChild(toast);
      }
    }
  
    function buildPopupMenuItems() {
      return '' +
        '<button class="popup-menu-item" id="pm-saves" aria-label="Save and Load">' +
          '<span class="menu-icon">💾</span>' +
          '<span class="menu-label">Saves</span>' +
          '<span class="menu-hint">Save &amp; Load</span>' +
        '</button>' +
        '<button class="popup-menu-item" id="pm-restart" aria-label="Restart game">' +
          '<span class="menu-icon">⟲</span>' +
          '<span class="menu-label">Restart</span>' +
          '<span class="menu-hint">Start over</span>' +
        '</button>' +
        '<div class="popup-divider"></div>' +
        '<button class="popup-menu-item" id="pm-settings" aria-label="Settings">' +
          '<span class="menu-icon">⚙</span>' +
          '<span class="menu-label">Settings</span>' +
          '<span class="menu-hint">Preferences</span>' +
        '</button>' +
        '<button class="popup-menu-item" id="pm-history-back" aria-label="Go back">' +
          '<span class="menu-icon">◂</span>' +
          '<span class="menu-label">Back</span>' +
          '<span class="menu-hint">Previous passage</span>' +
        '</button>' +
        '<button class="popup-menu-item" id="pm-history-fwd" aria-label="Go forward">' +
          '<span class="menu-icon">▸</span>' +
          '<span class="menu-label">Forward</span>' +
          '<span class="menu-hint">Next passage</span>' +
        '</button>' +
        '<div class="popup-divider"></div>' +
        '<button class="popup-menu-item" id="pm-characters" aria-label="Characters">' +
          '<span class="menu-icon">👤</span>' +
          '<span class="menu-label">Characters</span>' +
          '<span class="menu-hint">Companion info</span>' +
        '</button>' +
        '<a class="popup-menu-item" id="pm-patreon" href="https://www.patreon.com/iamvile26" target="_blank" rel="noopener noreferrer" aria-label="Patreon">' +
          '<span class="menu-icon">🎁</span>' +
          '<span class="menu-label">Patreon</span>' +
          '<span class="menu-hint">Support the game</span>' +
        '</a>' +
        '<button class="popup-menu-item" id="pm-map" aria-label="Map">' +
          '<span class="menu-icon">🗺</span>' +
          '<span class="menu-label">Map</span>' +
          '<span class="menu-hint">World map</span>' +
        '</button>';
    }
  
  
    /* ==========================================================
       SECTION 2: POPUP CONTROLS
       ========================================================== */
  
    function openPopup() {
      var el = document.getElementById('popup-overlay');
      if (el) el.classList.add('open');
    }
  
    function closePopup() {
      var el = document.getElementById('popup-overlay');
      if (el) el.classList.remove('open');
    }

    function openObjectivesPopup() {
      renderObjectivesPanel();
      var el = document.getElementById('objectives-overlay');
      if (el) el.classList.add('open');
    }

    function closeObjectivesPopup() {
      var el = document.getElementById('objectives-overlay');
      if (el) el.classList.remove('open');
    }

    function renderObjectivesPanel() {
      var body = document.getElementById('objectives-body');
      if (!body) return;
      var sv = (typeof State !== 'undefined') ? State.variables : {};
      var mainObjs  = sv.mainObjectives || [];
      var sideQuests = sv.sideQuests    || [];

      var html = '';

      html += '<div class="obj-section-title">Main Objectives</div>';
      if (mainObjs.length === 0) {
        html += '<div class="obj-empty">No active objectives.</div>';
      } else {
        mainObjs.forEach(function (obj) {
          html += '<div class="obj-main-item"><span class="obj-bullet">◈</span><span class="obj-text">' + obj.text + '</span></div>';
        });
      }

      html += '<div class="obj-divider"></div>';
      html += '<div class="obj-section-title">Side Quests</div>';
      if (sideQuests.length === 0) {
        html += '<div class="obj-empty">No active side quests.</div>';
      } else {
        sideQuests.forEach(function (sq) {
          html +=
            '<div class="obj-sidequest">' +
              '<div class="obj-quest-name">' + sq.name + '</div>' +
              '<div class="obj-quest-obj"><span class="obj-arrow">→</span>' + sq.objective + '</div>' +
            '</div>';
        });
      }

      body.innerHTML = html;
    }

    // Keyboard: ESC closes popup
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePopup();
        closeObjectivesPopup();
        closeCompanionPopup();
        var ls = document.getElementById('left-sidebar');
        var rs = document.getElementById('right-sidebar');
        if (ls) ls.classList.remove('open');
        if (rs) rs.classList.remove('open');
      }
    });
  
  
    /* ==========================================================
       SECTION 3: WIRE POPUP MENU TO SUGARCUBE APIs
       ========================================================== */
  
    function wirePopupButtons() {
      // Saves
      var saves = document.getElementById('pm-saves');
      if (saves) saves.addEventListener('click', function () {
        closePopup();
        UI.saves();
      });
  
      // Restart
      var restart = document.getElementById('pm-restart');
      if (restart) restart.addEventListener('click', function () {
        closePopup();
        UI.restart();
      });
  
      // Settings
      var settings = document.getElementById('pm-settings');
      if (settings) settings.addEventListener('click', function () {
        closePopup();
        UI.settings();
      });
  
      // History back
      var hback = document.getElementById('pm-history-back');
      if (hback) hback.addEventListener('click', function () {
        closePopup();
        Engine.backward();
      });
  
      // History forward
      var hfwd = document.getElementById('pm-history-fwd');
      if (hfwd) hfwd.addEventListener('click', function () {
        closePopup();
        Engine.forward();
      });
  
      // Characters — go to passage
      var chars = document.getElementById('pm-characters');
      if (chars) chars.addEventListener('click', function () {
        closePopup();
        if (Story.has('Characters')) Engine.play('Characters');
        else showToast('No Characters page defined', 'danger');
      });
  
      // Patreon — opens in new tab via <a> href natively, no click handler needed
  
      // Map — open the world map popup
      var map = document.getElementById('pm-map');
      if (map) map.addEventListener('click', function () {
        closePopup();
        if (typeof TWP !== 'undefined' && TWP.openMap) TWP.openMap();
        else showToast('Map not available', 'danger');
      });
    }
  
  
    /* ==========================================================
       SECTION 4: SIDEBAR UPDATE FUNCTIONS
       Call these from passages or via macros to update sidebar
       content dynamically.
       ========================================================== */
  
    /* ---- LEFT SIDEBAR: Character Stats ---- */
    window.TWP = window.TWP || {};
  
    TWP.updateCharName = function (name, title) {
      var el = document.getElementById('ls-char-name');
      if (el) el.textContent = name || 'Aldra Vane';
      var tel = document.getElementById('ls-char-title');
      if (tel) tel.textContent = title || '';
    };
  
    TWP.updateDay = function (day, time) {
      var del = document.getElementById('ls-day');
      if (del) del.textContent = 'Day ' + (day || 1);
      var tel = document.getElementById('ls-time');
      if (tel) tel.textContent = time || 'Morning';
    };
  
    /**
     * TWP.updateStats(statsArray)
     * statsArray: [{ label, value, max, current, type }]
     *   type: 'health' | 'stamina' | 'mana' | custom color class
     *
     * Example:
     *   TWP.updateStats([
     *     { label: 'Health', value: '85/100', max: 100, current: 85, type: 'health' },
     *     { label: 'Stamina', value: '60/100', max: 100, current: 60, type: 'stamina' },
     *     { label: 'Coin', value: '42 silver' }
     *   ]);
     */
    TWP.updateStats = function (stats) {
      var container = document.getElementById('ls-stats');
      if (!container) return;
      container.innerHTML = '';
  
      stats.forEach(function (s) {
        var group = document.createElement('div');
        group.className = 'stat-group';
  
        var label = document.createElement('div');
        label.className = 'stat-label';
        label.innerHTML = '<span>' + (s.label || '') + '</span><span class="stat-value">' + (s.value || '') + '</span>';
        group.appendChild(label);
  
        if (s.max != null && s.current != null) {
          var bar = document.createElement('div');
          bar.className = 'stat-bar';
          var fill = document.createElement('div');
          fill.className = 'stat-bar-fill ' + (s.type || '');
          fill.style.width = Math.min(100, Math.max(0, (s.current / s.max) * 100)) + '%';
          bar.appendChild(fill);
          group.appendChild(bar);
        }
  
        container.appendChild(group);
      });
    };
  
    /**
     * TWP.updateNav(items)
     * items: [{ icon, label, passage?, action? }]
     */
    TWP.updateNav = function (items) {
      var container = document.getElementById('ls-nav');
      if (!container) return;
      container.innerHTML = '';
  
      items.forEach(function (item) {
        var el = document.createElement('a');
        el.className = 'left-sidebar-item';
        el.innerHTML = '<span class="sidebar-icon">' + (item.icon || '•') + '</span><span>' + (item.label || '') + '</span>';
  
        if (item.passage) {
          el.href = 'javascript:void(0)';
          el.addEventListener('click', function () {
            Engine.play(item.passage);
          });
        } else if (item.action) {
          el.href = 'javascript:void(0)';
          el.addEventListener('click', item.action);
        }
  
        container.appendChild(el);
      });
    };
  
    /* ---- RIGHT SIDEBAR: Inventory ---- */
  
    /**
     * TWP.updateInventory(sections)
     * sections: [{ title, items: [{ icon, name, count? }] }]
     */
    TWP.updateInventory = function (sections) {
      var container = document.getElementById('rs-inventory');
      if (!container) return;
      container.innerHTML = '';
  
      sections.forEach(function (sec) {
        var section = document.createElement('div');
        section.className = 'inventory-section';
  
        var title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = sec.title || '';
        section.appendChild(title);
  
        (sec.items || []).forEach(function (item) {
          var row = document.createElement('div');
          row.className = 'inventory-item';
          row.innerHTML =
            '<span class="item-icon">' + (item.icon || '•') + '</span>' +
            '<span>' + (item.name || '') + '</span>' +
            (item.count != null ? '<span class="item-count">×' + item.count + '</span>' : '');
          section.appendChild(row);
        });
  
        container.appendChild(section);
      });
    };
  
    /**
     * TWP.updateCompanions(companions)
     * companions: [{ id, name, avatar, bodyImgFrontClothed, bodyImgBackClothed,
     *                bodyImgFrontNude, bodyImgBackNude, inventory, stats }]
     */
    TWP.updateCompanions = function (companions) {
      var container = document.getElementById('rs-companions');
      if (!container) return;
      container.innerHTML = '';

      companions.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'companion-avatar-btn';
        btn.title = c.name || '';

        var wrap = document.createElement('div');
        wrap.className = 'companion-avatar-wrap';
        var img = document.createElement('img');
        img.src = c.avatar || '';
        img.alt = c.name || '';
        img.onerror = function () { this.style.display = 'none'; };
        wrap.appendChild(img);

        var label = document.createElement('div');
        label.className = 'companion-avatar-label';
        label.textContent = c.name || '';

        btn.appendChild(wrap);
        btn.appendChild(label);
        btn.addEventListener('click', function () { openCompanionPopup(c); });
        container.appendChild(btn);
      });
    };

    /* -- Companion Detail Popup -- */

    var compBodyFront    = true;
    var compBodyClothed  = true;
    var currentCompanion = null;

    function ensureCompanionPopup() {
      if (document.getElementById('companion-popup')) return;
      var el = document.createElement('div');
      el.id = 'companion-popup';
      el.className = 'companion-popup-overlay';
      el.innerHTML =
        '<div class="companion-popup-panel">' +
          '<div class="companion-popup-header">' +
            '<span class="companion-popup-name" id="comp-popup-name"></span>' +
            '<button class="companion-popup-close" id="comp-popup-close">✕</button>' +
          '</div>' +
          '<div class="companion-popup-body">' +
            '<div class="comp-body-col">' +
              '<div class="comp-body-img-wrap">' +
                '<img id="comp-body-img" alt="">' +
                '<div class="body-img-unavailable" id="comp-body-unavailable">Not Available</div>' +
              '</div>' +
              '<div class="comp-body-btns">' +
                '<button class="comp-ctrl-btn" id="comp-body-rotate">🔄 Back</button>' +
                '<button class="comp-ctrl-btn" id="comp-body-dress">👗 Undress</button>' +
              '</div>' +
            '</div>' +
            '<div class="comp-info-col">' +
              '<div class="comp-section-title">Inventory</div>' +
              '<div id="comp-inventory" class="comp-inv-list"></div>' +
              '<div class="comp-section-title comp-stats-heading">Stats</div>' +
              '<div id="comp-stats" class="comp-stats-list"></div>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      el.addEventListener('click', function (e) { if (e.target === el) closeCompanionPopup(); });
      document.getElementById('comp-popup-close').addEventListener('click', closeCompanionPopup);
      document.getElementById('comp-body-rotate').addEventListener('click', function () {
        compBodyFront = !compBodyFront;
        updateCompBodyImage();
      });
      document.getElementById('comp-body-dress').addEventListener('click', function () {
        compBodyClothed = !compBodyClothed;
        updateCompBodyImage();
      });
    }

    function updateCompBodyImage() {
      var img = document.getElementById('comp-body-img');
      if (!img || !currentCompanion) return;
      var ph = document.getElementById('comp-body-unavailable');
      var propMap = {
        front_clothed: 'bodyImgFrontClothed',
        front_nude:    'bodyImgFrontNude',
        back_clothed:  'bodyImgBackClothed',
        back_nude:     'bodyImgBackNude',
      };
      var key = (compBodyFront ? 'front' : 'back') + '_' + (compBodyClothed ? 'clothed' : 'nude');
      var src = currentCompanion[propMap[key]] || '';
      img.style.display = src ? '' : 'none';
      if (ph) ph.style.display = src ? 'none' : 'flex';
      if (src) {
        img.onerror = function () { this.style.display = 'none'; if (ph) ph.style.display = 'flex'; };
        img.onload  = function () { this.style.display = '';     if (ph) ph.style.display = 'none'; };
        img.src = src;
      }
      var rotBtn   = document.getElementById('comp-body-rotate');
      var dressBtn = document.getElementById('comp-body-dress');
      if (rotBtn)   rotBtn.textContent   = compBodyFront   ? '🔄 Back'    : '🔄 Front';
      if (dressBtn) dressBtn.textContent = compBodyClothed ? '👗 Undress' : '👗 Dress';
    }

    function openCompanionPopup(c) {
      ensureCompanionPopup();
      currentCompanion = c;
      compBodyFront   = true;
      compBodyClothed = true;

      var nameEl = document.getElementById('comp-popup-name');
      if (nameEl) nameEl.textContent = c.name || '';

      updateCompBodyImage();

      // Render inventory grouped by category
      var invEl = document.getElementById('comp-inventory');
      if (invEl) {
        invEl.innerHTML = '';
        var groups = {};
        (c.inventory || []).forEach(function (item) {
          var cat = item.category || 'Items';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
        });
        Object.keys(groups).forEach(function (cat) {
          var catTitle = document.createElement('div');
          catTitle.className = 'comp-cat-title';
          catTitle.textContent = cat;
          invEl.appendChild(catTitle);
          groups[cat].forEach(function (item) {
            var row = document.createElement('div');
            row.className = 'comp-inv-item';
            row.innerHTML =
              '<span class="comp-item-icon">' + (item.icon || '•') + '</span>' +
              '<div class="comp-item-info">' +
                '<span class="comp-item-name">' + (item.name || '') + '</span>' +
                (item.desc ? '<span class="comp-item-desc">' + item.desc + '</span>' : '') +
              '</div>' +
              (item.count != null ? '<span class="comp-item-count">×' + item.count + '</span>' : '');
            invEl.appendChild(row);
          });
        });
      }

      // Render stats bars — affection is always read live from c.affection
      var statsEl = document.getElementById('comp-stats');
      if (statsEl) {
        statsEl.innerHTML = '';

        // Build display list: affection first (if companion has it), then any extra static stats
        var displayStats = [];
        if (c.affection != null) {
          displayStats.push({ label: 'Affection', type: 'affection', current: c.affection, max: 100 });
        }
        (c.stats || []).forEach(function (s) { displayStats.push(s); });

        displayStats.forEach(function (s) {
          var row = document.createElement('div');
          row.className = 'rs-stat-row';
          var top = document.createElement('div');
          top.className = 'rs-stat-label-row';
          top.innerHTML =
            '<span class="rs-stat-label">' + s.label + '</span>' +
            '<span class="rs-stat-val">' + s.current + '/' + s.max + '</span>';
          row.appendChild(top);
          var bar = document.createElement('div');
          bar.className = 'rs-stat-bar';
          var fill = document.createElement('div');
          fill.className = 'rs-stat-fill rs-' + s.type;
          fill.style.width = Math.min(100, Math.max(0, (s.current / s.max) * 100)) + '%';
          bar.appendChild(fill);
          row.appendChild(bar);
          statsEl.appendChild(row);
        });
      }

      document.getElementById('companion-popup').classList.add('open');
    }

    function closeCompanionPopup() {
      var el = document.getElementById('companion-popup');
      if (el) el.classList.remove('open');
      currentCompanion = null;
    }
  
    TWP.updateRightStats = function (stats) {
      var container = document.getElementById('rs-stats');
      if (!container) return;
      container.innerHTML = '';
      stats.forEach(function (s) {
        var row = document.createElement('div');
        row.className = 'rs-stat-row';
        var top = document.createElement('div');
        top.className = 'rs-stat-label-row';
        top.innerHTML =
          '<span class="rs-stat-label">' + s.label + '</span>' +
          '<span class="rs-stat-val">' + s.current + '/' + s.max + '</span>';
        row.appendChild(top);
        var bar = document.createElement('div');
        bar.className = 'rs-stat-bar';
        var fill = document.createElement('div');
        fill.className = 'rs-stat-fill rs-' + s.type;
        fill.style.width = Math.min(100, Math.max(0, (s.current / s.max) * 100)) + '%';
        bar.appendChild(fill);
        row.appendChild(bar);
        container.appendChild(row);
      });
    };
  
  
    /* ==========================================================
       SECTION 4b: OBJECTIVES API
       Manage $mainObjectives and $sideQuests story variables,
       then re-render the objectives panel if it is open.
       ========================================================== */

    TWP.addMainObjective = function (id, text) {
      var sv = State.variables;
      if (!sv.mainObjectives) sv.mainObjectives = [];
      var exists = sv.mainObjectives.some(function (o) { return o.id === id; });
      if (!exists) sv.mainObjectives.push({ id: id, text: text });
    };

    TWP.removeMainObjective = function (id) {
      var sv = State.variables;
      if (!sv.mainObjectives) return;
      sv.mainObjectives = sv.mainObjectives.filter(function (o) { return o.id !== id; });
    };

    TWP.updateMainObjective = function (id, text) {
      var sv = State.variables;
      if (!sv.mainObjectives) return;
      var obj = sv.mainObjectives.find(function (o) { return o.id === id; });
      if (obj) obj.text = text;
    };

    TWP.addSideQuest = function (id, name, objective) {
      var sv = State.variables;
      if (!sv.sideQuests) sv.sideQuests = [];
      var exists = sv.sideQuests.some(function (q) { return q.id === id; });
      if (!exists) sv.sideQuests.push({ id: id, name: name, objective: objective });
    };

    TWP.removeSideQuest = function (id) {
      var sv = State.variables;
      if (!sv.sideQuests) return;
      sv.sideQuests = sv.sideQuests.filter(function (q) { return q.id !== id; });
    };

    TWP.updateSideQuestObjective = function (id, objective) {
      var sv = State.variables;
      if (!sv.sideQuests) return;
      var sq = sv.sideQuests.find(function (q) { return q.id === id; });
      if (sq) sq.objective = objective;
    };

    /**
     * TWP.statChange(label, delta, icon, type)
     *
     * label  — stat name, e.g. "Health", "Mira Affection"
     * delta  — number (positive = gain, negative = loss) OR pre-formatted string "+5" / "-10"
     * icon   — optional emoji, e.g. "❤" (falls back to +/- arrow)
     * type   — optional color hint: "health" | "stamina" | "mana" | "mood" |
     *           "relationship" | "currency" | "positive" | "negative"
     *          (auto-determined from delta sign if omitted)
     */
    TWP.statChange = function (label, delta, icon, type) {
      var container = document.getElementById('stat-notif-container');
      if (!container) return;

      var numericDelta = parseFloat(delta);
      var isPositive   = isNaN(numericDelta) ? String(delta).charAt(0) !== '-' : numericDelta >= 0;

      var displayDelta;
      if (!isNaN(numericDelta)) {
        displayDelta = (isPositive ? '+' : '') + numericDelta;
      } else {
        displayDelta = String(delta);
      }

      // Resolve CSS type class
      var typeClass;
      if (type) {
        typeClass = 'sn-' + type;
      } else {
        typeClass = isPositive ? 'sn-positive' : 'sn-negative';
      }

      var deltaClass = isPositive ? 'sn-gain' : 'sn-loss';

      var card = document.createElement('div');
      card.className = 'stat-notif ' + typeClass;
      card.innerHTML =
        (icon ? '<span class="sn-icon">' + icon + '</span>' : '') +
        '<span class="sn-label">' + label + '</span>' +
        '<span class="sn-delta ' + deltaClass + '">' + displayDelta + '</span>';

      container.appendChild(card);

      // Slide in (next frame so transition fires)
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          card.classList.add('sn-visible');
        });
      });

      // Fade out after 4.2s, remove after 5s
      setTimeout(function () { card.classList.add('sn-exit'); }, 4200);
      setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 5000);
    };

    /**
     * TWP.syncAllStats(sv)
     * Refreshes both sidebars from current story variables.
     * Called automatically by <<changestat>>.
     */
    TWP.syncAllStats = function (sv) {
      // Left sidebar — health / stamina / mana / coin
      var leftStats = [];
      if (sv.health != null || sv.maxHealth != null) {
        var mH = sv.maxHealth != null ? sv.maxHealth : 100;
        var cH = sv.health    != null ? sv.health    : 0;
        leftStats.push({ label: 'Health', value: cH + '/' + mH, max: mH, current: cH, type: 'health' });
      }
      if (sv.stamina != null || sv.maxStamina != null) {
        var mS = sv.maxStamina != null ? sv.maxStamina : 100;
        var cS = sv.stamina    != null ? sv.stamina    : 0;
        leftStats.push({ label: 'Stamina', value: cS + '/' + mS, max: mS, current: cS, type: 'stamina' });
      }
      if (sv.mana != null || sv.maxMana != null) {
        var mM = sv.maxMana != null ? sv.maxMana : 100;
        var cM = sv.mana    != null ? sv.mana    : 0;
        leftStats.push({ label: 'Mana', value: cM + '/' + mM, max: mM, current: cM, type: 'mana' });
      }
      if (sv.coin != null) {
        leftStats.push({ label: 'Coin', value: sv.coin + ' silver' });
      }
      if (leftStats.length) TWP.updateStats(leftStats);

      // Right sidebar — energy / strength / mood
      syncRightStats(sv);
    };


    /* ==========================================================
       SECTION 5: TOAST NOTIFICATION
       ========================================================== */
  
    var toastTimeout = null;
  
    function showToast(message, type, duration) {
      var el = document.getElementById('twp-toast');
      if (!el) return;
  
      el.textContent = message;
      el.className = 'twp-toast show toast-' + (type || 'info');
  
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(function () {
        el.classList.remove('show');
      }, duration || 3000);
    }
  
    TWP.toast = showToast;
  
  
    /* ==========================================================
       SECTION 6: SUGARCUBE MACROS
       ========================================================== */
  
    /* ----- <<dialog>> macro -----
       Usage:
         <<dialog "Aldra">>
           What she says here.
         <</dialog>>
  
         <<dialog "Mira" "portrait">>
           With a portrait circle.
         <</dialog>>
  
         <<dialog "narrator">>
           Narration text.
         <</dialog>>
  
         <<dialog "Aldra" "thought">>
           Internal thought, italic & dashed border.
         <</dialog>>
    */
    Macro.add('dialog', {
      tags: null,
      handler: function () {
        var speaker = this.args[0] || 'default';
        var variant = this.args[1] || ''; // 'portrait' or 'thought'
        var speakerKey = speaker.toLowerCase().replace(/[^a-z]/g, '');
  
        // Build container
        var container = document.createElement('div');
        var classes = ['dialog-container', 'speaker-' + speakerKey];
  
        if (variant === 'thought') classes.push('dialog-thought');
        if (variant === 'portrait') classes.push('has-portrait');
  
        container.className = classes.join(' ');
  
        // Portrait
        if (variant === 'portrait') {
          var portrait = document.createElement('div');
          portrait.className = 'dialog-portrait';
          // Default emoji portraits per character
          var portraits = {
            aldra: '⚔',
            aldric: '⚔',
            mira: '🏹',
            edric: '🗻',
            ysolde: '🧪',
            sera: '🌿',
            lorn: '🛡',
            vex: '⚗',
            kael: '✨'
          };
          portrait.textContent = portraits[speakerKey] || '💬';
          container.appendChild(portrait);
        }
  
        // Speaker name tag (not for narrator)
        if (speakerKey !== 'narrator') {
          var nameTag = document.createElement('div');
          nameTag.className = 'dialog-speaker speaker-' + speakerKey;
          nameTag.textContent = speaker;
          container.appendChild(nameTag);
        }
  
        // Right-corner character image (not for narrator or thought)
        if (speakerKey !== 'narrator' && variant !== 'thought') {
          var imgWrap = document.createElement('div');
          imgWrap.className = 'dialog-char-img';
          var charImg = document.createElement('img');
          charImg.src = 'img/characters/' + speakerKey + '/avatar.png';
          charImg.alt = speaker;
          charImg.onerror = function () { imgWrap.style.display = 'none'; };
          imgWrap.appendChild(charImg);
          container.appendChild(imgWrap);
          container.classList.add('has-char-img');
        }
  
        // Dialog text
        var textDiv = document.createElement('div');
        textDiv.className = 'dialog-text';
        container.appendChild(textDiv);
  
        // Render TwineScript payload into the text div
        new Wikifier(textDiv, this.payload[0].contents.trim());
  
        // Output
        this.output.appendChild(container);
      }
    });
  
  
    /* ----- <<pick>> macro -----
       Styled choice button that links to a passage.
       (Named <<pick>> because <<choice>> is a built-in SugarCube macro)
  
       Usage:
         <<pick "Go to the tavern" "TavernPassage">>
         <<pick "Fight the troll" "TrollFight" "danger">>
    */
    Macro.add('pick', {
      handler: function () {
        var label = this.args[0] || 'Continue';
        var passage = this.args[1] || null;
        var style = this.args[2] || '';
  
        var btn = document.createElement('button');
        btn.className = 'macro-choice-btn' + (style ? ' choice-' + style : '');
        btn.textContent = label;
  
        if (passage) {
          btn.addEventListener('click', function () {
            Engine.play(passage);
          });
        }
  
        this.output.appendChild(btn);
      }
    });
  
  
    /* ----- <<toast>> macro -----
       Show a toast notification.
  
       Usage:
         <<toast "Item acquired!" "success">>
         <<toast "You lost 5 health" "danger">>
         <<toast "Quest updated" "gold">>
         <<toast "New area discovered" "info" 5000>>
    */
    Macro.add('toast', {
      handler: function () {
        var message = this.args[0] || '';
        var type = this.args[1] || 'info';
        var duration = this.args[2] || 3000;
        showToast(message, type, duration);
      }
    });
  
  
    /* ----- <<scene>> macro -----
       Inserts a decorative scene break.
  
       Usage:
         <<scene>>
    */
    Macro.add('scene', {
      handler: function () {
        var div = document.createElement('div');
        div.className = 'scene-break';
        this.output.appendChild(div);
      }
    });
  
  
    /* ----- <<updatestats>> macro -----
       Quick stat update from TwineScript.
  
       Usage:
         <<updatestats>>
       (Reads $health, $maxHealth, $stamina, $maxStamina, $coin from State)
    */
    Macro.add('updatestats', {
      handler: function () {
        var sv = State.variables;
        var stats = [];
  
        if (sv.maxHealth) {
          stats.push({
            label: 'Health',
            value: (sv.health || 0) + '/' + sv.maxHealth,
            max: sv.maxHealth,
            current: sv.health || 0,
            type: 'health'
          });
        }
  
        if (sv.maxStamina) {
          stats.push({
            label: 'Stamina',
            value: (sv.stamina || 0) + '/' + sv.maxStamina,
            max: sv.maxStamina,
            current: sv.stamina || 0,
            type: 'stamina'
          });
        }
  
        if (sv.maxMana) {
          stats.push({
            label: 'Mana',
            value: (sv.mana || 0) + '/' + sv.maxMana,
            max: sv.maxMana,
            current: sv.mana || 0,
            type: 'mana'
          });
        }
  
        if (sv.coin != null) {
          stats.push({ label: 'Coin', value: sv.coin + ' silver' });
        }
  
        if (sv.day != null) {
          TWP.updateDay(sv.day, sv.timeOfDay || 'Morning');
        }
  
        if (sv.charName) {
          TWP.updateCharName(sv.charName, sv.charTitle || '');
        }
  
        TWP.updateStats(stats);
      }
    });
  
  
    /* ----- <<updateinventory>> macro -----
       Reads $inventory (array of { icon, name, count, category }) from State.
  
       Usage:
         <<updateinventory>>
    */
    Macro.add('updateinventory', {
      handler: function () {
        var sv = State.variables;
        var inv = sv.inventory || [];
  
        // Group by category
        var groups = {};
        inv.forEach(function (item) {
          var cat = item.category || 'Items';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
        });
  
        var sections = [];
        Object.keys(groups).forEach(function (cat) {
          sections.push({ title: cat, items: groups[cat] });
        });
  
        TWP.updateInventory(sections);
  
        // Companions
        if (sv.companions) {
          TWP.updateCompanions(sv.companions);
        }
      }
    });
  
  
    /* ----- <<popup>> macro -----
       Opens or closes the game menu popup.
  
       Usage:
         <<popup open>>
         <<popup close>>
    */
    Macro.add('popup', {
      handler: function () {
        var action = this.args[0] || 'open';
        if (action === 'open') openPopup();
        else closePopup();
      }
    });
  
  
    /* ----- Objectives macros -----
       Manage $mainObjectives and $sideQuests from TwineScript.

       Usage:
         <<addobjective "find_vex" "Track down Vex and find the antidote">>
         <<updateobjective "find_vex" "Vex went south — ask Sera for leads">>
         <<removeobjective "find_vex">>

         <<addsidequest "barmaids_eye" "The Barmaid's Eye" "Return to the Broken Antler">>
         <<updatesidequest "barmaids_eye" "See what Tess notices about the changes">>
         <<removesidequest "barmaids_eye">>
    */
    Macro.add('addobjective', {
      handler: function () {
        TWP.addMainObjective(this.args[0], this.args[1]);
      }
    });

    Macro.add('removeobjective', {
      handler: function () {
        TWP.removeMainObjective(this.args[0]);
      }
    });

    Macro.add('updateobjective', {
      handler: function () {
        TWP.updateMainObjective(this.args[0], this.args[1]);
      }
    });

    Macro.add('addsidequest', {
      handler: function () {
        TWP.addSideQuest(this.args[0], this.args[1], this.args[2]);
      }
    });

    Macro.add('removesidequest', {
      handler: function () {
        TWP.removeSideQuest(this.args[0]);
      }
    });

    Macro.add('updatesidequest', {
      handler: function () {
        TWP.updateSideQuestObjective(this.args[0], this.args[1]);
      }
    });


    /* ----- <<changestat>> macro -----
       Changes a $variable, refreshes both sidebars, and shows a
       5-second notification — all in one macro.

       Core stats (mapped to story variables):
         "health"   → $health   (clamped 0–$maxHealth,   default max 100)
         "energy"   → $energy   (clamped 0–$maxEnergy,   default max 100)
         "mood"     → $mood     (clamped 0–$maxMood,     default max 100)
         "strength" → $strength (clamped 0–$maxStrength, default max 100)
         "coin"     → $coin     (clamped 0–∞)

       Companion affection (use companion id from $companions):
         "mira"  → $companions[?].affection  (clamped 0–100)

       Usage:
         <<changestat "health"   -15>>
         <<changestat "energy"    20>>
         <<changestat "mood"      -5>>
         <<changestat "strength"  10>>
         <<changestat "coin"      -3>>
         <<changestat "mira"       5>>
    */
    Macro.add('changestat', {
      handler: function () {
        var key   = String(this.args[0] || '').toLowerCase();
        var delta = Number(this.args[1]) || 0;
        var sv    = State.variables;

        var coreCfg = {
          health:   { varKey: 'health',   maxKey: 'maxHealth',   icon: '❤',  type: 'health',   label: 'Health'   },
          energy:   { varKey: 'energy',   maxKey: 'maxEnergy',   icon: '⚡', type: 'energy',   label: 'Energy'   },
          mood:     { varKey: 'mood',     maxKey: 'maxMood',     icon: '✨', type: 'mood',     label: 'Mood'     },
          strength: { varKey: 'strength', maxKey: 'maxStrength', icon: '💪', type: 'strength', label: 'Strength' },
          coin:     { varKey: 'coin',     maxKey: null,          icon: '🪙', type: 'currency', label: 'Coin'     }
        };

        var cfg = coreCfg[key];
        if (cfg) {
          var cur = sv[cfg.varKey] != null ? Number(sv[cfg.varKey]) : 0;
          var max = cfg.maxKey ? (sv[cfg.maxKey] != null ? Number(sv[cfg.maxKey]) : 100) : Infinity;
          sv[cfg.varKey] = Math.min(max, Math.max(0, cur + delta));
          TWP.syncAllStats(sv);
          TWP.statChange(cfg.label, delta, cfg.icon, cfg.type);
        } else {
          var companions = sv.companions || [];
          var comp = companions.find(function (c) {
            return c.id === key || c.name.toLowerCase() === key;
          });
          if (comp) {
            if (comp.affection == null) comp.affection = 50;
            comp.affection = Math.min(100, Math.max(0, comp.affection + delta));
            TWP.updateCompanions(companions);
            TWP.statChange(comp.name + ' Affection', delta, delta >= 0 ? '💚' : '💔', 'relationship');
          } else {
            this.error('<<changestat>>: unknown stat or companion id "' + this.args[0] + '"');
          }
        }
      }
    });


    /* ----- <<grab>> macro -----
       Wraps content in a grabbable-cursor container.

       Usage:
         <<grab>>This text has grab cursor<</grab>>
    */
    Macro.add('grab', {
      tags: null,
      handler: function () {
        var span = document.createElement('span');
        span.className = 'grabbable';
        new Wikifier(span, this.payload[0].contents.trim());
        this.output.appendChild(span);
      }
    });
  
  
    /* ==========================================================
       SECTION 7: INITIALIZATION
       ========================================================== */

    var bodyFront   = true;
    var bodyClothed = true;

    function updateBodyImage() {
      var img = document.getElementById('ls-body-img');
      if (!img) return;
      var ph = document.getElementById('ls-body-unavailable');
      var sv = (typeof State !== 'undefined') ? State.variables : {};
      var paths = {
        front_clothed: sv.bodyImgFrontClothed || '',
        back_clothed:  sv.bodyImgBackClothed  || '',
        front_nude:    sv.bodyImgFrontNude    || '',
        back_nude:     sv.bodyImgBackNude     || '',
      };
      var key = (bodyFront ? 'front' : 'back') + '_' + (bodyClothed ? 'clothed' : 'nude');
      var src = paths[key];
      img.style.display = src ? '' : 'none';
      if (ph) ph.style.display = src ? 'none' : 'flex';
      if (src) {
        img.onerror = function () { this.style.display = 'none'; if (ph) ph.style.display = 'flex'; };
        img.onload  = function () { this.style.display = '';     if (ph) ph.style.display = 'none'; };
        img.src = src;
      }
      var rotBtn   = document.getElementById('ls-body-rotate');
      var dressBtn = document.getElementById('ls-body-dress');
      if (rotBtn)   rotBtn.textContent   = bodyFront   ? '🔄 Back'    : '🔄 Front';
      if (dressBtn) dressBtn.textContent = bodyClothed ? '👗 Undress' : '👗 Dress';
    }

    function syncRightStats(sv) {
      TWP.updateRightStats([
        { label: 'Health', type: 'health', current: sv.health != null ? sv.health : sv.maxHealth || 100, max: sv.maxHealth || 100 },
        { label: 'Energy', type: 'energy', current: sv.energy != null ? sv.energy : sv.maxEnergy || 100, max: sv.maxEnergy || 100 },
        { label: 'Mood',   type: 'mood',   current: sv.mood   != null ? sv.mood   : sv.maxMood   || 100, max: sv.maxMood   || 100 },
      ]);
    }

    /* ==========================================================
       SECTION 8a: INTRO / CONTENT-WARNING POPUPS
       Shown once on first launch (localStorage flag).
       Not shown on save-load or page reload after first acceptance.
       ========================================================== */

    function buildIntroWarningPopup() {
      var el = document.createElement('div');
      el.id    = 'intro-warning-overlay';
      el.className = 'intro-overlay';
      el.innerHTML =
        '<div class="intro-panel">' +
          '<div class="intro-age-badge">18+</div>' +
          '<div class="intro-warning-title">Content Warning</div>' +
          '<div class="intro-body">' +
            '<p>This game contains adult themes, including:</p>' +
            '<ul>' +
              '<li>Gender transformation</li>' +
              '<li>Sexual content and nudity</li>' +
              '<li>Mature, explicit storytelling</li>' +
            '</ul>' +
            '<p>You must be <strong>18 or older</strong> to continue.<br>' +
            'If you are under 18 or uncomfortable with these themes, please leave now.</p>' +
          '</div>' +
          '<div class="intro-btn-row">' +
            '<button class="intro-btn intro-btn-leave" id="intro-leave-btn">Leave</button>' +
            '<button class="intro-btn intro-btn-accept" id="intro-accept-btn">I Understand - Continue</button>' +
          '</div>' +
        '</div>';
      return el;
    }

    function buildIntroWorldPopup() {
      var el = document.createElement('div');
      el.id    = 'intro-world-overlay';
      el.className = 'intro-overlay';
      el.innerHTML =
        '<div class="intro-panel">' +
          '<div class="intro-game-title">The Long Hunt</div>' +
          '<div class="intro-game-subtitle">A Tale of Transformation</div>' +
          '<div class="intro-body">' +
            '<p><em>Valdmere. Year 412 of the Second Compact.</em></p>' +
            '<p>A bad job. A worse injury. A healer in the dark who gave <strong>Aldric</strong> a vial and smiled ' +
            'like she knew something he didn\'t.</p>' +
            '<p>By morning, his skin was softer. By Day 3, his waist had pulled in. ' +
            'By Day 7, the mirror stopped lying.</p>' +
            '<p>His partner <strong>Mira</strong> is the only one who knows. ' +
            'Somewhere out there is an alchemist with the only antidote that might exist. ' +
            '<strong>30 days</strong> before this becomes permanent.</p>' +
            '<p>Whether Aldric still wants it reversed by the time he finds her - that\'s another question.</p>' +
          '</div>' +
          '<div class="intro-btn-row">' +
            '<button class="intro-btn intro-btn-enter" id="intro-enter-btn">Begin</button>' +
          '</div>' +
        '</div>';
      return el;
    }

    function showIntroPopups() {
      // Show only on the first passage (new game, restart, or reload while on start passage).
      // State.length > 1 means the player has progressed past the start — skip popups.
      if (typeof State !== 'undefined' && State.length > 1) return;

      var w1 = buildIntroWarningPopup();
      var w2 = buildIntroWorldPopup();
      document.body.appendChild(w1);
      document.body.appendChild(w2);

      // Leave — navigate away
      document.getElementById('intro-leave-btn').addEventListener('click', function () {
        window.location.href = 'https://www.google.com';
      });

      // Accept warning → fade out, show world intro
      document.getElementById('intro-accept-btn').addEventListener('click', function () {
        w1.classList.remove('intro-visible');
        setTimeout(function () {
          w1.style.display = 'none';
          w2.classList.add('intro-visible');
        }, 380);
      });

      // Enter game → fade out and remove
      document.getElementById('intro-enter-btn').addEventListener('click', function () {
        w2.classList.remove('intro-visible');
        setTimeout(function () {
          if (w2.parentNode) w2.parentNode.removeChild(w2);
          if (w1.parentNode) w1.parentNode.removeChild(w1);
        }, 380);
      });

      // Show first popup after a short frame delay
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          w1.classList.add('intro-visible');
        });
      });
    }


    // Build DOM scaffolding on :storyready
    $(document).on(':storyready', function () {
      buildScaffolding();
      wirePopupButtons();
      showIntroPopups();

      // Wire body viewer buttons
      var bRotate = document.getElementById('ls-body-rotate');
      var bDress  = document.getElementById('ls-body-dress');
      if (bRotate) bRotate.addEventListener('click', function () {
        bodyFront = !bodyFront;
        if (typeof State !== 'undefined') State.variables.bodyFront = bodyFront;
        updateBodyImage();
      });
      if (bDress) bDress.addEventListener('click', function () {
        bodyClothed = !bodyClothed;
        if (typeof State !== 'undefined') State.variables.bodyClothed = bodyClothed;
        updateBodyImage();
      });

      // Initialize sidebar from story variables (set in StoryInit)
      var sv = State.variables;
      if (sv.charName) TWP.updateCharName(sv.charName, sv.charTitle);
      TWP.updateDay(sv.day, sv.timeOfDay);
      syncRightStats(sv);
      if (sv.bodyFront   !== undefined) bodyFront   = sv.bodyFront;
      if (sv.bodyClothed !== undefined) bodyClothed = sv.bodyClothed;
      updateBodyImage();
  
      // Initialize inventory
      if (sv.inventory) {
        var inv = sv.inventory;
        var groups = {};
        inv.forEach(function (item) {
          var cat = item.category || 'Items';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
        });
        var sections = [];
        Object.keys(groups).forEach(function (cat) {
          sections.push({ title: cat, items: groups[cat] });
        });
        TWP.updateInventory(sections);
      }
      if (sv.companions) TWP.updateCompanions(sv.companions);
    });
  
    // Re-render sidebars on passage display
    $(document).on(':passagedisplay', function () {
      // Scroll to top instantly on every passage change
      window.scrollTo(0, 0);
      var story = document.getElementById('story');
      if (story) story.scrollTop = 0;

      // Close mobile sidebars on navigation
      var ls = document.getElementById('left-sidebar');
      var rs = document.getElementById('right-sidebar');
      if (ls) ls.classList.remove('open');
      if (rs) rs.classList.remove('open');
  
      // Auto-sync day/time, right stats, and body viewer from story variables on every passage
      var sv = State.variables;
      TWP.updateDay(sv.day, sv.timeOfDay);
      syncRightStats(sv);
      if (sv.bodyFront   !== undefined) bodyFront   = sv.bodyFront;
      if (sv.bodyClothed !== undefined) bodyClothed = sv.bodyClothed;
      updateBodyImage();
  
      // Auto-sync inventory
      if (sv.inventory) {
        var inv = sv.inventory;
        var groups = {};
        inv.forEach(function (item) {
          var cat = item.category || 'Items';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
        });
        var sections = [];
        Object.keys(groups).forEach(function (cat) {
          sections.push({ title: cat, items: groups[cat] });
        });
        TWP.updateInventory(sections);
      }
  
      // Auto-sync companions
      if (sv.companions) {
        TWP.updateCompanions(sv.companions);
      }
    });
  
  
    /* ==========================================================
       SECTION 8: DRAG SUPPORT (for .grabbable elements)
       Adds grabbing cursor class while mouse is down
       ========================================================== */
  
    document.addEventListener('mousedown', function (e) {
      var target = e.target.closest('.grabbable, [data-grab]');
      if (target) {
        target.classList.add('grabbing');
        document.body.classList.add('grabbing');
      }
    });
  
    document.addEventListener('mouseup', function () {
      document.querySelectorAll('.grabbing').forEach(function (el) {
        el.classList.remove('grabbing');
      });
      document.body.classList.remove('grabbing');
    });
  
  
  })();