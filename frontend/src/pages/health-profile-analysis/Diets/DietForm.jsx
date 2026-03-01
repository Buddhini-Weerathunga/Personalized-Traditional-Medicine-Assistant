import React, { useState, useEffect, useMemo } from 'react';
import {
  Leaf, Clock, Droplet, Flame, Wind, Activity, Sun, Sparkles, Heart, TrendingUp
} from 'lucide-react';
import axios from "axios";
import { predictAyurvedaDiet } from "../../../services/api";

// ✅ Charts (Recharts)
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

export default function AyurvedaDietCoach() {
  const [formData, setFormData] = useState({
    vata_score_percent: 33,
    pitta_score_percent: 33,
    kapha_score_percent: 34,
    meal_time: '19:30',
    meal_name: 'Rice and curry',
    portion_size: 'medium',
    food_spicy: 'medium',
    food_oily: 'medium',
    physical_activity: 'moderate',
    climate: 'moderate'
  });

  const [weatherInfo, setWeatherInfo] = useState({
    detected: false,
    temp: null,
    humidity: null,
    wind: null,
    location: '',
    condition: ''
  });

  // ✅ NEW: loading state for prakriti scores
  const [loadingPrakriti, setLoadingPrakriti] = useState(true);
  const [prakritiError, setPrakritiError] = useState("");

  const [result, setResult] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [errorPredict, setErrorPredict] = useState("");

  // ✅ NEW: Fetch logged-in user's prakriti (Vata/Pitta/Kapha) scores on mount
  useEffect(() => {
    const fetchPrakriti = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setPrakritiError("Not logged in");
          setLoadingPrakriti(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/prakriti/my-report", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const report = res.data?.report;
        if (report) {
          setFormData(prev => ({
            ...prev,
            vata_score_percent: report.vataScore ?? prev.vata_score_percent,
            pitta_score_percent: report.pittaScore ?? prev.pitta_score_percent,
            kapha_score_percent: report.kaphaScore ?? prev.kapha_score_percent,
          }));
        } else {
          setPrakritiError("No prakriti report found. Using default values.");
        }
      } catch (err) {
        setPrakritiError("Could not load your dosha scores. Using default values.");
      } finally {
        setLoadingPrakriti(false);
      }
    };

    fetchPrakriti();
  }, []);

  useEffect(() => {
    const detectClimate = (temp, humidity) => {
      if (humidity >= 70) return "humid";
      if (temp >= 30) return "hot";
      if (temp <= 18) return "cold";
      return "moderate";
    };

    const detectClimateFromLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const apiKey = "bd5e378503939ddaee76f12ad7a97608";

          try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            const detectedCity = geoData?.[0]?.name || "Your Location";

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const condition = weatherData.weather[0].description;

            const detectedClimate = detectClimate(temp, humidity);

            setFormData(prev => ({
              ...prev,
              climate: detectedClimate
            }));

            setWeatherInfo({
              detected: true,
              temp: temp,
              humidity: humidity,
              wind: wind,
              location: detectedCity,
              condition: condition
            });
          } catch (error) {
            console.error("Weather fetch failed", error);
            setWeatherInfo({
              detected: false,
              temp: null,
              humidity: null,
              wind: null,
              location: '',
              condition: ''
            });
          }
        }, (error) => {
          console.error("Geolocation error:", error);
          setWeatherInfo({
            detected: false,
            temp: null,
            humidity: null,
            wind: null,
            location: '',
            condition: ''
          });
        });
      } catch (error) {
        console.error("Climate auto-detection failed", error);
      }
    };

    detectClimateFromLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const timeToMealSlot = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return "dinner";
    const [h, m] = timeStr.split(":").map(Number);
    const minutes = h * 60 + m;

    if (minutes >= 300 && minutes < 660) return "breakfast";
    if (minutes >= 660 && minutes < 960) return "lunch";
    if (minutes >= 960 && minutes < 1320) return "dinner";
    return "dinner";
  };

  const handlePredict = async () => {
    setLoadingPredict(true);
    setErrorPredict("");
    setResult(null);

    try {
      const payload = {
        ...formData,
        vata_score_percent: Number(formData.vata_score_percent),
        pitta_score_percent: Number(formData.pitta_score_percent),
        kapha_score_percent: Number(formData.kapha_score_percent),
        meal_time: timeToMealSlot(formData.meal_time),
      };

      const res = await predictAyurvedaDiet(payload);
      setResult(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Prediction failed";
      setErrorPredict(msg);
    } finally {
      setLoadingPredict(false);
    }
  };

  const adviceList = result?.prediction?.dietary_advice
    ? result.prediction.dietary_advice.split(' | ')
    : [];

  const dominantDosha = useMemo(() => {
    const v = Number(formData.vata_score_percent) || 0;
    const p = Number(formData.pitta_score_percent) || 0;
    const k = Number(formData.kapha_score_percent) || 0;

    const max = Math.max(v, p, k);
    if (max === v) return "Vata";
    if (max === p) return "Pitta";
    return "Kapha";
  }, [formData.vata_score_percent, formData.pitta_score_percent, formData.kapha_score_percent]);

  const balanceIndex = useMemo(() => {
    const v = Number(formData.vata_score_percent) || 0;
    const p = Number(formData.pitta_score_percent) || 0;
    const k = Number(formData.kapha_score_percent) || 0;
    const arr = [v, p, k].sort((a, b) => a - b);
    const spread = arr[2] - arr[0];
    const score = Math.max(0, Math.min(100, 100 - spread));
    return score;
  }, [formData.vata_score_percent, formData.pitta_score_percent, formData.kapha_score_percent]);

  const doshaChartData = useMemo(() => ([
    { name: "Vata", value: Number(formData.vata_score_percent) || 0 },
    { name: "Pitta", value: Number(formData.pitta_score_percent) || 0 },
    { name: "Kapha", value: Number(formData.kapha_score_percent) || 0 },
  ]), [formData.vata_score_percent, formData.pitta_score_percent, formData.kapha_score_percent]);

  const doshaBarData = useMemo(() => ([
    { dosha: "Vata", percent: Number(formData.vata_score_percent) || 0 },
    { dosha: "Pitta", percent: Number(formData.pitta_score_percent) || 0 },
    { dosha: "Kapha", percent: Number(formData.kapha_score_percent) || 0 },
  ]), [formData.vata_score_percent, formData.pitta_score_percent, formData.kapha_score_percent]);

  const levelToNumber = (v) => {
    if (v === "low") return 1;
    if (v === "high") return 3;
    return 2;
  };

  const lifestyleRadarData = useMemo(() => ([
    { metric: "Spiciness", value: levelToNumber(formData.food_spicy) },
    { metric: "Oiliness", value: levelToNumber(formData.food_oily) },
    { metric: "Activity", value: levelToNumber(formData.physical_activity) },
    { metric: "Climate", value: (() => {
      if (formData.climate === "cold") return 1;
      if (formData.climate === "hot") return 3;
      if (formData.climate === "humid") return 2.5;
      return 2;
    })() },
  ]), [formData.food_spicy, formData.food_oily, formData.physical_activity, formData.climate]);

  const pieColors = ["#3B82F6", "#EF4444", "#10B981"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Leaf className="w-14 h-14 text-green-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3">Ayurveda Diet Coach</h1>
          <p className="text-gray-600 text-lg">Personalized dietary guidance based on your dosha balance</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          {/* Form Section - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-600" />
              Your Profile
            </h2>

            <div className="space-y-6">
              {/* Dosha Scores */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  Dosha Balance
                </h3>

                {/* ✅ NEW: Loading / error banner for prakriti fetch */}
                {loadingPrakriti && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    Loading your dosha scores…
                  </div>
                )}
                {!loadingPrakriti && prakritiError && (
                  <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    ⚠️ {prakritiError}
                  </div>
                )}
                {!loadingPrakriti && !prakritiError && (
                  <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    ✅ Dosha scores loaded from your health profile
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Vata</label>
                      <span className="text-sm font-semibold text-blue-600">{formData.vata_score_percent}%</span>
                    </div>
                    <input
                      type="range"
                      name="vata_score_percent"
                      min="0"
                      max="100"
                      value={formData.vata_score_percent}
                      onChange={handleChange}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Pitta</label>
                      <span className="text-sm font-semibold text-red-600">{formData.pitta_score_percent}%</span>
                    </div>
                    <input
                      type="range"
                      name="pitta_score_percent"
                      min="0"
                      max="100"
                      value={formData.pitta_score_percent}
                      onChange={handleChange}
                      className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Kapha</label>
                      <span className="text-sm font-semibold text-green-600">{formData.kapha_score_percent}%</span>
                    </div>
                    <input
                      type="range"
                      name="kapha_score_percent"
                      min="0"
                      max="100"
                      value={formData.kapha_score_percent}
                      onChange={handleChange}
                      className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Meal Details */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Meal Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Time
                  </label>
                  <input
                    type="time"
                    name="meal_time"
                    value={formData.meal_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white
                               focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                  <input
                    type="text"
                    name="meal_name"
                    value={formData.meal_name}
                    onChange={handleChange}
                    placeholder="e.g., Rice and curry"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portion Size</label>
                  <select
                    name="portion_size"
                    value={formData.portion_size}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              {/* Food Properties */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Food Properties
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spiciness</label>
                    <select
                      name="food_spicy"
                      value={formData.food_spicy}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oiliness</label>
                    <select
                      name="food_oily"
                      value={formData.food_oily}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Lifestyle Factors
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Physical Activity</label>
                  <select
                    name="physical_activity"
                    value={formData.physical_activity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Climate</label>
                  {weatherInfo.detected ? (
                    <div className="w-full px-4 py-3 border border-green-300 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-green-800 capitalize">
                          {formData.climate} Climate Detected
                        </span>
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Location:</strong> {weatherInfo.location}</p>
                        <p><strong>Temperature:</strong> {weatherInfo.temp.toFixed(1)}°C</p>
                        <p><strong>Humidity:</strong> {weatherInfo.humidity}%</p>
                        <p><strong>Wind Speed:</strong> {weatherInfo.wind} m/s</p>
                        <p><strong>Condition:</strong> {weatherInfo.condition}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        <span className="text-sm text-gray-600">Detecting climate...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePredict}
                disabled={loadingPredict}
                className="w-full mt-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
              >
                {loadingPredict ? "Analyzing..." : "Get Recommendations"}
              </button>

              {errorPredict && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorPredict}
                </div>
              )}
            </div>
          </div>

          {/* Results Section - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Suitability Rating Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <Heart className="w-7 h-7" />
                    Meal Suitability Score
                  </h2>
                  <p className="text-green-100 text-lg">Based on your dosha balance and lifestyle</p>

                  <div className="mt-4 text-green-50 text-sm space-y-1">
                    <p><strong>Dominant Dosha:</strong> {dominantDosha}</p>
                    <p><strong>Balance Index:</strong> {Math.round(balanceIndex)} / 100</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative w-36 h-36 md:w-40 md:h-40">
                    <svg className="transform -rotate-90 w-full h-full">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="14"
                        fill="none"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="white"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray={377}
                        strokeDashoffset={
                          377 - (377 * (result?.prediction?.suitability_rating ?? 0)) / 10
                        }
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-bold">
                        {(result?.prediction?.suitability_rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-green-100">out of 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           {/* Charts Card */}
<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100">
  <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
    <TrendingUp className="w-6 h-6 text-green-600" />
    Insights & Charts
  </h2>
  <p className="text-sm text-gray-600 mb-6">
    Visual summary of your dosha balance and lifestyle factors.
  </p>

  {/* ✅ Two charts same row on md+ */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Pie chart */}
    <div className="rounded-xl border border-green-100 p-4 bg-gradient-to-r from-green-50 to-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Dosha Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={doshaChartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {doshaChartData.map((_, idx) => (
                <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Radar chart (✅ now same row, not full width) */}
    <div className="rounded-xl border border-green-100 p-4 bg-gradient-to-r from-green-50 to-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Lifestyle Intensity Radar
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={lifestyleRadarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis domain={[0, 3]} />
            <ReTooltip />
            <Radar dataKey="value" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        Scale: low=1, medium/moderate=2, high=3 (humid=2.5)
      </div>
    </div>
  </div>


              {/* Model output fields */}
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500">Meal Slot (model)</div>
                  <div className="font-semibold text-gray-800 capitalize">
                    {timeToMealSlot(formData.meal_time)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500">Predicted Suitability</div>
                  <div className="font-semibold text-gray-800">
                    {(result?.prediction?.suitability_rating ?? 0).toFixed(1)} / 10
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-semibold text-gray-800">
                    {result?.status || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Meal Recommendation */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Droplet className="w-6 h-6 text-green-600" />
                Recommended Alternative Meal
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-600">
                <p className="text-xl text-gray-800 font-medium">
                  {result?.prediction?.recommended_alternative_meal || "—"}
                </p>
                <p className="text-sm text-gray-600 mt-2">This meal better aligns with your current dosha balance</p>
              </div>
            </div>

            {/* Dietary Advice */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-green-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-500" />
                Personalized Dietary Recommendations
              </h2>
              <div className="grid gap-3">
                {adviceList.length ? (
                  adviceList.map((advice, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-green-100"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1 pt-1">{advice}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
                    Click <strong>Get Recommendations</strong> to see your personalized advice.
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-center gap-3 text-green-800">
                <Sparkles className="w-6 h-6" />
                <p className="text-lg font-semibold">
                  {result?.status === "success"
                    ? "Analysis Complete - Follow these recommendations for optimal health"
                    : "Fill the form and run analysis to get results"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}