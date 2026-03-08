// frontend/src/pages/plant-identification/PlantDescriptionHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';

const PlantDescriptionHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Plants');
  const [recentPlants, setRecentPlants] = useState([]);

  const allPlants = [
    { plantId: 'gotu-kola', plantName: 'Gotu Kola', scientificName: 'Centella asiatica', category: 'Brain & Memory', description: 'Known for cognitive enhancement and wound healing' },
    { plantId: 'brahmi', plantName: 'Brahmi', scientificName: 'Bacopa monnieri', category: 'Brain & Memory', description: 'Memory enhancer and anxiety reducer' },
    { plantId: 'shankhpushpi', plantName: 'Shankhpushpi', scientificName: 'Convolvulus prostratus', category: 'Brain & Memory', description: 'Brain tonic for mental clarity and focus' },
    { plantId: 'jatamansi', plantName: 'Jatamansi', scientificName: 'Nardostachys jatamansi', category: 'Brain & Memory', description: 'Calms the mind and improves sleep quality' },
    { plantId: 'tulsi', plantName: 'Holy Basil (Tulsi)', scientificName: 'Ocimum tenuiflorum', category: 'Immunity & Stress', description: 'Sacred herb for immunity and stress relief' },
    { plantId: 'ashwagandha', plantName: 'Ashwagandha', scientificName: 'Withania somnifera', category: 'Immunity & Stress', description: 'Adaptogenic herb for energy and vitality' },
    { plantId: 'giloy', plantName: 'Giloy', scientificName: 'Tinospora cordifolia', category: 'Immunity & Stress', description: 'Powerful immune booster and fever reducer' },
    { plantId: 'amla', plantName: 'Amla (Indian Gooseberry)', scientificName: 'Phyllanthus emblica', category: 'Immunity & Stress', description: 'Rich in vitamin C, boosts immunity and vitality' },
    { plantId: 'ginger', plantName: 'Ginger', scientificName: 'Zingiber officinale', category: 'Digestive', description: 'Digestive aid and anti-nausea remedy' },
    { plantId: 'triphala', plantName: 'Triphala', scientificName: 'Terminalia chebula complex', category: 'Digestive', description: 'Ayurvedic formula for digestive health' },
    { plantId: 'fennel', plantName: 'Fennel', scientificName: 'Foeniculum vulgare', category: 'Digestive', description: 'Relieves bloating and improves digestion' },
    { plantId: 'neem', plantName: 'Neem', scientificName: 'Azadirachta indica', category: 'Skin & Hair', description: 'Blood purifier and skin health promoter' },
    { plantId: 'aloe-vera', plantName: 'Aloe Vera', scientificName: 'Aloe barbadensis', category: 'Skin & Hair', description: 'Skin healing and digestive support' },
    { plantId: 'bhringraj', plantName: 'Bhringraj', scientificName: 'Eclipta alba', category: 'Skin & Hair', description: 'Promotes hair growth and prevents graying' },
    { plantId: 'sandalwood', plantName: 'Sandalwood', scientificName: 'Santalum album', category: 'Skin & Hair', description: 'Cooling and soothing for skin ailments' },
    { plantId: 'turmeric', plantName: 'Turmeric', scientificName: 'Curcuma longa', category: 'Anti-inflammatory', description: 'Powerful anti-inflammatory and antioxidant' },
    { plantId: 'boswellia', plantName: 'Boswellia (Frankincense)', scientificName: 'Boswellia serrata', category: 'Anti-inflammatory', description: 'Reduces inflammation and joint pain' },
    { plantId: 'guggul', plantName: 'Guggul', scientificName: 'Commiphora wightii', category: 'Anti-inflammatory', description: 'Supports joint health and cholesterol management' },
    { plantId: 'arjuna', plantName: 'Arjuna', scientificName: 'Terminalia arjuna', category: 'Heart Health', description: 'Strengthens heart muscles and improves circulation' },
    { plantId: 'vasaka', plantName: 'Vasaka', scientificName: 'Adhatoda vasica', category: 'Respiratory', description: 'Relieves cough and respiratory disorders' },
  ];

  const categories = [
    { name: 'All Plants', count: allPlants.length },
    { name: 'Brain & Memory', count: 4 },
    { name: 'Immunity & Stress', count: 4 },
    { name: 'Digestive', count: 3 },
    { name: 'Skin & Hair', count: 4 },
    { name: 'Anti-inflammatory', count: 3 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('recentPlants');
    if (stored) setRecentPlants(JSON.parse(stored));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/plant-description?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePlantClick = (plant) => {
    navigate('/plant-description/detail', {
      state: {
        result: {
          plantId: plant.plantId,
          plantName: plant.plantName,
          scientificName: plant.scientificName,
          confidence: 100,
          description: plant.description,
          medicinalUses: ['Traditional Ayurvedic medicine', 'Modern herbal remedies', 'Wellness supplements'],
          ayurvedicProperties: { rasa: 'Varies by plant', guna: 'Varies by plant', virya: 'Varies by plant', vipaka: 'Varies by plant' },
          warnings: ['Consult healthcare provider before use', 'Not recommended during pregnancy without guidance']
        },
        image: null,
        healthData: null
      }
    });
  };

  const displayPlants = allPlants.filter(p => {
    const matchesCategory = activeCategory === 'All Plants' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.plantName.toLowerCase().includes(searchQuery.toLowerCase()) || p.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat) => {
    const colors = {
      'Brain & Memory': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', accent: 'text-purple-600' },
      'Immunity & Stress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', accent: 'text-blue-600' },
      'Digestive': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', accent: 'text-amber-600' },
      'Skin & Hair': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', accent: 'text-pink-600' },
      'Anti-inflammatory': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', accent: 'text-red-600' },
      'Heart Health': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', accent: 'text-rose-600' },
      'Respiratory': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100', accent: 'text-teal-600' },
    };
    return colors[cat] || { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', accent: 'text-emerald-600' };
  };

  return (
    <>
      <PlantNavbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              Medicinal Plant Database
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Plant <span className="text-emerald-600">Descriptions</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              Explore our comprehensive database of medicinal plants, their properties, and health benefits
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none py-3 text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  placeholder="Search for a medicinal plant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                Search
              </button>
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-10 max-w-4xl mx-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeCategory === cat.name
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat.name} <span className="text-gray-400 ml-1">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Recently Viewed */}
          {recentPlants.length > 0 && activeCategory === 'All Plants' && (
            <div className="mb-10">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recently Viewed
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentPlants.slice(0, 4).map((plant, i) => (
                  <div
                    key={i}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{plant.plantName}</h3>
                    <p className="text-xs text-gray-400 italic">{plant.scientificName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plants Grid */}
          <div className="mb-10">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              {activeCategory === 'All Plants' ? 'All Medicinal Plants' : activeCategory}
            </h2>
            <p className="text-xs text-gray-400 mb-5">{displayPlants.length} plants</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayPlants.map((plant, i) => {
                const color = getCategoryColor(plant.category);
                return (
                  <div
                    key={i}
                    onClick={() => handlePlantClick(plant)}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer group flex flex-col"
                  >
                    <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center mb-4`}>
                      <svg className={`w-5 h-5 ${color.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span className={`inline-block w-fit px-2.5 py-1 ${color.bg} ${color.text} rounded-full text-[11px] font-medium mb-2`}>
                      {plant.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">{plant.plantName}</h3>
                    <p className="text-xs text-gray-400 italic mb-2">{plant.scientificName}</p>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{plant.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                      View Details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Can't find the plant you're looking for?</h2>
            <p className="text-sm text-gray-500 mb-5">Scan a plant image and our AI will identify it for you</p>
            <button
              onClick={() => navigate('/plant-scan')}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Scan a Plant
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlantDescriptionHome;
