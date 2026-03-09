// frontend/src/components/Yoga/PoseCorrection.jsx
import { AlertCircle, CheckCircle } from 'lucide-react';

const PoseCorrection = ({ corrections, feedback }) => {
  if (!corrections?.length && !feedback) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle className="w-8 h-8" />
          <div>
            <span className="font-bold text-lg">Perfect Posture!</span>
            <p className="text-sm text-green-600">Keep maintaining this alignment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Display */}
      {feedback && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-blue-600 mb-1">Posture Accuracy</p>
              <p className={`text-3xl font-bold ${
                feedback.postureAccuracy > 80 ? 'text-green-600' :
                feedback.postureAccuracy > 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.round(feedback.postureAccuracy)}%
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-indigo-600 mb-1">Alignment</p>
              <p className="text-4xl font-bold text-indigo-700">
                {Math.round(feedback.alignmentScore)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Corrections List - Visual Only */}
      {corrections.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-red-700 mb-4">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold text-lg">Adjustments Needed</span>
          </div>
          
          <div className="space-y-3">
            {corrections.map((correction, index) => (
              <div 
                key={index}
                className="p-3 bg-white rounded-lg border border-red-200"
              >
                <p className="font-medium text-red-800 capitalize">
                  {correction.joint.replace('_', ' ')}
                </p>
                <p className="text-sm text-red-700 mt-1">{correction.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseCorrection;