import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  BarChart3, 
  Settings, 
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Volume2,
  Eye,
  Maximize2,
  Minimize2,
  Zap,
  Heart,
  Shield,
  Users,
  Calendar,
  Target as TargetIcon,
  ChevronRight,
  Star,
  Download,
  Share2,
  HelpCircle,
  Moon,
  Sun,
  FlipHorizontal,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function YogaConsultation() {
  const [currentView, setCurrentView] = useState('library');
  const [selectedPose, setSelectedPose] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const [feedback, setFeedback] = useState({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
  const [poses, setPoses] = useState([]);
  const [userProgress, setUserProgress] = useState({
    overallStats: { totalSessions: 12, totalDuration: 240, averageScore: 78 },
    streak: { current: 5, longest: 12 },
    poseProficiency: [
      { poseId: '1', attempts: 5, bestScore: 92, averageScore: 85 },
      { poseId: '2', attempts: 3, bestScore: 78, averageScore: 75 },
      { poseId: '3', attempts: 4, bestScore: 85, averageScore: 80 }
    ]
  });
  const [personalization, setPersonalization] = useState({
    age: 28,
    flexibilityLevel: 'medium',
    mobilityRestrictions: [],
    preferredFeedback: 'both',
    theme: 'light'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [detectionMode, setDetectionMode] = useState('simulation');
  const [sessionHistory, setSessionHistory] = useState([
    { date: '2024-01-15', pose: 'Mountain Pose', score: 85, duration: 15 },
    { date: '2024-01-16', pose: 'Downward Dog', score: 78, duration: 20 },
    { date: '2024-01-17', pose: 'Warrior II', score: 92, duration: 25 },
    { date: '2024-01-18', pose: 'Tree Pose', score: 88, duration: 18 },
    { date: '2024-01-19', pose: 'Mountain Pose', score: 90, duration: 22 }
  ]);
  
  const [bodyPosition, setBodyPosition] = useState({
    x: 0.5, // normalized position (0-1)
    y: 0.5,
    scale: 1,
    rotation: 0,
    leaning: 0
  });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraContainerRef = useRef(null);
  const simulationIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Sample yoga poses data with more details
  useEffect(() => {
    setPoses([
      {
        id: '1',
        name: 'Mountain Pose',
        sanskritName: 'Tadasana',
        difficulty: 'beginner',
        category: 'standing',
        description: 'Foundation for all standing poses that improves posture, balance, and body awareness. Aligns the body from head to toe.',
        benefits: ['Improves posture', 'Strengthens thighs, knees, and ankles', 'Firms abdomen and buttocks', 'Relieves sciatica', 'Reduces flat feet'],
        precautions: ['Avoid if you have low blood pressure or headaches', 'Those with insomnia should practice with caution'],
        instructions: [
          'Stand with feet together or hip-width apart',
          'Distribute weight evenly on both feet',
          'Engage thigh muscles and lift kneecaps',
          'Lengthen tailbone toward floor',
          'Roll shoulders back and down',
          'Keep arms straight with palms facing body',
          'Tuck chin slightly and gaze forward',
          'Hold for 30-60 seconds, breathing deeply'
        ],
        duration: { recommended: 60, min: 30, max: 120 },
        level: 1,
        popularity: 95,
        calories: 10
      },
      {
        id: '2',
        name: 'Downward Facing Dog',
        sanskritName: 'Adho Mukha Svanasana',
        difficulty: 'beginner',
        category: 'inversion',
        description: 'A rejuvenating pose that stretches the entire body while building strength. Often used as a resting pose between sequences.',
        benefits: ['Stretches hamstrings, calves, and shoulders', 'Strengthens arms and legs', 'Calms the mind and relieves stress', 'Improves digestion', 'Energizes the body'],
        precautions: ['Avoid in late-term pregnancy', 'Those with carpal tunnel syndrome should be cautious', 'Not recommended for high blood pressure'],
        instructions: [
          'Start on hands and knees (tabletop position)',
          'Place hands shoulder-width apart',
          'Tuck toes and lift hips toward ceiling',
          'Straighten legs without locking knees',
          'Press hands firmly into mat, spreading fingers',
          'Draw shoulder blades together and down',
          'Keep head between arms, ears aligned with upper arms',
          'Hold for 1-3 minutes, breathing deeply'
        ],
        duration: { recommended: 90, min: 45, max: 180 },
        level: 2,
        popularity: 98,
        calories: 15
      },
      {
        id: '3',
        name: 'Warrior II',
        sanskritName: 'Virabhadrasana II',
        difficulty: 'intermediate',
        category: 'standing',
        description: 'A powerful standing pose that builds strength, stability, and concentration while opening the hips and chest.',
        benefits: ['Strengthens legs and ankles', 'Stretches groins, chest and lungs', 'Increases stamina', 'Relieves backaches', 'Therapeutic for carpal tunnel syndrome'],
        precautions: ['Avoid if you have knee or hip injuries', 'Those with neck problems should keep head neutral'],
        instructions: [
          'Stand with feet 3-4 feet apart',
          'Turn right foot out 90 degrees, left foot in slightly',
          'Bend right knee directly over ankle',
          'Keep left leg straight and strong',
          'Extend arms parallel to floor, palms down',
          'Gaze over right hand',
          'Keep shoulders relaxed and torso centered',
          'Hold for 30-60 seconds, then switch sides'
        ],
        duration: { recommended: 60, min: 30, max: 120 },
        level: 3,
        popularity: 90,
        calories: 20
      },
      {
        id: '4',
        name: 'Tree Pose',
        sanskritName: 'Vrikshasana',
        difficulty: 'intermediate',
        category: 'balance',
        description: 'A balancing pose that improves focus, stability, and concentration while strengthening the legs and core.',
        benefits: ['Improves balance and coordination', 'Strengthens legs, ankles, and core', 'Increases focus and concentration', 'Opens hips', 'Builds confidence'],
        precautions: ['Use wall for support if needed', 'Avoid if you have vertigo', 'Those with knee injuries should be cautious'],
        instructions: [
          'Stand on left leg with right knee bent',
          'Place right foot on inner left thigh or calf (avoid knee)',
          'Press foot and thigh firmly together',
          'Bring hands to prayer position at heart center',
          'Focus on a fixed point in front of you',
          'Optionally raise arms overhead like branches',
          'Keep standing leg strong, engage core',
          'Hold for 30-60 seconds, then switch sides'
        ],
        duration: { recommended: 45, min: 30, max: 90 },
        level: 3,
        popularity: 85,
        calories: 12
      },
      {
        id: '5',
        name: 'Child\'s Pose',
        sanskritName: 'Balasana',
        difficulty: 'beginner',
        category: 'seated',
        description: 'A gentle resting pose that provides relief from stress and fatigue while gently stretching the back, hips, and thighs.',
        benefits: ['Relieves back and neck pain', 'Calms the brain and relieves stress', 'Stretches hips, thighs, and ankles', 'Helps with digestion', 'Reduces fatigue and dizziness'],
        precautions: ['Avoid during pregnancy', 'Those with knee injuries should use padding'],
        instructions: [
          'Kneel on floor with big toes touching',
          'Sit back on heels, knees hip-width apart',
          'Fold forward, resting torso between thighs',
          'Extend arms forward or rest by sides',
          'Rest forehead on mat or cushion',
          'Allow entire body to relax',
          'Breathe deeply into the back',
          'Hold for 1-5 minutes as needed'
        ],
        duration: { recommended: 120, min: 60, max: 300 },
        level: 1,
        popularity: 92,
        calories: 5
      },
      {
        id: '6',
        name: 'Cobra Pose',
        sanskritName: 'Bhujangasana',
        difficulty: 'beginner',
        category: 'prone',
        description: 'A gentle backbend that strengthens the spine while opening the chest and shoulders. Excellent for improving posture.',
        benefits: ['Strengthens the spine', 'Stretches chest and lungs', 'Firms buttocks', 'Stimulates abdominal organs', 'Helps relieve stress and fatigue'],
        precautions: ['Avoid during pregnancy', 'Those with back injuries should be cautious'],
        instructions: [
          'Lie prone with legs extended, tops of feet on floor',
          'Place hands under shoulders, elbows close to body',
          'Press tops of feet and thighs firmly into floor',
          'Inhale and slowly lift chest off floor',
          'Keep elbows slightly bent, shoulders away from ears',
          'Gaze forward or slightly upward',
          'Hold for 15-30 seconds, breathing normally',
          'Exhale and lower back down'
        ],
        duration: { recommended: 45, min: 30, max: 90 },
        level: 2,
        popularity: 88,
        calories: 10
      }
    ]);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(!!fullscreenElement);
      
      // Update mirror state when entering/exiting fullscreen
      if (!fullscreenElement) {
        // When exiting fullscreen, enable mirroring again
        setIsMirrored(true);
      } else {
        // When entering fullscreen, disable mirroring
        setIsMirrored(false);
      }
      
      // Force a redraw of the canvas
      if (isPracticing) {
        drawSkeletonOverlay();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isPracticing]);

  // Camera initialization
  const initializeCamera = async () => {
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
          startPoseSimulation();
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(`Camera error: ${error.message}. Using simulation mode.`);
      setIsCameraActive(false);
      startPoseSimulation();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    
    // Clear simulation interval
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  // Simulate body movement based on pose type
  const simulateBodyMovement = () => {
    if (!selectedPose) return bodyPosition;
    
    const poseName = selectedPose.name.toLowerCase();
    let newPosition = { ...bodyPosition };
    
    // Add some natural movement and drift
    const driftSpeed = 0.002;
    const movementSpeed = 0.005;
    
    // Natural body sway
    newPosition.x += (Math.random() - 0.5) * driftSpeed;
    newPosition.y += (Math.random() - 0.5) * driftSpeed;
    newPosition.rotation += (Math.random() - 0.5) * 0.5;
    newPosition.leaning += (Math.random() - 0.5) * 0.3;
    
    // Keep within bounds
    newPosition.x = Math.max(0.3, Math.min(0.7, newPosition.x));
    newPosition.y = Math.max(0.4, Math.min(0.6, newPosition.y));
    newPosition.rotation = Math.max(-5, Math.min(5, newPosition.rotation));
    newPosition.leaning = Math.max(-10, Math.min(10, newPosition.leaning));
    
    // Simulate pose-specific movements
    if (poseName.includes('mountain')) {
      // Mountain Pose - centered, upright
      newPosition.x = 0.5 + (Math.random() - 0.5) * 0.1;
      newPosition.y = 0.5;
      newPosition.rotation *= 0.5; // Less rotation
    } else if (poseName.includes('warrior')) {
      // Warrior Pose - side lean
      newPosition.x = 0.6 + (Math.random() - 0.5) * 0.15;
      newPosition.leaning = 5 + (Math.random() - 0.5) * 2;
    } else if (poseName.includes('tree')) {
      // Tree Pose - slight sway
      newPosition.rotation = Math.sin(Date.now() / 1000) * 3;
      newPosition.leaning = Math.sin(Date.now() / 800) * 2;
    } else if (poseName.includes('child')) {
      // Child's Pose - lower position
      newPosition.y = 0.7;
      newPosition.x = 0.5;
    } else if (poseName.includes('cobra')) {
      // Cobra Pose - upward
      newPosition.y = 0.4;
      newPosition.leaning = -5;
    } else if (poseName.includes('downward')) {
      // Downward Dog - inverted V shape
      newPosition.y = 0.6;
      newPosition.x = 0.5;
    }
    
    // Add scale variation based on "distance from camera"
    newPosition.scale = 0.9 + Math.sin(Date.now() / 2000) * 0.1;
    
    setBodyPosition(newPosition);
    return newPosition;
  };

  // Pose simulation (mock AI detection)
  const startPoseSimulation = () => {
    // Clear any existing interval
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    
    const simulateDetection = () => {
      if (!isPracticing) {
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
          simulationIntervalRef.current = null;
        }
        return;
      }

      // Simulate body movement first
      const bodyPos = simulateBodyMovement();
      
      // Generate angles based on current pose and body position
      const mockAngles = generateMockAngles(bodyPos);
      analyzePose(mockAngles);
      drawSkeletonOverlay(bodyPos);
      
      // Simulate occasional corrections
      if (Math.random() > 0.7) {
        simulateCorrection();
      }
    };

    // Start immediately and then every 2 seconds
    simulateDetection();
    simulationIntervalRef.current = setInterval(simulateDetection, 2000);
  };

  const drawSkeletonOverlay = (bodyPos = bodyPosition) => {
    if (!canvasRef.current || !cameraContainerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = cameraContainerRef.current;
    
    // Set canvas size to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate position based on body position
    const centerX = canvas.width * bodyPos.x;
    const centerY = canvas.height * bodyPos.y;
    const scale = bodyPos.scale;
    const rotation = (bodyPos.rotation * Math.PI) / 180;
    const leaning = (bodyPos.leaning * Math.PI) / 180;

    // If mirrored, flip the drawing context
    if (isMirrored) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    // Apply transformations for body position
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    // Apply leaning effect
    ctx.transform(1, Math.tan(leaning) * 0.3, 0, 1, 0, 0);

    // Adjust skeleton size based on container size
    const baseSize = Math.min(canvas.width, canvas.height) / 4;
    const skeletonSize = baseSize;
    const limbLength = skeletonSize * 0.6;
    const legLength = skeletonSize * 1.2;

    // Draw body lines with more natural colors
    ctx.strokeStyle = '#60A5FA'; // Brighter blue
    ctx.lineWidth = 6 * (scale * 0.8);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Torso with slight curve
    ctx.beginPath();
    ctx.moveTo(0, -skeletonSize * 0.9);
    ctx.bezierCurveTo(
      skeletonSize * 0.1, -skeletonSize * 0.6,
      skeletonSize * 0.1, skeletonSize * 0.1,
      0, skeletonSize * 0.1
    );
    ctx.stroke();

    // Shoulders with natural curve
    const shoulderHeight = -skeletonSize * 0.7;
    ctx.beginPath();
    ctx.moveTo(-limbLength * 0.3, shoulderHeight);
    ctx.bezierCurveTo(
      -limbLength * 0.6, shoulderHeight + skeletonSize * 0.1,
      -limbLength * 0.9, shoulderHeight + skeletonSize * 0.3,
      -limbLength, shoulderHeight + skeletonSize * 0.4
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(limbLength * 0.3, shoulderHeight);
    ctx.bezierCurveTo(
      limbLength * 0.6, shoulderHeight + skeletonSize * 0.1,
      limbLength * 0.9, shoulderHeight + skeletonSize * 0.3,
      limbLength, shoulderHeight + skeletonSize * 0.4
    );
    ctx.stroke();

    // Legs with slight bend
    const hipHeight = skeletonSize * 0.1;
    ctx.beginPath();
    ctx.moveTo(-limbLength * 0.2, hipHeight);
    ctx.bezierCurveTo(
      -limbLength * 0.4, hipHeight + legLength * 0.3,
      -limbLength * 0.3, hipHeight + legLength * 0.7,
      -limbLength * 0.4, hipHeight + legLength
    );
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(limbLength * 0.2, hipHeight);
    ctx.bezierCurveTo(
      limbLength * 0.4, hipHeight + legLength * 0.3,
      limbLength * 0.3, hipHeight + legLength * 0.7,
      limbLength * 0.4, hipHeight + legLength
    );
    ctx.stroke();

    // Draw joints with gradient effects
    const joints = [
      [0, -skeletonSize * 0.9, 12 * scale, '#EF4444', 'Head'], // Head
      [-limbLength * 0.3, shoulderHeight, 10 * scale, '#10B981', 'Left Shoulder'],
      [limbLength * 0.3, shoulderHeight, 10 * scale, '#10B981', 'Right Shoulder'],
      [-limbLength, shoulderHeight + skeletonSize * 0.4, 8 * scale, '#F59E0B', 'Left Elbow'],
      [limbLength, shoulderHeight + skeletonSize * 0.4, 8 * scale, '#F59E0B', 'Right Elbow'],
      [-limbLength * 0.2, hipHeight, 10 * scale, '#EC4899', 'Left Hip'],
      [limbLength * 0.2, hipHeight, 10 * scale, '#EC4899', 'Right Hip'],
      [-limbLength * 0.4, hipHeight + legLength * 0.5, 8 * scale, '#6366F1', 'Left Knee'],
      [limbLength * 0.4, hipHeight + legLength * 0.5, 8 * scale, '#6366F1', 'Right Knee'],
      [-limbLength * 0.4, hipHeight + legLength, 7 * scale, '#14B8A6', 'Left Ankle'],
      [limbLength * 0.4, hipHeight + legLength, 7 * scale, '#14B8A6', 'Right Ankle'],
    ];

    joints.forEach(([x, y, radius, color, label]) => {
      // Create gradient for joints
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
      
      // Draw joint circle with gradient
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw white border with glow effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      
      // Draw label with background for better visibility
      if (!isFullscreen) { // Only show labels in non-fullscreen mode
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const textWidth = ctx.measureText(label).width;
        const padding = 4 * scale;
        ctx.fillRect(
          x - textWidth/2 - padding,
          y - radius - 20 * scale,
          textWidth + padding * 2,
          16 * scale
        );
        
        ctx.fillStyle = 'white';
        ctx.font = `bold ${10 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - radius - 10 * scale);
      }
    });

    // Draw connection lines between joints
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
    ctx.lineWidth = 3 * scale;
    
    // Head to shoulders
    ctx.beginPath();
    ctx.moveTo(0, -skeletonSize * 0.9);
    ctx.lineTo(-limbLength * 0.3, shoulderHeight);
    ctx.moveTo(0, -skeletonSize * 0.9);
    ctx.lineTo(limbLength * 0.3, shoulderHeight);
    ctx.stroke();
    
    // Shoulders to hips
    ctx.beginPath();
    ctx.moveTo(-limbLength * 0.3, shoulderHeight);
    ctx.lineTo(-limbLength * 0.2, hipHeight);
    ctx.moveTo(limbLength * 0.3, shoulderHeight);
    ctx.lineTo(limbLength * 0.2, hipHeight);
    ctx.stroke();
    
    // Hips to knees
    ctx.beginPath();
    ctx.moveTo(-limbLength * 0.2, hipHeight);
    ctx.lineTo(-limbLength * 0.4, hipHeight + legLength * 0.5);
    ctx.moveTo(limbLength * 0.2, hipHeight);
    ctx.lineTo(limbLength * 0.4, hipHeight + legLength * 0.5);
    ctx.stroke();
    
    // Knees to ankles
    ctx.beginPath();
    ctx.moveTo(-limbLength * 0.4, hipHeight + legLength * 0.5);
    ctx.lineTo(-limbLength * 0.4, hipHeight + legLength);
    ctx.moveTo(limbLength * 0.4, hipHeight + legLength * 0.5);
    ctx.lineTo(limbLength * 0.4, hipHeight + legLength);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
    
    // Restore mirror transformation
    if (isMirrored) {
      ctx.restore();
    }

    // Draw angle indicators
    if (feedback && feedback.postureAccuracy > 0) {
      const fontSize = isFullscreen ? 20 : 16;
      const textScale = Math.min(canvas.width / 800, 1);
      
      ctx.fillStyle = feedback.postureAccuracy > 80 ? '#10B981' : 
                     feedback.postureAccuracy > 60 ? '#F59E0B' : '#EF4444';
      ctx.font = `bold ${fontSize * textScale}px Arial`;
      ctx.textAlign = 'left';
      
      // Adjust text position based on mirroring
      const textX = isMirrored ? canvas.width - 220 * textScale : 20 * textScale;
      const textY = 40 * textScale;
      
      // Add background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(textX - 10, textY - 25, 200 * textScale, 80 * textScale);
      
      ctx.fillStyle = feedback.postureAccuracy > 80 ? '#10B981' : 
                     feedback.postureAccuracy > 60 ? '#F59E0B' : '#EF4444';
      ctx.fillText(`Accuracy: ${feedback.postureAccuracy}%`, textX, textY);
      
      // Draw correction indicators if any
      if (corrections.length > 0 && !isFullscreen) {
        ctx.fillStyle = '#EF4444';
        ctx.font = `${14 * textScale}px Arial`;
        ctx.fillText(`${corrections.length} corrections needed`, textX, textY + 25 * textScale);
      }
    }

    // Draw body position indicators (for debugging/visualization)
    if (isPracticing && !isFullscreen) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Position: ${Math.round(bodyPos.x * 100)}%, ${Math.round(bodyPos.y * 100)}%`, canvas.width - 10, canvas.height - 30);
      ctx.fillText(`Scale: ${bodyPos.scale.toFixed(2)}`, canvas.width - 10, canvas.height - 15);
    }
  };

  const generateMockAngles = (bodyPos) => {
    // Generate angles that simulate the current body position
    const baseAngles = {
      left_shoulder: 180 + (Math.random() * 30 - 15) + bodyPos.leaning * 0.5,
      right_shoulder: 180 + (Math.random() * 30 - 15) + bodyPos.leaning * 0.5,
      left_elbow: 160 + (Math.random() * 40 - 20) + bodyPos.rotation * 2,
      right_elbow: 160 + (Math.random() * 40 - 20) - bodyPos.rotation * 2,
      left_hip: 180 + (Math.random() * 25 - 12) + bodyPos.leaning * 0.8,
      right_hip: 180 + (Math.random() * 25 - 12) + bodyPos.leaning * 0.8,
      left_knee: 175 + (Math.random() * 30 - 15) + Math.abs(bodyPos.rotation) * 3,
      right_knee: 175 + (Math.random() * 30 - 15) + Math.abs(bodyPos.rotation) * 3,
      spine_angle: 180 + (Math.random() * 20 - 10) + bodyPos.leaning,
      neck_angle: 90 + (Math.random() * 20 - 10) + bodyPos.rotation
    };
    
    // Adjust based on selected pose
    if (selectedPose) {
      const poseName = selectedPose.name.toLowerCase();
      
      if (poseName.includes('mountain')) {
        baseAngles.left_shoulder = 180;
        baseAngles.right_shoulder = 180;
        baseAngles.spine_angle = 180;
      } else if (poseName.includes('warrior')) {
        baseAngles.left_hip = 150;
        baseAngles.right_hip = 210;
        baseAngles.left_knee = 120;
      } else if (poseName.includes('tree')) {
        baseAngles.left_hip = 170;
        baseAngles.right_hip = 90;
        baseAngles.right_knee = 45;
      } else if (poseName.includes('downward')) {
        baseAngles.left_shoulder = 60;
        baseAngles.right_shoulder = 60;
        baseAngles.left_hip = 90;
        baseAngles.right_hip = 90;
      }
    }
    
    return baseAngles;
  };

  const analyzePose = (jointAngles) => {
    const newCorrections = [];
    let totalDeviation = 0;
    
    // Analyze each joint based on pose type
    const analyzeJoint = (joint, value, ideal, tolerance, messageHigh, messageLow) => {
      const deviation = Math.abs(value - ideal);
      totalDeviation += deviation;
      
      if (deviation > tolerance) {
        newCorrections.push({
          joint,
          message: value > ideal ? messageHigh : messageLow,
          severity: deviation > tolerance * 1.5 ? 'high' : 'medium',
          type: Math.random() > 0.5 ? 'both' : 'visual'
        });
      }
    };

    // Analyze based on selected pose
    if (selectedPose) {
      const poseName = selectedPose.name.toLowerCase();
      
      if (poseName.includes('mountain')) {
        analyzeJoint('left_shoulder', jointAngles.left_shoulder, 180, 15, 'Lower left shoulder', 'Raise left shoulder');
        analyzeJoint('right_shoulder', jointAngles.right_shoulder, 180, 15, 'Lower right shoulder', 'Raise right shoulder');
        analyzeJoint('spine', jointAngles.spine_angle, 180, 12, 'Lean forward slightly', 'Stand up straighter');
      } else if (poseName.includes('warrior')) {
        analyzeJoint('right_hip', jointAngles.right_hip, 210, 20, 'Bend right knee more', 'Straighten right leg');
        analyzeJoint('left_hip', jointAngles.left_hip, 150, 20, 'Straighten left leg more', 'Bend left knee slightly');
      } else if (poseName.includes('tree')) {
        analyzeJoint('right_hip', jointAngles.right_hip, 90, 25, 'Bring right foot higher', 'Lower right foot slightly');
        analyzeJoint('left_knee', jointAngles.left_knee, 175, 10, 'Soften left knee', 'Lock left knee');
      }
    }

    // General analysis for all poses
    analyzeJoint(
      'left_shoulder', 
      jointAngles.left_shoulder, 
      180, 
      15,
      'Lower your left shoulder',
      'Raise your left shoulder'
    );
    
    analyzeJoint(
      'right_shoulder', 
      jointAngles.right_shoulder, 
      180, 
      15,
      'Lower your right shoulder',
      'Raise your right shoulder'
    );

    // Analyze spine
    if (Math.abs(jointAngles.spine_angle - 180) > 15) {
      newCorrections.push({
        joint: 'spine',
        message: jointAngles.spine_angle > 180 ? 'Lean forward slightly' : 'Straighten your back',
        severity: 'medium',
        type: 'both'
      });
      totalDeviation += 15;
    }

    setCorrections(newCorrections);
    
    // Calculate scores
    const baseScore = 100;
    const deductionPerCorrection = 8;
    const deviationDeduction = totalDeviation * 0.5;
    
    const postureAccuracy = Math.max(0, Math.min(100, 
      baseScore - (newCorrections.length * deductionPerCorrection) - deviationDeduction
    ));
    
    const alignmentScore = Math.max(0, postureAccuracy - 5);
    
    // Generate suggestions
    const suggestions = [];
    if (postureAccuracy < 70) {
      suggestions.push('Focus on foundational alignment first');
      suggestions.push('Take a breath and reset your posture');
    } else if (postureAccuracy < 85) {
      suggestions.push('Good progress! Try to deepen the pose');
      suggestions.push('Keep your breathing steady and deep');
    } else {
      suggestions.push('Excellent form! Maintain this alignment');
      suggestions.push('Consider holding for a few more breaths');
    }
    
    if (newCorrections.length > 0) {
      suggestions.push(`Focus on correcting: ${newCorrections[0].joint}`);
    }

    setFeedback({
      postureAccuracy: Math.round(postureAccuracy),
      alignmentScore: Math.round(alignmentScore),
      suggestions
    });

    // Provide audio feedback for first high-severity correction
    if (newCorrections.length > 0 && personalization.preferredFeedback.includes('audio')) {
      const highSeverityCorrection = newCorrections.find(c => c.severity === 'high');
      const correctionToAnnounce = highSeverityCorrection || newCorrections[0];
      
      const utterance = new SpeechSynthesisUtterance(correctionToAnnounce.message);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Speak after a short delay
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 300);
    }
  };

  const simulateCorrection = () => {
    // Simulate a new correction appearing
    const possibleCorrections = [
      { joint: 'left_shoulder', message: 'Relax your left shoulder', type: 'both' },
      { joint: 'right_hip', message: 'Align your right hip with left', type: 'visual' },
      { joint: 'spine', message: 'Lengthen your spine', type: 'audio' },
      { joint: 'knees', message: 'Soften your knees slightly', type: 'both' }
    ];
    
    if (corrections.length < 3 && Math.random() > 0.5) {
      const newCorrection = possibleCorrections[Math.floor(Math.random() * possibleCorrections.length)];
      setCorrections(prev => [...prev, newCorrection]);
    }
  };

  const handleStartPractice = () => {
    setIsPracticing(true);
    // Reset body position
    setBodyPosition({
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
      leaning: 0
    });
    initializeCamera();
  };

  const handleEndPractice = () => {
    setIsPracticing(false);
    stopCamera();
    setCorrections([]);
    setFeedback({ postureAccuracy: 0, alignmentScore: 0, suggestions: [] });
    
    // Update user progress
    const newSession = {
      date: new Date().toISOString().split('T')[0],
      pose: selectedPose.name,
      score: feedback.postureAccuracy || 75,
      duration: Math.floor(Math.random() * 15) + 10
    };
    
    setSessionHistory(prev => [newSession, ...prev.slice(0, 9)]);
    
    // Show completion message
    setTimeout(() => {
      alert(`Practice session completed!\nScore: ${feedback.postureAccuracy || 75}%\nCheck your progress dashboard.`);
      setCurrentView('progress');
    }, 500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      cameraContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
    // Force redraw after state change
    if (isPracticing) {
      setTimeout(() => drawSkeletonOverlay(), 100);
    }
  };

  // Handle mouse/touch events for manual skeleton positioning (for demo purposes)
  const handleCameraClick = (e) => {
    if (!isPracticing || !cameraContainerRef.current) return;
    
    const rect = cameraContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Update body position based on click
    setBodyPosition(prev => ({
      ...prev,
      x: Math.max(0.3, Math.min(0.7, x)),
      y: Math.max(0.3, Math.min(0.7, y))
    }));
    
    // Redraw skeleton
    setTimeout(() => drawSkeletonOverlay(), 50);
  };

  // Chart data
  const progressData = sessionHistory.map((session, index) => ({
    name: `Session ${index + 1}`,
    score: session.score,
    duration: session.duration
  }));

  const categoryData = [
    { name: 'Standing', value: 35, color: '#3B82F6' },
    { name: 'Balance', value: 20, color: '#10B981' },
    { name: 'Inversion', value: 15, color: '#F59E0B' },
    { name: 'Seated', value: 20, color: '#8B5CF6' },
    { name: 'Prone', value: 10, color: '#EC4899' }
  ];

  const difficultyData = [
    { name: 'Beginner', sessions: 8, color: '#10B981' },
    { name: 'Intermediate', sessions: 4, color: '#F59E0B' },
    { name: 'Advanced', sessions: 0, color: '#EF4444' }
  ];

  // Filter poses
  const filteredPoses = poses.filter(pose => {
    const matchesSearch = pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pose.sanskritName && pose.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Add manual control buttons for demo
  const moveSkeletonLeft = () => {
    setBodyPosition(prev => ({
      ...prev,
      x: Math.max(0.3, prev.x - 0.05)
    }));
    if (isPracticing) setTimeout(() => drawSkeletonOverlay(), 50);
  };

  const moveSkeletonRight = () => {
    setBodyPosition(prev => ({
      ...prev,
      x: Math.min(0.7, prev.x + 0.05)
    }));
    if (isPracticing) setTimeout(() => drawSkeletonOverlay(), 50);
  };

  const moveSkeletonUp = () => {
    setBodyPosition(prev => ({
      ...prev,
      y: Math.max(0.3, prev.y - 0.05)
    }));
    if (isPracticing) setTimeout(() => drawSkeletonOverlay(), 50);
  };

  const moveSkeletonDown = () => {
    setBodyPosition(prev => ({
      ...prev,
      y: Math.min(0.7, prev.y + 0.05)
    }));
    if (isPracticing) setTimeout(() => drawSkeletonOverlay(), 50);
  };

  // Render functions for each view
  const renderLibraryView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Yoga Pose Library</h1>
          <p className="text-xl mb-6 opacity-90">
            Discover and practice traditional yoga poses with real-time posture guidance and personalized feedback.
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TargetIcon className="w-5 h-5" />
                <span>Real-time Pose Correction</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Personalized Guidance</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search Poses
            </label>
            <input
              type="text"
              placeholder="Search by name or Sanskrit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="standing">Standing Poses</option>
              <option value="seated">Seated Poses</option>
              <option value="balance">Balance Poses</option>
              <option value="inversion">Inversions</option>
              <option value="prone">Prone Poses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Poses</p>
              <p className="text-2xl font-bold text-blue-800">{poses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Avg. Practice</p>
              <p className="text-2xl font-bold text-green-800">18 min</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-800">78%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600">Current Streak</p>
              <p className="text-2xl font-bold text-amber-800">{userProgress.streak.current} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pose Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoses.map((pose) => (
          <div
            key={pose.id}
            onClick={() => {
              setSelectedPose(pose);
              setCurrentView('practice');
            }}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Pose Header */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">🧘</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{pose.name}</h3>
                  <p className="text-gray-600">{pose.sanskritName}</p>
                </div>
              </div>
              
              {/* Difficulty Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  pose.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : pose.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {pose.difficulty}
                </span>
              </div>
              
              {/* Level Indicator */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= pose.level ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-2">Level {pose.level}/5</span>
                </div>
              </div>
            </div>

            {/* Pose Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-800 mb-2">{pose.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{pose.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {pose.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {pose.duration.recommended}s
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {pose.calories} cal
                </span>
              </div>

              {/* Benefits Preview */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</p>
                <ul className="space-y-1">
                  {pose.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-medium flex items-center justify-center gap-2 group-hover:shadow-lg">
                <Play className="w-5 h-5" />
                Start Practice
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPoses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            No poses found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search criteria or browse all poses
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setSelectedCategory('all');
            }}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );

  const renderPracticeView = () => (
    <div className="space-y-8">
      {/* Practice Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ArrowLeft 
                className="w-6 h-6 cursor-pointer hover:text-blue-200 transition"
                onClick={() => {
                  if (isPracticing) {
                    if (window.confirm('End practice session?')) {
                      handleEndPractice();
                    }
                  } else {
                    setCurrentView('library');
                  }
                }}
              />
              <h1 className="text-3xl font-bold">{selectedPose?.name}</h1>
              <span className="px-3 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm">
                {selectedPose?.sanskritName}
              </span>
            </div>
            <p className="text-xl opacity-90 max-w-3xl">
              {selectedPose?.description}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {!isPracticing ? (
              <button
                onClick={handleStartPractice}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                <Play className="w-6 h-6" />
                Start Practice Session
              </button>
            ) : (
              <button
                onClick={handleEndPractice}
                className="px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                <Pause className="w-6 h-6" />
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera and Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Camera Container */}
          <div 
            ref={cameraContainerRef}
            onClick={handleCameraClick}
            className={`relative bg-gray-900 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 cursor-pointer' : 'min-h-[480px] cursor-pointer'}`}
            style={isFullscreen ? { backgroundColor: '#000' } : {}}
          >
            {cameraError ? (
              <div className="h-full flex flex-col items-center justify-center text-white p-8">
                <AlertCircle className="w-20 h-20 text-yellow-500 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Camera Access Required</h3>
                <p className="text-gray-300 text-lg mb-6 text-center max-w-md">
                  {cameraError}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={initializeCamera}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setCameraError(null)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    Continue in Simulation Mode
                  </button>
                </div>
              </div>
            ) : isPracticing ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                
                {/* Camera Overlay Info */}
                <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-4 py-3 rounded-xl flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Live Pose Detection</p>
                    <p className="text-sm opacity-80">Mode: {detectionMode}</p>
                  </div>
                </div>
                
                {/* Camera Controls */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <button
                    onClick={toggleMirror}
                    className={`p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition ${isMirrored ? 'bg-blue-500 bg-opacity-70' : ''}`}
                    title={isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
                  >
                    <FlipHorizontal className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Pose Score Overlay */}
                {feedback.postureAccuracy > 0 && (
                  <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-white px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm opacity-80">Score</p>
                        <p className={`text-3xl font-bold ${
                          feedback.postureAccuracy > 80 ? 'text-green-400' :
                          feedback.postureAccuracy > 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {feedback.postureAccuracy}%
                        </p>
                      </div>
                      <div className="h-12 w-px bg-gray-600"></div>
                      <div>
                        <p className="text-sm opacity-80">Corrections</p>
                        <p className="text-2xl font-bold">{corrections.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Click instruction overlay */}
                {!isFullscreen && (
                  <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Click to position skeleton</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center">
                  <Camera className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">Camera Preview</h3>
                  <p className="text-gray-300 mb-6">
                    Click "Start Practice Session" to begin real-time pose guidance
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Your privacy is protected</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual Skeleton Controls (Demo only) */}
          {isPracticing && !isFullscreen && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Demo Controls
              </h3>
              <p className="text-gray-600 mb-4">
                Manually adjust skeleton position to simulate movement (for demo purposes)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={moveSkeletonLeft}
                  className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                >
                  ← Move Left
                </button>
                <button
                  onClick={moveSkeletonRight}
                  className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                >
                  Move Right →
                </button>
                <button
                  onClick={moveSkeletonUp}
                  className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                >
                  ↑ Move Up
                </button>
                <button
                  onClick={moveSkeletonDown}
                  className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                >
                  Move Down ↓
                </button>
              </div>
            </div>
          )}

          {/* Detection Mode Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Detection Settings</h3>
                <p className="text-gray-600">Configure how the system analyzes your posture</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Detection Mode</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDetectionMode('simulation')}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      detectionMode === 'simulation'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium mb-1">Simulation</div>
                      <div className="text-sm opacity-75">For demo and testing</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setDetectionMode('ai');
                      alert('AI Detection mode will be available in the full version with TensorFlow.js integration');
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      detectionMode === 'ai'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium mb-1">AI Detection</div>
                      <div className="text-sm opacity-75">Real-time analysis</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Feedback Frequency</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  defaultValue="moderate"
                >
                  <option value="minimal">Minimal (Less interruptions)</option>
                  <option value="moderate">Moderate (Recommended)</option>
                  <option value="frequent">Frequent (More guidance)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Simulation Controls */}
          {isPracticing && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                Quick Simulation
              </h3>
              <p className="text-gray-600 mb-4">
                Test different scenarios to see how the feedback system responds
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    analyzePose(generateMockAngles(bodyPosition));
                    setTimeout(() => {
                      setCorrections([]);
                      setFeedback({
                        postureAccuracy: 95,
                        alignmentScore: 92,
                        suggestions: ['Excellent form!', 'Maintain this alignment']
                      });
                    }, 100);
                  }}
                  className="px-4 py-3 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Perfect Pose
                </button>
                <button
                  onClick={() => {
                    const angles = generateMockAngles(bodyPosition);
                    angles.left_shoulder = 210;
                    angles.right_knee = 150;
                    analyzePose(angles);
                  }}
                  className="px-4 py-3 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Minor Corrections
                </button>
                <button
                  onClick={() => {
                    const angles = generateMockAngles(bodyPosition);
                    angles.left_shoulder = 230;
                    angles.right_shoulder = 140;
                    angles.left_hip = 150;
                    analyzePose(angles);
                  }}
                  className="px-4 py-3 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Major Adjustments
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback and Instructions Panel */}
        <div className="space-y-6">
          {/* Real-time Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              Real-time Feedback
            </h3>
            
            {isPracticing ? (
              <div className="space-y-6">
                {/* Score Display */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center flex-1">
                      <p className="text-sm text-blue-600 mb-1">Posture Accuracy</p>
                      <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className={`text-3xl font-bold ${
                            feedback.postureAccuracy > 80 ? 'text-green-600' :
                            feedback.postureAccuracy > 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {feedback.postureAccuracy}%
                          </p>
                        </div>
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - feedback.postureAccuracy / 100)}`}
                            className={
                              feedback.postureAccuracy > 80 ? 'text-green-500' :
                              feedback.postureAccuracy > 60 ? 'text-yellow-500' : 'text-red-500'
                            }
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-indigo-600 mb-1">Alignment</p>
                      <p className="text-3xl font-bold text-indigo-700">{feedback.alignmentScore}%</p>
                    </div>
                  </div>
                  
                  {feedback.suggestions.length > 0 && (
                    <div className="pt-4 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Suggestions
                      </p>
                      <ul className="space-y-2">
                        {feedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Corrections Needed */}
                {corrections.length > 0 ? (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-red-700 mb-4">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-bold text-lg">Adjustments Needed</span>
                      <div className="ml-auto flex items-center gap-2">
                        {personalization.preferredFeedback.includes('audio') && (
                          <Volume2 className="w-5 h-5" />
                        )}
                        {personalization.preferredFeedback.includes('visual') && (
                          <Eye className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {corrections.map((correction, index) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-lg bg-white border border-red-100 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                              correction.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-red-800 capitalize">
                                  {correction.joint.replace('_', ' ')}
                                </p>
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                                  {correction.severity}
                                </span>
                              </div>
                              <p className="text-red-700 text-sm">{correction.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  Feedback: {correction.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : feedback.postureAccuracy > 80 ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="w-8 h-8" />
                      <div>
                        <p className="font-bold text-lg">Excellent Form!</p>
                        <p className="text-sm">Keep up the great work</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Start practicing to see real-time feedback</p>
              </div>
            )}
          </div>

          {/* Pose Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Step-by-Step Instructions
            </h3>
            <div className="space-y-4">
              {selectedPose?.instructions?.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pose Benefits & Precautions */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {selectedPose?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Precautions
              </h3>
              <ul className="space-y-2">
                {selectedPose?.precautions?.map((precaution, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    {precaution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgressView = () => (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">Your Yoga Journey</h1>
            <p className="text-xl opacity-90">Track your progress, achievements, and growth</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{userProgress.streak.current} 🔥</p>
            <p className="text-sm opacity-80">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{userProgress.overallStats.totalSessions}</span>
          </div>
          <p className="font-bold text-lg mb-1">Total Sessions</p>
          <p className="text-sm opacity-90">Consistent practice pays off</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{userProgress.overallStats.totalDuration}</span>
          </div>
          <p className="font-bold text-lg mb-1">Minutes Practiced</p>
          <p className="text-sm opacity-90">Every minute counts</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{userProgress.overallStats.averageScore}%</span>
          </div>
          <p className="font-bold text-lg mb-1">Average Score</p>
          <p className="text-sm opacity-90">Quality over quantity</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{userProgress.streak.longest}</span>
          </div>
          <p className="font-bold text-lg mb-1">Longest Streak</p>
          <p className="text-sm opacity-90">Personal best record</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Progress Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Session Score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  name="Duration (min)" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Practice Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Sessions</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <Download className="w-5 h-5 inline mr-2" />
              Export
            </button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <Share2 className="w-5 h-5 inline mr-2" />
              Share
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pose</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessionHistory.map((session, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{session.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{session.pose}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-3`}>
                        <div 
                          className={`h-full ${
                            session.score > 80 ? 'bg-green-500' :
                            session.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${session.score}%` }}
                        />
                      </div>
                      <span className={`font-bold ${
                        session.score > 80 ? 'text-green-600' :
                        session.score > 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {session.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{session.duration} min</td>
                  <td className="px-6 py-4">
                    {index > 0 && sessionHistory[index - 1] ? (
                      <span className={`inline-flex items-center ${
                        session.score > sessionHistory[index - 1].score 
                          ? 'text-green-600' 
                          : session.score < sessionHistory[index - 1].score 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                      }`}>
                        {session.score > sessionHistory[index - 1].score ? '↗' : 
                         session.score < sessionHistory[index - 1].score ? '↘' : '→'}
                        <span className="ml-1 text-sm">
                          {Math.abs(session.score - sessionHistory[index - 1].score)}%
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">7-Day Streak</p>
                <p className="text-sm text-gray-600">Completed 7 days in a row</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-bold">Unlocked</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Pose Master</p>
                <p className="text-sm text-gray-600">Scored 90%+ on any pose</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-bold">Unlocked</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Time Warrior</p>
                <p className="text-sm text-gray-600">Practiced for 200+ minutes</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-bold">Unlocked</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">Personalization Settings</h1>
            <p className="text-xl opacity-90">Customize your yoga experience</p>
          </div>
          <Settings className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Age
                  </label>
                  <input
                    type="number"
                    value={personalization.age}
                    onChange={(e) => setPersonalization({
                      ...personalization,
                      age: parseInt(e.target.value) || 25
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Flexibility Level
                  </label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPersonalization({
                          ...personalization,
                          flexibilityLevel: level
                        })}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                          personalization.flexibilityLevel === level
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Feedback Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['visual', 'audio', 'both'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPersonalization({
                        ...personalization,
                        preferredFeedback: type
                      })}
                      className={`px-4 py-4 rounded-xl border-2 transition-all ${
                        personalization.preferredFeedback === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {type === 'visual' ? (
                          <Eye className="w-6 h-6" />
                        ) : type === 'audio' ? (
                          <Volume2 className="w-6 h-6" />
                        ) : (
                          <>
                            <Eye className="w-6 h-6" />
                            <Volume2 className="w-6 h-6" />
                          </>
                        )}
                        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mobility Restrictions
                </label>
                <textarea
                  value={personalization.mobilityRestrictions.join(', ')}
                  onChange={(e) => setPersonalization({
                    ...personalization,
                    mobilityRestrictions: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., knee pain, shoulder injury, lower back issues"
                  rows="4"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Separate multiple restrictions with commas. This helps customize your practice.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Practice Preferences</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Session Duration Preference
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="short">Short (10-15 minutes)</option>
                  <option value="medium">Medium (20-30 minutes)</option>
                  <option value="long">Long (40+ minutes)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Progression
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="gradual">Gradual (Slow progression)</option>
                  <option value="moderate">Moderate (Balanced pace)</option>
                  <option value="fast">Fast (Quick advancement)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme Preference
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPersonalization({ ...personalization, theme: 'light' })}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                      personalization.theme === 'light'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    Light Mode
                  </button>
                  <button
                    onClick={() => setPersonalization({ ...personalization, theme: 'dark' })}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                      personalization.theme === 'dark'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    Dark Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                Save All Changes
              </button>
              <button className="w-full px-4 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition font-medium">
                Reset to Defaults
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium">
                Export Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Age</span>
                <span className="font-medium">{personalization.age} years</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Flexibility</span>
                <span className="font-medium capitalize">{personalization.flexibilityLevel}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Feedback</span>
                <span className="font-medium capitalize">{personalization.preferredFeedback}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Theme</span>
                <span className="font-medium capitalize">{personalization.theme}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for personalized guidance
            </p>
            <button className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-700 transition"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">
                Yoga Guidance System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-3">
                <button
                  onClick={() => setCurrentView('library')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentView === 'library'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Library</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('practice')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentView === 'practice'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  disabled={!selectedPose && currentView !== 'practice'}
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span>Practice</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('progress')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentView === 'progress'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Progress</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    currentView === 'settings'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </button>
              </div>
              
              <div className="md:hidden">
                <select
                  value={currentView}
                  onChange={(e) => setCurrentView(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="library">Library</option>
                  <option value="practice">Practice</option>
                  <option value="progress">Progress</option>
                  <option value="settings">Settings</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'library' && renderLibraryView()}
        {currentView === 'practice' && renderPracticeView()}
        {currentView === 'progress' && renderProgressView()}
        {currentView === 'settings' && renderSettingsView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © 2024 Personalized Traditional Medicine Assistant. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}