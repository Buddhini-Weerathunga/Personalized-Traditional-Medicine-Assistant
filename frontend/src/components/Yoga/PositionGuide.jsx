import React from 'react';
import { ArrowLeft, ArrowRight, Move, Maximize, Minimize, AlertCircle, CheckCircle } from 'lucide-react';

const PositionGuide = ({ positionStatus }) => {
  if (!positionStatus || !positionStatus.personDetected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">No person detected</p>
            <p className="text-sm text-yellow-700">Please stand in front of the camera</p>
          </div>
        </div>
      </div>
    );
  }

  const getInstructionIcon = () => {
    switch (positionStatus.instruction) {
      case 'step_closer':
        return <Maximize className="w-6 h-6 text-blue-600" />;
      case 'step_back':
      case 'step_back_full_body':
      case 'step_back_feet':
        return <Minimize className="w-6 h-6 text-orange-600" />;
      case 'center_yourself':
        return <Move className="w-6 h-6 text-purple-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getInstructionColor = () => {
    switch (positionStatus.instruction) {
      case 'step_closer':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'step_back':
      case 'step_back_full_body':
      case 'step_back_feet':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'center_yourself':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className={`rounded-xl p-4 mb-4 ${getInstructionColor()}`}>
      <div className="flex items-start gap-3">
        {getInstructionIcon()}
        <div className="flex-1">
          <p className="font-medium">{positionStatus.message}</p>
          
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="bg-white bg-opacity-50 rounded p-2 text-center">
              <span className="block font-bold">Distance</span>
              <span className={`capitalize ${
                positionStatus.distance === 'good' ? 'text-green-600' : 'text-red-600'
              }`}>
                {positionStatus.distance === 'too_far' ? 'Too Far' : 
                 positionStatus.distance === 'too_close' ? 'Too Close' : 'Good'}
              </span>
              {positionStatus.heightPercentage && (
                <span className="block text-gray-500">({positionStatus.heightPercentage}%)</span>
              )}
            </div>
            
            <div className="bg-white bg-opacity-50 rounded p-2 text-center">
              <span className="block font-bold">Centering</span>
              <span className={`capitalize ${
                positionStatus.centering === 'centered' ? 'text-green-600' : 'text-red-600'
              }`}>
                {positionStatus.centering === 'left' ? 'Too Left' :
                 positionStatus.centering === 'right' ? 'Too Right' :
                 positionStatus.centering === 'off_center' ? 'Off Center' : 'Centered'}
              </span>
            </div>
            
            <div className="bg-white bg-opacity-50 rounded p-2 text-center">
              <span className="block font-bold">Body View</span>
              <span className={`capitalize ${
                positionStatus.bodyVisibility === 'full' ? 'text-green-600' : 'text-red-600'
              }`}>
                {positionStatus.bodyVisibility === 'full' ? 'Full Body' :
                 positionStatus.bodyVisibility === 'feet_hidden' ? 'Feet Hidden' :
                 positionStatus.bodyVisibility === 'hands_hidden' ? 'Hands Hidden' : 'Partial'}
              </span>
            </div>
          </div>
          
          {positionStatus.instruction !== 'good_position' && (
            <div className="mt-3 p-2 bg-black bg-opacity-10 rounded text-center">
              <span className="text-sm">
                {positionStatus.instruction === 'step_closer' && '🚶 Walk closer to the camera'}
                {positionStatus.instruction === 'step_back' && '🚶 Step back from the camera'}
                {positionStatus.instruction === 'step_back_full_body' && '🚶 Step back so I can see your full body'}
                {positionStatus.instruction === 'step_back_feet' && '🚶 Step back - I need to see your feet'}
                {positionStatus.instruction === 'center_yourself' && '🎯 Center yourself in the frame'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionGuide;