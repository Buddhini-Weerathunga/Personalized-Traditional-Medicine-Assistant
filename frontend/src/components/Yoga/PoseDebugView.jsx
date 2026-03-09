import React from 'react';

const PoseDebugView = ({ jointAngles, idealAngles }) => {
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

  if (validAngles.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4 text-yellow-700 text-center border border-yellow-200">
        ⚠️ No valid joint angles detected. Please ensure your full body is visible.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
        <span>Joint Angle Debug</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {validAngles.length} joints tracked
        </span>
      </h3>
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
      
      {validAngles.length < 4 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-700 border border-yellow-200">
          ⚠️ Only {validAngles.length} joints detected. Move back to show full body.
        </div>
      )}
    </div>
  );
};

export default PoseDebugView;