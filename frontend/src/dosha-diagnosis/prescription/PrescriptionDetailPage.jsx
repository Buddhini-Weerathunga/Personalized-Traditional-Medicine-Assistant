// frontend/src/dosha-diagnosis/prescription/PrescriptionDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Navbar from "../../components/layout/Navbar.jsx";

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const reportRef = useRef(null);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`/api/prakriti/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const r = res.data.report;
      setReport(r);

      const existingNotes = r?.recommendations?.notes || "";
      setNotes(existingNotes);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      alert("Failed to load report");
      navigate("/prescription");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatPercent = (score) => `${Math.round((score || 0) * 100)}%`;

  const handleDownloadPdf = () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 10,
      filename: "AyuCeylon_Prescription_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(reportRef.current).save();
  };

  const handleSaveNotes = async () => {
    if (!report) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");

      const newRecommendations = {
        ...(report.recommendations || {}),
        notes,
      };

      const res = await axios.put(
        `/api/prakriti/reports/${report._id}`,
        { recommendations: newRecommendations },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReport(res.data.report);
      alert("Notes updated ✅");
    } catch (err) {
      console.error("Save notes error:", err);
      alert("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this prescription?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/prakriti/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Prescription deleted");
      navigate("/prescription");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete prescription");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white">
          <p className="text-gray-600 text-sm">Loading report...</p>
        </main>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white">
          <p className="text-gray-600 text-sm">Report not found.</p>
        </main>
      </>
    );
  }

  const created = report.createdAt
    ? new Date(report.createdAt).toLocaleString()
    : "Unknown date";

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        <section className="max-w-5xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span>💊 Prakriti Prescription</span>
                <span className="h-4 w-px bg-green-300" />
                <span>AyuCeylon Ayurveda Assistant</span>
              </div>

              <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
                Full{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Prescription Report
                </span>
              </h1>
              <p className="mt-1 text-xs text-gray-600">
                Created on {created}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1.5 rounded-full bg-white text-emerald-700 border border-emerald-300 text-xs font-semibold shadow-sm hover:bg-emerald-50 transition-all"
              >
                Download as PDF
              </button>
              <button
                onClick={() => navigate("/prescription")}
                className="px-3 py-1.5 rounded-full bg-white border border-green-200 text-xs font-semibold text-gray-800 hover:bg-green-50 transition-all"
              >
                Back to History
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-full bg-white border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Main report card (PDF content) */}
          <div
            ref={reportRef}
            className="bg-white/90 rounded-2xl border border-green-100 shadow-lg p-6 space-y-6"
          >
            {/* Dosha summary */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Dosha Overview
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Dominant Dosha:{" "}
                <span className="font-semibold text-emerald-700">
                  {report.dominantDosha || "N/A"}
                </span>
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Vata", value: report.vataScore, color: "from-green-500 to-emerald-500" },
                  { label: "Pitta", value: report.pittaScore, color: "from-amber-500 to-orange-500" },
                  { label: "Kapha", value: report.kaphaScore, color: "from-sky-500 to-cyan-500" },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="flex-1 min-w-[120px] rounded-xl p-3 border border-emerald-50 bg-gradient-to-br from-green-50 to-white flex flex-col items-center shadow-sm"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {d.label}
                    </span>
                    <span className="mt-1 text-lg font-semibold text-gray-900">
                      {formatPercent(d.value)}
                    </span>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-emerald-50 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                        style={{ width: formatPercent(d.value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations (read-only general + editable notes) */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                General Recommendations
              </h2>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Favor warm, freshly prepared meals.</li>
                <li>Maintain a regular sleep–wake routine.</li>
                <li>Include gentle movement such as walking or yoga.</li>
                <li>
                  Practice simple breathing/mindfulness to support emotional
                  balance.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-gray-500">
                These are general wellness suggestions and do not replace
                personalized guidance from a qualified Ayurvedic doctor.
              </p>
            </div>

            {/* Editable notes */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Your Notes / Doctor’s Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="You or your practitioner can write custom notes or recommendations here..."
                className="w-full min-h-[120px] text-sm border border-green-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="mt-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
          © 2025 AyuCeylon. All rights reserved.
        </div>
      </footer>
    </>
  );
}
