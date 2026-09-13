/* IELTS Writing Lab — app logic */
(function () {
  const $ = (id) => document.getElementById(id);
  const LS_BAND = 'iwl_band';
  const LS_HIST = 'iwl_history';
  const LS_GUIDE = 'iwl_guide';

  const MODES = {
    1: [['full', 'Full answer'], ['intro', 'Introduction'], ['overview', 'Overview'], ['body', 'Body paragraph']],
    2: [['full', 'Full essay'], ['intro', 'Introduction'], ['body', 'Body paragraph'], ['conclusion', 'Conclusion']],
  };
  const KINDS1 = [['any', 'Any chart'], ['line', 'Line graph'], ['bar', 'Bar chart'], ['pie', 'Pie chart'], ['table', 'Table'], ['mixed', 'Bar + line'], ['process', 'Process'], ['map', 'Map']];
  const KINDS2 = [['any', 'Any type']].concat(Object.entries(TASK2_TYPES));
  const WORD_TARGET = { 1: { full: 150, intro: 0, overview: 0, body: 0 }, 2: { full: 250, intro: 0, body: 0, conclusion: 0 } };
  const TIME_LIMIT = { 1: 20 * 60, 2: 40 * 60 };
  const CRIT = { 1: 'Task Achievement', 2: 'Task Response' };

  const state = {
    band: Number(localStorage.getItem(LS_BAND)) || 0,
    task: 1, mode: 'full', kind: 'any',
    current: null,       // task object (task1 chart or task2 question)
    result: null,        // grade result
    model: null,         // model answer result
    timer: { start: null, int: null },
    editing: false,      // came back from results to improve
    returnTo: 'practice',
  };

  /* ───────── navigation ───────── */
  function go(view) {
    document.querySelectorAll('.view').forEach((v) => (v.hidden = v.id !== 'view-' + view));
    window.scrollTo(0, 0);
    if (view === 'history') renderHistory();
  }
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); go(b.dataset.go); }));

  /* ───────── band ───────── */
  function setBand(b) {
    state.band = b;
    localStorage.setItem(LS_BAND, b);
    document.querySelectorAll('.band-btn').forEach((x) => x.classList.toggle('active', Number(x.dataset.band) === b));
    $('bandChip').textContent = 'Target: ' + fmtBand(b);
    if (state.current) renderGuide();
  }
  const fmtBand = (b) => (b >= 8 ? '8.0+' : Number(b).toFixed(1));
  $('bandGrid').addEventListener('click', (e) => { const b = e.target.closest('.band-btn'); if (b) setBand(Number(b.dataset.band)); });
  if (state.band) setBand(state.band);

  /* ───────── task selection ───────── */
  document.querySelectorAll('.task-card').forEach((c) => c.addEventListener('click', () => {
    if (!state.band) { setBand(6.5); }
    startTask(Number(c.dataset.task));
  }));

  function startTask(task) {
    state.task = task;
    state.mode = 'full';
    state.kind = 'any';
    $('practiceTitle').textContent = task === 1 ? 'Task 1 — Academic' : 'Task 2 — Essay';
    $('filterLabel').textContent = task === 1 ? 'Chart type' : 'Question type';
    const sel = $('kindSelect');
    sel.innerHTML = (task === 1 ? KINDS1 : KINDS2).map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    renderModePills();
    $('guidePanel').hidden = localStorage.getItem(LS_GUIDE) !== '1';
    newTask();
    go('practice');
  }

  function renderModePills() {
    $('modePills').innerHTML = MODES[state.task].map(([v, l]) => `<button class="pill ${v === state.mode ? 'active' : ''}" data-mode="${v}">${l}</button>`).join('');
  }
  $('modePills').addEventListener('click', (e) => {
    const p = e.target.closest('.pill');
    if (!p) return;
    state.mode = p.dataset.mode;
    renderModePills();
    resetEditor();
    updateRubric();
  });
  $('kindSelect').addEventListener('change', (e) => { state.kind = e.target.value; newTask(); });
  $('newTaskBtn').addEventListener('click', newTask);

  function newTask() {
    state.model = null;
    $('modelPanel').hidden = true;
    if (state.task === 1) {
      state.current = generateTask1(state.kind);
      $('promptText').textContent = state.current.prompt;
      state.current.render($('chartArea'));
    } else {
      const pool = state.kind === 'any' ? TASK2_BANK : TASK2_BANK.filter((q) => q.type === state.kind);
      const q = pool[Math.floor(Math.random() * pool.length)];
      state.current = { type: q.type, title: TASK2_TYPES[q.type], topic: q.topic, q: q.q, para: q.para, prompt: q.q, rubric: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.' };
      $('chartArea').innerHTML = `<span class="band-tag">${TASK2_TYPES[q.type]} · ${q.topic}</span>`;
      $('promptText').textContent = q.q;
    }
    resetEditor();
    updateRubric();
  }

  function updateRubric() {
    const m = state.mode;
    const hint = {
      full: state.current.rubric,
      intro: 'Write ONLY the introduction: paraphrase the question in 1-2 sentences' + (state.task === 2 ? ' and state your position.' : '.'),
      overview: 'Write ONLY the overview: 2-3 sentences with the main trends or key features. No detailed numbers.',
      body: 'Write ONLY one body paragraph: ' + (state.task === 1 ? 'compare the details with figures from the chart.' : 'one main idea, explained and supported with an example.'),
      conclusion: 'Write ONLY the conclusion: restate your position and summarise the main points in 2-3 sentences.',
    }[m];
    $('rubricText').textContent = hint;
    const t = WORD_TARGET[state.task][m];
    $('wordTarget').textContent = t ? `/ ${t} minimum` : '';
    renderGuide();
  }

  /* ───────── how-to-write guide ───────── */
  function renderGuide() {
    if ($('guidePanel').hidden) return;
    $('guideBody').innerHTML = buildGuide({ task: state.task, mode: state.mode, band: state.band, current: state.current });
  }
  $('guideBtn').addEventListener('click', () => {
    const open = $('guidePanel').hidden;
    $('guidePanel').hidden = !open;
    localStorage.setItem(LS_GUIDE, open ? '1' : '0');
    if (open) { renderGuide(); $('guidePanel').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  $('guideClose').addEventListener('click', () => { $('guidePanel').hidden = true; localStorage.setItem(LS_GUIDE, '0'); });

  /* ───────── editor, timer, word count ───────── */
  const essay = $('essay');
  function resetEditor() {
    if (!state.editing) essay.value = '';
    state.editing = false;
    stopTimer();
    state.timer.start = null;
    $('timer').textContent = state.mode === 'full' ? fmtTime(TIME_LIMIT[state.task]) : '00:00';
    $('timer').className = 'timer';
    updateWords();
    $('practiceError').hidden = true;
  }
  function updateWords() {
    const n = essay.value.trim().split(/\s+/).filter(Boolean).length;
    $('wordCount').textContent = n;
  }
  essay.addEventListener('input', () => {
    updateWords();
    if (!state.timer.start && essay.value.trim()) startTimer();
  });
  function startTimer() {
    state.timer.start = Date.now();
    state.timer.int = setInterval(tick, 1000);
    tick();
  }
  function stopTimer() { clearInterval(state.timer.int); state.timer.int = null; }
  function tick() {
    const el = Math.floor((Date.now() - state.timer.start) / 1000);
    const t = $('timer');
    if (state.mode === 'full') {
      const left = TIME_LIMIT[state.task] - el;
      t.textContent = (left < 0 ? '-' : '') + fmtTime(Math.abs(left));
      t.className = 'timer' + (left < 0 ? ' over' : left < 300 ? ' warn' : '');
    } else {
      t.textContent = fmtTime(el);
    }
  }
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ───────── AI calls ───────── */
  function payload(action) {
    return {
      action, task: state.task, mode: state.mode, targetBand: state.band,
      prompt: state.current.prompt,
      chartData: state.task === 1 ? state.current.describe() : undefined,
      questionType: state.task === 2 ? state.current.title : undefined,
      essay: action === 'grade' ? essay.value.trim() : undefined,
    };
  }
  function busy(on, text) { $('overlay').hidden = !on; if (text) $('overlayText').textContent = text; }

  $('gradeBtn').addEventListener('click', async () => {
    const words = essay.value.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) { showErr('Write at least a few sentences first.'); return; }
    stopTimer();
    busy(true, 'Examining your writing… (20-40 seconds)');
    try {
      state.result = await AI.call(payload('grade'));
      state.model = null;
      state.returnTo = 'practice';
      saveAttempt();
      showResults();
    } catch (e) { showErr(e.message); }
    busy(false);
  });

  $('modelBtn').addEventListener('click', async () => {
    busy(true, 'Writing a model answer at your level…');
    try {
      if (!state.model) state.model = await AI.call(payload('model'));
      renderModel($('modelPanelBody'), state.model);
      $('modelPanel').hidden = false;
      $('modelPanel').scrollIntoView({ behavior: 'smooth' });
    } catch (e) { showErr(e.message); }
    busy(false);
  });
  $('closeModel').addEventListener('click', () => ($('modelPanel').hidden = true));
  function showErr(m) { const el = $('practiceError'); el.textContent = '⚠️ ' + m; el.hidden = false; }

  /* ───────── results ───────── */
  function showResults() {
    const r = state.result;
    const s = r.scores;
    $('scoreRow').innerHTML = [
      [CRIT[state.task], s.c1], ['Coherence & Cohesion', s.c2], ['Lexical Resource', s.c3], ['Grammar', s.c4],
    ].map(([k, v]) => `<div class="score"><div class="v">${fmtScore(v)}</div><div class="k">${k}</div></div>`).join('')
      + `<div class="score overall"><div class="v">${fmtScore(r.overall)}</div><div class="k">Overall · target ${fmtBand(state.band)}</div></div>`;
    $('resSummary').textContent = r.summary;
    const da = $('resData');
    if (r.data_accuracy) { da.textContent = '📊 Data check: ' + r.data_accuracy; da.hidden = false; da.classList.toggle('bad', /wrong|incorrect|inaccura|error/i.test(r.data_accuracy)); } else da.hidden = true;
    $('resStrengths').innerHTML = r.strengths.map((x) => `<li>${esc(x)}</li>`).join('');
    $('resImprovements').innerHTML = r.improvements.map((i) => `<div class="imp"><b>${esc(i.issue)}</b><div class="ex">"${esc(i.example)}"</div><div class="fx">→ ${esc(i.fix)}</div></div>`).join('');
    $('cmpOriginal').textContent = essay.value.trim();
    $('cmpRewrite').textContent = r.rewrite;
    $('resChanges').innerHTML = r.changes.map((c) => `<div class="chg"><span class="o">${esc(c.original)}</span> → <span class="n">${esc(c.improved)}</span><span class="w">${esc(c.why)}</span></div>`).join('');
    $('resModel').innerHTML = '<button class="btn btn-secondary btn-big" id="loadModelBtn">📖 Load model answer</button>';
    if (state.model) renderModel($('resModel'), state.model);
    switchTab('feedback');
    go('results');
  }
  const fmtScore = (v) => Number(v).toFixed(1);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function switchTab(name) {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.tab-panel').forEach((p) => (p.hidden = p.dataset.panel !== name));
  }
  $('resTabs').addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) switchTab(t.dataset.tab); });
  $('resModel').addEventListener('click', async (e) => {
    if (e.target.id !== 'loadModelBtn') return;
    busy(true, 'Writing a model answer at your level…');
    try { state.model = await AI.call(payload('model')); renderModel($('resModel'), state.model); } catch (err) { alert(err.message); }
    busy(false);
  });
  $('backToPractice').addEventListener('click', () => { if (state.returnTo === 'history') return go('history'); state.editing = true; go('practice'); });
  $('tryAgainBtn').addEventListener('click', () => { state.editing = true; go('practice'); essay.focus(); });
  $('newFromResults').addEventListener('click', () => { newTask(); go('practice'); });

  function renderModel(el, m) {
    el.innerHTML = `<span class="band-tag">Band ${fmtScore(m.band)} model — one step above your target</span>
      <div class="model-text">${esc(m.model_answer)}</div>
      <h3>How it is organised</h3><ul>${m.structure_notes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <h3>Useful vocabulary</h3><div class="vocab">${m.vocabulary.map((v) => `<div><b>${esc(v.phrase)}</b><i>${esc(v.meaning)}</i>${esc(v.example)}</div>`).join('')}</div>`;
  }

  /* ───────── history ───────── */
  function loadHist() { try { return JSON.parse(localStorage.getItem(LS_HIST)) || []; } catch { return []; } }
  function saveAttempt() {
    const h = loadHist();
    h.unshift({
      id: Date.now(), date: new Date().toISOString(), task: state.task, mode: state.mode, band: state.band,
      prompt: state.current.prompt, essay: essay.value.trim(), result: state.result,
    });
    localStorage.setItem(LS_HIST, JSON.stringify(h.slice(0, 100)));
  }
  function renderHistory() {
    const h = loadHist();
    $('historyList').innerHTML = h.length ? h.map((a) => `
      <div class="hist" data-id="${a.id}">
        <div><div class="t">Task ${a.task} · ${labelMode(a.task, a.mode)}</div><div class="m">${new Date(a.date).toLocaleString()} · ${esc(a.prompt).slice(0, 90)}…</div></div>
        <div class="b">${fmtScore(a.result.overall)}</div>
      </div>`).join('') : '<p class="muted">No attempts yet.</p>';
  }
  const labelMode = (t, m) => (MODES[t].find(([v]) => v === m) || [])[1] || m;
  $('historyList').addEventListener('click', (e) => {
    const row = e.target.closest('.hist');
    if (!row) return;
    const a = loadHist().find((x) => x.id === Number(row.dataset.id));
    if (!a) return;
    state.task = a.task; state.mode = a.mode; state.band = a.band; state.result = a.result; state.model = null;
    state.current = { prompt: a.prompt, rubric: '', describe: () => '', title: '' };
    essay.value = a.essay;
    state.returnTo = 'history';
    showResults();
  });
  $('clearHistory').addEventListener('click', () => { if (confirm('Delete all saved attempts?')) { localStorage.removeItem(LS_HIST); renderHistory(); } });

  /* ───────── init ───────── */
  $('demoNote').hidden = !AI.isDemo();
})();
