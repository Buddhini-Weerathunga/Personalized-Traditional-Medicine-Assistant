// frontend/src/pages/plant-identification/PlantDescriptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { savePlantIdentification } from '../../services/plant-identification/plantApi';

const PLANT_DATABASE = {
  'Aloevera': {
    plantId: 'aloevera-001', plantName: 'Aloe Vera', scientificName: 'Aloe barbadensis miller',
    description: 'Aloe Vera is a succulent plant species from the genus Aloe. The gel inside its thick, fleshy leaves has been used for thousands of years in Ayurvedic and traditional medicine for skin care, wound healing, and digestive health.',
    medicinalUses: ['Soothes burns, sunburns, and skin irritations','Promotes wound healing and tissue repair','Supports digestive health and relieves constipation','Moisturizes and rejuvenates skin naturally','Helps manage blood sugar levels','Boosts immunity with antioxidant compounds','Reduces dental plaque and oral infections','Anti-inflammatory properties for joint pain relief'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Sweet (Madhura)', guna: 'Heavy (Guru), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Leaf gel','Leaf latex','Whole leaf'],
    preparationMethods: ['Fresh gel applied topically for skin conditions','Aloe juice for internal digestive support','Gel mixed with turmeric for wound healing','Aloe pulp blended into smoothies','Dried powder (Kumari Churna) for supplements'],
    warnings: ['Aloe latex may cause cramping and diarrhea','Not recommended internally during pregnancy','May interact with diabetes and heart medications','Topical use may cause sensitivity in some individuals'],
    commonNames: ['Kumari','Ghritkumari','Kathalai','Komarika']
  },
  'Cinnamon': {
    plantId: 'cinnamon-001', plantName: 'Cinnamon', scientificName: 'Cinnamomum verum',
    description: 'Cinnamon is a spice obtained from the inner bark of trees from the genus Cinnamomum. Known as "Tvak" in Ayurveda, it has been used for over 4,000 years as a culinary spice and a powerful medicinal herb.',
    medicinalUses: ['Regulates blood sugar levels and improves insulin sensitivity','Powerful anti-inflammatory and antioxidant properties','Supports cardiovascular health and reduces cholesterol','Aids digestion and relieves bloating','Natural antimicrobial — fights bacterial and fungal infections','Improves brain function and cognitive performance','Helps relieve respiratory conditions and cold symptoms','Supports oral health and freshens breath'],
    ayurvedicProperties: { rasa: 'Pungent (Katu), Sweet (Madhura)', guna: 'Light (Laghu), Dry (Ruksha), Sharp (Tikshna)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess', partsUsed: ['Inner bark','Leaves','Essential oil','Bark powder'],
    preparationMethods: ['Cinnamon tea or decoction with honey','Powdered bark in warm milk (golden milk)','Essential oil for aromatherapy','Bark infusion for digestive remedy','Cinnamon water for blood sugar management'],
    warnings: ['Cassia cinnamon contains high coumarin — prefer Ceylon variety','May lower blood sugar excessively with diabetes medications','Avoid large medicinal doses during pregnancy','Can cause mouth sores or allergic reactions in sensitive individuals'],
    commonNames: ['Tvak','Dalchini','Pattai','Lavanga Pattai']
  },
  'Hathawariya': {
    plantId: 'hathawariya-001', plantName: 'Hathawariya', scientificName: 'Asparagus racemosus',
    description: 'Hathawariya, also known as Shatavari, is one of the most important herbs in Ayurvedic medicine, revered as the "Queen of Herbs." It is a powerful adaptogen and rejuvenative tonic, particularly valued for reproductive health.',
    medicinalUses: ['Premier female reproductive tonic — supports fertility and hormonal balance','Powerful adaptogen that helps the body cope with stress','Boosts immunity and strengthens the immune system','Improves digestive health and heals gastric ulcers','Galactagogue — promotes lactation in nursing mothers','Anti-aging and rejuvenative properties (Rasayana)','Supports urinary tract health','Nourishes and strengthens the nervous system'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), Bitter (Tikta)', guna: 'Heavy (Guru), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Pitta doshas', partsUsed: ['Tuberous roots','Leaves','Whole plant'],
    preparationMethods: ['Root powder mixed with warm milk and honey','Shatavari Ghrita (medicated ghee preparation)','Decoction of dried roots for digestive support','Root powder capsules as daily supplement','Fresh root juice for reproductive health'],
    warnings: ['Avoid if allergic to asparagus family plants','Consult physician if on hormonal medications','May cause weight gain due to nourishing quality','Not recommended during active respiratory congestion'],
    commonNames: ['Shatavari','Satamuli','Kilavari','Shatmuli']
  },
  'Papaya': {
    plantId: 'papaya-001', plantName: 'Papaya', scientificName: 'Carica papaya',
    description: 'Papaya is a tropical fruit-bearing plant native to Central America, now cultivated worldwide. Every part of the papaya plant has therapeutic applications in traditional medicine. The fruit is rich in papain, a powerful digestive enzyme.',
    medicinalUses: ['Increases platelet count — widely used in dengue treatment','Excellent digestive aid due to the enzyme papain','Rich in Vitamin C and antioxidants for immune support','Anti-inflammatory properties reduce swelling and pain','Promotes wound healing and skin health','Supports cardiovascular health and reduces cholesterol','Anti-parasitic — seeds help eliminate intestinal worms','Leaf extract supports liver health and detoxification'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), slightly Pungent (Katu)', guna: 'Light (Laghu), Soft (Mridu)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Kapha, may slightly increase Pitta', partsUsed: ['Ripe fruit','Unripe fruit','Leaves','Seeds','Latex'],
    preparationMethods: ['Fresh ripe fruit consumed directly for nutrition','Leaf juice extract for boosting platelet count','Papaya enzyme supplements for digestion','Seed powder as anti-parasitic remedy','Leaf tea for liver support'],
    warnings: ['Unripe papaya must be AVOIDED during pregnancy','Papaya latex can cause allergic reactions','May interact with blood-thinning medications','Seeds in high doses may affect male fertility'],
    commonNames: ['Papita','Pappali','Boppayi','Erandakarkati','Gaslabu']
  },
  'Turmeric': {
    plantId: 'turmeric-001', plantName: 'Turmeric', scientificName: 'Curcuma longa',
    description: 'Turmeric is a golden-colored flowering plant of the ginger family, native to the Indian subcontinent. Its rhizome contains curcumin, one of the most extensively researched natural compounds. Known as "Haridra" in Ayurveda, it has been a cornerstone of traditional medicine for over 4,000 years.',
    medicinalUses: ['Potent anti-inflammatory — helps manage arthritis and joint pain','Strong antioxidant — neutralizes free radicals','Supports brain health and may prevent neurodegenerative diseases','Promotes cardiovascular health','Aids wound healing when applied topically','Supports liver function and natural detoxification','Helps manage blood sugar levels','Enhances skin health and promotes glow','Boosts immunity and fights infections'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Pungent (Katu)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara), especially Kapha', partsUsed: ['Rhizome (fresh)','Dried rhizome powder','Leaves'],
    preparationMethods: ['Golden milk — turmeric with warm milk and black pepper','Turmeric paste for wounds and skin conditions','Turmeric tea with ginger and honey','Haldi water on empty stomach','Curcumin extract capsules','Turmeric in daily cooking'],
    warnings: ['May increase bleeding risk with blood-thinning medications','High doses can cause stomach upset','May lower blood sugar — monitor if diabetic','Avoid medicinal doses during pregnancy','Can aggravate gallbladder conditions'],
    commonNames: ['Haldi','Haridra','Manjal','Pasupu','Kaha']
  }
};

const PlantDescriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { result, image } = location.state || {};

  const getPlantDetails = (plantName) => {
    if (!plantName) return null;
    if (PLANT_DATABASE[plantName]) return PLANT_DATABASE[plantName];
    const key = Object.keys(PLANT_DATABASE).find(k => k.toLowerCase() === plantName.toLowerCase());
    return key ? PLANT_DATABASE[key] : null;
  };

  const plantDetails = getPlantDetails(result?.plantName);
  const displayResult = plantDetails ? { ...plantDetails, confidence: result?.confidence || 0, scientificName: plantDetails.scientificName || result?.scientificName } : result;
  const displayImage = image || null;

  useEffect(() => {
    if (displayResult) {
      const recentPlants = JSON.parse(localStorage.getItem('recentPlants') || '[]');
      const plantEntry = { plantId: displayResult.plantId, plantName: displayResult.plantName, scientificName: displayResult.scientificName, viewedAt: new Date().toISOString() };
      const filtered = recentPlants.filter(p => p.plantId !== plantEntry.plantId);
      localStorage.setItem('recentPlants', JSON.stringify([plantEntry, ...filtered].slice(0, 10)));
    }
  }, [displayResult]);

  const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await savePlantIdentification({ plantName: displayResult.plantName, scientificName: displayResult.scientificName, confidence: displayResult.confidence, image: displayImage, identifiedAt: new Date().toISOString(), ...displayResult });
      setSaved(true);
      setTimeout(() => navigate('/plant-history'), 1500);
    } catch (error) {
      console.error('Failed to save identification:', error);
      alert('Failed to save to history. Please try again.');
      setSaving(false);
    }
  };

  if (!displayResult) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Plant Data</h2>
            <p className="text-sm text-gray-500 mb-6">Please scan a plant first to see its details.</p>
            <button onClick={() => navigate('/plant-scan')} className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
              Go to Plant Scan
            </button>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'medicinal', label: 'Medicinal Uses' },
    { key: 'ayurvedic', label: 'Ayurvedic Properties' },
    { key: 'safety', label: 'Safety & Warnings' },
  ];

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              Plant Details
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {displayResult.plantName}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-400 italic">{displayResult.scientificName}</p>
            {displayResult.doshaEffect && (
              <span className="inline-block mt-3 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                {displayResult.doshaEffect}
              </span>
            )}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {displayResult.description && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        About This Plant
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{displayResult.description}</p>
                    </div>
                  )}
                  {displayResult.partsUsed?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                        Parts Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayResult.partsUsed.map((part, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">{part}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.commonNames?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                        Common Names
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayResult.commonNames.map((name, i) => (
                          <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Medicinal Uses Tab */}
              {activeTab === 'medicinal' && (
                <>
                  {displayResult.medicinalUses?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Medicinal Uses
                      </h3>
                      <div className="space-y-3">
                        {displayResult.medicinalUses.map((use, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <span className="text-sm text-gray-700">{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.preparationMethods?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                        Preparation Methods
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {displayResult.preparationMethods.map((method, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-sm text-gray-700">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Ayurvedic Properties Tab */}
              {activeTab === 'ayurvedic' && displayResult.ayurvedicProperties && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    Ayurvedic Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'rasa', label: 'Rasa (Taste)', color: 'bg-amber-50 border-amber-100 text-amber-800' },
                      { key: 'guna', label: 'Guna (Quality)', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                      { key: 'virya', label: 'Virya (Potency)', color: 'bg-red-50 border-red-100 text-red-800' },
                      { key: 'vipaka', label: 'Vipaka (Post-digestive)', color: 'bg-purple-50 border-purple-100 text-purple-800' },
                    ].map(({ key, label, color }) => displayResult.ayurvedicProperties[key] && (
                      <div key={key} className={`p-4 rounded-xl border ${color}`}>
                        <p className="text-[11px] font-bold tracking-widest uppercase opacity-60 mb-1">{label}</p>
                        <p className="text-sm font-semibold">{displayResult.ayurvedicProperties[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && displayResult.warnings?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    Warnings & Precautions
                  </h3>
                  <div className="space-y-3">
                    {displayResult.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <span className="text-sm text-amber-800">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Image */}
              {displayImage && (
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <img src={displayImage} alt={displayResult.plantName} className="w-full h-auto rounded-xl" />
                </div>
              )}

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Parts Used</p><p className="text-xs font-semibold text-gray-800">{displayResult.partsUsed?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Medicinal Uses</p><p className="text-xs font-semibold text-gray-800">{displayResult.medicinalUses?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Warnings</p><p className="text-xs font-semibold text-gray-800">{displayResult.warnings?.length || 0}</p></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <button onClick={handleSaveToHistory} disabled={saving || saved}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saved ? (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Saved!</>) : saving ? 'Saving...' : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>Save to History</>)}
                </button>
                <button onClick={() => navigate('/plant-scan')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  Scan Another Plant
                </button>
                <button onClick={() => navigate('/plant-description')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  Browse More Plants
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlantDescriptionDetail;