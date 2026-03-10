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

    // Define 12 unique yoga poses
    const poses = [
      // 1. Tadasana (Mountain Pose)
      {
        name: "Mountain Pose",
        sanskritName: "Tadasana",
        difficulty: "beginner",
        category: "standing",
        description: "Foundation pose that improves posture and body awareness",
        benefits: [
          "Improves posture", 
          "Strengthens thighs", 
          "Increases awareness", 
          "Reduces flat feet",
          "Improves balance"
        ],
        precautions: [
          "Avoid if you have low blood pressure", 
          "Those with headaches should rest"
        ],
        idealAngles: {
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },
          left_elbow: { min: 160, max: 200, ideal: 180 },
          right_elbow: { min: 160, max: 200, ideal: 180 },
          left_hip: { min: 170, max: 190, ideal: 180 },
          right_hip: { min: 170, max: 190, ideal: 180 },
          left_knee: { min: 175, max: 185, ideal: 180 },
          right_knee: { min: 175, max: 185, ideal: 180 }
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
        defaultTolerance: 20
      },

      // 2. Warrior II (Virabhadrasana II)
      {
        name: "Warrior II",
        sanskritName: "Virabhadrasana II",
        difficulty: "intermediate",
        category: "standing",
        description: "Powerful standing pose that builds strength and stamina",
        benefits: [
          "Strengthens legs and ankles", 
          "Stretches hips and chest", 
          "Builds stamina", 
          "Improves concentration",
          "Opens shoulders"
        ],
        precautions: [
          "Avoid if you have knee or hip injuries", 
          "Those with neck problems should keep head neutral"
        ],
        idealAngles: {
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },
          left_elbow: { min: 160, max: 200, ideal: 180 },
          right_elbow: { min: 160, max: 200, ideal: 180 },
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
          "Gaze over right hand",
          "Hold for 30-60 seconds, then switch sides"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 25
      },

      // 3. Tree Pose (Vrikshasana)
      {
        name: "Tree Pose",
        sanskritName: "Vrikshasana",
        difficulty: "intermediate",
        category: "balance",
        description: "Balancing pose that improves focus and stability",
        benefits: [
          "Improves balance", 
          "Strengthens legs", 
          "Opens hips", 
          "Increases focus",
          "Builds confidence"
        ],
        precautions: [
          "Use wall for support if needed", 
          "Avoid if you have vertigo",
          "Those with knee injuries should keep foot below knee"
        ],
        idealAngles: {
          left_shoulder: { min: 160, max: 200, ideal: 180 },
          right_shoulder: { min: 160, max: 200, ideal: 180 },
          left_elbow: { min: 160, max: 200, ideal: 180 },
          right_elbow: { min: 160, max: 200, ideal: 180 },
          left_hip: { min: 170, max: 190, ideal: 180 },
          right_hip: { min: 75, max: 105, ideal: 90 },
          left_knee: { min: 175, max: 185, ideal: 180 },
          right_knee: { min: 40, max: 80, ideal: 60 }
        },
        instructions: [
          "Stand on left leg with right knee bent",
          "Place right foot on inner left thigh (or calf if knee issues)",
          "Press foot and thigh firmly together",
          "Bring hands to prayer position at heart",
          "Focus on a fixed point in front of you",
          "Hold for 30-60 seconds, then switch sides"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 25
      },

      // 4. Warrior I (Virabhadrasana I)
      {
        name: "Warrior I",
        sanskritName: "Virabhadrasana I",
        difficulty: "intermediate",
        category: "standing",
        description: "Heart-opening standing pose that builds strength and focus",
        benefits: [
          "Strengthens legs and arms", 
          "Opens chest and shoulders", 
          "Improves balance", 
          "Builds stamina",
          "Stretches hip flexors"
        ],
        precautions: [
          "Avoid if you have knee injuries", 
          "Those with high blood pressure should modify",
          "Avoid if you have shoulder problems"
        ],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 80, max: 110, ideal: 95 },
          right_hip: { min: 160, max: 200, ideal: 180 },
          left_knee: { min: 80, max: 105, ideal: 90 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Stand with feet 3-4 feet apart",
          "Turn right foot out 90°, left foot in 45°",
          "Bend right knee directly over ankle",
          "Keep left leg straight and strong",
          "Raise arms overhead with palms facing each other",
          "Gaze forward or slightly up",
          "Hold for 30-60 seconds, then switch sides"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 25
      },

      // 5. Warrior III (Virabhadrasana III)
      {
        name: "Warrior III",
        sanskritName: "Virabhadrasana III",
        difficulty: "advanced",
        category: "balance",
        description: "Advanced balancing pose that builds core strength and focus",
        benefits: [
          "Strengthens legs and core", 
          "Improves balance", 
          "Builds focus", 
          "Tones entire body",
          "Improves posture"
        ],
        precautions: [
          "Avoid if you have hip injuries", 
          "Those with balance issues should use wall",
          "Avoid if you have high blood pressure"
        ],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 70, max: 100, ideal: 85 },
          right_hip: { min: 70, max: 100, ideal: 85 },
          left_knee: { min: 170, max: 190, ideal: 180 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Start in Warrior I position",
          "Shift weight onto front foot",
          "Lift back leg off floor as you hinge forward",
          "Bring torso and arms parallel to floor",
          "Keep standing leg strong but not locked",
          "Engage core for balance",
          "Hold for 15-30 seconds, then switch sides"
        ],
        timerSettings: {
          defaultHoldTime: 25,
          minHoldTime: 15,
          maxHoldTime: 45,
          restTimeBetweenPoses: 20,
          breathingCycles: 4,
          holdTimeByLevel: {
            beginner: 15,
            intermediate: 25,
            advanced: 35
          }
        },
        defaultTolerance: 25
      },

      // 6. Side Plank (Vasistasana)
      {
        name: "Side Plank",
        sanskritName: "Vasistasana",
        difficulty: "intermediate",
        category: "balance",
        description: "Strengthening pose that builds core and arm strength",
        benefits: [
          "Strengthens arms and core", 
          "Improves balance", 
          "Builds wrist strength", 
          "Tones obliques",
          "Improves focus"
        ],
        precautions: [
          "Avoid if you have wrist injuries", 
          "Those with elbow problems should modify",
          "Avoid if you have shoulder injuries"
        ],
        idealAngles: {
          left_shoulder: { min: 80, max: 110, ideal: 95 },
          right_shoulder: { min: 80, max: 110, ideal: 95 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 160, max: 200, ideal: 180 },
          right_hip: { min: 160, max: 200, ideal: 180 },
          left_knee: { min: 170, max: 190, ideal: 180 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Start in plank position",
          "Shift weight onto right hand",
          "Stack left foot on top of right",
          "Lift left arm toward ceiling",
          "Keep body in straight line",
          "Hold for 15-30 seconds, then switch sides"
        ],
        timerSettings: {
          defaultHoldTime: 25,
          minHoldTime: 15,
          maxHoldTime: 45,
          restTimeBetweenPoses: 15,
          breathingCycles: 4,
          holdTimeByLevel: {
            beginner: 15,
            intermediate: 25,
            advanced: 35
          }
        },
        defaultTolerance: 25
      },

      // 7. Thunderbolt Pose (Vajirasana)
      {
        name: "Thunderbolt Pose",
        sanskritName: "Vajirasana",
        difficulty: "beginner",
        category: "seated",
        description: "Meditative seated pose that aids digestion",
        benefits: [
          "Improves digestion", 
          "Strengthens pelvic floor", 
          "Calms the mind", 
          "Good for meditation",
          "Relieves knee pain"
        ],
        precautions: [
          "Avoid if you have knee injuries", 
          "Those with ankle problems should use cushion"
        ],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 140, max: 170, ideal: 155 },
          right_hip: { min: 140, max: 170, ideal: 155 },
          left_knee: { min: 30, max: 60, ideal: 45 },
          right_knee: { min: 30, max: 60, ideal: 45 }
        },
        instructions: [
          "Kneel on floor with knees together",
          "Sit back on heels",
          "Place hands on thighs",
          "Keep spine straight and tall",
          "Close eyes and breathe deeply",
          "Hold for 1-5 minutes"
        ],
        timerSettings: {
          defaultHoldTime: 60,
          minHoldTime: 30,
          maxHoldTime: 180,
          restTimeBetweenPoses: 15,
          breathingCycles: 10,
          holdTimeByLevel: {
            beginner: 45,
            intermediate: 60,
            advanced: 90
          }
        },
        defaultTolerance: 20
      },

      // 8. Chair Pose (Utkatasana)
      {
        name: "Chair Pose",
        sanskritName: "Utkatasana",
        difficulty: "beginner",
        category: "standing",
        description: "Strengthening pose that builds leg and core strength",
        benefits: [
          "Strengthens legs and core", 
          "Tones glutes", 
          "Improves balance", 
          "Stretches shoulders",
          "Builds endurance"
        ],
        precautions: [
          "Avoid if you have knee injuries", 
          "Those with low back pain should modify",
          "Avoid if you have high blood pressure"
        ],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 100, max: 130, ideal: 115 },
          right_hip: { min: 100, max: 130, ideal: 115 },
          left_knee: { min: 100, max: 130, ideal: 115 },
          right_knee: { min: 100, max: 130, ideal: 115 }
        },
        instructions: [
          "Stand with feet together",
          "Bend knees as if sitting in chair",
          "Keep knees behind toes",
          "Raise arms overhead",
          "Engage core and lift chest",
          "Hold for 30-60 seconds"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 25
      },

      // 9. Plank Pose (Phalakasana)
      {
        name: "Plank Pose",
        sanskritName: "Phalakasana",
        difficulty: "beginner",
        category: "prone",
        description: "Core strengthening pose that builds full body endurance",
        benefits: [
          "Strengthens core", 
          "Builds arm strength", 
          "Tones entire body", 
          "Improves posture",
          "Builds endurance"
        ],
        precautions: [
          "Avoid if you have wrist injuries", 
          "Those with shoulder problems should modify",
          "Avoid if you have high blood pressure"
        ],
        idealAngles: {
          left_shoulder: { min: 80, max: 110, ideal: 95 },
          right_shoulder: { min: 80, max: 110, ideal: 95 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 170, max: 190, ideal: 180 },
          right_hip: { min: 170, max: 190, ideal: 180 },
          left_knee: { min: 170, max: 190, ideal: 180 },
          right_knee: { min: 170, max: 190, ideal: 180 }
        },
        instructions: [
          "Start on hands and knees",
          "Step feet back, straighten legs",
          "Stack shoulders over wrists",
          "Engage core and glutes",
          "Keep body in straight line",
          "Hold for 30-60 seconds"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 20
      },

      // 10. Goddess Pose
      {
        name: "Goddess Pose",
        sanskritName: "Deviasana",
        difficulty: "beginner",
        category: "standing",
        description: "Empowering pose that opens hips and builds leg strength",
        benefits: [
          "Strengthens legs and glutes", 
          "Opens hips", 
          "Improves posture", 
          "Builds confidence",
          "Tones core"
        ],
        precautions: [
          "Avoid if you have knee injuries", 
          "Those with hip problems should modify"
        ],
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
          "Stand with feet wide, toes turned out",
          "Bend knees, lowering hips",
          "Keep knees over ankles",
          "Raise arms to shoulder height, bend elbows",
          "Lift chest and engage core",
          "Hold for 30-60 seconds"
        ],
        timerSettings: {
          defaultHoldTime: 30,
          minHoldTime: 15,
          maxHoldTime: 60,
          restTimeBetweenPoses: 15,
          breathingCycles: 5,
          holdTimeByLevel: {
            beginner: 20,
            intermediate: 30,
            advanced: 45
          }
        },
        defaultTolerance: 25
      },

      // 11. Downward Dog
      {
        name: "Downward Dog",
        sanskritName: "Adho Mukha Svanasana",
        difficulty: "beginner",
        category: "prone",
        description: "Inverted pose that stretches and strengthens the entire body",
        benefits: [
          "Stretches hamstrings and calves", 
          "Strengthens arms and shoulders", 
          "Relieves back pain", 
          "Increases blood flow",
          "Energizes the body"
        ],
        precautions: [
          "Avoid if you have carpal tunnel syndrome", 
          "Those with high blood pressure should modify",
          "Avoid if you have shoulder injuries"
        ],
        idealAngles: {
          left_shoulder: { min: 110, max: 140, ideal: 125 },
          right_shoulder: { min: 110, max: 140, ideal: 125 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 70, max: 100, ideal: 85 },
          right_hip: { min: 70, max: 100, ideal: 85 },
          left_knee: { min: 160, max: 180, ideal: 170 },
          right_knee: { min: 160, max: 180, ideal: 170 }
        },
        instructions: [
          "Start on hands and knees",
          "Tuck toes and lift knees off floor",
          "Push hips up and back",
          "Straighten legs as much as possible",
          "Press heels toward floor",
          "Relax head between arms",
          "Hold for 5-10 breaths"
        ],
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
        defaultTolerance: 25
      },

      // 12. Hero Pose (Virasana)
      {
        name: "Hero Pose",
        sanskritName: "Virasana",
        difficulty: "intermediate",
        category: "seated",
        description: "Meditative seated pose that stretches thighs and knees",
        benefits: [
          "Stretches thighs and knees", 
          "Improves posture", 
          "Calms the mind", 
          "Good for meditation",
          "Relieves tired legs"
        ],
        precautions: [
          "Avoid if you have knee injuries", 
          "Those with ankle problems should use props",
          "Avoid if you have recent leg surgery"
        ],
        idealAngles: {
          left_shoulder: { min: 30, max: 60, ideal: 45 },
          right_shoulder: { min: 30, max: 60, ideal: 45 },
          left_elbow: { min: 160, max: 180, ideal: 170 },
          right_elbow: { min: 160, max: 180, ideal: 170 },
          left_hip: { min: 140, max: 170, ideal: 155 },
          right_hip: { min: 140, max: 170, ideal: 155 },
          left_knee: { min: 30, max: 60, ideal: 45 },
          right_knee: { min: 30, max: 60, ideal: 45 }
        },
        instructions: [
          "Kneel on floor with knees together",
          "Separate feet slightly wider than hips",
          "Sit down between feet",
          "Place hands on thighs",
          "Keep spine straight and tall",
          "Hold for 1-3 minutes"
        ],
        timerSettings: {
          defaultHoldTime: 45,
          minHoldTime: 30,
          maxHoldTime: 120,
          restTimeBetweenPoses: 15,
          breathingCycles: 7,
          holdTimeByLevel: {
            beginner: 30,
            intermediate: 45,
            advanced: 60
          }
        },
        defaultTolerance: 20
      }
    ];

    // Insert all poses
    console.log(`Adding ${poses.length} unique yoga poses...`);
    
    for (const pose of poses) {
      await YogaPose.create(pose);
      console.log(`✅ Added: ${pose.name} (${pose.sanskritName}) - ${pose.difficulty}`);
    }

    console.log('\n✅ All 12 poses seeded successfully!');
    console.log('\n📋 Pose List:');
    poses.forEach((pose, index) => {
      console.log(`${index + 1}. ${pose.name} (${pose.sanskritName}) - ${pose.difficulty}`);
    });
    
    // Show summary by difficulty
    const beginnerCount = poses.filter(p => p.difficulty === 'beginner').length;
    const intermediateCount = poses.filter(p => p.difficulty === 'intermediate').length;
    const advancedCount = poses.filter(p => p.difficulty === 'advanced').length;
    
    console.log('\n📊 Summary:');
    console.log(`Beginner: ${beginnerCount} poses`);
    console.log(`Intermediate: ${intermediateCount} poses`);
    console.log(`Advanced: ${advancedCount} poses`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding poses:', error);
    process.exit(1);
  }
};

seedPoses();