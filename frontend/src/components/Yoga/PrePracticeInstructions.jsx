import React, { useState, useEffect } from 'react';
import { Play, Camera, Target, AlertCircle, CheckCircle } from 'lucide-react';

const PrePracticeInstructions = ({ pose, onStart, onCameraReady }) => {
  const [step, setStep] = useState(1);
  const [cameraChecked, setCameraChecked] = useState(false);
  const [poseChecked, setPoseChecked] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const totalSteps = 4;

  const steps = [
    {
      title: "Camera Setup",
      icon: <Camera className="w-6 h-6" />,
      instructions: [
        "Position yourself 6-8 feet away from camera",
        "Ensure full body is visible (head to toe)",
        "Stand in a well-lit area",
        "Remove any obstacles in front of camera"
      ],
      action: () => {
        setCameraChecked(true);
        setStep(2);
        if (onCameraReady) onCameraReady();
      }
    },
    {
      title: "Understand the Pose",
      icon: <Target className="w-6 h-6" />,
      instructions: [
        `Study the ${pose?.name} pose reference above`,
        "Note the key alignment points (red dots)",
        "Understand where each body part should be",
        "Review the common mistakes to avoid"
      ],
      action: () => {
        setPoseChecked(true);
        setStep(3);
      }
    },
    {
      title: "Get Ready",
      icon: <AlertCircle className="w-6 h-6" />,
      instructions: [
        "Stand in starting position",
        "Take 3 deep breaths to center yourself",
        "I will guide you into correct alignment",
        "Listen for audio instructions"
      ],
      action: () => {
        setStep(4);
      }
    },
    {
      title: "Starting Countdown",
      icon: <Play className="w-6 h-6" />,
      instructions: [],
      action: null
    }
  ];

  // Countdown effect
  useEffect(() => {
    if (step === 4 && countdown === null) {
      setCountdown(3);
    }
    
    if (step === 4 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (step === 4 && countdown === 0) {
      onStart();
    }
  }, [step, countdown, onStart]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Prepare for {pose?.name}
      </h2>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={idx} className="flex-1 text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              step > idx + 1 ? 'bg-green-500 text-white' :
              step === idx + 1 ? 'bg-blue-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step > idx + 1 ? <CheckCircle className="w-5 h-5" /> : idx + 1}
            </div>
            <p className="text-xs mt-2 text-gray-600">{s.title}</p>
          </div>
        ))}
      </div>
      
      {/* Current Step Content */}
      {step !== 4 ? (
        <div className="text-center">
          <div className="flex justify-center mb-4 text-blue-600">
            {steps[step - 1].icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {steps[step - 1].title}
          </h3>
          <ul className="space-y-2 mb-6 text-left max-w-md mx-auto">
            {steps[step - 1].instructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                {instruction}
              </li>
            ))}
          </ul>
          <button
            onClick={steps[step - 1].action}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
          >
            {step === 1 && !cameraChecked ? "Check Camera & Continue" :
             step === 2 && !poseChecked ? "I Understand the Pose" :
             "Continue"}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-8xl font-bold text-blue-600 mb-4 animate-pulse">
            {countdown}
          </div>
          <p className="text-gray-600">Get into position...</p>
          <p className="text-sm text-gray-400 mt-2">Listen for audio guidance</p>
        </div>
      )}
    </div>
  );
};

export default PrePracticeInstructions;