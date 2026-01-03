export const calculateAngles = (keypoints) => {
  const angles = {};
  
  // Helper function to calculate angle between three points
  const calculateAngle = (A, B, C) => {
    if (!A || !B || !C || A.score < 0.3 || B.score < 0.3 || C.score < 0.3) {
      return null;
    }
    
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    
    const angle = Math.acos(
      (Math.pow(AB, 2) + Math.pow(BC, 2) - Math.pow(AC, 2)) / (2 * AB * BC)
    ) * (180 / Math.PI);
    
    return angle;
  };
  
  // Get keypoints by name
  const getKeypoint = (name) => keypoints.find(k => k.name === name);
  
  // Calculate key angles for yoga poses
  
  // Shoulder angle (shoulder-elbow-wrist)
  const leftShoulderAngle = calculateAngle(
    getKeypoint('left_elbow'),
    getKeypoint('left_shoulder'),
    getKeypoint('left_hip')
  );
  if (leftShoulderAngle) angles.left_shoulder = leftShoulderAngle;
  
  const rightShoulderAngle = calculateAngle(
    getKeypoint('right_elbow'),
    getKeypoint('right_shoulder'),
    getKeypoint('right_hip')
  );
  if (rightShoulderAngle) angles.right_shoulder = rightShoulderAngle;
  
  // Elbow angle (shoulder-elbow-wrist)
  const leftElbowAngle = calculateAngle(
    getKeypoint('left_shoulder'),
    getKeypoint('left_elbow'),
    getKeypoint('left_wrist')
  );
  if (leftElbowAngle) angles.left_elbow = leftElbowAngle;
  
  const rightElbowAngle = calculateAngle(
    getKeypoint('right_shoulder'),
    getKeypoint('right_elbow'),
    getKeypoint('right_wrist')
  );
  if (rightElbowAngle) angles.right_elbow = rightElbowAngle;
  
  // Hip angle (shoulder-hip-knee)
  const leftHipAngle = calculateAngle(
    getKeypoint('left_shoulder'),
    getKeypoint('left_hip'),
    getKeypoint('left_knee')
  );
  if (leftHipAngle) angles.left_hip = leftHipAngle;
  
  const rightHipAngle = calculateAngle(
    getKeypoint('right_shoulder'),
    getKeypoint('right_hip'),
    getKeypoint('right_knee')
  );
  if (rightHipAngle) angles.right_hip = rightHipAngle;
  
  // Knee angle (hip-knee-ankle)
  const leftKneeAngle = calculateAngle(
    getKeypoint('left_hip'),
    getKeypoint('left_knee'),
    getKeypoint('left_ankle')
  );
  if (leftKneeAngle) angles.left_knee = leftKneeAngle;
  
  const rightKneeAngle = calculateAngle(
    getKeypoint('right_hip'),
    getKeypoint('right_knee'),
    getKeypoint('right_ankle')
  );
  if (rightKneeAngle) angles.right_knee = rightKneeAngle;
  
  // Back angle (neck-hip-knee)
  const leftBackAngle = calculateAngle(
    getKeypoint('nose'), // Using nose as neck approximation
    getKeypoint('left_hip'),
    getKeypoint('left_knee')
  );
  if (leftBackAngle) angles.left_back = leftBackAngle;
  
  const rightBackAngle = calculateAngle(
    getKeypoint('nose'),
    getKeypoint('right_hip'),
    getKeypoint('right_knee')
  );
  if (rightBackAngle) angles.right_back = rightBackAngle;
  
  return angles;
};

// Ideal angles for common yoga poses (simplified)
export const IDEAL_POSES = {
  'mountain_pose': {
    left_shoulder: 180,
    right_shoulder: 180,
    left_elbow: 180,
    right_elbow: 180,
    left_hip: 180,
    right_hip: 180,
    left_knee: 180,
    right_knee: 180
  },
  'downward_dog': {
    left_shoulder: 180,
    right_shoulder: 180,
    left_hip: 90,
    right_hip: 90,
    left_knee: 180,
    right_knee: 180
  },
  'warrior_ii': {
    left_hip: 90,
    right_hip: 180,
    left_knee: 90,
    right_knee: 180
  },
  'tree_pose': {
    standing_knee: 180,
    lifted_hip: 45
  }
};