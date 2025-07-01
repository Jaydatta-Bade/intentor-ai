"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IntentInput } from "@/components/IntentInput";
import { ParsedRule } from "@/components/ParsedRule";
import { ExecutionLog } from "@/components/ExecutionLog";

export default function Home() {
  const [intent, setIntent] = useState("");
  const [rule, setRule] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleParseIntent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRule(null);
    setLogs((prev) => [
      ...prev,
      `Parsing intent: "${intent}"`,
    ]);
    try {
      const res = await fetch("/api/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setRule(data.rule);
      setLogs((prev) => [
        ...prev,
        `Parsed rule: ${data.rule}`,
      ]);
    } catch (err: any) {
      setError(err.message);
      setLogs((prev) => [
        ...prev,
        `Error: ${err.message}`,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 gap-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex justify-end">
        <ConnectButton />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-6 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Intentor — AI-to-On-Chain Agent</h1>
        <form onSubmit={handleParseIntent} className="flex flex-col gap-4">
          <IntentInput value={intent} onChange={e => setIntent(e.target.value)} />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
            disabled={loading || !intent.trim()}
          >
            {loading ? "Parsing..." : "Parse Intent"}
          </button>
        </form>
        {error && <div className="text-red-500">{error}</div>}
        <ParsedRule rule={rule} />
        <ExecutionLog logs={logs} />
      </div>
    </main>
  );
}
