const Employee = require('../models/Employee');
const currencyService = require('./currencyService');
const { getBusinessDaysInMonth } = require('../utils/dateUtils');

const calculatePayrollSummary = async (month, currency) => {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0);
  
  // Get all active employees
  const employees = await Employee.find({ status: 'active' });
  
  // Calculate business days in the month
  const workdays = getBusinessDaysInMonth(year, monthNum);
  
  // Initialize summary structure
  const deptSummary = {};
  let totalHeadCount = 0;
  let totalBillableHours = 0;
  let totalMonthlyCost = 0;
  
  for (const employee of employees) {
    // Count unpaid holidays in this month
    const unpaidHolidays = employee.holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holiday.kind === 'unpaid' &&
             holidayDate >= startDate &&
             holidayDate <= endDate;
    }).length;
    
    // Calculate billable hours
    const billableHours = (workdays * 8) - (unpaidHolidays * 8);
    
    // Calculate cost in employee's currency
    const costInEmployeeCurrency = billableHours * employee.hourlyRate.amount;
    
    // Convert to requested currency
    const costInRequestedCurrency = currencyService.convert(
      costInEmployeeCurrency,
      employee.hourlyRate.currency,
      currency
    );
    
    // Initialize department if not exists
    if (!deptSummary[employee.dept]) {
      deptSummary[employee.dept] = {
        dept: employee.dept,
        headCount: 0,
        billableHours: 0,
        monthlyCost: 0
      };
    }
    
    // Update department summary
    deptSummary[employee.dept].headCount += 1;
    deptSummary[employee.dept].billableHours += billableHours;
    deptSummary[employee.dept].monthlyCost += costInRequestedCurrency;
    
    // Update totals
    totalHeadCount += 1;
    totalBillableHours += billableHours;
    totalMonthlyCost += costInRequestedCurrency;
  }
  
  return {
    byDept: Object.values(deptSummary),
    totalHeadCount,
    totalBillableHours,
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100
  };
};

module.exports = { calculatePayrollSummary };