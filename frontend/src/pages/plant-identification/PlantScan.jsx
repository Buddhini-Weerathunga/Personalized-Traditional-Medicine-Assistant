import React, { useState } from 'react';
import ImageUploader from '../../components/plant-identification/ImageUploader';
import CameraCapture from '../../components/plant-identification/CameraCapture';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import HealthDataForm from '../../components/plant-identification/HealthDataForm';
import { identifyPlant } from '../../services/plant-identification/plantApi';
import { useNavigate } from 'react-router-dom';

const PlantScan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    // Automatically show health form after image selection
    setShowHealthForm(true);
  };

  const handleCameraCapture = (imageData) => {
    // Convert base64 to blob
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setPreviewUrl(imageData);
        setUseCamera(false);
        setError(null);
        // Automatically show health form after image capture
        setShowHealthForm(true);
      });
  };

  const handleHealthDataSubmit = async (data) => {
    setHealthData(data);
    setShowHealthForm(false);
    
    // Automatically start identification after health data is submitted
    if (!selectedImage) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send both image and health data for analysis
      const result = await identifyPlant(selectedImage, data);
      // Navigate to results page with the identification data and health info
      navigate('/plant-results', { 
        state: { 
          result, 
          image: previewUrl,
          healthData: data 
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to identify plant. Please try again.');
      setLoading(false);
    }
  };

  const handleSkipHealthData = async () => {
    setHealthData(null);
    setShowHealthForm(false);
    
    // Allow identification without health data, but warn user
    if (!selectedImage) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await identifyPlant(selectedImage, null);
      navigate('/plant-results', { 
        state: { 
          result, 
          image: previewUrl,
          healthData: null 
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to identify plant. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
    setUseCamera(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="text-green-600">
            Plant Identification
          </span>
        </h1>
        <p className="text-xl text-gray-600">Upload or capture a photo of a plant to identify it</p>
      </div>

      {/* Quick Navigation Bar */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          🏠 Home
        </button>
        <button
          className="px-4 py-2 bg-green-200 text-green-800 rounded-lg font-medium cursor-default"
        >
          🔍 Plant Identification
        </button>
        <button
          onClick={() => navigate('/plant-results')}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
        >
          🌿 Plant Description
        </button>
        <button
          onClick={() => navigate('/plant-history')}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
        >
          📚 History
        </button>
        <button
          onClick={() => navigate('/risk-alerts')}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          🚨 Safety Alerts
        </button>
      </div>

      {/* Two Column Layout: Image Upload (Left) + Health Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Image Upload */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100 min-h-[400px]">
        {!useCamera ? (
          <div className="flex flex-col items-center gap-6">
            {!previewUrl ? (
              <>
                <ImageUploader onImageSelect={handleImageSelect} />
                <div className="flex items-center w-full max-w-md text-center text-gray-400">
                  <div className="flex-1 border-b border-gray-300"></div>
                  <span className="px-4 font-medium">OR</span>
                  <div className="flex-1 border-b border-gray-300"></div>
                </div>
                <button 
                  className="flex items-center gap-2 px-8 py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => setUseCamera(true)}
                >
                  <span className="text-2xl">📷</span>
                  Use Camera
                </button>
              </>
            ) : (
              <div className="w-full max-w-3xl mx-auto">
                <div className="rounded-lg overflow-hidden mb-6 shadow-xl">
                  <img src={previewUrl} alt="Selected plant" className="w-full h-auto max-h-[500px] object-contain" />
                </div>

                {/* Health Data Summary */}
                {healthData && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                        <span>🏥</span>
                        Health Profile Included
                      </h4>
                      <button
                        onClick={() => setShowHealthForm(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      {healthData.age && <p>Age: {healthData.age}</p>}
                      {healthData.medications.length > 0 && (
                        <p>Medications: {healthData.medications.length} listed</p>
                      )}
                      {healthData.allergies.length > 0 && (
                        <p>Allergies: {healthData.allergies.length} listed</p>
                      )}
                      {(healthData.isPregnant || healthData.isBreastfeeding) && (
                        <p className="font-medium">Special conditions noted ⚠️</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Waiting for health data message */}
                {!healthData && !showHealthForm && (
                  <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                    <p className="text-green-700 font-medium">
                      ⏳ Waiting for health information to complete analysis...
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Fill out the health form above to get personalized safety recommendations
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button 
                    className="px-8 py-3.5 text-base font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleReset}
                    disabled={loading || showHealthForm}
                  >
                    Choose Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <CameraCapture 
              onCapture={handleCameraCapture}
              onCancel={() => setUseCamera(false)}
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg mt-4 justify-center">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {loading && <LoadingSpinner message="Analyzing plant image..." />}
        </div>

        {/* Right Column: Health Data Form */}
        <div>
          {showHealthForm && previewUrl ? (
            <HealthDataForm 
              onSubmit={handleHealthDataSubmit}
              onSkip={handleSkipHealthData}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-100 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <span className="text-6xl mb-4 block">🏥</span>
                <p className="text-lg font-medium">Upload an image first</p>
                <p className="text-sm mt-2">Health data form will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
        <h3 className="text-green-800 mb-4 text-xl font-semibold">💡 Tips for Better Results</h3>
        <ul className="space-y-2">
          <li className="pl-6 relative text-gray-700">
            <span className="absolute left-0 text-green-600 font-bold">✓</span>
            Ensure the plant is clearly visible and well-lit
          </li>
          <li className="pl-6 relative text-gray-700">
            <span className="absolute left-0 text-green-600 font-bold">✓</span>
            Capture the whole plant or distinctive features (leaves, flowers, fruits)
          </li>
          <li className="pl-6 relative text-gray-700">
            <span className="absolute left-0 text-green-600 font-bold">✓</span>
            Avoid blurry or low-quality images
          </li>
          <li className="pl-6 relative text-gray-700">
            <span className="absolute left-0 text-green-600 font-bold">✓</span>
            Take photos from multiple angles if needed
          </li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default PlantScan;
