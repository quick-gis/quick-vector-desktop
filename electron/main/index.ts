import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron';
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
          label: '导入',
          submenu: [
            {
              label: '导入 CSV',

              click: () => {
                extracted('/gen_csv', rootPath, isMac, '/gen_csv');
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
          label: '开启属性查看模式',
          type: 'checkbox',
          checked: false,
          click: (menuItem, browserWindow, event) => {
            win.webContents.send('openOrCloseSelect');
            event.checked = !event.checked;
          },
        },
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
  console.log(e, a);
  win.webContents.send('gen-pointOrLine-show', a);
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
