/* Site locale (no / en) — localStorage + data-i18n */
(function () {
  'use strict';

  var KEY = 'proslides-overview-locale';
  var DEFAULT = 'no';
  var SUPPORTED = ['no', 'en'];

  var META_KEY_EN = {
    Auth: 'Auth',
    Relasjoner: 'Relations',
    Migration: 'Migration',
    PK: 'PK',
    Indekser: 'Indexes',
    Payload: 'Payload',
    Concern: 'Concern',
    Felt: 'Fields',
    Type: 'Type',
    Stemme: 'Vote',
    Broadcast: 'Broadcast',
    Endepunkt: 'Endpoint',
    Transaksjon: 'Transaction',
    Normalizer: 'Normalizer',
    Trigger: 'Trigger',
    Algoritme: 'Algorithm',
    TTL: 'TTL',
    Secret: 'Secret',
    Mount: 'Mount',
    Health: 'Health',
    'Catch-all': 'Catch-all',
    Providers: 'Providers',
    Env: 'Env',
    Tabeller: 'Tables',
    Reset: 'Reset',
    Kommandoer: 'Commands',
    Antall: 'Count',
    Verktøy: 'Tool',
    Helper: 'Helper',
    Host: 'Host',
    Dev: 'Dev',
    Prod: 'Prod',
    Hovedfil: 'Main file',
    Routing: 'Routing',
    Providers: 'Providers',
    URL: 'URL',
    Komponent: 'Component',
    Nei: 'No',
    Ja: 'Yes',
    Handling: 'Action',
    'E-post': 'Email',
    OAuth: 'OAuth',
    Lagring: 'Storage',
    API: 'API',
    Delete: 'Delete',
    Create: 'Create',
    Edit: 'Edit',
    Profil: 'Profile',
    Passord: 'Password',
    Modell: 'Model',
    Event: 'Event',
    Status: 'Status',
    Token: 'Token',
    Gjest: 'Guest',
    Innlogget: 'Logged in',
    Sti: 'Path',
    Entrypoint: 'Entrypoint',
    App: 'App'
  };

  function storedLocale() {
    try {
      var s = localStorage.getItem(KEY);
      if (SUPPORTED.indexOf(s) !== -1) return s;
    } catch (_) {}
    return DEFAULT;
  }

  function strings() {
    return (window.ProSlidesI18nData && window.ProSlidesI18nData[locale()]) || {};
  }

  function locale() {
    return document.documentElement.getAttribute('data-locale') || DEFAULT;
  }

  function t(key, fallback) {
    var s = strings();
    if (s && Object.prototype.hasOwnProperty.call(s, key)) return s[key];
    if (fallback !== undefined) return fallback;
    var parts = key.split('.');
    var alt = window.ProSlidesI18nData && window.ProSlidesI18nData.no;
    return (alt && alt[key]) || key;
  }

  function nodeDesc(node) {
    if (!node) return '';
    var title = node.getAttribute('data-node-title') || '';
    if (locale() === 'en') {
      var enMap = window.ARCH_NODE_DESC_EN || {};
      if (enMap[title]) return enMap[title];
      return node.getAttribute('data-node-desc-en') || node.getAttribute('data-node-desc') || '';
    }
    return node.getAttribute('data-node-desc') || '';
  }

  function translateMetaKey(key) {
    if (locale() === 'en' && META_KEY_EN[key]) return META_KEY_EN[key];
    return key;
  }

  function journeyMeta() {
    if (locale() === 'en' && window.JOURNEY_NODE_META_EN) return window.JOURNEY_NODE_META_EN;
    return window.JOURNEY_NODE_META || {};
  }

  function applyMeta() {
    var loc = locale();
    document.documentElement.lang = loc === 'en' ? 'en' : 'no';
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute('content', loc === 'en' ? 'en_US' : 'nb_NO');
    document.title = t('meta.title', document.title);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description', desc.getAttribute('content')));
    var ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute('content', t('meta.ogTitle', ogt.getAttribute('content')));
    var ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute('content', t('meta.ogDescription', ogd.getAttribute('content')));
    var twt = document.querySelector('meta[name="twitter:title"]');
    if (twt) twt.setAttribute('content', t('meta.ogTitle', twt.getAttribute('content')));
    var twd = document.querySelector('meta[name="twitter:description"]');
    if (twd) twd.setAttribute('content', t('meta.twitterDescription', twd.getAttribute('content')));
  }

  function setElementText(el, val) {
    if (el.querySelector('svg, img')) {
      var updated = false;
      Array.from(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && String(n.textContent).trim()) {
          n.textContent = ' ' + val;
          updated = true;
        }
      });
      if (!updated) el.appendChild(document.createTextNode(val));
      return;
    }
    el.textContent = val;
  }

  function applyElements() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var val = t(key);
      if (val == null || val === key) return;
      /* Skip motion toggle fields — motion-toggle.js owns live state text */
      if (el.id === 'animations-toggle-status' || el.id === 'animations-toggle-label') return;
      setElementText(el, val);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (!key) return;
      var val = t(key);
      if (val == null || val === key) return;
      el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = t(key);
      if (val && val !== key) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = t(key);
      if (val && val !== key) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var val = t(key);
      if (val && val !== key) el.setAttribute('title', val);
    });
    document.querySelectorAll('option[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val && val !== key) el.textContent = val;
    });
  }

  function syncLangToggle() {
    var btn = document.getElementById('locale-toggle');
    if (!btn) return;
    var loc = locale();
    var other = loc === 'en' ? 'NO' : 'EN';
    btn.textContent = other;
    btn.setAttribute('aria-pressed', loc === 'en' ? 'true' : 'false');
    btn.setAttribute('aria-label', t(loc === 'en' ? 'lang.switchToNo' : 'lang.switchToEn'));
  }

  function setLocale(next) {
    if (SUPPORTED.indexOf(next) === -1) next = DEFAULT;
    try {
      localStorage.setItem(KEY, next);
    } catch (_) {}
    document.documentElement.setAttribute('data-locale', next);
    applyMeta();
    applyElements();
    syncLangToggle();
    document.dispatchEvent(new CustomEvent('proslides:locale', { detail: { locale: next } }));
  }

  function apply() {
    applyMeta();
    applyElements();
    syncLangToggle();
  }

  function init() {
    document.documentElement.setAttribute('data-locale', storedLocale());
    apply();
    var btn = document.getElementById('locale-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setLocale(locale() === 'en' ? 'no' : 'en');
      });
    }
  }

  window.ProSlidesI18n = {
    t: t,
    locale: locale,
    setLocale: setLocale,
    apply: apply,
    nodeDesc: nodeDesc,
    translateMetaKey: translateMetaKey,
    journeyMeta: journeyMeta
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
