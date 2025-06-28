const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const { dept, status } = req.query;
    const filter = {};
    
    if (dept) filter.dept = dept;
    if (status) filter.status = status;
    
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, hourlyRate } = req.body;
    
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // If new hourly rate is higher, add current rate to raises history
    if (hourlyRate && hourlyRate.amount > employee.hourlyRate.amount) {
      employee.raises.push({
        date: new Date(),
        amount: employee.hourlyRate.amount,
        currency: employee.hourlyRate.currency
      });
    }
    
    if (status) employee.status = status;
    if (hourlyRate) employee.hourlyRate = hourlyRate;
    
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

const addHoliday = async (req, res) => {
  try {
    const { employeeId, date, kind } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee.holidays.push({ date, kind });
    await employee.save();
    
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error adding holiday', error: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find employee with this holiday
    const employee = await Employee.findOne({ 'holidays._id': id });
    if (!employee) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    
    employee.holidays = employee.holidays.filter(h => h._id.toString() !== id);
    await employee.save();
    
    res.json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting holiday', error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  addHoliday,
  deleteHoliday
};