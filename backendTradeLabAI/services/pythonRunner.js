const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

// Only these stdlib modules are allowed in AI-generated strategy code.
// No file, network, process, or OS access — this is a math/data-only sandbox.
const ALLOWED_MODULES = new Set([
  "math",
  "statistics",
  "pandas",
  "numpy",
  "itertools",
  "functools",
  "collections",
  "decimal",
  "datetime",
  "json",
  "zoneinfo", // needed for correct DST-aware session filters (e.g. NY session)
]);

const BANNED_PATTERNS = [
  /\bopen\s*\(/,
  /\beval\s*\(/,
  /\bexec\s*\(/,
  /\bcompile\s*\(/,
  /__import__/,
  /\bglobals\s*\(/,
  /\blocals\s*\(/,
  /\binput\s*\(/,
  /\bos\./,
  /\bsys\./,
  /subprocess/,
  /socket/,
  /requests/,
  /urllib/,
  /pickle/,
  /marshal/,
  /ctypes/,
  /shutil/,
  /pathlib/,
];

const RUNNER_TIMEOUT_MS = 15000;

/**
 * Validates that the AI-generated code only imports allow-listed modules
 * and doesn't touch any banned patterns (file/network/process access, etc).
 * Throws with a descriptive message if the code fails validation.
 */
function validateCode(code) {
  if (!code || !code.includes("def generate_signals")) {
    throw new Error("Strategy code must define a generate_signals(candles) function.");
  }

  const codeForPatternCheck = stripCommentsAndDocstrings(code);

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(codeForPatternCheck)) {
      throw new Error(
        `Strategy code contains a disallowed operation (matched: ${pattern}). Only pure computation on the candle values is allowed.`
      );
    }
  }

  const importMatches = code.matchAll(/^\s*(?:import|from)\s+([a-zA-Z0-9_]+)/gm);
  for (const match of importMatches) {
    const moduleName = match[1];
    if (!ALLOWED_MODULES.has(moduleName)) {
      throw new Error(
        `Strategy code imports "${moduleName}", which isn't allowed. Allowed modules: ${[...ALLOWED_MODULES].join(", ")}.`
      );
    }
  }
}

// Removes triple-quoted docstrings and '#' comments so plain-English text
// (e.g. "position is currently open (managed elsewhere)") doesn't trip the
// banned-pattern check meant for actual code.
function stripCommentsAndDocstrings(code) {
  return code
    .replace(/"""[\s\S]*?"""/g, "")
    .replace(/'''[\s\S]*?'''/g, "")
    .replace(/#.*$/gm, "");
}

/**
 * Runs the strategy's generate_signals(candles) function in a subprocess and
 * returns the resulting signals array (same length as candles, each
 * "buy" | "sell" | null).
 */
async function runPythonStrategy(code, candles) {
  validateCode(code);

  const tempDir = os.tmpdir();
  const scriptPath = path.join(tempDir, `strategy-${crypto.randomUUID()}.py`);
  const pythonCandles = toPythonCandleShape(candles);

  const wrapper = `
import json
import sys

def _main():
    candles = json.loads(sys.stdin.read())

${indent(code, 4)}

    signals = generate_signals(candles)
    print(json.dumps(signals))

_main()
`;

  fs.writeFileSync(scriptPath, wrapper, "utf-8");

  try {
    const signals = await execPython(scriptPath, pythonCandles);

    if (!Array.isArray(signals) || signals.length !== candles.length) {
      throw new Error(
        `generate_signals returned ${Array.isArray(signals) ? signals.length : "invalid"} values, expected ${candles.length} (one per candle).`
      );
    }

    return signals;
  } finally {
    fs.unlink(scriptPath, () => {});
  }
}

// Candle objects internally use JS-style camelCase (openTime/closeTime), but
// the contract promised to AI-generated/uploaded strategies (see
// generateStrategy.js's system prompt) is Python-style snake_case. Convert
// here so both sides agree regardless of which service produced the candles.
function toPythonCandleShape(candles) {
  return candles.map((c) => ({
    open_time: c.openTime,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
    close_time: c.closeTime,
  }));
}

function indent(code, spaces) {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

function execPython(scriptPath, candles) {
  return new Promise((resolve, reject) => {
    // -I: isolated mode (ignores env vars like PYTHONPATH, skips the
    // per-user site-packages directory). Deliberately NOT using -S here —
    // that flag disables the site module entirely, which also blocks the
    // main venv/site-packages directory, so pip-installed packages (like
    // tzdata, needed for zoneinfo on Windows) would be invisible even
    // after installing them. Security isolation here comes from the
    // banned-pattern/import-allowlist checks in validateCode(), not from -S.
    const proc = spawn("python3", ["-I", scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        proc.kill("SIGKILL");
        reject(new Error("Strategy execution timed out after 15s."));
      }
    }, RUNNER_TIMEOUT_MS);

    proc.stdout.on("data", (chunk) => (stdout += chunk));
    proc.stderr.on("data", (chunk) => (stderr += chunk));

    proc.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Failed to start Python: ${err.message}`));
      }
    });

    proc.on("close", (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      if (exitCode !== 0) {
        reject(new Error(`Strategy code raised an error:\n${stderr.trim() || "unknown error"}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        reject(new Error(`Strategy did not print valid JSON output:\n${stdout.slice(0, 500)}`));
      }
    });

    proc.stdin.write(JSON.stringify(candles));
    proc.stdin.end();
  });
}

module.exports = { runPythonStrategy, validateCode };