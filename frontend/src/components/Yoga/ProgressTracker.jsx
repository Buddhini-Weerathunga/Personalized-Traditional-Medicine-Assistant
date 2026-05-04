import { TrendingUp, Calendar, Award, Target, BarChart3, ArrowLeft, Clock, Zap, Star, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProgressTracker = ({ userProgress, onBack, sessionHistory = [] }) => {
  if (!userProgress) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Activity className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-500">No progress data available yet.</p>
        <p className="text-sm text-gray-400 mt-2">Complete your first yoga session to see progress!</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Poses
        </button>
      </div>
    );
  }

  // Prepare data for charts
  const prepareProgressData = () => {
    const data = [];
    
    if (userProgress.poseProficiency && userProgress.poseProficiency.length > 0) {
      userProgress.poseProficiency.forEach(pose => {
        if (pose.poseId) {
          data.push({
            pose: pose.poseId.name || 'Unknown Pose',
            score: pose.bestScore || 0,
            attempts: pose.attempts || 0,
            averageScore: pose.averageScore || 0,
            lastPracticed: pose.lastPracticed ? new Date(pose.lastPracticed).toLocaleDateString() : 'Never'
          });
        }
      });
    }
    
    return data;
  };

  const progressData = prepareProgressData();

  // Get achievements based on progress
  const getAchievements = () => {
    const achievements = [];
    
    if (userProgress.streak?.current >= 7) {
      achievements.push({
        title: 'Weekly Warrior',
        description: '7-day practice streak',
        icon: '🔥',
        color: 'bg-orange-100 text-orange-800',
        unlocked: true
      });
    } else if (userProgress.streak?.current >= 3) {
      achievements.push({
        title: 'Getting Consistent',
        description: `${userProgress.streak.current}-day streak`,
        icon: '📅',
        color: 'bg-blue-100 text-blue-800',
        unlocked: true
      });
    }
    
    if (userProgress.overallStats?.totalSessions >= 10) {
      achievements.push({
        title: 'Dedicated Yogi',
        description: '10 sessions completed',
        icon: '🌟',
        color: 'bg-purple-100 text-purple-800',
        unlocked: true
      });
    } else if (userProgress.overallStats?.totalSessions >= 5) {
      achievements.push({
        title: 'Getting Started',
        description: '5 sessions completed',
        icon: '🌱',
        color: 'bg-green-100 text-green-800',
        unlocked: true
      });
    }
    
    if (userProgress.poseProficiency?.some(p => p.bestScore >= 90)) {
      achievements.push({
        title: 'Pose Master',
        description: 'Achieved 90%+ on a pose',
        icon: '🏆',
        color: 'bg-yellow-100 text-yellow-800',
        unlocked: true
      });
    }
    
    if (userProgress.overallStats?.totalDuration >= 120) {
      achievements.push({
        title: 'Time Warrior',
        description: '120+ minutes practiced',
        icon: '⏱️',
        color: 'bg-indigo-100 text-indigo-800',
        unlocked: true
      });
    }
    
    // Locked achievements
    if (!achievements.some(a => a.title === 'Weekly Warrior')) {
      achievements.push({
        title: 'Weekly Warrior',
        description: '7-day streak (3 more days)',
        icon: '🔒',
        color: 'bg-gray-100 text-gray-500',
        unlocked: false
      });
    }
    
    if (!achievements.some(a => a.title === 'Pose Master')) {
      achievements.push({
        title: 'Pose Master',
        description: 'Get 90% on any pose',
        icon: '🔒',
        color: 'bg-gray-100 text-gray-500',
        unlocked: false
      });
    }
    
    return achievements.slice(0, 6); // Show up to 6 achievements
  };

  const achievements = getAchievements();

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Your Progress Dashboard
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Sessions</span>
            </div>
            <p className="text-3xl font-bold text-blue-800">
              {userProgress.overallStats?.totalSessions || 0}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Avg. Score</span>
            </div>
            <p className="text-3xl font-bold text-green-800">
              {Math.round(userProgress.overallStats?.averageScore || 0)}%
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Practice Time</span>
            </div>
            <p className="text-3xl font-bold text-purple-800">
              {Math.floor((userProgress.overallStats?.totalDuration || 0) / 60)}m
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Streak</span>
            </div>
            <p className="text-3xl font-bold text-amber-800">
              {userProgress.streak?.current || 0} days
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Longest: {userProgress.streak?.longest || 0}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        {sessionHistory && sessionHistory.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Sessions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Corrections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessionHistory.slice(0, 5).map((session, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {session.poseName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {Math.floor(session.duration / 60)}m {session.duration % 60}s
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${
                          session.score >= 80 ? 'text-green-600' :
                          session.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {session.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {session.corrections || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Chart */}
        {progressData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Pose Performance
            </h3>
            <div className="h-80 bg-white p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="pose" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="bestScore" name="Best Score" fill="#3B82F6" />
                  <Bar dataKey="averageScore" name="Average Score" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`${achievement.color} border rounded-lg p-4 transition ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-bold">{achievement.title}</h4>
                    <p className="text-xs opacity-80">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pose Proficiency Table */}
      {userProgress.poseProficiency && userProgress.poseProficiency.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pose Proficiency
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pose</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attempts</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Best Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avg. Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userProgress.poseProficiency.map((proficiency, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {proficiency.poseId?.name || 'Unknown Pose'}
                      </div>
                      {proficiency.poseId?.sanskritName && (
                        <div className="text-xs text-gray-500">
                          {proficiency.poseId.sanskritName}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        proficiency.poseId?.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        proficiency.poseId?.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {proficiency.poseId?.difficulty || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{proficiency.attempts}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${
                        proficiency.bestScore >= 90 ? 'text-green-600' :
                        proficiency.bestScore >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {proficiency.bestScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {proficiency.averageScore}%
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {proficiency.lastPracticed ? 
                        new Date(proficiency.lastPracticed).toLocaleDateString() : 
                        'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Next Milestone */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Next Milestone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {userProgress.streak?.current || 0}/7 days
            </p>
            <p className="text-sm opacity-90">Weekly streak goal</p>
          </div>
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - (userProgress.streak?.current || 0) / 7)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {Math.round(((userProgress.streak?.current || 0) / 7) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;