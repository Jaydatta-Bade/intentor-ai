"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

export default function Home() {
  const [intent, setIntent] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 gap-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex justify-end">
        <ConnectButton />
      </div>
      <div className="w-full max-w-xl flex flex-col gap-6 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Intentor — AI-to-On-Chain Agent</h1>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Describe your intent:</span>
          <input
            className="border rounded px-3 py-2 text-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="e.g. I want to maintain a 50/50 NEAR/USDC portfolio..."
            value={intent}
            onChange={e => setIntent(e.target.value)}
          />
        </label>
        <div className="mt-4">
          <h2 className="font-semibold mb-1">Parsed Rule</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
            {/* Placeholder for parsed rule */}
            <span className="italic text-gray-400">(Rule will appear here after parsing...)</span>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold mb-1">Execution Log</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
            {/* Placeholder for logs */}
            <span className="italic text-gray-400">(Logs will appear here...)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
