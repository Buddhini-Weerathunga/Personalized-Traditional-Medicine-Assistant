import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { getPlantSafetyInfo } from '../../services/plant-identification/plantApi';

const PlantSafety = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [safetyInfo, setSafetyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (plantId) { fetchSafetyInfo(); }
  }, [plantId]);

  const fetchSafetyInfo = async () => {
    try {
      setLoading(true);
      const data = await getPlantSafetyInfo(plantId);
      setSafetyInfo(data);
    } catch (error) {
      console.error('Error fetching safety info:', error);
    } finally { setLoading(false); }
  };

  const getToxicityStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'none': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading safety information...</p>
          </div>
        </div>
      </>
    );
  }

  if (!safetyInfo) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Safety Information Not Found</h2>
            <p className="text-sm text-gray-500 mb-5">No safety data available for this plant.</p>
            <button onClick={() => navigate('/plant-history')} className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">Back to History</button>
          </div>
        </div>
      </>
    );
  }

  const { plantName, scientificName, image, toxicityLevel, contraindications, sideEffects, drugInteractions, dosageGuidelines, safetyPrecautions, specialPopulations, emergencyInformation } = safetyInfo;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'interactions', label: 'Interactions' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'populations', label: 'Special Groups' },
  ];

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {image && <img src={image} alt={plantName} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />}
              <div className="flex-1">
                <p className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-2">Safety Profile</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{plantName}</h1>
                {scientificName && <p className="text-sm text-gray-400 italic mt-1">{scientificName}</p>}
                <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold border ${getToxicityStyle(toxicityLevel)}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                  Toxicity: {toxicityLevel || 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* High Toxicity Alert */}
          {toxicityLevel?.toLowerCase() === 'high' && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-red-800 mb-1">High Toxicity Warning</h2>
                <p className="text-xs text-red-700">This plant has high toxicity levels. Use only under professional medical supervision. Keep out of reach of children and pets.</p>
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  {contraindications?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        Contraindications
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">Do not use this plant if you have the following conditions:</p>
                      <div className="space-y-2">
                        {contraindications.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                            <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {sideEffects?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                        Possible Side Effects
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {sideEffects.map((effect, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-gray-700">{effect}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {safetyPrecautions?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        Safety Precautions
                      </h3>
                      <div className="space-y-2">
                        {safetyPrecautions.map((p, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <span className="text-sm text-gray-700">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Interactions Tab */}
              {activeTab === 'interactions' && (
                <>
                  {drugInteractions?.length > 0 ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                        Drug Interactions
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">This plant may interact with the following medications:</p>
                      <div className="space-y-3">
                        {drugInteractions.map((inter, i) => (
                          <div key={i} className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-purple-800">{inter.drug}</h4>
                              {inter.severity && (
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  inter.severity === 'severe' ? 'bg-red-100 text-red-700' : inter.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{inter.severity.toUpperCase()}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{inter.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                      <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <p className="text-sm text-gray-500">No known drug interactions documented.</p>
                    </div>
                  )}
                </>
              )}

              {/* Dosage Tab */}
              {activeTab === 'dosage' && (
                <>
                  {dosageGuidelines ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                        Dosage Guidelines
                      </h3>
                      <div className="space-y-4">
                        {dosageGuidelines.general && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-1">General Dosage</p>
                            <p className="text-sm text-gray-700">{dosageGuidelines.general}</p>
                          </div>
                        )}
                        {dosageGuidelines.forms?.length > 0 && (
                          <div>
                            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">By Form</p>
                            <div className="space-y-2">
                              {dosageGuidelines.forms.map((form, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
                                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{form.type}</span>
                                  <span className="text-sm text-gray-600">{form.dosage}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {dosageGuidelines.duration && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">Recommended Duration</p>
                            <p className="text-sm text-gray-700">{dosageGuidelines.duration}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <p className="text-xs text-amber-700 font-medium">Always consult a healthcare professional before starting any herbal treatment.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                      <p className="text-sm text-gray-500">No dosage guidelines available for this plant.</p>
                    </div>
                  )}
                </>
              )}

              {/* Special Populations Tab */}
              {activeTab === 'populations' && (
                <>
                  {specialPopulations ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                        Special Populations
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {specialPopulations.pregnancy && (
                          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-pink-600 mb-2">Pregnancy</p>
                            <p className="text-sm text-gray-700">{specialPopulations.pregnancy}</p>
                          </div>
                        )}
                        {specialPopulations.breastfeeding && (
                          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-purple-600 mb-2">Breastfeeding</p>
                            <p className="text-sm text-gray-700">{specialPopulations.breastfeeding}</p>
                          </div>
                        )}
                        {specialPopulations.children && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-blue-600 mb-2">Children</p>
                            <p className="text-sm text-gray-700">{specialPopulations.children}</p>
                          </div>
                        )}
                        {specialPopulations.elderly && (
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-amber-600 mb-2">Elderly</p>
                            <p className="text-sm text-gray-700">{specialPopulations.elderly}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                      <p className="text-sm text-gray-500">No special population data available.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Emergency Card */}
              {emergencyInformation && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-red-800">Emergency Info</h3>
                  </div>
                  {emergencyInformation.symptoms && (
                    <div className="mb-3">
                      <p className="text-[11px] font-bold tracking-widest uppercase text-red-600 mb-1">Signs of Overdose</p>
                      <p className="text-xs text-red-700">{emergencyInformation.symptoms}</p>
                    </div>
                  )}
                  {emergencyInformation.firstAid && (
                    <div className="mb-3">
                      <p className="text-[11px] font-bold tracking-widest uppercase text-red-600 mb-1">First Aid</p>
                      <p className="text-xs text-red-700">{emergencyInformation.firstAid}</p>
                    </div>
                  )}
                  <div className="bg-red-100 rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-red-800">In case of emergency:</p>
                    <p className="text-xs text-red-700 mt-0.5">Call emergency services or poison control</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <button onClick={() => navigate('/plant-scan')} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  Scan Another Plant
                </button>
                <button onClick={() => navigate('/plant-history')} className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  View History
                </button>
                <button onClick={() => navigate('/plant-description')} className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  Browse Plants
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlantSafety;
