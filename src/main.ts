import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './samples/node-api';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { CreateRootPath, LogPath, ReadDiTuConfig } from './utils/FileUtils';
import { GetLog } from './utils/LogUtils';
import { BaiDuConfigImpl, DiTuConfig, TianDiTuConfigImpl } from './config/mapConfig';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import { createPinia } from 'pinia';
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
CreateRootPath();

function aa() {}

aa();

const app = createApp(App);

app.use(createPinia());
app
  .use(router)
  .use(ElementPlus)
  .use(Vue3DraggableResizable)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
