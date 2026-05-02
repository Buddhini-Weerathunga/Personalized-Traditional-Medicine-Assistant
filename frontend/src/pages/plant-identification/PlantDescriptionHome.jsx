// frontend/src/pages/plant-identification/PlantDescriptionHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { getGroqPlantDescription } from '../../services/plant-identification/plantApi';

const PlantDescriptionHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Plants');
  const [recentPlants, setRecentPlants] = useState([]);
  const [groqLoading, setGroqLoading] = useState(false);
  const [groqError, setGroqError] = useState('');

  const allPlants = [
    { plantId: 'gotu-kola', plantName: 'Gotu Kola (ගොටුකොළ)', scientificName: 'Centella asiatica', category: 'Brain & Memory', description: 'Known for cognitive enhancement and wound healing', image: '/images/plants/gotu-kola.jpg' },
    { plantId: 'brahmi', plantName: 'Brahmi (ලුණුවිල)', scientificName: 'Bacopa monnieri', category: 'Brain & Memory', description: 'Memory enhancer and anxiety reducer', image: '/images/plants/brahmi.jpg' },
    { plantId: 'shankhpushpi', plantName: 'Shankhpushpi (කටරොළු)', scientificName: 'Convolvulus prostratus', category: 'Brain & Memory', description: 'Brain tonic for mental clarity and focus', image: '/images/plants/shankhpushpi.jpg' },
    { plantId: 'tulsi', plantName: 'Holy Basil (මදුරුතලා)', scientificName: 'Ocimum tenuiflorum', category: 'Immunity & Stress', description: 'Sacred herb for immunity and stress relief', image: '/images/plants/tulsi.jpg' },
    { plantId: 'giloy', plantName: 'Giloy (රසකිඳ)', scientificName: 'Tinospora cordifolia', category: 'Immunity & Stress', description: 'Powerful immune booster and fever reducer', image: '/images/plants/giloy.jpg' },
    { plantId: 'amla', plantName: 'Amla (නෙල්ලි)', scientificName: 'Phyllanthus emblica', category: 'Immunity & Stress', description: 'Rich in vitamin C, boosts immunity and vitality', image: '/images/plants/amla.jpg' },
    { plantId: 'ginger', plantName: 'Ginger (ඉඟුරු)', scientificName: 'Zingiber officinale', category: 'Digestive', description: 'Digestive aid and anti-nausea remedy', image: '/images/plants/ginger.jpg' },
    { plantId: 'fennel', plantName: 'Fennel (මාදුරු)', scientificName: 'Foeniculum vulgare', category: 'Digestive', description: 'Relieves bloating and improves digestion', image: '/images/plants/fennel.jpg' },
    { plantId: 'neem', plantName: 'Neem (කොහොඹ)', scientificName: 'Azadirachta indica', category: 'Skin & Hair', description: 'Blood purifier and skin health promoter', image: '/images/plants/neem.jpg' },
    { plantId: 'aloe-vera', plantName: 'Aloe Vera (කොමාරිකා)', scientificName: 'Aloe barbadensis', category: 'Skin & Hair', description: 'Skin healing and digestive support', image: '/images/plants/aloe-vera.jpg' },
    { plantId: 'bhringraj', plantName: 'Bhringraj (කීකිරිඳිය)', scientificName: 'Eclipta alba', category: 'Skin & Hair', description: 'Promotes hair growth and prevents graying', image: '/images/plants/bhringraj.jpg' },
    { plantId: 'sandalwood', plantName: 'Sandalwood (සුදු හඳුන්)', scientificName: 'Santalum album', category: 'Skin & Hair', description: 'Cooling and soothing for skin ailments', image: '/images/plants/sandalwood.jpg' },
    { plantId: 'turmeric', plantName: 'Turmeric (කහ)', scientificName: 'Curcuma longa', category: 'Anti-inflammatory', description: 'Powerful anti-inflammatory and antioxidant', image: '/images/plants/turmeric.jpg' },
    { plantId: 'arjuna', plantName: 'Arjuna (කුඹුක්)', scientificName: 'Terminalia arjuna', category: 'Heart Health', description: 'Strengthens heart muscles and improves circulation', image: '/images/plants/arjuna.jpg' },
    { plantId: 'vasaka', plantName: 'Vasaka (ආඩතෝඩා)', scientificName: 'Adhatoda vasica', category: 'Respiratory', description: 'Relieves cough and respiratory disorders', image: '/images/plants/vasaka.jpg' },
    { plantId: 'aralu', plantName: 'Aralu (අරළු)', scientificName: 'Terminalia chebula', category: 'Digestive', description: 'Detoxifier and digestive tonic, one of the three fruits in Triphala', image: '/images/plants/aralu.jpg' },
    { plantId: 'bulu', plantName: 'Bulu (බුළු)', scientificName: 'Terminalia bellirica', category: 'Digestive', description: 'Rejuvenative herb for respiratory and digestive health', image: '/images/plants/bulu.jpg' },
    { plantId: 'cinnamon', plantName: 'Cinnamon (කුරුඳු)', scientificName: 'Cinnamomum verum', category: 'Digestive', description: 'Warming spice that aids digestion and regulates blood sugar', image: '/images/plants/cinnamon.jpg' },
    { plantId: 'cardamom', plantName: 'Cardamom (එනසාල්)', scientificName: 'Elettaria cardamomum', category: 'Digestive', description: 'Aromatic spice for digestive comfort and fresh breath', image: '/images/plants/cardamom.jpg' },
    { plantId: 'black-pepper', plantName: 'Black Pepper (ගම්මිරිස්)', scientificName: 'Piper nigrum', category: 'Digestive', description: 'Enhances nutrient absorption and stimulates digestion', image: '/images/plants/black-pepper.jpg' },
    { plantId: 'iramusu', plantName: 'Iramusu (ඉරමුසු)', scientificName: 'Hemidesmus indicus', category: 'Skin & Hair', description: 'Blood purifier used for skin diseases and urinary disorders', image: '/images/plants/iramusu.jpg' },
    { plantId: 'ranawara', plantName: 'Ranawara (රණවරා)', scientificName: 'Cassia auriculata', category: 'Skin & Hair', description: 'Promotes skin health and helps manage blood sugar levels', image: '/images/plants/ranawara.jpg' },
    { plantId: 'polpala', plantName: 'Polpala (පොල්පලා)', scientificName: 'Aerva lanata', category: 'Immunity & Stress', description: 'Kidney stone remedy and natural diuretic for urinary health', image: '/images/plants/polpala.jpg' },
  ];

  const categories = [
    { name: 'All Plants', count: allPlants.length },
    { name: 'Brain & Memory', count: 3 },
    { name: 'Immunity & Stress', count: 5 },
    { name: 'Digestive', count: 8 },
    { name: 'Skin & Hair', count: 6 },
    { name: 'Anti-inflammatory', count: 1 },
    { name: 'Heart Health', count: 1 },
    { name: 'Respiratory', count: 1 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('recentPlants');
    if (stored) setRecentPlants(JSON.parse(stored));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setGroqError('');

    // First check if query matches any plant in the static list
    const localMatch = allPlants.find(
      p =>
        p.plantName.toLowerCase().includes(query.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(query.toLowerCase()) ||
        p.plantId.toLowerCase().includes(query.toLowerCase())
    );

    if (localMatch) {
      handlePlantClick(localMatch);
      return;
    }

    // Not in static list — call Groq AI
    setGroqLoading(true);
    try {
      const response = await getGroqPlantDescription(query);
      if (!response.success || !response.data?.found) {
        setGroqError(`No information found for "${query}". Try a different plant name.`);
        return;
      }
      const d = response.data;
      navigate('/plant-description/detail', {
        state: {
          result: {
            plantId: d.plantName.toLowerCase().replace(/\s+/g, '-') + '-ai',
            plantName: d.plantName,
            scientificName: d.scientificName,
            confidence: 100,
            description: d.description,
            medicinalUses: d.medicinalUses || [],
            ayurvedicProperties: d.ayurvedicProperties || {},
            doshaEffect: d.doshaEffect || '',
            partsUsed: d.partsUsed || [],
            preparationMethods: d.preparationMethods || [],
            warnings: d.warnings || [],
            commonNames: d.commonNames || [],
            aiGenerated: true,
          },
          image: null,
          healthData: null
        }
      });
    } catch (err) {
      setGroqError('AI lookup failed. Please check your connection and try again.');
    } finally {
      setGroqLoading(false);
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
        image: plant.image || null,
        healthData: null
      }
    });
  };

  const displayPlants = allPlants.filter(p => {
    const matchesCategory = activeCategory === 'All Plants' || p.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      p.plantName.toLowerCase().includes(query) ||
      p.scientificName.toLowerCase().includes(query) ||
      p.plantId.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
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
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                {groqLoading ? (
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                )}
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none py-3 text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  placeholder="Search any medicinal plant (AI-powered)..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setGroqError(''); }}
                  disabled={groqLoading}
                />
              </div>
              <button
                type="submit"
                disabled={groqLoading}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {groqLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* AI hint & error */}
          <div className="max-w-2xl mx-auto mb-8">
            {groqError ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {groqError}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                Search any plant — AI will find it even if it&apos;s not in our database
              </p>
            )}
          </div>

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
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer group flex flex-col"
                  >
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={plant.image}
                        alt={plant.plantName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100" style={{ display: 'none' }}>
                        <svg className="w-12 h-12 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
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
