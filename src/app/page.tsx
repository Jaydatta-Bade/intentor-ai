"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";
import { IntentInput } from "@/components/IntentInput";
import { ParsedRule } from "@/components/ParsedRule";
import { ExecutionLog } from "@/components/ExecutionLog";
import { getNearPriceUSD } from "@/utils/price";

export default function Home() {
  const { isConnected } = useAccount();
  const [intent, setIntent] = useState("");
  const [rule, setRule] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearPrice, setNearPrice] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);

  async function fetchNearPrice() {
    try {
      setNearPrice(null);
      setCheckResult(null);
      setFetchingPrice(true);
      const price = await getNearPriceUSD();
      setNearPrice(price);
    } catch (e: any) {
      setLogs((prev) => [...prev, `Error fetching NEAR price: ${e.message}`]);
    } finally {
      setFetchingPrice(false);
    }
  }

  async function handleCheckRule() {
    setChecking(true);
    setCheckResult(null);
    await fetchNearPrice();
    setChecking(false);
    if (!rule || nearPrice == null) return;
    try {
      const cleaned = rule.replace(/^```json|^```|```$/gim, "").trim();
      const parsed = JSON.parse(cleaned);
      const trigger = parsed.triggers?.[0]?.condition;
      if (trigger && /NEAR\s*<\s*([\d.]+)/i.test(trigger)) {
        const match = trigger.match(/NEAR\s*<\s*([\d.]+)/i);
        const threshold = match ? parseFloat(match[1]) : null;
        if (threshold != null) {
          if (nearPrice < threshold) {
            const msg = `Trigger met: NEAR ($${nearPrice}) < $${threshold}. Action: ${parsed.triggers[0].action}`;
            setCheckResult(msg);
            setLogs((prev) => [...prev, msg]);
          } else {
            const msg = `Trigger not met: NEAR ($${nearPrice}) >= $${threshold}`;
            setCheckResult(msg);
            setLogs((prev) => [...prev, msg]);
          }
        }
      } else {
        setCheckResult("No valid trigger found in rule.");
        setLogs((prev) => [
          ...prev,
          "No valid trigger found in rule."
        ]);
      }
    } catch (e: any) {
      setCheckResult(`Error checking rule: ${e.message}`);
      setLogs((prev) => [
        ...prev,
        `Error checking rule: ${e.message}`
      ]);
    }
  }

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
      <div className="w-full max-w-xl flex flex-col gap-8 bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-12 border border-blue-100 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-blue-800 dark:text-blue-200 drop-shadow">Intentor AI — AI-to-On-Chain Agent</h1>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg text-purple-700 dark:text-purple-300">NEAR Price:</span>
          <span className="text-lg">
            {nearPrice !== null ? (
              <span className="font-mono text-blue-700 dark:text-blue-300">${nearPrice}</span>
            ) : (
              <button
                onClick={fetchNearPrice}
                className="text-blue-600 dark:text-blue-400 underline px-3 py-1 rounded transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                disabled={fetchingPrice}
              >
                {fetchingPrice ? (
                  <span className="inline-flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Loading...</span>
                ) : "Fetch"}
              </button>
            )}
          </span>
        </div>
        <form onSubmit={handleParseIntent} className="flex flex-col gap-4">
          <IntentInput value={intent} onChange={e => setIntent(e.target.value)} />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded px-4 py-2 font-semibold shadow hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            disabled={loading || !intent.trim()}
          >
            {loading ? "Parsing..." : "Parse Intent"}
          </button>
        </form>
        <button
          onClick={handleCheckRule}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded px-4 py-2 font-semibold shadow hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
          disabled={!rule || nearPrice === null || checking}
        >
          {checking ? (
            <span className="inline-flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Checking...</span>
          ) : "Check Rule"}
        </button>
        {checkResult && (
          <div className="mt-2 p-3 rounded bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium text-center border border-blue-200 dark:border-blue-800 shadow">
            {checkResult}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <ParsedRule rule={rule} />
        <ExecutionLog logs={logs} />
      </div>
    </main>
  );
}
