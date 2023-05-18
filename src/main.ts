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
import { createPinia } from 'pinia';
CreateRootPath();

function aa() {}

aa();
const pinia = createPinia();
createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
