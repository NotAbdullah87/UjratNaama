const express = require('express');
const router = express.Router();
const { getPayrollSummary } = require('../controllers/payrollController');
const { authenticate } = require('../middleware/auth');
const { validatePayrollQuery } = require('../middleware/validation');

router.use(authenticate);

router.get('/summary', validatePayrollQuery, getPayrollSummary);

module.exports = router;