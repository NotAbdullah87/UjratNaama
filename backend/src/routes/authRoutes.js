const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

router.post('/register', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['hr', 'viewer']).withMessage('Role must be hr or viewer'),
  // console.log(req.body),
  handleValidationErrors
], register);

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
], login);

module.exports = router;