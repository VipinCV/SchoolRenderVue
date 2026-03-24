<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary-900 text-white flex-shrink-0 transition-all duration-300">
      <div class="p-6">
        <h1 class="text-2xl font-bold tracking-tight">SMS Admin</h1>
      </div>
      <nav class="mt-6">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="flex items-center px-6 py-4 transition-colors duration-200 hover:bg-primary-800"
          :class="{ 'bg-primary-700': $route.path === item.path }">
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.name }}
        </router-link>
        <button @click="handleLogout"
          class="w-full flex items-center px-6 py-4 mt-auto hover:bg-primary-800 text-left transition-colors duration-200">
          <span class="mr-3">🔓</span> Logout
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white shadow h-16 flex items-center justify-between px-8">
        <h2 class="text-xl font-semibold text-gray-800 uppercase">{{ $route.name }}</h2>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 font-medium">{{ authStore.user?.fullName }}</span>
          <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-200">
            {{ userInitials }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const navItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Students', path: '/students', icon: '👨🎓' },
  { name: 'Staff', path: '/staff', icon: '👩🏫' },
  { name: 'Timetable', path: '/timetable', icon: '📅' },
  { name: 'Attendance', path: '/attendance', icon: '📝' },
];

const userInitials = computed(() => {
  if (!authStore.user?.fullName) return 'U';
  return authStore.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
