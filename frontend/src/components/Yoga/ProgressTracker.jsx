import { TrendingUp, Calendar, Award, Target, BarChart3, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressTracker = ({ userProgress, onBack }) => {
  if (!userProgress) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No progress data available yet.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Back to Poses
        </button>
      </div>
    );
  }

  // Prepare data for charts
  const prepareProgressData = () => {
    const data = [];
    const recentPoses = userProgress.poseProficiency.slice(0, 5);
    
    recentPoses.forEach(pose => {
      if (pose.improvements && pose.improvements.length > 0) {
        const latest = pose.improvements[pose.improvements.length - 1];
        data.push({
          pose: pose.poseId.name,
          score: pose.bestScore,
          attempts: pose.attempts,
          lastPracticed: new Date(latest.date).toLocaleDateString(),
          improvement: pose.improvements.length > 1 ? 
            pose.improvements[pose.improvements.length - 1].score - pose.improvements[0].score : 0
        });
      }
    });
    
    return data;
  };

  const progressData = prepareProgressData();

  const getAchievements = () => {
    const achievements = [];
    
    if (userProgress.streak.current >= 7) {
      achievements.push({
        title: 'Weekly Warrior',
        description: '7-day practice streak',
        icon: '🔥',
        unlocked: true
      });
    }
    
    if (userProgress.overallStats.totalSessions >= 10) {
      achievements.push({
        title: 'Dedicated Yogi',
        description: '10 sessions completed',
        icon: '🌟',
        unlocked: true
      });
    }
    
    if (userProgress.poseProficiency.some(p => p.bestScore >= 90)) {
      achievements.push({
        title: 'Pose Master',
        description: 'Achieved 90%+ score on any pose',
        icon: '🏆',
        unlocked: true
      });
    }
    
    return achievements;
  };

  const achievements = getAchievements();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ArrowLeft 
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={onBack}
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Your Progress Dashboard
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-2xl font-bold text-blue-600">
              {userProgress.streak.current} days 🔥
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Total Sessions</span>
            </div>
            <p className="text-3xl font-bold text-blue-800">
              {userProgress.overallStats.totalSessions}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Avg. Score</span>
            </div>
            <p className="text-3xl font-bold text-green-800">
              {userProgress.overallStats.averageScore.toFixed(0)}%
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Practice Time</span>
            </div>
            <p className="text-3xl font-bold text-purple-800">
              {userProgress.overallStats.totalDuration}m
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Longest Streak</span>
            </div>
            <p className="text-3xl font-bold text-amber-800">
              {userProgress.streak.longest}
            </p>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Pose Performance Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="pose" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Best Score (%)" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="improvement" 
                  name="Improvement" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-bold text-amber-800">{achievement.title}</h4>
                      <p className="text-sm text-amber-700">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pose Proficiency Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                      {proficiency.bestScore.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {proficiency.averageScore.toFixed(0)}%
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
    </div>
  );
};

export default ProgressTracker;