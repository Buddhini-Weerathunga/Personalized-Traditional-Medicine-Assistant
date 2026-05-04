import { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle, CheckCircle, Target, Loader } from 'lucide-react';

const PoseTimer = ({ 
  pose, 
  isActive, 
  onTimeComplete,
  onTimeUpdate,
  reset,
  isPoseCorrect,
  corrections,
  onPoseCorrectAnnounced,
  detectionStatus,
  feedback
}) => {
  const [timeLeft, setTimeLeft] = useState(pose?.timerSettings?.defaultHoldTime || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [waitingForPose, setWaitingForPose] = useState(true);
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const [poseCorrectTime, setPoseCorrectTime] = useState(null);
  const [audioAnnounced, setAudioAnnounced] = useState(false);
  const [holdAchievements, setHoldAchievements] = useState([]);
  
  const timerRef = useRef(null);
  const warningPlayedRef = useRef(false);
  const speechSynthRef = useRef(null);
  
  const waitingMessages = [
    "Get into position...",
    "Adjust your posture...",
    "Find the correct alignment...",
    "I'm waiting for your pose...",
    "Move into the pose..."
  ];

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
  }, []);

  // Reset timer when pose changes
  useEffect(() => {
    if (pose) {
      const holdTime = pose.timerSettings?.defaultHoldTime || 30;
      setTimeLeft(holdTime);
      setIsRunning(false);
      setCompleted(false);
      setShowWarning(false);
      setWaitingForPose(true);
      setPoseCorrectTime(null);
      setAudioAnnounced(false);
      warningPlayedRef.current = false;
      setWaitingMessageIndex(0);
      setHoldAchievements([]);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [pose, reset]);

 // Update the useEffect that monitors pose correctness
useEffect(() => {
  if (!isActive || completed) return;

  // Use the isPoseCorrect prop from parent (which now has force start logic)
  const poseCorrect = isPoseCorrect;
  
  console.log(`🔥 PoseTimer: isPoseCorrect=${poseCorrect}, waitingForPose=${waitingForPose}`);
  
  if (poseCorrect && waitingForPose) {
    console.log('🔥 PoseTimer: Pose correct! Waiting for audio...');
    setPoseCorrectTime(Date.now());
    setWaitingForPose(false);
  } else if (!poseCorrect && !waitingForPose && isRunning) {
    console.log('🔥 PoseTimer: Pose lost, pausing');
    pauseTimer();
    setWaitingForPose(true);
    setPoseCorrectTime(null);
    setAudioAnnounced(false);
  } else if (!poseCorrect && !waitingForPose && !isRunning && !completed) {
    console.log('🔥 PoseTimer: Pose lost before start');
    setWaitingForPose(true);
    setPoseCorrectTime(null);
    setAudioAnnounced(false);
  }
}, [isPoseCorrect, isActive, waitingForPose, isRunning, completed]);
  // Listen for audio announcement to start timer
  useEffect(() => {
    // When audio announces the correct pose, it calls onPoseCorrectAnnounced
    if (onPoseCorrectAnnounced && !waitingForPose && !isRunning && !completed && poseCorrectTime && !audioAnnounced) {
      console.log('🎯 PoseTimer: Audio announced correct pose, starting timer now');
      setAudioAnnounced(true);
      startTimer();
    }
  }, [onPoseCorrectAnnounced, waitingForPose, isRunning, completed, poseCorrectTime, audioAnnounced]);

  const speak = (text) => {
    if (!speechSynthRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthRef.current.speak(utterance);
  };

  const startTimer = () => {
  if (timerRef.current || completed) return;
  
  // Add a small delay to ensure audio is fully processed
  setTimeout(() => {
    if (!isPoseCorrect || completed) return;
    
    console.log('🎯 PoseTimer: Timer started!');
    setIsRunning(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }
        
        if (newTime === 5 && !warningPlayedRef.current) {
          setShowWarning(true);
          warningPlayedRef.current = true;
        }
        
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setCompleted(true);
          setIsRunning(false);
          if (onTimeComplete) {
            onTimeComplete();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  }, 500); // 500ms delay after audio finishes
};

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
      console.log('🎯 PoseTimer: Timer paused');
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const holdTime = pose?.timerSettings?.defaultHoldTime || 30;
    setTimeLeft(holdTime);
    setIsRunning(false);
    setCompleted(false);
    setShowWarning(false);
    setWaitingForPose(true);
    setPoseCorrectTime(null);
    setAudioAnnounced(false);
    warningPlayedRef.current = false;
    setHoldAchievements([]);
    console.log('🎯 PoseTimer: Timer reset');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((pose?.timerSettings?.defaultHoldTime || 30) - timeLeft) / (pose?.timerSettings?.defaultHoldTime || 30) * 100;

  const getTimerColor = () => {
    if (completed) return 'text-green-600';
    if (waitingForPose) return 'text-yellow-600';
    if (timeLeft <= 5) return 'text-red-600';
    if (timeLeft <= 10) return 'text-yellow-600';
    return 'text-blue-600';
  };

  // Get smart assessment info from feedback
  const isPoseGoodEnough = feedback?.isPoseGoodEnough || false;
  const wrongJointsCount = feedback?.wrongJointsCount || 0;
  const minorIssuesCount = feedback?.minorIssuesCount || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            waitingForPose ? 'bg-yellow-100' : 
            isRunning ? 'bg-blue-100' : 
            completed ? 'bg-green-100' : 
            !waitingForPose && !isRunning ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            {waitingForPose ? (
              <Target className="w-6 h-6 text-yellow-600" />
            ) : completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : !isRunning ? (
              <Loader className="w-6 h-6 text-purple-600 animate-pulse" />
            ) : (
              <Clock className={`w-6 h-6 ${getTimerColor()}`} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {waitingForPose ? 'Waiting for Correct Pose' : 
               completed ? 'Pose Completed!' : 
               !isRunning ? 'Preparing Timer...' :
               'Hold Pose Timer'}
            </h3>
            <p className="text-sm text-gray-600">
              {waitingForPose 
                ? waitingMessages[waitingMessageIndex]
                : completed 
                  ? '✅ Great job! You held the pose!' 
                  : !isRunning
                    ? '⏳ Listening for audio announcement...'
                    : 'Timer running - hold steady'}
            </p>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        {waitingForPose ? (
          <div className="py-4">
            <div className="animate-pulse flex justify-center mb-4">
              <Loader className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-lg text-gray-700 mb-2">
              Get into <span className="font-bold text-blue-600">{pose?.name}</span> position
            </p>
            
            {/* Smart assessment info while waiting */}
            {!waitingForPose && !isRunning && isPoseGoodEnough && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto mb-3">
                <p className="text-sm text-green-700">
                  ✓ Pose looks good! Only {wrongJointsCount} minor adjustment(s) needed.
                </p>
              </div>
            )}
            
            <div className={`rounded-lg p-3 max-w-md mx-auto ${
              isPoseGoodEnough ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <p className={`text-sm ${isPoseGoodEnough ? 'text-green-700' : 'text-yellow-700'}`}>
                {corrections && corrections.length > 0 
                  ? `🔄 ${corrections[0].message}`
                  : isPoseGoodEnough
                    ? '🎯 Almost there! Timer will start soon.'
                    : '🎯 Stand in the correct posture'}
              </p>
              {isPoseGoodEnough && !waitingForPose && !isRunning && (
                <p className="text-xs text-green-600 mt-2">
                  Waiting for audio announcement...
                </p>
              )}
            </div>
          </div>
        ) : completed ? (
          <div className="py-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-600">Pose Complete!</p>
            <p className="text-sm text-gray-600 mt-1">
              You held the pose for {pose?.timerSettings?.defaultHoldTime || 30} seconds
            </p>
          </div>
        ) : !isRunning ? (
          <div className="py-4">
            <div className="animate-pulse flex justify-center mb-4">
              <Loader className="w-12 h-12 text-purple-500" />
            </div>
            <p className="text-lg text-purple-700 mb-2">
              ✅ Correct pose achieved!
            </p>
            <p className="text-sm text-gray-600">
              Listening for audio announcement...
            </p>
            {isPoseGoodEnough && (
              <p className="text-xs text-green-600 mt-2">
                Pose quality: Good enough (only {wrongJointsCount} minor {wrongJointsCount === 1 ? 'issue' : 'issues'})
              </p>
            )}
          </div>
        ) : (
          <>
            <div className={`text-6xl font-bold mb-2 ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-500">
              Target: {pose?.timerSettings?.defaultHoldTime || 30} seconds
            </p>
            {/* Milestone achievements */}
            {holdAchievements.length > 0 && (
              <div className="flex justify-center gap-1 mt-2">
                {holdAchievements.map((ms, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 bg-green-500 rounded-full" title={`${ms}s milestone`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!waitingForPose && !completed && isRunning && (
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' :
              timeLeft <= 10 ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      {showWarning && !completed && isRunning && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-3 animate-pulse">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Almost there! Hold for {timeLeft} more seconds</p>
          </div>
        </div>
      )}

      {!waitingForPose && !completed && !isRunning && !audioAnnounced && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700 text-center">
            ⏳ Waiting for audio announcement before starting timer...
          </p>
        </div>
      )}

      {isRunning && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700 font-medium mb-2">Breathing Guide:</p>
          <div className="flex justify-between text-xs">
            <span className="text-indigo-600">Inhale (4s)</span>
            <span className="text-indigo-600">Hold (2s)</span>
            <span className="text-indigo-600">Exhale (4s)</span>
          </div>
          <div className="flex gap-1 mt-1">
            <div className="h-2 flex-1 bg-indigo-300 rounded-l-full animate-pulse" />
            <div className="h-2 w-6 bg-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-2 flex-1 bg-indigo-300 rounded-r-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      )}

      {/* Smart Assessment Summary */}
      {waitingForPose && isPoseGoodEnough && !waitingForPose && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg text-center">
          <p className="text-xs text-green-700">
            ✓ Pose assessment: Good enough! {wrongJointsCount === 1 ? '1 minor adjustment needed' : wrongJointsCount === 2 ? '2 minor adjustments needed' : 'Great form!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PoseTimer;