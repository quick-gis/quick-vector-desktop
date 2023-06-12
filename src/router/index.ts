import { createRouter, createWebHashHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      redirect: '/layer',
    },
    {
      path: '/config',
      name: 'config',
      component: defineAsyncComponent(() => import('../config/config.vue')),
      meta: {
        requiresAuth: false,
      },
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
      path: '/layer',
      name: 'layer',
      component: defineAsyncComponent(() => import('../layer/Layer.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/selector_file',
      name: 'selector_file',
      component: defineAsyncComponent(() => import('../selector/SelectorFile.vue')),
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
    {
      path: '/gen_csv',
      name: 'csv成图',
      component: defineAsyncComponent(() => import('../gen/genCsv.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/poi',
      name: 'poi',
      component: defineAsyncComponent(() => import('../poi/Poi.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/map_to_xy',
      name: 'map_to_xy',
      component: defineAsyncComponent(() => import('../layer/MapToXY.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/attr_table',
      name: 'attr_table',
      component: defineAsyncComponent(() => import('../attr/AttrTable.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/importShape',
      name: 'importShape',
      component: defineAsyncComponent(() => import('../gen/ImportShape.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/buffer',
      name: 'buffer',
      component: defineAsyncComponent(() => import('../buffer/Buffer.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/buff_lay',
      name: 'buff_lay',
      component: defineAsyncComponent(() => import('../buffer/BufferLayerConf.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/importGeoJson',
      name: 'importGeoJson',
      component: defineAsyncComponent(() => import('../gen/ImportGeoJson.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/exportGeoJson',
      name: 'exportGeoJson',
      component: defineAsyncComponent(() => import('../exp/ExportFileSelect.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/line_ring',
      name: 'line_ring',
      component: defineAsyncComponent(() => import('../analysis/LineAnalysis/LineRing.vue')),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/line_self_Overlaps',
      name: 'line_self_Overlaps',
      component: defineAsyncComponent(() => import('../analysis/LineAnalysis/LineSelfOverlaps.vue')),
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
