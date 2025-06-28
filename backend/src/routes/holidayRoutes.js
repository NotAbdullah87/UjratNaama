const express = require('express');
const router = express.Router();
const { addHoliday, deleteHoliday } = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateHoliday } = require('../middleware/validation');

// All routes require authentication and HR role
router.use(authenticate);
router.use(authorize('hr'));

router.post('/', validateHoliday, addHoliday);
router.delete('/:id', deleteHoliday);

module.exports = router;