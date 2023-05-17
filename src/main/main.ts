import { app, BrowserWindow, ipcMain, session, Menu } from "electron";
import { join } from "path";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isMac = process.platform === "darwin";

  let template = [
    ...(isMac
      ? [
          {
            label: app.name,
          },
        ]
      : []),
    {
      label: "文件",
      submenu: [
        { label: "保存工作空间" },
        {
          label: "导出",
          submenu: [
            { label: "导出 SHP" },
            { label: "导出 GeoJson" },
            { label: "导出 KML" },
            { label: "导出 XML" },
          ],
        },
        {
          label: "导入",
          submenu: [
            { label: "导入 CSV" },
            { label: "导入 EXCEL" },
            { label: "导入 GeoJson" },
            { label: "导入 WMS\\WMTS" },
          ],
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { label: "开始编辑" },
        { label: "保存编辑" },
        { label: "停止编辑" },
        { label: "查看属性表" },
        { label: "捕捉配置" },
        { label: "裁切" },
        { label: "拷贝" },
        { label: "删除" },
        { label: "撤回" },
        { label: "平移地图" },
        { label: "放大地图" },
        { label: "缩小地图" },
        { label: "居中地图" },
      ],
    },
    {
      label: "分析",
      submenu: [
        {
          label: "缓冲分析",
        },
        {
          label: "孤立点分析",
        },
        {
          label: "连通性分析",
        },
        {
          label: "叠加分析",
        },
      ],
    },
    {
      label: "底图",
      submenu: [
        {
          label: "天地图",
          submenu: [
            { label: "秘钥配置" },

            {
              label: "天地图矢量（经纬度投影）",
              submenu: [
                {
                  label: "矢量底图",
                },
                {
                  label: "矢量标注",
                },
              ],
            },
            {
              label: "天地图矢量（球面墨卡托投影）",
              submenu: [
                {
                  label: "矢量底图",
                },
                {
                  label: "矢量标注",
                },
              ],
            },
            {
              label: "天地图影像（经纬度投影）",
              submenu: [
                {
                  label: "影像底图",
                },
                {
                  label: "影像标注",
                },
              ],
            },
            {
              label: "天地图影像（球面墨卡托投影）",
              submenu: [
                {
                  label: "影像底图",
                },
                {
                  label: "影像标注",
                },
              ],
            },
          ],
        },
        {
          label: "高德地图",
          submenu: [
            { label: "秘钥配置" },
            { label: "标标准图层" },
            { label: "实时路况图层" },
            { label: "卫星图" },
            { label: "卫星和路网" },
          ],
        },
        {
          label: "百度地图",
          submenu: [
            { label: "秘钥配置" },
            { label: "标准地图" },
            { label: "卫星地图" },
          ],
        },
      ],
    },
    {
      label: "工具",
      submenu: [
        { label: "定位" },
        { label: "地理编码" },
        { label: "逆地理编码" },
        { label: "坐标转换" },
      ],
    },
    { label: "查询", submenu: [] },
    {
      label: "数据库配置",
      submenu: [{ label: "MySQL" }, { label: "PostGIS" }],
    },
    { label: "发布", submenu: [{ label: "发布GeoServer" }] },
  ];
  let m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    // todo : 端口配置
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("message", (event, message) => {
  console.log(message);
});
