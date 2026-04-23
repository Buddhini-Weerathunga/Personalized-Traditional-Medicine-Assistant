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
      'Mountain Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            {/* Background */}
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Ground line */}
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Body */}
            <circle cx="100" cy="80" r="20" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Spine */}
            <line x1="100" y1="100" x2="100" y2="180" stroke="#334155" strokeWidth="3"/>
            
            {/* Arms */}
            <line x1="100" y1="120" x2="60" y2="140" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="120" x2="140" y2="140" stroke="#334155" strokeWidth="2"/>
            
            {/* Legs */}
            <line x1="100" y1="180" x2="70" y2="240" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="180" x2="130" y2="240" stroke="#334155" strokeWidth="3"/>
            
            {/* Joint markers */}
            <circle cx="100" cy="80" r="4" fill="#3b82f6" />
            <circle cx="100" cy="100" r="4" fill="#3b82f6" />
            <circle cx="100" cy="140" r="4" fill="#3b82f6" />
            <circle cx="60" cy="140" r="4" fill="#3b82f6" />
            <circle cx="140" cy="140" r="4" fill="#3b82f6" />
            <circle cx="70" cy="240" r="4" fill="#3b82f6" />
            <circle cx="130" cy="240" r="4" fill="#3b82f6" />
            
            {/* Pose name */}
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Mountain Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Tadasana</text>
          </svg>
        ),
        description: "Stand tall like a mountain - grounded and stable"
      },
      
      'Warrior II': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Ground */}
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Body */}
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Torso angled */}
            <line x1="100" y1="88" x2="100" y2="160" stroke="#334155" strokeWidth="3"/>
            
            {/* Arms extended */}
            <line x1="100" y1="110" x2="40" y2="130" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="110" x2="160" y2="130" stroke="#334155" strokeWidth="2"/>
            
            {/* Front leg (bent) */}
            <line x1="100" y1="160" x2="60" y2="230" stroke="#334155" strokeWidth="3"/>
            <circle cx="60" cy="200" r="6" fill="#ef4444" opacity="0.3" />
            <text x="45" y="190" fontSize="8" fill="#ef4444">Bend</text>
            
            {/* Back leg (straight) */}
            <line x1="100" y1="160" x2="140" y2="230" stroke="#334155" strokeWidth="3"/>
            
            {/* Gaze direction */}
            <line x1="160" y1="120" x2="180" y2="110" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
            <text x="165" y="100" fontSize="8" fill="#3b82f6">Gaze</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Warrior II</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Virabhadrasana II</text>
          </svg>
        ),
        description: "Powerful warrior stance - strong and focused"
      },
      
      'Tree Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            <line x1="30" y1="250" x2="170" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Head */}
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Spine */}
            <line x1="100" y1="88" x2="100" y2="160" stroke="#334155" strokeWidth="3"/>
            
            {/* Arms like branches */}
            <line x1="100" y1="110" x2="70" y2="70" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="110" x2="130" y2="70" stroke="#334155" strokeWidth="2"/>
            
            {/* Standing leg */}
            <line x1="100" y1="160" x2="100" y2="240" stroke="#334155" strokeWidth="3"/>
            
            {/* Bent leg */}
            <path d="M100 160 L75 190 L85 200 L100 180" fill="none" stroke="#334155" strokeWidth="2"/>
            <circle cx="95" cy="175" r="5" fill="#22c55e" opacity="0.3"/>
            <text x="75" y="165" fontSize="8" fill="#22c55e">Place foot</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Tree Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Vrikshasana</text>
          </svg>
        ),
        description: "Stand tall and rooted like a tree"
      },
      
      'Warrior I': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            <circle cx="100" cy="60" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arms raised */}
            <line x1="100" y1="78" x2="70" y2="30" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="78" x2="130" y2="30" stroke="#334155" strokeWidth="2"/>
            
            {/* Body */}
            <line x1="100" y1="78" x2="100" y2="150" stroke="#334155" strokeWidth="3"/>
            
            {/* Front leg bent */}
            <line x1="100" y1="150" x2="70" y2="230" stroke="#334155" strokeWidth="3"/>
            <circle cx="70" cy="190" r="6" fill="#ef4444" opacity="0.3"/>
            
            {/* Back leg straight */}
            <line x1="100" y1="150" x2="130" y2="230" stroke="#334155" strokeWidth="3"/>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Warrior I</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Virabhadrasana I</text>
          </svg>
        ),
        description: "Heart-open warrior - reaching toward the sky"
      },
      
      'Warrior III': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Body horizontal */}
            <circle cx="100" cy="100" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Torso horizontal */}
            <line x1="100" y1="115" x2="140" y2="150" stroke="#334155" strokeWidth="3"/>
            
            {/* Arms forward */}
            <line x1="100" y1="115" x2="60" y2="80" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="115" x2="140" y2="80" stroke="#334155" strokeWidth="2"/>
            
            {/* Leg back */}
            <line x1="140" y1="150" x2="170" y2="200" stroke="#334155" strokeWidth="3"/>
            
            {/* Standing leg */}
            <line x1="100" y1="115" x2="70" y2="180" stroke="#334155" strokeWidth="3"/>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Warrior III</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Virabhadrasana III</text>
          </svg>
        ),
        description: "Balancing warrior - body parallel to ground"
      },
      
      'Side Plank': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Diagonal body line */}
            <line x1="60" y1="200" x2="140" y2="100" stroke="#334155" strokeWidth="4"/>
            
            {/* Head */}
            <circle cx="140" cy="90" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arm support */}
            <line x1="130" y1="105" x2="110" y2="125" stroke="#334155" strokeWidth="3"/>
            
            {/* Top arm */}
            <line x1="120" y1="115" x2="150" y2="70" stroke="#334155" strokeWidth="2"/>
            
            {/* Legs */}
            <line x1="90" y1="165" x2="70" y2="200" stroke="#334155" strokeWidth="3"/>
            <line x1="70" y1="200" x2="50" y2="220" stroke="#334155" strokeWidth="3"/>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Side Plank</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Vasistasana</text>
          </svg>
        ),
        description: "Side balance - strong core and arms"
      },
      
      'Thunderbolt Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Meditation cushion */}
            <ellipse cx="100" cy="230" rx="50" ry="20" fill="#cbd5e1" opacity="0.5" />
            
            {/* Seated figure */}
            <circle cx="100" cy="150" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Back */}
            <line x1="100" y1="168" x2="100" y2="200" stroke="#334155" strokeWidth="3"/>
            
            {/* Legs folded */}
            <path d="M100 200 L70 220 L80 230 L100 210" fill="none" stroke="#334155" strokeWidth="2"/>
            <path d="M100 200 L130 220 L120 230 L100 210" fill="none" stroke="#334155" strokeWidth="2"/>
            
            {/* Hands on thighs */}
            <circle cx="80" cy="190" r="5" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
            <circle cx="120" cy="190" r="5" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Thunderbolt Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Vajirasana</text>
          </svg>
        ),
        description: "Seated meditation pose - calm and focused"
      },
      
      'Chair Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arms up */}
            <line x1="100" y1="88" x2="70" y2="40" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="88" x2="130" y2="40" stroke="#334155" strokeWidth="2"/>
            
            {/* Torso angled */}
            <line x1="100" y1="88" x2="100" y2="150" stroke="#334155" strokeWidth="3"/>
            
            {/* Bent legs - sitting in chair */}
            <line x1="100" y1="150" x2="70" y2="210" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="150" x2="130" y2="210" stroke="#334155" strokeWidth="3"/>
            
            {/* Invisible chair */}
            <rect x="60" y="190" width="80" height="20" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
            <text x="100" y="180" fontSize="8" textAnchor="middle" fill="#3b82f6">Imagine a chair</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Chair Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Utkatasana</text>
          </svg>
        ),
        description: "Pretend you're sitting in an invisible chair"
      },
      
      'Plank Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Straight body line */}
            <line x1="60" y1="200" x2="140" y2="100" stroke="#334155" strokeWidth="4"/>
            
            {/* Head */}
            <circle cx="140" cy="90" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arms */}
            <line x1="130" y1="105" x2="110" y2="125" stroke="#334155" strokeWidth="3"/>
            <line x1="110" y1="125" x2="90" y2="145" stroke="#334155" strokeWidth="3"/>
            
            {/* Legs */}
            <line x1="90" y1="165" x2="70" y2="200" stroke="#334155" strokeWidth="3"/>
            <line x1="70" y1="200" x2="50" y2="220" stroke="#334155" strokeWidth="3"/>
            
            <text x="50" y="240" fontSize="8" fill="#3b82f6">Straight line</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Plank Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Phalakasana</text>
          </svg>
        ),
        description: "Keep body straight like a plank"
      },
      
      'Goddess Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            <line x1="20" y1="250" x2="180" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            
            <circle cx="100" cy="70" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arms in goddess position */}
            <line x1="100" y1="100" x2="60" y2="120" stroke="#334155" strokeWidth="2"/>
            <line x1="100" y1="100" x2="140" y2="120" stroke="#334155" strokeWidth="2"/>
            <line x1="60" y1="120" x2="50" y2="100" stroke="#334155" strokeWidth="2"/>
            <line x1="140" y1="120" x2="150" y2="100" stroke="#334155" strokeWidth="2"/>
            
            {/* Wide legs */}
            <line x1="100" y1="118" x2="60" y2="200" stroke="#334155" strokeWidth="3"/>
            <line x1="100" y1="118" x2="140" y2="200" stroke="#334155" strokeWidth="3"/>
            
            {/* Knee indicators */}
            <circle cx="70" cy="160" r="5" fill="#ef4444" opacity="0.3"/>
            <circle cx="130" cy="160" r="5" fill="#ef4444" opacity="0.3"/>
            
            <text x="55" y="150" fontSize="8" fill="#ef4444">Bend</text>
            <text x="125" y="150" fontSize="8" fill="#ef4444">Bend</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Goddess Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Deviasana</text>
          </svg>
        ),
        description: "Powerful goddess stance - wide and strong"
      },
      
      'Downward Dog': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Inverted V shape */}
            <line x1="60" y1="180" x2="100" y2="100" stroke="#334155" strokeWidth="4"/>
            <line x1="100" y1="100" x2="140" y2="180" stroke="#334155" strokeWidth="4"/>
            
            {/* Head */}
            <circle cx="100" cy="90" r="15" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Arms */}
            <line x1="90" y1="105" x2="70" y2="140" stroke="#334155" strokeWidth="3"/>
            <line x1="110" y1="105" x2="130" y2="140" stroke="#334155" strokeWidth="3"/>
            
            {/* Legs */}
            <line x1="70" y1="160" x2="50" y2="200" stroke="#334155" strokeWidth="3"/>
            <line x1="130" y1="160" x2="150" y2="200" stroke="#334155" strokeWidth="3"/>
            
            {/* Direction indicators */}
            <text x="50" y="140" fontSize="8" fill="#3b82f6">Press down</text>
            <text x="140" y="140" fontSize="8" fill="#3b82f6">Press down</text>
            <text x="90" y="70" fontSize="8" fill="#3b82f6">Lift hips</text>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Downward Dog</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Adho Mukha Svanasana</text>
          </svg>
        ),
        description: "Inverted V-shape - dog stretching"
      },
      
      'Hero Pose': {
        svg: (step) => (
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <rect width="200" height="300" fill="#f8fafc" rx="10" />
            
            {/* Mat/cushion */}
            <ellipse cx="100" cy="230" rx="60" ry="25" fill="#cbd5e1" opacity="0.5" />
            
            {/* Seated hero */}
            <circle cx="100" cy="140" r="18" fill="#e2e8f0" stroke="#334155" strokeWidth="2"/>
            
            {/* Upright spine */}
            <line x1="100" y1="158" x2="100" y2="200" stroke="#334155" strokeWidth="3"/>
            
            {/* Legs folded under */}
            <path d="M100 200 L70 220 L70 200 L100 190" fill="none" stroke="#334155" strokeWidth="2"/>
            <path d="M100 200 L130 220 L130 200 L100 190" fill="none" stroke="#334155" strokeWidth="2"/>
            
            {/* Hands on knees */}
            <circle cx="80" cy="180" r="5" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
            <circle cx="120" cy="180" r="5" fill="#e2e8f0" stroke="#334155" strokeWidth="1"/>
            
            <text x="100" y="280" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Hero Pose</text>
            <text x="100" y="295" textAnchor="middle" fill="#64748b" fontSize="10">Virasana</text>
          </svg>
        ),
        description: "Seated pose - sitting between heels"
      }
    };

    return illustrations[poseName] || {
      svg: (step) => (
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
              {illustration.svg(currentStep)}
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