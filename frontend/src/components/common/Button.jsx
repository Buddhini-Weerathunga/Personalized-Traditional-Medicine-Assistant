import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-teal-700 focus:ring-primary disabled:bg-teal-300",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-300"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
