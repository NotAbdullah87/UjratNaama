const payrollService = require('../services/payrollService');

const getPayrollSummary = async (req, res) => {
  try {
    const { month, currency } = req.query;
    const summary = await payrollService.calculatePayrollSummary(month, currency);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating payroll', error: error.message });
  }
};

module.exports = { getPayrollSummary };