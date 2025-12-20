import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && token !== "undefined" && token !== "null") {
      setAllowed(true);
    }

    setChecked(true);
  }, []);

  if (!checked) return null; // ⛔ prevent render flash

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
