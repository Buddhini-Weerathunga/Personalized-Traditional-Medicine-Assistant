const YogaSession = require('../models/YogaSession');
const YogaPose = require('../models/YogaPose');
const UserProgress = require('../models/UserProgress');

// Get all yoga poses
exports.getYogaPoses = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let filter = {};
    
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    
    const poses = await YogaPose.find(filter).select('-__v');
    res.json(poses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single yoga pose
exports.getYogaPose = async (req, res) => {
  try {
    const pose = await YogaPose.findById(req.params.id);
    if (!pose) {
      return res.status(404).json({ error: 'Pose not found' });
    }
    res.json(pose);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start a yoga session
exports.startSession = async (req, res) => {
  try {
    const { poseId, difficultyLevel } = req.body;
    const userId = req.userId;
    
    // Get pose details
    const pose = await YogaPose.findById(poseId);
    if (!pose) {
      return res.status(404).json({ error: 'Pose not found' });
    }
    
    // Get user progress for personalization
    const userProgress = await UserProgress.findOne({ userId });
    
    // Determine tolerance thresholds based on user profile
    let toleranceThresholds = {};
    const baseTolerance = pose.defaultTolerance;
    
    if (userProgress) {
      const { age, flexibilityLevel } = userProgress.personalization;
      
      // Adjust tolerance based on age and flexibility
      let ageFactor = 1.0;
      if (age > 50) ageFactor = 1.3;
      else if (age < 25) ageFactor = 0.9;
      
      let flexibilityFactor = 1.0;
      if (flexibilityLevel === 'low') flexibilityFactor = 1.4;
      else if (flexibilityLevel === 'high') flexibilityFactor = 0.8;
      
      // Set tolerance for each joint
      Object.keys(pose.idealAngles).forEach(joint => {
        toleranceThresholds[joint] = baseTolerance * ageFactor * flexibilityFactor;
      });
    }
    
    // Create new session
    const session = new YogaSession({
      userId,
      poseId,
      difficultyLevel: difficultyLevel || pose.difficulty,
      toleranceThresholds
    });
    
    await session.save();
    
    res.json({
      sessionId: session._id,
      pose: pose.name,
      idealAngles: pose.idealAngles,
      toleranceThresholds,
      instructions: pose.instructions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analyze pose in real-time
exports.analyzePose = async (req, res) => {
  try {
    const { sessionId, jointAngles } = req.body;
    
    const session = await YogaSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get ideal pose angles
    const pose = await YogaPose.findById(session.poseId);
    
    // Calculate deviations and generate feedback
    const corrections = [];
    const feedback = {
      postureAccuracy: 100,
      alignmentScore: 100,
      suggestions: []
    };
    
    let totalDeviation = 0;
    let jointsAnalyzed = 0;
    
    for (const [joint, currentAngle] of Object.entries(jointAngles)) {
      if (pose.idealAngles[joint]) {
        const ideal = pose.idealAngles[joint].ideal;
        const min = pose.idealAngles[joint].min;
        const max = pose.idealAngles[joint].max;
        const tolerance = session.toleranceThresholds[joint] || 10;
        
        const deviation = Math.abs(currentAngle - ideal);
        totalDeviation += deviation;
        jointsAnalyzed++;
        
        // Check if correction is needed
        if (deviation > tolerance) {
          let message = '';
          
          if (currentAngle < min) {
            message = `Increase ${joint} angle by ${Math.round(min - currentAngle)}°`;
          } else if (currentAngle > max) {
            message = `Decrease ${joint} angle by ${Math.round(currentAngle - max)}°`;
          } else if (currentAngle < ideal) {
            message = `Increase ${joint} angle slightly`;
          } else {
            message = `Decrease ${joint} angle slightly`;
          }
          
          corrections.push({
            joint,
            message,
            correctionType: session.preferredFeedback || 'both',
            timestamp: new Date()
          });
          
          // Reduce accuracy score based on deviation
          feedback.postureAccuracy -= (deviation / tolerance) * 5;
          feedback.alignmentScore -= (deviation / tolerance) * 3;
        }
      }
    }
    
    // Calculate scores
    const averageDeviation = jointsAnalyzed > 0 ? totalDeviation / jointsAnalyzed : 0;
    feedback.postureAccuracy = Math.max(0, Math.min(100, feedback.postureAccuracy));
    feedback.alignmentScore = Math.max(0, Math.min(100, feedback.alignmentScore));
    
    // Generate suggestions
    if (averageDeviation > 15) {
      feedback.suggestions.push("Focus on alignment before deepening the pose");
    }
    if (corrections.length > 3) {
      feedback.suggestions.push("Try a simpler variation of this pose");
    }
    
    // Update session
    session.jointAngles = jointAngles;
    session.corrections = corrections;
    session.feedback = feedback;
    session.score = (feedback.postureAccuracy + feedback.alignmentScore) / 2;
    
    await session.save();
    
    res.json({
      corrections,
      feedback,
      score: session.score,
      sessionComplete: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// End yoga session
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const session = await YogaSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000);
    
    // Update user progress
    await updateUserProgress(session.userId, session);
    
    await session.save();
    
    res.json({
      success: true,
      sessionId: session._id,
      duration: session.duration,
      finalScore: session.score,
      feedback: session.feedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to update user progress
async function updateUserProgress(userId, session) {
  try {
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        personalization: {
          preferredFeedback: 'both'
        }
      });
    }
    
    // Update overall stats
    userProgress.overallStats.totalSessions += 1;
    userProgress.overallStats.totalDuration += Math.floor(session.duration / 60);
    userProgress.overallStats.averageScore = 
      (userProgress.overallStats.averageScore * (userProgress.overallStats.totalSessions - 1) + session.score) / 
      userProgress.overallStats.totalSessions;
    
    // Update pose proficiency
    const poseIndex = userProgress.poseProficiency.findIndex(
      p => p.poseId.toString() === session.poseId.toString()
    );
    
    if (poseIndex === -1) {
      userProgress.poseProficiency.push({
        poseId: session.poseId,
        attempts: 1,
        bestScore: session.score,
        averageScore: session.score,
        lastPracticed: new Date(),
        improvements: [{
          date: new Date(),
          score: session.score,
          feedback: session.feedback.suggestions[0] || "Good start!"
        }]
      });
    } else {
      const poseProf = userProgress.poseProficiency[poseIndex];
      poseProf.attempts += 1;
      poseProf.bestScore = Math.max(poseProf.bestScore, session.score);
      poseProf.averageScore = 
        (poseProf.averageScore * (poseProf.attempts - 1) + session.score) / poseProf.attempts;
      poseProf.lastPracticed = new Date();
      poseProf.improvements.push({
        date: new Date(),
        score: session.score,
        feedback: session.feedback.suggestions[0] || "Keep practicing!"
      });
    }
    
    // Update streak
    const today = new Date().toDateString();
    const lastSessionDate = userProgress.lastSession ? 
      new Date(userProgress.lastSession).toDateString() : null;
    
    if (lastSessionDate === today) {
      // Already practiced today
    } else if (lastSessionDate && 
               (new Date(today) - new Date(lastSessionDate)) / (1000 * 60 * 60 * 24) === 1) {
      userProgress.streak.current += 1;
    } else {
      userProgress.streak.current = 1;
    }
    
    userProgress.streak.longest = Math.max(
      userProgress.streak.longest,
      userProgress.streak.current
    );
    
    userProgress.lastSession = new Date();
    
    await userProgress.save();
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
}

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;
    
    const progress = await UserProgress.findOne({ userId })
      .populate('poseProficiency.poseId', 'name difficulty');
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user personalization settings
exports.updatePersonalization = async (req, res) => {
  try {
    const userId = req.userId;
    const { age, flexibilityLevel, mobilityRestrictions, preferredFeedback } = req.body;
    
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    userProgress.personalization = {
      ...userProgress.personalization,
      age,
      flexibilityLevel,
      mobilityRestrictions: mobilityRestrictions || [],
      preferredFeedback
    };
    
    await userProgress.save();
    
    res.json({ success: true, personalization: userProgress.personalization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};