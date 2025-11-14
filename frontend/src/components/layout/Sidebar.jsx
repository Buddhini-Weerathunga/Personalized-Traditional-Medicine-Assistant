import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/chat", label: "Chatbot" },
  { path: "/prakriti", label: "Prakriti Analysis" }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 px-4 py-5 gap-6">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-lg">ॐ</span>
        </div>
        <span className="font-semibold text-slate-800 text-sm">
          AyuCeylon Assistant
        </span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 text-sm">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-xl ${
                    active
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="text-xs text-slate-400">
        © {new Date().getFullYear()} AyuCeylon
      </div>
    </aside>
  );
}
