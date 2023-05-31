const data = [
  {
    label: '编辑图层',
    disabled: true,
  },
  {
    label: '分析图层',
    disabled: true,
  },
  {
    label: '展示图层',
    disabled: true,

    children: [
      {
        label: '数据库图层',
        children: [
          {
            label: '雨水井',
            type: '',
          },
        ],
      },
      {
        label: '文件图层',
        children: [
          {
            label: '污水井.csv',
          },
        ],
      },
    ],
  },
  { label: '标记图层', disabled: true },
  {
    label: 'WMS/WMTS',
    disabled: true,

    children: [],
  },
  {
    label: '底图',
    disabled: true,

    children: [
      {
        label: '天地图',
        disabled: true,

        children: [
          {
            label: '天地图影像（经纬度投影）',

            children: [
              {
                label: '影像底图',
              },
              {
                label: '影像标注',
              },
            ],
          },
          {
            label: '天地图矢量（经纬度投影）',
            children: [
              {
                label: '矢量底图',
              },
              {
                label: '矢量标注',
              },
            ],
          },
        ],
      },
    ],
  },
];

function findNodeByLabel(nodes, targetLabel) {
  for (const node of nodes) {
    if (node.label === targetLabel) {
      return node; // 找到匹配的节点，返回它
    }

    if (node.children && node.children.length > 0) {
      const result = findNodeByLabel(node.children, targetLabel); // 递归搜索子节点
      if (result) {
        return result; // 找到匹配的节点，返回它
      }
    }
  }

  return null; // 没有找到匹配的节点
}
const targetLabel = '文件图层';
const resultNode = findNodeByLabel(data, targetLabel);

console.log(resultNode);
