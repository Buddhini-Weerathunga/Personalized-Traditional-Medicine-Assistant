import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Maximize2, Minimize2, Info } from 'lucide-react';

const PoseReferenceImage = ({ pose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Map pose names to local image paths
  const getPoseImagePath = (poseName) => {
    const imagePaths = {
      'Mountain Pose': '/images/yoga/mountain-pose.png',
      'Tadasana': '/images/yoga/mountain-pose.png',
      'Raised Arms Pose': '/images/yoga/raised-arms-pose.png',
      'Urdhva Hastasana': '/images/yoga/raised-arms-pose.png',
      'Chair Pose': '/images/yoga/chair-pose.png',
      'Utkatasana': '/images/yoga/chair-pose.png',
      'Warrior II': '/images/yoga/warrior-2.png',
      'Virabhadrasana II': '/images/yoga/warrior-2.png',
      'Goddess Pose': '/images/yoga/goddess-pose.png',
      'Deviasana': '/images/yoga/goddess-pose.png',
      'Tree Pose': '/images/yoga/tree-pose.png',
      'Vrikshasana': '/images/yoga/tree-pose.png',
      'Standing Forward Fold': '/images/yoga/forward-fold.png',
      'Uttanasana': '/images/yoga/forward-fold.png',
      'Star Pose': '/images/yoga/star-pose.png',
      'Utthita Tadasana': '/images/yoga/star-pose.png',
      'Eagle Arms Pose': '/images/yoga/eagle-arms.png',
      'Garudasana': '/images/yoga/eagle-arms.png',
      'Half Moon Pose': '/images/yoga/half-moon.png',
      'Ardha Chandrasana': '/images/yoga/half-moon.png'
    };
    
    return imagePaths[poseName] || '/images/yoga/placeholder.png';
  };

  if (!pose) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          <h3 className="font-bold text-lg">Pose Guide: {pose.name}</h3>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            pose.difficulty === 'beginner' ? 'bg-green-500' :
            pose.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {pose.difficulty}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 hover:bg-blue-700 rounded"
            title="Toggle details"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-blue-700 rounded"
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`p-6 ${isExpanded ? 'h-[calc(100vh-120px)] overflow-y-auto' : ''}`}>
        
        {/* Pose Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{pose.name}</h2>
          <p className="text-gray-500">{pose.sanskritName}</p>
        </div>

        {/* Image and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pose Image */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 flex items-center justify-center min-h-[280px]">
            <img 
              src={getPoseImagePath(pose.name)}
              alt={pose.name}
              className="w-full h-auto max-h-[260px] object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Yoga+Pose';
              }}
            />
          </div>

          {/* Quick Info Panel */}
          {showDetails && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Quick Info</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Sanskrit:</span>
                    <span className="ml-2 font-medium">{pose.sanskritName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{pose.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hold time:</span>
                    <span className="ml-2 font-medium">{pose.timerSettings?.defaultHoldTime || 30}s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`ml-2 font-medium capitalize ${
                      pose.difficulty === 'beginner' ? 'text-green-600' :
                      pose.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {pose.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Key Benefits</h4>
                <ul className="space-y-1">
                  {pose.benefits?.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precautions */}
              {pose.precautions && pose.precautions.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Precautions
                  </h4>
                  <ul className="space-y-1">
                    {pose.precautions.slice(0, 2).map((precaution, idx) => (
                      <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                        <span className="text-orange-600">•</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Key Points / Instructions Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 text-lg">📋 Key Points</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 py-2">
                Step {currentStep + 1} of {pose.instructions?.length || 1}
              </span>
              <button
                onClick={() => setCurrentStep(Math.min((pose.instructions?.length || 1) - 1, currentStep + 1))}
                disabled={currentStep === (pose.instructions?.length || 1) - 1}
                className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Step Instruction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {currentStep + 1}
              </div>
              <p className="text-gray-700">
                {pose.instructions?.[currentStep] || "Follow the instructions above"}
              </p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <span>⚠️</span> Common Mistakes
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                Slouching shoulders - keep them rolled back
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                Locking knees - keep micro-bend
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                Holding breath - breathe deeply
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                Looking down - keep gaze forward
              </li>
            </ul>
          </div>

          {/* All Instructions Dropdown */}
          <details className="mt-2">
            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
              View all instructions ({pose.instructions?.length || 0} steps)
            </summary>
            <div className="mt-3 space-y-2 bg-gray-50 p-4 rounded-lg">
              {pose.instructions?.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className={`bg-gray-300 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                    idx === currentStep ? 'bg-blue-500 text-white' : ''
                  }`}>
                    {idx + 1}
                  </span>
                  <span className={idx === currentStep ? 'font-bold text-blue-700' : 'text-gray-600'}>
                    {instruction}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Camera Tips */}
        <div className="mt-6 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span>💡</span>
            <span>Stand at least 6 feet away from camera. Ensure full body is visible from head to toe.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseReferenceImage;