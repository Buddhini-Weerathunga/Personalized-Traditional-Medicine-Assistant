// frontend/src/components/Yoga/PoseDetectionStatus.jsx
import { Camera, Activity, AlertCircle, CheckCircle, Zap, Wifi, WifiOff } from 'lucide-react';

const PoseDetectionStatus = ({ 
  isDetecting, 
  jointCount, 
  confidence, 
  error,
  isAudioEnabled 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isDetecting ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Camera className={`w-5 h-5 ${
              isDetecting ? 'text-green-600' : 'text-gray-500'
            }`} />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              Pose Detection {isDetecting ? 'Active' : 'Waiting'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {isDetecting ? (
                <>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {jointCount} joints tracked
                  </span>
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {confidence}% confidence
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  No pose detected - Stand in frame
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Status */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAudioEnabled 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            {isAudioEnabled ? '🔊 Audio On' : '🔇 Audio Off'}
          </div>
          
          {/* Detection LED */}
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            isDetecting ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Progress Bar for Detection Confidence */}
      {isDetecting && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Detection Quality</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                confidence > 80 ? 'bg-green-500' :
                confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseDetectionStatus;