import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('../views/students/StudentListView.vue'),
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('../views/staff/StaffListView.vue'),
        },
        {
          path: 'timetable',
          name: 'timetable',
          component: () => import('../views/timetable/TimetableView.vue'),
        },
        {
          path: 'attendance',
          name: 'attendance',
          component: () => import('../views/attendance/AttendanceView.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
