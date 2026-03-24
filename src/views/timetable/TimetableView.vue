<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div class="flex items-center space-x-6">
        <div class="p-6 bg-purple-100 rounded-2xl text-purple-700 font-bold shadow-lg ring-4 ring-white">
          📅
        </div>
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">Class Timetable</h1>
          <p class="text-gray-500 mt-2 text-lg font-medium">Weekly schedule and teacher allocation.</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <select v-model="selectedClass" class="px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none bg-white font-bold text-gray-700 shadow-sm">
          <option v-for="c in studentStore.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select v-model="selectedSection" class="px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none bg-white font-bold text-gray-700 shadow-sm">
          <option value="">SELECT SECTION</option>
          <option v-for="s in availableSections" :key="s.id" :value="s.id">Section {{ s.name }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-6 gap-6">
      <!-- Time Column -->
      <div class="space-y-4">
        <div class="h-16 flex items-center justify-center font-black text-xs text-gray-400 tracking-widest uppercase">Time</div>
        <div v-for="slot in timeSlots" :key="slot.start" 
          class="h-32 bg-white rounded-2xl shadow-md flex items-center justify-center font-bold text-gray-500 border border-gray-100 text-center text-xs">
          {{ slot.label }}
        </div>
      </div>

      <!-- Days Columns -->
      <div v-for="day in days" :key="day" class="space-y-4">
        <div class="h-16 flex items-center justify-center font-black text-sm text-gray-900 tracking-wide uppercase bg-primary-900 text-white rounded-2xl shadow-lg ring-4 ring-primary-100">
          {{ day.substring(0, 3) }}
        </div>
        <div v-for="(slot, index) in timeSlots" :key="slot.start" 
          @click="!getSchedule(day, slot) && openAddModal(day, slot)"
          class="h-32 bg-white rounded-3xl p-4 shadow-xl border border-gray-100 group hover:border-primary-500 transition-all cursor-pointer relative overflow-hidden group">
          <div v-if="getSchedule(day, slot)" 
            class="h-full w-full rounded-2xl p-4 flex flex-col justify-between transition-all"
            :class="getEntryColor(index)">
            <div>
              <div class="flex items-start justify-between">
                <p class="text-[10px] font-black uppercase tracking-tight opacity-75">{{ getSchedule(day, slot).subjectCode }}</p>
                <button @click.stop="handleDelete(getSchedule(day, slot).id)" class="text-white hover:text-red-200 transition-colors">🗑️</button>
              </div>
              <h4 class="text-sm font-black leading-tight">{{ getSchedule(day, slot).subjectName }}</h4>
            </div>
            <p class="text-[10px] font-bold opacity-80">{{ getSchedule(day, slot).teacherName }}</p>
          </div>
          <div v-else class="h-full w-full flex items-center justify-center text-gray-200 transition-colors group-hover:text-primary-100">
            <span class="text-2xl opacity-50 group-hover:opacity-100">➕</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Timetable Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="px-8 py-6 bg-purple-700 text-white flex items-center justify-between">
          <h2 class="text-2xl font-black italic tracking-tight uppercase">ADD SCHEDULE ENTRY</h2>
          <button @click="showAddModal = false" class="text-purple-200 hover:text-white transition-colors text-2xl">✕</button>
        </div>
        
        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Subject</label>
              <select v-model="form.subjectId" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none font-bold">
                <option v-for="subj in staffStore.subjects" :key="subj.id" :value="subj.id">{{ subj.name }} ({{ subj.code }})</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Teacher</label>
              <select v-model="form.teacherId" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none font-bold">
                <option v-for="teacher in staffStore.staff.filter(s => s.role === 'Teacher')" :key="teacher.id" :value="teacher.id">{{ teacher.fullName }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Start Time</label>
                <input v-model="form.startTime" type="text" readonly class="w-full px-4 py-3 bg-gray-100 border-2 border-gray-100 rounded-xl font-bold text-gray-500 cursor-not-allowed" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest">End Time</label>
                <input v-model="form.endTime" type="text" readonly class="w-full px-4 py-3 bg-gray-100 border-2 border-gray-100 rounded-xl font-bold text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div class="pt-6 flex space-x-4">
             <button type="button" @click="showAddModal = false" class="flex-1 py-4 font-black bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors uppercase">Cancel</button>
             <button type="submit" class="flex-1 py-4 font-black bg-purple-600 text-white rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all active:scale-95 uppercase">Add Subject</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useTimetableStore } from '@/stores/timetable';
import { useStudentStore } from '@/stores/student';
import { useStaffStore } from '@/stores/staff';

const timetableStore = useTimetableStore();
const studentStore = useStudentStore();
const staffStore = useStaffStore();

const selectedClass = ref(null);
const selectedSection = ref(null);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  { start: '08:00:00', end: '09:00:00', label: '08:00 - 09:00' },
  { start: '09:00:00', end: '10:00:00', label: '09:00 - 10:00' },
  { start: '10:00:00', end: '11:00:00', label: '10:00 - 11:00' },
  { start: '11:00:00', end: '12:00:00', label: '11:00 - 12:00' },
  { start: '12:00:00', end: '13:00:00', label: '12:00 - 13:00' },
];

const availableSections = computed(() => {
  if (!selectedClass.value) return [];
  return studentStore.sections.filter(sec => sec.classId === selectedClass.value);
});

onMounted(async () => {
  await Promise.all([
    studentStore.fetchMetadata(),
    staffStore.fetchStaff()
  ]);
  
  if (studentStore.classes.length > 0) {
    selectedClass.value = studentStore.classes[0].id;
  }
  if (studentStore.sections.length > 0) {
    selectedSection.value = studentStore.sections[0].id;
  }
});

watch([selectedClass, selectedSection], ([newClass, newSection]) => {
  if (newClass && newSection) {
    timetableStore.fetchTimetable(newClass, newSection);
  }
});

const dayMap = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5
};

const getSchedule = (day, slot) => {
  const dayNum = dayMap[day];
  return timetableStore.timetable.find(t => 
    t.day === dayNum && 
    t.startTime === slot.start
  );
};

const colors = [
  'bg-blue-600 text-white shadow-blue-200',
  'bg-green-600 text-white shadow-green-200',
  'bg-amber-500 text-white shadow-amber-200',
  'bg-purple-600 text-white shadow-purple-200',
  'bg-rose-600 text-white shadow-rose-200'
];

const getEntryColor = (index) => colors[index % colors.length];

const showAddModal = ref(false);
const form = ref({
  classId: null,
  sectionId: null,
  subjectId: null,
  teacherId: null,
  day: 1,
  startTime: '',
  endTime: ''
});

const openAddModal = (day, slot) => {
  form.value = {
    classId: selectedClass.value,
    sectionId: selectedSection.value,
    subjectId: null,
    teacherId: null,
    day: dayMap[day],
    startTime: slot.start,
    endTime: slot.end
  };
  showAddModal.value = true;
};

const handleSave = async () => {
  try {
    await timetableStore.addTimetableEntry(form.value);
    showAddModal.value = false;
    await timetableStore.fetchTimetable(selectedClass.value, selectedSection.value);
  } catch (err) {
    alert(err);
  }
};

const handleDelete = async (id) => {
  if (confirm('Delete this entry?')) {
    try {
      await timetableStore.deleteTimetableEntry(id);
    } catch (err) {
      alert(err);
    }
  }
};
</script>
