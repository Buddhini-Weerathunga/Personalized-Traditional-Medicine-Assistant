import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../services/api";
import AyurvedaHeader from "../../../components/health-profile-analysis/AyurvedaHeader";

const healthProfiles = [
  {
    id: 1,
    name: "James",
    age: 29,
    gender: "Female",
    dominantDosha: "Vata",
    createdAt: "2025-12-10",
    status: "Completed",
  },
  {
    id: 2,
    name: "Diana",
    age: 29,
    gender: "Female",
    dominantDosha: "Pitta",
    createdAt: "2025-11-18",
    status: "Completed",
  },
  {
    id: 3,
    name: "Theresa",
    age: 29,
    gender: "Female",
    dominantDosha: "Kapha",
    createdAt: "2025-10-05",
    status: "Draft",
  },
];

export default function HealthProfilesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile()
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div>
      <AyurvedaHeader user={user} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-10">
        {/* ================= HEADER ================= */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">
                My Health Profiles
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-xl">
                Manage your Ayurveda health profiles, review Prakriti analysis,
                and explore personalized predictions and recommendations.
              </p>
            </div>

            <button
              onClick={() => navigate("/health-profile/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
            >
            Create New Profile
            </button>
          </div>
        </div>

        {/* ================= PROFILE GRID ================= */}
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {healthProfiles.map((profile) => (
            <div
              key={profile.id}
              className="group relative rounded-2xl border border-emerald-100 bg-white shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              {/* Top Accent */}
              <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400" />

              <div className="p-6">
                {/* Title */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {profile.name}
                  </h3>

                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      profile.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {profile.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Age:</span>{" "}
                    {profile.age}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Gender:</span>{" "}
                    {profile.gender}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Dominant Dosha:
                    </span>{" "}
                    <span className="text-emerald-700 font-semibold">
                      {profile.dominantDosha}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Created On:
                    </span>{" "}
                    {profile.createdAt}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/health-profile/view/${profile.id}`)
                    }
                    className="flex-1 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 "
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/health-profile/predictions/${profile.id}`)
                    }
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white "
                  >
                    Predictions
                  </button>
                </div>
              </div>

             
            </div>
          ))}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {healthProfiles.length === 0 && (
          <div className="max-w-xl mx-auto mt-20 text-center">
            <div className="text-6xl mb-6">🌿</div>
            <h2 className="text-xl font-semibold text-gray-800">
              No Health Profiles Found
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Create your first health profile to begin personalized Ayurveda
              analysis and predictions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}