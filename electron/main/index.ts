import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { topMenu } from './top_menu';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

if (release().startsWith('6.1')) app.disableHardwareAcceleration();

if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
const map = new Map();
function extracted(name, rootPath, isMac: boolean, path) {
  let browserWindow = new BrowserWindow({
    // parent: win,
    modal: false,
    show: false,
    width: 600,
    height: 300,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    browserWindow.loadURL(rootPath + '#' + path);
  } else {
    browserWindow.loadFile(rootPath, { hash: path });
  }

  browserWindow.on('closed', () => {
    console.log('关闭弹窗');
  });

  let m = Menu.buildFromTemplate([
    ...(isMac
      ? [
          {
            label: app.name,
          },
        ]
      : []),
  ]);
  browserWindow.webContents.openDevTools({ mode: 'detach' });
  browserWindow.setMenu(m);
  browserWindow.show();
  map.set(name, browserWindow);
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const isMac: boolean = process.platform === 'darwin' || false;
  let rootPath;
  let isDev: boolean;

  if (process.env.VITE_DEV_SERVER_URL) {
    console.log(`${url}`);
    rootPath = `${url}`;
    isDev = true;
    win.loadURL(rootPath);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    rootPath = indexHtml;
    isDev = true;
    win.loadFile(indexHtml);
  }
  let m = Menu.buildFromTemplate([
    ...(isMac
      ? [
          {
            label: app.name,
          },
        ]
      : []),
    {
      label: '文件',
      submenu: [
        { label: '保存工作空间' },
        {
          label: '导出',
          submenu: [{ label: '导出 SHP' }, { label: '导出 GeoJson' }, { label: '导出 KML' }, { label: '导出 XML' }],
        },
        {
          label: '导入',
          submenu: [
            {
              label: '导入 CSV',

              click: () => {
                extracted('/gen_csv', rootPath, isMac, '/gen_csv');
              },
            },
            { label: '导入 EXCEL' },
            { label: '导入 GeoJson' },
            { label: '导入 WMS\\WMTS' },
          ],
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '开始编辑' },
        { label: '保存编辑' },
        { label: '停止编辑' },
        { label: '查看属性表' },
        { label: '捕捉配置' },
        { label: '裁切' },
        { label: '拷贝' },
        { label: '删除' },
        { label: '撤回' },
        { label: '平移地图' },
        { label: '放大地图' },
        { label: '缩小地图' },
        { label: '居中地图' },
      ],
    },
    {
      label: '样式表',
      submenu: [{ label: '点样式' }, { label: '线样式' }, { label: '面样式' }],
    },
    {
      label: '分析',
      submenu: [
        {
          label: '缓冲分析',
        },
        {
          label: '孤立点分析',
        },
        {
          label: '连通性分析',
        },
        {
          label: '叠加分析',
        },
      ],
    },
    {
      label: '底图',
      submenu: [
        {
          label: '天地图',
          submenu: [
            { label: '秘钥配置' },

            {
              label: '天地图矢量（经纬度投影）',
              submenu: [
                {
                  label: '矢量底图',
                },
                {
                  label: '矢量标注',
                },
              ],
            },
            {
              label: '天地图矢量（球面墨卡托投影）',
              submenu: [
                {
                  label: '矢量底图',
                },
                {
                  label: '矢量标注',
                },
              ],
            },
            {
              label: '天地图影像（经纬度投影）',
              submenu: [
                {
                  label: '影像底图',
                },
                {
                  label: '影像标注',
                },
              ],
            },
            {
              label: '天地图影像（球面墨卡托投影）',
              submenu: [
                {
                  label: '影像底图',
                },
                {
                  label: '影像标注',
                },
              ],
            },
          ],
        },
        {
          label: '高德地图',
          submenu: [
            { label: '秘钥配置' },
            { label: '标标准图层' },
            { label: '实时路况图层' },
            { label: '卫星图' },
            { label: '卫星和路网' },
          ],
        },
        {
          label: '百度地图',
          submenu: [{ label: '秘钥配置' }, { label: '标准地图' }, { label: '卫星地图' }],
        },
      ],
    },
    {
      label: '工具',
      submenu: [
        {
          label: '定位',
          click: () => {
            extracted('map_to_xy', rootPath, isMac, '/map_to_xy');
          },
        },
        { label: '地理编码' },
        { label: '逆地理编码' },
        { label: '坐标转换' },
      ],
    },
    {
      label: '查询',
      submenu: [
        {
          label: '高德POI',
          click: () => {
            extracted('高德poi', rootPath, isMac, '/poi?type=gaode');
          },
        },
      ],
    },
    {
      label: '数据库配置',
      submenu: [{ label: 'MySQL' }, { label: 'PostGIS' }],
    },
    { label: '发布', submenu: [{ label: '发布GeoServer' }] },
    {
      label: '调试',
      submenu: [
        {
          label: '弹框测试',
          click: () => {
            extracted('测试', rootPath, isMac, '/config?type=tdt');
          },
        },
        {
          label: '控制台',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
          type: 'checkbox',
          checked: false,
          click: (e) => {
            // todo: 控制选中状态
            // e.checked = !!e.checked;
            console.log('控制台点击');
          },
        },
        {
          type: 'separator',
        },
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(m);

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 渲染进程通知主进程
ipcMain.on('message', (event, message) => {
  console.log(message);
});
ipcMain.on('close-sub-window', (event, message) => {
  console.log(message);
  // 接收消息
  map.get(message.name).close();
  win.webContents.send('map_to_xy', message.data);
});

ipcMain.on('map-config', (event, message) => {
  win.webContents.send('map-config', message);
});

ipcMain.on('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    width: 300,
    height: 600,
    parent: win,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('openDialog', (event) => {
  dialog.showOpenDialog({}).then((result) => {
    console.log(result);
    win.webContents.send('file-select', result.filePaths[0]);
  });
});

ipcMain.on('open-select-csv', (event, args) => {
  dialog
    .showOpenDialog({
      filters: [{ name: 'csv file', extensions: ['csv'] }],
    })
    .then((result) => {
      console.log(result);
      map.get('/gen_csv').webContents.send('open-select-csv-success', result.filePaths[0]);
    });
});
ipcMain.on('open-link-select-csv', (event, args) => {
  dialog
    .showOpenDialog({
      filters: [{ name: 'csv file', extensions: ['csv'] }],
    })
    .then((result) => {
      console.log(result);
      map.get('/gen_csv').webContents.send('open-link-select-csv-success', result.filePaths[0]);
    });
});
