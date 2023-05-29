<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node';
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode';
import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type';
import { QvMap } from './map/QvMap';
import { onMounted } from 'vue';

const handleDragStart = (node: Node, ev: DragEvents) => {
  console.log('drag start', node);
};
const handleDragEnter = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag enter:', dropNode.label);
};
const handleDragLeave = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag leave:', dropNode.label);
};
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag over:', dropNode.label);
};
const handleDragEnd = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType);
};
const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {
  console.log('tree drop:', dropNode.label, dropType);
};
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner';
  } else {
    return true;
  }
};
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('Level three 3-1-1');
};
const props = defineProps({
  qvMap: QvMap,
});

onMounted(() => {
  console.log('多对多  ');
  console.log(props.qvMap);
});

const data = [
  {
    label: '编辑图层',
  },
  {
    label: '分析图层',
  },
  {
    label: '展示图层',
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
  { label: '标记图层' },
  {
    label: 'WMS/WMTS',
    children: [
      {
        label: '网络地图',
      },
    ],
  },
  {
    label: '底图',
    children: [
      {
        label: '天地图',
        children: [
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
          {
            label: '天地图矢量（球面墨卡托投影）',
            children: [
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
            label: '天地图影像（球面墨卡托投影）',
            children: [
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
        children: [
          { label: '秘钥配置' },
          { label: '标标准图层' },
          { label: '实时路况图层' },
          { label: '卫星图' },
          { label: '卫星和路网' },
        ],
      },
      {
        label: '百度地图',
        children: [{ label: '标准地图' }, { label: '卫星地图' }],
      },
    ],
  },
];
const nodeClick = (e) => {
  console.log(e);
};
const nodeContextMenu = (event, data, node) => {
  console.log('右键', event, data, node);
};
</script>

<template>
  <div>
    <el-tree
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="data"
      draggable
      default-expand-all
      node-key="id"
      @node-click="nodeClick"
      @node-contextmenu="nodeContextMenu"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
    />
  </div>
  <div>
    <!--    右键图层菜单-->
  </div>
</template>

<style scoped></style>
