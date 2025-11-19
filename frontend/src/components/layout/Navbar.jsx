// frontend/src/components/layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";

const navLinkBase =
  "px-3 py-1 text-sm font-medium rounded-full transition-colors";
const navLinkInactive = "text-[#6b4f3a] hover:bg-[#e7d8c4]";
const navLinkActive = "bg-[#8b5d33] text-[#fdf7ef]";

export default function Navbar() {
  return (
    <header className="bg-[#f2e4d3]/80 backdrop-blur border-b border-[#e0cfba]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & title */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#8b5d33] flex items-center justify-center shadow-md">
            <span className="text-[#fdf7ef] text-xl font-semibold">ॐ</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-[#3e2b20]">
              AyuCeylon Assistant
            </span>
            <span className="text-xs text-[#8b6b4b]">
              Ancient wisdom · Modern care
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(
                " "
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/prakriti/capture/face"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(
                " "
              )
            }
          >
            Prakriti Analysis
          </NavLink>
          <NavLink
            to="/prescription"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(
                " "
              )
            }
          >
            Prescription
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(
                " "
              )
            }
          >
            About
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              [
                navLinkBase,
                "ml-2",
                isActive ? navLinkActive : navLinkInactive,
              ].join(" ")
            }
          >
            Chat
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
