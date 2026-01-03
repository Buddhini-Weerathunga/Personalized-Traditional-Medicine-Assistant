import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Wind, Sun, Droplets, ArrowLeft } from "lucide-react";

export default function ViewHealthProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prakriti, setPrakriti] = useState(null);
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // Fetch health profile
    axios
      .get("http://localhost:5000/api/my-profile", { headers })
      .then(res => {
        setProfile(res.data.profile);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });

    // Fetch prakriti report
    axios
      .get("http://localhost:5000/api/prakriti/my-report", { headers })
      .then(res => {
        setPrakriti(res.data.report);
      })
      .catch(() => {
        setPrakriti(null);
      });

    // Fetch user profile
    axios
      .get("http://localhost:5000/api/user/profile", { headers })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });

    // Detect location and weather
    detectLocationAndWeather();
  }, [navigate]);

  const detectLocationAndWeather = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = "1c4d2ecacaee7185aef5d828013692d7";
          
          // Reverse Geocoding (Lat/Lon → City)
          const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
          const geoRes = await axios.get(geoUrl);
          const detectedCity = geoRes.data?.[0]?.name || "Your Location";
          setCity(detectedCity);
          
          // Fetch Weather
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          const weatherRes = await axios.get(weatherUrl);
          const temp = weatherRes.data.main.temp;
          const humidity = weatherRes.data.main.humidity;
          const wind = weatherRes.data.wind.speed;
          
          setWeather({
            temp,
            humidity,
            wind,
            temperatureLevel: temp < 20 ? "Cold" : temp < 30 ? "Moderate" : "Hot",
            humidityLevel: humidity < 40 ? "Low" : humidity < 70 ? "Moderate" : "High",
            windLevel: wind < 2 ? "Low" : wind < 6 ? "Moderate" : "High"
          });
        } catch (err) {
          console.error("Location/Weather error", err);
          setGeoError("Unable to fetch weather data");
        }
      },
      () => {
        setGeoError("Location permission denied");
      }
    );
  };

  const handlePrediction = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        "http://localhost:5000/api/health-prediction/predict",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      navigate("/health-prediction", {
        state: res.data.prediction
      });
    } catch (error) {
      console.error(error);
      alert("Failed to get health prediction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your health profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌿</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Health Profile Found</h2>
          <p className="text-gray-500 mb-6 text-sm">Create your personalized health profile to get started</p>
          <button
            onClick={() => navigate("/health-profile/menu")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Create Health Profile
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  function ScoreCircle({ label, value = 0, color }) {
    const radius = 36;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    const colors = {
      blue: "stroke-blue-600",
      red: "stroke-red-600",
      green: "stroke-green-600"
    };

    return (
      <div className="flex flex-col items-center relative">
        <svg width={radius * 2} height={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={colors[color]}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center mt-10 px-10">
          <span className="text-xs font-semibold text-gray-800">
            {value}%
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-700">
          {label}
        </p>
      </div>
    );
  }

  function WeatherCard({ weather, city, error }) {
    if (error) {
      return (
        <div className="bg-white rounded-xl border p-4 text-sm text-red-600">
          📍 {error}
        </div>
      );
    }
    if (!weather) {
      return (
        <div className="bg-white rounded-xl border p-4 text-sm text-gray-500">
          Detecting your environment…
        </div>
      );
    }
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🌦 Live Environment – {city}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>🌡 Temperature</span>
            <span className="font-medium">
              {weather.temp}°C ({weather.temperatureLevel})
            </span>
          </div>
          <div className="flex justify-between">
            <span>💧 Humidity</span>
            <span className="font-medium">
              {weather.humidity}% ({weather.humidityLevel})
            </span>
          </div>
          <div className="flex justify-between">
            <span>🌬 Wind</span>
            <span className="font-medium">
              {weather.wind} m/s ({weather.windLevel})
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Auto-detected using GPS for Ayurvedic analysis
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Ayurveda Info Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🌿 Ayurveda Health Profile
              </h2>
            <p className="text-green-50 text-sm max-w-2xl">
  This profile summarizes your health details, Dosha tendencies, lifestyle habits, and environmental factors to support personalized Ayurvedic care.
</p>


            </div>
           <div className="hidden lg:flex gap-6 text-sm">
  <div className="flex flex-col items-center bg-white/10 px-4 py-3 rounded-lg text-center">
    <Wind className="w-5 h-5 mb-1" />
    <span className="font-semibold">Vata</span>
    <span className="text-xs text-green-100">Movement</span>
  </div>

  <div className="flex flex-col items-center bg-white/10 px-4 py-3 rounded-lg text-center">
    <Sun className="w-5 h-5 mb-1" />
    <span className="font-semibold">Pitta</span>
    <span className="text-xs text-green-100">Digestion</span>
  </div>

  <div className="flex flex-col items-center bg-white/10 px-4 py-3 rounded-lg text-center">
    <Droplets className="w-5 h-5 mb-1" />
    <span className="font-semibold">Kapha</span>
    <span className="text-xs text-green-100">Stability</span>
  </div>
</div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                  {user?.name}
                </h1>
                <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/health-profile/edit")}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Card */}
            <WeatherCard weather={weather} city={city} error={geoError} />

            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Basic Information</h2>
                    <p className="text-xs text-gray-500">Personal details</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  Primary
                </span>
              </div>

              {prakriti && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-10 py-6 mb-10">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🌿 Current Dosha Scores
                  </h3>

                  <div className="flex justify-between mt-18 text-sm">
                    <ScoreCircle label="Vata" value={prakriti.vataScore} color="blue" />
                    <ScoreCircle label="Pitta" value={prakriti.pittaScore} color="red" />
                    <ScoreCircle label="Kapha" value={prakriti.kaphaScore} color="green" />
                  </div>

                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Dominant Dosha:
                    <span className="ml-2 font-semibold text-green-600">
                      {prakriti.dominantDosha}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Age" value={`${profile.age} years`} />
                  <InfoItem label="Gender" value={profile.gender} />
                  <InfoItem label="Body Frame" value={profile.body_frame} />
                  <InfoItem label="Diet Type" value={profile.veg_nonveg} />
                </div>
              </div>
            </div>

            {/* Eating Pattern Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍽️</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Eating Pattern</h2>
                  <p className="text-xs text-gray-500">Dietary habits and preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Appetite Level" value={profile.appetite_level} />
                <InfoItem label="Meal Regularity" value={profile.meal_regular} />
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Food Intake Frequency (1-5 scale)</h3>
                  <div className="space-y-3">
                    <ProgressBar label="🌶️ Spicy Food" value={profile.spicy_food_frequency} />
                    <ProgressBar label="🍳 Oily Food" value={profile.oily_food_frequency} />
                    <ProgressBar label="🍰 Sweet Food" value={profile.sweet_food_frequency} />
                    <ProgressBar label="☕ Caffeine" value={profile.caffeine_intake} />
                    <ProgressBar label="🍔 Processed Food" value={profile.processed_food_intake} />
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Lifestyle & Mental Health</h2>
                  <p className="text-xs text-gray-500">Daily habits and wellbeing</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Living Environment" value={profile.living_environment} />
                  <InfoItem label="Urine Color" value={profile.urine_color} />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Health Indicators</h3>
                  <div className="space-y-3">
                    <ProgressBar label="😰 Stress Level" value={profile.stress_level} color="red" />
                  
                    <ProgressBar label="😴 Sleep Issues" value={profile.sleep_issues} color="indigo" />
                    <ProgressBar label="🤕 Headaches" value={profile.headaches} color="red" />
                    <ProgressBar label="🦴 Joint Pain" value={profile.joint_pain} color="orange" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Family History Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-600">👨‍👩‍👧‍👦</span>
                <h3 className="font-semibold text-gray-800">Family Medical History</h3>
              </div>

              <div className="space-y-2">
                <HistoryBadge label="Diabetes" value={profile.family_diabetes} />
                <HistoryBadge label="Thyroid" value={profile.family_thyroid} />
                <HistoryBadge label="Cholesterol" value={profile.family_cholesterol} />
                <HistoryBadge label="Obesity" value={profile.family_obesity} />
                <HistoryBadge label="Asthma" value={profile.family_asthma} />
                <HistoryBadge label="Heart Disease" value={profile.family_heart_disease} />
                <HistoryBadge label="Mental Health" value={profile.family_mental_health} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <ActionButton
                  icon="📊"
                  label="View Health Prediction"
                  onClick={handlePrediction}
                />
                <ActionButton icon="💡" label="View Recommendations" />
                <ActionButton icon="🍽️" label="Log New Meal" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value ?? "—"}</p>
    </div>
  );
}

function ProgressBar({ label, value, color = "green" }) {
  const percentage = value ? (value / 5) * 100 : 0;
  
  const colorClasses = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    red: "bg-red-600",
    orange: "bg-orange-600",
    indigo: "bg-indigo-600"
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{value ?? 0}/5</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 ${colorClasses[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function HistoryBadge({ label, value }) {
  const isYes = value === "Yes";
  return (
    <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded ${
          isYes
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <span className="ml-auto text-gray-400">→</span>
    </button>
  );
}