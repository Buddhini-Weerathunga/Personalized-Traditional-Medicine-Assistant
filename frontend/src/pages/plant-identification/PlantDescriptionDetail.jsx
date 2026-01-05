// frontend/src/pages/plant-identification/PlantDescriptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import PlantCard from '../../components/plant-identification/PlantCard';
import { savePlantIdentification } from '../../services/plant-identification/plantApi';

// Comprehensive plant database for all 8 plants
const PLANT_DATABASE = {
  'Amla': {
    plantId: 'amla-001',
    plantName: 'Amla',
    scientificName: 'Phyllanthus emblica',
    description: 'Amla, also known as Indian Gooseberry, is one of the most important plants in Ayurvedic medicine. It is a small to medium-sized deciduous tree native to India. The fruit is highly nutritious and is one of the richest natural sources of Vitamin C. Amla has been used for thousands of years in traditional medicine for its rejuvenating and healing properties.',
    medicinalUses: [
      'Rich source of Vitamin C - boosts immunity and fights infections',
      'Promotes healthy hair growth and prevents premature graying',
      'Improves digestion and relieves constipation',
      'Helps manage diabetes by regulating blood sugar levels',
      'Anti-aging properties - rejuvenates skin and promotes collagen production',
      'Supports heart health and reduces cholesterol',
      'Enhances memory and cognitive function',
      'Detoxifies the body and purifies blood'
    ],
    ayurvedicProperties: {
      rasa: 'Sour, Sweet, Pungent, Bitter, Astringent (5 of 6 tastes)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Cooling (Sheeta)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances all three doshas (Vata, Pitta, Kapha) - Tridoshahara',
    partsUsed: ['Fruit', 'Seed', 'Leaves', 'Bark', 'Root'],
    preparationMethods: [
      'Fresh fruit juice',
      'Dried powder (Churna)',
      'Amla pickle (Achar)',
      'Amla candy (Murabba)',
      'Hair oil infusion',
      'Chyawanprash ingredient'
    ],
    warnings: [
      'May lower blood sugar - diabetics should monitor levels',
      'Can increase bleeding risk if taken with blood thinners',
      'May cause acidity in some people when consumed on empty stomach',
      'Pregnant women should consult doctor before use'
    ],
    commonNames: ['Indian Gooseberry', 'Amalaki', 'Dhatri', 'Nelli', 'Amla']
  },
  'Betel': {
    plantId: 'betel-001',
    plantName: 'Betel',
    scientificName: 'Piper betle',
    description: 'Betel is a vine belonging to the Piperaceae family, native to South and Southeast Asia. The heart-shaped leaves have been used for thousands of years in traditional medicine and cultural practices. Betel leaves are known for their strong aromatic flavor and numerous medicinal properties. They are commonly chewed with areca nut in many Asian cultures.',
    medicinalUses: [
      'Natural antiseptic - heals wounds and prevents infections',
      'Relieves cough and respiratory problems',
      'Improves oral health and freshens breath',
      'Aids digestion and relieves gastric problems',
      'Reduces inflammation and pain',
      'Helps control diabetes',
      'Treats headaches when applied as paste',
      'Supports wound healing and skin health'
    ],
    ayurvedicProperties: {
      rasa: 'Pungent (Katu), Bitter (Tikta)',
      guna: 'Light (Laghu), Sharp (Tikshna)',
      virya: 'Heating (Ushna)',
      vipaka: 'Pungent (Katu)'
    },
    doshaEffect: 'Balances Kapha and Vata, may increase Pitta in excess',
    partsUsed: ['Leaves', 'Stem', 'Root'],
    preparationMethods: [
      'Fresh leaf chewing',
      'Leaf juice extract',
      'Poultice for wounds',
      'Oil infusion',
      'Decoction for gargling'
    ],
    warnings: [
      'Excessive chewing may cause oral cancer risk',
      'May interact with certain medications',
      'Not recommended during pregnancy',
      'Can cause mouth irritation in sensitive individuals',
      'Avoid combining with tobacco products'
    ],
    commonNames: ['Paan', 'Vetrilai', 'Nagavalli', 'Tambula', 'Betel Leaf']
  },
  'Ginger': {
    plantId: 'ginger-001',
    plantName: 'Ginger',
    scientificName: 'Zingiber officinale',
    description: 'Ginger is a flowering plant whose rhizome (underground stem) is widely used as a spice and medicine. Native to Southeast Asia, it has been used for over 5,000 years in Ayurvedic and Chinese medicine. Ginger contains bioactive compounds like gingerol that provide powerful anti-inflammatory and antioxidant effects. It is considered a universal medicine in Ayurveda.',
    medicinalUses: [
      'Relieves nausea and motion sickness',
      'Reduces muscle pain and soreness',
      'Anti-inflammatory - helps with arthritis and joint pain',
      'Aids digestion and reduces bloating',
      'Lowers blood sugar levels',
      'Reduces menstrual pain',
      'Fights infections - antibacterial and antiviral',
      'Improves brain function and memory',
      'Helps reduce cholesterol levels'
    ],
    ayurvedicProperties: {
      rasa: 'Pungent (Katu)',
      guna: 'Light (Laghu), Oily (Snigdha)',
      virya: 'Heating (Ushna)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess',
    partsUsed: ['Rhizome (Root)', 'Fresh ginger', 'Dried ginger (Sonth)'],
    preparationMethods: [
      'Fresh ginger tea',
      'Dried powder in food',
      'Ginger juice with honey',
      'Ginger paste for external application',
      'Pickled ginger',
      'Ginger oil'
    ],
    warnings: [
      'May increase bleeding risk with blood thinners',
      'Can cause heartburn in some people',
      'High doses may lower blood sugar too much',
      'May interact with heart medications',
      'Avoid large amounts during pregnancy'
    ],
    commonNames: ['Adrak', 'Shunti', 'Sonth', 'Inji', 'Ale']
  },
  'Guava': {
    plantId: 'guava-001',
    plantName: 'Guava',
    scientificName: 'Psidium guajava',
    description: 'Guava is a tropical fruit tree native to Central America and now grown throughout tropical and subtropical regions. Both the fruit and leaves have significant medicinal value in traditional medicine. Guava leaves are particularly valued in Ayurveda for their therapeutic properties. The plant is rich in vitamins, antioxidants, and bioactive compounds.',
    medicinalUses: [
      'Controls diabetes - leaves lower blood glucose levels',
      'Treats diarrhea and dysentery',
      'Rich in Vitamin C - boosts immunity',
      'Promotes weight loss',
      'Improves heart health and lowers cholesterol',
      'Helps with menstrual cramps',
      'Anticancer properties',
      'Improves skin health and reduces acne',
      'Supports digestive health'
    ],
    ayurvedicProperties: {
      rasa: 'Sweet (Madhura), Astringent (Kashaya)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Cooling (Sheeta)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Pitta and Kapha, may increase Vata',
    partsUsed: ['Leaves', 'Fruit', 'Bark', 'Root'],
    preparationMethods: [
      'Fresh fruit consumption',
      'Leaf tea/decoction',
      'Leaf paste for wounds',
      'Bark decoction for diarrhea',
      'Juice'
    ],
    warnings: [
      'May lower blood sugar - diabetics should monitor',
      'Excess consumption may cause constipation',
      'Unripe fruit may cause digestive issues',
      'May interact with diabetes medications'
    ],
    commonNames: ['Amrood', 'Peru', 'Jamphal', 'Koiyya', 'Goiaba']
  },
  'Neem': {
    plantId: 'neem-001',
    plantName: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Neem is an evergreen tree native to the Indian subcontinent and has been called the "village pharmacy" due to its wide-ranging medicinal properties. Every part of the neem tree has therapeutic value. It has been used in Ayurveda for over 4,000 years. Neem is known for its powerful antibacterial, antifungal, and blood-purifying properties.',
    medicinalUses: [
      'Powerful blood purifier and detoxifier',
      'Treats skin diseases - acne, eczema, psoriasis',
      'Natural pesticide and insect repellent',
      'Dental care - prevents gum disease and cavities',
      'Controls diabetes and blood sugar',
      'Boosts immunity',
      'Treats fungal infections',
      'Helps with malaria and fever',
      'Promotes hair health and treats dandruff'
    ],
    ayurvedicProperties: {
      rasa: 'Bitter (Tikta), Astringent (Kashaya)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Cooling (Sheeta)',
      vipaka: 'Pungent (Katu)'
    },
    doshaEffect: 'Balances Pitta and Kapha, may increase Vata',
    partsUsed: ['Leaves', 'Bark', 'Seeds', 'Oil', 'Flowers', 'Root'],
    preparationMethods: [
      'Leaf juice or paste',
      'Neem oil for skin and hair',
      'Neem water bath',
      'Neem bark decoction',
      'Neem capsules/tablets',
      'Neem toothpaste'
    ],
    warnings: [
      'Not safe during pregnancy - may cause miscarriage',
      'Not recommended for infants and young children',
      'May lower blood sugar significantly',
      'Can affect fertility - avoid if trying to conceive',
      'May interact with diabetes and immunosuppressant drugs'
    ],
    commonNames: ['Nimba', 'Margosa', 'Vembu', 'Vepa', 'Indian Lilac']
  },
  'Papaya': {
    plantId: 'papaya-001',
    plantName: 'Papaya',
    scientificName: 'Carica papaya',
    description: 'Papaya is a tropical fruit tree native to Central America and now cultivated worldwide. Both the fruit and leaves have extensive medicinal uses in traditional medicine. Papaya leaves are particularly known for their ability to increase platelet count. The fruit contains papain, a powerful digestive enzyme used in medicine and food industry.',
    medicinalUses: [
      'Increases platelet count - used in dengue treatment',
      'Excellent digestive aid due to papain enzyme',
      'Rich in Vitamin C and antioxidants',
      'Supports heart health',
      'Anti-inflammatory properties',
      'Promotes wound healing',
      'Helps with menstrual pain regulation',
      'Supports skin health and reduces wrinkles',
      'May have anticancer properties'
    ],
    ayurvedicProperties: {
      rasa: 'Sweet (Madhura), Slightly Pungent',
      guna: 'Light (Laghu), Soft (Mridu)',
      virya: 'Heating (Ushna)',
      vipaka: 'Sweet (Madhura)'
    },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta',
    partsUsed: ['Fruit', 'Leaves', 'Seeds', 'Latex', 'Root'],
    preparationMethods: [
      'Fresh ripe fruit',
      'Leaf juice/extract for platelets',
      'Green papaya salad',
      'Papaya enzyme supplements',
      'Seed powder',
      'Leaf tea'
    ],
    warnings: [
      'AVOID during pregnancy - may cause miscarriage',
      'Unripe papaya contains latex - can cause allergic reactions',
      'May interact with blood thinning medications',
      'Seeds may affect male fertility in high doses',
      'People with latex allergy should avoid'
    ],
    commonNames: ['Papita', 'Pappali', 'Boppayi', 'Erandakarkati', 'Pawpaw']
  },
  'Tulsi': {
    plantId: 'tulsi-001',
    plantName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    description: 'Tulsi, also known as Holy Basil, is one of the most sacred plants in India and is called the "Queen of Herbs" in Ayurveda. It is an aromatic perennial plant native to the Indian subcontinent. Tulsi has been used for thousands of years for its remarkable healing properties. It is considered an adaptogen that helps the body cope with stress and promotes longevity.',
    medicinalUses: [
      'Powerful adaptogen - reduces stress and anxiety',
      'Boosts immunity and fights infections',
      'Treats respiratory disorders - cough, cold, asthma',
      'Reduces fever',
      'Improves digestion',
      'Purifies blood and improves skin health',
      'Supports heart health and reduces cholesterol',
      'Natural anti-inflammatory',
      'Protects against radiation damage',
      'Promotes oral health'
    ],
    ayurvedicProperties: {
      rasa: 'Pungent (Katu), Bitter (Tikta)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Heating (Ushna)',
      vipaka: 'Pungent (Katu)'
    },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess',
    partsUsed: ['Leaves', 'Seeds', 'Root', 'Stem'],
    preparationMethods: [
      'Fresh leaf consumption',
      'Tulsi tea',
      'Tulsi juice with honey',
      'Tulsi powder',
      'Essential oil',
      'Tulsi drops'
    ],
    warnings: [
      'May lower blood sugar - diabetics should monitor',
      'Can thin blood - avoid before surgery',
      'May affect fertility - avoid if trying to conceive',
      'Not recommended during pregnancy in medicinal doses',
      'May interact with blood thinning medications'
    ],
    commonNames: ['Holy Basil', 'Sacred Basil', 'Tulasi', 'Thulasi', 'Vrinda']
  },
  'Turmeric': {
    plantId: 'turmeric-001',
    plantName: 'Turmeric',
    scientificName: 'Curcuma longa',
    description: 'Turmeric is a flowering plant of the ginger family, native to the Indian subcontinent. The rhizome (underground stem) is used both as a spice and medicine. Turmeric contains curcumin, one of the most studied natural compounds with powerful anti-inflammatory and antioxidant properties. It has been a cornerstone of Ayurvedic medicine for over 4,000 years.',
    medicinalUses: [
      'Powerful anti-inflammatory - helps with arthritis',
      'Strong antioxidant - fights free radicals',
      'Improves brain function and memory',
      'Reduces risk of heart disease',
      'May help prevent cancer',
      'Helps with depression',
      'Anti-aging properties',
      'Wound healing and skin health',
      'Supports liver function',
      'Helps manage diabetes'
    ],
    ayurvedicProperties: {
      rasa: 'Bitter (Tikta), Pungent (Katu)',
      guna: 'Light (Laghu), Dry (Ruksha)',
      virya: 'Heating (Ushna)',
      vipaka: 'Pungent (Katu)'
    },
    doshaEffect: 'Balances all three doshas, especially Kapha',
    partsUsed: ['Rhizome (Root)', 'Leaves'],
    preparationMethods: [
      'Golden milk (Turmeric with milk)',
      'Turmeric powder in food',
      'Turmeric paste for wounds',
      'Turmeric supplements/capsules',
      'Fresh turmeric juice',
      'Turmeric tea'
    ],
    warnings: [
      'May increase bleeding risk with blood thinners',
      'Can cause stomach upset in high doses',
      'May lower blood sugar - diabetics should monitor',
      'Avoid high doses during pregnancy',
      'May interact with chemotherapy drugs',
      'Can aggravate gallbladder problems'
    ],
    commonNames: ['Haldi', 'Haridra', 'Manjal', 'Pasupu', 'Indian Saffron']
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
              
              {/* Confidence Score */}
              {displayResult.confidence > 0 && (
                <div className="bg-white/80 rounded-xl p-4 shadow-md border border-green-100 text-center mb-4">
                  <p className="text-sm text-gray-500 mb-2">Identification Confidence</p>
                  <span className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${
                    displayResult.confidence >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : displayResult.confidence >= 60 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {displayResult.confidence}%
                  </span>
                </div>
              )}

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