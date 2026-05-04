import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const PoseDetector = ({ 
  videoRef, 
  canvasRef, 
  onPoseDetected, 
  onPositionStatus,
  isActive,
  onStatusChange 
}) => {
  const detectorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastValidAnglesRef = useRef({});

  useEffect(() => {
    if (isActive) {
      initPoseDetection();
    } else {
      stopDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isActive]);

  const initPoseDetection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await tf.setBackend('webgl');
      await tf.ready();
      
      console.log('TensorFlow initialized');

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true,
        minPoseScore: 0.3
      };
      
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet, 
        detectorConfig
      );
      
      console.log('MoveNet detector created');
      setIsLoading(false);
      
      if (videoRef.current?.readyState >= 2) {
        startDetection();
      }
    } catch (err) {
      console.error('Failed to initialize:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.log('Waiting for video dimensions...');
      setTimeout(startDetection, 100);
      return;
    }

    const detect = async () => {
      try {
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          return;
        }

        const poses = await detectorRef.current.estimatePoses(videoRef.current, {
          maxPoses: 1,
          flipHorizontal: true
        });

        if (poses && poses.length > 0) {
          const pose = poses[0];
          
          const validKeypoints = pose.keypoints.filter(k => k.score > 0.3);
          const avgConfidence = validKeypoints.length > 0 
            ? validKeypoints.reduce((sum, k) => sum + (k.score || 0), 0) / validKeypoints.length * 100
            : 0;
          
          const positionStatus = calculatePersonPosition(pose.keypoints, videoRef.current.videoWidth, videoRef.current.videoHeight);
          
          if (onPositionStatus) {
            onPositionStatus(positionStatus);
          }
          
          if (onStatusChange) {
            onStatusChange({
              isDetecting: validKeypoints.length >= 5,
              jointCount: validKeypoints.length,
              confidence: Math.round(avgConfidence),
              positionStatus: positionStatus
            });
          }
          
          drawPose(pose, positionStatus);
          
          const angles = calculateJointAngles(pose.keypoints);
          
          if (Object.keys(angles).length >= 4) {
            lastValidAnglesRef.current = angles;
            if (onPoseDetected) {
              onPoseDetected(angles);
            }
          } else if (Object.keys(lastValidAnglesRef.current).length > 0) {
            if (onPoseDetected) {
              onPoseDetected(lastValidAnglesRef.current);
            }
          }
        } else {
          if (onPositionStatus) {
            onPositionStatus({
              personDetected: false,
              message: "No person detected. Please stand in front of camera.",
              instruction: "stand_in_front"
            });
          }
          if (onStatusChange) {
            onStatusChange({
              isDetecting: false,
              jointCount: 0,
              confidence: 0
            });
          }
          clearCanvas();
        }
      } catch (err) {
        console.error('Detection error:', err);
      }

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(detect);
      }
    };

    detect();
  };

  const calculatePersonPosition = (keypoints, videoWidth, videoHeight) => {
    const head = keypoints.find(k => k.name?.toLowerCase().includes('nose') || k.name?.toLowerCase().includes('head'));
    const leftAnkle = keypoints.find(k => k.name?.toLowerCase().includes('left_ankle'));
    const rightAnkle = keypoints.find(k => k.name?.toLowerCase().includes('right_ankle'));
    const leftWrist = keypoints.find(k => k.name?.toLowerCase().includes('left_wrist'));
    const rightWrist = keypoints.find(k => k.name?.toLowerCase().includes('right_wrist'));
    
    if (!head) {
      return {
        personDetected: false,
        message: "Cannot detect your position. Please stand clearly in frame.",
        instruction: "stand_in_front"
      };
    }
    
    let feetY = 0;
    if (leftAnkle && rightAnkle) {
      feetY = Math.max(leftAnkle.y, rightAnkle.y);
    } else if (leftAnkle) {
      feetY = leftAnkle.y;
    } else if (rightAnkle) {
      feetY = rightAnkle.y;
    } else {
      feetY = head.y + 200;
    }
    
    const personHeightPx = feetY - head.y;
    const videoHeightPx = videoHeight;
    const heightPercentage = (personHeightPx / videoHeightPx) * 100;
    
    const leftShoulder = keypoints.find(k => k.name?.toLowerCase().includes('left_shoulder'));
    const rightShoulder = keypoints.find(k => k.name?.toLowerCase().includes('right_shoulder'));
    
    let centerX = videoWidth / 2;
    if (leftShoulder && rightShoulder) {
      centerX = (leftShoulder.x + rightShoulder.x) / 2;
    } else if (leftShoulder) {
      centerX = leftShoulder.x;
    } else if (rightShoulder) {
      centerX = rightShoulder.x;
    }
    
    const horizontalOffset = Math.abs(centerX - videoWidth / 2);
    
    // UPDATED: More forgiving centering thresholds
    const isCentered = horizontalOffset < videoWidth * 0.20;  
    const isTooFarLeft = centerX < videoWidth * 0.20;        
    const isTooFarRight = centerX > videoWidth * 0.80;       
    
    // UPDATED: More forgiving distance thresholds
    let distanceStatus = "good";
    let distanceMessage = "";
    let instruction = "";
    
    if (heightPercentage < 25) {  
      distanceStatus = "too_far";
      distanceMessage = "You are too far away. Please step closer.";
      instruction = "step_closer";
    } else if (heightPercentage > 80) {  
      distanceStatus = "too_close";
      distanceMessage = "You are too close. Please step back.";
      instruction = "step_back";
    } else if (heightPercentage >= 25 && heightPercentage <= 80) {
      distanceStatus = "good";
      distanceMessage = "";
      instruction = "good_position";
    }
    
    let centeringStatus = "good";
    let centeringMessage = "";
    
    if (isTooFarLeft) {
      centeringStatus = "left";
      centeringMessage = "Please move to your right to center yourself.";
      if (!distanceMessage) instruction = "center_yourself";
    } else if (isTooFarRight) {
      centeringStatus = "right";
      centeringMessage = "Please move to your left to center yourself.";
      if (!distanceMessage) instruction = "center_yourself";
    } else if (!isCentered) {
      centeringStatus = "off_center";
      centeringMessage = "Please center yourself in the frame.";
      if (!distanceMessage) instruction = "center_yourself";
    } else {
      centeringStatus = "centered";
      centeringMessage = "Good centering!";
    }
    
    const hasAnkles = leftAnkle && rightAnkle;
    const hasWrists = leftWrist && rightWrist;
    let bodyVisibility = "full";
    let visibilityMessage = "";
    
    if (!hasAnkles && !hasWrists) {
      bodyVisibility = "partial";
      visibilityMessage = "I can't see your full body. Please step back.";
      if (instruction === "good_position") instruction = "step_back_full_body";
    } else if (!hasAnkles) {
      bodyVisibility = "feet_hidden";
      visibilityMessage = "Your feet are not visible. Please step back.";
      if (instruction === "good_position") instruction = "step_back_feet";
    } else if (!hasWrists) {
      bodyVisibility = "hands_hidden";
      visibilityMessage = "Your hands are not visible. Please step back slightly.";
    }
    
    let finalMessage = "";
    if (distanceMessage) finalMessage = distanceMessage;
    else if (centeringMessage) finalMessage = centeringMessage;
    else if (visibilityMessage) finalMessage = visibilityMessage;
    else finalMessage = "Perfect position! You're ready to begin.";
    
    return {
      personDetected: true,
      distance: distanceStatus,
      centering: centeringStatus,
      bodyVisibility: bodyVisibility,
      heightPercentage: Math.round(heightPercentage),
      horizontalOffset: Math.round(horizontalOffset),
      isCentered: isCentered,
      message: finalMessage,
      instruction: instruction,
      distanceMessage: distanceMessage,
      centeringMessage: centeringMessage,
      visibilityMessage: visibilityMessage
    };
  };

  const stopDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const calculateJointAngles = (keypoints) => {
    const angles = {};

    const findPoint = (name) => {
      const point = keypoints.find(k =>
        k.name?.toLowerCase().includes(name.toLowerCase())
      );
      return point && point.score > 0.3 ? point : null;
    };

    const calculateAngle = (p1, p2, p3) => {
      if (!p1 || !p2 || !p3) return null;

      // Calculate vectors
      const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
      const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

      // Calculate dot product
      const dot = v1.x * v2.x + v1.y * v2.y;

      // Calculate magnitudes
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

      if (mag1 === 0 || mag2 === 0) return null;

      // Calculate angle in radians, convert to degrees
      let angle = Math.acos(Math.min(1, Math.max(-1, dot / (mag1 * mag2)))) * (180 / Math.PI);
      angle = Math.round(angle);

      return angle;
    };

    // Get all keypoints
    const leftShoulder = findPoint('left_shoulder');
    const rightShoulder = findPoint('right_shoulder');
    const leftElbow = findPoint('left_elbow');
    const rightElbow = findPoint('right_elbow');
    const leftWrist = findPoint('left_wrist');
    const rightWrist = findPoint('right_wrist');
    const leftHip = findPoint('left_hip');
    const rightHip = findPoint('right_hip');
    const leftKnee = findPoint('left_knee');
    const rightKnee = findPoint('right_knee');
    const leftAnkle = findPoint('left_ankle');
    const rightAnkle = findPoint('right_ankle');

    // Calculate ELBOW angles (arm straightness)
    if (leftShoulder && leftElbow && leftWrist) {
      angles.left_elbow = calculateAngle(leftShoulder, leftElbow, leftWrist);
    }
    if (rightShoulder && rightElbow && rightWrist) {
      angles.right_elbow = calculateAngle(rightShoulder, rightElbow, rightWrist);
    }

    // Calculate SHOULDER angles (arm position relative to body)
    if (leftElbow && leftShoulder && leftHip) {
      angles.left_shoulder = calculateAngle(leftElbow, leftShoulder, leftHip);
    }
    if (rightElbow && rightShoulder && rightHip) {
      angles.right_shoulder = calculateAngle(rightElbow, rightShoulder, rightHip);
    }

    // Calculate HIP angles (torso vs leg)
    if (leftShoulder && leftHip && leftKnee) {
      angles.left_hip = calculateAngle(leftShoulder, leftHip, leftKnee);
    }
    if (rightShoulder && rightHip && rightKnee) {
      angles.right_hip = calculateAngle(rightShoulder, rightHip, rightKnee);
    }

    // Calculate KNEE angles
    if (leftHip && leftKnee && leftAnkle) {
      angles.left_knee = calculateAngle(leftHip, leftKnee, leftAnkle);
    }
    if (rightHip && rightKnee && rightAnkle) {
      angles.right_knee = calculateAngle(rightHip, rightKnee, rightAnkle);
    }

    // Remove invalid angles
    Object.keys(angles).forEach(key => {
      if (angles[key] === null || isNaN(angles[key]) || angles[key] < 0 || angles[key] > 180) {
        delete angles[key];
      }
    });

    console.log('📐 CALCULATED ANGLES:', angles);

    return angles;
  };

