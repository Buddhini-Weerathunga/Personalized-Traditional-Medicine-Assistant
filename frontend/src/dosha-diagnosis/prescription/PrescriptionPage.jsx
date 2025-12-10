// frontend/src/dosha-diagnosis/prescription/PrescriptionPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios"; // ✅ use shared axios instance
import Navbar from "../../components/layout/Navbar.jsx";

export default function PrescriptionPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ matches backend: app.use("/api/prakritiReports", ...)
      // baseURL = http://localhost:5000/api
      const res = await API.get("/prakritiReports/reports");
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
      alert("Failed to load prescription history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;

    try {
      // ✅ same baseURL, same route style
      await API.delete(`/prakritiReports/reports/${id}`);

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete prescription");
    }
  };

  const formatPercent = (score) => `${Math.round((score || 0) * 100)}%`;

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700">
                Ayurveda Assistant – History
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                Saved{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Prescriptions
                </span>
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed">
                Each time you save your Prakriti results as a prescription, it
                appears here. You can reopen, review or export them anytime.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-gray-600 text-sm">
              Loading prescriptions...
            </p>
          ) : reports.length === 0 ? (
            <p className="mt-6 text-gray-600 text-sm">
              No prescriptions saved yet. Complete a Prakriti analysis and click
              “Save as Prescription” on the results page.
            </p>
          ) : (
            <div className="space-y-4 mt-6">
              {reports.map((r) => {
                const created = r.createdAt
                  ? new Date(r.createdAt).toLocaleString()
                  : "Unknown date";

                return (
                  <div
                    key={r._id}
                    className="bg-white/90 border border-green-100 rounded-2xl shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{created}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Dominant:{" "}
                        <span className="text-emerald-700">
                          {r.dominantDosha || "N/A"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        Vata: {formatPercent(r.vataScore)} · Pitta:{" "}
                        {formatPercent(r.pittaScore)} · Kapha:{" "}
                        {formatPercent(r.kaphaScore)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/prescription/${r._id}`)}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all"
                      >
                        View Full Report
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="px-3 py-1.5 rounded-full border border-red-200 bg-red-50/60 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
          © 2025 AyuCeylon. All rights reserved.
        </div>
      </footer>
    </>
  );
}
