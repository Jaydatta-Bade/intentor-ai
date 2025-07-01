"use client";
import React from "react";

type ParsedRuleProps = {
  rule: string | null;
};

function cleanRuleString(rule: string): string {
  // Remove Markdown code block formatting
  return rule.replace(/^```json|^```|```$/gim, "").trim();
}

export function ParsedRule({ rule }: ParsedRuleProps) {
  if (!rule) {
    return (
      <div className="mt-4">
        <h2 className="font-semibold mb-1">Parsed Rule</h2>
        <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
          <span className="italic text-gray-400">(Rule will appear here after parsing...)</span>
        </div>
      </div>
    );
  }

  let pretty = "";
  let error = null;
  try {
    const cleaned = cleanRuleString(rule);
    const parsed = JSON.parse(cleaned);
    pretty = JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-1">Parsed Rule</h2>
      <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
        {error ? (
          <span className="text-red-500">Invalid JSON: {error}</span>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-sm">{pretty}</pre>
        )}
      </div>
    </div>
  );
} 