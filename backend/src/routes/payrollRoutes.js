const express = require('express');
const router = express.Router();
const { getPayrollSummary } = require('../controllers/payrollController');
const { authenticate } = require('../middleware/auth');
const { validatePayrollQuery } = require('../middleware/validation');


router.get('/summary', validatePayrollQuery, getPayrollSummary);

router.use(authenticate);


module.exports = router;