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
  onPoseCorrectAnnounced,
  detectionStatus,
  positionStatus,
  onTimerComplete
}) => {
  const [lastSpokenTime, setLastSpokenTime] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [correctPoseAnnounced, setCorrectPoseAnnounced] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [positionFixedAnnounced, setPositionFixedAnnounced] = useState(false);
  const [completionPlayed, setCompletionPlayed] = useState(false);
  const [waitingForAudioToFinish, setWaitingForAudioToFinish] = useState(false);
  const speechSynthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
      speechSynthRef.current.getVoices();
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
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      setIsTransitioning(false);
      setLastSpokenTime({});
      setCorrectPoseAnnounced(false);
      setPositionFixedAnnounced(false);
      setCompletionPlayed(false);
      setWaitingForAudioToFinish(false);
    }
  }, [isPracticing]);

  const speak = (text, priority = 'normal', callback) => {
    if (!speechSynthRef.current || !isAudioEnabled || !isPracticing) {
      console.log('🔇 Cannot speak - audio disabled or not practicing');
      if (callback) callback();
      return;
    }

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
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log(`🔊 Speaking: ${text}`);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log(`🔊 Finished: ${text}`);
      if (callback && isPracticing) {
        console.log('🔊 Audio finished, calling callback');
        callback();
      }
    };
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
      if (callback && isPracticing) {
        callback();
      }
    };

    speechSynthRef.current.speak(utterance);
  };

  // Welcome message when starting
  useEffect(() => {
    if (isPracticing && poseName && !lastSpokenTime['welcome']) {
      setTimeout(() => {
        speak(`Starting ${poseName}. Let me guide you into the correct position.`, 'high');
        setLastSpokenTime(prev => ({ ...prev, welcome: Date.now() }));
        setCorrectPoseAnnounced(false);
        setPositionFixedAnnounced(false);
        setIsTransitioning(false);
        setCompletionPlayed(false);
        setWaitingForAudioToFinish(false);
      }, 2000);
    }
  }, [isPracticing, poseName]);

  // ===== PRIORITY 1: POSITION GUIDANCE =====
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || isTimerRunning) return;
    
    const isPositionGood = positionStatus && 
      positionStatus.personDetected &&
      positionStatus.distance === 'good' &&
      positionStatus.centering === 'centered' &&
      positionStatus.bodyVisibility === 'full';

    if (isPositionGood && !positionFixedAnnounced && !isTransitioning) {
      setIsTransitioning(true);
      
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      
      setTimeout(() => {
        const messages = [
          "Perfect camera position! Now let's work on your pose alignment.",
          "Great! Your position is perfect. Now focus on your posture.",
          "Excellent camera view! Now I'll guide you into the correct pose."
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        speak(randomMessage, 'high', () => {
          setIsTransitioning(false);
          setPositionFixedAnnounced(true);
        });
      }, 300);
      return;
    }
    
    if (isPositionGood && positionFixedAnnounced) return;
    
    if (positionStatus && positionStatus.personDetected && !positionFixedAnnounced) {
      const now = Date.now();
      const lastPositionMessage = lastSpokenTime['positionMessage'] || 0;
      
      if (now - lastPositionMessage > 5000) {
        let message = '';
        
        if (positionStatus.distance === 'too_far') {
          message = "You are too far away. Please step closer to the camera.";
        } else if (positionStatus.distance === 'too_close') {
          message = "You are too close. Please step back so I can see your full body.";
        } else if (positionStatus.bodyVisibility === 'feet_hidden') {
          message = "Your feet are not visible. Please step back slightly.";
        } else if (positionStatus.bodyVisibility === 'hands_hidden') {
          message = "Your hands are not visible. Please step back slightly.";
        } else if (positionStatus.bodyVisibility === 'partial') {
          message = "I can't see your full body. Please step back.";
        } else if (positionStatus.centering === 'left') {
          message = "You are too far left. Please move to your right.";
        } else if (positionStatus.centering === 'right') {
          message = "You are too far right. Please move to your left.";
        } else if (positionStatus.centering === 'off_center') {
          message = "Please center yourself in the frame.";
        }
        
        if (message) {
          speak(message, 'high');
          setLastSpokenTime(prev => ({ ...prev, positionMessage: now }));
        }
      }
      return;
    }
    
    if (!isPositionGood && positionFixedAnnounced) {
      setPositionFixedAnnounced(false);
      setCorrectPoseAnnounced(false);
    }
    
  }, [positionStatus, isPracticing, isAudioEnabled, isTimerRunning, positionFixedAnnounced]);

  // ===== PRIORITY 2: GIVE CORRECTIONS WHEN POSE IS WRONG =====
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled) return;
    if (!positionFixedAnnounced) return;
    if (isTimerRunning) return;
    if (waitingForAudioToFinish) return; // Don't interrupt while waiting for timer start audio
    
    const wrongJointsCount = feedback?.wrongJointsCount ?? 99;
    const hasWrongJoints = wrongJointsCount > 0;
    
    // GIVE INSTRUCTIONS FOR WRONG JOINTS
    if (hasWrongJoints && !isTimerRunning && corrections.length > 0 && !correctPoseAnnounced) {
      const now = Date.now();
      const lastGuidance = lastSpokenTime['guidance'] || 0;
      
      if (now - lastGuidance > 4000) {
        const highSeverityCorrections = corrections.filter(c => c.severity === 'high');
        const correctionToSpeak = highSeverityCorrections.length > 0 
          ? highSeverityCorrections[0] 
          : corrections[0];
        
        console.log(`🎯 Speaking correction: ${correctionToSpeak.message}`);
        speak(correctionToSpeak.message, 'high');
        setLastSpokenTime(prev => ({ ...prev, guidance: now }));
      }
    }
    
    // When pose becomes perfect (0 wrong joints)
    if (!hasWrongJoints && !correctPoseAnnounced && !isTimerRunning && positionFixedAnnounced && !waitingForAudioToFinish) {
      console.log('🎯 Perfect pose! Announcing timer start...');
      setWaitingForAudioToFinish(true); // 🔥 Block further corrections until audio finishes
      setIsTransitioning(true);
      
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      
      setTimeout(() => {
        speak(`Perfect ${poseName}! Starting timer.`, 'high', () => {
          console.log('🎯 Timer start audio FINISHED! Now starting timer...');
          setIsTransitioning(false);
          setWaitingForAudioToFinish(false);
          // 🔥 ONLY NOW start the timer - after audio finishes
          if (onPoseCorrectAnnounced && isPracticing) {
            onPoseCorrectAnnounced();
          }
        });
        setCorrectPoseAnnounced(true);
      }, 300);
    }
    
    // Encouragement when close
    if (wrongJointsCount === 1 && !lastSpokenTime['close'] && !isTimerRunning && !correctPoseAnnounced && !waitingForAudioToFinish) {
      const now = Date.now();
      if (now - (lastSpokenTime['close'] || 0) > 8000) {
        speak("Almost perfect! Just one small adjustment.", 'normal');
        setLastSpokenTime(prev => ({ ...prev, close: now }));
      }
    }
    
  }, [feedback, corrections, isPracticing, isAudioEnabled, poseName, correctPoseAnnounced, isTimerRunning, positionFixedAnnounced, onPoseCorrectAnnounced, waitingForAudioToFinish]);

  // Timer countdown announcements
  useEffect(() => {
    if (!isPracticing || !isAudioEnabled || !isTimerRunning || isTransitioning) return;
    if (!correctPoseAnnounced) return;
    if (waitingForAudioToFinish) return;

    const now = Date.now();
    
    if (timeLeft === 30 && !lastSpokenTime['30s']) {
      speak("30 seconds remaining. Keep breathing.", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '30s': now }));
    }
    else if (timeLeft === 20 && !lastSpokenTime['20s']) {
      speak("20 seconds remaining. Stay focused.", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '20s': now }));
    }
    else if (timeLeft === 15 && !lastSpokenTime['15s']) {
      speak("15 seconds remaining", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '15s': now }));
    }
    else if (timeLeft === 10 && !lastSpokenTime['10s']) {
      speak("10 seconds remaining. Almost there!", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '10s': now }));
    }
    else if (timeLeft === 5 && !lastSpokenTime['5s']) {
      speak("5 seconds left! Hold steady.", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '5s': now }));
    }
    else if (timeLeft === 3 && !lastSpokenTime['3s']) {
      speak("3", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '3s': now }));
    }
    else if (timeLeft === 2 && !lastSpokenTime['2s']) {
      speak("2", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '2s': now }));
    }
    else if (timeLeft === 1 && !lastSpokenTime['1s']) {
      speak("1", 'normal');
      setLastSpokenTime(prev => ({ ...prev, '1s': now }));
    }
  }, [timeLeft, isPracticing, isAudioEnabled, isTimerRunning, isTransitioning, correctPoseAnnounced, waitingForAudioToFinish]);

  // Timer completion audio
  useEffect(() => {
    if (isTimerRunning && timeLeft === 0 && !completionPlayed && correctPoseAnnounced) {
      console.log('🎉 Timer completed! Playing completion audio...');
      setCompletionPlayed(true);
      setWaitingForAudioToFinish(true);
      
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      
      setTimeout(() => {
        speak(`Excellent work! You held ${poseName} for 30 seconds. Great job!`, 'high', () => {
          console.log('✅ Completion audio finished');
          setWaitingForAudioToFinish(false);
          if (onTimerComplete) {
            onTimerComplete();
          }
        });
      }, 100);
    }
  }, [isTimerRunning, timeLeft, completionPlayed, correctPoseAnnounced, poseName, onTimerComplete]);

  // Reset flags when new session starts
  useEffect(() => {
    if (isPracticing && !isTimerRunning && timeLeft > 0) {
      setCompletionPlayed(false);
      setWaitingForAudioToFinish(false);
    }
  }, [isPracticing, isTimerRunning, timeLeft]);

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
              <span className={`font-medium ${
                !positionFixedAnnounced ? 'text-purple-600' :
                correctPoseAnnounced && isTimerRunning ? 'text-green-600' :
                waitingForAudioToFinish ? 'text-orange-600' :
                (feedback?.wrongJointsCount ?? 99) === 0 ? 'text-green-500' : 'text-yellow-600'
              }`}>
                {!positionFixedAnnounced ? '📍 Positioning...' :
                 correctPoseAnnounced && isTimerRunning ? '⏱️ Timer Running' :
                 waitingForAudioToFinish ? '⏳ Waiting for audio...' :
                 (feedback?.wrongJointsCount ?? 99) === 0 ? '🎯 Perfect!' : 
                 '🎯 Adjusting Pose'}
              </span>
              <span>•</span>
              <span>{timeLeft}s</span>
              <span>•</span>
              <span>{detectionStatus?.jointCount || 0} joints</span>
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

      {/* Waiting for audio indicator */}
      {waitingForAudioToFinish && !isTimerRunning && correctPoseAnnounced && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 text-orange-700">
            <span>⏳</span>
            <span className="font-medium">Waiting for audio to finish before starting timer...</span>
          </div>
        </div>
      )}

      {/* Timer Status */}
      {correctPoseAnnounced && isTimerRunning && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">⏱️ Timer Running - {timeLeft}s remaining</span>
          </div>
        </div>
      )}

      {/* Current Instruction Being Spoken */}
      {isSpeaking && !isTimerRunning && corrections.length > 0 && !waitingForAudioToFinish && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 animate-pulse border border-blue-200">
          <span className="font-medium">🔊 Instruction:</span> {corrections[0].message}
        </div>
      )}

      {/* Perfect pose indicator */}
      {(feedback?.wrongJointsCount ?? 99) === 0 && !correctPoseAnnounced && positionFixedAnnounced && !waitingForAudioToFinish && (
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">✓ Perfect Pose! Timer starting soon...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioFeedbackController;