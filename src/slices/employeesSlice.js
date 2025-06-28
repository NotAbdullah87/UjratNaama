import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../lib/api.js';

const initialState = {
  employees: [],
  status: 'idle',
};

// Async thunk to fetch employees (defaults to status: 'active')
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await api.fetchEmployees({ status: 'active' });
  return response;
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default employeesSlice.reducer;
