import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: true, // Assume logged in for demo
  user: { role: 'viewer' }, // Default to viewer
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action) {
      state.user = { role: action.payload };
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;
