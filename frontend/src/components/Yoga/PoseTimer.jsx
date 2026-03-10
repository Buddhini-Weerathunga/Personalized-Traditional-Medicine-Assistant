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
  onPoseCorrectAnnounced // New prop to know when audio has announced
}) => {
  const [timeLeft, setTimeLeft] = useState(pose?.timerSettings?.defaultHoldTime || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [waitingForPose, setWaitingForPose] = useState(true);
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const [poseCorrectTime, setPoseCorrectTime] = useState(null);
  
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
      warningPlayedRef.current = false;
      setWaitingMessageIndex(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [pose, reset]);

  // Monitor pose correctness - UPDATED
  useEffect(() => {
    if (!isActive || completed) return;

    const isCorrect = isPoseCorrect;
    
    if (isCorrect && waitingForPose) {
      // Pose just became correct - record the time but DON'T start timer yet
      setPoseCorrectTime(Date.now());
      setWaitingForPose(false);
      // Don't start timer yet - wait for audio announcement
      console.log('Pose correct, waiting for audio announcement...');
      
    } else if (!isCorrect && !waitingForPose && isRunning) {
      // Pose became incorrect during hold - pause timer
      pauseTimer();
      setWaitingForPose(true);
      setPoseCorrectTime(null);
      
    } else if (!isCorrect && !waitingForPose && !isRunning) {
      // Pose became incorrect before timer started
      setWaitingForPose(true);
      setPoseCorrectTime(null);
    }
  }, [isPoseCorrect, isActive, waitingForPose, isRunning, completed]);

  // Listen for audio announcement to start timer
  useEffect(() => {
    // When audio announces the correct pose, it calls onPoseCorrectAnnounced
    // This effect listens for that and starts the timer
    if (onPoseCorrectAnnounced && !waitingForPose && !isRunning && !completed && poseCorrectTime) {
      console.log('Audio announced correct pose, starting timer now');
      startTimer();
    }
  }, [onPoseCorrectAnnounced, waitingForPose, isRunning, completed, poseCorrectTime]);

  const speak = (text) => {
    if (!speechSynthRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthRef.current.speak(utterance);
  };

  const startTimer = () => {
  if (timerRef.current || completed) return;
  
  console.log('Timer started!');
  setIsRunning(true);
  
  // Clear any existing interval
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
        // Don't speak here - let AudioFeedbackController handle it
        warningPlayedRef.current = true;
      }
      
      if (newTime <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setCompleted(true);
        setIsRunning(false);
        // Don't speak here - let AudioFeedbackController handle it
        if (onTimeComplete) {
          onTimeComplete();
        }
        return 0;
      }
      
      return newTime;
    });
  }, 1000);
};

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
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
    warningPlayedRef.current = false;
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
                  ? '✅ Great job!' 
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-sm text-yellow-700">
                {corrections && corrections.length > 0 
                  ? `🔄 ${corrections[0].message}`
                  : '🎯 Stand in the correct posture'}
              </p>
            </div>
          </div>
        ) : completed ? (
          <div className="py-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-600">Pose Complete!</p>
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
          </div>
        ) : (
          <>
            <div className={`text-6xl font-bold mb-2 ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-500">
              Target: {pose?.timerSettings?.defaultHoldTime || 30} seconds
            </p>
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

      {!waitingForPose && !completed && !isRunning && (
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
            <span className="text-indigo-600">Inhale</span>
            <span className="text-indigo-600">Hold</span>
            <span className="text-indigo-600">Exhale</span>
          </div>
          <div className="flex gap-1 mt-1">
            <div className="h-2 flex-1 bg-indigo-300 rounded-l-full animate-pulse" />
            <div className="h-2 w-4 bg-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-2 flex-1 bg-indigo-300 rounded-r-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseTimer;