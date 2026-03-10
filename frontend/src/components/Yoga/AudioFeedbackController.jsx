import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, CheckCircle } from 'lucide-react';

const AudioFeedbackController = ({ 
  corrections, 
  feedback, 
  poseName,
  isPracticing,
  onAudioToggle,
  isAudioEnabled,
  timeLeft,
  isTimerRunning,
  onPoseCorrectAnnounced
}) => {
  const [lastSpokenTime, setLastSpokenTime] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAccuracy, setLastAccuracy] = useState(0);
  const [correctPoseAnnounced, setCorrectPoseAnnounced] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const speechSynthRef = useRef(null);
  const pendingCorrectionsRef = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // Stop all audio when isPracticing becomes false
  useEffect(() => {
    if (!isPracticing && speechSynthRef.current) {
      console.log('Session ended, stopping all audio');
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      setIsTransitioning(false);
      setLastSpokenTime({});
      setCorrectPoseAnnounced(false);
    }
  }, [isPracticing]);

  const speak = (text, priority = 'normal', callback) => {
    if (!speechSynthRef.current || !isAudioEnabled || !isPracticing) return;

    if (priority === 'high') {
      speechSynthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = speechSynthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google UK Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female') ||
      (voice.name.includes('Google') && voice.name.includes('Female')) ||
      voice.name.includes('Microsoft Zira') ||
      voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Samantha')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (callback && isPracticing) {
        callback();
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (callback && isPracticing) {
        callback();
      }
    };

    speechSynthRef.current.speak(utterance);
    console.log(`Speaking: ${text}`);
  };

  // Welcome message when starting
  useEffect(() => {
    if (isPracticing && poseName && !lastSpokenTime['welcome']) {
      setTimeout(() => {
        speak(`Starting ${poseName}. I'll guide you with audio feedback.`, 'high');
        setLastSpokenTime(prev => ({ ...prev, welcome: Date.now() }));
        setCorrectPoseAnnounced(false);
        setIsTransitioning(false);
      }, 2000);
    }
  }, [isPracticing, poseName]);

  // Monitor accuracy and announce when pose becomes correct (≥80%)
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !feedback) return;
    
    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    // When pose becomes correct
    if (currentAccuracy >= 80 && lastAccuracy < 80 && !correctPoseAnnounced && !isTransitioning) {
      setIsTransitioning(true);
      
      // Cancel any pending correction audio
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      
      // Clear any pending corrections
      pendingCorrectionsRef.current = [];
      
      // Small delay to ensure corrections are stopped
      setTimeout(() => {
        const messages = [
          `Perfect! You've got the correct ${poseName} pose.`,
          `Excellent form! Your pose is correct.`,
          `Great alignment! You've achieved ${currentAccuracy}% accuracy.`,
          `Beautiful! Correct pose achieved.`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        speak(randomMessage, 'high', () => {
          console.log('✅ Correct pose announcement complete, notifying timer');
          setIsTransitioning(false);
          if (onPoseCorrectAnnounced && isPracticing) {
            // Add a small delay before starting timer to ensure smooth transition
            setTimeout(() => {
              onPoseCorrectAnnounced();
            }, 500);
          }
        });
        
        setCorrectPoseAnnounced(true);
      }, 300); // Small delay to ensure corrections are cleared
    }
    
    // When pose becomes incorrect
    if (currentAccuracy < 80 && lastAccuracy >= 80) {
      setCorrectPoseAnnounced(false);
      setIsTransitioning(false);
      
      // Cancel any ongoing timer announcements
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      
      // Give feedback about correction needed
      setTimeout(() => {
        speak("Posture needs adjustment. Please correct your form.", 'high');
      }, 200);
    }
    
    setLastAccuracy(currentAccuracy);
  }, [feedback, isPracticing, isAudioEnabled, poseName, correctPoseAnnounced]);

  // Timer countdown announcements - only when not transitioning
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !isTimerRunning || isTransitioning) return;

    if ((feedback?.postureAccuracy || 0) >= 80) {
      const now = Date.now();
      
      // Regular countdown announcements
      if (timeLeft === 30 && !lastSpokenTime['30s']) {
        speak("30 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '30s': now }));
      }
      else if (timeLeft === 20 && !lastSpokenTime['20s']) {
        speak("20 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '20s': now }));
      }
      else if (timeLeft === 15 && !lastSpokenTime['15s']) {
        speak("15 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '15s': now }));
      }
      else if (timeLeft === 10 && !lastSpokenTime['10s']) {
        speak("10 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '10s': now }));
      }
      else if (timeLeft === 5 && !lastSpokenTime['5s']) {
        speak("5 seconds left, hold steady");
        setLastSpokenTime(prev => ({ ...prev, '5s': now }));
      }
      else if (timeLeft === 8 && !lastSpokenTime['8s']) {
        speak("8 seconds");
        setLastSpokenTime(prev => ({ ...prev, '8s': now }));
      }
      else if (timeLeft === 6 && !lastSpokenTime['6s']) {
        speak("6 seconds");
        setLastSpokenTime(prev => ({ ...prev, '6s': now }));
      }
      else if (timeLeft === 4 && !lastSpokenTime['4s']) {
        speak("4 seconds");
        setLastSpokenTime(prev => ({ ...prev, '4s': now }));
      }
      else if (timeLeft === 3 && !lastSpokenTime['3s']) {
        speak("3");
        setLastSpokenTime(prev => ({ ...prev, '3s': now }));
      }
      else if (timeLeft === 2 && !lastSpokenTime['2s']) {
        speak("2");
        setLastSpokenTime(prev => ({ ...prev, '2s': now }));
      }
      else if (timeLeft === 1 && !lastSpokenTime['1s']) {
        speak("1");
        setLastSpokenTime(prev => ({ ...prev, '1s': now }));
      }
      
      // Additional reminder every 10 seconds for longer holds
      if (timeLeft > 30 && timeLeft % 10 === 0 && !lastSpokenTime[`${timeLeft}s`]) {
        speak(`${timeLeft} seconds remaining`);
        setLastSpokenTime(prev => ({ ...prev, [`${timeLeft}s`]: now }));
      }
    }
  }, [timeLeft, isPracticing, isAudioEnabled, isTimerRunning, feedback, isTransitioning]);

  // Handle corrections - only if not transitioning and accuracy below 80%
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !corrections || corrections.length === 0 || isTransitioning) return;
    
    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    if (currentAccuracy < 80) {
      const now = Date.now();
      
      corrections.forEach((correction) => {
        const lastSpoken = lastSpokenTime[correction.joint] || 0;
        
        if (now - lastSpoken > 8000) {
          speak(correction.message, 'high');
          setLastSpokenTime(prev => ({ ...prev, [correction.joint]: now }));
        }
      });
    }
  }, [corrections, isPracticing, isAudioEnabled, feedback, isTransitioning]);

  // Give encouragement - only when timer is running and not transitioning
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !feedback || isTransitioning) return;

    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    if (currentAccuracy >= 80 && isTimerRunning) {
      const now = Date.now();
      const lastEncouragement = lastSpokenTime['encouragement'] || 0;
      
      if (now - lastEncouragement > 10000) {
        const messages = [
          `Perfect form! ${timeLeft} seconds left. Keep breathing.`,
          `Excellent alignment! You're doing great.`,
          `Hold steady. ${timeLeft} seconds remaining.`,
          `Beautiful pose! Stay focused on your breath.`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        speak(randomMessage, 'normal');
        setLastSpokenTime(prev => ({ ...prev, encouragement: now }));
      }
    }
  }, [feedback, isPracticing, isAudioEnabled, timeLeft, isTimerRunning, isTransitioning]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isAudioEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {isSpeaking ? (
              <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
            ) : isAudioEnabled ? (
              <Volume2 className="w-5 h-5 text-blue-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {isSpeaking ? 'Speaking...' : isAudioEnabled ? 'Audio Active' : 'Audio Muted'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`font-medium ${(feedback?.postureAccuracy || 0) >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {(feedback?.postureAccuracy || 0) >= 80 ? '✅ Correct Pose' : '⏳ Adjusting'}
              </span>
              <span>•</span>
              <span>{timeLeft}s</span>
              {isTransitioning && (
                <span className="text-purple-600">• Transitioning...</span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={onAudioToggle}
          className={`p-2 rounded-full transition ${
            isAudioEnabled 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Success message when pose is correct */}
      {(feedback?.postureAccuracy || 0) >= 80 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">✓ Correct Pose! Accuracy: {Math.round(feedback.postureAccuracy)}%</span>
          </div>
          {correctPoseAnnounced && !isTimerRunning && !isTransitioning && (
            <p className="text-xs text-purple-600 mt-1">⏳ Preparing to start timer...</p>
          )}
          {isTransitioning && (
            <p className="text-xs text-purple-600 mt-1">🔄 Switching to timer mode...</p>
          )}
          {isTimerRunning && (
            <p className="text-xs text-green-600 mt-1">Timer running - hold for {timeLeft} more seconds</p>
          )}
        </div>
      )}

      {/* Current instruction being spoken - only show if pose is not correct and not transitioning */}
      {isSpeaking && corrections.length > 0 && (feedback?.postureAccuracy || 0) < 80 && !isTransitioning && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 animate-pulse border border-blue-200">
          <span className="font-medium">🔊 Now speaking:</span> {corrections[0].message}
        </div>
      )}

      {/* Timer warning - only if pose is correct */}
      {timeLeft <= 5 && timeLeft > 0 && isTimerRunning && (feedback?.postureAccuracy || 0) >= 80 && !isTransitioning && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg text-sm text-red-700 animate-pulse border border-red-200">
          ⏰ {timeLeft} seconds remaining! Hold steady.
        </div>
      )}
    </div>
  );
};

export default AudioFeedbackController;