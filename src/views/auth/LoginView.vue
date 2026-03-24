<template>
  <div class="h-screen w-full flex items-center justify-center bg-gray-50 bg-gradient-to-br from-primary-50 to-primary-100 p-8">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
      <div class="bg-primary-900 px-8 py-10 text-center">
        <h1 class="text-4xl font-extrabold text-white tracking-tight leading-tight">SMS Admin</h1>
        <p class="text-primary-100 mt-2 text-lg font-medium opacity-90">School Management System</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="p-10 space-y-8">
        <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
          <p class="text-red-700 text-sm font-semibold flex items-center">
            <span class="mr-2">⚠️</span> {{ authStore.error }}
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="group">
            <label class="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">Email Address</label>
            <input v-model="email" type="email" required
              class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50/50 hover:bg-white"
              placeholder="admin@school.com" />
          </div>
          
          <div class="group">
            <label class="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">Password</label>
            <input v-model="password" type="password" required
              class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-gray-50/50 hover:bg-white"
              placeholder="••••••••" />
          </div>
        </div>
        
        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg">
          <span v-if="authStore.loading" class="flex items-center justify-center">
            <svg class="animate-spin h-6 w-6 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
            Signing you in...
          </span>
          <span v-else>Login securely</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const email = ref('admin@school.com');
const password = ref('Password123!');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
