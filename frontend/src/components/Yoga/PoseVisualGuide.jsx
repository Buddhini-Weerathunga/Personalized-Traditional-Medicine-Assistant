import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Info, AlertCircle } from 'lucide-react';

const PoseVisualGuide = ({ pose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  if (!pose) return null;

  // Get pose illustration based on pose name
  const getPoseIllustration = (poseName) => {
    const illustrations = {
      // 1. Mountain Pose
      'Mountain Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="80" r="20" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="100" x2="100" y2="180" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="120" x2="60" y2="140" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="120" x2="140" y2="140" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="180" x2="70" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="180" x2="130" y2="240" stroke="#334155" strokeWidth="3"/>
            <circle cx="100" cy="80" r="4" fill="#3b82f6" />
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Mountain Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Tadasana</text>
          </svg>
        ),
        description: "Stand tall like a mountain - grounded and stable"
      },

      // 2. Raised Arms Pose
      'Raised Arms Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="80" r="20" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="100" x2="100" y2="180" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="120" x2="70" y2="50" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="120" x2="130" y2="50" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="180" x2="70" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="180" x2="130" y2="240" stroke="#334155" strokeWidth="3"/>
            <circle cx="100" cy="80" r="4" fill="#3b82f6" />
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Raised Arms Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Urdhva Hastasana</text>
          </svg>
        ),
        description: "Arms extended straight up toward the sky"
      },

      // 3. Chair Pose
      'Chair Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="70" y2="40" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="130" y2="40" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="100" y2="150" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="150" x2="70" y2="210" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="150" x2="130" y2="210" stroke="#334155" strokeWidth="3"/>
            <rect x="60" y="190" width="80" height="20" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
            <text x="100" y="180" fontSize="8" textAnchor="middle" fill="#3b82f6">Imagine a chair</text>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Chair Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Utkatasana</text>
          </svg>
        ),
        description: "Pretend you're sitting in an invisible chair"
      },

      // 4. Warrior II
      'Warrior II': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="100" y2="160" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="110" x2="40" y2="130" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="110" x2="160" y2="130" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="160" x2="60" y2="230" stroke="#334155" strokeWidth="3"/>
            <circle cx="60" cy="200" r="6" fill="#ef4444" opacity="0.3" />
            <text x="45" y="190" fontSize="8" fill="#ef4444">Bend</text>
            <line x1="100" y1="160" x2="140" y2="230" stroke="#334155" strokeWidth="3"/>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Warrior II</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Virabhadrasana II</text>
          </svg>
        ),
        description: "Powerful warrior stance - strong and focused"
      },

      // 5. Goddess Pose - CORRECTED
      'Goddess Pose': {
  svg: () => (
    <svg viewBox="0 0 200 300" className="w-full h-full">
      <rect width="200" height="300" fill="#f8fafc" rx="10" />
      <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
      
      {/* Head */}
      <circle cx="100" cy="60" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
      
      {/* Torso */}
      <line x1="100" y1="78" x2="100" y2="140" stroke="#334155" strokeWidth="3" />
      
      {/* Arms bent at 90° (cactus arms) - CORRECTED */}
      <line x1="100" y1="95" x2="60" y2="95" stroke="#334155" strokeWidth="2" />
      <line x1="60" y1="95" x2="60" y2="115" stroke="#334155" strokeWidth="2" />
      <line x1="100" y1="95" x2="140" y2="95" stroke="#334155" strokeWidth="2" />
      <line x1="140" y1="95" x2="140" y2="115" stroke="#334155" strokeWidth="2" />
      
      {/* Wide legs in squat */}
      <line x1="100" y1="140" x2="60" y2="200" stroke="#334155" strokeWidth="3" />
      <line x1="100" y1="140" x2="140" y2="200" stroke="#334155" strokeWidth="3" />
      
      {/* Bent knees indicator */}
      <circle cx="70" cy="175" r="5" fill="#ef4444" opacity="0.3" />
      <circle cx="130" cy="175" r="5" fill="#ef4444" opacity="0.3" />
      <text x="50" y="168" fontSize="8" fill="#ef4444">Bend</text>
      <text x="135" y="168" fontSize="8" fill="#ef4444">Bend</text>
      
      {/* Toes turned out */}
      <line x1="60" y1="200" x2="45" y2="235" stroke="#334155" strokeWidth="2" />
      <line x1="140" y1="200" x2="155" y2="235" stroke="#334155" strokeWidth="2" />
      
      {/* Labels */}
      <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Goddess Pose</text>
      <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Deviasana</text>
    </svg>
  ),
  description: "Wide squat with arms bent at 90° - keep knees over ankles"
},
      // 6. Tree Pose
      'Tree Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="100" y2="160" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="110" x2="75" y2="75" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="110" x2="125" y2="75" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="160" x2="100" y2="240" stroke="#334155" strokeWidth="3"/>
            <path d="M100 160 L75 190 L85 200 L100 180" fill="none" stroke="#334155" strokeWidth="2"/>
            <circle cx="95" cy="175" r="5" fill="#22c55e" opacity="0.3"/>
            <text x="70" y="165" fontSize="8" fill="#22c55e">Place foot</text>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Tree Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Vrikshasana</text>
          </svg>
        ),
        description: "Stand tall and rooted like a tree"
      },

      // 7. Star Pose
      'Star Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            {/* Arms OUT to sides */}
            <line x1="100" y1="100" x2="40" y2="100" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="100" x2="160" y2="100" stroke="#334155" strokeWidth="3"/>
            {/* Legs WIDE apart */}
            <line x1="100" y1="120" x2="60" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="120" x2="140" y2="240" stroke="#334155" strokeWidth="3"/>
            <circle cx="60" cy="100" r="5" fill="#3b82f6" />
            <circle cx="140" cy="100" r="5" fill="#3b82f6" />
            <circle cx="75" cy="190" r="4" fill="#22c55e" opacity="0.5"/>
            <circle cx="125" cy="190" r="4" fill="#22c55e" opacity="0.5"/>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Star Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Utthita Tadasana</text>
          </svg>
        ),
        description: "Five-Pointed Star - Arms and legs spread wide"
      },

      // 8. Standing Forward Fold
      'Standing Forward Fold': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="180" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="195" x2="100" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="195" x2="70" y2="160" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="195" x2="130" y2="160" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="240" x2="70" y2="250" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="240" x2="130" y2="250" stroke="#334155" strokeWidth="3"/>
            <text x="100" y="140" fontSize="8" textAnchor="middle" fill="#3b82f6">Fold forward</text>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Standing Forward Fold</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Uttanasana</text>
          </svg>
        ),
        description: "Fold forward from the hips - hamstring stretch"
      },

      // 9. Eagle Arms Pose
      'Eagle Arms Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="80" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="98" x2="100" y2="180" stroke="#334155" strokeWidth="3"/>
            {/* Arms wrapped in eagle position */}
            <path d="M100 120 L80 110 L85 130 L100 125" fill="none" stroke="#334155" strokeWidth="2"/>
            <path d="M100 120 L120 110 L115 130 L100 125" fill="none" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="180" x2="70" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="180" x2="130" y2="240" stroke="#334155" strokeWidth="3"/>
            <text x="80" y="100" fontSize="7" fill="#3b82f6">Wrap arms</text>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Eagle Arms Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Garudasana</text>
          </svg>
        ),
        description: "Cross and wrap arms - open shoulder blades"
      },

      // 10. Half Moon Pose
      'Half Moon Pose': {
        svg: () => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="80" cy="130" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            <line x1="80" y1="145" x2="80" y2="200" stroke="#334155" strokeWidth="3"/>
            <line x1="80" y1="160" x2="50" y2="220" stroke="#334155" strokeWidth="2"/>
            <line x1="80" y1="160" x2="130" y2="100" stroke="#334155" strokeWidth="2"/>
            <line x1="80" y1="200" x2="130" y2="160" stroke="#334155" strokeWidth="3"/>
            <line x1="80" y1="200" x2="60" y2="250" stroke="#334155" strokeWidth="3"/>
            <text x="120" y="120" fontSize="7" fill="#3b82f6">Reach up</text>
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Half Moon Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Ardha Chandrasana</text>
          </svg>
        ),
        description: "Balance on one leg - reach top arm up"
      }
    };

    return illustrations[poseName] || {
      svg: () => (
        <svg viewBox="0 0 200 300" className="w-full h-full">
          <rect width="200" height="300" fill="#f8fafc" rx="10" />
          <circle cx="100" cy="100" r="30" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
          <line x1="100" y1="130" x2="100" y2="200" stroke="#334155" strokeWidth="3"/>
          <line x1="100" y1="160" x2="60" y2="180" stroke="#334155" strokeWidth="2"/>
          <line x1="100" y1="160" x2="140" y2="180" stroke="#334155" strokeWidth="2"/>
          <line x1="100" y1="200" x2="70" y2="250" stroke="#334155" strokeWidth="3"/>
          <line x1="100" y1="200" x2="130" y2="250" stroke="#334155" strokeWidth="3"/>
          <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">{pose.name}</text>
        </svg>
      ),
      description: "Follow the instructions below"
    };
  };

  const illustration = getPoseIllustration(pose.name);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Pose Guide: {pose.name}</h3>
          <span className="bg-blue-500 px-2 py-1 rounded text-xs">
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

      {/* Main content */}
      <div className={`p-4 ${isExpanded ? 'h-[calc(100vh-120px)] overflow-y-auto' : ''}`}>
        {/* Illustration and quick info */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Illustration */}
          <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-4">
            <div className="aspect-square w-full max-w-[300px] mx-auto">
              {illustration.svg()}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 italic">
              {illustration.description}
            </p>
          </div>

          {/* Quick info */}
          {showDetails && (
            <div className="w-full md:w-1/2 space-y-4">
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

              {/* Benefits preview */}
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

              {/* Precautions preview */}
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

        {/* Step by step instructions */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-4">Step-by-Step Instructions</h4>
          
          {/* Step navigation */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {pose.instructions?.length || 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentStep(Math.min((pose.instructions?.length || 1) - 1, currentStep + 1))}
                disabled={currentStep === (pose.instructions?.length || 1) - 1}
                className="p-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current instruction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {currentStep + 1}
              </div>
              <p className="text-gray-700 text-lg">
                {pose.instructions?.[currentStep] || "Follow the pose guide above"}
              </p>
            </div>
          </div>

          {/* All instructions preview */}
          <details className="mt-4">
            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
              View all instructions
            </summary>
            <div className="mt-3 space-y-2 bg-gray-50 p-4 rounded-lg">
              {pose.instructions?.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="bg-gray-300 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
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
      </div>
    </div>
  );
};

export default PoseVisualGuide;