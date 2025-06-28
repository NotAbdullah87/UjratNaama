import { DUMMY_EMPLOYEES, DUMMY_PAYROLL_SUMMARY } from './dummyData.js';

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * DUMMY: Fetches a list of employees.
 */

// src/lib/api.js
export const loginUser = async (email, password) => {
  const res = await fetch(`http://192.168.1.5:5000/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username : email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return res.json(); // Should return { token, user: { role, email } }
};



export const fetchEmployees = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  // const url = `${process.env.API_ROUTE}/api/employees${query ? `?${query}` : ''}`;
  // const url = "http://192.168.1.5:5000/api/employees" + (query ? `?${query}` : '');

  const url = "http://192.168.1.5:5000/api/employees"
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

export const deleteHoliday = async (holidayId, token) => {
  try {
    const res = await fetch(`http://192.168.1.5:5000/api/holidays/${holidayId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to delete holiday');
    }

    return await res.json();
  } catch (error) {
    console.error('API ERROR: deleteHoliday', error.message);
    throw error;
  }
};


export const addHoliday = async (payload,token) => {
  try {
    // console.log('API CALL: addHoliday', payload,payload.token);
    const response = await fetch('http://192.168.1.5:5000/api/holidays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add holiday');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API ERROR: addHoliday:', error.message);
    throw error;
  }
};



export const createEmployee = async (employeeData, token) => {
  try {
    
    // Transform flat form data into expected API structure
    const payload = {
      name: employeeData.name,
      email: employeeData.email,
      dept: employeeData.dept,
      title: employeeData.title,
      status: employeeData.status || 'active',
      hireDate: new Date().toISOString().split('T')[0], // or let user select
      hourlyRate: {
        amount: Number(employeeData.hourlyRate),
        currency: 'USD', // You can make this dynamic if needed
      },
    };
    console.log(payload);
    const response = await fetch(`http://192.168.1.5:5000/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // attach token if required
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create employee');
    }

    const newEmployee = await response.json();
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error.message);
    throw error;
  }
};


/**
 * DUMMY: Updates an employee's status or adds a raise.
 */
export const updateEmployee = async (id, updateData, token) => {
  try {
    const response = await fetch(`http://192.168.1.5:5000/api/employees/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include auth token if required
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update employee');
    }

    const updatedEmployee = await response.json();
    return updatedEmployee;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error.message);
    throw error;
  }
};


export const deleteEmployee = async (id, token) => {
  const response = await fetch(`http://192.168.1.5:5000/api/employees/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }

  return { success: true };
};
