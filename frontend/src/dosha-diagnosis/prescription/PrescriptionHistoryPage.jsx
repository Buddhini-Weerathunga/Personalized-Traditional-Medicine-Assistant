import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";

export default function PrescriptionHistoryPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("/api/prakriti/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReports(res.data.reports);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Prescription History</h1>

        {reports.length === 0 && (
          <p className="text-gray-600">No prescriptions saved yet.</p>
        )}

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-4 border rounded-xl shadow bg-white"
            >
              <h3 className="font-semibold text-lg">
                Dominant: {report.dominantDosha}
              </h3>

              <p className="text-sm text-gray-700">
                Vata: {Math.round(report.vataScore * 100)}% | Pitta:{" "}
                {Math.round(report.pittaScore * 100)}% | Kapha:{" "}
                {Math.round(report.kaphaScore * 100)}%
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Saved on: {new Date(report.createdAt).toLocaleString()}
              </p>

              <button className="mt-3 px-3 py-1 bg-emerald-600 text-white rounded-full text-sm">
                View Full Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
