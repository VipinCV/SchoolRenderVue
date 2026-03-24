import { defineStore } from 'pinia';
import axios from '../api/axios';

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [],
    classes: [],
    sections: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStudents(page = 1, filter = '') {
      this.loading = true;
      try {
        const response = await axios.get('/students', {
          params: { page, pageSize: this.pageSize, filter }
        });
        this.students = response.data.items;
        this.totalCount = response.data.totalCount;
        this.currentPage = response.data.currentPage;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch students';
      } finally {
        this.loading = false;
      }
    },
    async fetchMetadata() {
      try {
        const [classesRes, sectionsRes] = await Promise.all([
          axios.get('/school/classes'),
          axios.get('/school/sections')
        ]);
        this.classes = classesRes.data;
        this.sections = sectionsRes.data;
      } catch (err) {
        console.error('Failed to fetch metadata', err);
      }
    },
    async addStudent(studentData) {
      try {
        const response = await axios.post('/students', studentData);
        this.students.push(response.data);
        return response.data;
      } catch (err) {
        throw err.response?.data?.message || 'Failed to add student';
      }
    },
    async deleteStudent(id) {
      try {
        await axios.delete(`/students/${id}`);
        this.students = this.students.filter(s => s.id !== id);
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete student';
      }
    }
  }
});
