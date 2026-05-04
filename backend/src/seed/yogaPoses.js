const mongoose = require('mongoose');
const YogaPose = require('../models/YogaPose');
require('dotenv').config();

const seedPoses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await YogaPose.deleteMany({});
    console.log('Cleared existing poses');

    const poses = [
      // 1. Mountain Pose
      {
        name: "Mountain Pose",
        sanskritName: "Tadasana",
        difficulty: "beginner",
        category: "standing",
        description: "Foundation pose that improves posture and body awareness",
        benefits: ["Improves posture", "Strengthens thighs", "Increases awareness", "Reduces flat feet", "Improves balance"],
        precautions: ["Avoid if you have low blood pressure", "Those with headaches should rest"],
        idealAngles: {
          left_shoulder: { min: 10, max: 40, ideal: 20 },
          right_shoulder: { min: 10, max: 40, ideal: 20 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 165, max: 185, ideal: 175 },
          right_hip: { min: 165, max: 185, ideal: 175 },
          left_knee: { min: 165, max: 185, ideal: 175 },
          right_knee: { min: 165, max: 185, ideal: 175 }
        },
        instructions: [
          "Stand with feet together, weight balanced evenly",
          "Engage your thigh muscles and lift your kneecaps",
          "Lengthen your tailbone toward the floor",
          "Roll your shoulders back and down",
          "Reach the crown of your head toward the ceiling"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 10, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 20
      },

      // 2. Raised Arms Pose
      {
        name: "Raised Arms Pose",
        sanskritName: "Urdhva Hastasana",
        difficulty: "beginner",
        category: "standing",
        description: "Hands to Sky - Arms extended straight up overhead",
        benefits: ["Stretches shoulders and arms", "Improves digestion", "Calms the mind", "Strengthens upper back", "Improves posture"],
        precautions: ["Avoid if you have shoulder injuries", "Those with neck problems should gaze forward", "Avoid if you have high blood pressure"],
        idealAngles: {
          left_shoulder: { min: 160, max: 180, ideal: 170 },
          right_shoulder: { min: 160, max: 180, ideal: 170 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 165, max: 185, ideal: 175 },
          right_hip: { min: 165, max: 185, ideal: 175 },
          left_knee: { min: 165, max: 185, ideal: 175 },
          right_knee: { min: 165, max: 185, ideal: 175 }
        },
        instructions: [
          "Start in Mountain Pose (Tadasana)",
          "Inhale and sweep arms straight up overhead",
          "Keep arms straight with palms facing each other",
          "Press down through your feet",
          "Lift your chest and relax your shoulders",
          "Gaze forward or slightly up"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 10, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 20
      },

      // 3. Chair Pose
      {
        name: "Chair Pose",
        sanskritName: "Utkatasana",
        difficulty: "beginner",
        category: "standing",
        description: "Strengthening pose that builds leg and core strength",
        benefits: ["Strengthens legs and core", "Tones glutes", "Improves balance", "Stretches shoulders", "Builds endurance"],
        precautions: ["Avoid if you have knee injuries", "Those with low back pain should modify", "Avoid if you have high blood pressure"],
        idealAngles: {
          left_shoulder: { min: 160, max: 180, ideal: 170 },
          right_shoulder: { min: 160, max: 180, ideal: 170 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 100, max: 130, ideal: 115 },
          right_hip: { min: 100, max: 130, ideal: 115 },
          left_knee: { min: 100, max: 130, ideal: 115 },
          right_knee: { min: 100, max: 130, ideal: 115 }
        },
        instructions: [
          "Stand with feet together",
          "Bend knees as if sitting in a chair",
          "Keep knees behind toes",
          "Raise arms overhead with palms facing each other",
          "Engage core and lift chest"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 15, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 25
      },

      // 4. Warrior II
      {
        name: "Warrior II",
        sanskritName: "Virabhadrasana II",
        difficulty: "intermediate",
        category: "standing",
        description: "Powerful standing pose that builds strength and stamina",
        benefits: ["Strengthens legs and ankles", "Stretches hips and chest", "Builds stamina", "Improves concentration", "Opens shoulders"],
        precautions: ["Avoid if you have knee or hip injuries", "Those with neck problems should keep head neutral"],
        idealAngles: {
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 80, max: 110, ideal: 95 },
          right_hip: { min: 160, max: 200, ideal: 180 },
          left_knee: { min: 80, max: 105, ideal: 90 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Stand with feet 3-4 feet apart",
          "Turn right foot out 90°, left foot in slightly",
          "Bend right knee directly over ankle",
          "Keep left leg straight and strong",
          "Extend arms parallel to floor, palms down",
          "Gaze over right hand"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 15, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 25
      },

      // 5. Goddess Pose
      {
        name: "Goddess Pose",
        sanskritName: "Deviasana",
        difficulty: "beginner",
        category: "standing",
        description: "Empowering wide-legged squat that builds leg and core strength",
        benefits: ["Strengthens legs and glutes", "Opens hips and groin", "Improves posture", "Builds confidence", "Tones core and arms"],
        precautions: ["Avoid if you have knee injuries", "Those with hip problems should modify", "Use wall for support if needed"],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 80, max: 110, ideal: 95 },
          right_elbow: { min: 80, max: 110, ideal: 95 },
          left_hip: { min: 70, max: 100, ideal: 85 },
          right_hip: { min: 70, max: 100, ideal: 85 },
          left_knee: { min: 80, max: 110, ideal: 95 },
          right_knee: { min: 80, max: 110, ideal: 95 }
        },
        instructions: [
          "Stand with feet wide apart (3-4 feet)",
          "Turn toes outward at 45-degree angle",
          "Bend knees deeply, keeping them over ankles",
          "Lower your hips toward the ground",
          "Raise arms to shoulder height",
          "Bend elbows at 90 degrees",
          "Palms facing forward",
          "Engage core and keep chest lifted"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 15, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 25
      },

      // 6. Tree Pose
      {
        name: "Tree Pose",
        sanskritName: "Vrikshasana",
        difficulty: "intermediate",
        category: "balance",
        description: "Balancing pose that improves focus and stability",
        benefits: ["Improves balance", "Strengthens legs", "Opens hips", "Increases focus", "Builds confidence"],
        precautions: ["Use wall for support if needed", "Avoid if you have vertigo", "Those with knee injuries should keep foot below knee"],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 160, max: 180, ideal: 170 },
          right_hip: { min: 80, max: 100, ideal: 90 },
          left_knee: { min: 170, max: 180, ideal: 175 },
          right_knee: { min: 50, max: 70, ideal: 60 }
        },
        instructions: [
          "Stand on left leg with right knee bent",
          "Place right foot on inner left thigh",
          "Press foot and thigh firmly together",
          "Bring hands to prayer position at heart",
          "Focus on a fixed point in front of you"
        ],
        timerSettings: { defaultHoldTime: 25, minHoldTime: 15, maxHoldTime: 45, restTimeBetweenPoses: 15, breathingCycles: 4, holdTimeByLevel: { beginner: 15, intermediate: 25, advanced: 35 } },
        defaultTolerance: 25
      },

      // 7. Star Pose
     {
  name: "Star Pose",
  sanskritName: "Utthita Tadasana",
  difficulty: "beginner",
  category: "standing",
  description: "Five-Pointed Star Pose - Arms and legs spread wide like a star",
  benefits: [
    "Stretches entire body",
    "Opens chest and shoulders",
    "Improves circulation",
    "Builds confidence",
    "Releases tension"
  ],
  precautions: [
    "Keep knees slightly bent if needed",
    "Don't lock elbows",
    "Listen to your body"
  ],
  idealAngles: {
    left_shoulder: { min: 170, max: 190, ideal: 180 },
    right_shoulder: { min: 170, max: 190, ideal: 180 },
    left_elbow: { min: 160, max: 180, ideal: 170 },
    right_elbow: { min: 160, max: 180, ideal: 170 },
    left_hip: { min: 140, max: 170, ideal: 155 },
    right_hip: { min: 140, max: 170, ideal: 155 },
    left_knee: { min: 165, max: 185, ideal: 175 },
    right_knee: { min: 165, max: 185, ideal: 175 }
  },
  instructions: [
    "Start in Mountain Pose (Tadasana)",
    "Step or jump feet wide apart (3-4 feet)",
    "Extend arms straight out to sides at shoulder height",
    "Keep arms parallel to floor",
    "Palms facing forward",
    "Engage core and keep chest lifted",
    "Gaze forward",
    "Hold for 30-60 seconds"
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
  defaultTolerance: 20
},

      // 8. Standing Forward Fold
      {
        name: "Standing Forward Fold",
        sanskritName: "Uttanasana",
        difficulty: "beginner",
        category: "standing",
        description: "Forward bend that stretches hamstrings and calms the mind",
        benefits: ["Stretches hamstrings and calves", "Calms the mind", "Relieves tension", "Improves digestion"],
        precautions: ["Avoid if back injury", "Those with high blood pressure should keep head elevated", "Bend knees if needed"],
        idealAngles: {
          left_shoulder: { min: 10, max: 50, ideal: 30 },
          right_shoulder: { min: 10, max: 50, ideal: 30 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 150, max: 180, ideal: 165 },
          right_hip: { min: 150, max: 180, ideal: 165 },
          left_knee: { min: 160, max: 180, ideal: 170 },
          right_knee: { min: 160, max: 180, ideal: 170 }
        },
        instructions: [
          "Stand with feet together",
          "Exhale and fold forward from the hips",
          "Bend knees slightly if needed",
          "Let head hang heavy",
          "Grab opposite elbows or place hands on floor",
          "Hold for 30-60 seconds"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 10, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 25
      },

      // 9. Eagle Arms Pose
      {
        name: "Eagle Arms Pose",
        sanskritName: "Garudasana (Arms)",
        difficulty: "beginner",
        category: "standing",
        description: "Arm wrapping pose that opens shoulders and upper back",
        benefits: ["Stretches shoulders and upper back", "Improves flexibility", "Opens chest", "Relieves tension between shoulder blades"],
        precautions: ["Avoid if shoulder injury", "Those with wrist problems should modify"],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 130, max: 160, ideal: 145 },
          right_elbow: { min: 130, max: 160, ideal: 145 },
          left_hip: { min: 165, max: 185, ideal: 175 },
          right_hip: { min: 165, max: 185, ideal: 175 },
          left_knee: { min: 165, max: 185, ideal: 175 },
          right_knee: { min: 165, max: 185, ideal: 175 }
        },
        instructions: [
          "Stand in Mountain Pose",
          "Cross arms at the elbows",
          "Wrap forearms together",
          "Press palms to touch if possible",
          "Lift elbows slightly",
          "Relax shoulders away from ears"
        ],
        timerSettings: { defaultHoldTime: 30, minHoldTime: 15, maxHoldTime: 60, restTimeBetweenPoses: 10, breathingCycles: 5, holdTimeByLevel: { beginner: 20, intermediate: 30, advanced: 45 } },
        defaultTolerance: 25
      },

      // 10. Half Moon Pose
      {
        name: "Half Moon Pose",
        sanskritName: "Ardha Chandrasana",
        difficulty: "intermediate",
        category: "balance",
        description: "Side bend balancing pose that strengthens legs and core",
        benefits: ["Improves balance", "Strengthens legs and core", "Opens hips", "Stretches hamstrings", "Builds focus"],
        precautions: ["Avoid if low blood pressure", "Use wall for support", "Avoid if recent hip surgery"],
        idealAngles: {
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 150, max: 180, ideal: 165 },
          right_hip: { min: 70, max: 100, ideal: 85 },
          left_knee: { min: 165, max: 185, ideal: 175 },
          right_knee: { min: 165, max: 185, ideal: 175 }
        },
        instructions: [
          "Start in Warrior II position",
          "Lean forward and place bottom hand on floor or block",
          "Lift back leg parallel to floor",
          "Reach top arm up toward sky",
          "Stack shoulders vertically",
          "Gaze at top hand"
        ],
        timerSettings: { defaultHoldTime: 25, minHoldTime: 15, maxHoldTime: 45, restTimeBetweenPoses: 15, breathingCycles: 4, holdTimeByLevel: { beginner: 15, intermediate: 25, advanced: 35 } },
        defaultTolerance: 30
      }
    ];

    console.log(`Adding ${poses.length} yoga poses...`);
    
    for (const pose of poses) {
      await YogaPose.create(pose);
      console.log(`✅ Added: ${pose.name} (${pose.sanskritName})`);
    }

    console.log(`\n✅ All ${poses.length} poses seeded successfully!`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding poses:', error);
    process.exit(1);
  }
};

seedPoses();