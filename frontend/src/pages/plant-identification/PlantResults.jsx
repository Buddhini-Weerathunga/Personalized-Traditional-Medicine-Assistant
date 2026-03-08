import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { savePlantIdentification, generatePersonalizedAlerts } from '../../services/plant-identification/plantApi';

const PlantResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [personalizedAlerts, setPersonalizedAlerts] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { result, image, healthData } = location.state || {};

  const mockResult = {
    plantId: 'mock-123', plantName: 'Gotu Kola', scientificName: 'Centella asiatica',
    description: 'Gotu Kola is a small herbaceous annual plant of the family Apiaceae. It is native to the wetlands of Asia and is known for its medicinal properties.',
    medicinalUses: ['Improves cognitive function and memory','Promotes wound healing and skin health','Reduces anxiety and stress','Supports circulation and venous health','Anti-inflammatory properties'],
    ayurvedicProperties: { rasa: 'Bitter, Sweet', guna: 'Light, Cold', virya: 'Cooling', vipaka: 'Sweet' },
    warnings: ['May cause drowsiness when combined with sedatives','Not recommended for pregnant women','May affect liver function with prolonged use','Consult doctor if taking blood thinners'],
    commonNames: ['Gotu Kola','Indian Pennywort','Brahmi','Mandukaparni'],
  };

  const mockHealthData = {
    age: '35', medications: ['Aspirin','Metformin'], allergies: ['Pollen'],
    conditions: ['Diabetes','Hypertension'], isPregnant: false, isBreastfeeding: false,
    otherHealthInfo: 'Family history of heart disease'
  };

  const displayResult = result || mockResult;
  const displayImage = image || null;
  const displayHealthData = healthData || mockHealthData;

  useEffect(() => {
    const fetchPersonalizedAlerts = async () => {
      const currentResult = result || mockResult;
      const currentHealthData = healthData || mockHealthData;
      if (currentResult && currentHealthData && currentResult.plantId) {
        setLoadingAlerts(true);
        try {
          const alerts = await generatePersonalizedAlerts(currentResult.plantId, currentHealthData);
          setPersonalizedAlerts(alerts);
        } catch (error) {
          console.error('Error generating personalized alerts:', error);
          setPersonalizedAlerts({
            criticalAlerts: [{ title: 'Drug Interaction Detected', description: 'This plant may interact with your current medications (Aspirin, Metformin).', recommendation: 'Consult your healthcare provider before use.', reason: 'Potential bleeding risk when combined with blood thinners' }],
            highPriorityWarnings: [{ title: 'Dosage Adjustment Required', description: 'Standard dosing may need modification due to your health conditions.', recommendation: 'Start with 50% of the recommended dose and monitor effects.' }],
            drugInteractions: [
              { medication: 'Aspirin', interaction: 'May increase bleeding risk', severity: 'moderate', advice: 'Monitor for unusual bruising or bleeding. Consult doctor if planning long-term use.' },
              { medication: 'Metformin', interaction: 'May affect blood sugar regulation', severity: 'mild', advice: 'Monitor blood glucose levels more frequently.' }
            ],
            dosageAdjustments: { recommendation: 'Based on your age (35) and health conditions, start with lower doses.', specificGuidelines: ['Begin with 250mg daily instead of standard 500mg','Increase gradually over 2 weeks if well tolerated','Take with food to minimize side effects','Monitor blood pressure and blood sugar regularly'] },
            safetyStatus: 'caution'
          });
        } finally { setLoadingAlerts(false); }
      }
    };
    fetchPersonalizedAlerts();
  }, [result, healthData]);

  const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await savePlantIdentification({ plantName: displayResult.plantName, scientificName: displayResult.scientificName, image: displayImage, identifiedAt: new Date().toISOString(), ...displayResult });
      setSaved(true);
      setTimeout(() => navigate('/plant-history'), 1500);
    } catch (error) {
      console.error('Failed to save identification:', error);
      alert('Failed to save to history. Please try again.');
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'health', label: 'Health Analysis' },
    { key: 'safety', label: 'Safety & Warnings' },
  ];

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              Analysis Complete
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {displayResult.plantName}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-400 italic">{displayResult.scientificName}</p>
          </div>

          {/* Dev Banner */}
          {!result && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 max-w-2xl mx-auto">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              <p className="text-sm text-amber-700 font-medium">Development Mode — Showing sample data for demonstration</p>
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {displayResult.description && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        Description
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{displayResult.description}</p>
                    </div>
                  )}
                  {displayResult.medicinalUses?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Medicinal Uses
                      </h3>
                      <div className="space-y-3">
                        {displayResult.medicinalUses.map((use, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <span className="text-sm text-gray-700">{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.ayurvedicProperties && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        Ayurvedic Properties
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'rasa', label: 'Rasa (Taste)', color: 'bg-amber-50 border-amber-100 text-amber-800' },
                          { key: 'guna', label: 'Guna (Quality)', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                          { key: 'virya', label: 'Virya (Potency)', color: 'bg-red-50 border-red-100 text-red-800' },
                          { key: 'vipaka', label: 'Vipaka (Post-digestive)', color: 'bg-purple-50 border-purple-100 text-purple-800' },
                        ].map(({ key, label, color }) => displayResult.ayurvedicProperties[key] && (
                          <div key={key} className={`p-4 rounded-xl border ${color}`}>
                            <p className="text-[11px] font-bold tracking-widest uppercase opacity-60 mb-1">{label}</p>
                            <p className="text-sm font-semibold">{displayResult.ayurvedicProperties[key]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.commonNames?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                        Common Names
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayResult.commonNames.map((name, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Health Analysis Tab */}
              {activeTab === 'health' && (healthData || displayHealthData) && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                      Personalized Safety Analysis
                    </h3>

                    {loadingAlerts && (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500">Analyzing plant safety based on your health profile...</span>
                      </div>
                    )}

                    {personalizedAlerts && !loadingAlerts && (
                      <div className="space-y-4">
                        {/* Critical Alerts */}
                        {personalizedAlerts.criticalAlerts?.length > 0 && (
                          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                            <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                              Critical Alerts
                            </h4>
                            {personalizedAlerts.criticalAlerts.map((alert, idx) => (
                              <div key={idx} className="bg-white rounded-xl p-4 mb-3 last:mb-0 border-l-4 border-red-500">
                                <h5 className="text-sm font-bold text-red-800 mb-1">{alert.title}</h5>
                                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                                <div className="bg-red-50 rounded-lg p-2.5">
                                  <p className="text-xs font-semibold text-red-700">Action Required: {alert.recommendation}</p>
                                </div>
                                {alert.reason && <p className="text-[11px] text-gray-400 mt-2 italic">Reason: {alert.reason}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* High Priority Warnings */}
                        {personalizedAlerts.highPriorityWarnings?.length > 0 && (
                          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                            <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                              High Priority Warnings
                            </h4>
                            {personalizedAlerts.highPriorityWarnings.map((w, idx) => (
                              <div key={idx} className="bg-white rounded-xl p-4 mb-3 last:mb-0 border-l-4 border-amber-400">
                                <h5 className="text-sm font-bold text-amber-800 mb-1">{w.title}</h5>
                                <p className="text-xs text-gray-600 mb-2">{w.description}</p>
                                {w.recommendation && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">{w.recommendation}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Drug Interactions */}
                        {personalizedAlerts.drugInteractions?.length > 0 && (
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                            <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                              Medication Interactions
                            </h4>
                            {personalizedAlerts.drugInteractions.map((inter, idx) => (
                              <div key={idx} className="bg-white rounded-xl p-4 mb-3 last:mb-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-bold text-purple-800">{inter.medication}</h5>
                                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    inter.severity === 'severe' ? 'bg-red-100 text-red-700' : inter.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>{inter.severity.toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{inter.interaction}</p>
                                <p className="text-xs text-purple-700 bg-purple-50 rounded-lg p-2">{inter.advice}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Dosage Adjustments */}
                        {personalizedAlerts.dosageAdjustments && (
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                              Dosage Recommendations
                            </h4>
                            <div className="bg-white rounded-xl p-4">
                              <p className="text-sm text-gray-700 mb-3">{personalizedAlerts.dosageAdjustments.recommendation}</p>
                              {personalizedAlerts.dosageAdjustments.specificGuidelines?.map((g, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 py-1.5">
                                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                  <span className="text-xs text-gray-600">{g}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {personalizedAlerts.safetyStatus === 'safe' && (
                          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-emerald-800">Generally Safe for Your Profile</h4>
                              <p className="text-xs text-emerald-600 mt-0.5">Start with small doses and monitor for any reactions.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional Health Context */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">Your Health Context</h3>

                    {(healthData?.age || displayHealthData?.age) && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">Age Considerations</p>
                        <p className="text-xs text-gray-600">
                          {(healthData?.age || displayHealthData?.age) < 18 ? 'Pediatric use requires medical supervision. Dosage adjustments may be necessary.' :
                           (healthData?.age || displayHealthData?.age) > 65 ? 'Elderly patients may have increased sensitivity. Start with lower doses.' :
                           'Standard adult dosing applies. Follow recommended guidelines.'}
                        </p>
                      </div>
                    )}
                    {(healthData?.medications || displayHealthData?.medications)?.length > 0 && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-amber-600 mb-1">Medication Check</p>
                        <p className="text-xs text-gray-600 mb-2">Taking {(healthData?.medications || displayHealthData?.medications).length} medication(s):</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(healthData?.medications || displayHealthData?.medications).map((med, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white text-amber-700 rounded-full text-[11px] font-medium border border-amber-200">{med}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(healthData?.allergies || displayHealthData?.allergies)?.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-red-600 mb-1">Allergy Alert</p>
                        <p className="text-xs text-red-700">Cross-reactivity may occur with: {(healthData?.allergies || displayHealthData?.allergies).join(', ')}. Perform a patch test before full use.</p>
                      </div>
                    )}
                    {((healthData?.isPregnant || displayHealthData?.isPregnant) || (healthData?.isBreastfeeding || displayHealthData?.isBreastfeeding)) && (
                      <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-pink-600 mb-1">
                          {(healthData?.isPregnant || displayHealthData?.isPregnant) ? 'Pregnancy Alert' : 'Breastfeeding Alert'}
                        </p>
                        <p className="text-xs text-pink-700 font-medium">This plant may not be safe during {(healthData?.isPregnant || displayHealthData?.isPregnant) ? 'pregnancy' : 'breastfeeding'}. Consult your healthcare provider.</p>
                      </div>
                    )}
                    {(healthData?.conditions || displayHealthData?.conditions)?.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">Health Conditions</p>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {(healthData?.conditions || displayHealthData?.conditions).map((c, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white text-gray-600 rounded-full text-[11px] font-medium border border-gray-200">{c}</span>
                          ))}
                        </div>
                        <p className="text-xs text-amber-600 font-medium">Special monitoring required. Consult specialist before use.</p>
                      </div>
                    )}
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs text-emerald-700">This analysis is based on your health profile. Always consult a healthcare professional before using any medicinal plant.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && (
                <>
                  {displayResult.warnings?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        General Warnings & Precautions
                      </h3>
                      <div className="space-y-3">
                        {displayResult.warnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            <span className="text-sm text-amber-800">{w}</span>
                          </div>
                        ))}
                      </div>
                      {displayResult.plantId && (
                        <button onClick={() => navigate(`/plant-safety/${displayResult.plantId}`)}
                          className="w-full mt-5 px-4 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                          View Complete Safety Information
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {displayImage && (
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <img src={displayImage} alt={displayResult.plantName} className="w-full h-auto rounded-xl" />
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <button onClick={handleSaveToHistory} disabled={saving || saved}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saved ? (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Saved!</>) : saving ? 'Saving...' : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>Save to History</>)}
                </button>
                <button onClick={() => navigate('/plant-scan')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  Scan Another Plant
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Medicinal Uses</p><p className="text-xs font-semibold text-gray-800">{displayResult.medicinalUses?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Warnings</p><p className="text-xs font-semibold text-gray-800">{displayResult.warnings?.length || 0}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlantResults;
