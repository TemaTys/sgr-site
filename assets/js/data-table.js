(function () {
  'use strict';

  var mount = document.querySelector('[data-sgr-table]');
  if (!mount) return;

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  var dataUrl = mount.getAttribute('data-src');

  var TRIGGERS = [
    { code: 'PHASE_New', group: 'phase', ru: 'Новолуние', en: 'New Moon' },
    { code: 'PHASE_FirstQ', group: 'phase', ru: 'Первая четверть', en: 'First Quarter' },
    { code: 'PHASE_Quadrature', group: 'phase', ru: 'Квадратура', en: 'Quadrature' },
    { code: 'PHASE_Full', group: 'phase', ru: 'Полнолуние', en: 'Full Moon' },
    { code: 'PHASE_LastQ', group: 'phase', ru: 'Последняя четверть', en: 'Last Quarter' },
    { code: 'PHASE_Syzygy', group: 'phase', ru: 'Сизигия (Новолуние/Полнолуние)', en: 'Syzygy (New/Full)' },
    { code: 'WAVE_before_syzygy', group: 'wave', ru: 'Волна перед сизигией', en: 'Wave before syzygy' },
    { code: 'WAVE_syzygy', group: 'wave', ru: 'Волна в сизигию', en: 'Wave at syzygy' },
    { code: 'WAVE_after_syzygy', group: 'wave', ru: 'Волна после сизигии', en: 'Wave after syzygy' },
    { code: 'WAVE_before_quadrature', group: 'wave', ru: 'Волна перед квадратурой', en: 'Wave before quadrature' },
    { code: 'WAVE_quadrature', group: 'wave', ru: 'Волна в квадратуру', en: 'Wave at quadrature' },
    { code: 'WAVE_after_quadrature', group: 'wave', ru: 'Волна после квадратуры', en: 'Wave after quadrature' },
    { code: 'WAVE_event', group: 'wave', ru: 'Волновой пик (d²F/dt²)', en: 'Wave event (d²F/dt² spike)' }
  ];

  var TRIGGER_MAP = {};
  TRIGGERS.forEach(function (t) { TRIGGER_MAP[t.code] = t; });

  var SOURCE_ORDER = { cross_city: 0, single_db: 1, google_trends: 2 };

  var STR = {
    ru: {
      showAll: 'Показать все',
      phases: 'Фазы',
      waves: 'Импульсные волны',
      trigger: 'Триггер',
      indicator: 'Показатель',
      family: 'Семейство',
      effect: 'Эффект (95% ДИ)',
      tier: 'TIER',
      epoch: 'Эпоха',
      source: 'Источник',
      checks: 'Проверки',
      passed: 'Пройдены',
      flagged: 'Есть замечания',
      empty: 'Нет строк по выбранному фильтру.',
      summary: function (shown, total) {
        return 'Показано ' + shown + ' из ' + total + ' строк · сортировка по свежести';
      }
    },
    en: {
      showAll: 'Show all',
      phases: 'Phases',
      waves: 'Impulsive waves',
      trigger: 'Trigger',
      indicator: 'Indicator',
      family: 'Family',
      effect: 'Effect (95% CI)',
      tier: 'TIER',
      epoch: 'Epoch',
      source: 'Source',
      checks: 'Checks',
      passed: 'Passed',
      flagged: 'Flagged',
      empty: 'No rows match this filter.',
      summary: function (shown, total) {
        return 'Showing ' + shown + ' of ' + total + ' rows · sorted by freshness';
      }
    }
  }[lang];

  var FAIL_REASON_LABELS = {
    ru: {
      perm_partial: 'частично прошёл перестановочный тест',
      placebo_no: 'не прошёл плацебо-ресэмплинг',
      ci_crosses_zero: '95% ДИ пересекает ноль'
    },
    en: {
      perm_partial: 'partial pass on permutation test',
      placebo_no: 'failed placebo resampling',
      ci_crosses_zero: '95% CI crosses zero'
    }
  }[lang];

  var activeTrigger = 'all';
  var ALL_ROWS = [];

  fetch(dataUrl)
    .then(function (res) { return res.json(); })
    .then(function (rows) {
      ALL_ROWS = sortByFreshness(rows);
      renderFilters();
      renderTable();
    })
    .catch(function () {
      mount.innerHTML = '<p class="data-table__empty">' + (lang === 'en' ? 'Could not load the data table.' : 'Не удалось загрузить таблицу данных.') + '</p>';
    });

  function sortByFreshness(rows) {
    return rows
      .map(function (r, i) { return { r: r, i: i }; })
      .sort(function (a, b) {
        var ad = a.r.date_added, bd = b.r.date_added;
        if (ad && bd) {
          if (ad === bd) return a.i - b.i;
          return ad < bd ? 1 : -1;
        }
        if (ad && !bd) return -1;
        if (!ad && bd) return 1;
        return (SOURCE_ORDER[a.r.source] - SOURCE_ORDER[b.r.source]) || (a.i - b.i);
      })
      .map(function (x) { return x.r; });
  }

  function countByTrigger(code) {
    return ALL_ROWS.filter(function (r) { return r.trigger === code; }).length;
  }

  function renderFilters() {
    var bar = document.querySelector('[data-sgr-filters]');
    if (!bar) return;
    bar.innerHTML = '';

    var allGroup = document.createElement('div');
    allGroup.className = 'filter-group';
    allGroup.appendChild(buildChip('all', STR.showAll, ALL_ROWS.length));
    bar.appendChild(allGroup);

    ['phase', 'wave'].forEach(function (group) {
      var g = document.createElement('div');
      g.className = 'filter-group';
      var label = document.createElement('span');
      label.className = 'filter-group__label';
      label.textContent = group === 'phase' ? STR.phases : STR.waves;
      g.appendChild(label);
      TRIGGERS.filter(function (t) { return t.group === group; }).forEach(function (t) {
        g.appendChild(buildChip(t.code, t[lang], countByTrigger(t.code)));
      });
      bar.appendChild(g);
    });
  }

  function buildChip(code, label, count) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-chip' + (activeTrigger === code ? ' is-active' : '');
    btn.setAttribute('aria-pressed', activeTrigger === code ? 'true' : 'false');
    btn.innerHTML = '<span>' + escapeHtml(label) + '</span><span class="filter-chip__count">' + count + '</span>';
    btn.addEventListener('click', function () {
      activeTrigger = code;
      renderFilters();
      renderTable();
    });
    return btn;
  }

  function renderTable() {
    var filtered = activeTrigger === 'all' ? ALL_ROWS : ALL_ROWS.filter(function (r) { return r.trigger === activeTrigger; });

    var summary = document.querySelector('[data-sgr-summary]');
    if (summary) summary.textContent = STR.summary(filtered.length, ALL_ROWS.length);

    var tbody = document.querySelector('[data-sgr-tbody]');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!filtered.length) {
      var emptyRow = document.createElement('tr');
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = 8;
      emptyCell.className = 'data-table__empty';
      emptyCell.textContent = STR.empty;
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }

    var frag = document.createDocumentFragment();
    filtered.forEach(function (r) { frag.appendChild(buildRow(r)); });
    tbody.appendChild(frag);
  }

  function buildRow(r) {
    var tr = document.createElement('tr');

    var trig = TRIGGER_MAP[r.trigger];
    var trigLabel = trig ? trig[lang] : r.trigger;

    tr.appendChild(cell(
      '<span class="row-label">' + escapeHtml(trigLabel) + '</span><span class="row-sub">' + escapeHtml(r.trigger) + (r.lag !== undefined && r.lag !== null ? ' · lag ' + escapeHtml(String(r.lag)) : '') + '</span>',
      true
    ));

    var indicatorLabel = (r.emoji ? r.emoji + ' ' : '') + (r[lang === 'en' ? 'label_en' : 'label_ru'] || r.code);
    tr.appendChild(cell(
      '<span class="row-label">' + escapeHtml(indicatorLabel) + '</span><span class="row-sub">' + escapeHtml(r.code) + '</span>',
      true
    ));

    tr.appendChild(cell(escapeHtml(r[lang === 'en' ? 'family_en' : 'family_ru'] || '')));

    tr.appendChild(cell(effectHtml(r), true));

    tr.appendChild(cell('<span class="tier-badge tier-badge--' + tierNum(r.tier) + '" title="' + escapeAttr(r.tier || '') + '">TIER' + tierNum(r.tier) + '</span>', true));

    tr.appendChild(cell(escapeHtml(r.epoch || '')));

    var sourceLabel = r[lang === 'en' ? 'source_label_en' : 'source_label_ru'] || r.source;
    tr.appendChild(cell('<span class="source-badge source-badge--' + escapeAttr(r.source) + '">' + escapeHtml(sourceLabel) + '</span>', true));

    tr.appendChild(cell(checksHtml(r), true));

    return tr;
  }

  function tierNum(tier) {
    if (!tier) return '3';
    if (tier.indexOf('TIER1') === 0) return '1';
    if (tier.indexOf('TIER2') === 0) return '2';
    return '3';
  }

  function effectHtml(r) {
    var sign = typeof r.value === 'number' ? (r.value < 0 ? 'effect-neg' : 'effect-pos') : '';
    var arrow = typeof r.value === 'number' ? (r.value < 0 ? '↓' : '↑') : '';
    var effectType = r.effect_type === 'g_meta' ? 'g_meta' : 'g';
    var main = arrow + ' ' + effectType + ' = ' + fmtNum(r.value) + ', 95% CI [' + fmtNum(r.ci_low) + ', ' + fmtNum(r.ci_high) + ']';
    var secondary = '';
    if (r.secondary_label && (r.secondary_value !== null && r.secondary_value !== undefined)) {
      secondary = '<span class="row-sub">' + escapeHtml(r.secondary_label) + ' = ' + escapeHtml(String(r.secondary_value)) + (r.p_value !== null && r.p_value !== undefined ? ', p = ' + fmtNum(r.p_value, 4) : '') + '</span>';
    }
    var cities = '';
    if (r.k_cities) {
      cities = '<span class="row-sub">' + (lang === 'en' ? 'k = ' : 'k = ') + r.k_cities + (r.contributions ? ' · ' + escapeHtml(r.contributions) : '') + '</span>';
    }
    return '<span class="' + sign + '">' + escapeHtml(main) + '</span>' + secondary + cities;
  }

  function fmtNum(v, digits) {
    if (typeof v !== 'number') return '—';
    return v.toFixed(digits || 3);
  }

  function checksHtml(r) {
    if (r.checks_passed) {
      return '<span class="check-badge check-badge--ok">✓ ' + escapeHtml(STR.passed) + '</span>';
    }
    var reasons = (r.fail_reasons || []).map(function (fr) {
      return FAIL_REASON_LABELS[fr] || fr;
    }).join('; ');
    return '<span class="check-badge check-badge--flag" title="' + escapeAttr(reasons) + '">⚠ ' + escapeHtml(STR.flagged) + '</span>';
  }

  function cell(html, isHtml) {
    var td = document.createElement('td');
    if (isHtml) td.innerHTML = html; else td.textContent = html;
    return td;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();
