const express = require("express");
const axios = require("axios");
const router = express.Router();

// Free, no-credit-card model on OpenRouter, good at code generation.
// Swap MODEL for another ":free" model id from openrouter.ai/models if this one
// gets rate-limited or deprecated.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "qwen/qwen3-coder:free";

const SYSTEM_PROMPT = `You convert a plain-English trading strategy description into a single Python function.

Rules:
- Output ONLY raw Python code. No markdown code fences, no explanation, no comments outside the function docstring.
- Define exactly one function: def generate_signals(candles):
- "candles" is a list of dicts, each shaped like:
  { "open_time": int, "open": float, "high": float, "low": float, "close": float, "volume": float, "close_time": int }
  The list is in ascending time order.
- Return a list of the SAME LENGTH as candles, where each element is one of: "buy", "sell", or None.
  - "buy" means enter a long position on that candle if not already in one.
  - "sell" means exit an open long position on that candle.
  - None means no action.
- You may use only the Python standard library (no pandas, numpy, or external packages), since the code must run
  in a plain Python sandbox with no installed dependencies.
- Implement whatever indicator logic the description implies (e.g. moving averages, RSI, MACD, price action) from
  scratch using plain arithmetic on the candle values.
- Keep the function self-contained and deterministic.`;

/**
 * POST /api/generate-strategy
 * body: { description: string }
 * returns: { code: string }
 */
router.post("/generate-strategy", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ error: "A strategy description is required." });
    }
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "Server is missing OPENROUTER_API_KEY." });
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: description.trim() },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          // OpenRouter asks for these two on free-tier requests; safe to leave generic.
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "TradeLab AI",
        },
        timeout: 60000,
      }
    );

    const raw = response.data.choices?.[0]?.message?.content || "";
    const code = stripCodeFences(raw).trim();

    if (!code.includes("def generate_signals")) {
      return res.status(502).json({
        error: "The model didn't return a valid generate_signals function. Try rephrasing the description.",
        raw,
      });
    }

    res.json({ code });
  } catch (err) {
    console.error("Strategy generation error:", err.response?.data || err.message);

    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "The free model is rate-limited right now. Wait a moment and try again.",
      });
    }

    res.status(500).json({ error: "Failed to generate strategy code." });
  }
});

// Models sometimes wrap output in ```python ... ``` despite instructions — strip it defensively.
function stripCodeFences(text) {
  const fenced = text.match(/```(?:python)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1] : text;
}

module.exports = router;