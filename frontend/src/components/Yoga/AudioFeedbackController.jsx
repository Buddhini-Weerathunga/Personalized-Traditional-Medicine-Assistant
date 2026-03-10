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
  isTimerRunning
}) => {
  const [lastSpokenTime, setLastSpokenTime] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAccuracy, setLastAccuracy] = useState(0);
  const [correctPoseAnnounced, setCorrectPoseAnnounced] = useState(false);
  const speechSynthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text, priority = 'normal') => {
    if (!speechSynthRef.current || !isAudioEnabled) return;

    if (priority === 'high') {
      speechSynthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = speechSynthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google UK') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Female')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

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
      }, 2000);
    }
  }, [isPracticing, poseName]);

  // Monitor accuracy and announce when pose becomes correct (≥80%)
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !feedback) return;
    
    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    // Check if accuracy just crossed the 80% threshold
    if (currentAccuracy >= 80 && lastAccuracy < 80 && !correctPoseAnnounced) {
      // Pose just became correct!
      const messages = [
        `Perfect! You've got the correct ${poseName} pose. Hold it steady.`,
        `Excellent form! Your pose is correct. Keep breathing.`,
        `Great alignment! You've achieved ${currentAccuracy}% accuracy. Hold the pose.`,
        `Beautiful! Correct pose achieved. Now hold for the timer.`
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      speak(randomMessage, 'high');
      setCorrectPoseAnnounced(true);
      
      // Also announce timer start if timer is running
      if (isTimerRunning) {
        setTimeout(() => {
          speak(`Timer started. Hold for ${timeLeft} seconds.`, 'normal');
        }, 2000);
      }
    }
    
    // If accuracy drops below 80% after being correct, reset announcement flag
    if (currentAccuracy < 80 && lastAccuracy >= 80) {
      setCorrectPoseAnnounced(false);
      speak("Posture needs adjustment. Please correct your form.", 'high');
    }
    
    setLastAccuracy(currentAccuracy);
  }, [feedback, isPracticing, isAudioEnabled, poseName, correctPoseAnnounced, isTimerRunning, timeLeft]);

  // Timer countdown announcements
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !isTimerRunning) return;

    // Only announce timer if pose is correct (accuracy ≥80%)
    if ((feedback?.postureAccuracy || 0) >= 80) {
      // Announce at 30, 20, 10, 5 seconds
      if (timeLeft === 30 && !lastSpokenTime['30s']) {
        speak("30 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '30s': Date.now() }));
      }
      if (timeLeft === 20 && !lastSpokenTime['20s']) {
        speak("20 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '20s': Date.now() }));
      }
      if (timeLeft === 10 && !lastSpokenTime['10s']) {
        speak("10 seconds remaining");
        setLastSpokenTime(prev => ({ ...prev, '10s': Date.now() }));
      }
      if (timeLeft === 5 && !lastSpokenTime['5s']) {
        speak("5 seconds left, hold steady");
        setLastSpokenTime(prev => ({ ...prev, '5s': Date.now() }));
      }
    }
  }, [timeLeft, isPracticing, isAudioEnabled, isTimerRunning, feedback]);

  // Handle corrections - only speak if accuracy is below 80%
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !corrections || corrections.length === 0) return;
    
    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    // Only give correction audio if pose is not correct (accuracy < 80%)
    if (currentAccuracy < 80) {
      const now = Date.now();
      
      corrections.forEach((correction) => {
        const lastSpoken = lastSpokenTime[correction.joint] || 0;
        
        if (now - lastSpoken > 8000) {
          // Add timer context to corrections
          let message = correction.message;
          if (timeLeft <= 10 && isTimerRunning) {
            message = `${correction.message}, ${timeLeft} seconds left`;
          }
          
          speak(message, 'high');
          setLastSpokenTime(prev => ({ ...prev, [correction.joint]: now }));
        }
      });
    }
  }, [corrections, isPracticing, isAudioEnabled, timeLeft, feedback]);

  // Give encouragement when holding correct pose
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !feedback) return;

    const currentAccuracy = feedback?.postureAccuracy || 0;
    
    // Only give encouragement if pose is correct and timer is running
    if (currentAccuracy >= 80 && isTimerRunning) {
      const now = Date.now();
      const lastEncouragement = lastSpokenTime['encouragement'] || 0;
      
      if (now - lastEncouragement > 15000) { // Every 15 seconds
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
  }, [feedback, isPracticing, isAudioEnabled, timeLeft, isTimerRunning]);

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
              <span>•</span>
              <span>
                {corrections.length > 0 && (feedback?.postureAccuracy || 0) < 80
                  ? `${corrections.length} correction${corrections.length > 1 ? 's' : ''}` 
                  : (feedback?.postureAccuracy || 0) >= 80 
                    ? 'Perfect form!' 
                    : 'Analyzing...'}
              </span>
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
          {isTimerRunning && (
            <p className="text-xs text-green-600 mt-1">Timer running - hold for {timeLeft} more seconds</p>
          )}
        </div>
      )}

      {/* Current instruction being spoken - only show if pose is not correct */}
      {isSpeaking && corrections.length > 0 && (feedback?.postureAccuracy || 0) < 80 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 animate-pulse border border-blue-200">
          <span className="font-medium">🔊 Now speaking:</span> {corrections[0].message}
        </div>
      )}

      {/* Timer warning - only if pose is correct */}
      {timeLeft <= 5 && timeLeft > 0 && isTimerRunning && (feedback?.postureAccuracy || 0) >= 80 && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg text-sm text-red-700 animate-pulse border border-red-200">
          ⏰ {timeLeft} seconds remaining! Hold steady.
        </div>
      )}
    </div>
  );
};

export default AudioFeedbackController;