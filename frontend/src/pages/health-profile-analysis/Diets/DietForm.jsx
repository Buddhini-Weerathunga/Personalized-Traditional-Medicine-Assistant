import React, { useState } from 'react';
import { Leaf, Clock, Droplet, Flame, Wind, Activity, Sun, Sparkles, Heart, TrendingUp } from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hardcoded response data
  const result = {
    status: "success",
    prediction: {
      suitability_rating: 5.97,
      recommended_alternative_meal: "Warm string hoppers with coconut sambol",
      dietary_advice: "Include sesame oil in cooking for vata balance | Consume light dinner before 7 PM for better sleep | Consume fresh lime juice for vitamin C and digestion | Include murunga (drumstick) leaves for detoxification | Add more ginger and turmeric to your meals for better digestion | Include tamarind in moderation for digestive fire | Consume warm herbal teas with coriander and cumin seeds | Include pumpkin for eye health and digestion | Add more kokum or goraka for digestive fire | Add cardamom to tea for improved digestion"
    }
  };

  const adviceList = result.prediction.dietary_advice.split(' | ');

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Time</label>
                  <input
                    type="time"
                    name="meal_time"
                    value={formData.meal_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Climate</label>
                  <select
                    name="climate"
                    value={formData.climate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="cold">Cold</option>
                    <option value="moderate">Moderate</option>
                    <option value="hot">Hot</option>
                    <option value="humid">Humid</option>
                  </select>
                </div>
              </div>
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
                        strokeDashoffset={377 - (377 * result.prediction.suitability_rating) / 10}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-bold">
                        {result.prediction.suitability_rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-green-100">out of 10</span>
                    </div>
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
                  {result.prediction.recommended_alternative_meal}
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
                {adviceList.map((advice, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-green-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-center gap-3 text-green-800">
                <Sparkles className="w-6 h-6" />
                <p className="text-lg font-semibold">Analysis Complete - Follow these recommendations for optimal health</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}