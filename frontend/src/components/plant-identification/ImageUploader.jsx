import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateImage = (file) => {
    // Reset error
    setValidationError('');

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please select a JPG, JPEG, or PNG image');
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setValidationError('Image size must be less than 10MB');
      return false;
    }

    // Check image dimensions using Image object
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setValidationError('Failed to load image. Please try another file');
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = await validateImage(file);
      if (isValid) {
        onImageSelect(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const isValid = await validateImage(file);
      if (isValid) {
        onImageSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`w-full max-w-lg min-h-[300px] border-[3px] border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all bg-green-50 ${
        isDragging 
          ? 'border-green-800 bg-green-100 scale-105' 
          : 'border-green-600 hover:border-green-700 hover:bg-green-100 hover:scale-105'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="text-center p-8">
        <div className="text-6xl mb-4 opacity-70">📁</div>
        <h3 className="text-green-800 text-2xl font-semibold mb-2">Upload Plant Image</h3>
        <p className="text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
        <span className="block text-gray-400 text-sm mt-2">Supports: JPG, PNG, JPEG</span>
        <span className="block text-gray-400 text-xs mt-1">Max 10MB</span>
        
        {validationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm flex items-center justify-center gap-2">
              <span>⚠️</span>
              {validationError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
