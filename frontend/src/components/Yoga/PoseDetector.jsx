import { useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam'; // Optional: Use if react-webcam works

const PoseDetector = ({ videoRef, canvasRef, onPoseDetected, isActive }) => {
  const detectorRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      initPoseDetection();
    } else {
      stopPoseDetection();
    }

    return () => {
      stopPoseDetection();
    };
  }, [isActive]);

  const initPoseDetection = async () => {
    try {
      // Initialize TensorFlow.js with WebGL backend
      await tf.ready();
      await tf.setBackend('webgl');

      // Use MediaPipe Pose for web (better compatibility)
      const model = poseDetection.SupportedModels.MediaPipePose;
      const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
        modelType: 'full',
        enableSegmentation: false,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      };

      detectorRef.current = await poseDetection.createDetector(model, detectorConfig);
      
      if (videoRef.current) {
        startDetection();
      }
    } catch (error) {
      console.error('Error initializing pose detection:', error);
      // Fallback to MoveNet
      initMoveNetFallback();
    }
  };

  const initMoveNetFallback = async () => {
    try {
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      
      detectorRef.current = await poseDetection.createDetector(model, detectorConfig);
      startDetection();
    } catch (error) {
      console.error('Error with MoveNet fallback:', error);
    }
  };

  const startDetection = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

    const detectPose = async () => {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current, {
          flipHorizontal: false,
          maxPoses: 1
        });

        if (poses.length > 0 && onPoseDetected) {
          const pose = poses[0];
          drawPose(pose);
          
          // Calculate joint angles
          const jointAngles = calculateJointAngles(pose.keypoints);
          onPoseDetected(jointAngles);
        }
      } catch (error) {
        console.error('Error detecting pose:', error);
      }

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(detectPose);
      }
    };

    detectPose();
  };

  const stopPoseDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }
  };

  const calculateJointAngles = (keypoints) => {
    const angles = {};
    
    // Calculate angle between three points
    const angleBetweenPoints = (a, b, c) => {
      if (!a || !b || !c || a.score < 0.3 || b.score < 0.3 || c.score < 0.3) {
        return null;
      }

      const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
      const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
      const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));

      const radians = Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc));
      return radians * (180 / Math.PI);
    };

    // Get keypoint by name
    const getKeypoint = (name) => keypoints.find(k => k.name === name);

    // Calculate shoulder angles
    const leftShoulder = angleBetweenPoints(
      getKeypoint('left_elbow'),
      getKeypoint('left_shoulder'),
      getKeypoint('left_hip')
    );
    if (leftShoulder) angles.left_shoulder = leftShoulder;

    const rightShoulder = angleBetweenPoints(
      getKeypoint('right_elbow'),
      getKeypoint('right_shoulder'),
      getKeypoint('right_hip')
    );
    if (rightShoulder) angles.right_shoulder = rightShoulder;

    // Calculate elbow angles
    const leftElbow = angleBetweenPoints(
      getKeypoint('left_shoulder'),
      getKeypoint('left_elbow'),
      getKeypoint('left_wrist')
    );
    if (leftElbow) angles.left_elbow = leftElbow;

    const rightElbow = angleBetweenPoints(
      getKeypoint('right_shoulder'),
      getKeypoint('right_elbow'),
      getKeypoint('right_wrist')
    );
    if (rightElbow) angles.right_elbow = rightElbow;

    // Calculate hip angles
    const leftHip = angleBetweenPoints(
      getKeypoint('left_shoulder'),
      getKeypoint('left_hip'),
      getKeypoint('left_knee')
    );
    if (leftHip) angles.left_hip = leftHip;

    const rightHip = angleBetweenPoints(
      getKeypoint('right_shoulder'),
      getKeypoint('right_hip'),
      getKeypoint('right_knee')
    );
    if (rightHip) angles.right_hip = rightHip;

    // Calculate knee angles
    const leftKnee = angleBetweenPoints(
      getKeypoint('left_hip'),
      getKeypoint('left_knee'),
      getKeypoint('left_ankle')
    );
    if (leftKnee) angles.left_knee = leftKnee;

    const rightKnee = angleBetweenPoints(
      getKeypoint('right_hip'),
      getKeypoint('right_knee'),
      getKeypoint('right_ankle')
    );
    if (rightKnee) angles.right_knee = rightKnee;

    return angles;
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { keypoints } = pose;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw skeleton
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

    // Draw connections
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;

    connections.forEach(([start, end]) => {
      const startPoint = keypoints.find(k => k.name === start);
      const endPoint = keypoints.find(k => k.name === end);

      if (startPoint?.score > 0.3 && endPoint?.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    });

    // Draw keypoints
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
      }
    });
  };

  return null; // This component doesn't render anything visible
};

export default PoseDetector;