/* IELTS Writing Lab — "How to write this" guides.
 * Static recipes per (task, type, part) + a dynamic "For this chart / question"
 * section computed from the exact data on screen. No AI cost.
 *
 * window.buildGuide({ task, mode, band, current }) -> HTML string
 */
(function () {
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const isYear = (s) => /^\d{4}$/.test(String(s));
  const lc = (s) => String(s).charAt(0).toLowerCase() + String(s).slice(1);
  const list = (arr) => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  const UNIT_WORD = { thousands: 'thousand', millions: 'million', billions: 'billion' };
  const fmt = (v, unit) => {
    if (!unit) return String(v);
    if (unit === '%') return v + '%';
    let u = unit.trim();
    const dollar = u.startsWith('$');
    if (dollar) u = u.slice(1).trim();
    u = UNIT_WORD[u] || u;
    return (dollar ? '$' : '') + v + (u ? ' ' + u : '');
  };
  const an = (w) => /s$/i.test(w) && !/ss$/i.test(w) && !/\b(bus|glass|grass)$/i.test(w) ? w : (/^[aeiou]/i.test(w) && !/^uni/i.test(w) ? 'an ' : 'a ') + w;
  const NUMWORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const nw = (n) => NUMWORD[n] || String(n);
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

  /* ═══════════════════ STATIC GUIDES ═══════════════════ */
  const T1 = {
    data: {
      intro: {
        what: 'ONE sentence (two at most) that says what the chart shows — in your own words, not the question\'s words.',
        recipe: ['Swap the verb: <i>shows</i> → <i>illustrates / compares / gives information about</i>', 'Swap the main nouns for synonyms or a "how many / how much" phrase', 'Keep the <b>what</b>, <b>who/where</b>, <b>when</b> and the <b>unit</b> if useful', 'Stop. No trends, no numbers yet.'],
        starters: ['The chart illustrates ___ in ___ between ___ and ___.', 'The [chart type] compares ___ across ___ over a ___-year period.', 'Information is given about ___ in ___.'],
        high: ['The [chart type] provides a breakdown of ___ by ___ over ___.', 'Presented in the [chart type] is a comparison of ___ in ___.'],
        dont: ['Copy the question word for word — copied words earn nothing.', 'Write "According to the chart…" — it is the task, not a source.', 'Add a trend or a number — that is the overview / body.'],
      },
      overview: {
        what: '2–3 sentences giving the main pattern of the whole chart. <b>No numbers here</b> — save them for the body.',
        recipe: ['Start with <b>Overall,</b>', 'Say which item is <b>biggest</b> and which is <b>smallest</b>', 'Say the <b>main direction of change</b> — did most go up or down? Any exception?', 'Stop.'],
        starters: ['Overall, ___ was the highest in both years, while ___ was the lowest.', 'Overall, most ___ increased over the period, with the exception of ___.', 'The most striking change was in ___, which ___.'],
        high: ['Overall, a clear upward trend can be seen in ___, whereas ___ remained comparatively stable.', 'It is noticeable that ___ consistently outstripped the other ___ throughout the period.'],
        dont: ['Put figures in the overview — that is body detail.', 'List every item one by one — group them (the risers / the fallers).', 'Skip the overview — without one, Task Achievement is capped at Band 5.'],
      },
      body: {
        what: 'One paragraph that <b>compares the details with figures</b>. Pick the most important numbers — you cannot mention everything.',
        recipe: ['Choose a logical group: the highest items, the first year, or the risers', 'Give the <b>starting figure</b> and the <b>ending figure</b>, with the year', 'Use a comparison word: <i>compared with, whereas, in contrast, while</i>', 'Cover 3–5 figures, not 15'],
        starters: ['In ___, ___ had the highest figure at ___, compared with just ___ for ___.', '___ rose from ___ in ___ to ___ in ___.', 'In contrast, ___ fell from ___ to ___ over the same period.'],
        high: ['___ experienced the most dramatic growth, almost doubling from ___ to ___.', 'A similar, though less pronounced, pattern was seen in ___, which ___.'],
        dont: ['List numbers with no comparison: "A was 20. B was 30. C was 40."', 'Give an opinion or a reason ("because people became richer").', 'Forget the unit and the year — every figure needs both.'],
      },
      full: {
        what: 'A 4-paragraph report of at least 150 words: Introduction → Overview → Body 1 → Body 2.',
        recipe: ['<b>Para 1 – Introduction:</b> one sentence paraphrasing the task', '<b>Para 2 – Overview:</b> 2–3 sentences, main trends, no numbers', '<b>Para 3 – Body 1:</b> the biggest group / first period with figures', '<b>Para 4 – Body 2:</b> the remaining items or the changes, with figures', 'Aim for 160–190 words. No conclusion needed for Task 1.'],
        starters: ['The chart illustrates ___.', 'Overall, ___.', 'Looking at the details, ___.', 'Turning to ___, ___.'],
        high: ['A closer look at the data reveals that ___.', 'The remaining ___ followed a rather different pattern: ___.'],
        dont: ['Write an opinion or explanation of why the trend happened.', 'Write fewer than 150 words — automatic penalty.', 'Spend more than 20 minutes — Task 2 is worth twice as much.'],
      },
    },
    process: {
      intro: {
        what: 'ONE sentence saying what process the diagram shows, in your own words.',
        recipe: ['Swap <i>shows</i> → <i>illustrates / describes</i>', 'Turn the noun into a "how X is made / produced" phrase', 'Mention it is a process and, if obvious, how many stages', 'Stop.'],
        starters: ['The diagram illustrates how ___ is produced.', 'The diagram describes the process by which ___.', 'The flow chart shows the ___ stages involved in ___.'],
        high: ['The diagram provides an overview of the various steps involved in ___.'],
        dont: ['Copy the title word for word.', 'Start describing the steps in the introduction.'],
      },
      overview: {
        what: 'One short paragraph (2–3 sentences) giving the big picture: how many stages, where it starts and ends, linear or cycle.',
        recipe: ['Start with <b>Overall,</b>', 'Say <b>how many stages</b> and what the process <b>starts and ends</b> with', 'Say whether it is <b>linear</b> (start → end) or a <b>cycle</b>', 'Optional: divide it into 2 phases (e.g. natural / man-made, farm / factory)'],
        starters: ['Overall, the process consists of ___ main stages, beginning with ___ and ending with ___.', 'It is a linear / cyclical process which ___.', 'Broadly, the diagram can be divided into two phases: ___ and ___.'],
        high: ['Overall, this is a ___-stage process which can be broadly divided into ___.'],
        dont: ['Describe every step here — that is the body.', 'Say the process is "interesting" or give an opinion.', 'Skip the overview — Task Achievement is capped at Band 5 without one.'],
      },
      body: {
        what: 'Describe the steps <b>in order</b>, using sequence words and the <b>passive voice</b> (the beans <i>are dried</i>, not <i>they dry the beans</i>).',
        recipe: ['Start: <i>The process begins when… / At the first stage, …</i>', 'Middle: <i>Next, / After that, / Once…, / The following step is…</i>', 'End: <i>Finally, / In the last stage, …</i>', 'Use the passive for man-made steps; active for natural ones (the tree <i>grows</i>)'],
        starters: ['The process begins when ___ is ___.', 'Next, the ___ is ___ before being ___.', 'Once this has been done, ___.', 'Finally, ___ is ___, ready to be ___.'],
        high: ['Having been ___, the ___ is then ___.', 'The final stage involves ___, at which point ___.'],
        dont: ['Use "I / we / you" — keep it impersonal.', 'Miss a step or change the order.', 'Add reasons or opinions about the process.'],
      },
      full: {
        what: 'A 4-paragraph description of at least 150 words: Introduction → Overview → Body 1 (first half of steps) → Body 2 (second half).',
        recipe: ['<b>Para 1:</b> paraphrase the title', '<b>Para 2:</b> overview — number of stages, start/end, linear or cycle', '<b>Para 3:</b> first half of the steps in order, passive voice', '<b>Para 4:</b> second half of the steps, ending with the final product'],
        starters: ['The diagram illustrates how ___.', 'Overall, there are ___ stages, ___.', 'At the first stage, ___.', 'In the final stages, ___.'],
        high: ['The latter half of the process is concerned with ___.'],
        dont: ['Write fewer than 150 words.', 'Skip stages to save time — every stage should be mentioned.'],
      },
    },
    map: {
      intro: {
        what: 'ONE sentence saying what the maps show and the two points in time.',
        recipe: ['Swap <i>shows</i> → <i>illustrates / compares</i>', 'Name the place and the two dates / versions', 'Say it is about <b>changes</b> (or two proposals)', 'Stop.'],
        starters: ['The two maps illustrate how ___ changed between ___ and ___.', 'The maps compare ___ in ___ with ___.', 'The maps show the changes that took place in ___ over a ___-year period.'],
        high: ['The maps depict the development of ___ from ___ to the present day.'],
        dont: ['Copy the question.', 'Start listing buildings in the introduction.'],
      },
      overview: {
        what: '2–3 sentences: the <b>overall type of change</b> (more built-up? more leisure facilities?) and the biggest things added or removed. No exact positions yet.',
        recipe: ['Start with <b>Overall,</b>', 'Say the general character of the change (e.g. <i>farmland gave way to housing</i>)', 'Mention the <b>most significant additions</b> and what was <b>lost</b>', 'Say what stayed the same, if anything'],
        starters: ['Overall, the area became considerably more developed / built-up, with ___.', 'The most noticeable change was the addition of ___ and the removal of ___.', 'Several features, such as ___, remained unchanged.'],
        high: ['Overall, the area underwent a significant transformation from a largely ___ area to a ___ one.'],
        dont: ['Describe each building in detail here.', 'Skip the overview.'],
      },
      body: {
        what: 'Describe the changes by <b>location</b>, using compass directions and prepositions of place.',
        recipe: ['Go area by area: <i>In the north of the town… / To the south of the road…</i>', 'Use change verbs: <i>was built / was demolished / was replaced by / was extended / was converted into</i>', 'Contrast the two dates in each sentence: <i>In 1990 … ; by 2020 …</i>', 'Use the past passive for the "after" map'],
        starters: ['In ___, the north of the area was occupied by ___, but by ___ this had been replaced by ___.', 'A new ___ was constructed to the ___ of the ___.', 'The ___ in the ___ was demolished to make way for ___.'],
        high: ['The most dramatic transformation took place in the ___, where ___ gave way to ___.', 'Meanwhile, the ___ was retained but ___.'],
        dont: ['Forget location words — "a school was built" tells the examiner nothing about where.', 'Mix up the two dates.', 'Use the present tense for past changes.'],
      },
      full: {
        what: 'A 4-paragraph report of at least 150 words: Introduction → Overview → Body 1 (one part of the map) → Body 2 (the other part).',
        recipe: ['<b>Para 1:</b> what the maps show and the two dates', '<b>Para 2:</b> overview — overall type of change, biggest additions/removals', '<b>Para 3:</b> changes in one area (e.g. north / near the river)', '<b>Para 4:</b> changes in the other area, plus what stayed the same'],
        starters: ['The maps illustrate ___.', 'Overall, ___.', 'In the northern part, ___.', 'Turning to the south, ___.'],
        high: ['The southern section of the site saw equally significant changes: ___.'],
        dont: ['Write fewer than 150 words.', 'Describe only one map — the task is about the changes between them.'],
      },
    },
  };

  const T2 = {
    opinion: {
      label: 'Opinion (Agree / Disagree)',
      intro: { what: '2 sentences: paraphrase the statement, then give <b>your position clearly</b>.', recipe: ['Sentence 1: restate the idea in your own words', 'Sentence 2: say how far you agree — <i>completely / partly / not at all</i>', 'Optional: hint at your main reason'], starters: ['It is often argued that ___. I completely agree with this view because ___.', 'Some people believe that ___. While I accept that ___, I disagree because ___.'], high: ['Although ___ is a widely held view, I would argue that ___.', 'I am strongly in favour of ___, primarily because ___.'], dont: ['Sit on the fence — "there are good and bad points" is not a position.', 'Say "This essay will discuss…" — say what you think instead.', 'Copy the question.'] },
      body: { what: 'ONE main reason for your opinion, explained and supported with an example. One idea per paragraph.', recipe: ['Topic sentence: <i>The main reason I ___ is that ___.</i>', 'Explain: <i>This is because… / In other words, …</i>', 'Example: <i>For instance, in Vietnam…</i>', 'Link back: <i>This shows that ___.</i>'], starters: ['The main reason I agree / disagree is that ___.', 'This is because ___, which means that ___.', 'For example, ___.', 'As a result, ___.'], high: ['Firstly, and most importantly, ___.', 'A clear illustration of this is ___, where ___.', 'This demonstrates that ___.'], dont: ['Put 3 different ideas in one paragraph — pick one and develop it.', 'Give an example with no explanation.', 'Forget to link the paragraph back to your opinion.'] },
      conclusion: { what: '2–3 sentences: restate your position and summarise your main reasons. No new ideas.', recipe: ['Start: <i>In conclusion, …</i>', 'Restate your opinion in different words', 'Summarise the 1–2 reasons from your body paragraphs'], starters: ['In conclusion, I firmly believe that ___ because ___ and ___.', 'To sum up, although ___, I am convinced that ___.'], high: ['In conclusion, while there may be some merit in ___, the arguments for ___ are far more compelling.'], dont: ['Introduce a new idea.', 'Change your opinion.', 'Write "In a nutshell" — too informal.'] },
      full: { what: 'A 4–5 paragraph essay of at least 250 words with a clear position throughout.', recipe: ['<b>Intro:</b> paraphrase + your opinion', '<b>Body 1:</b> first reason + explanation + example', '<b>Body 2:</b> second reason + explanation + example', '<b>(Optional Body 3:</b> acknowledge the other side, then rebut it)', '<b>Conclusion:</b> restate opinion + summarise reasons'], starters: ['It is often argued that ___. I completely agree…', 'The main reason is that ___.', 'Another important point is that ___.', 'In conclusion, ___.'], high: ['Admittedly, ___. However, ___.'], dont: ['Write fewer than 250 words.', 'Change your position half-way through.'] },
    },
    discuss: {
      label: 'Discuss both views',
      intro: { what: '2 sentences: paraphrase BOTH views, then say what you think.', recipe: ['Sentence 1: <i>Some people argue ___, while others believe ___</i>', 'Sentence 2: give <b>your opinion</b> clearly'], starters: ['Some people argue that ___, while others believe that ___.', 'In my opinion, ___.', 'Personally, I believe that ___.'], high: ['While some ___, others feel that ___. I tend to side with the latter view because ___.'], dont: ['Copy the question.', 'Say "This essay will discuss both views" — empty words.', 'Forget your own opinion — the question asks for it.'] },
      body: { what: 'ONE view per paragraph: explain why people hold it, with an example. Body 1 = view A, Body 2 = view B (+ your view).', recipe: ['Topic sentence: <i>On the one hand, those who ___ argue that ___.</i>', 'Explain their reasoning', 'Give an example', 'If it is the view you agree with, say so: <i>I share this view because…</i>'], starters: ['On the one hand, supporters of ___ argue that ___.', 'On the other hand, those who ___ believe that ___.', 'For example, ___.', 'I agree with this view because ___.'], high: ['Proponents of ___ point out that ___.', 'Nevertheless, there is a strong case for ___.'], dont: ['Mix both views in one paragraph.', 'Only present one side — both must be discussed.', 'Write "some people think" five times — vary it: <i>supporters, advocates, critics, those who</i>.'] },
      conclusion: { what: '2–3 sentences: briefly acknowledge both views and restate which one you support.', recipe: ['Start: <i>In conclusion, …</i>', 'Sum up: <i>while ___ has some merit, ___</i>', 'Restate your opinion'], starters: ['In conclusion, although there are arguments on both sides, I believe that ___.', 'To sum up, while ___, I am convinced that ___.'], high: ['In conclusion, although both positions have their merits, the case for ___ is ultimately stronger.'], dont: ['Introduce a new argument.', 'Give a different opinion from your introduction.'] },
      full: { what: 'A 4-paragraph essay of at least 250 words: Intro → View A → View B + your view → Conclusion.', recipe: ['<b>Intro:</b> both views + your opinion', '<b>Body 1:</b> view A — why people hold it + example', '<b>Body 2:</b> view B — why people hold it + example + which you support', '<b>Conclusion:</b> summary + your opinion'], starters: ['Some people argue that ___, while others ___.', 'On the one hand, ___.', 'On the other hand, ___.', 'In conclusion, ___.'], high: ['Having considered both perspectives, ___.'], dont: ['Spend 80% of the essay on one view.', 'Forget to give your own opinion.'] },
    },
    problem: {
      label: 'Problem / Solution',
      intro: { what: '2 sentences: paraphrase the situation, then say you will look at the causes/problems and solutions.', recipe: ['Sentence 1: restate the problem', 'Sentence 2: <i>This essay will examine the main causes and suggest some solutions.</i>'], starters: ['___ has become a serious issue in many countries.', 'This essay will discuss the main causes of this problem and propose some possible solutions.'], high: ['___ is an increasingly pressing concern in ___. This essay examines why this is happening and what can be done about it.'], dont: ['Give the solutions in the intro.', 'Copy the question.'] },
      body: { what: 'Body 1 = causes/problems. Body 2 = solutions. Each: 2 points, explained, with an example.', recipe: ['Topic sentence: <i>There are two main causes of ___.</i> / <i>Several measures could address this.</i>', 'Point 1 + explanation', 'Point 2 + explanation', 'Example for at least one point', 'Match each solution to a cause if you can'], starters: ['The main cause of ___ is ___.', 'Another contributing factor is ___.', 'One effective solution would be for governments to ___.', 'In addition, individuals could ___.'], high: ['This problem stems largely from ___.', 'Perhaps the most practical measure would be to ___, which would ___.'], dont: ['List 5 causes with no explanation — 2 well-explained points beat 5 shallow ones.', 'Give solutions that do not match your causes.', 'Use "the government should" for every solution — vary who acts.'] },
      conclusion: { what: '2 sentences: summarise the main cause(s) and solution(s).', recipe: ['Start: <i>In conclusion, …</i>', 'Name the key cause and key solution again in new words'], starters: ['In conclusion, ___ is mainly caused by ___, and the most effective solution is ___.', 'To sum up, although this problem is serious, it can be tackled by ___.'], high: ['In conclusion, while ___ is a complex problem, a combination of ___ and ___ would go a long way towards solving it.'], dont: ['Add a new solution.', 'Just repeat the introduction word for word.'] },
      full: { what: 'A 4-paragraph essay of at least 250 words: Intro → Causes/Problems → Solutions → Conclusion.', recipe: ['<b>Intro:</b> paraphrase + outline', '<b>Body 1:</b> 2 causes or problems, explained', '<b>Body 2:</b> 2 solutions, matched to the causes', '<b>Conclusion:</b> summary'], starters: ['___ has become a serious issue.', 'The main cause is ___.', 'One solution would be ___.', 'In conclusion, ___.'], high: ['Addressing this issue requires action on two fronts: ___.'], dont: ['Write only about problems and forget the solutions (or vice versa).'] },
    },
    advdis: {
      label: 'Advantages / Disadvantages',
      intro: { what: '2 sentences: paraphrase the trend, then say you will consider both sides (and, if asked "outweigh", give your verdict).', recipe: ['Sentence 1: restate the development', 'Sentence 2: <i>This essay will look at the benefits and drawbacks</i> — and if the question says <b>outweigh</b>, state which side wins'], starters: ['In recent years, ___ has become increasingly common.', 'This essay will discuss the advantages and disadvantages of this trend.', 'While this has some drawbacks, I believe the benefits are greater.'], high: ['The growing trend of ___ has both positive and negative implications, though in my view the former outweigh the latter.'], dont: ['Forget your verdict when the question says "outweigh".', 'Copy the question.'] },
      body: { what: 'Body 1 = advantages, Body 2 = disadvantages. 1–2 points each, explained with an example.', recipe: ['Topic sentence: <i>The main advantage of ___ is ___.</i>', 'Explain why it is a benefit', 'Example', 'Same structure for the disadvantage paragraph'], starters: ['The main advantage of ___ is that ___.', 'A further benefit is ___.', 'On the other hand, the biggest drawback is ___.', 'For instance, ___.'], high: ['Perhaps the most significant benefit is ___, since ___.', 'However, this trend is not without its drawbacks. ___'], dont: ['Mix advantages and disadvantages in one paragraph.', 'List points with no explanation.'] },
      conclusion: { what: '2 sentences: summarise both sides; if "outweigh", repeat your verdict.', recipe: ['Start: <i>In conclusion, …</i>', 'One clause for each side', 'Verdict if required'], starters: ['In conclusion, while ___ has some drawbacks such as ___, the advantages, particularly ___, are more significant.', 'To sum up, ___ brings both benefits and problems, but ___.'], high: ['On balance, the benefits of ___ clearly outweigh its disadvantages.'], dont: ['Give a verdict in the conclusion that contradicts the introduction.'] },
      full: { what: 'A 4-paragraph essay of at least 250 words: Intro → Advantages → Disadvantages → Conclusion (+ verdict if asked).', recipe: ['<b>Intro:</b> paraphrase + outline (+ verdict)', '<b>Body 1:</b> 1–2 advantages', '<b>Body 2:</b> 1–2 disadvantages', '<b>Conclusion:</b> summary (+ verdict)'], starters: ['In recent years, ___.', 'The main advantage is ___.', 'However, there are also drawbacks. ___', 'In conclusion, ___.'], high: ['Weighing up both sides, ___.'], dont: ['Write far more about one side than the other unless you are arguing "outweigh".'] },
    },
    twopart: {
      label: 'Two-part question',
      intro: { what: '2 sentences: paraphrase the situation, then say you will answer both questions.', recipe: ['Sentence 1: restate the situation', 'Sentence 2: brief answer to both questions, or say you will discuss them'], starters: ['In recent years, ___.', 'This essay will explain why this is happening and consider whether it is a positive or negative development.', 'There are several reasons for this, and I believe it is largely ___.'], high: ['The reasons behind this shift are varied, and in my view its overall impact is ___.'], dont: ['Answer only one of the two questions.', 'Copy the question.'] },
      body: { what: 'Body 1 answers question 1; Body 2 answers question 2. Each with 2 points and an example.', recipe: ['Topic sentence that clearly answers the question: <i>There are two main reasons why ___.</i>', 'Point 1 + explanation', 'Point 2 + explanation', 'Example', 'Body 2: <i>In my view, this is a positive development because…</i>'], starters: ['There are two main reasons why ___.', 'Firstly, ___. Secondly, ___.', 'In my opinion, this is a positive / negative development because ___.', 'For example, ___.'], high: ['This trend can be attributed primarily to ___.', 'While some may see this as ___, I believe the effects are largely ___.'], dont: ['Forget the second question — a very common mistake.', 'Answer "is it positive or negative?" with "both" and no reasons.'] },
      conclusion: { what: '2 sentences: one for each question.', recipe: ['Start: <i>In conclusion, …</i>', 'Summarise the reasons (Q1)', 'Restate your view (Q2)'], starters: ['In conclusion, ___ is happening mainly because of ___, and I believe this is a ___ development.', 'To sum up, ___.'], high: ['In conclusion, while ___ is driven by ___, its consequences are, on balance, ___.'], dont: ['Answer only one question in the conclusion.'] },
      full: { what: 'A 4-paragraph essay of at least 250 words: Intro → Answer Q1 → Answer Q2 → Conclusion.', recipe: ['<b>Intro:</b> paraphrase + outline', '<b>Body 1:</b> question 1 — 2 points + example', '<b>Body 2:</b> question 2 — 2 points + example', '<b>Conclusion:</b> one sentence per question'], starters: ['In recent years, ___.', 'There are two main reasons for this. ___', 'In my view, this is a ___ development. ___', 'In conclusion, ___.'], high: ['Turning to the second question, ___.'], dont: ['Give both questions half a paragraph each — they deserve a full paragraph each.'] },
    },
  };

  /* ═══════════════════ DATA FACTS ═══════════════════ */
  const TYPE_NAME = { line: 'line graph', bar: 'bar chart', pie: 'pie charts', table: 'table', mixed: 'chart', process: 'diagram', map: 'maps' };
  const VERBS = { line: ['illustrates', 'shows how', 'gives information about'], bar: ['compares', 'illustrates', 'gives information about'], pie: ['show', 'compare', 'give a breakdown of'], table: ['gives information about', 'compares', 'presents data on'], mixed: ['illustrates', 'gives information about'], process: ['illustrates', 'describes'], map: ['illustrate', 'compare', 'depict'] };

  // turn a chart into a list of "entities" measured across "labels"
  function entities(t) {
    const d = t.data;
    if (t.type === 'line') return { axis: 'time', labels: d.cats.map(String), items: d.series.map((s) => ({ name: s.name, values: s.values })), unit: d.unit };
    if (t.type === 'bar' || t.type === 'table') {
      const timeAxis = isYear(d.series[0].name);
      return { axis: timeAxis ? 'time' : 'group', labels: d.series.map((s) => s.name), items: d.cats.map((c, i) => ({ name: c, values: d.series.map((s) => s.values[i]) })), unit: d.unit };
    }
    if (t.type === 'pie') return { axis: 'pie', labels: d.series.map((s) => s.name), items: d.cats.map((c, i) => ({ name: c, values: d.series.map((s) => s.values[i]) })), unit: '%' };
    if (t.type === 'mixed') return { axis: 'time', mixed: true, labels: d.cats.map(String), items: [{ name: d.bar.name, values: d.bar.values, unit: d.bar.unit, rng: t.scn.bar.range[1] - t.scn.bar.range[0] }, { name: d.line.name, values: d.line.values, unit: d.line.unit, rng: t.scn.line.range[1] - t.scn.line.range[0] }] };
    return null;
  }

  function timeFacts(e) {
    const first = e.labels[0], last = e.labels[e.labels.length - 1];
    const allVals = e.items.flatMap((i) => i.values);
    const range = Math.max(...allVals) - Math.min(...allVals) || 1;
    const items = e.items.map((it) => {
      const s = it.values[0], en = it.values[it.values.length - 1];
      const ch = en - s;
      const rng = it.rng || range;
      const dir = Math.abs(ch) < 0.06 * rng ? 'stable' : ch > 0 ? 'rise' : 'fall';
      const max = Math.max(...it.values), maxI = it.values.indexOf(max);
      const min = Math.min(...it.values), minI = it.values.indexOf(min);
      const peak = maxI !== 0 && maxI !== it.values.length - 1 && max - Math.max(s, en) > 0.12 * rng ? e.labels[maxI] : null;
      const dip = minI !== 0 && minI !== it.values.length - 1 && Math.min(s, en) - min > 0.12 * rng ? e.labels[minI] : null;
      return { ...it, s, en, ch, dir, rng, max, maxL: e.labels[maxI], min, minL: e.labels[minI], peak, dip, unit: it.unit || e.unit };
    });
    const by = (k, desc) => items.slice().sort((a, b) => desc ? b[k] - a[k] : a[k] - b[k])[0];
    const risers = items.filter((i) => i.dir === 'rise'), fallers = items.filter((i) => i.dir === 'fall'), stable = items.filter((i) => i.dir === 'stable');
    const highestEnd = by('en', true), lowestEnd = by('en', false), highestStart = by('s', true);
    const highestAll = by('max', true), lowestAll = by('min', false);
    // is one item highest at every point?
    const throughout = items.find((it) => e.labels.every((_, li) => items.every((o) => o === it || it.values[li] >= o.values[li])));
    const lowestThroughout = items.find((it) => e.labels.every((_, li) => items.every((o) => o === it || it.values[li] <= o.values[li])));
    const bigRise = risers.length ? risers.slice().sort((a, b) => b.ch - a.ch)[0] : null;
    const bigFall = fallers.length ? fallers.slice().sort((a, b) => a.ch - b.ch)[0] : null;
    return { first, last, items, risers, fallers, stable, highestEnd, lowestEnd, highestStart, highestAll, lowestAll, throughout, lowestThroughout, bigRise, bigFall };
  }

  const dirVerb = (it) => it.dir === 'rise' ? 'rose' : it.dir === 'fall' ? 'fell' : 'remained fairly stable';
  const dirNoun = (it) => it.dir === 'rise' ? 'an increase' : it.dir === 'fall' ? 'a decrease' : 'little change';
  const strength = (it, range) => { const r = Math.abs(it.ch) / (it.rng || range); return r > 0.5 ? 'dramatically' : r > 0.25 ? 'significantly' : r > 0.1 ? 'steadily' : 'slightly'; };
  const trend = (it, range) => it.dir === 'stable' ? 'remained fairly stable' : dirVerb(it) + ' ' + strength(it, range);

  /* ── dynamic sections per family ── */
  function dataSection(t, part, band) {
    const e = entities(t);
    const scn = t.scn;
    const ent = scn.ent || 'categories';
    if (e.axis === 'pie') return pieSection(t, e, part);
    if (e.axis === 'group') return groupSection(t, e, part);
    const f = timeFacts(e);
    const allVals = e.items.flatMap((i) => i.values);
    const range = Math.max(...allVals) - Math.min(...allVals) || 1;
    const u = (it, v) => fmt(v, it.unit);
    const n = f.items.length;

    if (part === 'intro') return introSection(t);

    if (part === 'overview') {
      const facts = [];
      if (f.throughout) facts.push(`Highest <b>throughout</b>: <b>${esc(f.throughout.name)}</b>`);
      else facts.push(`Highest at the start: <b>${esc(f.highestStart.name)}</b> · highest at the end: <b>${esc(f.highestEnd.name)}</b>`);
      if (f.lowestThroughout) facts.push(`Lowest throughout: <b>${esc(f.lowestThroughout.name)}</b>`);
      else facts.push(`Lowest at the end: <b>${esc(f.lowestEnd.name)}</b>`);
      if (f.bigRise) facts.push(`Biggest increase: <b>${esc(f.bigRise.name)}</b> (${u(f.bigRise, f.bigRise.s)} → ${u(f.bigRise, f.bigRise.en)})`);
      if (f.bigFall) facts.push(`Biggest decrease: <b>${esc(f.bigFall.name)}</b> (${u(f.bigFall, f.bigFall.s)} → ${u(f.bigFall, f.bigFall.en)})`);
      const peaks = f.items.filter((i) => i.peak).map((i) => `${i.name} peaked in ${i.peak}`);
      const dips = f.items.filter((i) => i.dip).map((i) => `${i.name} dipped in ${i.dip}`);
      if (peaks.length || dips.length) facts.push(`Turning points: ${esc(peaks.concat(dips).join('; '))}`);
      facts.push(`Pattern: <b>${f.risers.length} of ${n} ${esc(ent)} rose</b>, ${f.fallers.length} fell, ${f.stable.length} stayed roughly the same`);

      let ex;
      if (e.mixed) {
        const [b, l] = f.items;
        ex = `Overall, ${lc(b.name)} ${trend(b, range)} between ${f.first} and ${f.last}, while ${lc(l.name)} ${trend(l, range)} over the same period.${b.peak ? ` The figure for ${lc(b.name)} peaked in ${b.peak}.` : b.dip ? ` The figure for ${lc(b.name)} dipped to its lowest level in ${b.dip}.` : ''}`;
      } else {
        const s1 = f.throughout ? `Overall, ${f.throughout.name} recorded the highest figure throughout the period, while ${f.lowestThroughout ? f.lowestThroughout.name : f.lowestEnd.name} ${f.lowestThroughout ? 'remained the lowest' : 'was the lowest by ' + f.last}.` : `Overall, ${f.highestEnd.name} had the highest figure by ${f.last}, having overtaken ${f.highestStart.name}, while ${f.lowestEnd.name} was the lowest.`;
        let s2;
        if (f.risers.length && f.risers.length >= f.fallers.length) {
          s2 = `${f.risers.length === n ? 'All' : cap(nw(f.risers.length)) + ' of the ' + nw(n)} ${ent} saw ${f.risers.length === n ? 'an increase' : 'increases'} over the period, with ${f.bigRise.name} showing the most dramatic growth`;
          s2 += f.fallers.length ? `, whereas ${list(f.fallers.map((i) => i.name))} declined.` : f.stable.length ? `, while ${list(f.stable.map((i) => i.name))} changed little.` : '.';
        } else if (f.fallers.length) {
          s2 = `${f.fallers.length === n ? 'All' : cap(nw(f.fallers.length)) + ' of the ' + nw(n)} ${ent} declined, with ${f.bigFall.name} falling the most sharply`;
          s2 += f.risers.length ? `, whereas ${list(f.risers.map((i) => i.name))} rose.` : f.stable.length ? `, while ${list(f.stable.map((i) => i.name))} remained stable.` : '.';
        } else {
          s2 = `The figures for all ${ent} remained relatively stable over the period.`;
        }
        ex = s1 + ' ' + s2;
      }
      return { title: 'For this chart', facts, exampleLabel: 'Your overview could be', example: ex };
    }

    if (part === 'body' || part === 'full') {
      const facts = [];
      f.items.forEach((it) => facts.push(`<b>${esc(it.name)}</b>: ${u(it, it.s)} (${f.first}) → ${u(it, it.en)} (${f.last}) — ${dirVerb(it)}${it.peak ? `, peaking at ${u(it, it.max)} in ${it.peak}` : ''}${it.dip ? `, dipping to ${u(it, it.min)} in ${it.dip}` : ''}`));
      let ex;
      if (e.mixed) {
        const [b, l] = f.items;
        ex = `In ${f.first}, ${lc(b.name)} stood at ${u(b, b.s)}, and ${b.dir === 'stable' ? 'this figure changed little, ending at' : 'this ' + dirVerb(b) + ' to'} ${u(b, b.en)} by ${f.last}${b.peak ? `, having peaked at ${u(b, b.max)} in ${b.peak}` : ''}. Meanwhile, ${lc(l.name)} ${l.dir === 'stable' ? 'remained close to' : dirVerb(l) + ' from ' + u(l, l.s) + ' to'} ${u(l, l.en)} over the same period.`;
      } else {
        const atStart = f.items.slice().sort((a, b) => b.s - a.s);
        const top = atStart[0], bottom = atStart[atStart.length - 1];
        ex = `In ${f.first}, ${top.name} had the highest figure at ${u(top, top.s)}, compared with just ${u(bottom, bottom.s)} for ${bottom.name}.`;
        if (f.bigRise) ex += ` ${f.bigRise.name} then ${f.bigRise.ch > 0.5 * range ? 'saw a dramatic increase' : 'rose ' + strength(f.bigRise, range)}, ${f.bigRise === top ? 'reaching' : 'from ' + u(f.bigRise, f.bigRise.s) + ' to'} ${u(f.bigRise, f.bigRise.en)} by ${f.last}.`;
        if (f.bigFall) ex += ` In contrast, ${f.bigFall.name} fell from ${u(f.bigFall, f.bigFall.s)} to ${u(f.bigFall, f.bigFall.en)} over the same period.`;
        if (!f.bigRise && !f.bigFall) ex += ` These figures changed very little, with ${top.name} ending the period at ${u(top, top.en)}.`;
      }
      const label = part === 'full' ? 'Your body paragraphs could start' : 'Your body paragraph could start';
      const res = { title: part === 'full' ? 'For this chart — figures to use' : 'For this chart — details to compare', facts, exampleLabel: label, example: ex };
      if (part === 'full') {
        const ov = dataSection(t, 'overview', band);
        const intro = introSection(t);
        res.plan = [`<b>Intro:</b> ${esc(intro.example)}`, `<b>Overview:</b> ${esc(ov.example)}`, `<b>Body 1:</b> ${esc(ex)}`, `<b>Body 2:</b> the remaining ${esc(ent)} — ${esc(list(f.items.filter((i) => i !== f.bigRise && i !== f.bigFall).map((i) => i.name)) || 'compare the final year')}`];
      }
      return res;
    }
  }

  function groupSection(t, e, part) {
    if (part === 'intro') return introSection(t);
    const [gA, gB] = e.labels;
    const items = e.items.map((it) => ({ ...it, a: it.values[0], b: it.values[1], gap: it.values[0] - it.values[1] }));
    const aWins = items.filter((i) => i.gap > 0), bWins = items.filter((i) => i.gap < 0);
    const bigGap = items.slice().sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))[0];
    const hiA = items.slice().sort((a, b) => b.a - a.a)[0], hiB = items.slice().sort((a, b) => b.b - a.b)[0];
    const loAll = items.slice().sort((a, b) => Math.min(a.a, a.b) - Math.min(b.a, b.b))[0];
    const u = (v) => fmt(v, e.unit);
    const ent = t.scn.ent || 'categories';
    const facts = [
      `<b>${esc(gA)}</b> higher in ${aWins.length} of ${items.length} ${esc(ent)} · <b>${esc(gB)}</b> higher in ${bWins.length}`,
      `Biggest gap: <b>${esc(bigGap.name)}</b> (${esc(gA)} ${u(bigGap.a)} vs ${esc(gB)} ${u(bigGap.b)})`,
      `Highest for ${esc(gA)}: <b>${esc(hiA.name)}</b> (${u(hiA.a)}) · highest for ${esc(gB)}: <b>${esc(hiB.name)}</b> (${u(hiB.b)})`,
      `Lowest figure overall: <b>${esc(loAll.name)}</b> (${u(Math.min(loAll.a, loAll.b))})`,
    ];
    if (part === 'overview') {
      const lead = aWins.length >= bWins.length ? [gA, gB, aWins.length] : [gB, gA, bWins.length];
      const ex = `Overall, the figures for ${lead[0].toLowerCase()} were higher than those for ${lead[1].toLowerCase()} in ${lead[2] === items.length ? 'every category' : nw(lead[2]) + ' of the ' + nw(items.length) + ' ' + ent}, with the widest gap in ${bigGap.name}. ${hiA.name === hiB.name ? hiA.name + ' recorded the highest figures for both groups' : hiA.name + ' had the highest figure for ' + gA.toLowerCase() + ', whereas ' + hiB.name + ' was highest for ' + gB.toLowerCase()}, while ${loAll.name} had the lowest overall.`;
      return { title: 'For this chart', facts, exampleLabel: 'Your overview could be', example: ex };
    }
    const ex = `The largest difference between ${gA.toLowerCase()} and ${gB.toLowerCase()} was in ${bigGap.name}, where the figures were ${u(bigGap.a)} and ${u(bigGap.b)} respectively. ${hiA.name} recorded the highest figure for ${gA.toLowerCase()} at ${u(hiA.a)}, compared with ${u(hiA.b)} for ${gB.toLowerCase()}. In contrast, ${loAll.name} had the lowest figure, at just ${u(Math.min(loAll.a, loAll.b))}.`;
    const res = { title: 'For this chart — details to compare', facts: items.map((i) => `<b>${esc(i.name)}</b>: ${esc(gA)} ${u(i.a)} · ${esc(gB)} ${u(i.b)}`), exampleLabel: 'Your body paragraph could start', example: ex };
    if (part === 'full') { const ov = groupSection(t, e, 'overview'); res.plan = [`<b>Intro:</b> ${esc(introSection(t).example)}`, `<b>Overview:</b> ${esc(ov.example)}`, `<b>Body 1:</b> ${esc(ex)}`, `<b>Body 2:</b> the remaining ${esc(ent)}`]; }
    return res;
  }

  function pieSection(t, e, part) {
    if (part === 'intro') return introSection(t);
    const pies = e.labels.map((lab, pi) => {
      const shares = e.items.map((it) => ({ name: it.name, v: it.values[pi] })).sort((a, b) => b.v - a.v);
      return { lab, shares, top: shares[0], second: shares[1], bottom: shares[shares.length - 1] };
    });
    const two = pies.length > 1;
    const changes = two ? e.items.map((it) => ({ name: it.name, a: it.values[0], b: it.values[1], ch: it.values[1] - it.values[0] })).sort((a, b) => Math.abs(b.ch) - Math.abs(a.ch)) : [];
    const up = changes.filter((c) => c.ch > 2), down = changes.filter((c) => c.ch < -2);
    const facts = pies.map((p) => `<b>${esc(p.lab)}</b>: largest = ${esc(p.top.name)} (${p.top.v}%), smallest = ${esc(p.bottom.name)} (${p.bottom.v}%)`);
    if (two) {
      facts.push(`Biggest change: <b>${esc(changes[0].name)}</b> ${changes[0].a}% → ${changes[0].b}% (${changes[0].ch > 0 ? '+' : ''}${changes[0].ch} points)`);
      facts.push(`Grew: ${esc(list(up.map((c) => c.name)) || 'none')} · Shrank: ${esc(list(down.map((c) => c.name)) || 'none')}`);
    }
    const [p1, p2] = pies;
    if (part === 'overview') {
      let ex;
      if (two) {
        const sameTop = p1.top.name === p2.top.name;
        ex = `Overall, ${p1.top.name} accounted for the largest share in ${p1.lab}${sameTop ? ' and remained the largest category in ' + p2.lab : ', but by ' + p2.lab + ' ' + p2.top.name + ' had become the largest'}, while ${p1.bottom.name === p2.bottom.name ? p1.bottom.name + ' was the smallest in both' : p1.bottom.name + ' and ' + p2.bottom.name + ' were the smallest in ' + p1.lab + ' and ' + p2.lab + ' respectively'}. The most significant change was in ${changes[0].name}, whose share ${changes[0].ch > 0 ? 'rose' : 'fell'} considerably${(() => { const opp = (changes[0].ch > 0 ? down : up).filter((c) => c !== changes[0]).slice(0, 2); return opp.length ? ', whereas ' + list(opp.map((c) => c.name)) + (changes[0].ch > 0 ? ' declined' : ' grew') : ''; })()}.`;
      } else {
        ex = `Overall, ${p1.top.name} made up the largest share, followed by ${p1.second.name}, while ${p1.bottom.name} accounted for the smallest proportion.`;
      }
      return { title: 'For this chart', facts, exampleLabel: 'Your overview could be', example: ex };
    }
    let ex;
    if (two) {
      ex = `In ${p1.lab}, ${p1.top.name} was the largest category at ${p1.top.v}%, followed by ${p1.second.name} with ${p1.second.v}%, while ${p1.bottom.name} made up just ${p1.bottom.v}%. By ${p2.lab}, the share of ${changes[0].name} had ${changes[0].ch > 0 ? 'risen' : 'fallen'} to ${changes[0].b}%${changes[1] ? ', and ' + changes[1].name + ' ' + (changes[1].ch > 0 ? 'increased' : 'decreased') + ' from ' + changes[1].a + '% to ' + changes[1].b + '%' : ''}.`;
    } else {
      ex = `${p1.top.name} accounted for the largest share at ${p1.top.v}%, followed by ${p1.second.name} at ${p1.second.v}%. At the other end of the scale, ${p1.bottom.name} represented only ${p1.bottom.v}%.`;
    }
    const res = { title: 'For this chart — figures to compare', facts: e.items.map((it) => `<b>${esc(it.name)}</b>: ${e.labels.map((l, i) => esc(l) + ' ' + it.values[i] + '%').join(' · ')}`), exampleLabel: 'Your body paragraph could start', example: ex };
    if (part === 'full') { const ov = pieSection(t, e, 'overview'); res.plan = [`<b>Intro:</b> ${esc(introSection(t).example)}`, `<b>Overview:</b> ${esc(ov.example)}`, `<b>Body 1:</b> ${esc(ex)}`, `<b>Body 2:</b> ${two ? 'the categories that changed least' : 'the middle categories'}`]; }
    return res;
  }

  function periodPhrase(t) {
    const c = t.data ? t.data.cats : [];
    const s = t.scn.series || [];
    if (t.type === 'pie' || t.type === 'bar' || t.type === 'table') {
      if (isYear(s[0])) return s.length === 2 ? { orig: `in ${s.join(' and ')}`, alt: [`in two different years, ${s.join(' and ')}`, `over a ${s[1] - s[0]}-year period`] } : { orig: `in ${s.join(', ')}`, alt: [`at three points between ${s[0]} and ${s[s.length - 1]}`] };
      return null;
    }
    if (isYear(c[0])) return { orig: `between ${c[0]} and ${c[c.length - 1]}`, alt: [`over a ${c[c.length - 1] - c[0]}-year period from ${c[0]} to ${c[c.length - 1]}`, `from ${c[0]} to ${c[c.length - 1]}`] };
    return null;
  }

  function introSection(t) {
    const scn = t.scn;
    const typeName = TYPE_NAME[t.type];
    const verbs = VERBS[t.type];
    const per = periodPhrase(t);
    const plural = t.type === 'pie' || t.type === 'map';
    const rows = [
      [`The ${typeName} show${plural ? '' : 's'}`, verbs.map((v) => `The ${typeName} ${v}`).join(' · ')],
      [t.type === 'process' || t.type === 'map' ? lc(scn.title) : 'the ' + lc(scn.title), scn.para],
    ];
    if (per) rows.push([per.orig, per.alt.join(' · ')]);
    const unit = t.data && t.data.unit && t.data.unit !== '%' ? `, measured in ${t.data.unit}` : '';
    const example = t.type === 'process' ? `The diagram ${verbs[0]} ${scn.para}.`
      : t.type === 'map' ? `The two maps ${verbs[0]} ${scn.para}.`
      : `The ${typeName} ${verbs[0]} ${scn.para}${per ? ' ' + per.alt[0] : ''}${unit}.`;
    return { title: 'For this chart — words to swap', table: rows, exampleLabel: 'Your introduction could be', example };
  }

  // "Beans fermented (5-7 days)" -> "beans are fermented"; "Roasted at 350°C" -> "it is roasted at 350°C"
  const IRREG = ['grown', 'cut', 'sold', 'built', 'sent', 'made', 'laid', 'dug', 'put', 'spun', 'fed', 'set'];
  const PREP = ['in', 'into', 'with', 'by', 'at', 'to', 'and', 'from', 'for', 'on', 'through', 'along', 'onto', 'under'];
  const isPart = (w) => IRREG.includes(w.toLowerCase()) || (/ed$/.test(w) && w.length > 3);
  function stepSentence(step, subj) {
    const clean = step.replace(/\s*\([^)]*\)/g, '').trim();
    const toks = clean.split(/\s+/);
    let i = toks.findIndex((w, idx) => isPart(w) && !(idx === 0 && toks[1] && !PREP.includes(toks[1].toLowerCase()) && !/[,:]$/.test(w)));
    if (i === 0) return `${subj} is ${lc(clean)}`;
    if (i > 0) {
      const subject = toks.slice(0, i).join(' ');
      const plural = /s$/i.test(toks[i - 1]) && !/ss$/i.test(toks[i - 1]);
      return `${lc(subject)} ${plural ? 'are' : 'is'} ${toks.slice(i).join(' ')}`;
    }
    return lc(clean);
  }

  function processSection(t, part) {
    if (part === 'intro') return introSection(t);
    const scn = t.scn;
    const steps = scn.steps;
    const n = steps.length;
    const half = Math.ceil(n / 2);
    const facts = [`<b>${n} stages</b> · starts with <b>${esc(steps[0])}</b> · ends with <b>${esc(steps[n - 1])}</b>`, scn.cycle ? '<b>Cycle</b> — the last stage leads back to the first' : '<b>Linear</b> — a clear beginning and end', `Possible split: stages 1–${half} and stages ${half + 1}–${n}`];
    const seq = ['First,', 'Next,', 'After that,', 'Then', 'Following this,', 'Subsequently,', 'Once this is complete,', 'After this,', 'Finally,'];
    const sentence = (i) => `${i === n - 1 ? 'Finally,' : i === 0 ? 'The process begins when' : seq[Math.min(i, seq.length - 2)]} ${stepSentence(steps[i], 'it')}.`;
    const short = (st) => st.replace(/\s*\([^)]*\)/g, '').trim();
    if (part === 'overview') {
      const ex = `Overall, the process consists of ${nw(n)} main stages, beginning when ${stepSentence(steps[0], 'the raw material')} and ending when ${stepSentence(steps[n - 1], 'the product')}. ${scn.cycle ? 'It is a cyclical process, as the final stage leads back to the beginning.' : `It is a linear process which can be broadly divided into two phases: stages 1–${half} (${lc(short(steps[0]))} → ${lc(short(steps[half - 1]))}) and stages ${half + 1}–${n} (${lc(short(steps[half]))} → ${lc(short(steps[n - 1]))}).`}`;
      return { title: 'For this diagram', facts, exampleLabel: 'Your overview could be', example: ex };
    }
    const body1 = steps.slice(0, half).map((_, i) => sentence(i)).join(' ');
    const body2 = steps.slice(half).map((_, i) => sentence(half + i)).join(' ');
    const res = { title: 'For this diagram — the stages', facts: steps.map((s, i) => `<b>${i + 1}.</b> ${esc(s)}`), exampleLabel: part === 'full' ? 'Body 1 could be' : 'Your body paragraph could be', example: body1, note: 'These are skeleton sentences — add the details from the diagram (times, temperatures, places) and vary the linking words.' };
    if (part === 'full') { res.plan = [`<b>Intro:</b> ${esc(introSection(t).example)}`, `<b>Overview:</b> ${esc(processSection(t, 'overview').example)}`, `<b>Body 1 (stages 1–${half}):</b> ${esc(body1)}`, `<b>Body 2 (stages ${half + 1}–${n}):</b> ${esc(body2)}`]; }
    return res;
  }

  function mapSection(t, part) {
    if (part === 'intro') return introSection(t);
    const [p1, p2] = t.scn.panels;
    const base = (l) => l.replace(/\s*\(.*\)$/, '').replace(/\s*&.*$/, '').trim().toLowerCase();
    const named = (p) => { const seen = new Set(); return p.items.filter((i) => i.label && i.w * i.h < 2500 && !seen.has(base(i.label)) && seen.add(base(i.label))); };
    const IN = { now: 'At present', before: 'Before the development', today: 'Today', after: 'After the redevelopment' };
    const inAt = (l) => isYear(l) ? `In ${l}` : IN[l.toLowerCase()] || `In ${l}`;
    const span = (a, b) => isYear(a) && isYear(b) ? `between ${a} and ${b}` : `between ${when(a)} and ${when(b)}`;
    const pos = (i) => {
      const cx = i.x + i.w / 2, cy = i.y + i.h / 2;
      const ns = cy < 23 ? 'north' : cy > 46 ? 'south' : '';
      const ew = cx < 33 ? 'west' : cx > 66 ? 'east' : '';
      return ns && ew ? ns + '-' + ew : ns || ew || 'centre';
    };
    const m1 = new Map(named(p1).map((i) => [base(i.label), i]));
    const m2 = new Map(named(p2).map((i) => [base(i.label), i]));
    const added = named(p2).filter((i) => !m1.has(base(i.label)));
    const removed = named(p1).filter((i) => !m2.has(base(i.label)));
    const kept = named(p1).filter((i) => m2.has(base(i.label)));
    const changed = kept.filter((i) => m2.get(base(i.label)).label !== i.label || m2.get(base(i.label)).w * m2.get(base(i.label)).h !== i.w * i.h);
    const builtUp = added.filter((i) => i.kind === 'building').length - removed.filter((i) => i.kind === 'building').length;
    const green = added.filter((i) => i.kind === 'green').length - removed.filter((i) => i.kind === 'green').length;
    const withPos = (arr) => arr.map((i) => `${i.label} (${pos(i)})`);
    const the = (arr) => list(arr.map((i) => 'the ' + lc(i.label)));
    const anList = (arr) => list(arr.map((i) => an(lc(i.label))));
    const WHEN = { today: 'the present day', now: 'the current layout', after: 'the proposed layout', before: 'the original layout' };
    const when = (l) => isYear(l) ? l : WHEN[l.toLowerCase()] || l;
    const prio = { building: 0, green: 1, beach: 2, water: 3, road: 4 };
    kept.sort((a, b) => prio[a.kind] - prio[b.kind]);
    const facts = [
      `<b>Added in ${esc(p2.label)}:</b> ${esc(list(withPos(added)) || 'nothing')}`,
      `<b>Removed:</b> ${esc(list(withPos(removed)) || 'nothing')}`,
      `<b>Kept:</b> ${esc(list(kept.map((i) => i.label)) || 'nothing')}${changed.length ? ' — changed: ' + esc(list(changed.map((i) => i.label + ' → ' + m2.get(base(i.label)).label))) : ''}`,
      `Character: ${builtUp > 0 ? '<b>more built-up</b>' : builtUp < 0 ? '<b>less built-up</b>' : 'similar amount of building'}${green < 0 ? ', <b>less green space</b>' : green > 0 ? ', <b>more green space</b>' : ''}`,
    ];
    const proposals = /proposal/i.test(p1.label);
    if (part === 'overview') {
      const ex = proposals
        ? `Overall, both proposals include ${kept.length ? the(kept.slice(0, 3)) : 'the same main buildings'}, but they differ in where these are placed. ${added.length ? `Only ${p2.label} includes ${anList(added)}` : 'The two layouts use the space quite differently'}${removed.length ? `, while ${the(removed)} appear${removed.length > 1 ? '' : 's'} only in ${p1.label}` : ''}.`
        : `Overall, the area became ${builtUp > 0 ? 'considerably more developed' : 'noticeably different'} ${span(p1.label, p2.label)}${green < 0 ? ', with green space giving way to new buildings' : ''}. The most significant changes were the addition of ${anList(added.slice(0, 3))}${removed.length ? ', together with the removal of ' + the(removed.slice(0, 2)) : ''}, while ${kept.length ? the(kept.slice(0, 2)) + ' remained in place' : 'almost nothing stayed the same'}.`;
      return { title: 'For these maps', facts, exampleLabel: 'Your overview could be', example: ex };
    }
    let ex;
    const plural = (i) => /s$/i.test(base(i.label)) && !/ss$/i.test(base(i.label));
    const feat = (i) => /land$|trees$|^water$|^river$/i.test(base(i.label)) ? lc(i.label) : an(lc(i.label)); // "a factory", "a sports field", but "farmland"
    const other = (arr, ref) => arr.find((i) => i !== ref && pos(i) !== pos(ref)) || arr.find((i) => i !== ref);
    if (proposals) {
      const k0 = kept[0] || p1.items[0];
      const k0b = kept[0] ? m2.get(base(kept[0].label)) : null;
      const k1 = other(kept, k0);
      ex = `In ${p1.label}, the ${lc(k0.label)} is located in the ${pos(k0)} of the site${removed[0] ? `, with ${feat(removed[0])} to the ${pos(removed[0])}` : k1 ? `, with the ${lc(k1.label)} to the ${pos(k1)}` : ''}. In ${p2.label}, by contrast, ${k0b && pos(k0b) !== pos(k0) ? `the ${lc(k0.label)} is moved to the ${pos(k0b)}` : `the ${lc(k0.label)} stays in the same position`}${added[0] ? `, and ${feat(added[0])} is added in the ${pos(added[0])}` : ''}.`;
    } else {
      const r0 = removed[0], c0 = changed[0], a0 = added[0], a1 = added[1];
      const k0 = other(kept.filter((i) => i !== c0), r0 || c0 || p1.items[0]) || kept[0];
      const first = r0 || c0 || p1.items[0];
      ex = `${inAt(p1.label)}, the ${pos(first)} of the area was occupied by ${feat(first)}${k0 ? `, with the ${lc(k0.label)} in the ${pos(k0)}` : ''}. ${isYear(p2.label) ? 'By ' + p2.label : inAt(p2.label)}, `;
      if (r0 && a0) ex += `${plural(r0) ? 'these' : 'this'} ${lc(r0.label)} had been ${r0.kind === 'building' ? 'demolished' : 'cleared'} to make way for ${feat(a0)}`;
      else if (c0 && a0) ex += `the ${lc(c0.label)} had been ${/smaller/i.test(m2.get(base(c0.label)).label) ? 'reduced in size' : 'altered'} to make room for ${feat(a0)}`;
      else if (a0) ex += `${feat(a0)} had been built in the ${pos(a0)}`;
      else ex += 'the layout had changed';
      if (a1) ex += `, and a new ${lc(a1.label)} had been constructed in the ${pos(a1)}`;
      ex += '.';
      if (k0) ex += ` The ${lc(k0.label)} remained in the same position${changed.includes(k0) ? ', although it was ' + (/smaller/i.test(m2.get(base(k0.label)).label) ? 'reduced in size' : /extended|larger|bigger/i.test(m2.get(base(k0.label)).label) ? 'extended' : 'altered') : ''}.`;
    }
    const res = { title: 'For these maps — what changed where', facts, exampleLabel: 'Your body paragraph could start', example: ex };
    if (part === 'full') res.plan = [`<b>Intro:</b> ${esc(introSection(t).example)}`, `<b>Overview:</b> ${esc(mapSection(t, 'overview').example)}`, `<b>Body 1:</b> ${esc(ex)}`, `<b>Body 2:</b> the other part of the area — ${esc(list(added.slice(2).concat(kept.slice(1)).map((i) => i.label)) || 'what stayed the same')}`];
    return res;
  }

  /* ═══════════════════ TASK 2 DYNAMIC ═══════════════════ */
  function t2Section(q, type, part) {
    const para = q.para;
    const g = T2[type];
    const opinionLine = { opinion: 'I completely agree with this view because ___.', discuss: 'In my opinion, ___ because ___.', problem: 'This essay will examine the main causes of this problem and suggest some possible solutions.', advdis: 'This essay will discuss the benefits and drawbacks of this trend.', twopart: 'This essay will explain why this is happening and consider whether it is a positive or negative development.' }[type];
    if (part === 'intro') {
      return { title: 'For this question', table: [['The question says', 'You can write'], [q.q.split(/[.?]/)[0] + '.', para]], exampleLabel: 'Your introduction could be', example: `${para} ${opinionLine}` };
    }
    const plans = {
      opinion: ['<b>Body 1:</b> your first reason + explanation + example', '<b>Body 2:</b> your second reason + explanation + example', '<b>Optional:</b> the opposite view + why it is weaker'],
      discuss: ['<b>Body 1:</b> the first view — why people hold it + example', '<b>Body 2:</b> the second view — why people hold it + example + which you support'],
      problem: ['<b>Body 1:</b> 2 causes / problems, explained', '<b>Body 2:</b> 2 solutions matched to those causes'],
      advdis: ['<b>Body 1:</b> 1–2 advantages + example', '<b>Body 2:</b> 1–2 disadvantages + example'],
      twopart: ['<b>Body 1:</b> answer question 1 — 2 points + example', '<b>Body 2:</b> answer question 2 — your view + 2 reasons'],
    };
    const keywords = q.q.replace(/To what extent.*|Discuss both.*|What .*|Why .*|Do the .*|Is this .*|In what ways.*/i, '').split(/\s+/).filter((w) => w.length > 5 && !/^(should|because|people|others|believe|between|through|whether|without|however|country|countries)$/i.test(w)).slice(0, 6);
    const facts = [`<b>Topic:</b> ${esc(q.topic)} · <b>Type:</b> ${esc(g.label)}`, `<b>Key words to keep using (with synonyms):</b> ${esc(keywords.map((w) => w.replace(/[^\w']/g, '')).join(', '))}`];
    if (part === 'conclusion') {
      return { title: 'For this question', facts, exampleLabel: 'Your conclusion could start', example: `In conclusion, ${lc(para).replace(/\.$/, '')} ${type === 'opinion' ? '— a view I fully support because ___ and ___.' : type === 'discuss' ? '; having considered both sides, I believe that ___.' : type === 'problem' ? '; this is mainly the result of ___ and can best be addressed by ___.' : type === 'advdis' ? '; while this brings ___, I believe the ___ are more significant.' : ', mainly because of ___, and in my view this is a ___ development.'}` };
    }
    return { title: 'For this question', facts, plan: plans[type], exampleLabel: part === 'full' ? 'Your introduction could be' : 'Your topic sentence could be', example: part === 'full' ? `${para} ${opinionLine}` : { opinion: 'The main reason I agree / disagree is that ___.', discuss: 'On the one hand, those who support ___ argue that ___.', problem: 'There are two main causes of this problem. Firstly, ___.', advdis: 'The main advantage of ___ is that ___.', twopart: 'There are two main reasons why ___. Firstly, ___.' }[type] };
  }

  /* ═══════════════════ RENDER ═══════════════════ */
  function family(t) { return t.type === 'process' ? 'process' : t.type === 'map' ? 'map' : 'data'; }
  const PART_NAME = { intro: 'Introduction', overview: 'Overview', body: 'Body paragraph', conclusion: 'Conclusion', full: 'Full answer' };
  const FAMILY_NAME = { data: { line: 'Line graph', bar: 'Bar chart', pie: 'Pie chart', table: 'Table', mixed: 'Bar + line chart' }, process: 'Process diagram', map: 'Map' };

  window.buildGuide = function ({ task, mode, band, current }) {
    if (!current) return '';
    let g, dyn, heading;
    try {
      if (task === 1) {
        const fam = family(current);
        g = T1[fam][mode];
        heading = `${PART_NAME[mode]} — ${fam === 'data' ? FAMILY_NAME.data[current.type] : FAMILY_NAME[fam]}`;
        dyn = fam === 'process' ? processSection(current, mode) : fam === 'map' ? mapSection(current, mode) : dataSection(current, mode, band);
      } else {
        const type = current.type;
        g = T2[type][mode];
        heading = `${PART_NAME[mode]} — ${T2[type].label}`;
        dyn = t2Section(current, type, mode);
      }
    } catch (err) {
      console.error('guide error', err);
      return '<p class="muted">Guide unavailable for this task.</p>';
    }
    const high = band >= 6.5;
    let h = `<h3 class="g-head">📘 How to write the ${esc(heading)}</h3>`;
    h += `<div class="g-block"><div class="g-label">What it is</div><p>${g.what}</p></div>`;
    h += `<div class="g-block"><div class="g-label">Recipe</div><ol>${g.recipe.map((r) => `<li>${r}</li>`).join('')}</ol></div>`;
    if (dyn) {
      h += `<div class="g-dyn"><div class="g-label">📊 ${esc(dyn.title)}</div>`;
      if (dyn.facts) h += `<ul>${dyn.facts.map((f) => `<li>${f}</li>`).join('')}</ul>`;
      if (dyn.table) h += `<table class="g-table"><thead><tr><th>${task === 2 ? 'The question says' : 'The question says'}</th><th>You can write</th></tr></thead><tbody>${dyn.table.filter((r, i) => !(task === 2 && i === 0)).map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>`;
      if (dyn.plan) h += `<div class="g-label" style="margin-top:10px">Plan</div><ul>${dyn.plan.map((p) => `<li>${p}</li>`).join('')}</ul>`;
      if (dyn.example) h += `<div class="g-label" style="margin-top:10px">${esc(dyn.exampleLabel)}</div><blockquote class="g-ex">${esc(dyn.example)}</blockquote>`;
      if (dyn.note) h += `<p class="muted">${dyn.note}</p>`;
      h += '</div>';
    }
    h += `<div class="g-block"><div class="g-label">Sentence starters</div><ul class="g-starters">${g.starters.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
    if (high && g.high && g.high.length) h += `<div class="g-label" style="margin-top:8px">Stronger (Band 7+)</div><ul class="g-starters">${g.high.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
    h += '</div>';
    h += `<div class="g-block"><div class="g-label">Don't</div><ul class="g-dont">${g.dont.map((d) => `<li>❌ ${d}</li>`).join('')}</ul></div>`;
    return h;
  };
})();
