import React, { useEffect, useState } from "react";

const STORAGE_KEY = "manual_python_strategies";

function loadStrategies() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStrategies(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ManualStrategyBuilder() {
  const [strategies, setStrategies] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setStrategies(loadStrategies());
  }, []);

  function handleSave() {
    if (!name.trim()) {
      setError("Please enter a strategy name.");
      return;
    }

    if (!code.trim()) {
      setError("Please write your Python strategy.");
      return;
    }

    setError("");

    const strategy = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      code: code.trim(),
      createdAt: Date.now(),
      type: "manual",
    };

    const updated = [strategy, ...strategies];

    setStrategies(updated);
    saveStrategies(updated);

    setName("");
    setDescription("");
    setCode("");
  }

  function handleDelete(id) {
    const updated = strategies.filter((s) => s.id !== id);
    setStrategies(updated);
    saveStrategies(updated);

    if (expandedId === id) {
      setExpandedId(null);
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  }

  return (
    <div className="bg-black min-h-screen text-white px-8 py-10">

      <h1 className="text-3xl font-bold mb-2">
        Manual Python Strategy
      </h1>

      <p className="text-zinc-400 mb-8">
        Write your own <code>generate_signals(candles)</code> function.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-400">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left */}

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

          <div className="space-y-5">

            <div>
              <label className="block text-sm mb-2">
                Strategy Name
              </label>

              <input
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2"
                placeholder="EMA Crossover"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Description
              </label>

              <textarea
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2"
                placeholder="Optional description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Python Code
              </label>

              <textarea
                rows={20}
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`def generate_signals(candles):
    """
    candles : pandas DataFrame

    Return dataframe with buy/sell columns.
    """

    candles["buy"] = False
    candles["sell"] = False

    # Write strategy here

    return candles`}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-lg bg-teal-500 py-3 font-semibold text-black hover:bg-teal-400"
            >
              Save Strategy
            </button>

          </div>

        </div>

        {/* Right */}

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Saved Strategies
            </h2>

            <span className="text-zinc-400 text-sm">
              {strategies.length} Saved
            </span>
          </div>

          {strategies.length === 0 && (
            <p className="text-zinc-500">
              No strategies saved yet.
            </p>
          )}

          <div className="space-y-3">

            {strategies.map((s) => {

              const expanded = expandedId === s.id;

              return (
                <div
                  key={s.id}
                  className="border border-zinc-800 rounded-lg"
                >

                  <div className="p-4 flex justify-between">

                    <div>

                      <h3 className="font-semibold">
                        {s.name}
                      </h3>

                      <p className="text-sm text-zinc-400">
                        {s.description}
                      </p>

                      <span className="inline-block mt-2 rounded-full bg-teal-500/20 px-2 py-1 text-xs text-teal-400">
                        Manual Python
                      </span>

                    </div>

                    <div className="space-x-2">

                      <button
                        onClick={() =>
                          setExpandedId(expanded ? null : s.id)
                        }
                        className="rounded border border-zinc-700 px-3 py-1 text-sm"
                      >
                        {expanded ? "Hide" : "View"}
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="rounded border border-red-600 px-3 py-1 text-red-400 text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {expanded && (

                    <div className="border-t border-zinc-800">

                      <div className="flex justify-between bg-black/40 px-4 py-2">

                        <span className="text-xs text-zinc-400">
                          generate_signals.py
                        </span>

                        <button
                          onClick={() => handleCopy(s.code, s.id)}
                          className="text-teal-400 text-sm"
                        >
                          {copiedId === s.id ? "Copied" : "Copy"}
                        </button>

                      </div>

                      <pre className="overflow-auto p-4 text-xs text-zinc-300 whitespace-pre-wrap">
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