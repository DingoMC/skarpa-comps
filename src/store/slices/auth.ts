import { UserUI } from '@/lib/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  authLevel: number;
  user: UserUI | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
  user: null,
  authLevel: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: UserUI; authLevel: number; token: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authLevel = action.payload.authLevel;
      Cookies.set('token', action.payload.token, { expires: 1 });
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.authLevel = 0;
      Cookies.remove('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
