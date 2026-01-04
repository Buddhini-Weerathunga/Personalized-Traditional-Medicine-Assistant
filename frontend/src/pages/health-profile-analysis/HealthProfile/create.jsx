
import React, { useState } from "react";
import axios from "axios";

export default function AyurvedaMultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const updateField = (e) => {
    const { name, type, value, checked } = e.target;

    // Handle checkboxes as Yes / No
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked ? "Yes" : "No" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const next = async () => {
    // If moving from step 6 to step 7, create health profile first
    if (step === 6) {
      try {
        const token = localStorage.getItem("accessToken");

        await axios.post(
          "http://localhost:5000/api/patient-input",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("✅ Health Profile Created Successfully!");
        
        // Navigate to health profile page
        window.location.href = "/health-profile"; // Change this to your actual health profile route
        
      } catch (err) {
        console.error(err);
        alert("❌ Failed to create health profile");
        return; // Don't proceed to next step if creation fails
      }
    }
    
    setStep((s) => Math.min(s + 1, 7));
  };

  const handleSubmit = async () => {
    try {
      // Update with the last step data (environment temperature)
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "http://localhost:5000/api/patient-input",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Health Profile Updated Successfully!");
      
      // Navigate to health profile page
      window.location.href = "/health-profile"; // Change this to your actual health profile route
      
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
          <h1 className="text-3xl font-bold text-center mb-2">🌿 Ayurveda Health Profile</h1>
          <p className="text-center text-green-100">Create your personalized wellness journey</p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 7</span>
            <span className="text-sm font-medium text-green-600">{Math.round((step / 7) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-8 mb-6">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: "Personal" },
              { num: 2, label: "Dosha" },
              { num: 3, label: "Lifestyle" },
              { num: 4, label: "Symptoms" },
              { num: 5, label: "Mind" },
              { num: 6, label: "Family" },
              { num: 7, label: "Environment" },
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-all duration-300 ${
                    step === item.num
                      ? "bg-green-600 text-white scale-110 shadow-lg"
                      : step > item.num
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > item.num ? "✓" : item.num}
                </div>
                <span className={`text-xs font-medium ${step === item.num ? "text-green-600" : "text-gray-500"}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-green-600 mr-2">👤</span> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                  <input
                    name="age"
                    onChange={updateField}
                    placeholder="Enter your age"
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-green-600 mr-2">🍽️</span> Lifestyle & Diet
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Spicy Food */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Spicy Food Frequency
                  </label>
                  <select
                    name="spicy_food_frequency"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Oily Food */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Oily Food Frequency
                  </label>
                  <select
                    name="oily_food_frequency"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                  
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Sweet Food */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sweet Food Frequency
                  </label>
                  <select
                    name="sweet_food_frequency"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Caffeine Intake */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caffeine Intake
                  </label>
                  <select
                    name="caffeine_intake"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Meal Regularity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meal Regularity
                  </label>
                  <select
                    name="meal_regular"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="sometimes">Sometimes</option>
                  </select>
                </div>

                {/* Processed Food */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Processed Food Intake
                  </label>
                  <select
                    name="processed_food_intake"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Fruits Intake */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fruits Intake
                  </label>
                  <select
                    name="fruits_intake"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    
                    <option value="1">Never</option>
                    <option value="2">Rarely</option>
                    <option value="3">Sometimes</option>
                    <option value="4">Often</option>
                    <option value="5">Daily</option>
                  </select>
                </div>

                {/* Vegetables Intake */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diet Preference
                  </label>
                  <select
                    name="vegetables_intake"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                  
                    <option value="vegetarian">Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-green-600 mr-2">🌿</span> Digestive & Body Indicators
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Appetite Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appetite Level
                  </label>
                  <select
                    name="appetite_level"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">Low</option>
                    <option value="2">Slightly Low</option>
                    <option value="3">Moderate</option>
                    <option value="4">High</option>
                    <option value="5">Very High</option>
                  </select>
                </div>

              
                {/* Urine Color (kept descriptive, not numeric) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urine Color
                  </label>
                  <select
                    name="urine_color"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="clear">Clear</option>
                    <option value="yellow">Yellow</option>
                    <option value="dark_yellow">Dark Yellow</option>
                    <option value="pale_yellow">Pale Yellow</option>
                  </select>
                </div>


                {/* Focus Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Focus Level
                  </label>
                  <select
                    name="focus_level"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">Very Poor</option>
                    <option value="2">Poor</option>
                    <option value="3">Fair</option>
                    <option value="4">Good</option>
                    <option value="5">Excellent</option>
                  </select>
                </div>

                {/* Stress Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stress Level
                  </label>
                  <select
                    name="stress_level"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">None</option>
                    <option value="2">Low</option>
                    <option value="3">Moderate</option>
                    <option value="4">High</option>
                    <option value="5">Very High</option>
                  </select>
                </div>

              
                {/* Headaches */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Headaches
                  </label>
                  <select
                    name="headaches"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">None</option>
                    <option value="2">Mild</option>
                    <option value="3">Moderate</option>
                    <option value="4">Frequent</option>
                    <option value="5">Severe</option>
                  </select>
                </div>

                {/* Joint Pain */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Joint Pain
                  </label>
                  <select
                    name="joint_pain"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">None</option>
                    <option value="2">Mild</option>
                    <option value="3">Moderate</option>
                    <option value="4">Severe</option>
                    <option value="5">Very Severe</option>
                  </select>
                </div>

                

                {/* Sleep Issues */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sleep Issues
                  </label>
                  <select
                    name="sleep_issues"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">None</option>
                    <option value="2">Mild</option>
                    <option value="3">Moderate</option>
                    <option value="4">Severe</option>
                    <option value="5">Very Severe</option>
                  </select>
                </div>

                {/* Dry Skin */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dry Skin
                  </label>
                  <select
                    name="dry_skin"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                              focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1">None</option>
                    <option value="2">Mild</option>
                    <option value="3">Moderate</option>
                    <option value="4">Severe</option>
                    <option value="5">Very Severe</option>
                  </select>
                </div>

              </div>
            </div>
          )}


          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-green-600 mr-2">🧠</span> Mental & Emotional Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
              
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Focus Level</label>
                  <select
                    name="focus_level"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option>Select</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                    <option>Very Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stress Level</label>
                  <select
                    name="stress_level"
                    onChange={updateField}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option>Select</option>
                    <option>None</option>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Very High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-green-600 mr-2">👨‍👩‍👧‍👦</span> Family History
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Diabetes */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_diabetes" 
                    name="family_diabetes"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_diabetes" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Diabetes
                  </label>
                </div>

                {/* Thyroid */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_thyroid" 
                    name="family_thyroid"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_thyroid" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Thyroid
                  </label>
                </div>

                {/* Blood Pressure */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_bp" 
                    name="family_bp"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_bp" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Blood Pressure
                  </label>
                </div>

                {/* Cholesterol */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_cholesterol" 
                    name="family_cholesterol"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_cholesterol" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Cholesterol
                  </label>
                </div>

                {/* Obesity */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_obesity" 
                    name="family_obesity"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_obesity" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Obesity
                  </label>
                </div>

                {/* Asthma */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_asthma" 
                    name="family_asthma"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_asthma" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Asthma
                  </label>
                </div>

                {/* Heart Disease */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_heart_disease" 
                    name="family_heart_disease"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_heart_disease" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Heart Disease
                  </label>
                </div>

                {/* Mental Health Issues */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <input 
                    type="checkbox" 
                    id="family_mental_health" 
                    name="family_mental_health"
                    onChange={updateField}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="family_mental_health" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    Family History: Mental Health Issues
                  </label>
                </div>

                
              </div>
            </div>
          )}

          {/* Step 7 – Environment (COMPLETED) */}
  {step === 7 && (
 <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Environment Temperature
  </label>

  {/* Instruction text */}
  <p className="text-xs text-gray-500 mb-2">
    Please select your surrounding environment temperature these days.
  </p>

  <select
    name="temperature"
    onChange={updateField}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
               focus:border-green-500 focus:outline-none transition-colors"
  >
    <option value="">-- Select Temperature --</option>
    <option>Moderate</option>
    <option>Cold</option>
    <option>Hot</option>
  </select>
</div>

)}




        </div>

        {/* Buttons */}
        <div className="flex justify-between p-8 bg-gray-50 border-t">
          {step > 1 && (
            <button
              onClick={prev}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          )}

          {step < 7 ? (
            <button
              onClick={next}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
