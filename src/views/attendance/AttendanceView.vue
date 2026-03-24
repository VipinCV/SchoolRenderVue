<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div class="flex items-center space-x-6">
        <div class="p-6 bg-amber-100 rounded-2xl text-amber-700 font-bold shadow-lg ring-4 ring-white">
          📝
        </div>
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">Attendance Ledger</h1>
          <p class="text-gray-500 mt-2 text-lg font-medium">Log daily presence for students and staff.</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="px-6 py-4 bg-white border-2 border-amber-200 rounded-xl font-bold text-amber-800 shadow-sm flex items-center">
          <input type="date" v-model="selectedDate" class="bg-transparent outline-none cursor-pointer" />
        </div>
        <button @click="saveAttendance" class="bg-amber-600 hover:bg-amber-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center group">
          <span class="mr-3">✅</span> SAVE CHANGES
        </button>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row overflow-hidden">
       <!-- Left: Filters & Summaries -->
       <div class="w-full md:w-80 bg-gray-50/50 p-8 border-r border-gray-100 flex flex-col space-y-8">
          <div>
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Group</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="group = 'student'" :class="group === 'student' ? 'bg-primary-900 text-white' : 'bg-white text-gray-600'" 
                 class="py-3 px-4 rounded-xl font-bold transition-all shadow-sm border border-gray-100">Students</button>
              <button @click="group = 'staff'" :class="group === 'staff' ? 'bg-primary-900 text-white' : 'bg-white text-gray-600'" 
                 class="py-3 px-4 rounded-xl font-bold transition-all shadow-sm border border-gray-100">Staff</button>
            </div>
          </div>
          
          <div v-if="group === 'student'">
            <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Class & Section</label>
            <select v-model="selectedClass" class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-primary-300 transition-colors bg-white mb-2">
               <option v-for="c in studentStore.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <select v-model="selectedSection" class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-primary-300 transition-colors bg-white">
               <option value="">SELECT SECTION</option>
               <option v-for="s in availableSections" :key="s.id" :value="s.id">Section {{ s.name }}</option>
            </select>
          </div>

          <div class="mt-auto space-y-4">
            <div class="p-6 bg-green-50 rounded-2xl border border-green-100 group hover:shadow-lg transition-all cursor-pointer">
              <h4 class="text-xs font-black text-green-700 uppercase tracking-widest">Present</h4>
              <p class="text-3xl font-black text-gray-900 mt-2">{{ countPresent }}</p>
            </div>
            <div class="p-6 bg-red-50 rounded-2xl border border-red-100 group hover:shadow-lg transition-all cursor-pointer">
              <h4 class="text-xs font-black text-red-700 uppercase tracking-widest">Absent</h4>
              <p class="text-3xl font-black text-gray-900 mt-2">{{ countAbsent }}</p>
            </div>
          </div>
       </div>

       <!-- Right: List -->
       <div class="flex-1 p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-black text-gray-900">Attendance List</h2>
            <div class="space-x-2">
              <button @click="markAll('Present')" class="px-4 py-2 text-xs font-black text-green-700 uppercase tracking-widest hover:bg-green-50 rounded-lg transition-colors">Mark all Present</button>
              <button @click="markAll('Absent')" class="px-4 py-2 text-xs font-black text-red-700 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors">Mark all Absent</button>
            </div>
          </div>

          <div class="space-y-3">
             <div v-for="person in visibleList" :key="person.id" 
               class="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:bg-primary-50/50 hover:border-primary-200 group">
               <div class="flex items-center space-x-6">
                 <div class="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform">
                   {{ person.fullName[0] }}
                 </div>
                 <div>
                   <h5 class="text-lg font-black text-gray-900">{{ person.fullName }}</h5>
                   <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ group === 'student' ? 'ID: STU' + person.id : person.role }}</p>
                 </div>
               </div>
               
               <div class="flex items-center space-x-2 mt-4 sm:mt-0">
                  <button v-for="status in ['Present', 'Absent', 'Late']" :key="status" 
                    @click="setRecord(person.id, status)"
                    :class="[
                      records[person.id] === status ? getColor(status) : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                    ]"
                    class="flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                    {{ status }}
                  </button>
               </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStudentStore } from '@/stores/student';
import { useStaffStore } from '@/stores/staff';
import { useAttendanceStore } from '@/stores/attendance';

const studentStore = useStudentStore();
const staffStore = useStaffStore();
const attendanceStore = useAttendanceStore();

const group = ref('student');
const selectedClass = ref(null);
const selectedSection = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const records = ref({}); // { id: status }
const remarks = ref({}); // { id: remark }

const availableSections = computed(() => {
  if (!selectedClass.value) return [];
  return studentStore.sections.filter(sec => sec.classId === selectedClass.value);
});

onMounted(async () => {
  await Promise.all([
    studentStore.fetchMetadata(),
    staffStore.fetchStaff(),
    studentStore.fetchStudents()
  ]);
  
  if (studentStore.classes.length > 0) {
    selectedClass.value = studentStore.classes[0].id;
  }
  if (studentStore.sections.length > 0) {
    selectedSection.value = studentStore.sections[0].id;
  }
  
  loadExistingAttendance();
});

const loadExistingAttendance = async () => {
  if (group.value === 'student' && selectedClass.value && selectedSection.value) {
    await attendanceStore.fetchClassAttendance(selectedClass.value, selectedSection.value, selectedDate.value);
  } else if (group.value === 'staff') {
    await attendanceStore.fetchStaffAttendance(selectedDate.value);
  }
  
  // Initialize records from store
  records.value = {};
  attendanceStore.attendanceRecords.forEach(r => {
    const id = group.value === 'student' ? r.studentId : r.staffId;
    records.value[id] = r.status;
  });
};

watch([group, selectedClass, selectedSection, selectedDate], () => {
  loadExistingAttendance();
});

const visibleList = computed(() => {
  if (group.value === 'student') {
    return studentStore.students.filter(s => 
      s.classId === selectedClass.value && s.sectionId === selectedSection.value
    );
  }
  return staffStore.staff;
});

const countPresent = computed(() => Object.values(records.value).filter(v => v === 'Present').length);
const countAbsent = computed(() => Object.values(records.value).filter(v => v === 'Absent').length);

const getColor = (status) => {
  if (status === 'Present') return 'bg-green-600 text-white shadow-lg shadow-green-200 ring-4 ring-green-50';
  if (status === 'Absent') return 'bg-red-600 text-white shadow-lg shadow-red-200 ring-4 ring-red-50';
  return 'bg-amber-500 text-white shadow-lg shadow-amber-200 ring-4 ring-amber-50';
};

const setRecord = (id, status) => {
  records.value[id] = status;
};

const markAll = (status) => {
  visibleList.value.forEach(p => records.value[p.id] = status);
};

const saveAttendance = async () => {
  const data = visibleList.value.map(p => ({
    studentId: group.value === 'student' ? p.id : null,
    staffId: group.value === 'staff' ? p.id : null,
    status: records.value[p.id] || 'NA',
    date: selectedDate.value,
    remarks: remarks.value[p.id] || ''
  })).filter(r => r.status !== 'NA');

  if (data.length === 0) {
    alert("No records to save.");
    return;
  }

  try {
    await attendanceStore.markAttendance(data);
    alert('Attendance saved successfully!');
  } catch (err) {
    alert(err);
  }
};
</script>
