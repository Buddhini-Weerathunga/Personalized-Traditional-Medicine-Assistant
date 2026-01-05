import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { getRiskAlerts, dismissAlert, checkPersonalizedRisks } from '../../services/plant-identification/plantApi';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info
  const [activeTab, setActiveTab] = useState('plant'); // plant, health
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  // Plant Information State
  const [plantData, setPlantData] = useState({
    plantName: '',
    plantPart: ''
  });

  // Health Data State
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

  const plantParts = [
    'Leaves',
    'Roots',
    'Bark',
    'Flowers',
    'Seeds',
    'Fruits',
    'Stem',
    'Whole Plant',
    'Oil/Extract',
    'Other'
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getRiskAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  // Health form helper functions
  const validateForm = () => {
    const newErrors = {};
    
    if (!plantData.plantName.trim()) {
      newErrors.plantName = 'Please enter a plant name';
    }
    
    if (!plantData.plantPart) {
      newErrors.plantPart = 'Please select a plant part';
    }

    if (healthData.age && (healthData.age < 1 || healthData.age > 120)) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleAnalyzeRisks = async () => {
    if (!validateForm()) {
      return;
    }

    setAnalyzing(true);
    try {
      const result = await checkPersonalizedRisks({
        ...plantData,
        healthData
      });
      // Add the new personalized alerts to the existing alerts
      if (result && result.alerts) {
        setAlerts(prevAlerts => [...result.alerts, ...prevAlerts]);
      }
      setShowHealthForm(false);
      // Reset form
      setPlantData({ plantName: '', plantPart: '' });
      setHealthData({
        age: '',
        medications: [],
        allergies: [],
        conditions: [],
        isNone: false,
        isPregnant: false,
        isBreastfeeding: false,
        otherHealthInfo: ''
      });
      setActiveTab('plant');
    } catch (error) {
      console.error('Error analyzing risks:', error);
      setErrors({ submit: 'Failed to analyze risks. Please try again.' });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading risk alerts..." />;
  }

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Background Decorations */}
      <div className="pointer-events-none">
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-red-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-4">
            <span>🚨 Important Safety Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Safety Alerts
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Important safety information about medicinal plants
          </p>

          {/* Check Personalized Risks Button */}
          <button
            onClick={() => setShowHealthForm(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            <span>🏥</span>
            Check Personalized Risks
          </button>
        </div>

        {/* Health Data Form Modal */}
        {showHealthForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🔍</span>
                  Check Personalized Risks
                </h2>
                <button
                  onClick={() => setShowHealthForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('plant')}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                    activeTab === 'plant'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🌿</span>
                    Plant Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                    activeTab === 'health'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🏥</span>
                    Health Data
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'plant' ? (
                  /* Plant Information Tab */
                  <div className="space-y-6">
                    {/* Plant Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Plant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={plantData.plantName}
                        onChange={(e) => setPlantData({ ...plantData, plantName: e.target.value })}
                        placeholder="Enter the plant name (e.g., Aloe Vera, Turmeric)"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                      {errors.plantName && (
                        <p className="text-red-600 text-sm mt-1">⚠️ {errors.plantName}</p>
                      )}
                    </div>

                    {/* Plant Part */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Plant Part <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {plantParts.map((part) => (
                          <button
                            key={part}
                            type="button"
                            onClick={() => setPlantData({ ...plantData, plantPart: part })}
                            className={`p-3 rounded-lg border-2 font-medium transition-all ${
                              plantData.plantPart === part
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 hover:border-green-300 text-gray-700'
                            }`}
                          >
                            {part}
                          </button>
                        ))}
                      </div>
                      {errors.plantPart && (
                        <p className="text-red-600 text-sm mt-1">⚠️ {errors.plantPart}</p>
                      )}
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <span>
                          Different parts of a plant may have different effects and safety profiles. 
                          Select the specific part you plan to use for accurate risk assessment.
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Health Data Tab */
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
                        <span className="font-medium text-gray-700">None</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                        <input
                          type="checkbox"
                          checked={healthData.isPregnant}
                          onChange={(e) => setHealthData({ ...healthData, isPregnant: e.target.checked })}
                          className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="font-medium text-gray-700">Pregnant</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                          type="checkbox"
                          checked={healthData.isBreastfeeding}
                          onChange={(e) => setHealthData({ ...healthData, isBreastfeeding: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-700">Breastfeeding</span>
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
                          Your health information is used only for personalized safety analysis. 
                          We never share your data with third parties.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                {errors.submit && (
                  <p className="text-red-600 text-sm mb-4 text-center">⚠️ {errors.submit}</p>
                )}
                <div className="flex gap-3">
                  {activeTab === 'plant' ? (
                    <button
                      onClick={() => {
                        if (plantData.plantName && plantData.plantPart) {
                          setActiveTab('health');
                        } else {
                          validateForm();
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                    >
                      Next: Health Data →
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab('plant')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleAnalyzeRisks}
                        disabled={analyzing}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {analyzing ? 'Analyzing...' : '🔍 Analyze Risks'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-700">
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-xs text-red-600 font-medium mt-1">Critical</div>
        </div>
        <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-orange-700">
            {alerts.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-xs text-orange-600 font-medium mt-1">High</div>
        </div>
        <div className="bg-yellow-50/50 border border-yellow-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-yellow-700">
            {alerts.filter(a => a.severity === 'medium').length}
          </div>
          <div className="text-xs text-yellow-600 font-medium mt-1">Medium</div>
        </div>
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-700">
            {alerts.filter(a => a.severity === 'low').length}
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">Info</div>
        </div>
      </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-gray-700 text-white'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          All Alerts
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white border-2 border-red-300 text-red-600 hover:border-red-400'
          }`}
        >
          Critical
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'high'
              ? 'bg-orange-600 text-white'
              : 'bg-white border-2 border-orange-300 text-orange-600 hover:border-orange-400'
          }`}
        >
          High
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'medium'
              ? 'bg-yellow-600 text-white'
              : 'bg-white border-2 border-yellow-300 text-yellow-600 hover:border-yellow-400'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'low'
              ? 'bg-blue-600 text-white'
              : 'bg-white border-2 border-blue-300 text-blue-600 hover:border-blue-400'
          }`}
        >
          Info
        </button>
      </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Alerts</h2>
          <p className="text-gray-600">You're all clear! No safety warnings at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className={`border-l-4 ${getSeverityColor(alert.severity)} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{alert.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mt-1 ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity} Risk
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(alert._id)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{alert.description}</p>

              {alert.affectedPlants && alert.affectedPlants.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Affected Plants:</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.affectedPlants.map((plant, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                      >
                        🌿 {plant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {alert.recommendations && alert.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index} className="pl-6 relative text-gray-700">
                        <span className="absolute left-0">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Posted: {new Date(alert.createdAt).toLocaleDateString()}
                </span>
                {alert.plantId && (
                  <button
                    onClick={() => navigate(`/plant-details/${alert.plantId}`)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                  >
                    View Plant Details →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Safety Guidelines Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4">General Safety Guidelines</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span>🏥</span> Before Using Any Medicinal Plant:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Consult with a qualified healthcare provider
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Verify plant identification with an expert
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Check for drug interactions
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                Start with small doses to test tolerance
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span>⚠️</span> Avoid If:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You are pregnant or breastfeeding (unless approved)
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You have chronic health conditions
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You are taking prescription medications
              </li>
              <li className="pl-6 relative">
                <span className="absolute left-0">•</span>
                You have known allergies to similar plants
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RiskAlerts;
