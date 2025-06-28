import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import employeesReducer from '../slices/employeesSlice.js';
import payrollSummaryReducer from '../slices/payrollSummarySlice.js';
import uiReducer from '../slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    payrollSummary: payrollSummaryReducer,
    ui: uiReducer,
  },
});
