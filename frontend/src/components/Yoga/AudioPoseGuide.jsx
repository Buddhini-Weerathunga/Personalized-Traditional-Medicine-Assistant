// frontend/src/components/Yoga/AudioPoseGuide.jsx
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const AudioPoseGuide = ({ 
  pose, 
  corrections, 
  feedback, 
  isActive,
  onAudioToggle,
  isAudioEnabled 
}) => {
  const [spokenInstructions, setSpokenInstructions] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [poseAchieved, setPoseAchieved] = useState(false);
  const [poseAchievedTime, setPoseAchievedTime] = useState(null);
  const speechSynthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak function with different voice types
  const speak = (text, type = 'instruction') => {
    if (!isAudioEnabled || !speechSynthRef.current) return;

    // Cancel previous speech
    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Adjust voice based on message type
    const voices = speechSynthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google UK') || voice.name.includes('Samantha')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Different pacing for different message types
    switch(type) {
      case 'correction':
        utterance.rate = 0.9; // Slower for corrections
        utterance.pitch = 1.0;
        break;
      case 'encouragement':
        utterance.rate = 1.0; // Normal for encouragement
        utterance.pitch = 1.1; // Slightly higher pitch for positivity
        break;
      case 'achievement':
        utterance.rate = 0.95; // Slightly slower for achievements
        utterance.pitch = 1.0;
        break;
      default:
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
    }

    speechSynthRef.current.speak(utterance);
  };

  // Monitor pose and provide directional feedback
  useEffect(() => {
    if (!isActive || !corrections || corrections.length === 0) return;

    const now = Date.now();
    
    // Check if pose is correct
    if (feedback?.postureAccuracy > 85) {
      if (!poseAchieved) {
        setPoseAchieved(true);
        setPoseAchievedTime(now);
        speak(`Perfect! You've got the correct ${pose?.name} pose! Hold it and breathe deeply.`, 'achievement');
      } else if (poseAchievedTime && now - poseAchievedTime > 10000) {
        // Every 10 seconds while holding correct pose
        const encouragements = [
          "Excellent form! Keep breathing.",
          "You're doing great! Hold steady.",
          "Perfect alignment! Feel the stretch.",
          "Beautiful pose! Keep your focus."
        ];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        speak(randomEncouragement, 'encouragement');
        setPoseAchievedTime(now);
      }
    } else {
      setPoseAchieved(false);
      
      // Provide directional feedback for each correction
      corrections.forEach(correction => {
        const lastSpoken = spokenInstructions[correction.joint] || 0;
        
        if (now - lastSpoken > 8000) { // Don't repeat same correction within 8 seconds
          let directionMessage = '';
          
          // Create specific directional feedback based on joint
          switch(correction.joint) {
            case 'left_shoulder':
            case 'right_shoulder':
              directionMessage = correction.message.includes('Increase') 
                ? `Raise your ${correction.joint.replace('_', ' ')} up` 
                : `Lower your ${correction.joint.replace('_', ' ')} down`;
              break;
            case 'left_elbow':
            case 'right_elbow':
              directionMessage = correction.message.includes('Increase')
                ? `Straighten your ${correction.joint.replace('_', ' ')}`
                : `Bend your ${correction.joint.replace('_', ' ')} more`;
              break;
            case 'left_hip':
            case 'right_hip':
              directionMessage = correction.message.includes('Increase')
                ? `Move your ${correction.joint.replace('_', ' ')} forward`
                : `Move your ${correction.joint.replace('_', ' ')} back`;
              break;
            case 'left_knee':
            case 'right_knee':
              directionMessage = correction.message.includes('Increase')
                ? `Straighten your ${correction.joint.replace('_', ' ')}`
                : `Bend your ${correction.joint.replace('_', ' ')} more`;
              break;
            default:
              directionMessage = correction.message;
          }
          
          speak(directionMessage, 'correction');
          setSpokenInstructions(prev => ({
            ...prev,
            [correction.joint]: now
          }));
        }
      });
    }
  }, [corrections, feedback, isActive, poseAchieved]);

  // Initial pose instructions when starting
  useEffect(() => {
    if (isActive && pose && !spokenInstructions['welcome']) {
      setTimeout(() => {
        speak(`Let's practice ${pose.name}. ${pose.instructions?.[0] || 'Follow the guide.'}`, 'instruction');
        setSpokenInstructions(prev => ({ ...prev, welcome: Date.now() }));
        
        // Give step-by-step instructions every 5 seconds until pose is achieved
        const instructionInterval = setInterval(() => {
          if (!poseAchieved && isActive) {
            setCurrentStep(prev => {
              const nextStep = (prev + 1) % (pose.instructions?.length || 1);
              if (pose.instructions?.[nextStep]) {
                speak(pose.instructions[nextStep], 'instruction');
              }
              return nextStep;
            });
          }
        }, 8000);

        return () => clearInterval(instructionInterval);
      }, 2000);
    }
  }, [isActive, pose]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isAudioEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {isAudioEnabled ? (
              <Volume2 className={`w-6 h-6 ${isActive ? 'text-blue-600 animate-pulse' : 'text-blue-600'}`} />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Audio Pose Guide</h3>
            <p className="text-sm text-gray-600">
              {isAudioEnabled 
                ? poseAchieved 
                  ? '🎉 Perfect pose! Hold it.' 
                  : corrections.length > 0 
                    ? '🎯 Listen for corrections' 
                    : '🔊 Waiting for pose...'
                : '🔇 Audio muted'}
            </p>
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
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Pose Achievement Status */}
      {poseAchieved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-bold text-green-800 text-lg">Perfect Pose! 🎉</p>
              <p className="text-sm text-green-700">You've achieved the correct alignment. Keep holding!</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Instruction */}
      {isActive && !poseAchieved && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2 flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            Current focus:
          </p>
          <p className="font-medium text-blue-900">
            {corrections.length > 0 
              ? corrections[0].message 
              : pose?.instructions?.[currentStep] || 'Stand in position'}
          </p>
        </div>
      )}

      {/* Quick Reference Guide */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-medium text-gray-700">Posture:</span>
          <span className={`ml-2 ${feedback?.postureAccuracy > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
            {feedback?.postureAccuracy || 0}%
          </span>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-medium text-gray-700">Corrections:</span>
          <span className="ml-2 text-blue-600">{corrections.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPoseGuide;