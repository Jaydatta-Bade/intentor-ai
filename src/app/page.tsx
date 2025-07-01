"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IntentInput } from "@/components/IntentInput";
import { ParsedRule } from "@/components/ParsedRule";
import { ExecutionLog } from "@/components/ExecutionLog";

export default function Home() {
  const [intent, setIntent] = useState("");
  const [rule] = useState<string | null>(null); // Placeholder for parsed rule
  const [logs] = useState<string[]>([]); // Placeholder for logs

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 gap-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex justify-end">
        <ConnectButton />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-6 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Intentor — AI-to-On-Chain Agent</h1>
        <IntentInput value={intent} onChange={e => setIntent(e.target.value)} />
        <ParsedRule rule={rule} />
        <ExecutionLog logs={logs} />
      </div>
    </main>
  );
}
