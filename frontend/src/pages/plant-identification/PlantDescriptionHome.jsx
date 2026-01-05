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

  // Comprehensive database of 20 medicinal plants organized by category
  const allPlants = [
    // Brain & Memory (4 plants)
    {
      plantId: 'gotu-kola',
      plantName: 'Gotu Kola',
      scientificName: 'Centella asiatica',
      thumbnail: '🌿',
      category: 'Brain & Memory',
      description: 'Known for cognitive enhancement and wound healing'
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
      plantId: 'shankhpushpi',
      plantName: 'Shankhpushpi',
      scientificName: 'Convolvulus prostratus',
      thumbnail: '🌸',
      category: 'Brain & Memory',
      description: 'Brain tonic for mental clarity and focus'
    },
    {
      plantId: 'jatamansi',
      plantName: 'Jatamansi',
      scientificName: 'Nardostachys jatamansi',
      thumbnail: '🌺',
      category: 'Brain & Memory',
      description: 'Calms the mind and improves sleep quality'
    },
    
    // Immunity & Stress (4 plants)
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
      category: 'Immunity & Stress',
      description: 'Adaptogenic herb for energy and vitality'
    },
    {
      plantId: 'giloy',
      plantName: 'Giloy',
      scientificName: 'Tinospora cordifolia',
      thumbnail: '🌿',
      category: 'Immunity & Stress',
      description: 'Powerful immune booster and fever reducer'
    },
    {
      plantId: 'amla',
      plantName: 'Amla (Indian Gooseberry)',
      scientificName: 'Phyllanthus emblica',
      thumbnail: '🫐',
      category: 'Immunity & Stress',
      description: 'Rich in vitamin C, boosts immunity and vitality'
    },
    
    // Digestive (3 plants)
    {
      plantId: 'ginger',
      plantName: 'Ginger',
      scientificName: 'Zingiber officinale',
      thumbnail: '🫚',
      category: 'Digestive',
      description: 'Digestive aid and anti-nausea remedy'
    },
    {
      plantId: 'triphala',
      plantName: 'Triphala',
      scientificName: 'Terminalia chebula complex',
      thumbnail: '🍃',
      category: 'Digestive',
      description: 'Ayurvedic formula for digestive health'
    },
    {
      plantId: 'fennel',
      plantName: 'Fennel',
      scientificName: 'Foeniculum vulgare',
      thumbnail: '🌾',
      category: 'Digestive',
      description: 'Relieves bloating and improves digestion'
    },
    
    // Skin & Hair (4 plants)
    {
      plantId: 'neem',
      plantName: 'Neem',
      scientificName: 'Azadirachta indica',
      thumbnail: '🌳',
      category: 'Skin & Hair',
      description: 'Blood purifier and skin health promoter'
    },
    {
      plantId: 'aloe-vera',
      plantName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis',
      thumbnail: '🌵',
      category: 'Skin & Hair',
      description: 'Skin healing and digestive support'
    },
    {
      plantId: 'bhringraj',
      plantName: 'Bhringraj',
      scientificName: 'Eclipta alba',
      thumbnail: '🌼',
      category: 'Skin & Hair',
      description: 'Promotes hair growth and prevents graying'
    },
    {
      plantId: 'sandalwood',
      plantName: 'Sandalwood',
      scientificName: 'Santalum album',
      thumbnail: '🪵',
      category: 'Skin & Hair',
      description: 'Cooling and soothing for skin ailments'
    },
    
    // Anti-inflammatory (3 plants)
    {
      plantId: 'turmeric',
      plantName: 'Turmeric',
      scientificName: 'Curcuma longa',
      thumbnail: '🟡',
      category: 'Anti-inflammatory',
      description: 'Powerful anti-inflammatory and antioxidant'
    },
    {
      plantId: 'boswellia',
      plantName: 'Boswellia (Frankincense)',
      scientificName: 'Boswellia serrata',
      thumbnail: '🌰',
      category: 'Anti-inflammatory',
      description: 'Reduces inflammation and joint pain'
    },
    {
      plantId: 'guggul',
      plantName: 'Guggul',
      scientificName: 'Commiphora wightii',
      thumbnail: '🪨',
      category: 'Anti-inflammatory',
      description: 'Supports joint health and cholesterol management'
    },
    
    // Respiratory & Heart Health (2 plants)
    {
      plantId: 'arjuna',
      plantName: 'Arjuna',
      scientificName: 'Terminalia arjuna',
      thumbnail: '❤️',
      category: 'Heart Health',
      description: 'Strengthens heart muscles and improves circulation'
    },
    {
      plantId: 'vasaka',
      plantName: 'Vasaka',
      scientificName: 'Adhatoda vasica',
      thumbnail: '🌿',
      category: 'Respiratory',
      description: 'Relieves cough and respiratory disorders'
    }
  ];

  // Organize plants by category
  const plantsByCategory = {
    'Brain & Memory': allPlants.filter(p => p.category === 'Brain & Memory'),
    'Immunity & Stress': allPlants.filter(p => p.category === 'Immunity & Stress'),
    'Digestive': allPlants.filter(p => p.category === 'Digestive'),
    'Skin & Hair': allPlants.filter(p => p.category === 'Skin & Hair'),
    'Anti-inflammatory': allPlants.filter(p => p.category === 'Anti-inflammatory'),
    'Other': allPlants.filter(p => p.category === 'Heart Health' || p.category === 'Respiratory')
  };

  const categories = [
    { name: 'All Plants', icon: '🌿', count: allPlants.length },
    { name: 'Brain & Memory', icon: '🧠', count: plantsByCategory['Brain & Memory'].length },
    { name: 'Immunity & Stress', icon: '🛡️', count: plantsByCategory['Immunity & Stress'].length },
    { name: 'Digestive', icon: '🍃', count: plantsByCategory['Digestive'].length },
    { name: 'Skin & Hair', icon: '✨', count: plantsByCategory['Skin & Hair'].length },
    { name: 'Anti-inflammatory', icon: '💪', count: plantsByCategory['Anti-inflammatory'].length }
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore All Medicinal Plants ({allPlants.length} Plants)</h2>
            
            {/* Brain & Memory Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                Brain & Memory
                <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Brain & Memory'].length} plants)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plantsByCategory['Brain & Memory'].map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{plant.thumbnail}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mb-2">
                      {plant.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600">{plant.description}</p>
                    <button className="mt-4 text-purple-600 font-semibold text-sm hover:text-purple-700 flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Immunity & Stress Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                Immunity & Stress Relief
                <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Immunity & Stress'].length} plants)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plantsByCategory['Immunity & Stress'].map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{plant.thumbnail}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                      {plant.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600">{plant.description}</p>
                    <button className="mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Digestive Health Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🍃</span>
                Digestive Health
                <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Digestive'].length} plants)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plantsByCategory['Digestive'].map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{plant.thumbnail}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full mb-2">
                      {plant.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600">{plant.description}</p>
                    <button className="mt-4 text-orange-600 font-semibold text-sm hover:text-orange-700 flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skin & Hair Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Skin & Hair Care
                <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Skin & Hair'].length} plants)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plantsByCategory['Skin & Hair'].map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{plant.thumbnail}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full mb-2">
                      {plant.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600">{plant.description}</p>
                    <button className="mt-4 text-pink-600 font-semibold text-sm hover:text-pink-700 flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-inflammatory Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Anti-inflammatory
                <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Anti-inflammatory'].length} plants)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plantsByCategory['Anti-inflammatory'].map((plant, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white/80 rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{plant.thumbnail}</span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full mb-2">
                      {plant.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{plant.plantName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600">{plant.description}</p>
                    <button className="mt-4 text-red-600 font-semibold text-sm hover:text-red-700 flex items-center gap-1">
                      View Details <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Categories Section */}
            {plantsByCategory['Other'].length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  Other Health Benefits
                  <span className="text-sm text-gray-500 font-normal">({plantsByCategory['Other'].length} plants)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plantsByCategory['Other'].map((plant, index) => (
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
            )}
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
