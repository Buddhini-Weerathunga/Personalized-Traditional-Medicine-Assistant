// frontend/src/components/layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";

const navLinkBase =
  "px-4 py-2 text-sm font-medium rounded-full transition-all";
const navLinkInactive =
  "text-gray-700 hover:text-green-600 hover:bg-green-50";
const navLinkActive =
  "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm";

export default function Navbar() {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & title */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-semibold">ॐ</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-900">
              Dosha Diagnosis
            </span>
            <span className="text-xs text-green-700">
              AI-Powered Prakriti Analysis
            </span>
          </div>
        </Link>

        {/* Nav links only for your component */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/prakriti"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Prakriti Analysis
          </NavLink>

          <NavLink
            to="/prescription"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Prescription
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            About
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Chat
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
