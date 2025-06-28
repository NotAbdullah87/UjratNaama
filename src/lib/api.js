import { DUMMY_EMPLOYEES, DUMMY_PAYROLL_SUMMARY } from './dummyData.js';

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * DUMMY: Fetches a list of employees.
 */
export const fetchEmployees = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  // const url = `${process.env.API_ROUTE}/api/employees${query ? `?${query}` : ''}`;
  const url = "http://192.168.1.5:5000/api/employees" + (query ? `?${query}` : '');

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed:
        // 'Authorization': `Bearer ${yourToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API ERROR:', err.message);
    return [];
  }
};


/**
 * DUMMY: Fetches the payroll summary.
 */
export const fetchPayrollSummary = async (currency) => {
  try {
    const month = '2025-06'; // You can make this dynamic if needed
    const url = `http://192.168.1.5:5000/api/payroll/summary?month=${month}&currency=${currency}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add token if required:
        // Authorization: `Bearer ${yourToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch payroll summary');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API ERROR:', err.message);
    return null;
  }
};


/**
 * DUMMY: Adds a new holiday.
 */
export const addHoliday = async (payload) => {
  await delay(300);
  console.log('DUMMY API: Adding holiday:', payload);
  return { success: true };
};

/**
 * DUMMY: Creates a new employee.
 */
export const createEmployee = async (employeeData) => {
  await delay(400);
  console.log('DUMMY API: Creating employee:', employeeData);

  const newEmployee = {
    ...employeeData,
    _id: `emp${Date.now()}`,
  };

  DUMMY_EMPLOYEES.push(newEmployee);
  return newEmployee;
};

/**
 * DUMMY: Updates an employee's status or adds a raise.
 */
export const updateEmployee = async (id, updateData) => {
  await delay(400);
  console.log(`DUMMY API: Updating employee ${id} with:`, updateData);

  const index = DUMMY_EMPLOYEES.findIndex((e) => e._id === id);
  if (index !== -1) {
    DUMMY_EMPLOYEES[index] = {
      ...DUMMY_EMPLOYEES[index],
      ...updateData,
    };
  }

  return DUMMY_EMPLOYEES[index];
};
