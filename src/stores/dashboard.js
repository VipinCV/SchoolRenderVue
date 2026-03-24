import { defineStore } from 'pinia';
import axios from '../api/axios';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await axios.get('/dashboard/stats');
        this.stats = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch dashboard stats';
      } finally {
        this.loading = false;
      }
    }
  }
});
