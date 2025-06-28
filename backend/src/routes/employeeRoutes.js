const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  addHoliday,
  deleteHoliday
} = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateEmployee,
  validateEmployeeUpdate,
  validateHoliday
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Employee routes
router.post('/', authorize('hr'), validateEmployee, createEmployee);
router.get('/', getEmployees);
router.patch('/:id', authorize('hr'), validateEmployeeUpdate, updateEmployee);
router.delete('/:id', authorize('hr'), deleteEmployee);

module.exports = router;