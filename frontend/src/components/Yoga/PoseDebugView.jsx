import React from 'react';

const PoseDebugView = ({ jointAngles, idealAngles, feedback }) => {
  if (!jointAngles || Object.keys(jointAngles).length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-gray-500 text-center">
        No joint data available. Stand in front of camera.
      </div>
    );
  }

  const getAngleStatus = (joint, current) => {
    if (!idealAngles || !idealAngles[joint]) return 'neutral';
    
    const ideal = idealAngles[joint].ideal;
    const min = idealAngles[joint].min;
    const max = idealAngles[joint].max;
    
    if (!current || isNaN(current)) return 'neutral';
    if (current < min) return 'low';
    if (current > max) return 'high';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return '✓';
      case 'low': return '↓';
      case 'high': return '↑';
      default: return '•';
    }
  };

  // Filter out invalid angles
  const validAngles = Object.entries(jointAngles).filter(([_, angle]) => 
    angle && !isNaN(angle) && angle > 0 && angle < 180
  );

  // Get counts for summary
  const correctJoints = validAngles.filter(([joint, angle]) => {
    if (!idealAngles || !idealAngles[joint]) return false;
    const { min, max } = idealAngles[joint];
    return angle >= min && angle <= max;
  }).length;

  const wrongJoints = validAngles.filter(([joint, angle]) => {
    if (!idealAngles || !idealAngles[joint]) return false;
    const { min, max } = idealAngles[joint];
    return angle < min || angle > max;
  }).length;

  if (validAngles.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4 text-yellow-700 text-center border border-yellow-200">
        ⚠️ No valid joint angles detected. Please ensure your full body is visible.
      </div>
    );
  }

  // Determine if timer can start
  const canStartTimer = feedback?.canStartTimer || (validAngles.length >= 6 && wrongJoints <= 2);
  const needsImprovement = validAngles.length >= 6 && wrongJoints > 2;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>Joint Angle Debug</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {validAngles.length} joints tracked
          </span>
        </h3>
        
        {/* Summary Badge */}
        <div className={`text-xs px-2 py-1 rounded ${
          wrongJoints === 0 ? 'bg-green-100 text-green-700' :
          wrongJoints <= 2 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {correctJoints}/{validAngles.length} Correct
          {wrongJoints > 0 && ` • ${wrongJoints} Wrong`}
        </div>
      </div>

      {/* Timer Ready or Need Improvement */}
      {canStartTimer && (
        <div className="mb-3 p-3 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✅</span>
            <div>
              <span className="font-bold text-green-800">Timer Ready!</span>
              <p className="text-xs text-green-700 mt-0.5">
                Only {wrongJoints} joint(s) need adjustment. Timer will start soon.
              </p>
            </div>
          </div>
          {wrongJoints === 1 && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-1.5 rounded">
              💡 Just 1 minor adjustment needed. Timer will start!
            </div>
          )}
          {wrongJoints === 2 && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-1.5 rounded">
              💡 2 minor adjustments needed. Timer will start!
            </div>
          )}
          {wrongJoints === 0 && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-1.5 rounded">
              🎯 Perfect pose! Timer will start immediately.
            </div>
          )}
        </div>
      )}

      {!canStartTimer && validAngles.length >= 6 && wrongJoints > 2 && (
        <div className="mb-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <div>
              <span className="font-bold text-yellow-800">Need Improvement</span>
              <p className="text-xs text-yellow-700 mt-0.5">
                {wrongJoints} joints need adjustment. Need only {wrongJoints - 2} more joint(s) fixed to start timer.
              </p>
            </div>
          </div>
          <div className="mt-2 w-full bg-yellow-200 rounded-full h-1.5">
            <div 
              className="bg-yellow-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, 100 - ((wrongJoints - 2) * 25))}%` }}
            />
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Follow audio guidance to fix {wrongJoints - 2} more joint(s)
          </p>
        </div>
      )}

      {/* Pose Quality Indicator */}
      {feedback?.postureAccuracy && (
        <div className="mb-3 p-2 rounded-lg text-center text-sm font-medium" style={{
          backgroundColor: wrongJoints === 0 ? '#dcfce7' : 
                          wrongJoints <= 2 ? '#fef9c3' : '#fee2e2',
          color: wrongJoints === 0 ? '#166534' :
                 wrongJoints <= 2 ? '#854d0e' : '#991b1b'
        }}>
          {wrongJoints === 0 ? '🎯 Perfect Form!' :
           wrongJoints <= 2 ? '👍 Good Enough - Timer Ready!' : 
           `⚠️ ${wrongJoints} Joints Need Adjustment`}
        </div>
      )}

      {/* Joint Angles List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {validAngles.map(([joint, angle]) => {
          const status = getAngleStatus(joint, angle);
          const ideal = idealAngles?.[joint];
          
          return (
            <div key={joint} className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{joint.replace('_', ' ')}</span>
                  <span className={`text-sm font-bold ${
                    status === 'good' ? 'text-green-600' :
                    status === 'low' ? 'text-yellow-600' :
                    status === 'high' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {getStatusIcon(status)}
                  </span>
                </div>
                <span className="font-mono font-bold">{Math.round(angle)}°</span>
              </div>
              {ideal && (
                <div className="text-xs mt-2 grid grid-cols-3 gap-2">
                  <div className="text-gray-600">
                    Ideal: {ideal.ideal}°
                  </div>
                  <div className="text-gray-600">
                    Range: {ideal.min}°-{ideal.max}°
                  </div>
                  <div className={`font-medium ${
                    status === 'good' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status === 'good' ? '✓ Correct' : '✗ Adjust'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Detection Quality Warning */}
      {validAngles.length < 6 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-700 border border-yellow-200">
          ⚠️ Only {validAngles.length} joints detected. Move back to show full body (need at least 6 joints).
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="block text-gray-600">Correct Joints</span>
            <span className="text-xl font-bold text-green-600">{correctJoints}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="block text-gray-600">Wrong Joints</span>
            <span className={`text-xl font-bold ${wrongJoints <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
              {wrongJoints}
            </span>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          {wrongJoints <= 2 
            ? '✅ Timer will start! Keep holding the pose.' 
            : `🔧 Fix ${wrongJoints - 2} more joint(s) to start timer`}
        </div>
      </div>

      {/* Perfect Alignment Message */}
      {validAngles.length >= 6 && wrongJoints === 0 && (
        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700 border border-green-200 text-center">
          🎯 Perfect alignment! All joints are correct. Timer starting now!
        </div>
      )}

      {/* Close to Ready Message */}
      {validAngles.length >= 6 && wrongJoints === 1 && (
        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700 border border-green-200 text-center">
          🔧 Only 1 joint needs adjustment. Timer will start!
        </div>
      )}

      {validAngles.length >= 6 && wrongJoints === 2 && (
        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700 border border-green-200 text-center">
          🔧 2 joints need minor adjustments. Timer will start!
        </div>
      )}

      {validAngles.length >= 6 && wrongJoints === 3 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-700 border border-yellow-200 text-center">
          🔧 {wrongJoints} joints need adjustment. Fix 1 more to start timer!
        </div>
      )}

      {validAngles.length >= 6 && wrongJoints >= 4 && (
        <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700 border border-red-200 text-center">
          ⚠️ {wrongJoints} joints need adjustment. Follow audio guidance.
        </div>
      )}
    </div>
  );
};

export default PoseDebugView;