import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { topMenu } from './top_menu';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

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
            { label: '导入 CSV' },
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
      submenu: [{ label: '定位' }, { label: '地理编码' }, { label: '逆地理编码' }, { label: '坐标转换' }],
    },
    { label: '查询', submenu: [] },
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
            //  这个位置有办法自定义弹框么，如果要做自定义弹框
            console.log('开始');
            console.log(rootPath);

            let browserWindow = new BrowserWindow({
              parent: win,
              modal: false,
              show: false,
              webPreferences: {
                preload,
                nodeIntegration: true,
                contextIsolation: false,
              },
            });

            if (process.env.VITE_DEV_SERVER_URL) {
              browserWindow.loadURL(rootPath + '#/config?type=tdt');
              browserWindow.webContents.openDevTools();
            } else {
              browserWindow.loadFile(rootPath, { hash: '/config?type=tdt' });
            }

            browserWindow.on('closed', () => {
              console.log('关闭弹窗');
            });

            browserWindow.show();
          },
        },
        {
          label: '控制台',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
          click: () => {
            console.log('控制台点击');
            win.webContents.openDevTools();
          },
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
