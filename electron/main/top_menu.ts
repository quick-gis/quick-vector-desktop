import { app } from "electron";

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
