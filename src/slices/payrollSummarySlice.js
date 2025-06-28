import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../lib/api.js';

const initialState = {
  summary: null,
  status: 'idle',
};

export const fetchPayrollSummary = createAsyncThunk(
  'payroll/fetchSummary',
  async (currency) => {
    const response = await api.fetchPayrollSummary(currency);
    return response;
  }
);

const payrollSummarySlice = createSlice({
  name: 'payrollSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPayrollSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchPayrollSummary.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default payrollSummarySlice.reducer;
