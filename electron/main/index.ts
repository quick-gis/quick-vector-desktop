import { app, BrowserWindow, dialog, ipcMain, Menu, shell, globalShortcut } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

if (release().startsWith('6.1')) app.disableHardwareAcceleration();

if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

global.sharedObject = { checkTest: false };

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
  return browserWindow;
}
let rootPath;
const isMac: boolean = process.platform === 'darwin' || false;
let m: Electron.Menu;
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
  m = Menu.buildFromTemplate([
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
          label: '导入',
          submenu: [
            {
              label: '导入 CSV',

              click: () => {
                extracted('/gen_csv', rootPath, isMac, '/gen_csv');
              },
            },

            {
              label: '导入 SHP',

              click: () => {
                extracted('/importShape', rootPath, isMac, '/importShape');
              },
            },
          ],
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        {
          id: '开启属性查看模式',
          label: '开启属性查看模式',
          type: 'checkbox',
          checked: false,
          click: (menuItem, browserWindow, event) => {
            // 关闭坐标拾取模式
            m.getMenuItemById('坐标拾取').checked = false;
            win.webContents.send('closeCoordinatePickup');

            win.webContents.send('openOrCloseSelect');
            event.checked = !event.checked;
          },
        },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: '工具',
      submenu: [
        {
          label: '移动到XY',
          click: () => {
            extracted('map_to_xy', rootPath, isMac, '/map_to_xy');
          },
        },
        {
          id: '坐标拾取',
          label: '坐标拾取',
          type: 'checkbox',
          checked: false,
          click: (menuItem, browserWindow, event) => {
            // 关闭属性查看模式
            m.getMenuItemById('开启属性查看模式').checked = false;
            win.webContents.send('closeSelect');
            win.webContents.send('openOrCloseCoordinatePickup');
            event.checked = !event.checked;
          },
        },
      ],
    },
    {
      label: '配置',
      submenu: [
        {
          label: '天地图token配置',
          click: () => {
            extracted('/config?type=tdt', rootPath, isMac, '/config?type=tdt');
          },
        },
      ],
    },
    {
      label: '测试',
      submenu: [
        {
          id: '选中测试',
          label: '选中测试',
          type: 'checkbox',
          checked: false, // 将全局变量绑定到菜单项的checked属性
          click: () => {
            win.webContents.send('openOrCloseSelect');
          },
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
  map.get('/config?type=' + message.type).close();
  if (!message.canel) {
    win.webContents.send('map-config', message);
  }
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

ipcMain.on('gen-pointOrLine', (e, a) => {
  map.get('/gen_csv').close();
  if (a?.close) {
    map.get('/gen_csv').close();
  } else {
    win.webContents.send('gen-pointOrLine-show', a);
    console.log(e, a);
  }
});

ipcMain.on('gen-shp', (event, args) => {
  if (args?.close) {
    map.get('/importShape').close();
  } else {
    win.webContents.send('gen-shp-show', args);
    console.log(event, args);
    map.get('/importShape').close();
  }
});

ipcMain.on('calc-windows-size', (event, args) => {
  win.webContents.send('calc-windows-size', { w: win.getSize()[0], h: win.getSize()[1] });
});
ipcMain.on('openAttrTable', (event, args) => {
  // 打开属性表窗口
  console.log('打开属性表窗口', args);
  let browserWindow = extracted('/attr_table', rootPath, isMac, '/attr_table');
  setTimeout(() => {
    browserWindow.webContents.send('openAttrTable-data', args);
  }, 1000);
});

ipcMain.on('open-select-shp-gen', (event, args) => {
  dialog
    .showOpenDialog({
      filters: [{ name: 'shape file', extensions: ['shp'] }],
    })
    .then((result) => {
      console.log(result);
      map.get('/importShape').webContents.send('open-select-shp-gen-success', result.filePaths[0]);
    });
});

ipcMain.on('menu-item-state-changed', (event) => {
  global.sharedObject.checkTest = !global.sharedObject.checkTest; // 修改菜单项的选中状态
  const isChecked = global.sharedObject.checkTest;
  m.getMenuItemById('选中测试').checked = !m.getMenuItemById('选中测试').checked;
});

ipcMain.on('showBufferConfigWindows', (event, args) => {
  let browserWindow = extracted('/buffer', rootPath, isMac, '/buffer');
  setTimeout(() => {
    browserWindow.webContents.send('buffer-config-data', args);
  }, 1000);
});

ipcMain.on('buffer-config-data-complete', (event, args) => {
  if (args?.close) {
    map.get('/buffer').close();
  } else {
    win.webContents.send('buffer-config-data-complete', args);
    map.get('/buffer').close();
  }
});
