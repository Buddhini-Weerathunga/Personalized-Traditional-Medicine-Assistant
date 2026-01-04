import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import ImageUploader from '../../components/plant-identification/ImageUploader';
import CameraCapture from '../../components/plant-identification/CameraCapture';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import HealthDataForm from '../../components/plant-identification/HealthDataForm';
import { identifyPlant } from '../../services/plant-identification/plantApi';

const PlantScan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [showPlantConfirmation, setShowPlantConfirmation] = useState(false);
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
      // Store result and show plant name confirmation modal
      setIdentificationResult(result);
      setShowPlantConfirmation(true);
      setLoading(false);
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
      // Store result and show plant name confirmation modal
      setIdentificationResult(result);
      setShowPlantConfirmation(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to identify plant. Please try again.');
      setLoading(false);
    }
  };

  // Handle plant confirmation - navigate to description page
  const handlePlantConfirm = () => {
    setShowPlantConfirmation(false);
    navigate('/plant-description/detail', { 
      state: { 
        result: identificationResult, 
        image: previewUrl,
        healthData: healthData 
      } 
    });
  };

  // Handle plant rejection - allow rescan
  const handlePlantReject = () => {
    setShowPlantConfirmation(false);
    setIdentificationResult(null);
    // Keep the image but allow user to try again
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
    setUseCamera(false);
    setIdentificationResult(null);
    setShowPlantConfirmation(false);
  };

  return (
    <>
      <PlantNavbar />

      {/* Plant Name Confirmation Modal */}
      {showPlantConfirmation && identificationResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <span className="text-4xl">🌿</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plant Identified!</h2>
              
              <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                <p className="text-green-700 text-sm font-medium mb-1">We found:</p>
                <h3 className="text-2xl font-bold text-green-800">{identificationResult.plantName}</h3>
                {identificationResult.scientificName && (
                  <p className="text-green-600 italic">{identificationResult.scientificName}</p>
                )}
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    identificationResult.confidence >= 80 
                      ? 'bg-green-200 text-green-800' 
                      : identificationResult.confidence >= 60 
                      ? 'bg-orange-200 text-orange-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {identificationResult.confidence}% Confidence
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Is this the correct plant? Click "Yes, Continue" to view detailed information and personalized safety analysis.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handlePlantReject}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  No, Try Again
                </button>
                <button
                  onClick={handlePlantConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  Yes, Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Background Decorations */}
      <div className="pointer-events-none">
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
            <span>🌿 AI-Powered Plant Recognition</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Plant Identification
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Upload or capture a photo to identify medicinal plants and get personalized safety recommendations
          </p>
        </div>

        {/* Two Column Layout: Image Upload (Left) + Health Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image Upload */}
          <div className="bg-white/80 rounded-2xl p-8 shadow-md border border-green-100 min-h-[400px]">
          {!useCamera ? (
          <div className="flex flex-col items-center gap-6">
            {!previewUrl ? (
              <>
                <ImageUploader onImageSelect={handleImageSelect} />
                <div className="flex items-center w-full max-w-md text-center text-gray-400">
                  <div className="flex-1 border-b border-gray-300"></div>
                  <span className="px-4 text-sm font-medium">OR</span>
                  <div className="flex-1 border-b border-gray-300"></div>
                </div>
                <button 
                  className="group flex items-center gap-3 px-6 py-3 text-base font-semibold text-green-800 bg-white border-2 border-green-300 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:bg-green-50 hover:border-green-500 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  onClick={() => setUseCamera(true)}
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl shadow-inner">
                    📷
                  </span>
                  <span className="leading-tight">
                    <span className="block">Use Camera</span>
                    <span className="block text-xs font-normal text-green-700/80">Capture a live photo</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="w-full max-w-3xl mx-auto">
                <div className="rounded-lg overflow-hidden mb-6 shadow-xl">
                  <img src={previewUrl} alt="Selected plant" className="w-full h-auto max-h-[500px] object-contain" />
                </div>

                {/* Health Data Summary */}
                {healthData && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span>🏥</span>
                        Health Profile Included
                      </h4>
                      <button
                        onClick={() => setShowHealthForm(true)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
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
                  <div className="mb-6 p-4 bg-green-50/50 border border-green-200 rounded-xl text-center">
                    <p className="text-gray-700 font-medium text-sm">
                      ⏳ Waiting for health information to complete analysis...
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Fill out the health form to get personalized safety recommendations
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button 
                    className="px-6 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50/50 border border-red-100 text-red-700 rounded-xl mt-4 justify-center text-sm">
            <span className="text-lg">⚠️</span>
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
              <div className="bg-white/80 rounded-2xl p-8 shadow-md border border-emerald-100 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="text-5xl mb-4 block">🏥</span>
                  <p className="text-base font-medium">Upload an image first</p>
                  <p className="text-sm mt-2">Health data form will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-white/80 rounded-2xl border border-green-100 shadow-sm">
        <h3 className="text-gray-900 mb-4 text-lg font-semibold flex items-center gap-2">
          <span>💡</span>
          Tips for Better Results
        </h3>
        <ul className="space-y-2.5">
          <li className="pl-6 relative text-gray-600 text-sm">
            <span className="absolute left-0 text-green-500 font-bold">✓</span>
            Ensure the plant is clearly visible and well-lit
          </li>
          <li className="pl-6 relative text-gray-600 text-sm">
            <span className="absolute left-0 text-green-500 font-bold">✓</span>
            Capture the whole plant or distinctive features (leaves, flowers, fruits)
          </li>
          <li className="pl-6 relative text-gray-600 text-sm">
            <span className="absolute left-0 text-green-500 font-bold">✓</span>
            Avoid blurry or low-quality images
          </li>
          <li className="pl-6 relative text-gray-600 text-sm">
            <span className="absolute left-0 text-green-500 font-bold">✓</span>
            Take photos from multiple angles if needed
          </li>
        </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default PlantScan;
