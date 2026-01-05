import axios from '../../api/axios';

// Base endpoint for plant identification API (without /api prefix since axios baseURL already includes it)
const PLANT_API_BASE = '/plant-identification';

/**
 * Identify a plant from an image with optional health data for personalized analysis
 * @param {File} imageFile - The image file to identify
 * @param {Object} healthData - Optional user health data for personalized safety analysis
 * @returns {Promise} - Plant identification results with personalized safety alerts
 */
export const identifyPlant = async (imageFile, healthData = null) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Include health data if provided for personalized safety analysis
    if (healthData) {
      formData.append('healthData', JSON.stringify(healthData));
    }

    const response = await axios.post(`${PLANT_API_BASE}/identify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to identify plant. Please try again.'
    );
  }
};

/**
 * Save plant identification to user's history
 * @param {Object} identificationData - The plant identification data to save
 * @returns {Promise} - Saved identification data
 */
export const savePlantIdentification = async (identificationData) => {
  try {
    const response = await axios.post(`${PLANT_API_BASE}/history`, identificationData);
    return response.data;
  } catch (error) {
    console.error('Error saving identification:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to save identification.'
    );
  }
};

/**
 * Get user's plant identification history
 * @param {Object} params - Query parameters (limit, page, sort)
 * @returns {Promise} - Array of plant identifications
 */
export const getPlantHistory = async (params = {}) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/history`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching plant history:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load plant history.'
    );
  }
};

/**
 * Get a single plant identification by ID
 * @param {string} id - The identification ID
 * @returns {Promise} - Plant identification data
 */
export const getPlantIdentificationById = async (id) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant identification:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load plant identification.'
    );
  }
};

/**
 * Delete a plant identification from history
 * @param {string} id - The identification ID to delete
 * @returns {Promise} - Deletion confirmation
 */
export const deletePlantIdentification = async (id) => {
  try {
    const response = await axios.delete(`${PLANT_API_BASE}/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting identification:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete identification.'
    );
  }
};

/**
 * Search for plants by name
 * @param {string} query - The search query
 * @returns {Promise} - Array of matching plants
 */
export const searchPlants = async (query) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching plants:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to search plants.'
    );
  }
};

/**
 * Get plant details by name or ID
 * @param {string} identifier - Plant name or ID
 * @returns {Promise} - Plant details
 */
export const getPlantDetails = async (identifier) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/details/${identifier}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant details:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load plant details.'
    );
  }
};

/**
 * Toggle favorite status for a plant identification
 * @param {string} id - The identification ID
 * @returns {Promise} - Updated identification data
 */
export const toggleFavorite = async (id) => {
  try {
    const response = await axios.patch(`${PLANT_API_BASE}/history/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to update favorite status.'
    );
  }
};

/**
 * Get plant identification statistics for the user
 * @returns {Promise} - Statistics data
 */
export const getPlantStats = async () => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant stats:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load statistics.'
    );
  }
};

/**
 * Get similar plants based on an identification
 * @param {string} plantName - The plant name to find similar plants for
 * @returns {Promise} - Array of similar plants
 */
export const getSimilarPlants = async (plantName) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/similar`, {
      params: { plant: plantName }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching similar plants:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load similar plants.'
    );
  }
};

/**
 * Get all risk alerts for medicinal plants, optionally filtered by health profile
 * @param {Object} healthData - Optional user health data for personalized alerts
 * @returns {Promise} - Array of risk alerts
 */
export const getRiskAlerts = async (healthData = null) => {
  try {
    const params = healthData ? { healthProfile: JSON.stringify(healthData) } : {};
    const response = await axios.get(`${PLANT_API_BASE}/risk-alerts`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching risk alerts:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load risk alerts.'
    );
  }
};

/**
 * Generate personalized safety alerts based on plant and user health data
 * @param {string} plantId - The identified plant ID
 * @param {Object} healthData - User health data
 * @returns {Promise} - Personalized safety alerts and recommendations
 */
export const generatePersonalizedAlerts = async (plantId, healthData) => {
  try {
    const response = await axios.post(`${PLANT_API_BASE}/generate-alerts`, {
      plantId,
      healthData
    });
    return response.data;
  } catch (error) {
    console.error('Error generating personalized alerts:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to generate personalized alerts.'
    );
  }
};

/**
 * Dismiss a risk alert
 * @param {string} alertId - The alert ID to dismiss
 * @returns {Promise} - Dismissal confirmation
 */
export const dismissAlert = async (alertId) => {
  try {
    const response = await axios.patch(`${PLANT_API_BASE}/risk-alerts/${alertId}/dismiss`);
    return response.data;
  } catch (error) {
    console.error('Error dismissing alert:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to dismiss alert.'
    );
  }
};

/**
 * Check personalized risks for a plant based on health data
 * @param {Object} data - Plant and health data
 * @param {string} data.plantName - The name of the plant
 * @param {string} data.plantPart - The part of the plant being used
 * @param {Object} data.healthData - User's health information
 * @returns {Promise} - Personalized risk alerts
 */
export const checkPersonalizedRisks = async (data) => {
  try {
    const response = await axios.post(`${PLANT_API_BASE}/risk-alerts/personalized`, data);
    return response.data;
  } catch (error) {
    console.error('Error checking personalized risks:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to check personalized risks.'
    );
  }
};

/**
 * Get comprehensive safety information for a specific plant
 * @param {string} plantId - The plant ID
 * @returns {Promise} - Detailed safety information
 */
export const getPlantSafetyInfo = async (plantId) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/safety/${plantId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching safety information:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load safety information.'
    );
  }
};

/**
 * Get warnings for a specific plant
 * @param {string} plantId - The plant ID
 * @returns {Promise} - Array of warnings
 */
export const getPlantWarnings = async (plantId) => {
  try {
    const response = await axios.get(`${PLANT_API_BASE}/warnings/${plantId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant warnings:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to load warnings.'
    );
  }
};

/**
 * Check for drug interactions with a plant
 * @param {string} plantId - The plant ID
 * @param {Array<string>} medications - List of medication names
 * @returns {Promise} - Interaction data
 */
export const checkDrugInteractions = async (plantId, medications) => {
  try {
    const response = await axios.post(`${PLANT_API_BASE}/check-interactions`, {
      plantId,
      medications
    });
    return response.data;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to check interactions.'
    );
  }
};

export default {
  identifyPlant,
  savePlantIdentification,
  getPlantHistory,
  getPlantIdentificationById,
  deletePlantIdentification,
  searchPlants,
  getPlantDetails,
  toggleFavorite,
  getPlantStats,
  getSimilarPlants,
  getRiskAlerts,
  dismissAlert,
  checkPersonalizedRisks,
  getPlantSafetyInfo,
  getPlantWarnings,
  checkDrugInteractions,
  generatePersonalizedAlerts,
};
