"use client";
import React from "react";

type IntentInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function IntentInput({ value, onChange }: IntentInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-medium">Describe your intent:</span>
      <input
        className="border rounded px-3 py-2 text-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="e.g. I want to maintain a 50/50 NEAR/USDC portfolio..."
        value={value}
        onChange={onChange}
      />
    </label>
  );
} 