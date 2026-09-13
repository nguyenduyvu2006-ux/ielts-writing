/* IELTS Writing Lab — talks to the Supabase Edge Function.
 * If CONFIG.SUPABASE_URL is empty, returns demo results so the UI can be tested. */
(function () {
  const isDemo = () => !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY;

  async function call(payload) {
    if (isDemo()) return demo(payload);
    const url = `${CONFIG.SUPABASE_URL.replace(/\/$/, '')}/functions/v1/${CONFIG.FUNCTION_NAME}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    let json;
    try { json = await res.json(); } catch { throw new Error(`Server error (${res.status})`); }
    if (!res.ok || !json.ok) throw new Error(json.error || `Server error (${res.status})`);
    return json.result;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function demo(p) {
    await sleep(1200);
    const tb = Number(p.targetBand) || 6.5;
    if (p.action === 'grade') {
      const words = (p.essay || '').trim().split(/\s+/).filter(Boolean);
      const first = words.slice(0, 8).join(' ');
      return {
        scores: { c1: tb - 0.5, c2: tb - 0.5, c3: tb - 1, c4: tb - 0.5 },
        overall: tb - 0.5,
        summary: `DEMO MODE — no AI key is connected yet. This is a sample result so you can see the layout. Your text is about half a band below your target of ${tb}.`,
        data_accuracy: p.task === 1 ? 'Demo: figures were not checked. With the real AI, every number you quote is compared to the chart data.' : '',
        strengths: ['Clear paragraph structure', 'Answers the question directly', 'Some good linking words'],
        improvements: [
          { issue: 'Repetitive vocabulary', example: first || 'your first sentence', fix: 'Use a synonym or restructure the sentence so the key noun is not repeated three times.' },
          { issue: 'Overview is missing or weak', example: '(second paragraph)', fix: 'Add two sentences that state the main trend without numbers.' },
          { issue: 'Article errors', example: 'the number of people was increase', fix: 'the number of people increased' },
        ],
        rewrite: (p.essay || '') + '\n\n[Demo: the real AI returns an improved version of your text here, at your target band.]',
        changes: [
          { original: 'was increase', improved: 'increased', why: 'Past simple, not passive.' },
          { original: 'a lot of', improved: 'a significant number of', why: 'More formal, academic register.' },
        ],
      };
    }
    return {
      band: tb + 0.5,
      model_answer: `[DEMO MODE — connect your Supabase function to get a real model answer at band ${tb + 0.5}.]\n\nThe chart illustrates … Overall, it is clear that … \n\nIn detail, …`,
      structure_notes: ['Paragraph 1: paraphrase the question', 'Paragraph 2: overview with the two main trends', 'Paragraphs 3-4: details with figures, grouped logically'],
      vocabulary: [
        { phrase: 'illustrates', meaning: 'shows (formal)', example: 'The graph illustrates changes in car ownership.' },
        { phrase: 'a steady rise', meaning: 'a slow, regular increase', example: 'There was a steady rise in sales after 2010.' },
        { phrase: 'peaked at', meaning: 'reached its highest point', example: 'Visitor numbers peaked at 2 million in 2018.' },
        { phrase: 'in contrast', meaning: 'showing a difference', example: 'In contrast, bus use fell sharply.' },
      ],
    };
  }

  window.AI = { call, isDemo };
})();
