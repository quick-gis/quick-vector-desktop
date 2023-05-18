import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './samples/node-api';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { CreateRootPath, LogPath } from './utils/FileUtils';
import { GetLog } from './utils/LogUtils';

CreateRootPath();
GetLog().info('akljlksjlkjl');
GetLog().error('异常测试');
createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
