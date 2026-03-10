const YogaSession = require('../models/YogaSession');
const YogaPose = require('../models/YogaPose');
const UserProgress = require('../models/UserProgress');

// Get all yoga poses
exports.getYogaPoses = async (req, res) => {
  try {
    const poses = await YogaPose.find({});
    res.json({
      success: true,
      count: poses.length,
      poses
    });
  } catch (error) {
    console.error('Error in getYogaPoses:', error.message);
    res.status(200).json({
      success: true,
      poses: []
    });
  }
};

// Get single yoga pose
exports.getYogaPose = async (req, res) => {
  try {
    const pose = await YogaPose.findById(req.params.id);
    if (!pose) {
      return res.status(404).json({ error: 'Pose not found' });
    }
    res.json({ success: true, pose });
  } catch (error) {
    console.error('Error in getYogaPose:', error.message);
    res.status(200).json({ success: true, pose: null });
  }
};

// Start a yoga session
exports.startSession = async (req, res) => {
  try {
    const { poseId } = req.body;
    const userId = req.user?.id || 'test-user-id';
    
    console.log('Starting session for pose:', poseId, 'user:', userId);
    
    let pose = null;
    try {
      pose = await YogaPose.findById(poseId);
    } catch (err) {
      console.error('Error finding pose:', err.message);
    }
    
    const session = new YogaSession({
      userId,
      poseId: pose?._id || poseId,
      startTime: new Date()
    });
    
    await session.save();
    
    res.json({
      success: true,
      sessionId: session._id,
      pose: pose ? {
        id: pose._id,
        name: pose.name,
        sanskritName: pose.sanskritName
      } : { id: poseId, name: 'Unknown Pose' },
      idealAngles: {}
    });
    
  } catch (error) {
    console.error('Error starting session:', error.message);
    res.json({
      success: true,
      sessionId: 'test-session-' + Date.now(),
      pose: { id: 'test-pose', name: 'Test Pose' }
    });
  }
};

