// frontend/src/pages/plant-identification/PlantDescriptionHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';

const PlantDescriptionHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentPlants, setRecentPlants] = useState([]);

  // Mock data for popular/common medicinal plants
  const popularPlants = [
    {
      plantId: 'gotu-kola',
      plantName: 'Gotu Kola',
      scientificName: 'Centella asiatica',
      thumbnail: '🌿',
      category: 'Brain & Memory',
      description: 'Known for cognitive enhancement and wound healing'
    },
    {
      plantId: 'tulsi',
      plantName: 'Holy Basil (Tulsi)',
      scientificName: 'Ocimum tenuiflorum',
      thumbnail: '🌱',
      category: 'Immunity & Stress',
      description: 'Sacred herb for immunity and stress relief'
    },
    {
      plantId: 'ashwagandha',
      plantName: 'Ashwagandha',
      scientificName: 'Withania somnifera',
      thumbnail: '🪴',
      category: 'Energy & Vitality',
      description: 'Adaptogenic herb for energy and vitality'
    },
    {
      plantId: 'turmeric',
      plantName: 'Turmeric',
      scientificName: 'Curcuma longa',
      thumbnail: '🌾',
      category: 'Anti-inflammatory',
      description: 'Powerful anti-inflammatory and antioxidant'
    },
    {
      plantId: 'neem',
      plantName: 'Neem',
      scientificName: 'Azadirachta indica',
      thumbnail: '🌳',
      category: 'Skin & Blood',
      description: 'Blood purifier and skin health promoter'
    },
    {
      plantId: 'brahmi',
      plantName: 'Brahmi',
      scientificName: 'Bacopa monnieri',
      thumbnail: '🍀',
      category: 'Brain & Memory',
      description: 'Memory enhancer and anxiety reducer'
    },
    {
      plantId: 'aloe-vera',
      plantName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis',
      thumbnail: '🌵',
      category: 'Skin & Digestive',
      description: 'Skin healing and digestive support'
    },
    {
      plantId: 'ginger',
      plantName: 'Ginger',
      scientificName: 'Zingiber officinale',
      thumbnail: '🫚',
      category: 'Digestive',
      description: 'Digestive aid and anti-nausea remedy'
    }
  ];

  const categories = [
    { name: 'All Plants', icon: '🌿', count: 500 },
    { name: 'Brain & Memory', icon: '🧠', count: 45 },
    { name: 'Immunity & Stress', icon: '🛡️', count: 62 },
    { name: 'Digestive', icon: '🍃', count: 58 },
    { name: 'Skin & Hair', icon: '✨', count: 73 },
    { name: 'Anti-inflammatory', icon: '💪', count: 41 }
  ];

  useEffect(() => {
    // Load recently viewed plants from localStorage
    const stored = localStorage.getItem('recentPlants');
    if (stored) {
      setRecentPlants(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter plants
      navigate(`/plant-description?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePlantClick = (plant) => {
    // Navigate to plant description with plant data
    navigate('/plant-description/detail', {
      state: {
        result: {
          plantId: plant.plantId,
          plantName: plant.plantName,
          scientificName: plant.scientificName,
          confidence: 100,
          description: plant.description,
          medicinalUses: [
            'Traditional Ayurvedic medicine',
            'Modern herbal remedies',
            'Wellness supplements'
          ],
          ayurvedicProperties: {
            rasa: 'Varies by plant',
            guna: 'Varies by plant',
            virya: 'Varies by plant',
            vipaka: 'Varies by plant'
          },
          warnings: [
            'Consult healthcare provider before use',
            'Not recommended during pregnancy without guidance'
          ]
        },
        image: null,
        healthData: null
      }
    });
  };

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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
              <span>📚 Medicinal Plant Database</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Plant Descriptions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Explore our comprehensive database of medicinal plants, their properties, and health benefits
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-full shadow-md border border-green-100 flex items-center px-6">
                <span className="text-gray-400 mr-3">🔍</span>
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none py-4 text-base text-gray-800 placeholder:text-gray-400"
                  placeholder="Search for a medicinal plant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Search
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/plant-description?category=${encodeURIComponent(category.name)}`)}
                  className="bg-white/80 rounded-xl p-4 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all text-center"
                >
                  <span className="text-3xl block mb-2">{category.icon}</span>
                  <span className="text-sm font-semibold text-gray-900 block">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count} plants</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          {recentPlants.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentPlants.slice(0, 4).map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-xl p-4 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <div className="text-4xl mb-3">{plant.thumbnail || '🌿'}</div>
                    <h3 className="font-semibold text-gray-900">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Plants */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Medicinal Plants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPlants.map((plant, index) => (
                <div
                  key={index}
                  onClick={() => handlePlantClick(plant)}
                  className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{plant.thumbnail}</span>
                  </div>
                  <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                    {plant.category}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                  <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                  <p className="text-sm text-gray-600">{plant.description}</p>
                  <button className="mt-4 text-green-600 font-semibold text-sm hover:text-green-700 flex items-center gap-1">
                    View Details <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Can't find the plant you're looking for?</h2>
            <p className="text-green-100 mb-6">Scan a plant image and our AI will identify it for you!</p>
            <button
              onClick={() => navigate('/plant-scan')}
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-green-50 transition-all shadow-lg"
            >
              📸 Scan a Plant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantDescriptionHome;
