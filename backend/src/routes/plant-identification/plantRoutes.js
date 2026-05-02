/**
 * Plant Identification Routes
 * Handles plant identification API endpoints
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const RiskAlert = require('../../models/plant-identification/RiskAlert');
const Groq = require('groq-sdk');

// Initialize Groq client only if API key is provided to avoid startup crash
let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
  try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize Groq client:', err.message);
    groq = null;
  }
} else {
  console.warn('GROQ_API_KEY not set — Groq client disabled.');
}

// In-memory storage for plant history (replace with database in production)
let plantHistory = [];

// ============ PLANT-SPECIFIC PARTS DATABASE ============
const PLANT_PARTS_MAP = {
  'turmeric': { parts: ['Rhizome', 'Leaves', 'Roots', 'Flowers'], scientificName: 'Curcuma longa' },
  'gotu kola': { parts: ['Leaves', 'Stem', 'Whole Plant'], scientificName: 'Centella asiatica' },
  'brahmi': { parts: ['Leaves', 'Whole Plant', 'Stem'], scientificName: 'Bacopa monnieri' },
  'shankhpushpi': { parts: ['Whole Plant', 'Leaves', 'Flowers', 'Roots'], scientificName: 'Convolvulus pluricaulis' },
  'holy basil': { parts: ['Leaves', 'Seeds', 'Flowers', 'Stem', 'Roots'], scientificName: 'Ocimum tenuiflorum' },
  'tulsi': { parts: ['Leaves', 'Seeds', 'Flowers', 'Stem', 'Roots'], scientificName: 'Ocimum tenuiflorum' },
  'giloy': { parts: ['Stem', 'Leaves', 'Roots'], scientificName: 'Tinospora cordifolia' },
  'amla': { parts: ['Fruits', 'Seeds', 'Bark', 'Leaves', 'Roots'], scientificName: 'Phyllanthus emblica' },
  'indian gooseberry': { parts: ['Fruits', 'Seeds', 'Bark', 'Leaves', 'Roots'], scientificName: 'Phyllanthus emblica' },
  'ginger': { parts: ['Rhizome', 'Leaves', 'Oil/Extract'], scientificName: 'Zingiber officinale' },
  'fennel': { parts: ['Seeds', 'Leaves', 'Roots', 'Oil/Extract'], scientificName: 'Foeniculum vulgare' },
  'neem': { parts: ['Leaves', 'Bark', 'Seeds', 'Flowers', 'Oil/Extract', 'Roots'], scientificName: 'Azadirachta indica' },
  'aloe vera': { parts: ['Leaves', 'Gel', 'Latex'], scientificName: 'Aloe barbadensis miller' },
  'bhringraj': { parts: ['Leaves', 'Whole Plant', 'Oil/Extract', 'Roots'], scientificName: 'Eclipta prostrata' },
  'sandalwood': { parts: ['Heartwood', 'Oil/Extract', 'Bark'], scientificName: 'Santalum album' },
  'arjuna': { parts: ['Bark', 'Leaves', 'Fruits'], scientificName: 'Terminalia arjuna' },
  'vasaka': { parts: ['Leaves', 'Flowers', 'Roots', 'Bark'], scientificName: 'Adhatoda vasica' },
  'aralu': { parts: ['Fruits', 'Seeds', 'Bark'], scientificName: 'Terminalia chebula' },
  'bulu': { parts: ['Fruits', 'Bark', 'Seeds'], scientificName: 'Terminalia bellirica' },
  'cinnamon': { parts: ['Bark', 'Oil/Extract', 'Leaves'], scientificName: 'Cinnamomum verum' },
  'cardamom': { parts: ['Seeds', 'Pods', 'Oil/Extract'], scientificName: 'Elettaria cardamomum' },
  'black pepper': { parts: ['Fruits', 'Seeds', 'Oil/Extract'], scientificName: 'Piper nigrum' },
  'iramusu': { parts: ['Roots', 'Leaves', 'Stem'], scientificName: 'Hemidesmus indicus' },
  'ranawara': { parts: ['Flowers', 'Leaves', 'Seeds', 'Roots'], scientificName: 'Senna auriculata' },
  'polpala': { parts: ['Whole Plant', 'Leaves', 'Roots'], scientificName: 'Aerva lanata' },
  'hathawariya': { parts: ['Roots', 'Leaves', 'Stem'], scientificName: 'Asparagus racemosus' },
  'papaya': { parts: ['Fruits', 'Leaves', 'Seeds', 'Latex'], scientificName: 'Carica papaya' },
  'ashwagandha': { parts: ['Roots', 'Leaves', 'Seeds'], scientificName: 'Withania somnifera' },
  'moringa': { parts: ['Leaves', 'Seeds', 'Bark', 'Flowers', 'Roots', 'Pods'], scientificName: 'Moringa oleifera' },
  'vetiver': { parts: ['Roots', 'Oil/Extract'], scientificName: 'Chrysopogon zizanioides' },
  'licorice': { parts: ['Roots', 'Oil/Extract'], scientificName: 'Glycyrrhiza glabra' },
};

// ============ HOW-TO-USE DATABASE ============
const PLANT_USAGE_MAP = {
  'turmeric': {
    'Rhizome': 'Grate fresh rhizome into warm milk or water (1/2 tsp). Can also be dried and powdered for cooking. Apply paste topically for skin conditions.',
    'Leaves': 'Wrap food in fresh leaves for cooking. Can be used in herbal teas by steeping 2-3 leaves in hot water for 10 minutes.',
    'Roots': 'Dry and powder the roots. Use 1/4 tsp in warm water or decoctions. Often combined with black pepper for better absorption.',
    'Flowers': 'Use fresh flowers in salads or as garnish. Can be pickled or used in traditional preparations.',
  },
  'gotu kola': {
    'Leaves': 'Eat 2-3 fresh leaves daily or make a juice. Steep dried leaves as tea (1 tsp per cup, 10 min). Apply crushed leaves as poultice for wounds.',
    'Stem': 'Chop stems and boil for 15 minutes to make a decoction. Strain and drink 1/2 cup twice daily.',
    'Whole Plant': 'Juice the whole plant and take 2 tbsp daily. Dry and powder for capsules (500mg twice daily).',
  },
  'brahmi': {
    'Leaves': 'Chew 2-3 fresh leaves daily for memory. Make tea by steeping 1 tsp dried leaves in hot water. Use Brahmi ghee for cognitive support.',
    'Whole Plant': 'Juice fresh plant and take 10-20ml daily. Dry and powder for supplements (300-500mg daily).',
    'Stem': 'Boil stems to make a decoction. Take 1/4 cup twice daily for nervous system support.',
  },
  'shankhpushpi': {
    'Whole Plant': 'Juice fresh plant and take 2-4 tsp daily. Powder dried plant and mix 1 tsp in warm milk before bed.',
    'Leaves': 'Make herbal tea by steeping fresh or dried leaves. Take 1 cup twice daily for brain health.',
    'Flowers': 'Steep flowers in hot water for a calming tea. Use as garnish in Ayurvedic preparations.',
    'Roots': 'Dry and powder roots. Take 1/2 tsp with warm water or milk twice daily for anxiety relief.',
  },
  'holy basil': {
    'Leaves': 'Chew 5-6 fresh leaves on empty stomach. Make tulsi tea by steeping leaves 5-10 min. Add to soups and stir-fries.',
    'Seeds': 'Soak 1 tsp seeds in water overnight. Drink the water in morning for cooling effect. Add soaked seeds to beverages.',
    'Flowers': 'Steep flowers in hot water for aromatic tea. Use dried flowers in herbal formulations.',
    'Stem': 'Boil stems for decoction to treat cough and cold. Take 1/4 cup twice daily.',
    'Roots': 'Powder dried roots. Use in decoctions for fever management (1/4 tsp in water).',
  },
  'giloy': {
    'Stem': 'Cut 6-inch stem piece, boil in 2 cups water for 15 min. Drink 1/2 cup daily for immunity. Also available as powder (1/2 tsp).',
    'Leaves': 'Juice fresh leaves and take 2-3 tsp daily. Apply paste on skin for healing.',
    'Roots': 'Powder dried roots and take 1/4 tsp with warm water twice daily for joint support.',
  },
  'amla': {
    'Fruits': 'Eat 1-2 fresh fruits daily. Make juice and drink 30ml daily. Cook into pickles or chutneys.',
    'Seeds': 'Dry and powder seeds. Take 1/4 tsp with honey for digestive health.',
    'Bark': 'Make decoction from bark pieces. Use for gargling in throat problems.',
    'Leaves': 'Make tea from fresh leaves. Apply paste for scalp health.',
    'Roots': 'Powder dried roots for use in traditional formulations.',
  },
  'ginger': {
    'Rhizome': 'Grate fresh ginger into tea or warm water. Chew small piece for nausea. Use 1/2 inch piece in cooking daily. Make ginger honey for cough.',
    'Leaves': 'Use as wrapping for steaming food. Make a mild tea from crushed leaves.',
    'Oil/Extract': 'Dilute ginger oil with carrier oil for massage. Add 1-2 drops to warm water for aromatherapy.',
  },
  'fennel': {
    'Seeds': 'Chew 1/2 tsp seeds after meals for digestion. Steep 1 tsp in hot water for tea. Dry roast and powder for spice blends.',
    'Leaves': 'Add fresh fronds to salads and soups. Use as garnish for dishes.',
    'Roots': 'Slice and boil for a mild decoction. Use in traditional digestive formulations.',
    'Oil/Extract': 'Use 1-2 drops in warm water for bloating. Dilute with carrier oil for abdominal massage.',
  },
  'neem': {
    'Leaves': 'Boil 10-15 leaves in water, drink 1/4 cup on empty stomach for blood purification. Apply paste on skin for acne.',
    'Bark': 'Make decoction from small bark pieces. Use for dental health as a mouthwash.',
    'Seeds': 'Cold-press for neem oil. Do not consume seeds directly — they are potent.',
    'Flowers': 'Add to dal/curry for bitter flavor. Make chutney for digestive support.',
    'Oil/Extract': 'Mix with coconut oil for scalp treatment. Dilute for skin application. Never ingest undiluted.',
    'Roots': 'Decoction of roots for fever management. Use under professional guidance only.',
  },
  'aloe vera': {
    'Leaves': 'Cut leaf, extract gel, and consume 1-2 tbsp daily. Apply gel directly on skin for burns and moisturizing.',
    'Gel': 'Take 2 tbsp of fresh gel with water on empty stomach. Apply topically for skin healing and hydration.',
    'Latex': 'Use with extreme caution — yellow latex near the leaf skin is a strong laxative. Consult a practitioner before use.',
  },
  'bhringraj': {
    'Leaves': 'Make juice from fresh leaves — take 2 tsp daily. Apply leaf paste on scalp for 30 min before wash.',
    'Whole Plant': 'Dry and powder whole plant. Take 1/2 tsp with warm water for liver support.',
    'Oil/Extract': 'Warm bhringraj oil and massage into scalp. Leave for 1 hour before washing. Use 2-3 times weekly.',
    'Roots': 'Powder the roots and take 1/4 tsp with honey for rejuvenation.',
  },
  'sandalwood': {
    'Heartwood': 'Grind into paste with water on stone. Apply on forehead for cooling. Use in religious ceremonies.',
    'Oil/Extract': 'Add 2-3 drops to carrier oil for face. Use in diffuser for calming aromatherapy.',
    'Bark': 'Powder and use in face packs. Mix with rose water for skin brightening.',
  },
  'arjuna': {
    'Bark': 'Boil 1 tsp bark powder in milk/water for 10 min. Drink twice daily for heart health. Known as "Arjuna Ksheerapaka".',
    'Leaves': 'Make tea from dried leaves. Use as supportive preparation alongside bark therapy.',
    'Fruits': 'Dry and powder fruits. Use in traditional cardiac tonic formulations.',
  },
  'vasaka': {
    'Leaves': 'Juice fresh leaves — take 2 tsp with honey for cough. Boil leaves for steam inhalation in congestion.',
    'Flowers': 'Steep in hot water for mild tea. Used in traditional remedies for bleeding disorders.',
    'Roots': 'Power dried roots. Take 1/4 tsp in warm water for bronchitis support.',
    'Bark': 'Make decoction from bark pieces for respiratory conditions. Take 1/4 cup daily.',
  },
  'aralu': {
    'Fruits': 'Powder dried fruits. Take 1/2 tsp with warm water before bed for digestion. Key ingredient in Triphala.',
    'Seeds': 'Extract oil from seeds for topical use. Powder for internal use under guidance.',
    'Bark': 'Make decoction for gargling in throat conditions.',
  },
  'bulu': {
    'Fruits': 'Dry and powder fruits. Take 1/2 tsp with warm water. Part of Triphala formulation.',
    'Bark': 'Make decoction for respiratory support. Take 1/4 cup twice daily.',
    'Seeds': 'Powder seeds for traditional preparations.',
  },
  'cinnamon': {
    'Bark': 'Add 1/2 inch piece to tea or warm water. Use powder (1/4 tsp) in cooking. Steep in hot water for 10 min for cinnamon tea.',
    'Oil/Extract': 'Dilute with carrier oil for massage. Add 1 drop to tea. Use in diffuser for aromatherapy. Never apply undiluted.',
    'Leaves': 'Steep fresh or dried leaves in hot water for mild cinnamon tea. Add to curries and rice dishes.',
  },
  'cardamom': {
    'Seeds': 'Chew 1-2 pods after meals. Crush and add to tea or coffee. Use powder in desserts and rice dishes.',
    'Pods': 'Add whole pods to tea, rice, or curries. Lightly crush before adding for stronger flavor.',
    'Oil/Extract': 'Add 1-2 drops to warm water for digestive support. Use in aromatherapy diffuser.',
  },
  'black pepper': {
    'Fruits': 'Use freshly ground pepper in cooking. Combine with turmeric for enhanced absorption. Add to warm milk with honey.',
    'Seeds': 'Crush and steep in hot water for pepper tea. Take with honey for sore throat.',
    'Oil/Extract': 'Dilute with carrier oil for muscle pain massage. Use 1-2 drops in steam inhalation.',
  },
  'iramusu': {
    'Roots': 'Make decoction by boiling dried roots in water for 20 min. Drink 1/2 cup twice daily as blood purifier and coolant.',
    'Leaves': 'Make tea from fresh or dried leaves. Apply paste for skin conditions.',
    'Stem': 'Boil chopped stems for a cooling decoction. Take during hot weather.',
  },
  'ranawara': {
    'Flowers': 'Dry flowers and steep as tea (1 tsp per cup for 10 min). Very popular in Sri Lanka as "Ranawara tea" for diabetes management.',
    'Leaves': 'Boil leaves for decoction. Apply paste on skin for fungal infections.',
    'Seeds': 'Dry and powder seeds. Take 1/4 tsp with water for eye health.',
    'Roots': 'Make decoction from dried roots for urinary tract support.',
  },
  'polpala': {
    'Whole Plant': 'Boil dried plant in water for 15 min. Drink as herbal tea for kidney health. Very popular in Sri Lankan traditional medicine.',
    'Leaves': 'Steep dried leaves as tea. Take 1 cup twice daily for kidney stone prevention.',
    'Roots': 'Decoction of roots for urinary tract and kidney support.',
  },
  'hathawariya': {
    'Roots': 'Powder dried roots. Take 1/2 tsp with warm milk twice daily. Known as "Shatavari" — premier female reproductive tonic.',
    'Leaves': 'Cook young shoots as vegetable. Make tea from leaves.',
    'Stem': 'Boil stems for supportive decoction.',
  },
  'papaya': {
    'Fruits': 'Eat ripe fruit fresh for digestive enzymes. Green papaya can be cooked as vegetable.',
    'Leaves': 'Juice fresh leaves — take 1 tbsp daily for dengue platelet support. Very bitter but effective.',
    'Seeds': 'Dry and powder seeds. Take 1/4 tsp with honey — antiparasitic properties. Do not use during pregnancy.',
    'Latex': 'Use raw papaya latex for meat tenderizing. Apply carefully on warts. Avoid if latex-allergic.',
  },
  'ashwagandha': {
    'Roots': 'Take 1/2 tsp root powder with warm milk before bed. Known as "Indian Ginseng". Helps with stress and strength.',
    'Leaves': 'Make tea from dried leaves. Apply paste topically for wounds and swelling.',
    'Seeds': 'Less commonly used. Powder and take under practitioner guidance.',
  },
  'moringa': {
    'Leaves': 'Add fresh leaves to meals. Dry and powder — take 1 tsp daily in smoothies. Rich in nutrients.',
    'Seeds': 'Eat 2-3 seeds daily for purification. Press for moringa oil for skin and cooking.',
    'Bark': 'Make decoction for dental and digestive support.',
    'Flowers': 'Cook in curries or make tea. Good source of nutrients.',
    'Roots': 'Use cautiously — very potent. Small amounts in decoctions under guidance.',
    'Pods': 'Cook drumstick (pods) in curries and soups. Very nutritious.',
  },
  'vetiver': {
    'Roots': 'Soak dried roots in water overnight. Drink the water as coolant. Use roots to make fans/screens for natural cooling.',
    'Oil/Extract': 'Add to bath water. Use in diffuser for calming. Mix with carrier oil for massage.',
  },
  'licorice': {
    'Roots': 'Chew small piece of root for sore throat. Make decoction (boil 1/2 tsp powder in water). Take 1/4 tsp with honey.',
    'Oil/Extract': 'Use in tea blends. Apply diluted for skin brightening. Do not use long-term without guidance.',
  },
};

// ============ HELPER: NORMALIZE PLANT NAME ============
function normalizePlantName(name) {
  const key = name.toLowerCase().trim();
  if (PLANT_PARTS_MAP[key]) return key;
  const normalized = key.replace(/\s+/g, '');
  const match = Object.keys(PLANT_PARTS_MAP).find(k => k.replace(/\s+/g, '') === normalized);
  return match || key;
}

function findInUsageMap(name) {
  const key = name.toLowerCase().trim();
  if (PLANT_USAGE_MAP[key]) return PLANT_USAGE_MAP[key];
  const normalized = key.replace(/\s+/g, '');
  const match = Object.keys(PLANT_USAGE_MAP).find(k => k.replace(/\s+/g, '') === normalized);
  return match ? PLANT_USAGE_MAP[match] : null;
}

// ============ RISK CALCULATION LOGIC ============
function calculateRiskLevel(plantName, plantPart, healthData) {
  let riskScore = 0;
  const plant = normalizePlantName(plantName);

  // High-risk plant parts
  const highRiskParts = ['Latex', 'Oil/Extract', 'Roots', 'Seeds', 'Bark'];
  const mediumRiskParts = ['Rhizome', 'Flowers', 'Stem', 'Heartwood', 'Gel'];
  if (highRiskParts.includes(plantPart)) riskScore += 2;
  else if (mediumRiskParts.includes(plantPart)) riskScore += 1;

  // High-risk plants (potent or commonly misused)
  const highRiskPlants = ['neem', 'aloe vera', 'papaya', 'ashwagandha', 'licorice', 'giloy'];
  const medRiskPlants = ['arjuna', 'vasaka', 'black pepper', 'hathawariya', 'moringa'];
  if (highRiskPlants.includes(plant)) riskScore += 2;
  else if (medRiskPlants.includes(plant)) riskScore += 1;

  if (healthData) {
    if (healthData.isPregnant) riskScore += 3;
    if (healthData.isBreastfeeding) riskScore += 2;
    if (healthData.medications && healthData.medications.length > 0) riskScore += healthData.medications.length;
    if (healthData.allergies && healthData.allergies.length > 0) riskScore += healthData.allergies.length;
    if (healthData.conditions && healthData.conditions.length > 0) riskScore += healthData.conditions.length;
    if (healthData.age) {
      const age = parseInt(healthData.age);
      if (age < 12 || age > 70) riskScore += 2;
      else if (age < 18 || age > 60) riskScore += 1;
    }
  }

  if (riskScore >= 5) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

function generateRiskDescription(plantName, plantPart, riskLevel, healthData) {
  const parts = [];
  parts.push(`Using ${plantPart} of ${plantName} carries a ${riskLevel} risk level for your profile.`);

  if (healthData?.isPregnant) parts.push(`Pregnancy increases sensitivity to herbal compounds in ${plantName}.`);
  if (healthData?.isBreastfeeding) parts.push(`Active compounds may transfer through breast milk.`);
  if (healthData?.medications?.length > 0) parts.push(`Potential interactions with: ${healthData.medications.join(', ')}.`);
  if (healthData?.allergies?.length > 0) parts.push(`You have allergies to: ${healthData.allergies.join(', ')}. Cross-reactivity is possible.`);
  if (healthData?.conditions?.length > 0) parts.push(`Your conditions (${healthData.conditions.join(', ')}) may be affected by this herb.`);
  if (healthData?.age) {
    const age = parseInt(healthData.age);
    if (age < 12) parts.push('Children require significantly lower doses and professional supervision.');
    else if (age > 70) parts.push('Older adults may have increased sensitivity; start with lower doses.');
  }

  return parts.join(' ');
}

function generateWarnings(plantName, plantPart, healthData) {
  const warnings = [];
  const plant = normalizePlantName(plantName);

  // Part-specific warnings
  if (plantPart === 'Latex') warnings.push('Latex is a strong irritant. Never apply on open wounds or sensitive areas.');
  if (plantPart === 'Oil/Extract') warnings.push('Concentrated extracts must always be diluted before use. Perform a patch test first.');
  if (plantPart === 'Seeds') warnings.push('Seeds may contain concentrated active compounds. Follow exact dosage guidelines.');
  if (plantPart === 'Roots') warnings.push('Root preparations can be potent. Start with smaller doses.');
  if (plantPart === 'Bark') warnings.push('Bark tannins may cause digestive upset. Take with food if needed.');

  // Plant-specific warnings
  if (plant === 'neem') warnings.push('Neem can lower blood sugar. Monitor levels if diabetic.');
  if (plant === 'aloe vera') warnings.push('Aloe latex is a powerful laxative. Only use the clear gel unless directed otherwise.');
  if (plant === 'papaya') warnings.push('Papaya seeds and latex should be avoided during pregnancy (may cause contractions).');
  if (plant === 'licorice') warnings.push('Long-term licorice use can raise blood pressure and lower potassium.');
  if (plant === 'ashwagandha') warnings.push('May interact with thyroid, diabetes, and blood pressure medications.');
  if (plant === 'turmeric') warnings.push('High doses may thin blood. Avoid before surgery.');
  if (plant === 'ginger') warnings.push('Large amounts may increase bleeding risk if on blood thinners.');
  if (plant === 'black pepper') warnings.push('Black pepper increases absorption of many drugs, potentially causing overdose effects.');
  if (plant === 'cinnamon') warnings.push('Cassia cinnamon contains coumarin which may harm the liver in large doses. Ceylon cinnamon is safer.');
  if (plant === 'arjuna') warnings.push('May lower blood pressure. Monitor if on BP medications.');
  if (plant === 'giloy') warnings.push('May worsen autoimmune conditions by boosting immune activity.');

  if (healthData?.isPregnant) warnings.push('Consult your OB-GYN before using any herbal remedy during pregnancy.');
  if (healthData?.isBreastfeeding) warnings.push('Consult a lactation specialist before use.');
  if (healthData?.medications?.length > 0) warnings.push('Discuss potential herb-drug interactions with your pharmacist.');

  return warnings;
}

function generateRecommendations(plantName, plantPart, riskLevel) {
  const recs = ['Always consult a qualified Ayurvedic practitioner or healthcare provider before starting any herbal remedy.'];
  if (riskLevel === 'high') {
    recs.push('Do not use without professional supervision.');
    recs.push('Start with the lowest possible dose and monitor for adverse effects.');
    recs.push('Have emergency contacts ready in case of severe reactions.');
  } else if (riskLevel === 'medium') {
    recs.push('Start with half the recommended dose for the first week.');
    recs.push('Monitor for any unusual symptoms and discontinue if they occur.');
  } else {
    recs.push('Follow standard dosage recommendations.');
    recs.push('Generally considered safe for most adults when used as directed.');
  }
  recs.push('Discontinue use at least 2 weeks before any scheduled surgery.');
  return recs;
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Python ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * @route   POST /api/plant-identification/identify
 * @desc    Identify a plant from an uploaded image
 * @access  Public (or add auth middleware)
 */
