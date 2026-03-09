import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { getPlantHistory, deletePlantIdentification } from '../../services/plant-identification/plantApi';

const PlantHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
    const matchesSearch = item.plantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner message="Loading your plant history..." />;
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'recent', label: 'Recent' },
    { key: 'favorites', label: 'Favorites' },
  ];

  return (
    <>
      <PlantNavbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              Your Plant Journey
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Plant <span className="text-emerald-600">History</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
              View and manage your previously identified plants
            </p>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <svg className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by plant name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filter === f.key
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* New Scan */}
              <button
                onClick={() => navigate('/plant-scan')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Identify New Plant
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="flex-1 text-sm text-red-700">{error}</p>
              <button onClick={fetchHistory} className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No plants identified yet</h2>
              <p className="text-sm text-gray-500 mb-6">Start by scanning your first medicinal plant</p>
              <button
                onClick={() => navigate('/plant-scan')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
              >
                Identify a Plant
              </button>
            </div>
          ) : (
            <>
              {/* Plant Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                {filteredHistory.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all flex flex-col group">
                    {/* Image */}
                    <div className="relative w-full h-44 overflow-hidden bg-gray-50">
                      <img src={item.image} alt={item.plantName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-0.5">{item.plantName}</h3>
                      {item.scientificName && (
                        <p className="text-xs text-gray-400 italic mb-3">{item.scientificName}</p>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(item.identifiedAt)}
                      </div>

                      {item.medicinalUses && item.medicinalUses.length > 0 && (
                        <span className="inline-block w-fit px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-medium mb-3">
                          {item.medicinalUses.length} medicinal uses
                        </span>
                      )}

                      <div className="mt-auto pt-3 border-t border-gray-50 flex justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetails(item)}
                          title="View Details"
                          className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Count */}
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Showing {filteredHistory.length} of {history.length} identifications
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default PlantHistory;
