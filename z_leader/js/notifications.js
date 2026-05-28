'use strict';

const Notifications = {
  maxVisible: 6,

  ICONS: {
    war:       '⚔️',
    alliance:  '🤝',
    peace:     '🕊️',
    warning:   '⚠️',
    danger:    '💸',
    info:      '📢',
    milestone: '🏆',
    year:      '📅',
    event:     '🌐',
  },

  show(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notifications');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `notif notif-${type}`;
    const icon = this.ICONS[type] || '📢';
    el.innerHTML = `<span class="notif-icon">${icon}</span><span class="notif-text">${message}</span>`;
    container.appendChild(el);

    const all = container.querySelectorAll('.notif');
    if (all.length > this.maxVisible) this._dismiss(all[0]);

    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('notif-visible')));
    setTimeout(() => this._dismiss(el), duration);

    EventLog.add(message, type);
  },

  _dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.remove('notif-visible');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  },
};

const EventLog = {
  entries: [],
  maxEntries: 40,

  add(message, type) {
    // Strip HTML tags for log display
    const clean = message.replace(/<[^>]+>/g, '');
    this.entries.unshift({
      text: clean,
      type,
      year: (typeof GameState !== 'undefined') ? GameState.year : '—',
      quarter: (typeof GameState !== 'undefined') ? GameState.quarter : '—',
    });
    if (this.entries.length > this.maxEntries) this.entries.pop();
    this._render();
  },

  _render() {
    const el = document.getElementById('event-log-entries');
    if (!el) return;
    if (this.entries.length === 0) {
      el.innerHTML = '<div class="log-empty">No events yet.</div>';
      return;
    }
    el.innerHTML = this.entries.map(e =>
      `<div class="log-entry log-${e.type}">
        <span class="log-date">${e.year} Q${e.quarter}</span>
        <span class="log-msg">${e.text}</span>
      </div>`
    ).join('');
  },
};
