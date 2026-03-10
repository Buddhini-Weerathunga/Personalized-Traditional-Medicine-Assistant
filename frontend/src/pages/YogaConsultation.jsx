import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Play, Pause, ArrowLeft, Search, Filter, 
  Maximize2, Minimize2, Volume2, VolumeX, 
  AlertCircle, CheckCircle, BarChart3, 
  Heart, Shield, Zap, Repeat,
  TrendingUp, Clock
} from 'lucide-react';
import PoseDetector from '../components/Yoga/PoseDetector';
import PoseCorrection from '../components/Yoga/PoseCorrection';
import PoseDetectionStatus from '../components/Yoga/PoseDetectionStatus';
import * as yogaApi from '../services/yogaApi';
import PoseVisualGuide from '../components/Yoga/PoseVisualGuide';
import AudioFeedbackController from '../components/Yoga/AudioFeedbackController';
import PoseDebugView from '../components/Yoga/PoseDebugView';
import PoseTimer from '../components/Yoga/PoseTimer';
import PoseCompletion from '../components/Yoga/PoseCompletion';

export default function YogaConsultation() {
  const [currentView, setCurrentView] = useState('library');
  const [selectedPose, setSelectedPose] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const [feedback, setFeedback] = useState({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
  const [poses, setPoses] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [personalization, setPersonalization] = useState({
    age: 30,
    flexibilityLevel: 'medium',
    mobilityRestrictions: [],
    preferredFeedback: 'both'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cameraError, setCameraError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectorLoading, setIsDetectorLoading] = useState(false);
  
  // Detection status
  const [detectionStatus, setDetectionStatus] = useState({
    isDetecting: false,
    jointCount: 0,
    confidence: 0,
    error: null
  });

  const [currentStep, setCurrentStep] = useState(0);

  // ===== STATES FOR TIMER AND COMPLETION =====
  const [currentJointAngles, setCurrentJointAngles] = useState({});
  const [idealAngles, setIdealAngles] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [holdAchieved, setHoldAchieved] = useState(false);

  // ===== NEW STATE FOR AUDIO ANNOUNCEMENT =====
  const [audioAnnounced, setAudioAnnounced] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load voices for speech synthesis
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Load poses and user progress on mount
  useEffect(() => {
    loadPoses();
    loadUserProgress();
  }, []);

  const loadPoses = async () => {
    try {
      setIsLoading(true);
      const response = await yogaApi.getYogaPoses();
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.poses.length > 0) {
        setPoses(response.data.poses);
      } else {
        // Fallback data with timer settings
        setPoses([
          {
            _id: '1',
            name: "Mountain Pose",
            sanskritName: "Tadasana",
            difficulty: "beginner",
            category: "standing",
            description: "Foundation pose that improves posture",
            instructions: [
              "Stand with feet together, weight balanced evenly",
              "Engage your thigh muscles and lift your kneecaps",
              "Lengthen your tailbone toward the floor",
              "Roll your shoulders back and down"
            ],
            benefits: ["Improves posture", "Strengthens thighs"],
            precautions: ["Avoid if low blood pressure"],
            timerSettings: {
              defaultHoldTime: 30,
              minHoldTime: 15,
              maxHoldTime: 60,
              restTimeBetweenPoses: 10,
              breathingCycles: 5,
              holdTimeByLevel: {
                beginner: 20,
                intermediate: 30,
                advanced: 45
              }
            }
          },
          {
            _id: '2',
            name: "Warrior II",
            sanskritName: "Virabhadrasana II",
            difficulty: "intermediate",
            category: "standing",
            description: "Powerful standing pose that builds strength",
            instructions: [
              "Stand with feet 3-4 feet apart",
              "Turn right foot out 90°, left foot in slightly",
              "Bend right knee directly over ankle",
              "Keep left leg straight and strong",
              "Extend arms parallel to floor"
            ],
            benefits: ["Strengthens legs", "Stretches hips"],
            precautions: ["Avoid if knee injuries"],
            timerSettings: {
              defaultHoldTime: 30,
              minHoldTime: 15,
              maxHoldTime: 60,
              restTimeBetweenPoses: 10,
              breathingCycles: 5,
              holdTimeByLevel: {
                beginner: 20,
                intermediate: 30,
                advanced: 45
              }
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading poses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const response = await yogaApi.getUserProgress();
      console.log('User progress response:', response.data);
      
      if (response.data.success) {
        setUserProgress(response.data.progress);
        if (response.data.progress?.personalization) {
          setPersonalization(response.data.progress.personalization);
        }
      } else {
        setUserProgress({
          overallStats: { totalSessions: 0, totalDuration: 0, averageScore: 0 },
          streak: { current: 0, longest: 0 },
          poseProficiency: []
        });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      setUserProgress({
        overallStats: { totalSessions: 0, totalDuration: 0, averageScore: 0 },
        streak: { current: 0, longest: 0 },
        poseProficiency: []
      });
    }
  };

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Camera initialization
  const initializeCamera = async () => {
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log('Camera access granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                resolve();
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setCameraError('Could not start video playback');
                resolve();
              });
          };
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(error.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Handle detection status updates
  const handleDetectionStatus = (status) => {
    setDetectionStatus(prev => ({ ...prev, ...status }));
  };

  // Handle pose detected
  const handlePoseDetected = async (jointAngles) => {
    if (!currentSessionId || !isPracticing) return;
    
    console.log('Sending joint angles to backend:', jointAngles);
    setCurrentJointAngles(jointAngles);

    try {
      const response = await yogaApi.analyzePose({
        sessionId: currentSessionId,
        jointAngles
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        const newCorrections = response.data.corrections || [];
        const newFeedback = response.data.feedback || {
          postureAccuracy: 0,
          alignmentScore: 0,
          suggestions: []
        };
        
        setCorrections(newCorrections);
        setFeedback(newFeedback);
        
        console.log('New feedback received:', newFeedback);
      }
    } catch (error) {
      console.error('Error analyzing pose:', error);
    }
  };

  // ===== FUNCTION TO CHECK IF POSE IS CORRECT (ACCURACY ≥ 80%) =====
  const isPoseCorrect = () => {
    if (detectionStatus.jointCount < 4) return false;
    return feedback?.postureAccuracy >= 80;
  };

  // ===== CALLBACK WHEN AUDIO ANNOUNCES CORRECT POSE =====
  const handlePoseCorrectAnnounced = () => {
    console.log('🎯 Audio announced correct pose, timer can start');
    setAudioAnnounced(true);
  };

  // ===== TIMER HANDLER FUNCTIONS =====
  const handleTimeComplete = () => {
    setHoldAchieved(true);
    
    const finalScore = Math.round(
      (feedback?.postureAccuracy || 0) * 0.7 + 
      (feedback?.alignmentScore || 0) * 0.3
    );
    setSessionScore(finalScore);
    
    setShowCompletion(true);
    setIsPracticing(false);
    stopCamera();
    
    if (isAudioEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        `Great job! You've completed ${selectedPose?.name}. Well done!`
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextPose = () => {
    setShowCompletion(false);
    setHoldAchieved(false);
    setCorrections([]);
    setFeedback({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
    setCurrentJointAngles({});
    setAudioAnnounced(false);
    setCurrentView('library');
    setSelectedPose(null);
  };

  const handlePracticeAgain = () => {
    setShowCompletion(false);
    setHoldAchieved(false);
    setCorrections([]);
    setFeedback({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
    setCurrentJointAngles({});
    setAudioAnnounced(false);
    setResetTimer(prev => !prev);
    handleStartPractice();
  };

  // Start practice session
  const handleStartPractice = async () => {
    if (!selectedPose) return;
    
    try {
      setIsPracticing(true);
      setIsDetectorLoading(true);
      setHoldAchieved(false);
      setShowCompletion(false);
      setCorrections([]);
      setFeedback({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
      setCurrentJointAngles({});
      setAudioAnnounced(false);
      
      const response = await yogaApi.startYogaSession({
        poseId: selectedPose._id,
        difficultyLevel: selectedPose.difficulty
      });
      
      if (response.data.success) {
        setCurrentSessionId(response.data.sessionId);
        
        if (response.data.idealAngles) {
          setIdealAngles(response.data.idealAngles);
        }
      }
      
      await initializeCamera();
      
      setTimeout(() => {
        setIsDetectorLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session. Please try again.');
      setIsPracticing(false);
      setIsDetectorLoading(false);
    }
  };

  // End practice session
  const handleEndPractice = async () => {
    if (!currentSessionId) {
      setIsPracticing(false);
      stopCamera();
      return;
    }

    try {
      const response = await yogaApi.endYogaSession({
        sessionId: currentSessionId
      });

      if (response.data.success) {
        const finalScore = Math.round(
          (feedback?.postureAccuracy || 0) * 0.7 + 
          (feedback?.alignmentScore || 0) * 0.3
        );
        setSessionScore(finalScore);
        setShowCompletion(true);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsPracticing(false);
      stopCamera();
    }
  };

  // Repeat last instruction
  const repeatLastInstruction = () => {
    if (corrections.length > 0 && window.speechSynthesis && isAudioEnabled) {
      const utterance = new SpeechSynthesisUtterance(corrections[0].message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cameraContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Filter poses
  const filteredPoses = poses.filter(pose => {
    const matchesSearch = pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pose.sanskritName && pose.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Render library view
  const renderLibraryView = () => (
    <div className="space-y-6">
      {/* Blue banner - removed gradient */}
      <div className="bg-blue-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Yoga Guidance System</h1>
        <p className="text-lg opacity-90">
          Select a pose to begin your practice with real-time guidance, timer, and audio feedback
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search poses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="standing">Standing</option>
              <option value="seated">Seated</option>
              <option value="balance">Balance</option>
              <option value="inversion">Inversion</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading poses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoses.map((pose) => (
            <div
              key={pose._id}
              onClick={() => {
                setSelectedPose(pose);
                setCurrentView('practice');
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              {/* Lighter blue card header */}
              <div className="h-40 bg-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-3xl">🧘</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">{pose.name}</h3>
                  <p className="text-sm text-gray-600">{pose.sanskritName}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pose.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    pose.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {pose.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pose.timerSettings?.defaultHoldTime || 30}s
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{pose.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render practice view
  const renderPracticeView = () => (
    <div className="space-y-6">
      {/* Blue banner - removed gradient */}
      <div className="bg-blue-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ArrowLeft 
              className="w-6 h-6 cursor-pointer hover:text-blue-200"
              onClick={() => {
                if (isPracticing) {
                  if (window.confirm('End current practice session?')) {
                    handleEndPractice();
                  }
                } else {
                  setCurrentView('library');
                }
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{selectedPose?.name}</h2>
              <p className="text-sm opacity-90">{selectedPose?.sanskritName}</p>
            </div>
          </div>
          
          {!isPracticing && !showCompletion ? (
            <button
              onClick={handleStartPractice}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-bold flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Practice
            </button>
          ) : isPracticing && !showCompletion ? (
            <button
              onClick={handleEndPractice}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-bold flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              End Session
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          
          {!isPracticing && !showCompletion && (
            <>
              <PoseVisualGuide pose={selectedPose} />
            </>
          )}

          {isPracticing && !showCompletion && (
            <>
              <PoseDetectionStatus
                isDetecting={detectionStatus.isDetecting}
                jointCount={detectionStatus.jointCount}
                confidence={detectionStatus.confidence}
                error={detectionStatus.error}
                isAudioEnabled={isAudioEnabled}
              />
              
              <PoseTimer
                pose={selectedPose}
                isActive={isPracticing && !showCompletion}
                onTimeComplete={handleTimeComplete}
                onTimeUpdate={setTimeLeft}
                reset={resetTimer}
                isPoseCorrect={isPoseCorrect()}
                corrections={corrections}
                onPoseCorrectAnnounced={audioAnnounced ? null : handlePoseCorrectAnnounced}
              />
            </>
          )}

          <div 
            ref={cameraContainerRef}
            className={`relative bg-gray-900 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-[400px]'}`}
          >
            {cameraError ? (
              <div className="h-full flex flex-col items-center justify-center text-white p-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Camera Error</h3>
                <p className="text-gray-300 mb-4">{cameraError}</p>
                <button
                  onClick={initializeCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : isPracticing && !showCompletion ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                  >
                    {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${detectionStatus.isDetecting ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span>
                      {detectionStatus.isDetecting 
                        ? `Tracking ${detectionStatus.jointCount} joints (${detectionStatus.confidence}%)` 
                        : 'Waiting for pose...'}
                    </span>
                    <span className="ml-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {isDetectorLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                      <p className="text-lg">Loading pose detection...</p>
                      <p className="text-sm opacity-75 mt-2">This may take a few seconds</p>
                    </div>
                  </div>
                )}

                <PoseDetector
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  onPoseDetected={handlePoseDetected}
                  isActive={isPracticing && !isDetectorLoading}
                  onStatusChange={handleDetectionStatus}
                />
              </>
            ) : !showCompletion ? (
              <div className="h-full flex flex-col items-center justify-center text-white">
                <Camera className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-white text-lg">Click "Start Practice" to begin</p>
                <p className="text-gray-400 text-sm mt-2">Make sure your camera is connected</p>
              </div>
            ) : null}
          </div>

          {/* Pose Guide Card - Moved after video canvas */}
          {selectedPose && !isPracticing && !showCompletion && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pose Guide: {selectedPose.name}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep + 1} of {selectedPose.instructions?.length || 1}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(Math.min((selectedPose.instructions?.length || 1) - 1, currentStep + 1))}
                      disabled={currentStep === (selectedPose.instructions?.length || 1) - 1}
                      className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">
                  {selectedPose.instructions?.[currentStep] || "Follow the pose guide above"}
                </p>
              </div>
            </div>
          )}

          {selectedPose && isPracticing && !showCompletion && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Current Focus
                </h3>
                <button
                  onClick={repeatLastInstruction}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Repeat className="w-4 h-4" />
                  Repeat
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {corrections.length > 0 
                  ? corrections[0].message 
                  : isPoseCorrect()
                    ? `✅ Perfect! ${audioAnnounced ? 'Timer running' : 'Preparing timer...'} - ${timeLeft}s remaining`
                    : detectionStatus.jointCount < 4
                      ? "Please move into full camera view"
                      : "Adjust your pose to start timer"}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isPracticing && !showCompletion && (
            <>
              <AudioFeedbackController
                corrections={corrections}
                feedback={feedback}
                poseName={selectedPose?.name}
                isPracticing={isPracticing}
                isAudioEnabled={isAudioEnabled}
                onAudioToggle={() => setIsAudioEnabled(!isAudioEnabled)}
                timeLeft={timeLeft}
                isTimerRunning={isPracticing && !showCompletion && isPoseCorrect() && audioAnnounced}
                onPoseCorrectAnnounced={handlePoseCorrectAnnounced}
              />

              <PoseDebugView 
                jointAngles={currentJointAngles} 
                idealAngles={idealAngles}
              />
            </>
          )}

          {!showCompletion && (
            <PoseCorrection
              corrections={corrections}
              feedback={feedback}
            />
          )}

          {isPracticing && !showCompletion && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Session Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-blue-600">Accuracy</p>
                  <p className={`text-xl font-bold ${
                    (feedback?.postureAccuracy || 0) >= 80 ? 'text-green-600' : 
                    (feedback?.postureAccuracy || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(feedback?.postureAccuracy || 0)}%
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-green-600">Alignment</p>
                  <p className="text-xl font-bold text-green-700">{Math.round(feedback?.alignmentScore || 0)}%</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-bold ${(feedback?.postureAccuracy || 0) >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {(feedback?.postureAccuracy || 0) >= 80 ? '✅ Correct Pose' : '⏳ Adjusting'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Time Left:</span>
                  <span className={`font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
                {isPoseCorrect() && !audioAnnounced && (
                  <div className="mt-2 text-xs text-purple-600 text-center">
                    ⏳ Waiting for audio announcement...
                  </div>
                )}
              </div>
            </div>
          )}

          {!showCompletion && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {selectedPose?.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Precautions
                </h3>
                <ul className="space-y-2">
                  {selectedPose?.precautions?.map((precaution, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <AlertCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Completion Screen Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PoseCompletion
            pose={selectedPose}
            score={sessionScore}
            corrections={corrections}
            holdTime={selectedPose?.timerSettings?.defaultHoldTime || 30}
            onNextPose={handleNextPose}
            onPracticeAgain={handlePracticeAgain}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Yoga Guidance System</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('library')}
              className={`px-4 py-2 rounded-lg transition ${
                currentView === 'library' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setCurrentView('practice')}
              disabled={!selectedPose && currentView !== 'practice'}
              className={`px-4 py-2 rounded-lg transition ${
                currentView === 'practice' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${!selectedPose && currentView !== 'practice' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Practice
            </button>
            <button
              onClick={() => navigate('/yoga-progress')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'library' && renderLibraryView()}
        {currentView === 'practice' && renderPracticeView()}
      </main>
    </div>
  );
}