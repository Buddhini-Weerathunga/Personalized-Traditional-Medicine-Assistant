import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import ImageUploader from '../../components/plant-identification/ImageUploader';
import LoadingSpinner from '../../components/plant-identification/LoadingSpinner';
import { identifyPlant, savePlantIdentification } from '../../services/plant-identification/plantApi';

// Database for the 8 trained plant classes — keys match model Title-Case output
const PLANT_DATABASE = {
  'Adathoda': {
    plantName: 'Adathoda',
    scientificName: 'Justicia adhatoda',
    description: 'Adathoda (Malabar nut) is a widely used medicinal shrub in Ayurveda and Siddha medicine, celebrated for its powerful bronchodilator and expectorant properties. Its alkaloid vasicine has been scientifically validated for treating respiratory ailments and is the basis for the bronchodilator drug Bromhexine.',
    medicinalUses: ['Treats asthma, bronchitis, and chronic cough', 'Powerful expectorant — clears mucus from airways', 'Reduces fever and inflammation', 'Wound healing and antiseptic properties', 'Relieves bleeding disorders and nasal bleeds', 'Supports treatment of tuberculosis symptoms'],
    ayurvedicProperties: { rasa: 'Bitter, Astringent', guna: 'Light, Dry', virya: 'Cooling', vipaka: 'Pungent' },
    doshaEffect: 'Balances Kapha and Pitta',
    partsUsed: ['Leaves', 'Flowers', 'Roots', 'Bark'],
    preparationMethods: ['Leaf decoction (kadha) for cough and asthma', 'Fresh leaf juice with honey for sore throat', 'Leaf paste applied topically for wounds', 'Vasaka churna (powder) with warm water', 'Steam inhalation of leaf infusion for congestion'],
    warnings: ['Avoid during pregnancy', 'Not for prolonged use without guidance', 'May lower blood pressure'],
    commonNames: ['Malabar Nut', 'Vasaka', 'Arusha', 'Adalodakam'],
  },
  'Diyamiththa': {
    plantName: 'Diyamiththa',
    scientificName: 'Glycyrrhiza glabra',
    description: 'Diyamiththa (Licorice) is one of the most widely used medicinal plants in both Eastern and Western herbal traditions. Its sweet-tasting root contains glycyrrhizin, a compound 50 times sweeter than sugar, with potent anti-inflammatory and adaptogenic properties used for thousands of years.',
    medicinalUses: ['Soothes gastric ulcers and acid reflux', 'Powerful anti-inflammatory and antioxidant', 'Respiratory support — relieves cough and bronchitis', 'Adrenal fatigue and stress relief (adaptogen)', 'Supports liver health and detoxification', 'Antiviral — fights herpes and influenza viruses'],
    ayurvedicProperties: { rasa: 'Sweet', guna: 'Heavy, Moist', virya: 'Cooling', vipaka: 'Sweet' },
    doshaEffect: 'Balances Vata and Pitta, may increase Kapha',
    partsUsed: ['Roots', 'Root extract', 'Dried root powder'],
    preparationMethods: ['Licorice root tea for digestive complaints', 'Root decoction with ginger for respiratory issues', 'Yashtimadhu churna in warm milk at bedtime', 'Root powder mixed with honey for sore throat', 'DGL supplements for long-term use'],
    warnings: ['Long-term use can raise blood pressure', 'Avoid if hypertensive or with kidney disease', 'Can lower potassium levels'],
    commonNames: ['Licorice', 'Yashtimadhu', 'Athimaduram', 'Mulethi'],
  },
  'Garudaraja': {
    plantName: 'Garudaraja',
    scientificName: 'Aristolochia indica',
    description: 'Garudaraja (Indian Birthwort) is a climbing plant deeply embedded in traditional Sri Lankan and Indian medicine, most renowned as a treatment for snakebite and poisoning. Its name derives from Garuda, the divine eagle said to neutralize serpent venom in Hindu mythology.',
    medicinalUses: ['Traditional antidote for snakebite and poisoning', 'Anti-inflammatory and analgesic properties', 'Fever reduction and antimalarial use', 'Digestive stimulant and appetite enhancer', 'Skin disorders including eczema and psoriasis', 'Menstrual regulation (professional use only)'],
    ayurvedicProperties: { rasa: 'Bitter, Pungent', guna: 'Light, Dry', virya: 'Heating', vipaka: 'Pungent' },
    doshaEffect: 'Balances Kapha and Vata',
    partsUsed: ['Roots', 'Leaves', 'Stem', 'Whole plant'],
    preparationMethods: ['Root decoction under professional supervision only', 'Leaf paste for external skin conditions', 'Traditional formulations by Ayurvedic practitioners only', 'Root infusion for fever (professional use)'],
    warnings: ['Contains aristolochic acid — can cause kidney failure', 'MUST be used only under qualified professional supervision', 'Avoid during pregnancy — strongly abortifacient', 'Do NOT self-medicate'],
    commonNames: ['Indian Birthwort', 'Ishwari', 'Garudakkodi', 'Sapavisa'],
  },
  'Heen Nidikumba': {
    plantName: 'Heen Nidikumba',
    scientificName: 'Mimosa pudica',
    description: 'Heen Nidikumba, the famous "Sensitive Plant", is known for its remarkable ability to fold its leaves when touched. Beyond this curiosity, it is a powerful medicinal plant in Ayurvedic and traditional Sri Lankan medicine with a broad range of therapeutic applications from wound healing to mental health.',
    medicinalUses: ['Wound healing and hemostasis (stops bleeding)', 'Anti-inflammatory for arthritis and joint swelling', 'Anxiety, insomnia, and nervous system support', 'Urinary tract infections and kidney stones', 'Hair loss treatment and scalp health', 'Antidepressant and mood-elevating properties'],
    ayurvedicProperties: { rasa: 'Bitter, Astringent', guna: 'Light, Dry', virya: 'Cooling', vipaka: 'Pungent' },
    doshaEffect: 'Balances Pitta and Kapha',
    partsUsed: ['Whole Plant', 'Leaves', 'Roots', 'Seeds'],
    preparationMethods: ['Root paste applied to wounds for healing', 'Leaf decoction for urinary complaints', 'Root powder with milk for nervous disorders', 'Fresh plant juice for skin conditions', 'Seed powder for anti-inflammatory use'],
    warnings: ['Avoid high doses during pregnancy', 'May interact with sedatives and CNS depressants', 'Consult a practitioner for prolonged use'],
    commonNames: ['Touch-me-not', 'Sensitive Plant', 'Lajwanti', 'Thottavadi'],
  },
  'Nika': {
    plantName: 'Nika',
    scientificName: 'Vitex negundo',
    description: 'Nika (Five-leaved Chaste Tree) is a large aromatic shrub revered in Ayurveda as "Nirgundi" — one of the most important anti-inflammatory herbs. Its distinctive five-leaflet compound leaves contain flavonoids and terpenoids with powerful analgesic effects scientifically comparable to pharmaceutical anti-inflammatories.',
    medicinalUses: ['Arthritis, joint pain, and rheumatism relief', 'Powerful anti-inflammatory and analgesic', 'Fever reduction and antipyretic use', 'Respiratory support — asthma and bronchitis', 'Headache and migraine relief', 'Muscle spasms and nerve pain', 'Menstrual pain and hormonal balance'],
    ayurvedicProperties: { rasa: 'Bitter, Pungent, Astringent', guna: 'Light, Dry', virya: 'Heating', vipaka: 'Pungent' },
    doshaEffect: 'Balances Kapha and Vata',
    partsUsed: ['Leaves', 'Roots', 'Bark', 'Seeds', 'Flowers'],
    preparationMethods: ['Leaf decoction for arthritis and joint pain', 'Warm leaf poultice applied to swollen joints', 'Leaf oil for massage in muscular pain', 'Root bark powder for fever and infections', 'Nirgundi churna with warm water for inflammation'],
    warnings: ['Avoid during pregnancy', 'Mild sedative effects — avoid with sedatives', 'Do not use with hormonal medications without guidance'],
    commonNames: ['Five-leaved Chaste Tree', 'Nirgundi', 'Indrani', 'Sambhalu'],
  },
  'Kaladuru': {
    plantName: 'Kaladuru',
    scientificName: 'Cinnamomum zeylanicum',
    description: 'Kaladuru is Ceylon Cinnamon — true cinnamon native to Sri Lanka, considered the finest and safest cinnamon in the world. Unlike Cassia cinnamon, Ceylon cinnamon contains very low levels of coumarin making it safe for regular medicinal use. It has been a prized spice and medicine for over 2,000 years.',
    medicinalUses: ['Regulates blood sugar and improves insulin sensitivity', 'Powerful anti-inflammatory and antioxidant', 'Supports cardiovascular health and reduces bad cholesterol', 'Natural antimicrobial — fights bacteria and fungi', 'Aids digestion and relieves bloating and gas', 'Warming tonic for cold constitution and poor circulation'],
    ayurvedicProperties: { rasa: 'Sweet, Pungent, Bitter', guna: 'Light, Dry', virya: 'Heating', vipaka: 'Sweet' },
    doshaEffect: 'Balances Kapha and Vata, may slightly increase Pitta',
    partsUsed: ['Inner bark', 'Bark powder', 'Essential oil', 'Leaves'],
    preparationMethods: ['Cinnamon tea — bark steeped in hot water with honey', 'Cinnamon powder in warm milk (golden milk)', 'Cinnamon water infusion for blood sugar management', 'Bark oil applied topically for muscle pain', 'Daily culinary use in cooking for consistent intake'],
    warnings: ['Prefer Ceylon variety over Cassia for regular use', 'Large doses may affect liver', 'Avoid in excess during pregnancy', 'May enhance effect of blood sugar medications'],
    commonNames: ['Ceylon Cinnamon', 'True Cinnamon', 'Dalchini', 'Tvak', 'Kurundu'],
  },
  'Kothala Himbutu': {
    plantName: 'Kothala Himbutu',
    scientificName: 'Salacia reticulata',
    description: 'Kothala Himbutu is a woody climbing plant endemic to Sri Lanka and southern India, revered as the premier anti-diabetic herb in traditional medicine. Modern science has validated its exceptional glucose-lowering properties through the compound salacinol, which inhibits intestinal alpha-glucosidase enzymes that break down carbohydrates.',
    medicinalUses: ['Type 2 diabetes management — lowers blood glucose', 'Inhibits carbohydrate absorption (alpha-glucosidase inhibitor)', 'Weight management and anti-obesity properties', 'Joint pain and arthritis support', 'Digestive health and gut microbiome support', 'Anti-inflammatory and antioxidant properties'],
    ayurvedicProperties: { rasa: 'Astringent, Bitter', guna: 'Light, Dry', virya: 'Cooling', vipaka: 'Pungent' },
    doshaEffect: 'Balances Kapha and Pitta',
    partsUsed: ['Roots', 'Stem bark', 'Woody stem'],
    preparationMethods: ['Wood decoction — chunks soaked overnight and boiled', 'Stem bark powder capsules as supplement', 'Traditional "Kothala cup" — drink vessel carved from the wood', 'Water infused in wooden cup overnight (traditional method)', 'Standardized extract supplements for precise dosing'],
    warnings: ['Monitor blood sugar closely when combining with diabetes medications', 'May cause hypoglycemia if overused', 'Consult healthcare provider before use with antidiabetic drugs'],
    commonNames: ['Saptarangi', 'Ekanayakam', 'Ponkoranti', 'Salacia'],
  },
  'Pila': {
    plantName: 'Pila',
    scientificName: 'Gloriosa superba',
    description: 'Pila (Flame Lily) is a spectacularly beautiful flowering climber with vivid red and yellow blooms. It is highly valued in Ayurvedic medicine for its alkaloids (colchicine, gloriosine) with strong anti-inflammatory effects used for gout. However, ALL parts are extremely toxic and must ONLY be used by qualified practitioners.',
    medicinalUses: ['Gout treatment — colchicine-like compounds reduce uric acid inflammation', 'Severe arthritis (professional supervision only)', 'Anti-inflammatory for specific joint conditions', 'Traditional use in difficult labor (professionals only)'],
    ayurvedicProperties: { rasa: 'Bitter, Pungent', guna: 'Light, Sharp, Penetrating', virya: 'Heating', vipaka: 'Pungent' },
    doshaEffect: 'Strongly increases Pitta; decreases Kapha',
    partsUsed: ['Roots (TOXIC — professional preparation only)'],
    preparationMethods: ['⚠️ ALL preparation must be done by qualified Ayurvedic practitioners only', 'Highly processed root preparations in traditional formulations', 'External application only in some traditional uses (professional)'],
    warnings: ['⛔ EXTREMELY TOXIC — All parts are deadly poisonous', '⛔ NEVER self-medicate — can be rapidly fatal even in small doses', '⛔ Toxic even through skin contact — do not handle bare-handed', 'Only handled and administered by trained Ayurvedic practitioners'],
    commonNames: ['Flame Lily', 'Glory Lily', 'Niyangala', 'Langli', 'Karthigaipoo'],
  },
};


