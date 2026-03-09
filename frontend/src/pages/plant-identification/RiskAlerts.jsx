import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { getRiskAlerts, dismissAlert, checkPersonalizedRisks } from '../../services/plant-identification/plantApi';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('plant');
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const [plantData, setPlantData] = useState({ plantName: '', plantPart: '' });
  const [healthData, setHealthData] = useState({ age: '', medications: [], allergies: [], conditions: [], isNone: false, isPregnant: false, isBreastfeeding: false, otherHealthInfo: '' });
  const [currentInput, setCurrentInput] = useState({ medication: '', allergy: '', condition: '' });
  const [errors, setErrors] = useState({});

  const plantParts = ['Leaves','Roots','Bark','Flowers','Seeds','Fruits','Stem','Whole Plant','Oil/Extract','Other'];

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    try { setLoading(true); const data = await getRiskAlerts(); setAlerts(data); }
    catch (error) { console.error('Error fetching alerts:', error); }
    finally { setLoading(false); }
  };

  const handleDismiss = async (alertId) => {
    try { await dismissAlert(alertId); setAlerts(alerts.filter(a => a._id !== alertId)); }
    catch (error) { console.error('Error dismissing alert:', error); }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return { border: 'border-l-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' };
      case 'high': return { border: 'border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' };
      case 'medium': return { border: 'border-l-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', icon: 'text-yellow-500' };
      case 'low': return { border: 'border-l-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' };
      default: return { border: 'border-l-gray-500', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700', icon: 'text-gray-500' };
    }
  };

  const filteredAlerts = alerts.filter(a => filter === 'all' || a.severity === filter);

  const validateForm = () => {
    const newErrors = {};
    if (!plantData.plantName.trim()) newErrors.plantName = 'Please enter a plant name';
    if (!plantData.plantPart) newErrors.plantPart = 'Please select a plant part';
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
      const result = await checkPersonalizedRisks({ ...plantData, healthData });
      if (result?.alerts) setAlerts(prev => [...result.alerts, ...prev]);
      setShowHealthForm(false);
      setPlantData({ plantName: '', plantPart: '' });
      setHealthData({ age: '', medications: [], allergies: [], conditions: [], isNone: false, isPregnant: false, isBreastfeeding: false, otherHealthInfo: '' });
      setActiveTab('plant');
    } catch (error) {
      console.error('Error analyzing risks:', error);
      setErrors({ submit: 'Failed to analyze risks. Please try again.' });
    } finally { setAnalyzing(false); }
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'critical', label: 'Critical' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Info' },
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
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4">
              Safety Information
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Safety Alerts</h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">Important safety information about medicinal plants</p>
            <button onClick={() => setShowHealthForm(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
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
                    Check Personalized Risks
                  </h2>
                  <button onClick={() => setShowHealthForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
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
                        <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Plant Part <span className="text-red-400">*</span></label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {plantParts.map((part) => (
                            <button key={part} type="button" onClick={() => setPlantData({ ...plantData, plantPart: part })}
                              className={`p-2.5 rounded-xl text-xs font-semibold transition-all border ${plantData.plantPart === part ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}>
                              {part}
                            </button>
                          ))}
                        </div>
                        {errors.plantPart && <p className="text-xs text-red-500 mt-1">{errors.plantPart}</p>}
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs text-emerald-700">Different parts of a plant may have different effects and safety profiles. Select the specific part you plan to use for accurate risk assessment.</p>
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
                          onKeyPress={(e) => handleKeyPress(e, 'medications', 'medication')} placeholder="Type and press Enter"
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
                          onKeyPress={(e) => handleKeyPress(e, 'allergies', 'allergy')} placeholder="Type and press Enter"
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
                          onKeyPress={(e) => handleKeyPress(e, 'conditions', 'condition')} placeholder="Type and press Enter"
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
                  <div className="flex gap-3">
                    {activeTab === 'plant' ? (
                      <button onClick={() => { if (plantData.plantName && plantData.plantPart) setActiveTab('health'); else validateForm(); }}
                        className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
                        Next: Health Data
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setActiveTab('plant')} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">Back</button>
                        <button onClick={handleAnalyzeRisks} disabled={analyzing}
                          className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                          {analyzing ? 'Analyzing...' : 'Analyze Risks'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Critical', sev: 'critical', color: 'bg-red-50 border-red-100 text-red-700' },
              { label: 'High', sev: 'high', color: 'bg-amber-50 border-amber-100 text-amber-700' },
              { label: 'Medium', sev: 'medium', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
              { label: 'Info', sev: 'low', color: 'bg-blue-50 border-blue-100 text-blue-700' },
            ].map(({ label, sev, color }) => (
              <div key={sev} className={`${color} border rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-extrabold">{alerts.filter(a => a.severity === sev).length}</p>
                <p className="text-[11px] font-bold tracking-widest uppercase mt-1 opacity-70">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 max-w-lg">
            {filterOptions.map((opt) => (
              <button key={opt.key} onClick={() => setFilter(opt.key)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${filter === opt.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">No Active Alerts</h2>
              <p className="text-sm text-gray-500">You're all clear! No safety warnings at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const style = getSeverityStyle(alert.severity);
                return (
                  <div key={alert._id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${style.border} p-5 hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                          <svg className={`w-[18px] h-[18px] ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{alert.title}</h3>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${style.badge}`}>{alert.severity?.toUpperCase()} RISK</span>
                        </div>
                      </div>
                      <button onClick={() => handleDismiss(alert._id)} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Dismiss">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{alert.description}</p>

                    {alert.affectedPlants?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Affected Plants</p>
                        <div className="flex flex-wrap gap-1.5">
                          {alert.affectedPlants.map((plant, i) => (
                            <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-medium border border-emerald-100">{plant}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {alert.recommendations?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Recommendations</p>
                        <div className="space-y-1.5">
                          {alert.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">{new Date(alert.createdAt).toLocaleDateString()}</span>
                      {alert.plantId && (
                        <button onClick={() => navigate(`/plant-details/${alert.plantId}`)} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                          View Details
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>
                      )}
                    </div>
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
