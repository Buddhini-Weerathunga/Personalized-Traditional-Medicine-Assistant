import React from "react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}
