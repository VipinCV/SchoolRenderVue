<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white to-primary-50">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary-800">Welcome, {{ authStore.user?.fullName }}!</h1>
        <p class="text-gray-500 mt-2 text-lg font-medium">Dashboard Overview & School Insights</p>
      </div>
      <div class="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-primary-100">
        <span class="p-3 bg-primary-100 rounded-xl text-primary-700 font-bold">Today:</span>
        <span class="text-gray-800 font-semibold px-4">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="stat in stats" :key="stat.label" 
        class="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary-500 group"
        :class="stat.border">
        <div class="flex items-center justify-between mb-6">
          <div :class="`p-5 rounded-2xl text-3xl shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform ${stat.bg}`">
            {{ stat.icon }}
          </div>
          <span class="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">+12%</span>
        </div>
        <h3 class="text-gray-500 text-sm font-bold uppercase tracking-widest">{{ stat.label }}</h3>
        <p class="text-4xl font-black text-gray-900 mt-2 tabular-nums">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Attendance Today -->
    <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-2xl font-extrabold text-gray-900 flex items-center">
          <span class="mr-3 p-2 bg-blue-100 rounded-lg text-blue-600">📊</span> Today's Attendance Summary
        </h3>
        <button class="px-6 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-colors">Details →</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 h-64">
        <!-- Progress Ring Placeholder -->
        <div class="flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div class="text-center group cursor-pointer">
            <div class="relative w-40 h-40 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="12" fill="transparent" class="text-gray-200" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="12" fill="transparent" stroke-dasharray="440" stroke-dashoffset="66" class="text-primary-600 drop-shadow-lg" />
              </svg>
              <div class="absolute text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform">85%</div>
            </div>
            <p class="mt-4 text-gray-500 font-bold uppercase text-xs tracking-widest">Student Attendance</p>
          </div>
        </div>
        <div class="flex flex-col justify-center space-y-4">
           <div v-for="item in attendanceLevels" :key="item.label" class="space-y-2">
             <div class="flex justify-between text-sm font-bold">
               <span class="text-gray-700">{{ item.label }}</span>
               <span class="text-primary-700">{{ item.value }}%</span>
             </div>
             <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
               <div :class="`h-full rounded-full transition-all duration-1000 ${item.color}`" :style="{ width: item.value + '%' }"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useDashboardStore } from '../stores/dashboard';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchStats();
});

const stats = computed(() => [
  { label: 'Total Students', value: dashboardStore.stats?.totalStudents || 0, icon: '👨‍🎓', bg: 'bg-primary-100', border: 'border-b-primary-500' },
  { label: 'Total Staff', value: dashboardStore.stats?.totalStaff || 0, icon: '👩‍🏫', bg: 'bg-green-100', border: 'border-b-green-500' },
  { label: 'Active Classes', value: dashboardStore.stats?.activeClasses || 0, icon: '🏫', bg: 'bg-purple-100', border: 'border-b-purple-500' },
  { label: 'Overall Attendance', value: (dashboardStore.stats?.overallAttendance || 0) + '%', icon: '📈', bg: 'bg-amber-100', border: 'border-b-amber-500' },
]);

const attendanceLevels = computed(() => dashboardStore.stats?.attendanceLevels || [
  { label: 'Grade 1-5', value: 0, color: 'bg-green-500 shadow-sm shadow-green-200' },
  { label: 'Grade 6-10', value: 0, color: 'bg-primary-500 shadow-sm shadow-primary-200' },
  { label: 'Grade 11-12', value: 0, color: 'bg-amber-500 shadow-sm shadow-amber-200' },
]);

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date());
});
</script>
