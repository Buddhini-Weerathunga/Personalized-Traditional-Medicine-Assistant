import { AlertCircle, CheckCircle, Volume2, Eye } from 'lucide-react';
import { useEffect } from 'react';

const PoseCorrection = ({ corrections, feedback, preferredFeedback }) => {
  // Provide audio feedback for corrections
  useEffect(() => {
    if (corrections.length > 0 && 
        (preferredFeedback === 'audio' || preferredFeedback === 'both') &&
        'speechSynthesis' in window) {
      
      const lastCorrection = corrections[corrections.length - 1];
      const utterance = new SpeechSynthesisUtterance(lastCorrection.message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Speak after a short delay
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 300);
    }
  }, [corrections, preferredFeedback]);

  if (!corrections.length && !feedback) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Perfect posture! Keep it up.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Display */}
      {feedback && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600">Posture Accuracy</p>
              <p className="text-2xl font-bold text-blue-700">
                {feedback.postureAccuracy.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-600">Alignment Score</p>
              <p className="text-2xl font-bold text-indigo-700">
                {feedback.alignmentScore.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-1">Suggestions:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Corrections */}
      {corrections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 mb-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Corrections Needed</span>
            <div className="ml-auto flex items-center gap-2 text-sm">
              {preferredFeedback.includes('audio') && (
                <Volume2 className="w-4 h-4" />
              )}
              {preferredFeedback.includes('visual') && (
                <Eye className="w-4 h-4" />
              )}
            </div>
          </div>
          
          <ul className="space-y-2">
            {corrections.map((correction, index) => (
              <li 
                key={index} 
                className={`p-2 rounded ${
                  index === corrections.length - 1 
                    ? 'bg-red-100 border border-red-300' 
                    : 'bg-red-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    correction.joint.includes('shoulder') ? 'bg-orange-500' :
                    correction.joint.includes('elbow') ? 'bg-yellow-500' :
                    correction.joint.includes('hip') ? 'bg-purple-500' :
                    correction.joint.includes('knee') ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-red-800 capitalize">
                      {correction.joint.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-red-700">{correction.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PoseCorrection;