router.post('/identify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Create form data for Python service
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname || 'plant-image.jpg',
      contentType: req.file.mimetype,
    });

    // Include health data if provided
    if (req.body.healthData) {
      formData.append('healthData', req.body.healthData);
    }

    // Call Python ML service
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/plant/identify`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Plant identification error:', error.message);
    
    if (error.response) {
      // Error from ML service
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.detail || 'ML service error',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to identify plant. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/plant-identification/info/:plantName
 * @desc    Get detailed information about a plant
 * @access  Public
 */
router.get('/info/:plantName', async (req, res) => {
  try {
    const { plantName } = req.params;
    
    const response = await axios.get(
      `${ML_SERVICE_URL}/api/plant/info/${encodeURIComponent(plantName)}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Get plant info error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get plant information',
    });
  }
});

/**
 * @route   POST /api/plant-identification/similar
 * @desc    Find similar plants based on image
 * @access  Public
 */
router.post('/similar', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname || 'plant-image.jpg',
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${ML_SERVICE_URL}/api/plant/similar`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Find similar plants error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to find similar plants',
    });
  }
});

/**
 * @route   GET /api/plant-identification/plant-parts/:plantName
 * @desc    Get available parts for a specific plant
 * @access  Public
 */
router.get('/plant-parts/:plantName', async (req, res) => {
  try {
    const plantName = req.params.plantName.toLowerCase().trim();
    // Try exact match first, then normalized (no spaces) match
    let plantInfo = PLANT_PARTS_MAP[plantName];
    if (!plantInfo) {
      const normalized = plantName.replace(/\s+/g, '');
      const matchKey = Object.keys(PLANT_PARTS_MAP).find(
        key => key.replace(/\s+/g, '') === normalized
      );
      if (matchKey) plantInfo = PLANT_PARTS_MAP[matchKey];
    }
    if (plantInfo) {
      res.json({ success: true, parts: plantInfo.parts, scientificName: plantInfo.scientificName });
    } else {
      // Return generic parts if plant not in database
      res.json({ success: true, parts: ['Leaves', 'Roots', 'Bark', 'Flowers', 'Seeds', 'Fruits', 'Stem', 'Whole Plant', 'Oil/Extract', 'Other'], scientificName: null });
    }
  } catch (error) {
    console.error('Get plant parts error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get plant parts' });
  }
});

/**
 * @route   GET /api/plant-identification/risk-alerts
 * @desc    Get all risk alerts from database
 * @access  Public
 */
router.get('/risk-alerts', async (req, res) => {
  try {
    const alerts = await RiskAlert.find({ dismissed: false }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error('Get risk alerts error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get risk alerts' });
  }
});

/**
 * @route   POST /api/plant-identification/risk-alerts/personalized
 * @desc    Check personalized risks and save to database
 * @access  Public
 */
router.post('/risk-alerts/personalized', async (req, res) => {
  try {
    const { plantName, plantPart, purpose, healthData } = req.body;

    if (!plantName || !plantPart) {
      return res.status(400).json({ success: false, message: 'Plant name and plant part are required' });
    }

    // Build a detailed health profile summary for Groq
    const healthSummary = [];
    if (healthData?.age) healthSummary.push(`Age: ${healthData.age}`);
    if (healthData?.isPregnant) healthSummary.push('Currently pregnant');
    if (healthData?.isBreastfeeding) healthSummary.push('Currently breastfeeding');
    if (healthData?.medications?.length > 0) healthSummary.push(`Medications: ${healthData.medications.join(', ')}`);
    if (healthData?.allergies?.length > 0) healthSummary.push(`Known allergies: ${healthData.allergies.join(', ')}`);
    if (healthData?.conditions?.length > 0) healthSummary.push(`Health conditions: ${healthData.conditions.join(', ')}`);
    if (healthData?.otherHealthInfo) healthSummary.push(`Additional info: ${healthData.otherHealthInfo}`);

    const healthProfileText = healthSummary.length > 0
      ? healthSummary.join('. ')
      : 'No specific health conditions or medications reported.';

    const purposeText = purpose ? ` for the purpose of "${purpose}"` : '';

    // Get usage info from local map as context for Groq
    const usageMap = findInUsageMap(plantName);
    const localHowToUse = usageMap?.[plantPart] || null;

    let groqRiskData = null;

    try {
      const prompt = `You are an expert Ayurvedic medicine safety analyst. A user wants to use the ${plantPart} part of ${plantName}${purposeText}.

User health profile: ${healthProfileText}

Provide a comprehensive, personalized safety risk assessment. Respond ONLY with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "riskLevel": "high" or "medium" or "low",
  "title": "brief descriptive title for this risk assessment",
  "description": "2-3 sentence personalized risk description specifically addressing this user's health profile and why this plant/part combination carries this risk level for them",
  "howToUse": "specific instructions on how to safely use ${plantPart} of ${plantName}${purposeText}, including preparation method, dosage, and timing",
  "warnings": ["specific warning 1 personalized to user", "specific warning 2", "specific warning 3"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
}

IMPORTANT: Be specific to this user's health profile. If they have medications, mention potential interactions. If pregnant/breastfeeding, address those risks directly. Base the risk level on the combination of plant potency AND user health factors.`;

      if (!groq) throw new Error('Groq client not initialized');

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      });

      const rawContent = completion.choices[0]?.message?.content?.trim();
      // Strip any markdown code fences if present
      const cleaned = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      groqRiskData = JSON.parse(cleaned);
    } catch (groqErr) {
      console.warn('Groq API failed, falling back to rule-based logic:', groqErr.message);
    }

    // Use Groq result or fall back to rule-based logic
    const riskLevel = groqRiskData?.riskLevel || calculateRiskLevel(plantName, plantPart, healthData);
    const description = groqRiskData?.description || generateRiskDescription(plantName, plantPart, riskLevel, healthData);
    const warnings = groqRiskData?.warnings || generateWarnings(plantName, plantPart, healthData);
    const recommendations = groqRiskData?.recommendations || generateRecommendations(plantName, plantPart, riskLevel);
    const howToUse = groqRiskData?.howToUse || localHowToUse || `Use ${plantPart} of ${plantName} as directed by a qualified Ayurvedic practitioner. Start with small doses and observe your body's response.`;
    const title = groqRiskData?.title || `${plantName} — ${plantPart} Risk Assessment`;

    const riskAlert = new RiskAlert({
      plantName,
      plantPart,
      purpose: purpose || '',
      riskLevel,
      title,
      description,
      howToUse,
      warnings,
      recommendations,
      healthData: healthData || {},
    });

    await riskAlert.save();

    res.json({ success: true, alerts: [riskAlert], aiPowered: !!groqRiskData });
  } catch (error) {
    console.error('Personalized risk check error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ success: false, message: 'Failed to check personalized risks' });
  }
});