const PlantScan = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const resultRef = useRef(null);

  // Merge API response with local plant database
  const getPlantDetails = (apiResult) => {
    if (!apiResult || !apiResult.plantName) return apiResult;
    const key = Object.keys(PLANT_DATABASE).find(
      k => k.toLowerCase() === apiResult.plantName.toLowerCase()
    );
    if (key) {
      return { ...PLANT_DATABASE[key], ...apiResult, ...PLANT_DATABASE[key] };
    }
    return apiResult;
  };

  const handleImageSelect = async (file) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResult(null);
    await startIdentification(file);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const startIdentification = async (imageFile) => {
    setLoading(true);
    setError(null);
    setActiveTab('overview');

    try {
      const apiResult = await identifyPlant(imageFile, null);
      const enrichedResult = getPlantDetails(apiResult);
      setResult(enrichedResult);
      setLoading(false);
      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Auto-save to history with image
      if (enrichedResult && enrichedResult.plantName && enrichedResult.is_plant !== false) {
        try {
          const base64Image = await fileToBase64(imageFile);
          await savePlantIdentification({
            plantName: enrichedResult.plantName,
            scientificName: enrichedResult.scientificName || '',
            confidence: enrichedResult.confidence || 0,
            image: base64Image,
            identifiedAt: new Date().toISOString(),
          });
        } catch (saveErr) {
          console.error('Auto-save to history failed:', saveErr);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to identify plant. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
    setResult(null);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'medicinal', label: 'Medicinal Uses' },
    { id: 'ayurveda', label: 'Ayurvedic Properties' },
    { id: 'safety', label: 'Safety & Warnings' },
  ];

  const displayResult = result ? getPlantDetails(result) : null;

  return (
    <>
      <PlantNavbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        {/* ─── Upload Section ─── */}
        {!result && !loading && (
          <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
                AI-Powered Identification
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Identify <span className="text-emerald-600">Medicinal Plants</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
                Upload or capture a photo of a plant to instantly identify it and explore its Ayurvedic medicinal properties.
              </p>
            </div>

            {/* Two-Column Layout: Upload + Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left — Upload Card */}
              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full flex flex-col justify-center">
                  <ImageUploader onImageSelect={handleImageSelect} />

                  {/* Tips */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    {[
                      { icon: '☀️', text: 'Good lighting' },
                      { icon: '🍃', text: 'Focus on leaves' },
                      { icon: '📐', text: 'Steady & clear' },
                      { icon: '🔍', text: 'Close-up shot' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-base">{tip.icon}</span>
                        <span className="text-xs text-gray-500 font-medium">{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Ayurvedic Plants Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Ayurvedic Medicinal Plants</h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Ayurveda, the ancient Indian system of medicine, harnesses the healing power of plants to restore balance among the body's three doshas — <span className="font-semibold text-emerald-700">Vata</span>, <span className="font-semibold text-emerald-700">Pitta</span>, and <span className="font-semibold text-emerald-700">Kapha</span>. Each plant carries unique properties (<em>Rasa</em>, <em>Virya</em>, <em>Vipaka</em>) that determine its therapeutic action.
                </p>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Medicinal plants have been used for thousands of years across traditional healing systems. In Ayurveda, these plants are carefully classified based on their taste, potency, and post-digestive effect to treat specific conditions and maintain overall wellness.
                </p>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  From the soothing gel of Aloe Vera to the golden anti-inflammatory power of Turmeric, each herb offers a unique combination of bioactive compounds that modern science continues to validate.
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload a clear image of a plant leaf and our AI-powered system will identify it and provide detailed information about its medicinal uses, Ayurvedic properties, preparation methods, and safety precautions.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── Loading State ─── */}
        {loading && (
          <section className="max-w-2xl mx-auto px-4 py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
              {previewUrl && (
                <div className="w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                  <img src={previewUrl} alt="Analyzing" className="w-full h-full object-cover" />
                </div>
              )}
              <LoadingSpinner message="Analyzing plant image..." />
              <p className="mt-4 text-sm text-gray-400">Our AI model is examining the plant features</p>
            </div>
          </section>
        )}

        {/* ─── Error State ─── */}
        {error && !loading && (
          <section className="max-w-lg mx-auto px-4 py-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Identification Failed</h3>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* ─── Not Recognized State ─── */}
        {result && result.is_plant === false && !loading && (
          <section ref={resultRef} className="max-w-lg mx-auto px-4 py-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100 text-center">
              {previewUrl && (
                <div className="w-28 h-28 mx-auto mb-5 rounded-xl overflow-hidden shadow-md border-2 border-amber-200">
                  <img src={previewUrl} alt="Uploaded" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plant Not Recognized</h3>
              <p className="text-sm text-gray-500 mb-2">
                {result.message || 'Unable to identify this image as a known medicinal plant.'}
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Ensure the plant is clearly visible, well-lit, and the image is focused on the leaves or distinctive features.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ─── Identified Plant Results ─── */}
        {result && result.is_plant !== false && !loading && displayResult && (
          <section ref={resultRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Hero Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Plant Image */}
                <div className="lg:col-span-2 relative bg-gray-50">
                  <img
                    src={previewUrl}
                    alt={displayResult.plantName}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r" />
                </div>

                {/* Plant Identity */}
                <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="inline-block w-fit text-[11px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                    Identified Plant
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                    {displayResult.plantName}
                  </h2>
                  {displayResult.scientificName && (
                    <p className="text-lg text-gray-400 italic mb-4">{displayResult.scientificName}</p>
                  )}
                  {displayResult.description && (
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-4 lg:line-clamp-none">
                      {displayResult.description}
                    </p>
                  )}

                  {/* Quick Info Badges */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {displayResult.doshaEffect && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg>
                        {displayResult.doshaEffect}
                      </span>
                    )}
                    {displayResult.partsUsed && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                        Parts: {displayResult.partsUsed.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 max-w-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                    {/* Description */}
                    {displayResult.description && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          About This Plant
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{displayResult.description}</p>
                      </div>
                    )}

                    {/* Parts Used */}
                    {displayResult.partsUsed && displayResult.partsUsed.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                          </svg>
                          Parts Used
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {displayResult.partsUsed.map((part, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preparation Methods */}
                    {displayResult.preparationMethods && displayResult.preparationMethods.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                          </svg>
                          Preparation Methods
                        </h3>
                        <div className="space-y-2">
                          {displayResult.preparationMethods.map((method, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">{i + 1}</span>
                              <span className="text-sm text-gray-700">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Names */}
                    {displayResult.commonNames && displayResult.commonNames.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                          </svg>
                          Also Known As
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {displayResult.commonNames.map((name, i) => (
                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Medicinal Uses Tab */}
                {activeTab === 'medicinal' && displayResult.medicinalUses && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      Medicinal Uses &amp; Health Benefits
                    </h3>
                    <div className="space-y-3">
                      {displayResult.medicinalUses.map((use, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-50">
                          <span className="flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-sm text-gray-700">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ayurvedic Properties Tab */}
                {activeTab === 'ayurveda' && (
                  <div className="space-y-6">
                    {displayResult.ayurvedicProperties && (
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                          </svg>
                          Ayurvedic Properties
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { label: 'Rasa (Taste)', value: displayResult.ayurvedicProperties.rasa, color: 'emerald' },
                            { label: 'Guna (Quality)', value: displayResult.ayurvedicProperties.guna, color: 'blue' },
                            { label: 'Virya (Potency)', value: displayResult.ayurvedicProperties.virya, color: 'amber' },
                            { label: 'Vipaka (Post-digestive)', value: displayResult.ayurvedicProperties.vipaka, color: 'purple' },
                          ].filter(prop => prop.value).map((prop, i) => (
                            <div key={i} className={`p-4 rounded-xl bg-${prop.color}-50 border border-${prop.color}-100`}>
                              <p className={`text-xs font-semibold uppercase tracking-wider text-${prop.color}-600 mb-1`}>{prop.label}</p>
                              <p className="text-sm font-medium text-gray-800">{prop.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dosha Effect */}
                    {displayResult.doshaEffect && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-purple-100">
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" d="M12 3c3 4 3 8 0 12M12 3c-3 4-3 8 0 12" />
                          </svg>
                          Dosha Effect
                        </h3>
                        <p className="text-sm text-purple-800 font-medium">{displayResult.doshaEffect}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Safety & Warnings Tab */}
                {activeTab === 'safety' && displayResult.warnings && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Warnings &amp; Precautions
                    </h3>
                    <div className="space-y-3">
                      {displayResult.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                          <span className="flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-sm text-gray-700">{warning}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs text-red-700 font-medium">
                        Disclaimer: This information is for educational purposes only. Always consult a qualified healthcare practitioner or Ayurvedic physician before using any herbal remedy.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Scan Another */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    Scan Another Plant
                  </button>
                </div>

                {/* Uploaded Image Thumbnail */}
                {previewUrl && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={previewUrl} alt="Uploaded" className="w-full h-48 object-cover" />
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-400">Uploaded Image</p>
                    </div>
                  </div>
                )}

                {/* Quick Facts */}
                {displayResult.doshaEffect && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Quick Facts</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Dosha Effect</p>
                        <p className="text-sm text-gray-700 mt-0.5">{displayResult.doshaEffect}</p>
                      </div>
                      {displayResult.ayurvedicProperties?.virya && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Potency</p>
                          <p className="text-sm text-gray-700 mt-0.5">{displayResult.ayurvedicProperties.virya}</p>
                        </div>
                      )}
                      {displayResult.partsUsed && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Parts Used</p>
                          <p className="text-sm text-gray-700 mt-0.5">{displayResult.partsUsed.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Back & More Plants Buttons */}
            <div className="flex justify-end gap-3 mt-10">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>
              <button
                onClick={() => navigate('/plant-description')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
              >
                More Plants
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default PlantScan;