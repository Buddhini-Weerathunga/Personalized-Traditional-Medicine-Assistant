// frontend/src/pages/plant-identification/PlantDescriptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import PlantCard from '../../components/plant-identification/PlantCard';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { savePlantIdentification, generatePersonalizedAlerts } from '../../services/plant-identification/plantApi';

const PlantDescriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [personalizedAlerts, setPersonalizedAlerts] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const { result, image, healthData } = location.state || {};

  // Mock data for development/testing (when no real data is passed)
  const mockResult = {
    plantId: 'mock-123',
    plantName: 'Gotu Kola',
    scientificName: 'Centella asiatica',
    confidence: 92,
    description: 'Gotu Kola is a small herbaceous annual plant of the family Apiaceae. It is native to the wetlands of Asia and is known for its medicinal properties.',
    medicinalUses: [
      'Improves cognitive function and memory',
      'Promotes wound healing and skin health',
      'Reduces anxiety and stress',
      'Supports circulation and venous health',
      'Anti-inflammatory properties'
    ],
    ayurvedicProperties: {
      rasa: 'Bitter, Sweet',
      guna: 'Light, Cold',
      virya: 'Cooling',
      vipaka: 'Sweet'
    },
    warnings: [
      'May cause drowsiness when combined with sedatives',
      'Not recommended for pregnant women',
      'May affect liver function with prolonged use',
      'Consult doctor if taking blood thinners'
    ],
    commonNames: ['Gotu Kola', 'Indian Pennywort', 'Brahmi', 'Mandukaparni'],
    similarPlants: [
      {
        plantId: 'sim-1',
        plantName: 'Bacopa Monnieri',
        scientificName: 'Bacopa monnieri',
        confidence: 85,
        thumbnail: 'https://via.placeholder.com/150/9c88ff/FFFFFF?text=Bacopa'
      },
      {
        plantId: 'sim-2',
        plantName: 'Hydrocotyle',
        scientificName: 'Hydrocotyle umbellata',
        confidence: 78,
        thumbnail: 'https://via.placeholder.com/150/90ee90/FFFFFF?text=Hydrocotyle'
      }
    ]
  };

  const mockImage = 'https://via.placeholder.com/600/228b22/FFFFFF?text=Sample+Plant+Image';

  const mockHealthData = {
    age: '35',
    medications: ['Aspirin', 'Metformin'],
    allergies: ['Pollen'],
    conditions: ['Diabetes', 'Hypertension'],
    isPregnant: false,
    isBreastfeeding: false,
    otherHealthInfo: 'Family history of heart disease'
  };

  // Use mock data if no real data is provided (for development/testing)
  const displayResult = result || mockResult;
  const displayImage = image || mockImage;
  const displayHealthData = healthData || mockHealthData;

  // Save to recently viewed plants
  useEffect(() => {
    if (displayResult) {
      const recentPlants = JSON.parse(localStorage.getItem('recentPlants') || '[]');
      const plantEntry = {
        plantId: displayResult.plantId,
        plantName: displayResult.plantName,
        scientificName: displayResult.scientificName,
        thumbnail: '🌿',
        viewedAt: new Date().toISOString()
      };
      // Remove duplicate if exists
      const filtered = recentPlants.filter(p => p.plantId !== plantEntry.plantId);
      // Add to beginning and keep only last 10
      const updated = [plantEntry, ...filtered].slice(0, 10);
      localStorage.setItem('recentPlants', JSON.stringify(updated));
    }
  }, [displayResult]);

  // Generate personalized alerts when both result and health data are available
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
          // Set mock alerts for development
          setPersonalizedAlerts({
            criticalAlerts: [
              {
                title: 'Drug Interaction Detected',
                description: 'This plant may interact with your current medications (Aspirin, Metformin).',
                recommendation: 'Consult your healthcare provider before use.',
                reason: 'Potential bleeding risk when combined with blood thinners'
              }
            ],
            highPriorityWarnings: [
              {
                title: 'Dosage Adjustment Required',
                description: 'Standard dosing may need modification due to your health conditions.',
                recommendation: 'Start with 50% of the recommended dose and monitor effects.'
              }
            ],
            drugInteractions: [
              {
                medication: 'Aspirin',
                interaction: 'May increase bleeding risk',
                severity: 'moderate',
                advice: 'Monitor for unusual bruising or bleeding. Consult doctor if planning long-term use.'
              },
              {
                medication: 'Metformin',
                interaction: 'May affect blood sugar regulation',
                severity: 'mild',
                advice: 'Monitor blood glucose levels more frequently.'
              }
            ],
            dosageAdjustments: {
              recommendation: 'Based on your age (35) and health conditions, start with lower doses.',
              specificGuidelines: [
                'Begin with 250mg daily instead of standard 500mg',
                'Increase gradually over 2 weeks if well tolerated',
                'Take with food to minimize side effects',
                'Monitor blood pressure and blood sugar regularly'
              ]
            },
            safetyStatus: 'caution'
          });
        } finally {
          setLoadingAlerts(false);
        }
      }
    };

    fetchPersonalizedAlerts();
  }, [result, healthData]);

  const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await savePlantIdentification({
        plantName: displayResult.plantName,
        scientificName: displayResult.scientificName,
        confidence: displayResult.confidence,
        image: displayImage,
        identifiedAt: new Date().toISOString(),
        ...displayResult
      });
      setSaved(true);
      setTimeout(() => {
        navigate('/plant-history');
      }, 1500);
    } catch (error) {
      console.error('Failed to save identification:', error);
      alert('Failed to save to history. Please try again.');
      setSaving(false);
    }
  };

  const handleScanAnother = () => {
    navigate('/plant-scan');
  };

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        {/* Background Decorations */}
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
              <span>🌿 Plant Analysis Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {displayResult.plantName}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 italic">
              {displayResult.scientificName}
            </p>
          </div>

          {/* Development Mode Notice */}
          {!result && (
            <div className="mb-6 bg-amber-50/50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 flex items-center gap-2 text-sm">
                <span>ℹ️</span>
                <span className="font-medium">Development Mode: Showing sample data for demonstration</span>
              </p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Image Column */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="w-full rounded-2xl overflow-hidden shadow-md border border-green-100 mb-4">
                <img src={displayImage} alt="Identified plant" className="w-full h-auto" />
              </div>
              
              {/* Confidence Score */}
              <div className="bg-white/80 rounded-xl p-4 shadow-md border border-green-100 text-center">
                <p className="text-sm text-gray-500 mb-2">Identification Confidence</p>
                <span className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${
                  displayResult.confidence >= 80 
                    ? 'bg-green-100 text-green-800' 
                    : displayResult.confidence >= 60 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {displayResult.confidence}%
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Description */}
              {displayResult.description && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>📖</span> About This Plant
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{displayResult.description}</p>
                </div>
              )}

              {/* Medicinal Uses */}
              {displayResult.medicinalUses && displayResult.medicinalUses.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>💊</span> Medicinal Uses
                  </h3>
                  <ul className="space-y-2">
                    {displayResult.medicinalUses.map((use, index) => (
                      <li key={index} className="pl-6 relative text-gray-600 leading-relaxed">
                        <span className="absolute left-0 text-green-500">✓</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ayurvedic Properties */}
              {displayResult.ayurvedicProperties && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🕉️</span> Ayurvedic Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayResult.ayurvedicProperties.rasa && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Rasa (Taste):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.rasa}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.guna && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Guna (Quality):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.guna}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.virya && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Virya (Potency):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.virya}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.vipaka && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Vipaka (Post-digestive):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.vipaka}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Personalized Health Analysis */}
              {(healthData || displayHealthData) && (
                <div className="bg-blue-50 p-6 rounded-2xl shadow-md border-2 border-blue-300">
                  <h3 className="text-blue-900 text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🏥</span>
                    AI-Generated Personalized Safety Analysis
                  </h3>

                  {loadingAlerts && (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner message="Analyzing plant safety based on your health profile..." size="medium" />
                    </div>
                  )}

                  {personalizedAlerts && !loadingAlerts && (
                    <div className="space-y-4">
                      {/* Critical Alerts */}
                      {personalizedAlerts.criticalAlerts && personalizedAlerts.criticalAlerts.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-lg">
                            <span className="text-2xl">🚨</span>
                            CRITICAL ALERTS
                          </h4>
                          {personalizedAlerts.criticalAlerts.map((alert, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 mb-3 last:mb-0 border-l-4 border-red-600">
                              <h5 className="font-semibold text-red-800 mb-2">{alert.title}</h5>
                              <p className="text-gray-700 mb-2">{alert.description}</p>
                              <div className="bg-red-100 rounded p-3 mt-2">
                                <p className="text-sm font-semibold text-red-900">⚠️ Action Required:</p>
                                <p className="text-sm text-red-800">{alert.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Drug Interactions */}
                      {personalizedAlerts.drugInteractions && personalizedAlerts.drugInteractions.length > 0 && (
                        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <span className="text-xl">💊</span>
                            Medication Interaction Analysis
                          </h4>
                          {personalizedAlerts.drugInteractions.map((interaction, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 mb-3 last:mb-0">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-purple-800">{interaction.medication}</h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  interaction.severity === 'severe' ? 'bg-red-200 text-red-900' :
                                  interaction.severity === 'moderate' ? 'bg-orange-200 text-orange-900' :
                                  'bg-yellow-200 text-yellow-900'
                                }`}>
                                  {interaction.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{interaction.interaction}</p>
                              <p className="text-purple-700 text-sm font-medium bg-purple-100 rounded p-2">
                                📋 {interaction.advice}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dosage Adjustments */}
                      {personalizedAlerts.dosageAdjustments && (
                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <span>📏</span>
                            Personalized Dosage Recommendations
                          </h4>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-700 mb-2">{personalizedAlerts.dosageAdjustments.recommendation}</p>
                            {personalizedAlerts.dosageAdjustments.specificGuidelines && (
                              <ul className="space-y-1 mt-3">
                                {personalizedAlerts.dosageAdjustments.specificGuidelines.map((guideline, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                                    <span className="absolute left-0">•</span>
                                    {guideline}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Safe Status */}
                      {personalizedAlerts.safetyStatus === 'safe' && (
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">✅</span>
                            <div>
                              <h4 className="font-bold text-green-900">Generally Safe for Your Profile</h4>
                              <p className="text-green-700 text-sm mt-1">
                                Based on your health data, this plant appears to be safe for use.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Health Profile Summary */}
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Your Health Profile Used:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {displayHealthData.age && <p>Age: {displayHealthData.age}</p>}
                      {displayHealthData.medications?.length > 0 && (
                        <p>Medications: {displayHealthData.medications.join(', ')}</p>
                      )}
                      {displayHealthData.allergies?.length > 0 && (
                        <p>Allergies: {displayHealthData.allergies.join(', ')}</p>
                      )}
                      {displayHealthData.conditions?.length > 0 && (
                        <p>Conditions: {displayHealthData.conditions.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* General Warnings */}
              {displayResult.warnings && displayResult.warnings.length > 0 && (
                <div className="bg-yellow-50 p-6 rounded-2xl shadow-md border border-yellow-200">
                  <h3 className="text-yellow-900 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>⚠️</span> General Warnings & Precautions
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {displayResult.warnings.map((warning, index) => (
                      <li key={index} className="pl-6 relative text-yellow-800 leading-relaxed">
                        <span className="absolute left-0">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                  {displayResult.plantId && (
                    <button
                      onClick={() => navigate(`/plant-safety/${displayResult.plantId}`)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      🛡️ View Complete Safety Information
                    </button>
                  )}
                </div>
              )}

              {/* Common Names */}
              {displayResult.commonNames && displayResult.commonNames.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🏷️</span> Common Names
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayResult.commonNames.map((name, index) => (
                      <span key={index} className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-8 py-3.5 text-base font-medium bg-green-600 text-white rounded-xl hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSaveToHistory}
                  disabled={saving || saved}
                >
                  {saved ? '✓ Saved!' : saving ? 'Saving...' : '💾 Save to History'}
                </button>
                <button 
                  className="flex-1 px-8 py-3.5 text-base font-medium bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                  onClick={handleScanAnother}
                >
                  📸 Scan Another Plant
                </button>
              </div>
            </div>
          </div>

          {/* Similar Plants */}
          {displayResult.similarPlants && displayResult.similarPlants.length > 0 && (
            <div className="mt-12 p-8 bg-white/80 rounded-2xl shadow-md border border-green-100">
              <h3 className="text-green-800 text-2xl font-semibold mb-6 flex items-center gap-2">
                <span>🌱</span> Similar Plants You Might Be Interested In
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayResult.similarPlants.map((plant, index) => (
                  <PlantCard key={index} plant={plant} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlantDescriptionDetail;
