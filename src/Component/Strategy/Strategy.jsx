import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * AIStrategyBuilder
 * - User describes a strategy in plain English + gives it a name
 * - "Generate Code" calls your backend, which calls a free AI model and
 *   returns a Python generate_signals(candles) function
 * - "Save Strategy" stores { id, name, description, code, createdAt } in localStorage
 * - Supports multiple saved strategies: view code, copy, delete
 *
 * Backend contract: POST http://localhost:5000/api/generate-strategy
 *   body: { description }
 *   returns: { code }  (or { error } on failure)
 */

const API_BASE = "http://localhost:5000/api";
const STORAGE_KEY = "ai_generated_strategies";

function loadStrategies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStrategies(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function AIStrategyBuilder() {
  const [strategies, setStrategies] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setStrategies(loadStrategies());
  }, []);

  async function handleGenerate() {
    if (!description.trim()) {
      setError("Describe your strategy first.");
      return;
    }
    setError("");
    setGeneratedCode("");
    setIsGenerating(true);

    try {
      const response = await axios.post(`${API_BASE}/generate-strategy`, {
        description: description.trim(),
      });
      setGeneratedCode(response.data.code);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate strategy code.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSaveStrategy() {
    if (!name.trim()) {
      setError("Give the strategy a name before saving.");
      return;
    }
    if (!generatedCode) {
      setError("Generate the code before saving.");
      return;
    }
    setError("");

    const newStrategy = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      code: generatedCode,
      createdAt: Date.now(),
    };

    const updated = [newStrategy, ...strategies];
    setStrategies(updated);
    saveStrategies(updated);

    setName("");
    setDescription("");
    setGeneratedCode("");
  }

  function handleDelete(id) {
    const updated = strategies.filter((s) => s.id !== id);
    setStrategies(updated);
    saveStrategies(updated);
    if (expandedId === id) setExpandedId(null);
  }

  function handleCopy(code, id) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="bg-black text-gray-100 min-h-screen px-[6vw] py-16">
      <div className="mb-10">
        <div className="text-teal-400 text-[13px] font-semibold tracking-[0.14em] uppercase mb-3">
          AI Strategy Builder
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Describe it in <span className="text-amber-400">plain English</span>. Get Python back.
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">
          Write what your strategy should do. The AI turns it into a{" "}
          <code className="text-zinc-300">generate_signals(candles)</code> function you can save
          and reuse.
        </p>
      </div>

      {error && (
        <div className="border border-rose-500/40 bg-rose-500/10 text-rose-400 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* -------- INPUT -------- */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-6">
          <h2 className="text-lg font-bold mb-5">New AI strategy</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Strategy name</label>
              <input
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. RSI dip buyer"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Describe the strategy
              </label>
              <textarea
                rows={7}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"
                placeholder="e.g. Buy when RSI(14) drops below 30 and then recovers back above 30. Sell when RSI rises above 70. Use closing price for calculations."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="py-2.5 rounded-lg font-semibold text-sm bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Python Code"}
            </button>

            {generatedCode && (
              <>
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/40 text-xs text-zinc-400">
                    <span>generate_signals.py</span>
                    <button
                      onClick={() => handleCopy(generatedCode, "preview")}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      {copiedId === "preview" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72 overflow-y-auto whitespace-pre">
                    {generatedCode}
                  </pre>
                </div>

                <button
                  onClick={handleSaveStrategy}
                  className="py-2.5 rounded-lg font-semibold text-sm border border-teal-400 text-teal-400 hover:bg-teal-400/10 transition-colors"
                >
                  Save Strategy
                </button>
              </>
            )}
          </div>
        </div>

        {/* -------- SAVED STRATEGIES -------- */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Saved AI strategies</h2>
            <span className="text-xs text-zinc-400">{strategies.length} saved</span>
          </div>

          {strategies.length === 0 && (
            <p className="text-zinc-400 text-sm">
              No AI-generated strategies yet. Describe one on the left to get started.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {strategies.map((s) => {
              const isExpanded = expandedId === s.id;
              return (
                <div key={s.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{s.name}</div>
                      <div className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {s.description}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-800 hover:bg-zinc-800/60 transition-colors"
                      >
                        {isExpanded ? "Hide code" : "View code"}
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-800">
                      <div className="flex items-center justify-between px-4 py-2 bg-black/40 text-xs text-zinc-400">
                        <span>generate_signals.py</span>
                        <button
                          onClick={() => handleCopy(s.code, s.id)}
                          className="text-teal-400 hover:text-teal-300"
                        >
                          {copiedId === s.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre">
                        {s.code}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}