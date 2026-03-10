import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const PoseDetector = ({ 
  videoRef, 
  canvasRef, 
  onPoseDetected, 
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
      
      // Wait for video to be ready
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

    // Check if video has valid dimensions
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.log('Waiting for video dimensions...');
      setTimeout(startDetection, 100);
      return;
    }

    const detect = async () => {
      try {
        // Double-check video dimensions before processing
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          console.log('Video dimensions not ready yet');
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
          
          if (onStatusChange) {
            onStatusChange({
              isDetecting: validKeypoints.length >= 5,
              jointCount: validKeypoints.length,
              confidence: Math.round(avgConfidence)
            });
          }
          
          drawPose(pose);
          
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
        // Don't stop detection on error, just log it
      }

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(detect);
      }
    };

    detect();
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
    
    const getPoint = (name) => {
      const nameMap = {
        'left_shoulder': ['left_shoulder', 'left_shoulder_1'],
        'right_shoulder': ['right_shoulder', 'right_shoulder_1'],
        'left_elbow': ['left_elbow', 'left_elbow_1'],
        'right_elbow': ['right_elbow', 'right_elbow_1'],
        'left_wrist': ['left_wrist', 'left_wrist_1'],
        'right_wrist': ['right_wrist', 'right_wrist_1'],
        'left_hip': ['left_hip', 'left_hip_1'],
        'right_hip': ['right_hip', 'right_hip_1'],
        'left_knee': ['left_knee', 'left_knee_1'],
        'right_knee': ['right_knee', 'right_knee_1'],
        'left_ankle': ['left_ankle', 'left_ankle_1'],
        'right_ankle': ['right_ankle', 'right_ankle_1']
      };
      
      const possibleNames = nameMap[name] || [name];
      
      for (const possibleName of possibleNames) {
        const point = keypoints.find(k => 
          k.name?.toLowerCase().includes(possibleName.toLowerCase()) ||
          k.name?.toLowerCase().replace('_', '') === possibleName.toLowerCase().replace('_', '')
        );
        if (point && point.score > 0.3) return point;
      }
      return null;
    };

    const calculateAngle = (p1, p2, p3) => {
      if (!p1 || !p2 || !p3) return null;
      
      const a = { x: p1.x - p2.x, y: p1.y - p2.y };
      const b = { x: p3.x - p2.x, y: p3.y - p2.y };

      const dot = a.x * b.x + a.y * b.y;
      const magA = Math.sqrt(a.x * a.x + a.y * a.y);
      const magB = Math.sqrt(b.x * b.x + b.y * b.y);

      if (magA === 0 || magB === 0) return null;

      const angle = Math.acos(dot / (magA * magB)) * (180 / Math.PI);
      return Math.round(angle);
    };

    // Get all points
    const leftShoulder = getPoint('left_shoulder');
    const rightShoulder = getPoint('right_shoulder');
    const leftElbow = getPoint('left_elbow');
    const rightElbow = getPoint('right_elbow');
    const leftWrist = getPoint('left_wrist');
    const rightWrist = getPoint('right_wrist');
    const leftHip = getPoint('left_hip');
    const rightHip = getPoint('right_hip');
    const leftKnee = getPoint('left_knee');
    const rightKnee = getPoint('right_knee');
    const leftAnkle = getPoint('left_ankle');
    const rightAnkle = getPoint('right_ankle');

    // Calculate angles
    if (leftElbow && leftShoulder && leftWrist) {
      angles.left_elbow = calculateAngle(leftShoulder, leftElbow, leftWrist);
    }
    
    if (rightElbow && rightShoulder && rightWrist) {
      angles.right_elbow = calculateAngle(rightShoulder, rightElbow, rightWrist);
    }
    
    if (leftShoulder && leftElbow && leftHip) {
      angles.left_shoulder = calculateAngle(leftElbow, leftShoulder, leftHip);
    }
    
    if (rightShoulder && rightElbow && rightHip) {
      angles.right_shoulder = calculateAngle(rightElbow, rightShoulder, rightHip);
    }
    
    if (leftHip && leftShoulder && leftKnee) {
      angles.left_hip = calculateAngle(leftShoulder, leftHip, leftKnee);
    }
    
    if (rightHip && rightShoulder && rightKnee) {
      angles.right_hip = calculateAngle(rightShoulder, rightHip, rightKnee);
    }
    
    if (leftKnee && leftHip && leftAnkle) {
      angles.left_knee = calculateAngle(leftHip, leftKnee, leftAnkle);
    }
    
    if (rightKnee && rightHip && rightAnkle) {
      angles.right_knee = calculateAngle(rightHip, rightKnee, rightAnkle);
    }

    // Filter out null values
    Object.keys(angles).forEach(key => {
      if (angles[key] === null || isNaN(angles[key])) {
        delete angles[key];
      }
    });

    console.log('Calculated angles:', angles);
    return angles;
  };

  const drawPose = (pose) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { keypoints } = pose;

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

    connections.forEach(([start, end]) => {
      const p1 = keypoints.find(k => k.name?.includes(start));
      const p2 = keypoints.find(k => k.name?.includes(end));

      if (p1?.score > 0.3 && p2?.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        const avgScore = (p1.score + p2.score) / 2;
        if (avgScore > 0.7) {
          ctx.strokeStyle = '#00ff00';
        } else if (avgScore > 0.5) {
          ctx.strokeStyle = '#ffff00';
        } else {
          ctx.strokeStyle = '#ff0000';
        }
        
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    keypoints.forEach(point => {
      if (point.score > 0.3) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        
        if (point.score > 0.7) {
          ctx.fillStyle = '#00ff00';
        } else if (point.score > 0.5) {
          ctx.fillStyle = '#ffff00';
        } else {
          ctx.fillStyle = '#ff0000';
        }
        
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
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