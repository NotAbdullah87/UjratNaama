import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currency: 'USD',
  isAddEmployeeDrawerOpen: false,
  isAddHolidayDialogOpen: false,
  selectedEmployee: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    openAddEmployeeDrawer(state, action) {
      state.isAddEmployeeDrawerOpen = true;
      state.selectedEmployee = action.payload;
    },
    closeAddEmployeeDrawer(state) {
      state.isAddEmployeeDrawerOpen = false;
      state.selectedEmployee = null;
    },
    openAddHolidayDialog(state, action) {
      state.isAddHolidayDialogOpen = true;
      state.selectedEmployee = action.payload;
    },
    closeAddHolidayDialog(state) {
      state.isAddHolidayDialogOpen = false;
      state.selectedEmployee = null;
    },
  },
});

export const {
  setCurrency,
  openAddEmployeeDrawer,
  closeAddEmployeeDrawer,
  openAddHolidayDialog,
  closeAddHolidayDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
