import { app, BrowserWindow, ipcMain, Menu, session } from 'electron';
import { join } from 'path';
import { topMenu } from './top_menu';
let rootPath;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isMac = process.platform === 'darwin';

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    rootPath = `http://localhost:${rendererPort}`;
    console.log(rootPath);
    mainWindow.loadURL(rootPath + '/#/index');
    console.log('?');
  } else {
    rootPath = join(app.getAppPath(), 'renderer', 'index.html');
    mainWindow.loadFile(rootPath);
    console.log('1');
  }
  let m = Menu.buildFromTemplate(topMenu(isMac, mainWindow, rootPath));
  Menu.setApplicationMenu(m);
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self'"],
      },
    });
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('message', (event, message) => {
  console.log(message);
});

let modal;
// 接收弹出模态框
ipcMain.on('open-modal', (event, path, title = '提示') => {
  console.log('========打开新窗口========', path);
  console.log('========打开新窗口========', rootPath);

  const minWidth = 1176;
  const minHeight = 600;
  const width = 1200;
  const height = 700;
  modal = new BrowserWindow({
    // parent: BrowserWindow.getFocusedWindow() || undefined,
    modal: true,
    frame: true,
    width: width,
    height: height,
    minWidth: minWidth,
    closable: true,
    minHeight: minHeight,
    autoHideMenuBar: false, // 是否显示菜单栏
    // backgroundColor:'#000', // 背景
    hasShadow: true, // 阴影
    resizable: true, // 窗口是否可以放大
    webPreferences: {
      webviewTag: true,
      contextIsolation: false,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  let s = rootPath + '/#' + path;
  console.log(s);
  modal.loadURL(s);
});
