import { Search, Filter, TrendingUp, Clock, Award } from 'lucide-react';
import { useState } from 'react';

const PoseLibrary = ({ poses, onSelectPose, userProgress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all', 'standing', 'seated', 'supine', 'prone', 'inversion', 'balance'
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const filteredPoses = poses.filter(pose => {
    const matchesSearch = pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pose.sanskritName && pose.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getPoseProficiency = (poseId) => {
    if (!userProgress?.poseProficiency) return null;
    return userProgress.poseProficiency.find(p => p.poseId._id === poseId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search yoga poses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full md:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Progress Summary */}
      {userProgress && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Your Yoga Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{userProgress.overallStats.totalSessions}</p>
              <p className="text-sm opacity-90">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{userProgress.overallStats.totalDuration}</p>
              <p className="text-sm opacity-90">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{userProgress.streak.current}</p>
              <p className="text-sm opacity-90">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{userProgress.overallStats.averageScore.toFixed(0)}%</p>
              <p className="text-sm opacity-90">Avg. Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Pose Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoses.map(pose => {
          const proficiency = getPoseProficiency(pose._id);
          
          return (
            <div
              key={pose._id}
              onClick={() => onSelectPose(pose)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              {/* Pose Image/Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                {pose.imageUrl ? (
                  <img 
                    src={pose.imageUrl} 
                    alt={pose.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-4xl">🧘</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{pose.name}</h3>
                    {pose.sanskritName && (
                      <p className="text-gray-600 text-sm">{pose.sanskritName}</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Pose Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{pose.name}</h3>
                    {pose.sanskritName && (
                      <p className="text-gray-600 text-sm">{pose.sanskritName}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pose.difficulty)}`}>
                    {pose.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pose.description || 'Improves flexibility and strength.'}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {pose.category}
                  </span>
                  {pose.benefits?.slice(0, 2).map((benefit, index) => (
                    <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                      {benefit.split(' ')[0]}
                    </span>
                  ))}
                </div>
                
                {/* User Progress */}
                {proficiency && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-700">
                          Best: {proficiency.bestScore.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">
                          {proficiency.attempts} tries
                        </span>
                      </div>
                    </div>
                    {proficiency.bestScore > 80 && (
                      <div className="mt-2 flex items-center gap-1 text-amber-600">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-medium">Mastery Level</span>
                      </div>
                    )}
                  </div>
                )}
                
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition font-medium">
                  Start Practice
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPoses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No poses found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default PoseLibrary;