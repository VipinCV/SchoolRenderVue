import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'Admin',
    isTeacher: (state) => state.user?.role === 'Teacher',
  },
  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken, ...user } = response.data;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.error = null;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.clear();
    },
  },
});
