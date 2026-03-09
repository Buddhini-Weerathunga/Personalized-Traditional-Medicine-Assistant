const express = require('express');
const router = express.Router();
const yogaController = require('../controllers/yogaController');
const auth = require('../middleware/auth');

// Public routes
router.get('/poses', yogaController.getYogaPoses);
router.get('/poses/:id', yogaController.getYogaPose);

// Protected routes
router.use(auth);

router.post('/session/start', yogaController.startSession);
router.post('/session/analyze', yogaController.analyzePose);
router.post('/session/end', yogaController.endSession);
router.get('/progress', yogaController.getUserProgress);
router.put('/personalization', yogaController.updatePersonalization);

module.exports = router;