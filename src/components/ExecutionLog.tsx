"use client";
import React from "react";

type ExecutionLogProps = {
  logs: string[];
};

export function ExecutionLog({ logs }: ExecutionLogProps) {
  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-1">Execution Log</h2>
      <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
        {logs.length > 0 ? (
          <ul className="list-disc pl-5">
            {logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        ) : (
          <span className="italic text-gray-400">(Logs will appear here...)</span>
        )}
      </div>
    </div>
  );
} 