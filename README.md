# IELTS Writing Lab

Practice IELTS Academic Writing Task 1 and Task 2 with AI feedback pitched at **your** target band.

- **Task 1:** a fresh chart every time (line, bar, pie, table, bar+line), plus 6 process diagrams and 6 maps.
- **Task 2:** 38 real-style essay questions across 5 question types.
- **Modes:** full timed answer, or drill one section only (introduction / overview / body / conclusion).
- **AI (Claude):** band scores for all 4 criteria, data-accuracy check, prioritised fixes, a rewrite at your target band, and a model answer + vocabulary one step above your level.
- **Target band selector:** 5.5 → 8.0+. A Band 6 learner gets a Band 6.5–7 model, not a Band 9 essay.
- History saved in the browser.

## How it is built

| Part | Where | Notes |
|---|---|---|
| Website | `index.html`, `styles.css`, `js/` | Static — host on GitHub Pages |
| AI function | `supabase/functions/ielts-ai/index.ts` | Supabase Edge Function; holds the Claude API key |

The website never sees the API key. It calls the Supabase function, which calls Claude.

Until the function is connected the site runs in **demo mode** (fake results, so the UI can be tested).

---

## Setup — step by step

### 1. Get a Claude API key
1. Go to https://console.anthropic.com and sign in / create an account.
2. Add a payment method (Billing).
3. **API Keys → Create Key**. Copy it — it starts with `sk-ant-…`. You only see it once.

### 2. Create the Supabase Edge Function
1. Go to https://supabase.com/dashboard → open your project (or **New project**).
2. Left menu → **Edge Functions** → **Deploy a new function** → **Via Editor**.
3. Name it exactly: `ielts-ai`
4. Delete the sample code, paste the whole contents of `supabase/functions/ielts-ai/index.ts`, click **Deploy**.
5. Left menu → **Edge Functions → Secrets** (or **Project Settings → Edge Functions**) → **Add new secret**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your `sk-ant-…` key
6. Left menu → **Project Settings → API**. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / publishable** key

### 3. Connect the website
Open `js/config.js` and fill in:

```js
SUPABASE_URL: 'https://xxxx.supabase.co',
SUPABASE_ANON_KEY: 'eyJ…',
```

Reload the page — the yellow "Demo mode" banner disappears and real AI feedback works.

### 4. Publish on GitHub Pages
1. Create a repo on GitHub named `ielts-writing`.
2. In Terminal:
   ```bash
   cd ~/ielts-writing
   git remote add origin git@github.com:vnguyen-workai/ielts-writing.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. After 1–2 minutes the site is live at `https://vnguyen-workai.github.io/ielts-writing/`.

## Cost
Each "Get AI feedback" or "Model answer" is one Claude call (Opus 5, ~2–3k tokens in/out) — roughly 5–8 US cents. A student doing 20 practices a month ≈ $1–2.

## Local testing
```bash
cd ~/ielts-writing
python3 -m http.server 8125
```
Then open http://localhost:8125

## Adding more content
- **Task 1 topics:** add an object to `js/task1-bank.js` (copy an existing one).
- **Process / map:** add to `js/diagrams.js`.
- **Task 2 questions:** add to `js/task2-bank.js`.
