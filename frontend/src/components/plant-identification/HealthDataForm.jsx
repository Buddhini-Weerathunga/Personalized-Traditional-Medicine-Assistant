import React, { useState } from 'react';

const HealthDataForm = ({ onSubmit, onSkip }) => {
  const [healthData, setHealthData] = useState({
    age: '',
    medications: [],
    allergies: [],
    conditions: [],
    isNone: false,
    isPregnant: false,
    isBreastfeeding: false,
    otherHealthInfo: ''
  });

  const [currentInput, setCurrentInput] = useState({
    medication: '',
    allergy: '',
    condition: ''
  });

  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (healthData.age && (healthData.age < 1 || healthData.age > 120)) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(healthData);
    }
  };

  const addItem = (field, inputField) => {
    const value = currentInput[inputField].trim();
    if (value && !healthData[field].includes(value)) {
      setHealthData({
        ...healthData,
        [field]: [...healthData[field], value]
      });
      setCurrentInput({ ...currentInput, [inputField]: '' });
    }
  };

  const removeItem = (field, index) => {
    setHealthData({
      ...healthData,
      [field]: healthData[field].filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e, field, inputField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(field, inputField);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🏥</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Health Information Required
            </h3>
            <p className="text-blue-700 mb-4">
              Provide your health information for personalized safety analysis and accurate recommendations.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Fill Health Form
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>🏥</span>
          Health Information
        </h3>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={healthData.age}
            onChange={(e) => setHealthData({ ...healthData, age: e.target.value })}
            placeholder="Enter your age"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            min="1"
            max="120"
          />
          {errors.age && (
            <p className="text-red-600 text-sm mt-1">⚠️ {errors.age}</p>
          )}
        </div>

        {/* Current Medications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Medications
          </label>
          <input
            type="text"
            value={currentInput.medication}
            onChange={(e) => setCurrentInput({ ...currentInput, medication: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e, 'medications', 'medication')}
            placeholder="Enter medication name and press Enter"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mb-2"
          />
          {healthData.medications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {healthData.medications.map((med, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  💊 {med}
                  <button
                    type="button"
                    onClick={() => removeItem('medications', index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Known Allergies
          </label>
          <input
            type="text"
            value={currentInput.allergy}
            onChange={(e) => setCurrentInput({ ...currentInput, allergy: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e, 'allergies', 'allergy')}
            placeholder="Enter allergy and press Enter"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mb-2"
          />
          {healthData.allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {healthData.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  🤧 {allergy}
                  <button
                    type="button"
                    onClick={() => removeItem('allergies', index)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Chronic Conditions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chronic Health Conditions
          </label>
          <input
            type="text"
            value={currentInput.condition}
            onChange={(e) => setCurrentInput({ ...currentInput, condition: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e, 'conditions', 'condition')}
            placeholder="Enter condition and press Enter"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mb-2"
          />
          {healthData.conditions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {healthData.conditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  🏥 {condition}
                  <button
                    type="button"
                    onClick={() => removeItem('conditions', index)}
                    className="text-orange-600 hover:text-orange-800 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Special Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
            <input
              type="checkbox"
              checked={healthData.isNone}
              onChange={(e) => setHealthData({ ...healthData, isNone: e.target.checked })}
              className="w-5 h-5 text-gray-600 rounded focus:ring-gray-500"
            />
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <span className="text-xl"></span>
              None
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
            <input
              type="checkbox"
              checked={healthData.isPregnant}
              onChange={(e) => setHealthData({ ...healthData, isPregnant: e.target.checked })}
              className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <span className="text-xl"></span>
              Pregnant
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
            <input
              type="checkbox"
              checked={healthData.isBreastfeeding}
              onChange={(e) => setHealthData({ ...healthData, isBreastfeeding: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <span className="text-xl"></span>
              Breastfeeding
            </span>
          </label>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Health Information (Optional)
          </label>
          <textarea
            value={healthData.otherHealthInfo}
            onChange={(e) => setHealthData({ ...healthData, otherHealthInfo: e.target.value })}
            placeholder="Any other relevant health information..."
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 flex items-start gap-2">
            <span className="text-lg">🔒</span>
            <span>
              Your health information is encrypted and used only for personalized safety analysis. 
              We never share your data with third parties.
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Save & Continue
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Skip
          </button>
        </div>
      </div>
    </form>
  );
};

export default HealthDataForm;
