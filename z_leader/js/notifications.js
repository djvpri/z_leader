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

    // Trim oldest if over limit
    const all = container.querySelectorAll('.notif');
    if (all.length > this.maxVisible) this._dismiss(all[0]);

    // Animate in (double rAF ensures transition triggers)
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('notif-visible')));

    setTimeout(() => this._dismiss(el), duration);
  },

  _dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.remove('notif-visible');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  },
};
