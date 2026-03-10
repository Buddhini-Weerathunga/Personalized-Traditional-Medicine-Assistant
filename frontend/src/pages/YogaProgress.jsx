import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ProgressTracker from '../components/Yoga/ProgressTracker';
import * as yogaApi from '../services/yogaApi';

export default function YogaProgress() {
  const [userProgress, setUserProgress] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      // Load user progress
      const progressResponse = await yogaApi.getUserProgress();
      if (progressResponse.data.success) {
        setUserProgress(progressResponse.data.progress);
      }
      
      // Load session history
      const historyResponse = await yogaApi.getSessionHistory(20);
      if (historyResponse.data.success) {
        setSessionHistory(historyResponse.data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProgressData();
    setIsRefreshing(false);
  };

  const handleBack = () => {
    navigate('/yoga-consultation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Your Yoga Progress</h1>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProgressTracker 
          userProgress={userProgress} 
          sessionHistory={sessionHistory}
          onBack={handleBack} 
        />
      </main>
    </div>
  );
}