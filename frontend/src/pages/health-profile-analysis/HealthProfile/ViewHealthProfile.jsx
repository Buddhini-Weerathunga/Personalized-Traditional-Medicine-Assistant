import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewHealthProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth + fetch profile
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/my-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setProfile(res.data.profile);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your health profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">
          No health profile found.
        </p>
        <button
          onClick={() => navigate("/health-profile/menu")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg"
        >
          Create Health Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-6 text-green-700">
          🧾 Your Health Profile
        </h2>

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Item label="Age" value={profile.age} />
          <Item label="Gender" value={profile.gender} />
        </Section>

        {/* BODY & APPETITE */}
        <Section title="Body & Appetite">
          <Item label="Body Frame" value={profile.body_frame} />
          <Item label="Appetite Level" value={profile.appetite_level} />
          <Item label="Meal Regularity" value={profile.meal_regular} />
        </Section>

        {/* DOSHA SCORES */}
        <Section title="Prakriti (Dosha Scores)">
          <Item label="Vata" value={profile.prakriti_vata_score} />
          <Item label="Pitta" value={profile.prakriti_pitta_score} />
          <Item label="Kapha" value={profile.prakriti_kapha_score} />
        </Section>

        {/* LIFESTYLE */}
        <Section title="Lifestyle & Wellness">
          <Item label="Stress Level" value={profile.stress_level} />
          <Item label="Sleep Issues" value={profile.sleep_issues} />
          <Item label="Fatigue" value={profile.fatigue} />
        </Section>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/health-profile/menu")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Edit / Recreate Profile
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-200 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">
        {value ?? "—"}
      </p>
    </div>
  );
}
