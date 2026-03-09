// frontend/src/components/Yoga/PoseVisualGuide.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

const PoseVisualGuide = ({ pose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!pose) return null;

  // Simple SVG pose sketches for different poses
  const getPoseSketch = (poseName, step) => {
    const sketches = {
      'Mountain Pose': (step) => (
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Head */}
          <circle cx="100" cy="60" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2"/>
          {/* Body */}
          <line x1="100" y1="80" x2="100" y2="160" stroke="#333" strokeWidth="3"/>
          {/* Arms */}
          <line x1="100" y1="100" x2="60" y2="120" stroke="#333" strokeWidth="2"/>
          <line x1="100" y1="100" x2="140" y2="120" stroke="#333" strokeWidth="2"/>
          {/* Legs */}
          <line x1="100" y1="160" x2="70" y2="240" stroke="#333" strokeWidth="3"/>
          <line x1="100" y1="160" x2="130" y2="240" stroke="#333" strokeWidth="3"/>
          {/* Ground line */}
          <line x1="40" y1="240" x2="160" y2="240" stroke="#666" strokeWidth="1" strokeDasharray="5,5"/>
        </svg>
      ),
      'Warrior II': (step) => (
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Head */}
          <circle cx="100" cy="60" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2"/>
          {/* Body angled */}
          <line x1="100" y1="80" x2="100" y2="160" stroke="#333" strokeWidth="3"/>
          {/* Arms - Warrior II position */}
          <line x1="100" y1="100" x2="30" y2="120" stroke="#333" strokeWidth="2"/>
          <line x1="100" y1="100" x2="170" y2="120" stroke="#333" strokeWidth="2"/>
          {/* Legs - Warrior II stance */}
          <line x1="100" y1="160" x2="50" y2="240" stroke="#333" strokeWidth="3"/>
          <line x1="100" y1="160" x2="150" y2="240" stroke="#333" strokeWidth="3"/>
          {/* Knee bend indicator */}
          <circle cx="50" cy="200" r="5" fill="#ff6b6b" opacity="0.5"/>
          <text x="30" y="190" fontSize="10" fill="#ff6b6b">Bend</text>
        </svg>
      ),
      'Tree Pose': (step) => (
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Head */}
          <circle cx="100" cy="60" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2"/>
          {/* Body */}
          <line x1="100" y1="80" x2="100" y2="160" stroke="#333" strokeWidth="3"/>
          {/* Arms up like branches */}
          <line x1="100" y1="100" x2="70" y2="60" stroke="#333" strokeWidth="2"/>
          <line x1="100" y1="100" x2="130" y2="60" stroke="#333" strokeWidth="2"/>
          {/* Standing leg */}
          <line x1="100" y1="160" x2="100" y2="240" stroke="#333" strokeWidth="3"/>
          {/* Bent leg - foot on thigh */}
          <path d="M100 160 L70 180 L80 200 L100 180" fill="none" stroke="#333" strokeWidth="2"/>
          <circle cx="100" cy="180" r="5" fill="#4caf50" opacity="0.5"/>
        </svg>
      )
    };

    // Default sketch if pose not found
    const defaultSketch = () => (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        <circle cx="100" cy="60" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2"/>
        <line x1="100" y1="80" x2="100" y2="160" stroke="#333" strokeWidth="3"/>
        <line x1="100" y1="100" x2="60" y2="120" stroke="#333" strokeWidth="2"/>
        <line x1="100" y1="100" x2="140" y2="120" stroke="#333" strokeWidth="2"/>
        <line x1="100" y1="160" x2="70" y2="240" stroke="#333" strokeWidth="3"/>
        <line x1="100" y1="160" x2="130" y2="240" stroke="#333" strokeWidth="3"/>
      </svg>
    );

    const sketchFunction = sketches[poseName] || defaultSketch;
    return sketchFunction(step);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold">Pose Guide: {pose.name}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
        >
          {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Sketch Container */}
      <div className={`p-4 ${isExpanded ? 'h-[calc(100vh-120px)]' : 'h-64'}`}>
        <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
          {getPoseSketch(pose.name, currentStep)}
        </div>
      </div>

      {/* Instructions with step navigation */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">Step {currentStep + 1} of {pose.instructions?.length || 1}</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-1 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentStep(Math.min((pose.instructions?.length || 1) - 1, currentStep + 1))}
              disabled={currentStep === (pose.instructions?.length || 1) - 1}
              className="p-1 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-700">
          {pose.instructions?.[currentStep] || "Follow the pose guide above"}
        </p>
      </div>
    </div>
  );
};

export default PoseVisualGuide;