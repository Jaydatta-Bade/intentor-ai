"use client";
import React from "react";

type ParsedRuleProps = {
  rule: string | null;
};

export function ParsedRule({ rule }: ParsedRuleProps) {
  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-1">Parsed Rule</h2>
      <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-600 dark:text-gray-300 min-h-[48px]">
        {rule ? (
          <span>{rule}</span>
        ) : (
          <span className="italic text-gray-400">(Rule will appear here after parsing...)</span>
        )}
      </div>
    </div>
  );
} 