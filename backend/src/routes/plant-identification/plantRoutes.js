/**
 * Plant Identification Routes
 * Handles plant identification API endpoints
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// In-memory storage for plant history (replace with database in production)
let plantHistory = [];

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
 * @route   GET /api/plant-identification/risk-alerts
 * @desc    Get risk alerts for the user
 * @access  Public
 */
router.get('/risk-alerts', async (req, res) => {
  try {
    // Return mock data for now - implement database storage later
    res.json([]);
  } catch (error) {
    console.error('Get risk alerts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get risk alerts',
    });
  }
});

/**
 * @route   POST /api/plant-identification/risk-alerts/personalized
 * @desc    Check personalized risks for a plant based on health data
 * @access  Public
 */
router.post('/risk-alerts/personalized', async (req, res) => {
  try {
    const { plantName, plantPart, healthData } = req.body;

    if (!plantName || !plantPart) {
      return res.status(400).json({
        success: false,
        message: 'Plant name and plant part are required',
      });
    }

    // Generate personalized alerts based on health data
    const alerts = generatePersonalizedAlerts(plantName, plantPart, healthData);

    res.json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.error('Personalized risk check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check personalized risks',
    });
  }
});

/**
 * @route   PATCH /api/plant-identification/risk-alerts/:alertId/dismiss
 * @desc    Dismiss a risk alert
 * @access  Public
 */
router.patch('/risk-alerts/:alertId/dismiss', async (req, res) => {
  try {
    const { alertId } = req.params;
    // Implement alert dismissal logic with database
    res.json({
      success: true,
      message: 'Alert dismissed',
    });
  } catch (error) {
    console.error('Dismiss alert error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss alert',
    });
  }
});

/**
 * Generate personalized safety alerts based on plant and health data
 */
function generatePersonalizedAlerts(plantName, plantPart, healthData) {
  const alerts = [];
  const now = new Date().toISOString();

  // Plant-part specific warnings
  const partWarnings = {
    'Roots': 'Root preparations may have stronger effects. Start with lower doses.',
    'Seeds': 'Seeds may contain concentrated compounds. Use with caution.',
    'Bark': 'Bark extracts may interact with medications. Consult a healthcare provider.',
    'Oil/Extract': 'Concentrated extracts require careful dosing. Follow recommended guidelines.',
  };

  if (partWarnings[plantPart]) {
    alerts.push({
      _id: `alert_${Date.now()}_1`,
      title: `${plantPart} Usage Advisory`,
      description: partWarnings[plantPart],
      severity: 'medium',
      plantName,
      plantPart,
      createdAt: now,
    });
  }

  if (!healthData) {
    return alerts;
  }

  // Pregnancy warning
  if (healthData.isPregnant) {
    alerts.push({
      _id: `alert_${Date.now()}_2`,
      title: 'Pregnancy Safety Alert',
      description: `Many medicinal plants including ${plantName} may not be safe during pregnancy. Please consult your healthcare provider before use.`,
      severity: 'critical',
      plantName,
      recommendations: [
        'Consult your OB-GYN or midwife before using any herbal remedies',
        'Avoid internal use of most herbs during first trimester',
        'Keep a record of any herbs you use to share with your healthcare team',
      ],
      createdAt: now,
    });
  }

  // Breastfeeding warning
  if (healthData.isBreastfeeding) {
    alerts.push({
      _id: `alert_${Date.now()}_3`,
      title: 'Breastfeeding Caution',
      description: `${plantName} compounds may pass into breast milk and affect your baby. Consult a healthcare provider.`,
      severity: 'high',
      plantName,
      recommendations: [
        'Consult a lactation specialist or pediatrician',
        'Monitor your baby for any unusual reactions',
        'Consider timing herb use away from feeding times if approved',
      ],
      createdAt: now,
    });
  }

  // Medication interactions
  if (healthData.medications && healthData.medications.length > 0) {
    alerts.push({
      _id: `alert_${Date.now()}_4`,
      title: 'Potential Drug Interactions',
      description: `You are taking ${healthData.medications.length} medication(s). ${plantName} may interact with certain drugs.`,
      severity: 'high',
      plantName,
      affectedPlants: [plantName],
      recommendations: [
        'Consult your pharmacist about herb-drug interactions',
        'Do not stop any prescribed medications without medical advice',
        'Take herbs and medications at different times if possible',
        `Medications to check: ${healthData.medications.join(', ')}`,
      ],
      createdAt: now,
    });
  }

  // Allergy warning
  if (healthData.allergies && healthData.allergies.length > 0) {
    alerts.push({
      _id: `alert_${Date.now()}_5`,
      title: 'Allergy Consideration',
      description: `You have listed allergies. ${plantName} may cause allergic reactions in sensitive individuals.`,
      severity: 'medium',
      plantName,
      recommendations: [
        'Perform a patch test before topical application',
        'Start with very small doses for internal use',
        'Have antihistamines available as a precaution',
        `Your allergies: ${healthData.allergies.join(', ')}`,
      ],
      createdAt: now,
    });
  }

  // Age-based warnings
  if (healthData.age) {
    const age = parseInt(healthData.age);
    if (age < 12) {
      alerts.push({
        _id: `alert_${Date.now()}_6`,
        title: 'Pediatric Use Warning',
        description: `${plantName} dosing for children requires special consideration. Adult doses are not appropriate for children.`,
        severity: 'critical',
        plantName,
        recommendations: [
          'Consult a pediatric practitioner before use',
          'Use child-appropriate formulations only',
          'Follow weight-based dosing guidelines',
        ],
        createdAt: now,
      });
    } else if (age > 65) {
      alerts.push({
        _id: `alert_${Date.now()}_7`,
        title: 'Senior Safety Note',
        description: `Older adults may be more sensitive to ${plantName}. Consider starting with reduced doses.`,
        severity: 'medium',
        plantName,
        recommendations: [
          'Start with half the recommended adult dose',
          'Monitor for any adverse effects',
          'Discuss with your healthcare provider, especially if you have chronic conditions',
        ],
        createdAt: now,
      });
    }
  }

  // Chronic conditions
  if (healthData.conditions && healthData.conditions.length > 0) {
    alerts.push({
      _id: `alert_${Date.now()}_8`,
      title: 'Health Condition Advisory',
      description: `Your health conditions may be affected by ${plantName}. Professional guidance is recommended.`,
      severity: 'high',
      plantName,
      recommendations: [
        'Consult your healthcare provider before use',
        'Monitor your condition closely when starting new herbs',
        `Your conditions: ${healthData.conditions.join(', ')}`,
      ],
      createdAt: now,
    });
  }

  return alerts;
}

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
