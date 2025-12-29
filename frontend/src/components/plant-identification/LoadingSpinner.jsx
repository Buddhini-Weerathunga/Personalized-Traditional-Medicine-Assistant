import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const leafSizes = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        <div className="absolute w-full h-full border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <div className={`${leafSizes[size]} animate-pulse`}>🌿</div>
      </div>
      {message && <p className="mt-6 text-gray-600 text-center">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
