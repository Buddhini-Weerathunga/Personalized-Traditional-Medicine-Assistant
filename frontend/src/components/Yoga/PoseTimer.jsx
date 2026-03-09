import { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle, Volume2, CheckCircle, Target, Loader } from 'lucide-react';

const PoseTimer = ({ 
  pose, 
  isActive, 
  onTimeComplete,
  onTimeUpdate,
  reset,
  isPoseCorrect,
  corrections
}) => {
  const [timeLeft, setTimeLeft] = useState(pose?.timerSettings?.defaultHoldTime || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [waitingForPose, setWaitingForPose] = useState(true);
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  
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

  // Reset timer when pose changes or reset flag - MOVED TO USEFFECT
  useEffect(() => {
    if (pose) {
      const holdTime = pose.timerSettings?.defaultHoldTime || 30;
      setTimeLeft(holdTime);
      setIsRunning(false);
      setCompleted(false);
      setShowWarning(false);
      setWaitingForPose(true);
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

  const isCorrect = isPoseCorrect; // This now just checks if accuracy >= 80%
  
  if (isCorrect && waitingForPose) {
    setWaitingForPose(false);
    startTimer();
    speak("Perfect! Hold the pose. Timer started.");
  } else if (!isCorrect && !waitingForPose && isRunning) {
    pauseTimer();
    setWaitingForPose(true);
    speak("Posture lost. Please correct your pose to resume timer.");
  }
}, [isPoseCorrect, isActive, waitingForPose, isRunning, completed]);

  // Rotate waiting messages - MOVED TO USEFFECT
  useEffect(() => {
    if (waitingForPose && isActive && !completed) {
      const interval = setInterval(() => {
        setWaitingMessageIndex(prev => (prev + 1) % waitingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [waitingForPose, isActive, completed]);

  const speak = (text) => {
    if (!speechSynthRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthRef.current.speak(utterance);
  };

  const startTimer = () => {
    if (timerRef.current || completed) return;
    
    setIsRunning(true);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }
        
        if (newTime === 5 && !warningPlayedRef.current) {
          setShowWarning(true);
          speak("5 seconds remaining");
          warningPlayedRef.current = true;
        }
        
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setCompleted(true);
          setIsRunning(false);
          speak("Perfect! Release the pose. Great job!");
          
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
    warningPlayedRef.current = false;
  };

  const addTime = (seconds) => {
    setTimeLeft(prev => Math.min(prev + seconds, pose?.timerSettings?.maxHoldTime || 60));
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
            completed ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {waitingForPose ? (
              <Target className="w-6 h-6 text-yellow-600" />
            ) : completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Clock className={`w-6 h-6 ${getTimerColor()}`} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {waitingForPose ? 'Waiting for Correct Pose' : 
               completed ? 'Pose Completed!' : 
               'Hold Pose Timer'}
            </h3>
            <p className="text-sm text-gray-600">
              {waitingForPose 
                ? waitingMessages[waitingMessageIndex]
                : completed 
                  ? '✅ Great job!' 
                  : isRunning 
                    ? 'Timer running - hold steady' 
                    : 'Timer paused'}
            </p>
          </div>
        </div>
        
        {!waitingForPose && !completed && (
          <div className="flex gap-2">
            <button
              onClick={resetTimer}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => addTime(10)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
            >
              +10s
            </button>
          </div>
        )}
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
                  : '🎯 Stand in the correct posture to start the timer'}
              </p>
            </div>
          </div>
        ) : completed ? (
          <div className="py-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-600">Pose Complete!</p>
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

      {!waitingForPose && !completed && (
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

      {showWarning && !completed && !waitingForPose && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-3 animate-pulse">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Almost there! Hold for {timeLeft} more seconds</p>
          </div>
        </div>
      )}

      {isRunning && !waitingForPose && !completed && (
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