// frontend/src/dosha-diagnosis/prescription/PrescriptionDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import API from "../../api/axios"; // ✅ use shared axios instance
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

      // ✅ correct route + baseURL
      const res = await API.get(`/prakritiReports/reports/${id}`);
      const r = res.data.report;

      setReport(r);
      console.log("Fetched report:", r);

      const existingNotes = r?.recommendations?.notes || "";
      setNotes(existingNotes);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      alert("Failed to load prescription");
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

      const newRecommendations = {
        ...(report.recommendations || {}),
        notes,
      };

      // ✅ correct route + API instance
      const res = await API.put(`/prakritiReports/reports/${report._id}`, {
        recommendations: newRecommendations,
      });

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
      await API.delete(`/prakritiReports/reports/${id}`);
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
          <button
            onClick={() => navigate("/prescription")}
            className="text-xs text-emerald-700 hover:text-emerald-900 mb-4"
          >
            ← Back to all prescriptions
          </button>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700">
                Ayurveda Assistant – Prescription
              </p>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                Full Prescription Report
              </h1>
              <p className="mt-1 text-xs text-gray-500">Created: {created}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all"
              >
                Download as PDF
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-full border border-red-200 bg-red-50/60 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>

          <div
            ref={reportRef}
            className="mt-6 bg-white/95 rounded-2xl border border-green-100 shadow-lg p-6 space-y-6"
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
                  { label: "Vata", value: report.vataScore },
                  { label: "Pitta", value: report.pittaScore },
                  { label: "Kapha", value: report.kaphaScore },
                ].map((d) => (
                  <div key={d.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-700 w-40">
                      <span>{d.label}</span>
                      <span className="font-semibold">
                        {formatPercent(d.value)}
                      </span>
                    </div>
                    <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                        style={{
                          width: `${Math.round((d.value || 0) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Captured Regions Analysis */}
            {report.capturedRegions && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Captured Regions Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.capturedRegions).map(([region, data]) => (
                    data && typeof data === 'object' && 'dosha_label' in data && (
                      <div key={region} className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/20">
                        <h3 className="text-xs font-semibold text-emerald-800 capitalize mb-2">
                          {region}
                        </h3>
                        <p className="text-xs text-gray-700 mb-2">
                          <span className="font-medium">Dosha:</span>{" "}
                          <span className="text-emerald-700 font-semibold">{data.dosha_label}</span>
                        </p>
                        {data.probabilities && (
                          <div className="space-y-1">
                            {Object.entries(data.probabilities).map(([dosha, prob]) => (
                              <div key={dosha} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">{dosha}:</span>
                                <span className="font-medium text-gray-800">
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Physical Characteristics */}
            {report.recommendations?.physical_characteristics && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Physical Characteristics
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.physical_characteristics.map((char, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diet Recommendations */}
            {report.recommendations?.diet_recommendations && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Diet Recommendations
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.diet_recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Foods to Avoid */}
            {report.recommendations?.foods_to_avoid && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Foods to Avoid
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.foods_to_avoid.map((item, idx) => (
                    <li key={idx} className="text-xs text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle Recommendations */}
            {report.recommendations?.lifestyle_recommendations && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Lifestyle Recommendations
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.lifestyle_recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Herbal Remedies */}
            {report.recommendations?.herbal_remedies && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Herbal Remedies
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.herbal_remedies.map((remedy, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">🌿</span>
                      <span>{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Applications */}
            {report.recommendations?.practical_applications && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Practical Applications
                </h2>
                <ul className="space-y-2">
                  {report.recommendations.practical_applications.map((app, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✨</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Practitioner Notes
              </h2>
              <textarea
                className="w-full min-h-[120px] text-sm rounded-xl border border-green-100 bg-emerald-50/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write personalized notes, advices, or treatment plan here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="mt-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
