const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateEmployee = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('dept').trim().notEmpty().withMessage('Department is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('hourlyRate.amount').isFloat({ min: 0 }).withMessage('Hourly rate must be >= 0'),
  body('hourlyRate.currency').isISO4217().withMessage('Valid currency code required'),
  body('hireDate').isISO8601().withMessage('Valid hire date required'),
  handleValidationErrors
];

const validateEmployeeUpdate = [
  body('status').optional().isIn(['active', 'resigned']),
  body('hourlyRate.amount').optional().isFloat({ min: 0 }),
  body('hourlyRate.currency').optional().isISO4217(),
  handleValidationErrors
];

const validateHoliday = [
  body('employeeId').isMongoId().withMessage('Valid employee ID required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('kind').isIn(['paid', 'unpaid', 'sick']).withMessage('Invalid holiday type'),
  handleValidationErrors
];

const validatePayrollQuery = [
  query('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM format'),
  query('currency').isISO4217().withMessage('Valid currency code required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,  // Add this export
  validateEmployee,
  validateEmployeeUpdate,
  validateHoliday,
  validatePayrollQuery
};