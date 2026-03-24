import { defineStore } from 'pinia';
import axios from '../api/axios';

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendanceRecords: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchClassAttendance(classId, sectionId, date) {
      this.loading = true;
      try {
        const response = await axios.get(`/attendance/class/${classId}/${sectionId}`, { params: { date } });
        this.attendanceRecords = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch attendance';
      } finally {
        this.loading = false;
      }
    },
    async fetchStaffAttendance(date) {
      this.loading = true;
      try {
        const response = await axios.get('/attendance/staff', { params: { date } });
        this.attendanceRecords = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch attendance';
      } finally {
        this.loading = false;
      }
    },
    async markAttendance(attendanceData) {
      try {
        await axios.post('/attendance/mark', attendanceData);
      } catch (err) {
        throw err.response?.data?.message || 'Failed to mark attendance';
      }
    }
  }
});
