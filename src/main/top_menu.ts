import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import MenuItem = Electron.MenuItem;

function createNewWindow(rootPath: string) {
  const newWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 加载新窗口的Vue.js应用程序
  newWindow.loadURL(rootPath + '#/diag'); // 根据您的实际设置进行更改
}

export function topMenu(isMac, win: BrowserWindow, rootPath: string): Array<MenuItemConstructorOptions | MenuItem> {
  return [
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
            createNewWindow(rootPath);
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
      ],
    },
  ];
}
