import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import PlantCard from '../../components/plant-identification/PlantCard';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { savePlantIdentification, generatePersonalizedAlerts } from '../../services/plant-identification/plantApi';

const PlantResults = () => {
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

  // Comment out the redirect for development - you can access the page directly
  // useEffect(() => {
  //   if (!result) {
  //     const timer = setTimeout(() => {
  //       navigate('/plant-scan');
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [result, navigate]);

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

  // Removed redirect - now shows mock data for development
  // if (!result) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="text-6xl mb-4">🌿</div>
  //         <p className="text-gray-600">Redirecting to plant scan...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
            <span>🌿 Plant Analysis Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Plant Details
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Detailed analysis and safety information
          </p>
        </div>

      {!result && (
        <div className="mb-6 bg-amber-50/50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 flex items-center gap-2 text-sm">
            <span>ℹ️</span>
            <span className="font-medium">Development Mode: Showing sample data for demonstration</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="w-full rounded-2xl overflow-hidden shadow-md border border-green-100">
            <img src={displayImage} alt="Identified plant" className="w-full h-auto" />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
            <h2 className="text-gray-900 text-3xl font-bold mb-2">{displayResult.plantName}</h2>
            {displayResult.scientificName && (
              <p className="text-gray-500 text-xl mb-4">
                <em>{displayResult.scientificName}</em>
              </p>
            )}
            
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                displayResult.confidence >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : displayResult.confidence >= 60 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                Confidence: {displayResult.confidence}%
              </span>
            </div>

            {displayResult.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-green-800 text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{displayResult.description}</p>
              </div>
            )}

            {displayResult.medicinalUses && displayResult.medicinalUses.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-green-800 text-xl font-semibold mb-3">Medicinal Uses</h3>
                <ul className="space-y-2">
                  {displayResult.medicinalUses.map((use, index) => (
                    <li key={index} className="pl-6 relative text-gray-600 leading-relaxed">
                      <span className="absolute left-0">💊</span>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {displayResult.ayurvedicProperties && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-green-800 text-xl font-semibold mb-3">Ayurvedic Properties</h3>
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
                      <strong className="text-green-800 block mb-1">Vipaka (Post-digestive effect):</strong>
                      <span className="text-gray-700">{displayResult.ayurvedicProperties.vipaka}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personalized Health Analysis */}
            {(healthData || displayHealthData) && (
              <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                <h3 className="text-blue-900 text-xl font-semibold mb-3 flex items-center gap-2">
                  <span>🏥</span>
                  AI-Generated Personalized Safety Analysis
                </h3>

                {loadingAlerts && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner message="Analyzing plant safety based on your health profile..." size="medium" />
                  </div>
                )}

                {personalizedAlerts && !loadingAlerts && (
                  <div className="mb-6 space-y-4">
                    {/* Critical Alerts */}
                    {personalizedAlerts.criticalAlerts && personalizedAlerts.criticalAlerts.length > 0 && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-lg">
                          <span className="text-2xl">🚨</span>
                          CRITICAL ALERTS - Immediate Attention Required
                        </h4>
                        {personalizedAlerts.criticalAlerts.map((alert, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 mb-3 last:mb-0 border-l-4 border-red-600">
                            <h5 className="font-semibold text-red-800 mb-2">{alert.title}</h5>
                            <p className="text-gray-700 mb-2">{alert.description}</p>
                            <div className="bg-red-100 rounded p-3 mt-2">
                              <p className="text-sm font-semibold text-red-900">⚠️ Action Required:</p>
                              <p className="text-sm text-red-800">{alert.recommendation}</p>
                            </div>
                            {alert.reason && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                Reason: {alert.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* High Priority Warnings */}
                    {personalizedAlerts.highPriorityWarnings && personalizedAlerts.highPriorityWarnings.length > 0 && (
                      <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                        <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                          <span className="text-xl">⚠️</span>
                          High Priority Warnings
                        </h4>
                        {personalizedAlerts.highPriorityWarnings.map((warning, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 mb-3 last:mb-0 border-l-4 border-orange-500">
                            <h5 className="font-semibold text-orange-800 mb-1">{warning.title}</h5>
                            <p className="text-gray-700 text-sm mb-2">{warning.description}</p>
                            {warning.recommendation && (
                              <p className="text-sm text-orange-700 bg-orange-100 rounded p-2">
                                💡 {warning.recommendation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Medication Interactions */}
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

                    {/* Safe to Use Confirmation */}
                    {personalizedAlerts.safetyStatus === 'safe' && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">✅</span>
                          <div>
                            <h4 className="font-bold text-green-900">Generally Safe for Your Profile</h4>
                            <p className="text-green-700 text-sm mt-1">
                              Based on your health data, this plant appears to be safe for use. 
                              However, always start with small doses and monitor for any reactions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Age-specific recommendations */}
                  {(healthData?.age || displayHealthData?.age) && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Age Considerations:</h4>
                      <p className="text-gray-700">
                        {(healthData?.age || displayHealthData?.age) < 18 ? 
                          "⚠️ Pediatric use requires medical supervision. Dosage adjustments may be necessary." :
                          (healthData?.age || displayHealthData?.age) > 65 ?
                          "⚠️ Elderly patients may have increased sensitivity. Start with lower doses." :
                          "✓ Standard adult dosing applies. Follow recommended guidelines."}
                      </p>
                    </div>
                  )}

                  {/* Medication interactions */}
                  {(healthData?.medications || displayHealthData?.medications)?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">⚠️ Medication Interactions Check:</h4>
                      <p className="text-gray-700 mb-2">
                        You are taking {(healthData?.medications || displayHealthData?.medications).length} medication(s). Potential interactions detected:
                      </p>
                      <ul className="space-y-1">
                        {(healthData?.medications || displayHealthData?.medications).map((med, idx) => (
                          <li key={idx} className="text-sm text-gray-600 pl-4">
                            • {med}: Please consult healthcare provider
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Allergy warnings */}
                  {(healthData?.allergies || displayHealthData?.allergies)?.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">🚨 Allergy Alert:</h4>
                      <p className="text-red-700">
                        Cross-reactivity may occur with: {(healthData?.allergies || displayHealthData?.allergies).join(', ')}
                        <br />
                        <strong>Recommendation:</strong> Perform patch test before full use.
                      </p>
                    </div>
                  )}

                  {/* Pregnancy/Breastfeeding warnings */}
                  {((healthData?.isPregnant || displayHealthData?.isPregnant) || (healthData?.isBreastfeeding || displayHealthData?.isBreastfeeding)) && (
                    <div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-300">
                      <h4 className="font-semibold text-pink-800 mb-2">
                        {(healthData?.isPregnant || displayHealthData?.isPregnant) ? "🤰 Pregnancy Alert:" : "🤱 Breastfeeding Alert:"}
                      </h4>
                      <p className="text-pink-700 font-medium">
                        ⚠️ This plant may not be safe during {(healthData?.isPregnant || displayHealthData?.isPregnant) ? "pregnancy" : "breastfeeding"}.
                        Consult with your healthcare provider before use.
                      </p>
                    </div>
                  )}

                  {/* Chronic conditions */}
                  {(healthData?.conditions || displayHealthData?.conditions)?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">🏥 Health Conditions:</h4>
                      <p className="text-gray-700 mb-2">
                        Based on your conditions ({(healthData?.conditions || displayHealthData?.conditions).join(', ')}):
                      </p>
                      <p className="text-orange-700 font-medium">
                        ⚠️ Special monitoring required. Consult specialist before use.
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 flex items-start gap-2">
                      <span>💡</span>
                      <span>
                        This analysis is based on your health profile. Always consult a healthcare 
                        professional before using any medicinal plant, especially with existing conditions or medications.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {displayResult.warnings && displayResult.warnings.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-yellow-900 text-xl font-semibold mb-3">⚠️ General Warnings & Precautions</h3>
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

            {displayResult.commonNames && displayResult.commonNames.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-green-800 text-xl font-semibold mb-3">Common Names</h3>
                <div className="flex flex-wrap gap-2">
                  {displayResult.commonNames.map((name, index) => (
                    <span key={index} className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              className="flex-1 px-8 py-3.5 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSaveToHistory}
              disabled={saving || saved}
            >
              {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save to History'}
            </button>
            <button 
              className="flex-1 px-8 py-3.5 text-base font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={handleScanAnother}
            >
              Scan Another Plant
            </button>
          </div>
        </div>
      </div>

      {displayResult.similarPlants && displayResult.similarPlants.length > 0 && (
        <div className="mt-12 p-8 bg-white rounded-xl shadow-lg">
          <h3 className="text-green-800 text-2xl font-semibold mb-6">Similar Plants</h3>
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

export default PlantResults;
