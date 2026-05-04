export const calculateAdaptiveTolerance = (userProgress, poseDifficulty, userAge) => {
  let tolerance = 20; // Base tolerance in degrees
  
  // Age factor (increase tolerance for older users)
  if (userAge > 60) {
    tolerance += 8;
  } else if (userAge > 50) {
    tolerance += 5;
  } else if (userAge > 40) {
    tolerance += 3;
  }
  
  // Performance factor (decrease tolerance for advanced users)
  if (userProgress?.overallStats?.averageScore > 85) {
    tolerance = Math.max(12, tolerance - 5);
  } else if (userProgress?.overallStats?.averageScore > 75) {
    tolerance = Math.max(15, tolerance - 3);
  }
  
  // Pose difficulty factor
  if (poseDifficulty === 'beginner') {
    tolerance += 5;
  } else if (poseDifficulty === 'advanced') {
    tolerance = Math.max(15, tolerance - 3);
  }
  
  // Flexibility level factor
  const flexibilityLevel = userProgress?.personalization?.flexibilityLevel || 'medium';
  if (flexibilityLevel === 'low') {
    tolerance += 8;
  } else if (flexibilityLevel === 'high') {
    tolerance = Math.max(15, tolerance - 5);
  }
  
  return Math.min(35, Math.max(12, tolerance)); // Clamp between 12-35 degrees
};