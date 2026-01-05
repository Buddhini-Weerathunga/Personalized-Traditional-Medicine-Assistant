import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import PlantCard from '../../components/plant-identification/PlantCard';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { getPlantHistory, deletePlantIdentification } from '../../services/plant-identification/plantApi';

const PlantHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, recent, favorites
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getPlantHistory();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('Failed to load history. Please try again.');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this identification?')) {
      try {
        await deletePlantIdentification(id);
        setHistory(history.filter(item => item._id !== id));
      } catch (err) {
        alert('Failed to delete identification. Please try again.');
        console.error('Error deleting identification:', err);
      }
    }
  };

  const handleViewDetails = (item) => {
    navigate('/plant-description/detail', { 
      state: { 
        result: {
          plantName: item.plantName,
          scientificName: item.scientificName,
          confidence: item.confidence,
        }, 
        image: item.image 
      } 
    });
  };

  const filteredHistory = history.filter(item => {
    // Apply search filter
    const matchesSearch = item.plantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    if (filter === 'recent') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(item.identifiedAt) > oneDayAgo;
    }
    
    if (filter === 'favorites') {
      return matchesSearch && item.isFavorite;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading your plant history..." />;
  }

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Background Decorations */}
      <div className="pointer-events-none">
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
            <span>📚 Your Plant Journey</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Plant History
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            View and manage your previously identified plants
          </p>
        </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button 
          className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-green-800 bg-white border-2 border-green-300 rounded-full shadow-[0_8px_24px_rgba(16,185,129,0.12)] hover:bg-green-50 hover:border-green-500 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={() => navigate('/plant-scan')}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-base shadow-inner">+</span>
          <span className="leading-tight">
            <span className="block">Identify New Plant</span>
            <span className="block text-[11px] font-normal text-green-700/80">Scan or upload a photo</span>
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-xl border-2 border-green-100">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by plant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 pr-10 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-green-600 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">🔍</span>
        </div>

        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'recent' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
          <button 
            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'favorites' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('favorites')}
          >
            Favorites
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-4 px-8 py-6 bg-red-50 text-red-700 rounded-xl mb-8">
          <span className="text-xl">⚠️</span>
          <span className="flex-1">{error}</span>
          <button onClick={fetchHistory} className="px-4 py-2 bg-white border border-red-700 rounded-lg text-red-700 font-medium hover:bg-red-50">
            Retry
          </button>
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 px-8 bg-white rounded-xl shadow-lg">
          <div className="text-8xl mb-4">🌿</div>
          <h2 className="text-green-800 text-3xl font-bold mb-2">No plants identified yet</h2>
          <p className="text-gray-600 text-lg mb-8">Start by scanning your first plant!</p>
          <button 
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-green-800 bg-white border-2 border-green-300 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:bg-green-50 hover:border-green-500 hover:-translate-y-0.5 hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => navigate('/plant-scan')}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg shadow-inner">🌿</span>
            <span>Identify a Plant</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredHistory.map((item) => (
            <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
              <div className="relative w-full h-48 overflow-hidden">
                <img src={item.image} alt={item.plantName} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full font-semibold text-sm text-green-800">
                  {item.confidence}%
                </div>
              </div>
              
              <div className="p-5 flex-1">
                <h3 className="text-green-800 text-xl font-semibold mb-2">{item.plantName}</h3>
                {item.scientificName && (
                  <p className="text-gray-500 text-sm mb-3">
                    <em>{item.scientificName}</em>
                  </p>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400 text-sm">
                    📅 {formatDate(item.identifiedAt)}
                  </span>
                </div>

                {item.medicinalUses && item.medicinalUses.length > 0 && (
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1.5 bg-green-100 text-green-800 rounded-xl text-sm">
                      💊 {item.medicinalUses.length} medicinal uses
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 p-5 pt-0 border-t border-gray-100">
                <button 
                  className="p-2 text-xl bg-transparent rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => handleViewDetails(item)}
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  className="p-2 text-xl bg-transparent rounded-lg hover:bg-red-50 transition-colors"
                  onClick={() => handleDelete(item._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredHistory.length > 0 && (
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-gray-600 text-sm">Showing {filteredHistory.length} of {history.length} identifications</p>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default PlantHistory;
