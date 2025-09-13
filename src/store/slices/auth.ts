import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { User } from '../../../generated/prisma';

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      Cookies.set('token', action.payload.token, { expires: 7 });
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
