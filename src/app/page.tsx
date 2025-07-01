"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { IntentInput } from "@/components/IntentInput";
import { ParsedRule } from "@/components/ParsedRule";
import { ExecutionLog } from "@/components/ExecutionLog";

export default function Home() {
  const { isConnected } = useAccount();
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

  if (!isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center gap-8 p-16 rounded-3xl shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md max-w-2xl w-full">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">Intentor AI</h1>
          <p className="text-2xl text-gray-700 dark:text-gray-200 text-center max-w-xl font-semibold">
            Turn your words into on-chain actions.<br />
            <span className="text-blue-600 dark:text-blue-400">AI-powered, cross-chain, verifiable.</span>
          </p>
          <div className="mt-6 scale-150">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 gap-8 bg-gray-50 dark:bg-gray-900 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full flex justify-end">
        <ConnectButton />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
        <h1 className="text-3xl font-extrabold mb-4 text-center">Intentor AI — AI-to-On-Chain Agent</h1>
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
