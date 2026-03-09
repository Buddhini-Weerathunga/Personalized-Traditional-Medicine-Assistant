import { CheckCircle, Award, TrendingUp, Clock, RotateCcw, ArrowRight } from 'lucide-react';

const PoseCompletion = ({ 
  pose, 
  score, 
  corrections, 
  holdTime,
  onNextPose,
  onPracticeAgain 
}) => {
  
  // Calculate performance rating
  const getRating = () => {
    if (score >= 90) return { label: 'Excellent!', color: 'text-green-600', icon: '🏆' };
    if (score >= 75) return { label: 'Good job!', color: 'text-blue-600', icon: '🌟' };
    if (score >= 60) return { label: 'Keep practicing', color: 'text-yellow-600', icon: '📈' };
    return { label: 'More practice needed', color: 'text-orange-600', icon: '💪' };
  };

  const rating = getRating();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pose Complete!</h2>
        <p className="text-gray-600">{pose?.name} • {pose?.sanskritName}</p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{score}%</p>
            <p className="text-xs opacity-90">Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{holdTime}s</p>
            <p className="text-xs opacity-90">Hold Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{corrections?.length || 0}</p>
            <p className="text-xs opacity-90">Corrections</p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">{rating.icon}</span>
        <h3 className={`text-2xl font-bold ${rating.color}`}>{rating.label}</h3>
      </div>

      {/* Performance Insights */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Insights
        </h4>
        
        <div className="space-y-3">
          {score >= 80 ? (
            <p className="text-green-700 bg-green-50 p-3 rounded-lg">
              ✓ Great alignment! Your form was excellent.
            </p>
          ) : score >= 60 ? (
            <p className="text-blue-700 bg-blue-50 p-3 rounded-lg">
              ✓ Good progress! Focus on the areas highlighted below.
            </p>
          ) : (
            <p className="text-orange-700 bg-orange-50 p-3 rounded-lg">
              ✓ Keep practicing! Pay attention to the correction points.
            </p>
          )}

          {corrections && corrections.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Areas to improve:</p>
              <ul className="space-y-2">
                {corrections.slice(0, 3).map((corr, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    {corr.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      {score >= 85 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-600" />
            <div>
              <p className="font-bold text-amber-800">New Achievement Unlocked!</p>
              <p className="text-sm text-amber-700">Pose Master - {pose?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onPracticeAgain}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </button>
        <button
          onClick={onNextPose}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2"
        >
          Next Pose
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        Remember to breathe deeply and maintain proper alignment
      </p>
    </div>
  );
};

export default PoseCompletion;