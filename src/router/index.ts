import { createRouter, createWebHashHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/diag',
      name: 'diag',
      component: defineAsyncComponent(() => import('../diag/index.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/index',
      name: 'index',
      component: defineAsyncComponent(() => import('../index/index.vue')),
      meta: {
        requiresAuth: false,
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