/**
 * @route   POST /api/plant-identification/groq-description
 * @desc    Get AI-generated plant description using Groq for any plant name
 * @access  Public
 */
router.post('/groq-description', async (req, res) => {
  try {
    const { plantName } = req.body;
    if (!plantName || !plantName.trim()) {
      return res.status(400).json({ success: false, message: 'Plant name is required' });
    }

    const prompt = `You are an expert in Ayurvedic and traditional medicinal plants. Provide detailed information about the medicinal plant "${plantName}".

Respond ONLY with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "plantName": "common English name",
  "scientificName": "Genus species (Latin)",
  "description": "comprehensive 3-4 sentence description covering origin, history, cultural significance, key compounds, and primary uses in traditional medicine",
  "medicinalUses": ["use 1", "use 2", "use 3", "use 4", "use 5", "use 6"],
  "ayurvedicProperties": {
    "rasa": "Taste description",
    "guna": "Quality description",
    "virya": "Potency description",
    "vipaka": "Post-digestive effect"
  },
  "doshaEffect": "Which doshas this plant balances or affects",
  "partsUsed": ["part1", "part2"],
  "preparationMethods": ["method 1", "method 2", "method 3"],
  "warnings": ["warning 1", "warning 2", "warning 3"],
  "commonNames": ["name 1", "name 2", "name 3"],
  "category": "one of: Brain & Memory, Immunity & Stress, Digestive, Skin & Hair, Anti-inflammatory, Heart Health, Respiratory, or General Wellness",
  "found": true
}

If "${plantName}" is not a known medicinal plant, respond with: {"found": false, "message": "Plant not found"}

IMPORTANT: Return ONLY the JSON object. No preamble, no explanation.`;

    if (!groq) {
      return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const rawContent = completion.choices[0]?.message?.content?.trim();
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const plantData = JSON.parse(cleaned);

    res.json({ success: true, data: plantData });
  } catch (error) {
    console.error('Groq description error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get plant description from AI' });
  }
});

