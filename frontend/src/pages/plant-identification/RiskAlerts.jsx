import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { getRiskAlerts, dismissAlert, checkPersonalizedRisks, getPlantParts, updateRiskAlert, deleteRiskAlert } from '../../services/plant-identification/plantApi';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('plant');
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const [plantData, setPlantData] = useState({ plantName: '', plantPart: '', purpose: '' });
  const [healthData, setHealthData] = useState({ age: '', medications: [], allergies: [], conditions: [], isNone: false, isPregnant: false, isBreastfeeding: false, otherHealthInfo: '' });
  const [currentInput, setCurrentInput] = useState({ medication: '', allergy: '', condition: '' });
  const [errors, setErrors] = useState({});
  const [availableParts, setAvailableParts] = useState([]);
  const [loadingParts, setLoadingParts] = useState(false);
  const [plantNameDebounce, setPlantNameDebounce] = useState(null);

  // Default generic parts
  const defaultParts = ['Leaves','Roots','Bark','Flowers','Seeds','Fruits','Stem','Whole Plant','Oil/Extract','Other'];

  useEffect(() => { fetchAlerts(); }, []);

  // Debounced plant name lookup for dynamic parts
  useEffect(() => {
    if (plantNameDebounce) clearTimeout(plantNameDebounce);
    if (plantData.plantName.trim().length >= 2) {
      const timer = setTimeout(async () => {
        setLoadingParts(true);
        try {
          const result = await getPlantParts(plantData.plantName.trim());
          if (result.success && result.parts) {
            setAvailableParts(result.parts);
            // Clear selected part if not in new parts list
            if (plantData.plantPart && !result.parts.includes(plantData.plantPart)) {
              setPlantData(prev => ({ ...prev, plantPart: '' }));
            }
          }
        } catch {
          setAvailableParts(defaultParts);
        } finally { setLoadingParts(false); }
      }, 400);
      setPlantNameDebounce(timer);
    } else {
      setAvailableParts(defaultParts);
    }
    return () => { if (plantNameDebounce) clearTimeout(plantNameDebounce); };
  }, [plantData.plantName]);

  const fetchAlerts = async () => {
    try { setLoading(true); const data = await getRiskAlerts(); setAlerts(data); }
    catch (error) { console.error('Error fetching alerts:', error); }
    finally { setLoading(false); }
  };

  const handleDismiss = async (alertId) => {
    try { await dismissAlert(alertId); setAlerts(alerts.filter(a => a._id !== alertId)); }
    catch (error) { console.error('Error dismissing alert:', error); }
  };

  const handleDelete = async (alertId) => {
    try {
      await deleteRiskAlert(alertId);
      setAlerts(alerts.filter(a => a._id !== alertId));
      setConfirmDelete(null);
    } catch (error) { console.error('Error deleting alert:', error); }
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setPlantData({ plantName: alert.plantName, plantPart: alert.plantPart, purpose: alert.purpose || '' });
    setHealthData(alert.healthData || { age: '', medications: [], allergies: [], conditions: [], isNone: false, isPregnant: false, isBreastfeeding: false, otherHealthInfo: '' });
    setActiveTab('plant');
    setShowHealthForm(true);
  };

  const getRiskStyle = (level) => {
    switch (level) {
      case 'high': return { border: 'border-l-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', icon: 'text-red-500', ring: 'ring-red-200' };
      case 'medium': return { border: 'border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500', ring: 'ring-amber-200' };
      case 'low': return { border: 'border-l-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500', ring: 'ring-emerald-200' };
      default: return { border: 'border-l-gray-500', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700', icon: 'text-gray-500', ring: 'ring-gray-200' };
    }
  };

  const filteredAlerts = alerts.filter(a => filter === 'all' || a.riskLevel === filter);

  const validateForm = () => {
    const newErrors = {};
    if (!plantData.plantName.trim()) newErrors.plantName = 'Please enter a plant name';
    if (!plantData.plantPart) newErrors.plantPart = 'Please select a plant part';
    if (!plantData.purpose.trim()) newErrors.purpose = 'Please select or enter a purpose';
    if (healthData.age && (healthData.age < 1 || healthData.age > 120)) newErrors.age = 'Please enter a valid age between 1 and 120';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = (field, inputField) => {
    const value = currentInput[inputField].trim();
    if (value && !healthData[field].includes(value)) {
      setHealthData({ ...healthData, [field]: [...healthData[field], value] });
      setCurrentInput({ ...currentInput, [inputField]: '' });
    }
  };

  const removeItem = (field, index) => {
    setHealthData({ ...healthData, [field]: healthData[field].filter((_, i) => i !== index) });
  };

  const handleKeyPress = (e, field, inputField) => {
    if (e.key === 'Enter') { e.preventDefault(); addItem(field, inputField); }
  };

  const handleAnalyzeRisks = async () => {
    if (!validateForm()) return;
    setAnalyzing(true);
    try {
      if (editingAlert) {
        // Update existing alert
        const result = await updateRiskAlert(editingAlert._id, { ...plantData, healthData });
        if (result?.success && result.alert) {
          setAlerts(prev => prev.map(a => a._id === editingAlert._id ? result.alert : a));
        }
      } else {
        // Create new alert via Groq-powered endpoint
        const result = await checkPersonalizedRisks({ ...plantData, healthData });
        if (result?.alerts) {
          // Mark alerts as AI-powered if backend said so
          const enriched = result.alerts.map(a => ({ ...a, _aiPowered: !!result.aiPowered }));
          setAlerts(prev => [...enriched, ...prev]);
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error analyzing risks:', error);
      setErrors({ submit: 'Failed to analyze risks. Please try again.' });
    } finally { setAnalyzing(false); }
  };

  const resetForm = () => {
    setShowHealthForm(false);
    setEditingAlert(null);
    setPlantData({ plantName: '', plantPart: '', purpose: '' });
    setHealthData({ age: '', medications: [], allergies: [], conditions: [], isNone: false, isPregnant: false, isBreastfeeding: false, otherHealthInfo: '' });
    setActiveTab('plant');
    setAvailableParts(defaultParts);
    setErrors({});
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High Risk' },
    { key: 'medium', label: 'Medium Risk' },
    { key: 'low', label: 'Low Risk' },
  ];

  if (loading) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading risk alerts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4">Safety Information</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Safety Alerts</h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">Personalized safety information about medicinal plants</p>
            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                AI Powered by Groq
              </span>
            </div>
            <button onClick={() => { resetForm(); setShowHealthForm(true); }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Check Personalized Risks
            </button>
          </div>

          {/* Health Form Modal */}
          {showHealthForm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    {editingAlert ? 'Edit Risk Assessment' : 'Check Personalized Risks'}
                  </h2>
                  <button onClick={resetForm} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Modal Tabs */}
                <div className="flex gap-1 p-1 mx-5 mt-4 bg-gray-100 rounded-xl">
                  <button onClick={() => setActiveTab('plant')}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'plant' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    Plant Information
                  </button>
                  <button onClick={() => setActiveTab('health')}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'health' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    Health Data
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-5 max-h-[60vh] overflow-y-auto">
                  {activeTab === 'plant' ? (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Plant Name <span className="text-red-400">*</span></label>
                        <input type="text" value={plantData.plantName} onChange={(e) => setPlantData({ ...plantData, plantName: e.target.value })}
                          placeholder="e.g., Aloe Vera, Turmeric" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors" />
                        {errors.plantName && <p className="text-xs text-red-500 mt-1">{errors.plantName}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                          Plant Part <span className="text-red-400">*</span>
                          {loadingParts && <span className="ml-2 text-emerald-500 normal-case tracking-normal font-medium">Loading parts...</span>}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {(availableParts.length > 0 ? availableParts : defaultParts).map((part) => (
                            <button key={part} type="button" onClick={() => setPlantData({ ...plantData, plantPart: part })}
                              className={`p-2.5 rounded-xl text-xs font-semibold transition-all border ${plantData.plantPart === part ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}>
                              {part}
                            </button>
                          ))}
                        </div>
                        {errors.plantPart && <p className="text-xs text-red-500 mt-1">{errors.plantPart}</p>}
                      </div>
                      {/* Purpose Field */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">At what purpose do you want to know about this plant part? <span className="text-red-400">*</span></label>
                        <select
                          value={plantData.purpose}
                          onChange={(e) => setPlantData({ ...plantData, purpose: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors bg-white"
                        >
                          <option value="">Select a purpose...</option>
                          <option value="General Wellness">General Wellness</option>
                          <option value="Skin Care">Skin Care</option>
                          <option value="Digestive Health">Digestive Health</option>
                          <option value="Respiratory Health">Respiratory Health</option>
                          <option value="Pain Relief">Pain Relief</option>
                          <option value="Immunity Boost">Immunity Boost</option>
                          <option value="Hair Care">Hair Care</option>
                          <option value="Mental Health & Stress Relief">Mental Health & Stress Relief</option>
                          <option value="Wound Healing">Wound Healing</option>
                          <option value="Detoxification">Detoxification</option>
                          <option value="Weight Management">Weight Management</option>
                          <option value="Joint & Bone Health">Joint & Bone Health</option>
                          <option value="Heart & Blood Health">Heart & Blood Health</option>
                          <option value="Diabetes Management">Diabetes Management</option>
                          <option value="Cooking / Culinary Use">Cooking / Culinary Use</option>
                          <option value="Other">Other</option>
                        </select>
                        {plantData.purpose === 'Other' && (
                          <input
                            type="text"
                            placeholder="Please specify your purpose"
                            className="w-full mt-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors"
                            onChange={(e) => setPlantData({ ...plantData, purpose: e.target.value || 'Other' })}
                          />
                        )}
                        {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs text-emerald-700">Type a plant name above and the available parts for that plant will appear automatically. Different parts have different effects and safety profiles.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Age</label>
                        <input type="number" value={healthData.age} onChange={(e) => setHealthData({ ...healthData, age: e.target.value })}
                          placeholder="Enter your age" min="1" max="120" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors" />
                        {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                      </div>
                      {/* Medications */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Current Medications</label>
                        <input type="text" value={currentInput.medication} onChange={(e) => setCurrentInput({ ...currentInput, medication: e.target.value })}
                          onKeyDown={(e) => handleKeyPress(e, 'medications', 'medication')} placeholder="Type and press Enter"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors mb-2" />
                        {healthData.medications.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {healthData.medications.map((med, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium border border-blue-100">
                                {med}
                                <button type="button" onClick={() => removeItem('medications', i)} className="text-blue-400 hover:text-blue-600">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Allergies */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Known Allergies</label>
                        <input type="text" value={currentInput.allergy} onChange={(e) => setCurrentInput({ ...currentInput, allergy: e.target.value })}
                          onKeyDown={(e) => handleKeyPress(e, 'allergies', 'allergy')} placeholder="Type and press Enter"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors mb-2" />
                        {healthData.allergies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {healthData.allergies.map((a, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-medium border border-red-100">
                                {a}
                                <button type="button" onClick={() => removeItem('allergies', i)} className="text-red-400 hover:text-red-600">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Conditions */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Chronic Health Conditions</label>
                        <input type="text" value={currentInput.condition} onChange={(e) => setCurrentInput({ ...currentInput, condition: e.target.value })}
                          onKeyDown={(e) => handleKeyPress(e, 'conditions', 'condition')} placeholder="Type and press Enter"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors mb-2" />
                        {healthData.conditions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {healthData.conditions.map((c, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-medium border border-amber-100">
                                {c}
                                <button type="button" onClick={() => removeItem('conditions', i)} className="text-amber-400 hover:text-amber-600">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Special Conditions */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'isNone', label: 'None' },
                          { key: 'isPregnant', label: 'Pregnant' },
                          { key: 'isBreastfeeding', label: 'Breastfeeding' },
                        ].map(({ key, label }) => (
                          <label key={key} className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border transition-all text-xs font-semibold ${healthData[key] ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-emerald-200'}`}>
                            <input type="checkbox" checked={healthData[key]} onChange={(e) => setHealthData({ ...healthData, [key]: e.target.checked })} className="sr-only" />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${healthData[key] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                              {healthData[key] && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                            </div>
                            {label}
                          </label>
                        ))}
                      </div>
                      {/* Additional Info */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Additional Info (Optional)</label>
                        <textarea value={healthData.otherHealthInfo} onChange={(e) => setHealthData({ ...healthData, otherHealthInfo: e.target.value })}
                          placeholder="Any other relevant health information..." rows="2"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors resize-none" />
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <p className="text-xs text-emerald-700">Your health information is used only for personalized safety analysis.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  {errors.submit && <p className="text-xs text-red-500 mb-3 text-center">{errors.submit}</p>}
                  {analyzing && (
                    <div className="flex items-center justify-center gap-2 mb-3 text-xs text-purple-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                      Analyzing with Groq AI...
                    </div>
                  )}
                  <div className="flex gap-3">
                    {activeTab === 'plant' ? (
                      <button onClick={() => { if (plantData.plantName && plantData.plantPart && plantData.purpose) setActiveTab('health'); else validateForm(); }}
                        className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
                        Next: Health Data
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setActiveTab('plant')} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">Back</button>
                        <button onClick={handleAnalyzeRisks} disabled={analyzing}
                          className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                          {analyzing ? 'AI Analyzing...' : editingAlert ? 'Update Risk Assessment' : 'Analyze Risks'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'High Risk', level: 'high', color: 'bg-red-50 border-red-100 text-red-700' },
              { label: 'Medium Risk', level: 'medium', color: 'bg-amber-50 border-amber-100 text-amber-700' },
              { label: 'Low Risk', level: 'low', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            ].map(({ label, level, color }) => (
              <div key={level} className={`${color} border rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-extrabold">{alerts.filter(a => a.riskLevel === level).length}</p>
                <p className="text-[11px] font-bold tracking-widest uppercase mt-1 opacity-70">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 max-w-md">
            {filterOptions.map((opt) => (
              <button key={opt.key} onClick={() => setFilter(opt.key)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${filter === opt.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Risk Alert?</h3>
                <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">No Risk Alerts</h2>
              <p className="text-sm text-gray-500 mb-4">Check personalized risks for a plant to get started.</p>
              <button onClick={() => { resetForm(); setShowHealthForm(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add Risk Check
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const style = getRiskStyle(alert.riskLevel);
                const isExpanded = expandedAlert === alert._id;
                return (
                  <div key={alert._id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${style.border} hover:shadow-md transition-shadow`}>
                    {/* Alert Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={() => setExpandedAlert(isExpanded ? null : alert._id)}>
                          <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                            {alert.riskLevel === 'high' ? (
                              <svg className={`w-[18px] h-[18px] ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            ) : alert.riskLevel === 'medium' ? (
                              <svg className={`w-[18px] h-[18px] ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                            ) : (
                              <svg className={`w-[18px] h-[18px] ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">{alert.title}</h3>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge}`}>{alert.riskLevel?.toUpperCase()} RISK</span>
                              {alert._aiPowered && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                  AI
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                {alert.plantName}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                {alert.plantPart}
                              </span>
                              {alert.purpose && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                                  {alert.purpose}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 ml-3">
                          <button onClick={() => handleEdit(alert)} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors" title="Edit">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                          </button>
                          <button onClick={() => setConfirmDelete(alert._id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors" title="Delete">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">{alert.description}</p>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                        {/* How to Use */}
                        {alert.howToUse && (
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <h4 className="text-[11px] font-bold tracking-widest uppercase text-emerald-600 mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                              How to Use {alert.plantPart} of {alert.plantName}
                            </h4>
                            <p className="text-xs text-emerald-800 leading-relaxed">{alert.howToUse}</p>
                          </div>
                        )}

                        {/* Warnings */}
                        {alert.warnings?.length > 0 && (
                          <div>
                            <h4 className="text-[11px] font-bold tracking-widest uppercase text-red-500 mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                              Warnings
                            </h4>
                            <div className="space-y-1.5">
                              {alert.warnings.map((w, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5"></div>
                                  {w}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {alert.recommendations?.length > 0 && (
                          <div>
                            <h4 className="text-[11px] font-bold tracking-widest uppercase text-blue-500 mb-2 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Recommendations
                            </h4>
                            <div className="space-y-1.5">
                              {alert.recommendations.map((r, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-[11px] text-gray-400">{new Date(alert.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    )}

                    {/* Click to expand hint */}
                    {!isExpanded && (
                      <div className="px-5 pb-3">
                        <button onClick={() => setExpandedAlert(alert._id)} className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                          View details & how to use
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Safety Guidelines */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">General Safety Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  Before Using Any Medicinal Plant
                </h3>
                <div className="space-y-2">
                  {['Consult with a qualified healthcare provider','Verify plant identification with an expert','Check for drug interactions','Start with small doses to test tolerance'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  Avoid If
                </h3>
                <div className="space-y-2">
                  {['You are pregnant or breastfeeding (unless approved)','You have chronic health conditions','You are taking prescription medications','You have known allergies to similar plants'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RiskAlerts;
