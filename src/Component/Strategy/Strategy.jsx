import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * AIStrategyBuilder
 * - User describes a strategy in plain English + gives it a name
 * - "Generate Code" calls your backend, which calls a free AI model and
 *   returns a Python generate_signals(candles) function
 * - The code is shown in an EDITABLE textarea — tweak AI output by hand,
 *   or skip the AI entirely and write/upload your own .py file
 * - "Save Strategy" stores { id, name, description, code, createdAt } in
 *   localStorage; saved strategies can also be re-opened and edited
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

function emptyForm() {
  return { id: null, name: "", description: "", code: "" };
}

export default function AIStrategyBuilder() {
  const [strategies, setStrategies] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileInputRef = useRef(null);

  const isEditing = Boolean(form.id);

  useEffect(() => {
    setStrategies(loadStrategies());
  }, []);

  async function handleGenerate() {
    if (!form.description.trim()) {
      setError("Describe your strategy first.");
      return;
    }
    setError("");
    setIsGenerating(true);

    try {
      const response = await axios.post(`${API_BASE}/generate-strategy`, {
        description: form.description.trim(),
      });
      setForm((prev) => ({ ...prev, code: response.data.code }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate strategy code.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".py")) {
      setError("Please upload a .py file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({
        ...prev,
        code: event.target.result,
        name: prev.name || file.name.replace(/\.py$/, ""),
      }));
      setError("");
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsText(file);

    // reset the input so re-uploading the same filename fires onChange again
    e.target.value = "";
  }

  function handleSaveStrategy() {
    if (!form.name.trim()) {
      setError("Give the strategy a name before saving.");
      return;
    }
    if (!form.code.trim()) {
      setError("Add some code before saving — generate it, write it, or upload a .py file.");
      return;
    }
    if (!form.code.includes("def generate_signals")) {
      setError('Code must define a "def generate_signals(candles):" function.');
      return;
    }
    setError("");

    let updated;
    if (isEditing) {
      updated = strategies.map((s) =>
        s.id === form.id
          ? { ...s, name: form.name.trim(), description: form.description.trim(), code: form.code }
          : s
      );
    } else {
      const newStrategy = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        description: form.description.trim(),
        code: form.code,
        createdAt: Date.now(),
      };
      updated = [newStrategy, ...strategies];
    }

    setStrategies(updated);
    saveStrategies(updated);
    setForm(emptyForm());
  }

  function handleEdit(strategy) {
    setForm({
      id: strategy.id,
      name: strategy.name,
      description: strategy.description || "",
      code: strategy.code,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setForm(emptyForm());
    setError("");
  }

  function handleDelete(id) {
    const updated = strategies.filter((s) => s.id !== id);
    setStrategies(updated);
    saveStrategies(updated);
    if (expandedId === id) setExpandedId(null);
    if (form.id === id) setForm(emptyForm());
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
          Describe it, <span className="text-amber-400">write it, or upload it</span>.
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">
          Generate a <code className="text-zinc-300">generate_signals(candles)</code> function
          from plain English, edit it by hand, or drop in your own .py file.
        </p>
      </div>

      {error && (
        <div className="border border-rose-500/40 bg-rose-500/10 text-rose-400 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* -------- FORM -------- */}
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-6">
          <h2 className="text-lg font-bold mb-5">
            {isEditing ? "Edit strategy" : "New strategy"}
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Strategy name</label>
              <input
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                placeholder="e.g. RSI dip buyer"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Describe the strategy (optional — used for AI generation)
              </label>
              <textarea
                rows={5}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"
                placeholder="e.g. Buy when RSI(14) drops below 30 and then recovers back above 30. Sell when RSI rises above 70."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>

              <input
                type="file"
                accept=".py"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-lg font-semibold text-sm border border-zinc-800 hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
              >
                Upload .py
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-zinc-400">
                  Code (editable — generate, upload, or write directly)
                </label>
                {form.code && (
                  <button
                    onClick={() => handleCopy(form.code, "form")}
                    className="text-xs text-teal-400 hover:text-teal-300"
                  >
                    {copiedId === "form" ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              <textarea
                rows={14}
                spellCheck={false}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-400 resize-y"
                placeholder={`def generate_signals(candles):\n    # candles: list of dicts with open/high/low/close/volume/open_time/close_time\n    # return a list the same length as candles: "buy" | "sell" | None\n    signals = [None] * len(candles)\n    ...\n    return signals`}
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveStrategy}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm border border-teal-400 text-teal-400 hover:bg-teal-400/10 transition-colors"
              >
                {isEditing ? "Save changes" : "Save Strategy"}
              </button>
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-lg font-semibold text-sm border border-zinc-800 hover:bg-zinc-800/60 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
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
              No strategies saved yet. Generate, write, or upload one on the left.
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
                        {s.description || "No description"}
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
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-800 hover:bg-zinc-800/60 transition-colors"
                      >
                        Edit
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