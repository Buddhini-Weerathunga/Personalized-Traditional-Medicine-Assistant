// frontend/src/pages/plant-identification/PlantDescriptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import PlantCard from '../../components/plant-identification/PlantCard';
import { savePlantIdentification } from '../../services/plant-identification/plantApi';

// Comprehensive plant database for the 5 identifiable plants
const PLANT_DATABASE = {
  'Aloevera': {
    plantId: 'aloevera-001',
    plantName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    description: 'Aloe Vera is a succulent plant species from the genus Aloe. The gel inside its thick, fleshy leaves has been used for thousands of years in Ayurvedic and traditional medicine for skin care, wound healing, and digestive health.',
    medicinalUses: [
      'Soothes burns, sunburns, and skin irritations',
      'Promotes wound healing and tissue repair',
      'Supports digestive health and relieves constipation',
      'Moisturizes and rejuvenates skin naturally',
      'Helps manage blood sugar levels',
      'Boosts immunity with antioxidant compounds',
      'Reduces dental plaque and oral infections',
      'Anti-inflammatory properties for joint pain relief'
    ],
    ayurvedicProperties: {
      rasa: 'Bitter (Tikta), Sweet (Madhura)',
      guna: 'Heavy (Guru), Unctuous (Snigdha)',
      virya: 'Cooling (Sheeta)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Pitta and Kapha doshas',
    partsUsed: ['Leaf gel', 'Leaf latex', 'Whole leaf'],
    preparationMethods: [
      'Fresh gel applied topically for skin conditions',
      'Aloe juice for internal digestive support',
      'Gel mixed with turmeric for wound healing',
      'Aloe pulp blended into smoothies',
      'Dried powder (Kumari Churna) for supplements'
    ],
    warnings: [
      'Aloe latex may cause cramping and diarrhea',
      'Not recommended internally during pregnancy',
      'May interact with diabetes and heart medications',
      'Topical use may cause sensitivity in some individuals'
    ],
    commonNames: ['Kumari', 'Ghritkumari', 'Kathalai', 'Komarika']
  },
  'Cinnamon': {
    plantId: 'cinnamon-001',
    plantName: 'Cinnamon',
    scientificName: 'Cinnamomum verum',
    description: 'Cinnamon is a spice obtained from the inner bark of trees from the genus Cinnamomum. Known as "Tvak" in Ayurveda, it has been used for over 4,000 years as a culinary spice and a powerful medicinal herb.',
    medicinalUses: [
      'Regulates blood sugar levels and improves insulin sensitivity',
      'Powerful anti-inflammatory and antioxidant properties',
      'Supports cardiovascular health and reduces cholesterol',
      'Aids digestion and relieves bloating',
      'Natural antimicrobial — fights bacterial and fungal infections',
      'Improves brain function and cognitive performance',
      'Helps relieve respiratory conditions and cold symptoms',
      'Supports oral health and freshens breath'
    ],
    ayurvedicProperties: {
      rasa: 'Pungent (Katu), Sweet (Madhura)',
      guna: 'Light (Laghu), Dry (Ruksha), Sharp (Tikshna)',
      virya: 'Heating (Ushna)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess',
    partsUsed: ['Inner bark', 'Leaves', 'Essential oil', 'Bark powder'],
    preparationMethods: [
      'Cinnamon tea or decoction with honey',
      'Powdered bark in warm milk (golden milk)',
      'Essential oil for aromatherapy',
      'Bark infusion for digestive remedy',
      'Cinnamon water for blood sugar management'
    ],
    warnings: [
      'Cassia cinnamon contains high coumarin — prefer Ceylon variety',
      'May lower blood sugar excessively with diabetes medications',
      'Avoid large medicinal doses during pregnancy',
      'Can cause mouth sores or allergic reactions in sensitive individuals'
    ],
    commonNames: ['Tvak', 'Dalchini', 'Pattai', 'Lavanga Pattai']
  },
  'Hathawariya': {
    plantId: 'hathawariya-001',
    plantName: 'Hathawariya',
    scientificName: 'Asparagus racemosus',
    description: 'Hathawariya, also known as Shatavari, is one of the most important herbs in Ayurvedic medicine, revered as the "Queen of Herbs." It is a powerful adaptogen and rejuvenative tonic, particularly valued for reproductive health.',
    medicinalUses: [
      'Premier female reproductive tonic — supports fertility and hormonal balance',
      'Powerful adaptogen that helps the body cope with stress',
      'Boosts immunity and strengthens the immune system',
      'Improves digestive health and heals gastric ulcers',
      'Galactagogue — promotes lactation in nursing mothers',
      'Anti-aging and rejuvenative properties (Rasayana)',
      'Supports urinary tract health',
      'Nourishes and strengthens the nervous system'
    ],
    ayurvedicProperties: {
      rasa: 'Sweet (Madhura), Bitter (Tikta)',
      guna: 'Heavy (Guru), Unctuous (Snigdha)',
      virya: 'Cooling (Sheeta)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Vata and Pitta doshas',
    partsUsed: ['Tuberous roots', 'Leaves', 'Whole plant'],
    preparationMethods: [
      'Root powder mixed with warm milk and honey',
      'Shatavari Ghrita (medicated ghee preparation)',
      'Decoction of dried roots for digestive support',
      'Root powder capsules as daily supplement',
      'Fresh root juice for reproductive health'
    ],
    warnings: [
      'Avoid if allergic to asparagus family plants',
      'Consult physician if on hormonal medications',
      'May cause weight gain due to nourishing quality',
      'Not recommended during active respiratory congestion'
    ],
    commonNames: ['Shatavari', 'Satamuli', 'Kilavari', 'Shatmuli']
  },
  'Papaya': {
    plantId: 'papaya-001',
    plantName: 'Papaya',
    scientificName: 'Carica papaya',
    description: 'Papaya is a tropical fruit-bearing plant native to Central America, now cultivated worldwide. Every part of the papaya plant has therapeutic applications in traditional medicine. The fruit is rich in papain, a powerful digestive enzyme.',
    medicinalUses: [
      'Increases platelet count — widely used in dengue treatment',
      'Excellent digestive aid due to the enzyme papain',
      'Rich in Vitamin C and antioxidants for immune support',
      'Anti-inflammatory properties reduce swelling and pain',
      'Promotes wound healing and skin health',
      'Supports cardiovascular health and reduces cholesterol',
      'Anti-parasitic — seeds help eliminate intestinal worms',
      'Leaf extract supports liver health and detoxification'
    ],
    ayurvedicProperties: {
      rasa: 'Sweet (Madhura), slightly Pungent (Katu)',
      guna: 'Light (Laghu), Soft (Mridu)',
      virya: 'Heating (Ushna)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Vata and Kapha, may slightly increase Pitta',
    partsUsed: ['Ripe fruit', 'Unripe fruit', 'Leaves', 'Seeds', 'Latex'],
    preparationMethods: [
      'Fresh ripe fruit consumed directly for nutrition',
      'Leaf juice extract for boosting platelet count',
      'Papaya enzyme supplements for digestion',
      'Seed powder as anti-parasitic remedy',
      'Leaf tea for liver support'
    ],
    warnings: [
      'Unripe papaya must be AVOIDED during pregnancy',
      'Papaya latex can cause allergic reactions',
      'May interact with blood-thinning medications',
      'Seeds in high doses may affect male fertility'
    ],
    commonNames: ['Papita', 'Pappali', 'Boppayi', 'Erandakarkati', 'Gaslabu']
  },
  'Turmeric': {
    plantId: 'turmeric-001',
    plantName: 'Turmeric',
    scientificName: 'Curcuma longa',
    description: 'Turmeric is a golden-colored flowering plant of the ginger family, native to the Indian subcontinent. Its rhizome contains curcumin, one of the most extensively researched natural compounds. Known as "Haridra" in Ayurveda, it has been a cornerstone of traditional medicine for over 4,000 years.',
    medicinalUses: [
      'Potent anti-inflammatory — helps manage arthritis and joint pain',
      'Strong antioxidant — neutralizes free radicals',
      'Supports brain health and may prevent neurodegenerative diseases',
      'Promotes cardiovascular health',
      'Aids wound healing when applied topically',
      'Supports liver function and natural detoxification',
      'Helps manage blood sugar levels',
      'Enhances skin health and promotes glow',
      'Boosts immunity and fights infections'
    ],
    ayurvedicProperties: {
      rasa: 'Bitter (Tikta), Pungent (Katu)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Heating (Ushna)',
      vipaka: 'Pungent (Katu)'
    },
    doshaEffect: 'Balances all three doshas (Tridoshahara), especially Kapha',
    partsUsed: ['Rhizome (fresh)', 'Dried rhizome powder', 'Leaves'],
    preparationMethods: [
      'Golden milk — turmeric with warm milk and black pepper',
      'Turmeric paste for wounds and skin conditions',
      'Turmeric tea with ginger and honey',
      'Haldi water on empty stomach',
      'Curcumin extract capsules',
      'Turmeric in daily cooking'
    ],
    warnings: [
      'May increase bleeding risk with blood-thinning medications',
      'High doses can cause stomach upset',
      'May lower blood sugar — monitor if diabetic',
      'Avoid medicinal doses during pregnancy',
      'Can aggravate gallbladder conditions'
    ],
    commonNames: ['Haldi', 'Haridra', 'Manjal', 'Pasupu', 'Kaha']
  }
};

const PlantDescriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { result, image } = location.state || {};

  // Get plant details from database based on identified plant name
  const getPlantDetails = (plantName) => {
    if (!plantName) return null;
    // Try exact match first
    if (PLANT_DATABASE[plantName]) {
      return PLANT_DATABASE[plantName];
    }
    // Try case-insensitive match
    const key = Object.keys(PLANT_DATABASE).find(
      k => k.toLowerCase() === plantName.toLowerCase()
    );
    return key ? PLANT_DATABASE[key] : null;
  };

  const plantDetails = getPlantDetails(result?.plantName);
  
  // Merge identified result with plant database details
  const displayResult = plantDetails ? {
    ...plantDetails,
    confidence: result?.confidence || 0,
    scientificName: plantDetails.scientificName || result?.scientificName
  } : result;

  const displayImage = image || `https://via.placeholder.com/600/228b22/FFFFFF?text=${displayResult?.plantName || 'Plant'}`;

  // Save to recently viewed plants
  useEffect(() => {
    if (displayResult) {
      const recentPlants = JSON.parse(localStorage.getItem('recentPlants') || '[]');
      const plantEntry = {
        plantId: displayResult.plantId,
        plantName: displayResult.plantName,
        scientificName: displayResult.scientificName,
        thumbnail: '🌿',
        viewedAt: new Date().toISOString()
      };
      const filtered = recentPlants.filter(p => p.plantId !== plantEntry.plantId);
      const updated = [plantEntry, ...filtered].slice(0, 10);
      localStorage.setItem('recentPlants', JSON.stringify(updated));
    }
  }, [displayResult]);

  const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await savePlantIdentification({
        plantName: displayResult.plantName,
        scientificName: displayResult.scientificName,
        confidence: displayResult.confidence,
        image: displayImage,
        identifiedAt: new Date().toISOString(),
        ...displayResult
      });
      setSaved(true);
      setTimeout(() => {
        navigate('/plant-history');
      }, 1500);
    } catch (error) {
      console.error('Failed to save identification:', error);
      alert('Failed to save to history. Please try again.');
      setSaving(false);
    }
  };

  const handleScanAnother = () => {
    navigate('/plant-scan');
  };

  if (!displayResult) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center">
          <div className="text-center p-8">
            <span className="text-6xl mb-4 block">🌿</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Plant Data</h2>
            <p className="text-gray-600 mb-6">Please scan a plant first to see its details.</p>
            <button
              onClick={() => navigate('/plant-scan')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Go to Plant Scan
            </button>
          </div>
        </div>
      </>
    );
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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-4">
              <span>🌿 Plant Analysis Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {displayResult.plantName}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 italic">
              {displayResult.scientificName}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Image Column */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="w-full rounded-2xl overflow-hidden shadow-md border border-green-100 mb-4">
                <img src={displayImage} alt="Identified plant" className="w-full h-auto" />
              </div>

              {/* Dosha Effect */}
              {displayResult.doshaEffect && (
                <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-1">Dosha Effect</p>
                  <p className="text-purple-800 font-semibold">{displayResult.doshaEffect}</p>
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Description */}
              {displayResult.description && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>📖</span> About This Plant
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{displayResult.description}</p>
                </div>
              )}

              {/* Medicinal Uses */}
              {displayResult.medicinalUses && displayResult.medicinalUses.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>💊</span> Medicinal Uses
                  </h3>
                  <ul className="space-y-2">
                    {displayResult.medicinalUses.map((use, index) => (
                      <li key={index} className="pl-6 relative text-gray-600 leading-relaxed">
                        <span className="absolute left-0 text-green-500">✓</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Parts Used */}
              {displayResult.partsUsed && displayResult.partsUsed.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🌱</span> Parts Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayResult.partsUsed.map((part, index) => (
                      <span key={index} className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Methods */}
              {displayResult.preparationMethods && displayResult.preparationMethods.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🍵</span> Preparation Methods
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayResult.preparationMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500">•</span>
                        <span className="text-gray-700">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ayurvedic Properties */}
              {displayResult.ayurvedicProperties && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🕉️</span> Ayurvedic Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayResult.ayurvedicProperties.rasa && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Rasa (Taste):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.rasa}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.guna && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Guna (Quality):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.guna}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.virya && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Virya (Potency):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.virya}</span>
                      </div>
                    )}
                    {displayResult.ayurvedicProperties.vipaka && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 block mb-1">Vipaka (Post-digestive):</strong>
                        <span className="text-gray-700">{displayResult.ayurvedicProperties.vipaka}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {displayResult.warnings && displayResult.warnings.length > 0 && (
                <div className="bg-yellow-50 p-6 rounded-2xl shadow-md border border-yellow-200">
                  <h3 className="text-yellow-900 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>⚠️</span> Warnings & Precautions
                  </h3>
                  <ul className="space-y-2">
                    {displayResult.warnings.map((warning, index) => (
                      <li key={index} className="pl-6 relative text-yellow-800 leading-relaxed">
                        <span className="absolute left-0">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Names */}
              {displayResult.commonNames && displayResult.commonNames.length > 0 && (
                <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-green-100">
                  <h3 className="text-green-800 text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🏷️</span> Common Names
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayResult.commonNames.map((name, index) => (
                      <span key={index} className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <button 
                    className="flex-1 px-8 py-3.5 text-base font-medium bg-green-600 text-white rounded-xl hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSaveToHistory}
                    disabled={saving || saved}
                  >
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : '💾 Save to History'}
                  </button>
                  <button 
                    className="flex-1 px-8 py-3.5 text-base font-medium bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                    onClick={handleScanAnother}
                  >
                    📸 Scan Another Plant
                  </button>
                </div>
                
                {/* Browse More Plants Button */}
                <button 
                  className="w-full px-8 py-3.5 text-base font-medium bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors border border-purple-200"
                  onClick={() => navigate('/plant-description')}
                >
                  🌱 Browse More Medicinal Plants
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantDescriptionDetail;