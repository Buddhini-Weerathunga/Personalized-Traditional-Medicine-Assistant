// frontend/src/components/plant-identification/PlantNavbar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";

const navLinkBase =
  "px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2";
const navLinkInactive =
  "text-gray-700 hover:text-green-600 hover:bg-green-50";
const navLinkActive =
  "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-sm";

export default function PlantNavbar() {
  const location = useLocation();
  
  // Check if we're in any plant identification route
  const isPlantRoute = location.pathname.startsWith('/plant-') || location.pathname.startsWith('/risk-alerts');

  // Don't show navbar if not in plant routes
  if (!isPlantRoute) return null;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & title */}
        <Link to="/" className="flex items-center gap-3">
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
        <nav className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            <span className="text-lg shrink-0">🏠</span>
            <span className="whitespace-nowrap inline-block visible">Home</span>
          </NavLink>

          <NavLink
            to="/plant-scan"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            <span className="text-lg shrink-0">🔍</span>
            <span className="whitespace-nowrap inline-block visible">Plant Identification</span>
          </NavLink>

          <NavLink
            to="/plant-results"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            <span className="text-lg shrink-0">🌿</span>
            <span className="whitespace-nowrap inline-block visible">Plant Description</span>
          </NavLink>

          <NavLink
            to="/plant-history"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            <span className="text-lg shrink-0">📚</span>
            <span className="whitespace-nowrap inline-block visible">History</span>
          </NavLink>

          <NavLink
            to="/risk-alerts"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            <span className="text-lg shrink-0">🚨</span>
            <span className="whitespace-nowrap inline-block visible">Safety Alerts</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