/**
 * @route   PUT /api/plant-identification/risk-alerts/:alertId
 * @desc    Update a risk alert
 * @access  Public
 */
router.put('/risk-alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { plantName, plantPart, purpose, healthData } = req.body;

    if (!plantName || !plantPart) {
      return res.status(400).json({ success: false, message: 'Plant name and plant part are required' });
    }

    // Build health profile for Groq
    const healthSummary = [];
    if (healthData?.age) healthSummary.push(`Age: ${healthData.age}`);
    if (healthData?.isPregnant) healthSummary.push('Currently pregnant');
    if (healthData?.isBreastfeeding) healthSummary.push('Currently breastfeeding');
    if (healthData?.medications?.length > 0) healthSummary.push(`Medications: ${healthData.medications.join(', ')}`);
    if (healthData?.allergies?.length > 0) healthSummary.push(`Known allergies: ${healthData.allergies.join(', ')}`);
    if (healthData?.conditions?.length > 0) healthSummary.push(`Health conditions: ${healthData.conditions.join(', ')}`);
    if (healthData?.otherHealthInfo) healthSummary.push(`Additional info: ${healthData.otherHealthInfo}`);
    const healthProfileText = healthSummary.length > 0 ? healthSummary.join('. ') : 'No specific health conditions reported.';
    const purposeText = purpose ? ` for the purpose of "${purpose}"` : '';

    let groqRiskData = null;
    try {
      const prompt = `You are an expert Ayurvedic medicine safety analyst. A user wants to use the ${plantPart} part of ${plantName}${purposeText}.\nUser health profile: ${healthProfileText}\nProvide a comprehensive, personalized safety risk assessment. Respond ONLY with a valid JSON object (no markdown) with this exact structure:\n{"riskLevel":"high or medium or low","title":"brief descriptive title","description":"2-3 sentence personalized risk description","howToUse":"specific instructions","warnings":["warning 1","warning 2","warning 3"],"recommendations":["rec 1","rec 2","rec 3"]}`;

      if (!groq) throw new Error('Groq client not initialized');

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 700,
      });
      const raw = completion.choices[0]?.message?.content?.trim();
      const cleanedRaw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      groqRiskData = JSON.parse(cleanedRaw);
    } catch (groqErr) {
      console.warn('Groq failed on update, using fallback:', groqErr.message);
    }

    const riskLevel = groqRiskData?.riskLevel || calculateRiskLevel(plantName, plantPart, healthData);
    const description = groqRiskData?.description || generateRiskDescription(plantName, plantPart, riskLevel, healthData);
    const warningsArr = groqRiskData?.warnings || generateWarnings(plantName, plantPart, healthData);
    const recommendations = groqRiskData?.recommendations || generateRecommendations(plantName, plantPart, riskLevel);
    const usageMap = findInUsageMap(plantName);
    const howToUse = groqRiskData?.howToUse || usageMap?.[plantPart] || `Use ${plantPart} of ${plantName} as directed by a qualified Ayurvedic practitioner.`;
    const title = groqRiskData?.title || `${plantName} — ${plantPart} Risk Assessment`;

    const updated = await RiskAlert.findByIdAndUpdate(alertId, {
      plantName,
      plantPart,
      purpose: purpose || '',
      riskLevel,
      title,
      description,
      howToUse,
      warnings: warningsArr,
      recommendations,
      healthData: healthData || {},
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({ success: true, alert: updated });
  } catch (error) {
    console.error('Update risk alert error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update risk alert' });
  }
});

