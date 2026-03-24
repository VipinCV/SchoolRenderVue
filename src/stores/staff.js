import { defineStore } from 'pinia';
import axios from '../api/axios';

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staff: [],
    subjects: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStaff() {
      this.loading = true;
      try {
        const response = await axios.get('/staff');
        this.staff = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch staff';
      } finally {
        this.loading = false;
      }
    },
    async fetchSubjects() {
      try {
        const response = await axios.get('/subjects');
        this.subjects = response.data;
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    },
    async addStaff(staffData) {
      try {
        const response = await axios.post('/staff', staffData);
        this.staff.push(response.data);
      } catch (err) {
        throw err.response?.data?.message || 'Failed to add staff';
      }
    },
    async deleteStaff(id) {
      try {
        await axios.delete(`/staff/${id}`);
        this.staff = this.staff.filter(s => s.id !== id);
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete staff';
      }
    }
  }
});
