import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/chat") return "Ayurveda Chatbot";
    if (location.pathname === "/prakriti") return "Prakriti Analysis";
    return "AI Ayurveda Assistant";
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{getTitle()}</h1>
          <p className="text-xs text-slate-500">
            Personalized traditional medicine assistant
          </p>
        </div>
        <nav className="hidden md:flex gap-4 text-sm">
          <Link
            to="/"
            className={`px-3 py-1 rounded-full ${
              location.pathname === "/"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Home
          </Link>
          <Link
            to="/chat"
            className={`px-3 py-1 rounded-full ${
              location.pathname === "/chat"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Chat
          </Link>
          <Link
            to="/prakriti"
            className={`px-3 py-1 rounded-full ${
              location.pathname === "/prakriti"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Prakriti
          </Link>
        </nav>
      </div>
    </header>
  );
}
