<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div class="flex items-center space-x-6">
        <div class="p-6 bg-green-100 rounded-2xl text-green-700 font-bold shadow-lg ring-4 ring-white">
          👩🏫
        </div>
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">Staff Directory</h1>
          <p class="text-gray-500 mt-2 text-lg font-medium">Manage educators and administrative personnel.</p>
        </div>
      </div>
      <button @click="showAddModal = true" 
        class="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center group">
        <span class="mr-3 group-hover:rotate-90 transition-transform">➕</span> ADD STAFF
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="member in staffStore.staff" :key="member.id" 
        class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-2xl group">
        <div class="h-32 bg-gradient-to-r from-green-500 to-primary-600 relative">
          <div class="absolute -bottom-10 left-8">
            <div class="h-20 w-20 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white">
               <div class="h-full w-full rounded-xl bg-green-100 flex items-center justify-center text-3xl">
                  {{ member.gender === 'Male' ? '👨🏻' : '👩🏼' }}
               </div>
            </div>
          </div>
        </div>
        <div class="p-8 pt-14">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-2xl font-black text-gray-900 group-hover:text-green-700 transition-colors">{{ member.fullName }}</h3>
              <p class="text-gray-400 font-bold text-sm uppercase tracking-widest">{{ member.role }}</p>
            </div>
            <span class="px-3 py-1 bg-green-50 text-green-700 text-xs font-black rounded-full border border-green-100">ACTIVE</span>
          </div>
          
          <div class="mt-8 space-y-4">
            <div class="flex items-center text-gray-600">
              <span class="w-8 text-xl">📧</span>
              <span class="font-medium truncate">{{ member.email || 'staff@school.com' }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <span class="w-8 text-xl">📚</span>
              <div class="flex flex-wrap gap-2">
  <span
    v-for="subj in member.subjects?.filter(s => s)"
    :key="subj.id"
    class="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700"
  >
    {{ subj.name }}
  </span>

  <span v-if="!member.subjects || !member.subjects.length"
    class="text-xs font-bold italic text-gray-400">
    No subjects assigned
  </span>
</div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
             <button class="text-primary-600 font-black text-sm hover:underline">VIEW PROFILE</button>
             <div class="flex space-x-2">
               <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">✏️</button>
               <button @click="deleteStaff(member.id)" class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">🗑️</button>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Staff Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="px-8 py-6 bg-green-700 text-white flex items-center justify-between">
          <h2 class="text-2xl font-black italic tracking-tight uppercase">ADD NEW STAFF</h2>
          <button @click="showAddModal = false" class="text-green-200 hover:text-white transition-colors text-2xl">✕</button>
        </div>
        
        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Date of Birth</label>
              <input v-model="form.dateOfBirth" type="date" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Gender</label>
              <select v-model="form.gender" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Role</label>
              <select v-model="form.role" required class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold">
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
                <option value="Non-teaching">Non-teaching</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Subjects (Optional)</label>
              <select v-model="form.subjectIds" multiple class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none font-bold">
                <option v-for="subj in staffStore.subjects" :key="subj.id" :value="subj.id">{{ subj.name }}</option>
              </select>
              <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">Hold Ctrl to select multiple</p>
            </div>
          </div>

          <div class="pt-6 flex space-x-4">
            <button type="button" @click="showAddModal = false" class="flex-1 py-4 font-black bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors">CANCEL</button>
            <button type="submit" class="flex-1 py-4 font-black bg-green-600 text-white rounded-2xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">SAVE STAFF MEMBER</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStaffStore } from '@/stores/staff';

const staffStore = useStaffStore();
const showAddModal = ref(false);

const form = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male',
  role: 'Teacher',
  subjectIds: []
});

onMounted(() => {
  staffStore.fetchStaff();
  staffStore.fetchSubjects();
});

const handleSave = async () => {
  try {
    await staffStore.addStaff(form.value);
    showAddModal.value = false;
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      role: 'Teacher',
      subjectIds: []
    };
    await staffStore.fetchStaff(); // Refresh list
  } catch (err) {
    alert(err);
  }
};

const deleteStaff = async (id) => {
  if (confirm('Are you sure you want to delete this staff member?')) {
    await staffStore.deleteStaff(id);
  }
};
</script>