/**
 * @route   DELETE /api/plant-identification/risk-alerts/:alertId
 * @desc    Delete a risk alert permanently
 * @access  Public
 */
router.delete('/risk-alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const deleted = await RiskAlert.findByIdAndDelete(alertId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete risk alert error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete alert' });
  }
});

/**
 * @route   PATCH /api/plant-identification/risk-alerts/:alertId/dismiss
 * @desc    Dismiss a risk alert (soft delete)
 * @access  Public
 */
router.patch('/risk-alerts/:alertId/dismiss', async (req, res) => {
  try {
    const { alertId } = req.params;
    const updated = await RiskAlert.findByIdAndUpdate(alertId, { dismissed: true }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, message: 'Alert dismissed' });
  } catch (error) {
    console.error('Dismiss alert error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to dismiss alert' });
  }
});

/**
 * @route   POST /api/plant-identification/history
 * @desc    Save a plant identification to history
 * @access  Public
 */
router.post('/history', async (req, res) => {
  try {
    const { plantName, scientificName, confidence, image, identifiedAt } = req.body;

    if (!plantName) {
      return res.status(400).json({
        success: false,
        message: 'Plant name is required',
      });
    }

    const historyEntry = {
      _id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      plantName,
      scientificName: scientificName || '',
      confidence: confidence || 0,
      image: image || '',
      identifiedAt: identifiedAt || new Date().toISOString(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    // Add to history (at the beginning)
    plantHistory.unshift(historyEntry);

    // Keep only last 100 entries
    if (plantHistory.length > 100) {
      plantHistory = plantHistory.slice(0, 100);
    }

    res.json({
      success: true,
      message: 'Plant saved to history',
      data: historyEntry,
    });
  } catch (error) {
    console.error('Save to history error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to save to history',
    });
  }
});

/**
 * @route   GET /api/plant-identification/history
 * @desc    Get plant identification history
 * @access  Public
 */
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, page = 1, sort = 'newest' } = req.query;
    
    let sortedHistory = [...plantHistory];
    
    if (sort === 'oldest') {
      sortedHistory.reverse();
    } else if (sort === 'name') {
      sortedHistory.sort((a, b) => a.plantName.localeCompare(b.plantName));
    }

    const startIndex = (page - 1) * limit;
    const paginatedHistory = sortedHistory.slice(startIndex, startIndex + parseInt(limit));

    res.json(paginatedHistory);
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get history',
    });
  }
});

/**
 * @route   GET /api/plant-identification/history/:id
 * @desc    Get a specific plant identification by ID
 * @access  Public
 */
router.get('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = plantHistory.find(item => item._id === id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found',
      });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get history entry error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get history entry',
    });
  }
});

/**
 * @route   DELETE /api/plant-identification/history/:id
 * @desc    Delete a plant identification from history
 * @access  Public
 */
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = plantHistory.findIndex(item => item._id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found',
      });
    }

    plantHistory.splice(index, 1);

    res.json({
      success: true,
      message: 'Entry deleted from history',
    });
  } catch (error) {
    console.error('Delete history entry error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history entry',
    });
  }
});

module.exports = router;