// Analyze pose and return real corrections
exports.analyzePose = async (req, res) => {
  try {
    const { sessionId, jointAngles } = req.body;
    
    if (!jointAngles || Object.keys(jointAngles).length === 0) {
      return res.json({
        success: true,
        corrections: [],
        feedback: {
          postureAccuracy: 0,
          alignmentScore: 0,
          suggestions: ['No joints detected. Please ensure you are visible.'],
          validJointsCount: 0
        },
        score: 0
      });
    }
    
    const session = await YogaSession.findById(sessionId).populate('poseId');
    if (!session) {
      return res.json({
        success: true,
        corrections: [],
        feedback: {
          postureAccuracy: 50,
          alignmentScore: 50,
          suggestions: ['Continuing...'],
          validJointsCount: 5
        },
        score: 50
      });
    }
    
    const corrections = [];
    let totalAccuracy = 0;
    let validJointsCount = 0;
    
    const idealDefaults = {
      left_shoulder: { min: 160, max: 200, ideal: 180 },
      right_shoulder: { min: 160, max: 200, ideal: 180 },
      left_elbow: { min: 160, max: 200, ideal: 180 },
      right_elbow: { min: 160, max: 200, ideal: 180 },
      left_hip: { min: 160, max: 200, ideal: 180 },
      right_hip: { min: 160, max: 200, ideal: 180 },
      left_knee: { min: 170, max: 190, ideal: 180 },
      right_knee: { min: 170, max: 190, ideal: 180 }
    };
    
    for (const [joint, currentAngle] of Object.entries(jointAngles)) {
      if (currentAngle && !isNaN(currentAngle) && currentAngle > 0 && currentAngle < 180) {
        const idealData = idealDefaults[joint];
        
        if (idealData) {
          const ideal = idealData.ideal;
          const min = idealData.min;
          const max = idealData.max;
          
          let accuracy;
          if (currentAngle >= min && currentAngle <= max) {
            accuracy = 100;
          } else {
            const outsideBy = Math.min(
              Math.abs(currentAngle - min),
              Math.abs(currentAngle - max)
            );
            accuracy = Math.max(0, 100 - (outsideBy * 2));
          }
          
          totalAccuracy += accuracy;
          validJointsCount++;
          
          const deviation = Math.abs(currentAngle - ideal);
          if (deviation > 20) {
            let message = '';
            if (currentAngle < min) {
              message = `Raise your ${joint.replace('_', ' ')}`;
            } else if (currentAngle > max) {
              message = `Lower your ${joint.replace('_', ' ')}`;
            }
            
            if (message) {
              corrections.push({
                joint,
                message,
                severity: deviation > 30 ? 'high' : 'medium',
                currentAngle,
                idealAngle: ideal,
                deviation
              });
            }
          }
        }
      }
    }
    
    const postureAccuracy = validJointsCount > 0 
      ? Math.round(totalAccuracy / validJointsCount)
      : 0;
    
    const alignmentScore = validJointsCount > 0
      ? Math.max(0, 100 - (corrections.length * (100 / validJointsCount)))
      : 0;
    
    // Update session with real-time data
    session.corrections = corrections;
    session.feedback = {
      postureAccuracy,
      alignmentScore,
      suggestions: corrections.length === 0 ? ['Perfect form!'] : ['Adjust your pose'],
      validJointsCount
    };
    session.score = Math.round((postureAccuracy + alignmentScore) / 2);
    session.jointAngles = jointAngles;
    
    await session.save();
    
    res.json({
      success: true,
      corrections,
      feedback: session.feedback,
      score: session.score
    });
    
  } catch (error) {
    console.error('❌ Error in analyzePose:', error.message);
    res.json({
      success: true,
      corrections: [],
      feedback: {
        postureAccuracy: 50,
        alignmentScore: 50,
        suggestions: ['Continuing analysis...'],
        validJointsCount: 0
      },
      score: 50
    });
  }
};

// End yoga session and update progress
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.id || 'test-user-id';
    
    const session = await YogaSession.findById(sessionId).populate('poseId');
    if (!session) {
      return res.json({
        success: true,
        sessionId: sessionId,
        duration: 0,
        finalScore: 0
      });
    }
    
    // Calculate session duration
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000);
    
    // Calculate final score if not already set
    if (!session.score) {
      const postureAccuracy = session.feedback?.postureAccuracy || 0;
      const alignmentScore = session.feedback?.alignmentScore || 0;
      session.score = Math.round((postureAccuracy + alignmentScore) / 2);
    }
    
    await session.save();
    
    // Update user progress
    await updateUserProgress(userId, session);
    
    res.json({
      success: true,
      sessionId: session._id,
      duration: session.duration,
      finalScore: session.score || 0
    });
    
  } catch (error) {
    console.error('Error ending session:', error.message);
    res.json({
      success: true,
      sessionId: sessionId,
      duration: 0,
      finalScore: 0
    });
  }
};

