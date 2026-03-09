const express = require('express');
const router = express.Router();
const yogaController = require('../controllers/yogaController');

// Public routes
router.get('/poses', yogaController.getYogaPoses);
router.get('/poses/:id', yogaController.getYogaPose);

// Protected routes (with dev bypass)
router.post('/session/start', (req, res, next) => {
  // Add test user
  req.user = { id: 'test-user-id' };
  next();
}, yogaController.startSession);

router.post('/session/analyze', (req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
}, yogaController.analyzePose);

router.post('/session/end', (req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
}, yogaController.endSession);

router.get('/progress', (req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
}, yogaController.getUserProgress);

router.put('/personalization', (req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
}, yogaController.updatePersonalization);

module.exports = router;