const drawPose = (pose, idealAngles, corrections) => {
  if (!canvasRef.current || !videoRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const video = videoRef.current;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  const { keypoints } = pose;

  // Define connections
  const connections = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle']
  ];

  // Draw connections first
  connections.forEach(([start, end]) => {
    const p1 = keypoints.find(k => k.name?.toLowerCase().includes(start));
    const p2 = keypoints.find(k => k.name?.toLowerCase().includes(end));

    if (p1?.score > 0.3 && p2?.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  // Draw keypoints with color based on correctness
  keypoints.forEach(point => {
    if (point.score > 0.3) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      
      // 🔥 COLOR BASED ON CORRECTNESS
      let color = '#ffff00'; // Default yellow for low confidence
      
      // Check if this joint is wrong
      const jointName = point.name?.toLowerCase();
      const isWrong = corrections?.some(c => c.joint.includes(jointName));
      
      if (point.score > 0.7) {
        if (isWrong) {
          color = '#ff0000'; 
        } else {
          color = '#00ff00'; 
        }
      } else if (point.score > 0.5) {
        color = '#ffff00'; 
      } else {
        color = '#ff6600'; 
      }
      
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'black';
      ctx.fillText(point.name?.replace('_', ' ') || '', point.x + 8, point.y - 8);
      ctx.shadowBlur = 0;
    }
  });
  
  ctx.restore();
};

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90">
        <div className="text-center p-6">
          <p className="text-red-600 font-bold">Error: {error}</p>
          <button onClick={initPoseDetection} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p>Loading pose detection...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PoseDetector;