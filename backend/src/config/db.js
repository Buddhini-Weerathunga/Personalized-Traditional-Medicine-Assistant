// backend/src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ MONGO_URI is missing in .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    await initializePoses();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    if (error.message.includes("querySrv")) {
      console.log(
        "👉 Fix: Check Atlas connection string, internet/DNS, and whitelist your IP in MongoDB Atlas.",
      );
    }

    process.exit(1);
  }
};

async function initializePoses() {
  const YogaPose = require("../models/YogaPose");

  const defaultPoses = [
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
      ],
      precautions: [
        "Avoid if you have low blood pressure",
        "Those with headaches should rest",
      ],
      idealAngles: {
        left_shoulder: { min: 165, max: 195, ideal: 180 },
        right_shoulder: { min: 165, max: 195, ideal: 180 },
        left_elbow: { min: 170, max: 190, ideal: 180 },
        right_elbow: { min: 170, max: 190, ideal: 180 },
        left_hip: { min: 170, max: 190, ideal: 180 },
        right_hip: { min: 170, max: 190, ideal: 180 },
        left_knee: { min: 175, max: 185, ideal: 180 },
        right_knee: { min: 175, max: 185, ideal: 180 },
      },
      instructions: [
        "Stand with feet together, weight balanced evenly",
        "Engage your thigh muscles and lift your kneecaps",
        "Lengthen your tailbone toward the floor",
        "Roll your shoulders back and down",
        "Reach the crown of your head toward the ceiling",
      ],
      duration: { recommended: 60, min: 30, max: 120 },
      defaultTolerance: 15,
      imageUrl: "/images/mountain-pose.jpg",
    },
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
      ],
      precautions: [
        "Avoid if you have knee or hip injuries",
        "Those with neck problems should keep head neutral",
      ],
      idealAngles: {
        left_shoulder: { min: 165, max: 195, ideal: 180 },
        right_shoulder: { min: 165, max: 195, ideal: 180 },
        left_elbow: { min: 170, max: 190, ideal: 180 },
        right_elbow: { min: 170, max: 190, ideal: 180 },
        left_hip: { min: 85, max: 105, ideal: 95 },
        right_hip: { min: 165, max: 195, ideal: 180 },
        left_knee: { min: 85, max: 100, ideal: 90 },
        right_knee: { min: 170, max: 190, ideal: 180 },
      },
      instructions: [
        "Stand with feet 3-4 feet apart",
        "Turn right foot out 90°, left foot in slightly",
        "Bend right knee directly over ankle",
        "Keep left leg straight and strong",
        "Extend arms parallel to floor",
        "Gaze over right hand",
      ],
      duration: { recommended: 60, min: 30, max: 120 },
      defaultTolerance: 20,
      imageUrl: "/images/warrior2.jpg",
    },
  ];

  for (const pose of defaultPoses) {
    await YogaPose.updateOne(
      { name: pose.name },
      { $setOnInsert: pose },
      { upsert: true },
    );
  }

  console.log("✅ Default yoga poses checked");
}

module.exports = connectDB;
