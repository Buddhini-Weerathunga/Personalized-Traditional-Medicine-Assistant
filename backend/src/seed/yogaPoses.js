const mongoose = require('mongoose');
const YogaPose = require('../models/YogaPose');
require('dotenv').config();

const seedPoses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing poses
    await YogaPose.deleteMany({});
    console.log('Cleared existing poses');

    // Define poses with timer settings
    const poses = [
      {
        name: "Mountain Pose",
        sanskritName: "Tadasana",
        difficulty: "beginner",
        category: "standing",
        description: "Foundation pose that improves posture and body awareness",
        benefits: ["Improves posture", "Strengthens thighs", "Increases awareness", "Reduces flat feet"],
        precautions: ["Avoid if you have low blood pressure", "Those with headaches should rest"],
        idealAngles: {
          // Widen the ranges for Mountain Pose - shoulders can be 160-200° (20° tolerance)
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },

          // Elbows should be nearly straight but give 20° tolerance
          left_elbow: { min: 160, max: 200, ideal: 180 },
          right_elbow: { min: 160, max: 200, ideal: 180 },

          // Hips - allow more range
          left_hip: { min: 160, max: 200, ideal: 180 },
          right_hip: { min: 160, max: 200, ideal: 180 },

          // Knees - allow slight bend
          left_knee: { min: 170, max: 190, ideal: 180 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Stand with feet together, weight balanced evenly",
          "Engage your thigh muscles and lift your kneecaps",
          "Lengthen your tailbone toward the floor",
          "Roll your shoulders back and down",
          "Reach the crown of your head toward the ceiling",
          "Hold for 30-60 seconds, breathing deeply"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 10,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        duration: { recommended: 60, min: 30, max: 120 },
        defaultTolerance: 20 // Increased from 15 to 20
      },
      {
        name: "Warrior II",
        sanskritName: "Virabhadrasana II",
        difficulty: "intermediate",
        category: "standing",
        description: "Powerful standing pose that builds strength and stamina",
        benefits: ["Strengthens legs and ankles", "Stretches hips and chest", "Builds stamina", "Improves concentration"],
        precautions: ["Avoid if you have knee or hip injuries", "Those with neck problems should keep head neutral"],
        idealAngles: {
          left_shoulder: { min: 165, max: 195, ideal: 180 },
          right_shoulder: { min: 165, max: 195, ideal: 180 },
          left_elbow: { min: 170, max: 190, ideal: 180 },
          right_elbow: { min: 170, max: 190, ideal: 180 },
          left_hip: { min: 85, max: 105, ideal: 95 },
          right_hip: { min: 165, max: 195, ideal: 180 },
          left_knee: { min: 85, max: 100, ideal: 90 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Stand with feet 3-4 feet apart",
          "Turn right foot out 90°, left foot in slightly",
          "Bend right knee directly over ankle",
          "Keep left leg straight and strong",
          "Extend arms parallel to floor, palms down",
          "Gaze over right hand",
          "Hold for 30-60 seconds, then switch sides"
        ],
        // Timer settings for Warrior II
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 10,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        duration: { recommended: 60, min: 30, max: 120 },
        defaultTolerance: 20
      },
      {
        name: "Tree Pose",
        sanskritName: "Vrikshasana",
        difficulty: "intermediate",
        category: "balance",
        description: "Balancing pose that improves focus and stability",
        benefits: ["Improves balance", "Strengthens legs", "Opens hips", "Increases focus"],
        precautions: ["Use wall for support if needed", "Avoid if you have vertigo"],
        idealAngles: {
          left_shoulder: { min: 165, max: 195, ideal: 180 },
          right_shoulder: { min: 165, max: 195, ideal: 180 },
          left_elbow: { min: 170, max: 190, ideal: 180 },
          right_elbow: { min: 170, max: 190, ideal: 180 },
          left_hip: { min: 170, max: 190, ideal: 180 },
          right_hip: { min: 80, max: 100, ideal: 90 },
          left_knee: { min: 175, max: 185, ideal: 180 },
          right_knee: { min: 45, max: 75, ideal: 60 }
        },
        instructions: [
          "Stand on left leg with right knee bent",
          "Place right foot on inner left thigh",
          "Press foot and thigh firmly together",
          "Bring hands to prayer position at heart",
          "Focus on a fixed point in front of you",
          "Hold for 30-60 seconds, then switch sides"
        ],
        // Timer settings for Tree Pose
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 10,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        duration: { recommended: 45, min: 30, max: 90 },
        defaultTolerance: 18
      },
      {
        name: "Downward Dog",
        sanskritName: "Adho Mukha Svanasana",
        difficulty: "beginner",
        category: "prone",
        description: "Inverted pose that stretches and strengthens the entire body",
        benefits: ["Stretches hamstrings", "Strengthens arms", "Relieves back pain", "Increases blood flow"],
        precautions: ["Avoid if you have carpal tunnel syndrome", "Those with high blood pressure should modify"],
        idealAngles: {
          left_shoulder: { min: 110, max: 140, ideal: 120 },
          right_shoulder: { min: 110, max: 140, ideal: 120 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 80, max: 100, ideal: 90 },
          right_hip: { min: 80, max: 100, ideal: 90 },
          left_knee: { min: 160, max: 180, ideal: 170 },
          right_knee: { min: 160, max: 180, ideal: 170 }
        },
        instructions: [
          "Start on hands and knees",
          "Tuck toes and lift knees off floor",
          "Push hips up and back",
          "Straighten legs as much as possible",
          "Press heels toward floor",
          "Hold for 5-10 breaths"
        ],
        // Timer settings for Downward Dog
        timerSettings: {
          defaultHoldTime: 45,
          minHoldTime: 30,
          maxHoldTime: 90,
          restTimeBetweenPoses: 15,
          breathingCycles: 8,
          holdTimeByLevel: {
            beginner: 30,
            intermediate: 45,
            advanced: 60
          }
        },
        duration: { recommended: 60, min: 30, max: 90 },
        defaultTolerance: 15
      },
      {
        name: "Child's Pose",
        sanskritName: "Balasana",
        difficulty: "beginner",
        category: "prone",
        description: "Resting pose that gently stretches the hips and back",
        benefits: ["Relieves back pain", "Calms the mind", "Stretches hips", "Reduces stress"],
        precautions: ["Avoid if you have knee injuries", "Those with diarrhea should skip"],
        idealAngles: {
          left_shoulder: { min: 20, max: 40, ideal: 30 },
          right_shoulder: { min: 20, max: 40, ideal: 30 },
          left_elbow: { min: 20, max: 40, ideal: 30 },
          right_elbow: { min: 20, max: 40, ideal: 30 },
          left_hip: { min: 140, max: 160, ideal: 150 },
          right_hip: { min: 140, max: 160, ideal: 150 },
          left_knee: { min: 20, max: 40, ideal: 30 },
          right_knee: { min: 20, max: 40, ideal: 30 }
        },
        instructions: [
          "Kneel on floor with toes together",
          "Sit back on heels",
          "Fold forward, bringing forehead to floor",
          "Extend arms forward or alongside body",
          "Breathe deeply and relax",
          "Hold for 1-2 minutes"
        ],
        // Timer settings for Child's Pose
        timerSettings: {
          defaultHoldTime: 60,
          minHoldTime: 30,
          maxHoldTime: 120,
          restTimeBetweenPoses: 20,
          breathingCycles: 10,
          holdTimeByLevel: {
            beginner: 45,
            intermediate: 60,
            advanced: 90
          }
        },
        duration: { recommended: 60, min: 30, max: 120 },
        defaultTolerance: 20
      },
      {
        name: "Cobra Pose",
        sanskritName: "Bhujangasana",
        difficulty: "beginner",
        category: "prone",
        description: "Backbend that strengthens the spine and opens the chest",
        benefits: ["Strengthens spine", "Opens chest", "Improves flexibility", "Stimulates abdominal organs"],
        precautions: ["Avoid if you have back injuries", "Those with carpal tunnel should be careful"],
        idealAngles: {
          left_shoulder: { min: 20, max: 40, ideal: 30 },
          right_shoulder: { min: 20, max: 40, ideal: 30 },
          left_elbow: { min: 80, max: 100, ideal: 90 },
          right_elbow: { min: 80, max: 100, ideal: 90 },
          left_hip: { min: 160, max: 180, ideal: 170 },
          right_hip: { min: 160, max: 180, ideal: 170 },
          left_knee: { min: 170, max: 180, ideal: 175 },
          right_knee: { min: 170, max: 180, ideal: 175 }
        },
        instructions: [
          "Lie face down, legs extended",
          "Place hands under shoulders",
          "Press into hands, lift chest",
          "Keep hips on floor",
          "Roll shoulders back",
          "Hold for 15-30 seconds"
        ],
        // Timer settings for Cobra Pose
        timerSettings: {
          defaultHoldTime: 25,
          minHoldTime: 15,
          maxHoldTime: 45,
          restTimeBetweenPoses: 10,
          breathingCycles: 4,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 25,
            advanced: 35
          }
        },
        duration: { recommended: 30, min: 15, max: 45 },
        defaultTolerance: 15
      }
    ];

    // Insert poses
    for (const pose of poses) {
      await YogaPose.create(pose);
      console.log(`✅ Added pose: ${pose.name} with timer settings (default: ${pose.timerSettings.defaultHoldTime}s)`);
    }

    console.log('✅ All poses seeded successfully with timer settings');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding poses:', error);
    process.exit(1);
  }
};

seedPoses();