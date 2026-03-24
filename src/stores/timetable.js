import { defineStore } from 'pinia';
import axios from '../api/axios';

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    timetable: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTimetable(classId, sectionId) {
      if (!classId || !sectionId) return;
      this.loading = true;
      try {
        const response = await axios.get(`/timetable/class/${classId}/${sectionId}`);
        this.timetable = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch timetable';
      } finally {
        this.loading = false;
      }
    },
    async addTimetableEntry(entryData) {
      try {
        const response = await axios.post('/timetable', entryData);
        this.timetable.push(response.data);
      } catch (err) {
        throw err.response?.data?.detailed || err.response?.data?.message || 'Failed to add entry';
      }
    },
    async deleteTimetableEntry(id) {
      try {
        await axios.delete(`/timetable/${id}`);
        this.timetable = this.timetable.filter(t => t.id !== id);
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete entry';
      }
    }
  }
});
