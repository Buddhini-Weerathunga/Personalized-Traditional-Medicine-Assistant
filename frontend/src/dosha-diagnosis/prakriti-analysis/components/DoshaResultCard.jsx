import React from "react";

export default function DoshaResultCard({ label, value, isDominant }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        isDominant
          ? "border-primary bg-primary/5"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        {isDominant && (
          <span className="text-xs text-primary font-semibold">
            Dominant
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-2 bg-primary rounded-full transition-all"
          style={{ width: `${Math.round(value)}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-500">
        {Math.round(value)}%
      </div>
    </div>
  );
}
