// IELTS Writing Lab — Supabase Edge Function
// Holds the Anthropic API key (set as a secret named ANTHROPIC_API_KEY) and
// calls Claude for grading, rewriting and model answers.
//
// Request body: { action: "grade" | "model", task: 1 | 2, mode, targetBand,
//                 prompt, chartData?, questionType?, essay? }

import Anthropic from "npm:@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODE_LABEL: Record<string, string> = {
  full: "the complete response",
  intro: "the INTRODUCTION paragraph only (paraphrase of the task statement)",
  overview: "the OVERVIEW paragraph only (2-3 sentences giving the main trends / key features, no detailed figures)",
  body: "ONE BODY PARAGRAPH only (detailed comparison with figures / one main idea developed with examples)",
  conclusion: "the CONCLUSION paragraph only (restate position and summarise main points)",
};

const BAND_GUIDE = `Band-level guide (use it to pitch model answers and advice at the learner's TARGET band, never far above it):
- 5.5: simple sentences plus some complex ones with errors; basic linking words (firstly, however, in addition); everyday vocabulary; ideas present but underdeveloped.
- 6.0: mix of simple and complex sentences, errors do not block meaning; adequate vocabulary with some inaccuracy; clear overall progression; a clear position/overview.
- 6.5: a range of complex structures with good control; some less common vocabulary; cohesion mostly natural; ideas developed with support.
- 7.0: frequent error-free sentences; flexible vocabulary with some collocation awareness; clear progression with logical paragraphing; well-developed ideas.
- 7.5: wide range of structures, majority error-free; precise, natural vocabulary; sophisticated cohesion without over-use of linkers.
- 8.0+: rare minor slips; skilful, natural use of uncommon lexis; ideas fully extended; effortless cohesion.
A learner at band 5.5-6.0 cannot use a band-9 model. Show them the NEXT step up (about +0.5 to +1.0 above their target), with language they can realistically copy.`;

const GRADE_SCHEMA = {
  type: "object",
  properties: {
    scores: {
      type: "object",
      properties: {
        c1: { type: "number", description: "Task Achievement (Task 1) or Task Response (Task 2), 0-9 in 0.5 steps" },
        c2: { type: "number", description: "Coherence and Cohesion" },
        c3: { type: "number", description: "Lexical Resource" },
        c4: { type: "number", description: "Grammatical Range and Accuracy" },
      },
      required: ["c1", "c2", "c3", "c4"],
      additionalProperties: false,
    },
    overall: { type: "number" },
    summary: { type: "string", description: "2-3 sentences: how the writing compares to the target band" },
    data_accuracy: { type: "string", description: "Task 1 only: were the figures and main trend reported correctly? Empty string for Task 2." },
    strengths: { type: "array", items: { type: "string" } },
    improvements: {
      type: "array",
      description: "The 3-5 most important fixes to reach the target band, most important first",
      items: {
        type: "object",
        properties: {
          issue: { type: "string" },
          example: { type: "string", description: "quote from the learner's text" },
          fix: { type: "string", description: "corrected / better version" },
        },
        required: ["issue", "example", "fix"],
        additionalProperties: false,
      },
    },
    rewrite: { type: "string", description: "The learner's text improved to about the target band. Keep their ideas and structure; only lift the language/organisation. Same length." },
    changes: {
      type: "array",
      description: "5-8 notable changes made in the rewrite",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          improved: { type: "string" },
          why: { type: "string" },
        },
        required: ["original", "improved", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["scores", "overall", "summary", "data_accuracy", "strengths", "improvements", "rewrite", "changes"],
  additionalProperties: false,
};

const MODEL_SCHEMA = {
  type: "object",
  properties: {
    band: { type: "number", description: "the band this model answer represents" },
    model_answer: { type: "string" },
    structure_notes: { type: "array", items: { type: "string" }, description: "3-5 bullet notes on how the answer is organised" },
    vocabulary: {
      type: "array",
      description: "8-12 useful phrases actually used in the model answer",
      items: {
        type: "object",
        properties: {
          phrase: { type: "string" },
          meaning: { type: "string" },
          example: { type: "string" },
        },
        required: ["phrase", "meaning", "example"],
        additionalProperties: false,
      },
    },
  },
  required: ["band", "model_answer", "structure_notes", "vocabulary"],
  additionalProperties: false,
};

function taskContext(b: Record<string, unknown>) {
  const lines = [
    `Task: IELTS Academic Writing Task ${b.task}`,
    `What the learner is practising: ${MODE_LABEL[String(b.mode)] ?? "the complete response"}`,
    `Learner's TARGET band: ${b.targetBand}`,
    `Question: ${b.prompt}`,
  ];
  if (b.task === 1 && b.chartData) lines.push(`Exact data shown in the chart (use this to check accuracy): ${b.chartData}`);
  if (b.task === 2 && b.questionType) lines.push(`Question type: ${b.questionType}`);
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY secret is not set");
    const client = new Anthropic({ apiKey });

    const body = await req.json();
    const action = body.action;
    let system: string;
    let user: string;
    let schema: Record<string, unknown>;

    if (action === "grade") {
      if (!body.essay || String(body.essay).trim().length < 10) throw new Error("Nothing to grade");
      system = `You are an experienced IELTS Writing examiner and tutor. Grade strictly by the official public band descriptors. ${BAND_GUIDE}
Rules:
- Give band scores in 0.5 steps. Overall = average of the four criteria rounded to the nearest 0.5.
- If the learner is practising ONE SECTION only, grade that section for what it should do (e.g. an overview should give trends without figures) and note criteria that cannot be fully judged, but still give your best estimate.
- For Task 1, check every figure against the data provided and say clearly if numbers or the main trend are wrong.
- Feedback must be practical and pitched at the target band: quote the learner's own words and show the fix.
- The rewrite must stay at roughly the TARGET band (not band 9) so the learner can learn from it, keep the learner's ideas, and keep a similar length.`;
      user = `${taskContext(body)}\n\nLEARNER'S TEXT:\n"""\n${body.essay}\n"""`;
      schema = GRADE_SCHEMA;
    } else if (action === "model") {
      system = `You are an experienced IELTS Writing tutor. ${BAND_GUIDE}
Write a model answer pitched about 0.5-1.0 band ABOVE the learner's target band — realistic, natural language they can imitate, not a band-9 showcase.
If the learner is practising one section only, write ONLY that section.
For a full Task 1 answer write 160-200 words; for a full Task 2 essay write 260-300 words. Use clear paragraphs separated by blank lines.
For Task 1, use the exact figures from the data provided. Then list the most useful phrases from the answer with a short meaning and one fresh example sentence.`;
      user = taskContext(body);
      schema = MODEL_SCHEMA;
    } else {
      throw new Error("Unknown action");
    }

    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: user }],
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema },
      },
      // Server-side fallback: if a safety classifier declines, re-run on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    } as any);

    if (response.stop_reason === "refusal") {
      throw new Error("The AI declined this request. Please try a different text.");
    }
    const text = response.content.find((b: { type: string }) => b.type === "text") as { text: string } | undefined;
    if (!text) throw new Error("No text in AI response");
    const result = JSON.parse(text.text);

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
