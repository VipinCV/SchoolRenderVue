<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div class="flex items-center space-x-6">
        <div class="p-6 bg-primary-100 rounded-2xl text-primary-700 font-bold shadow-lg ring-4 ring-white">
          👨🎓
        </div>
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">Student Directory</h1>
          <p class="text-gray-500 mt-2 text-lg font-medium">Manage and track student records effortlessly.</p>
        </div>
      </div>
      <button @click="showAddModal = true" 
        class="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center group">
        <span class="mr-3 group-hover:rotate-90 transition-transform">➕</span> NEW STUDENT
      </button>
    </div>

    <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div class="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50">
        <div class="relative w-full md:w-96 group">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-primary-500 transition-colors">🔍</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name or ID..." 
            class="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all shadow-sm" />
        </div>
        <div class="flex items-center space-x-4">
          <select v-model="filterClass" class="px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none bg-white font-bold text-gray-700 shadow-sm cursor-pointer hover:border-primary-300 uppercase">
            <option value="">ALL CLASSES</option>
            <option v-for="c in studentStore.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <button class="p-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-primary-300 transition-all font-bold shadow-sm">
            🖨️ Export
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-primary-900 text-white uppercase text-xs tracking-[0.2em] font-black">
              <th class="px-8 py-6 text-left">ID</th>
              <th class="px-8 py-6 text-left">Full Name</th>
              <th class="px-8 py-6 text-left">Grade & Section</th>
              <th class="px-8 py-6 text-left">Guardian</th>
              <th class="px-8 py-6 text-left">Attendance (MTD)</th>
              <th class="px-8 py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 italic transition-all duration-300">
            <tr v-for="student in filteredStudents" :key="student.id" 
              class="hover:bg-primary-50/80 transition-all cursor-pointer group not-italic">
              <td class="px-8 py-6 font-bold text-gray-900 group-hover:text-primary-700">#{{ student.id }}</td>
              <td class="px-8 py-6">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-black mr-4 shadow-sm group-hover:scale-110 transition-transform">
                    {{ student.fullName[0] }}
                  </div>
                  <span class="font-bold text-gray-900 group-hover:text-primary-700">{{ student.fullName }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-black text-gray-700 border-b-2 border-gray-200 group-hover:border-primary-500 transition-colors">
                  {{ student.className }} - {{ student.sectionName }}
                </span>
              </td>
              <td class="px-8 py-6 text-gray-600 font-medium">{{ student.guardianName }}</td>
              <td class="px-8 py-6">
                <div class="flex items-center space-x-3">
                  <div class="w-20 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full" style="width: 85%"></div>
                  </div>
                  <span class="text-xs font-black text-green-700">85%</span>
                </div>
              </td>
              <td class="px-8 py-6 text-center">
                <div class="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <button class="p-3 bg-white border border-gray-200 rounded-xl hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 transition-all font-bold shadow-sm">✏️</button>
                  <button @click="deleteStudent(student.id)" class="p-3 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all font-bold shadow-sm">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-gray-500 font-bold text-sm uppercase">Showing <span class="text-gray-900">{{ startIndex }} - {{ endIndex }}</span> of {{ studentStore.totalCount }} students</p>
        <div class="flex space-x-2">
          <button @click="changePage(studentStore.currentPage - 1)" :disabled="studentStore.currentPage === 1" 
            class="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <button @click="changePage(studentStore.currentPage + 1)" :disabled="studentStore.currentPage === totalPages"
            class="px-6 py-3 bg-primary-900 text-white rounded-xl text-sm font-bold shadow-sm ring-4 ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="px-8 py-6 bg-primary-900 text-white flex items-center justify-between">
          <h2 class="text-2xl font-black italic tracking-tight">ADD NEW STUDENT</h2>
          <button @click="showAddModal = false" class="text-primary-300 hover:text-white transition-colors text-2xl">✕</button>
        </div>
        
        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Date of Birth</label>
              <input v-model="form.dateOfBirth" type="date" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Gender</label>
              <select v-model="form.gender" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Grade</label>
              <select v-model="form.classId" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold">
                <option v-for="c in studentStore.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Section</label>
              <select v-model="form.sectionId" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold">
                <option value="">SELECT SECTION</option>
                <option v-for="s in availableSections" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Guardian Name</label>
              <input v-model="form.guardianName" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Guardian Phone</label>
              <input v-model="form.guardianPhone" type="tel" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary-500 outline-none font-bold" />
            </div>
          </div>

          <div class="pt-6 flex space-x-4">
            <button type="button" @click="showAddModal = false" class="flex-1 py-4 font-black bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors">CANCEL</button>
            <button type="submit" class="flex-1 py-4 font-black bg-primary-600 text-white rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95">SAVE STUDENT</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue';
import { useStudentStore } from '@/stores/student';


const studentStore = useStudentStore();
const searchQuery = ref('');
const filterClass = ref('');
const showAddModal = ref(false);

const form = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male',
  guardianName: '',
  guardianPhone: '',
  classId: null,
  sectionId: null
});

onMounted(() => {
  studentStore.fetchStudents();
  studentStore.fetchMetadata();
});

const getInitial = (name) => name ? name[0] : '?';

const handleSave = async () => {
  try {
    await studentStore.addStudent(form.value);
    showAddModal.value = false;
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      guardianName: '',
      guardianPhone: '',
      classId: null,
      sectionId: null
    };
    await studentStore.fetchStudents(); // Refresh list
  } catch (err) {
    alert(err);
  }
};

const deleteStudent = async (id) => {
  if (confirm('Are you sure you want to delete this student?')) {
    await studentStore.deleteStudent(id);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= studentStore.totalPages) {
    studentStore.fetchStudents(page, searchQuery.value);
  }
};

watch(searchQuery, (newVal) => {
  studentStore.fetchStudents(1, newVal);
});

const filteredStudents = computed(() => studentStore.students);

const availableSections = computed(() => {
  if (!form.value.classId) return [];
  return studentStore.sections.filter(sec => sec.classId === form.value.classId);
});

const startIndex = computed(() => (studentStore.currentPage - 1) * studentStore.pageSize + 1);
const endIndex = computed(() => Math.min(studentStore.currentPage * studentStore.pageSize, studentStore.totalCount));
const totalPages = computed(() => Math.ceil(studentStore.totalCount / studentStore.pageSize));
</script>
