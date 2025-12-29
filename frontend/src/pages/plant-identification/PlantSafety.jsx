import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { getPlantSafetyInfo } from '../../services/plant-identification/plantApi';

const PlantSafety = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [safetyInfo, setSafetyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (plantId) {
      fetchSafetyInfo();
    }
  }, [plantId]);

  const fetchSafetyInfo = async () => {
    try {
      setLoading(true);
      const data = await getPlantSafetyInfo(plantId);
      setSafetyInfo(data);
    } catch (error) {
      console.error('Error fetching safety info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading safety information..." />;
  }

  if (!safetyInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Safety Information Not Found</h2>
        <p className="text-gray-600 mb-6">No safety data available for this plant.</p>
        <button
          onClick={() => navigate('/plant-history')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  const {
    plantName,
    scientificName,
    image,
    toxicityLevel,
    contraindications,
    sideEffects,
    drugInteractions,
    dosageGuidelines,
    safetyPrecautions,
    specialPopulations,
    emergencyInformation
  } = safetyInfo;

  const getToxicityColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'none':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-8 mb-8 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-white hover:text-gray-200 flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {image && (
            <img
              src={image}
              alt={plantName}
              className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{plantName}</h1>
            <p className="text-xl italic opacity-90">{scientificName}</p>
            <div className={`inline-block mt-3 px-4 py-2 rounded-lg border-2 ${getToxicityColor(toxicityLevel)} font-semibold`}>
              Toxicity: {toxicityLevel || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      {toxicityLevel?.toLowerCase() === 'high' && (
        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚨</span>
            <h2 className="text-xl font-bold text-red-800">High Toxicity Warning</h2>
          </div>
          <p className="text-red-700 font-medium">
            This plant has high toxicity levels. Use only under professional medical supervision. 
            Keep out of reach of children and pets.
          </p>
        </div>
      )}

      {/* Contraindications */}
      {contraindications && contraindications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span>🚫</span> Contraindications
          </h2>
          <p className="text-gray-600 mb-4">Do not use this plant if you have the following conditions:</p>
          <div className="space-y-2">
            {contraindications.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-600 font-bold">⚠️</span>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side Effects */}
      {sideEffects && sideEffects.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <span>⚡</span> Possible Side Effects
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sideEffects.map((effect, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600">•</span>
                <p className="text-gray-800">{effect}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drug Interactions */}
      {drugInteractions && drugInteractions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span>💊</span> Drug Interactions
          </h2>
          <p className="text-gray-600 mb-4">This plant may interact with the following medications:</p>
          <div className="space-y-3">
            {drugInteractions.map((interaction, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-900 mb-1">{interaction.drug}</h3>
                <p className="text-gray-700">{interaction.description}</p>
                {interaction.severity && (
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    interaction.severity === 'severe' ? 'bg-red-200 text-red-800' :
                    interaction.severity === 'moderate' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {interaction.severity.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dosage Guidelines */}
      {dosageGuidelines && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span>📏</span> Dosage Guidelines
          </h2>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="space-y-3">
              {dosageGuidelines.general && (
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">General Dosage:</h3>
                  <p className="text-gray-700">{dosageGuidelines.general}</p>
                </div>
              )}
              {dosageGuidelines.forms && dosageGuidelines.forms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">By Form:</h3>
                  <div className="space-y-2">
                    {dosageGuidelines.forms.map((form, index) => (
                      <div key={index} className="bg-white rounded p-3">
                        <span className="font-medium text-blue-800">{form.type}:</span>{' '}
                        <span className="text-gray-700">{form.dosage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dosageGuidelines.duration && (
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Duration:</h3>
                  <p className="text-gray-700">{dosageGuidelines.duration}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Always consult with a healthcare professional before starting any herbal treatment.
            </p>
          </div>
        </div>
      )}

      {/* Safety Precautions */}
      {safetyPrecautions && safetyPrecautions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <span>🛡️</span> Safety Precautions
          </h2>
          <ul className="space-y-3">
            {safetyPrecautions.map((precaution, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-800">{precaution}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Special Populations */}
      {specialPopulations && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <span>👥</span> Special Populations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {specialPopulations.pregnancy && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="font-semibold text-pink-900 mb-2">🤰 Pregnancy</h3>
                <p className="text-gray-700">{specialPopulations.pregnancy}</p>
              </div>
            )}
            {specialPopulations.breastfeeding && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🤱 Breastfeeding</h3>
                <p className="text-gray-700">{specialPopulations.breastfeeding}</p>
              </div>
            )}
            {specialPopulations.children && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">👶 Children</h3>
                <p className="text-gray-700">{specialPopulations.children}</p>
              </div>
            )}
            {specialPopulations.elderly && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">👴 Elderly</h3>
                <p className="text-gray-700">{specialPopulations.elderly}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Information */}
      {emergencyInformation && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🚑</span> Emergency Information
          </h2>
          <div className="space-y-3">
            {emergencyInformation.symptoms && (
              <div>
                <h3 className="font-semibold mb-2">Signs of Overdose/Poisoning:</h3>
                <p>{emergencyInformation.symptoms}</p>
              </div>
            )}
            {emergencyInformation.firstAid && (
              <div>
                <h3 className="font-semibold mb-2">First Aid:</h3>
                <p>{emergencyInformation.firstAid}</p>
              </div>
            )}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4">
              <p className="font-bold text-xl mb-2">⚠️ In case of emergency:</p>
              <p className="text-lg">Call emergency services immediately or contact poison control</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantSafety;