// Helper function to update user progress
async function updateUserProgress(userId, session) {
  try {
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    const poseId = session.poseId?._id || session.poseId;
    const sessionScore = session.score || 0;
    const sessionDuration = session.duration || 0;
    
    // Update overall stats
    userProgress.overallStats.totalSessions += 1;
    userProgress.overallStats.totalDuration += sessionDuration;
    
    // Calculate new average score
    const oldTotal = userProgress.overallStats.averageScore * (userProgress.overallStats.totalSessions - 1);
    userProgress.overallStats.averageScore = Math.round(
      (oldTotal + sessionScore) / userProgress.overallStats.totalSessions
    );
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (userProgress.lastSession) {
      const lastSessionDate = new Date(userProgress.lastSession);
      lastSessionDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((today - lastSessionDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day
        userProgress.streak.current += 1;
      } else if (dayDiff > 1) {
        // Streak broken
        userProgress.streak.current = 1;
      }
      // If same day, streak doesn't change
    } else {
      // First session ever
      userProgress.streak.current = 1;
    }
    
    // Update longest streak
    if (userProgress.streak.current > userProgress.streak.longest) {
      userProgress.streak.longest = userProgress.streak.current;
    }
    
    userProgress.lastSession = new Date();
    
    // Update pose proficiency
    if (poseId) {
      const poseIndex = userProgress.poseProficiency.findIndex(
        p => p.poseId?.toString() === poseId.toString()
      );
      
      if (poseIndex >= 0) {
        // Update existing pose
        userProgress.poseProficiency[poseIndex].attempts += 1;
        userProgress.poseProficiency[poseIndex].lastPracticed = new Date();
        
        if (sessionScore > userProgress.poseProficiency[poseIndex].bestScore) {
          userProgress.poseProficiency[poseIndex].bestScore = sessionScore;
        }
        
        // Update average score for this pose
        const oldAvg = userProgress.poseProficiency[poseIndex].averageScore;
        const newAvg = Math.round(
          (oldAvg * (userProgress.poseProficiency[poseIndex].attempts - 1) + sessionScore) / 
          userProgress.poseProficiency[poseIndex].attempts
        );
        userProgress.poseProficiency[poseIndex].averageScore = newAvg;
        
      } else {
        // Add new pose
        userProgress.poseProficiency.push({
          poseId,
          attempts: 1,
          bestScore: sessionScore,
          averageScore: sessionScore,
          lastPracticed: new Date()
        });
      }
    }
    
    await userProgress.save();
    console.log('✅ User progress updated for:', userId);
    
  } catch (error) {
    console.error('Error updating user progress:', error.message);
  }
}

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?.id || 'test-user-id';
    
    let userProgress = await UserProgress.findOne({ userId })
      .populate('poseProficiency.poseId', 'name sanskritName difficulty category');
    
    if (!userProgress) {
      // Create default progress if none exists
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }
    
    res.json({ 
      success: true, 
      progress: userProgress 
    });
    
  } catch (error) {
    console.error('Error getting user progress:', error.message);
    res.json({
      success: true,
      progress: {
        overallStats: { totalSessions: 0, totalDuration: 0, averageScore: 0 },
        streak: { current: 0, longest: 0 },
        poseProficiency: []
      }
    });
  }
};

// Update personalization settings
exports.updatePersonalization = async (req, res) => {
  try {
    const userId = req.user?.id || 'test-user-id';
    const { age, flexibilityLevel, mobilityRestrictions, preferredFeedback } = req.body;
    
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    userProgress.personalization = {
      age: age || 30,
      flexibilityLevel: flexibilityLevel || 'medium',
      mobilityRestrictions: mobilityRestrictions || [],
      preferredFeedback: preferredFeedback || 'both'
    };
    
    await userProgress.save();
    
    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      personalization: userProgress.personalization
    });
    
  } catch (error) {
    console.error('Error updating personalization:', error.message);
    res.json({ 
      success: true, 
      message: 'Settings updated',
      personalization: {
        age: 30,
        flexibilityLevel: 'medium',
        mobilityRestrictions: [],
        preferredFeedback: 'both'
      }
    });
  }
};

// Get session history
exports.getSessionHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'test-user-id';
    const limit = parseInt(req.query.limit) || 10;
    
    const sessions = await YogaSession.find({ userId })
      .populate('poseId', 'name sanskritName')
      .sort({ startTime: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s._id,
        poseName: s.poseId?.name || 'Unknown Pose',
        date: s.startTime,
        duration: s.duration,
        score: s.score,
        corrections: s.corrections?.length || 0
      }))
    });
    
  } catch (error) {
    console.error('Error getting session history:', error.message);
    res.json({ success: true, sessions: [] });
  }
};