import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage (if available)
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const tokenFromStorage = localStorage.getItem('token') || null;

const initialState = {
  isAuthenticated: !!userFromStorage && !!tokenFromStorage,
  user: userFromStorage,
  token: tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },

    loginAsHR(state) {
      const user = { role: 'hr', email: 'hr@example.com' };
      const token = 'demo-hr-token'; // Optional: fake token

      state.isAuthenticated = true;
      state.user = user;
      state.token = token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    setRole(state, action) {
      if (state.user) {
        state.user.role = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user)); // keep it updated
      }
    }
  },
});

export const { loginSuccess, loginAsHR, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
