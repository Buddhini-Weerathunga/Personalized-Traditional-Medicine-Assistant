// frontend/src/components/plant-identification/PlantNavbar.jsx
import { Link, NavLink } from "react-router-dom";

const navLinkBase =
  "px-4 py-2 text-sm font-medium rounded-full transition-all";
const navLinkInactive =
  "text-gray-700 hover:text-green-600 hover:bg-green-50";
const navLinkActive =
  "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm";

export default function PlantNavbar() {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & title */}
        <Link to="/plant-identification" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-semibold">🌿</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-900">
              Plant Identification
            </span>
            <span className="text-xs text-green-700">
              AI-Powered Herbal Recognition
            </span>
          </div>
        </Link>

        {/* Nav links for plant identification */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/plant-identification"
            end
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/plant-scan"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Scan Plant
          </NavLink>

          <NavLink
            to="/plant-description"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Plant Description
          </NavLink>

          <NavLink
            to="/plant-history"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            History
          </NavLink>

          <NavLink
            to="/risk-alerts"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(" ")
            }
          >
            Risk Alerts
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
