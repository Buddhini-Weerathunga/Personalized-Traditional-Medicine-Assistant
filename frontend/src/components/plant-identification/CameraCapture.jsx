import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      onCapture(imageData);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  if (error) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-xl">
        <p className="text-red-700 text-lg mb-6">{error}</p>
        <button onClick={handleCancel} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas 
          ref={canvasRef} 
          className="hidden"
        />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-4/5 border-4 border-green-600/70 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]"></div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 p-8 bg-white rounded-b-xl">
        <button 
          onClick={handleCancel}
          className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-700 transition-all hover:scale-110 active:scale-95"
          title="Cancel"
        >
          ✕
        </button>
        
        <button 
          onClick={captureImage}
          className="relative transition-transform hover:scale-110 active:scale-95"
          title="Capture"
        >
          <div className="w-20 h-20 border-4 border-green-600 rounded-full flex items-center justify-center bg-white">
            <div className="w-16 h-16 bg-green-600 rounded-full transition-transform hover:scale-90 active:scale-75"></div>
          </div>
        </button>
        
        <button 
          onClick={toggleCamera}
          className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-100 rounded-full hover:bg-blue-50 transition-all hover:scale-110 active:scale-95"
          title="Flip Camera"
        >
          🔄
        </button>
      </div>

      <div className="text-center p-4 text-gray-600 text-sm">
        <p>📷 Position the plant in the center of the frame for best results</p>
      </div>
    </div>
  );
};

export default CameraCapture;
