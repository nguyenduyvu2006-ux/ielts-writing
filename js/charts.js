/* IELTS Writing Lab — Task 1 generator + renderer
 * generateTask1(kind) -> task object { id, type, title, prompt, data, describe(), render(el) }
 */
(function () {
  const PALETTE = ['#2563eb', '#f97316', '#16a34a', '#9333ea', '#dc2626', '#0891b2'];
  const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function roundStep(v, step) {
    const r = Math.round(v / step) * step;
    const dec = (String(step).split('.')[1] || '').length;
    return Number(r.toFixed(dec));
  }

  /* Produce n values following a recognisable shape so the chart has a "story" */
  function shapeValues(n, shape, lo, hi, step) {
    const span = hi - lo;
    let s, e, mid;
    switch (shape) {
      case 'rise':    s = rnd(lo, lo + 0.35 * span); e = rnd(s + 0.3 * span, hi); break;
      case 'fall':    e = rnd(lo, lo + 0.35 * span); s = rnd(e + 0.3 * span, hi); break;
      case 'stable':  s = rnd(lo + 0.1 * span, hi - 0.1 * span); e = clamp(s + rnd(-0.06, 0.06) * span, lo, hi); break;
      case 'peak':    s = rnd(lo, lo + 0.4 * span); e = rnd(lo, lo + 0.4 * span); mid = clamp(Math.max(s, e) + rnd(0.3, 0.5) * span, lo, hi); break;
      case 'dip':     s = rnd(hi - 0.4 * span, hi); e = rnd(hi - 0.4 * span, hi); mid = clamp(Math.min(s, e) - rnd(0.3, 0.5) * span, lo, hi); break;
      default:        s = rnd(lo, hi); e = rnd(lo, hi);
    }
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1);
      let v;
      if (mid !== undefined) {
        v = t < 0.5 ? s + (mid - s) * (t / 0.5) : mid + (e - mid) * ((t - 0.5) / 0.5);
      } else {
        v = s + (e - s) * t;
      }
      if (i !== 0 && i !== n - 1) v += rnd(-0.04, 0.04) * span;
      out.push(roundStep(clamp(v, lo, hi), step));
    }
    return out;
  }

  const SHAPES = ['rise', 'rise', 'fall', 'stable', 'peak', 'dip'];

  /* ───────── data generators ───────── */
  function genLine(scn) {
    const series = shuffle(scn.series).slice(0, scn.pick || scn.series.length);
    const shapes = shuffle(SHAPES);
    const data = series.map((name, i) => ({
      name, values: shapeValues(scn.cats.length, shapes[i % shapes.length], scn.range[0], scn.range[1], scn.step),
    }));
    return { cats: scn.cats, series: data, unit: scn.unit };
  }

  function genBar(scn) {
    const [lo, hi] = scn.range;
    const span = hi - lo;
    // base value per category, spread so there is a clear highest / lowest
    const order = shuffle(scn.cats.map((_, i) => i));
    const base = new Array(scn.cats.length);
    order.forEach((ci, rank) => {
      base[ci] = lo + span * (0.15 + 0.7 * rank / Math.max(1, scn.cats.length - 1)) + rnd(-0.05, 0.05) * span;
    });
    // each series scales the base: most categories move the same direction, one exception
    const dir = Math.random() < 0.6 ? 1 : -1;
    const exception = Math.floor(Math.random() * scn.cats.length);
    const data = scn.series.map((name, si) => ({
      name,
      values: scn.cats.map((_, ci) => {
        const k = scn.series.length === 1 ? 0 : si / (scn.series.length - 1);
        let f = 1 + dir * k * rnd(0.15, 0.45);
        if (ci === exception) f = 1 - dir * k * rnd(0.1, 0.3);
        if (scn.series.length === 2 && !/^\d{4}$/.test(scn.series[0])) f = 1 + (si === 0 ? 0 : rnd(-0.5, 0.5)); // Men/Women style
        return roundStep(clamp(base[ci] * f, lo, hi), scn.step);
      }),
    }));
    return { cats: scn.cats, series: data, unit: scn.unit };
  }

  function genPie(scn) {
    const n = scn.cats.length;
    const makeShares = (prev) => {
      let w = scn.cats.map(() => rnd(0.5, 2));
      const dom = Math.floor(Math.random() * n);
      w[dom] *= rnd(2.5, 4);
      if (prev) { // second pie: shift a couple of categories noticeably
        w = prev.map((p, i) => p * rnd(0.55, 1.6));
      }
      const sum = w.reduce((a, b) => a + b, 0);
      let pct = w.map((x) => Math.round((x / sum) * 100));
      const diff = 100 - pct.reduce((a, b) => a + b, 0);
      pct[pct.indexOf(Math.max(...pct))] += diff;
      return pct;
    };
    const first = makeShares();
    const data = scn.series.map((name, i) => ({ name, values: i === 0 ? first : makeShares(first) }));
    return { cats: scn.cats, series: data, unit: '%' };
  }

  function genMixed(scn) {
    const n = scn.cats.length;
    const bs = pick(SHAPES), ls = pick(SHAPES);
    return {
      cats: scn.cats,
      bar: { name: scn.bar.name, unit: scn.bar.unit, values: shapeValues(n, bs, scn.bar.range[0], scn.bar.range[1], scn.step) },
      line: { name: scn.line.name, unit: scn.line.unit, values: shapeValues(n, ls, scn.line.range[0], scn.line.range[1], scn.step) },
    };
  }

  /* ───────── prompt text ───────── */
  const RUBRIC = 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.';
  const isYear = (s) => /^\d{4}$/.test(String(s));

  function promptFor(scn, d) {
    const t = scn.title.charAt(0).toLowerCase() + scn.title.slice(1);
    const c = scn.cats;
    switch (scn.type) {
      case 'line': return `The line graph below shows the ${t} between ${c[0]} and ${c[c.length - 1]}.`;
      case 'bar': return `The bar chart below shows the ${t}${isYear(scn.series[0]) ? ' in ' + scn.series.join(' and ') : ''}.`;
      case 'pie': return `The pie charts below show the ${t} in ${scn.series.join(' and ')}.`;
      case 'table': return `The table below shows the ${t}${isYear(scn.series[0]) ? ' in ' + scn.series.join(' and ') : ''}.`;
      case 'mixed': return `The chart below shows the ${t} between ${c[0]} and ${c[c.length - 1]}.`;
      case 'process': return `The diagram below shows ${t}.`;
      case 'map': return `The maps below show ${t}.`;
    }
  }

  /* ───────── description for the AI grader ───────── */
  function describe(scn, d) {
    if (scn.type === 'process') return `Process diagram: ${scn.title}. Steps in order: ${scn.steps.map((s, i) => `${i + 1}) ${s}`).join('; ')}.${scn.cycle ? ' The process is a cycle (last step leads back to the first).' : ''}`;
    if (scn.type === 'map') {
      return `Maps: ${scn.title}. ` + scn.panels.map((p) => `${p.label}: ${p.items.filter((i) => i.label).map((i) => `${i.label} (${i.kind}, at left=${i.x}% top=${i.y}% size=${i.w}x${i.h})`).join('; ')}`).join('. ');
    }
    if (scn.type === 'mixed') {
      return `Combined bar+line chart. Categories: ${d.cats.join(', ')}. Bars = ${d.bar.name} (${d.bar.unit}): ${d.bar.values.join(', ')}. Line = ${d.line.name} (${d.line.unit}): ${d.line.values.join(', ')}.`;
    }
    const head = `${scn.type} chart. Unit: ${d.unit}. Categories: ${d.cats.join(', ')}.`;
    return head + ' ' + d.series.map((s) => `${s.name}: ` + s.values.map((v, i) => `${d.cats[i]}=${v}`).join(', ')).join('. ') + '.';
  }

  /* ───────── renderers ───────── */
  let charts = [];
  function destroyCharts() { charts.forEach((c) => c.destroy()); charts = []; }

  function canvas(el, h) {
    const wrap = document.createElement('div');
    wrap.className = 'chart-wrap';
    wrap.style.height = h + 'px';
    const c = document.createElement('canvas');
    wrap.appendChild(c);
    el.appendChild(wrap);
    return c;
  }

  function renderLine(el, scn, d) {
    const c = canvas(el, 340);
    charts.push(new Chart(c, {
      type: 'line',
      data: { labels: d.cats, datasets: d.series.map((s, i) => ({ label: s.name, data: s.values, borderColor: PALETTE[i], backgroundColor: PALETTE[i], tension: 0.25, pointRadius: 4 })) },
      options: baseOpts(d.unit),
    }));
  }

  function renderBar(el, scn, d) {
    const c = canvas(el, 340);
    charts.push(new Chart(c, {
      type: 'bar',
      data: { labels: d.cats, datasets: d.series.map((s, i) => ({ label: s.name, data: s.values, backgroundColor: PALETTE[i] })) },
      options: baseOpts(d.unit),
    }));
  }

  function renderPie(el, scn, d) {
    const row = document.createElement('div');
    row.className = 'pie-row';
    el.appendChild(row);
    d.series.forEach((s) => {
      const box = document.createElement('div');
      box.className = 'pie-box';
      const h = document.createElement('div'); h.className = 'pie-title'; h.textContent = s.name;
      box.appendChild(h);
      const c = document.createElement('canvas');
      box.appendChild(c);
      row.appendChild(box);
      charts.push(new Chart(c, {
        type: 'pie',
        data: { labels: d.cats, datasets: [{ data: s.values, backgroundColor: PALETTE }] },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' },
            datalabels: false,
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } },
          },
        },
        plugins: [pieLabels],
      }));
    });
  }

  // draws "23%" on each pie slice
  const pieLabels = {
    id: 'pieLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      meta.data.forEach((arc, i) => {
        const v = chart.data.datasets[0].data[i];
        if (v < 4) return;
        const p = arc.tooltipPosition();
        ctx.fillText(v + '%', p.x, p.y);
      });
      ctx.restore();
    },
  };

  function renderTable(el, scn, d) {
    const t = document.createElement('table');
    t.className = 'data-table';
    const thead = `<thead><tr><th></th>${d.series.map((s) => `<th>${s.name}</th>`).join('')}</tr></thead>`;
    const rows = d.cats.map((c, ci) => `<tr><td>${c}</td>${d.series.map((s) => `<td>${s.values[ci]}</td>`).join('')}</tr>`).join('');
    t.innerHTML = thead + `<tbody>${rows}</tbody>`;
    const cap = document.createElement('div');
    cap.className = 'table-unit';
    cap.textContent = `Values in ${d.unit}`;
    el.appendChild(t);
    el.appendChild(cap);
  }

  function renderMixed(el, scn, d) {
    const c = canvas(el, 340);
    charts.push(new Chart(c, {
      data: {
        labels: d.cats,
        datasets: [
          { type: 'bar', label: `${d.bar.name} (${d.bar.unit})`, data: d.bar.values, backgroundColor: PALETTE[0], yAxisID: 'y', order: 2 },
          { type: 'line', label: `${d.line.name} (${d.line.unit})`, data: d.line.values, borderColor: PALETTE[1], backgroundColor: PALETTE[1], yAxisID: 'y1', tension: 0.25, pointRadius: 4, order: 1 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { position: 'left', title: { display: true, text: d.bar.unit }, beginAtZero: true },
          y1: { position: 'right', title: { display: true, text: d.line.unit }, grid: { drawOnChartArea: false }, beginAtZero: true },
        },
      },
    }));
  }

  function baseOpts(unit) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true, title: { display: true, text: unit } } },
    };
  }

  /* Process diagram: boxes in a snake layout with arrows */
  function renderProcess(el, scn) {
    const steps = scn.steps;
    const cols = 3, bw = 200, bh = 70, gx = 60, gy = 50, pad = 20;
    const rows = Math.ceil(steps.length / cols);
    const W = pad * 2 + cols * bw + (cols - 1) * gx;
    const H = pad * 2 + rows * bh + (rows - 1) * gy + (scn.cycle ? 30 : 0);
    const pos = steps.map((_, i) => {
      const r = Math.floor(i / cols);
      let c = i % cols;
      if (r % 2 === 1) c = cols - 1 - c; // snake
      return { x: pad + c * (bw + gx), y: pad + r * (bh + gy), cx: pad + c * (bw + gx) + bw / 2, cy: pad + r * (bh + gy) + bh / 2 };
    });
    let svg = `<svg class="diagram" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#334155"/></marker></defs>`;
    // arrows
    for (let i = 0; i < steps.length - 1; i++) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) {
        const dir = b.x > a.x ? 1 : -1;
        svg += `<line x1="${a.cx + dir * bw / 2}" y1="${a.cy}" x2="${b.cx - dir * bw / 2}" y2="${b.cy}" stroke="#334155" stroke-width="2.5" marker-end="url(#arr)"/>`;
      } else {
        svg += `<line x1="${a.cx}" y1="${a.y + bh}" x2="${b.cx}" y2="${b.y}" stroke="#334155" stroke-width="2.5" marker-end="url(#arr)"/>`;
      }
    }
    if (scn.cycle) {
      const a = pos[steps.length - 1], b = pos[0];
      const yb = H - 12;
      svg += `<path d="M${a.cx},${a.y + bh} L${a.cx},${yb} L${b.cx},${yb} L${b.cx},${b.y + bh + 2}" fill="none" stroke="#334155" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arr)"/>`;
    }
    steps.forEach((s, i) => {
      const p = pos[i];
      svg += `<rect x="${p.x}" y="${p.y}" width="${bw}" height="${bh}" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>`;
      svg += `<circle cx="${p.x + 16}" cy="${p.y + 16}" r="11" fill="#2563eb"/><text x="${p.x + 16}" y="${p.y + 20}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${i + 1}</text>`;
      svg += wrapText(s, p.x + bw / 2, p.y + bh / 2, bw - 30, 13);
    });
    svg += '</svg>';
    el.innerHTML = svg;
  }

  function wrapText(text, cx, cy, maxW, fs) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    const charW = fs * 0.55;
    words.forEach((w) => {
      if ((cur + ' ' + w).trim().length * charW > maxW && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    const lh = fs + 3;
    const y0 = cy - ((lines.length - 1) * lh) / 2;
    return lines.map((l, i) => `<text x="${cx}" y="${y0 + i * lh + fs / 3}" text-anchor="middle" font-size="${fs}" fill="#0f172a" font-family="system-ui, sans-serif">${esc(l)}</text>`).join('');
  }
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const MAP_FILL = { road: '#cbd5e1', green: '#bbf7d0', water: '#bfdbfe', building: '#fde68a', beach: '#fef3c7' };
  const MAP_STROKE = { road: '#64748b', green: '#16a34a', water: '#2563eb', building: '#b45309', beach: '#d97706' };

  function renderMap(el, scn) {
    const row = document.createElement('div');
    row.className = 'map-row';
    scn.panels.forEach((p) => {
      const box = document.createElement('div');
      box.className = 'map-box';
      let svg = `<svg class="diagram" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="70" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.6"/>`;
      p.items.forEach((it) => {
        svg += `<rect x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}" fill="${MAP_FILL[it.kind]}" stroke="${MAP_STROKE[it.kind]}" stroke-width="0.5"/>`;
        if (it.label) {
          const fs = Math.min(3.2, Math.max(1.8, it.w / it.label.length * 1.7));
          svg += `<text x="${it.x + it.w / 2}" y="${it.y + it.h / 2 + fs / 3}" text-anchor="middle" font-size="${fs}" font-family="system-ui, sans-serif" fill="#0f172a">${esc(it.label)}</text>`;
        }
      });
      svg += `<text x="2" y="4" font-size="3.4" font-weight="700" fill="#0f172a" font-family="system-ui, sans-serif">N ↑</text></svg>`;
      box.innerHTML = `<div class="pie-title">${p.label}</div>` + svg;
      row.appendChild(box);
    });
    el.appendChild(row);
    const key = document.createElement('div');
    key.className = 'map-key';
    key.innerHTML = Object.keys(MAP_FILL).map((k) => `<span><i style="background:${MAP_FILL[k]};border-color:${MAP_STROKE[k]}"></i>${k}</span>`).join('');
    el.appendChild(key);
  }

  /* ───────── public ───────── */
  const ALL = () => TASK1_BANK.concat(PROCESS_BANK, MAP_BANK);

  window.generateTask1 = function (kind) {
    const pool = kind && kind !== 'any' ? ALL().filter((s) => s.type === kind) : ALL();
    const scn = pick(pool);
    let d = null;
    if (scn.type === 'line') d = genLine(scn);
    else if (scn.type === 'bar' || scn.type === 'table') d = genBar(scn);
    else if (scn.type === 'pie') d = genPie(scn);
    else if (scn.type === 'mixed') d = genMixed(scn);

    return {
      id: scn.id, type: scn.type, title: scn.title, data: d,
      prompt: promptFor(scn, d),
      rubric: RUBRIC,
      describe: () => describe(scn, d),
      render(el) {
        destroyCharts();
        el.innerHTML = '';
        const h = document.createElement('div');
        h.className = 'chart-title';
        h.textContent = scn.title;
        el.appendChild(h);
        if (scn.type === 'line') renderLine(el, scn, d);
        else if (scn.type === 'bar') renderBar(el, scn, d);
        else if (scn.type === 'pie') renderPie(el, scn, d);
        else if (scn.type === 'table') renderTable(el, scn, d);
        else if (scn.type === 'mixed') renderMixed(el, scn, d);
        else if (scn.type === 'process') { const w = document.createElement('div'); el.appendChild(w); renderProcess(w, scn); }
        else if (scn.type === 'map') renderMap(el, scn);
      },
    };
  };
})();
