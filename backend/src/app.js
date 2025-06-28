const express = require('express');
const cors = require('cors');
// const sanitize = require('express-mongo-sanitize');

const sanitize = require('mongo-sanitize');


const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(mongoSanitize());

// Logging middleware BEFORE sanitization
app.use((req, res, next) => {
  console.log('---- Incoming Request (before sanitization) ----');
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  next();
});



app.use((req, res, next) => {
  // Sanitize req.body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize req.params
  if (req.params) {
    req.params = sanitize(req.params);
  }

  // Sanitize req.query (only the values, don't overwrite the whole object)
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/payroll', payrollRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;