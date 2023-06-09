<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node';
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode';
import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type';
import { QvMap } from './map/QvMap';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ProdLayersTypeEnum } from './map/ConstValue';
import { Tree } from 'element-plus/lib/components/tree-v2/src/types';
import { ipcRenderer } from 'electron';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import GeoJSON from 'ol/format/GeoJSON';
import { GetLog } from '../utils/LogUtils';
import { saveBufferCount } from '../buffer/BufferUtil';

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

const data = ref([
  {
    id: uuidv4(),
    label: '编辑图层',
    disabled: true,
  },
  {
    id: uuidv4(),
    label: '分析图层',
    disabled: true,
    children: [
      {
        id: uuidv4(),
        label: '缓冲区分析',
        disabled: true,

        children: [],
      },
    ],
  },
  {
    id: uuidv4(),
    label: '展示图层',
    disabled: true,

    children: [
      {
        id: uuidv4(),
        label: '数据库图层',
        children: [],
        disabled: false,
      },
      {
        id: uuidv4(),
        label: '文件图层',
        children: [],
        disabled: false,
      },
    ],
  },
  {
    id: uuidv4(),
    label: '标记图层',
    disabled: true,
  },
  {
    id: uuidv4(),
    label: 'WMS/WMTS',
    disabled: true,

    children: [],
  },
  {
    id: uuidv4(),
    label: '底图',
    disabled: true,

    children: [
      {
        id: uuidv4(),
        label: '天地图',
        disabled: true,

        children: [
          {
            id: uuidv4(),
            label: '天地图影像（经纬度投影）',

            children: [
              {
                id: uuidv4(),
                label: '影像底图',
                tag: ProdLayersTypeEnum.img_c_jwd,
              },
              {
                id: uuidv4(),
                label: '影像标注',
                tag: ProdLayersTypeEnum.img_jwd_label,
              },
            ],
          },
          {
            id: uuidv4(),
            label: '天地图矢量（经纬度投影）',
            children: [
              {
                id: uuidv4(),
                label: '矢量底图',
                tag: ProdLayersTypeEnum.vec_c_jwd,
              },
              {
                id: uuidv4(),
                label: '矢量标注',
                tag: ProdLayersTypeEnum.vec_jwd_label,
              },
            ],
          },
        ],
      },
    ],
  },
]);

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
const nodeClick = (e) => {
  console.log(e);
};
var geojson = new GeoJSON();

const nodeContextMenu = (event, data, node) => {
  console.log('右键', event, data, node);
  let tag = node?.data?.tag;
  curData.curNode = node;
  if (tag == ProdLayersTypeEnum.file) {
    console.log('右键node', node);
    let d = props.qvMap?.getFileLayer(node?.data?.uid);
    let fet = d?.getSource().getFeatures();
    var geoJSON = geojson.writeFeatures(fet, {
      featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
    });
    console.log('dddddd', geoJSON);
    curData.geojson = geoJSON;
    contextmenuConfig.x = event.clientX;
    contextmenuConfig.y = event.clientY;
    showMenu.value = true;
  }
};

const curData = reactive({
  curNode: null,
  geojson: null,
});
const showMenu = ref(false);
const handleCheckChange = (data: Tree, checked: boolean, indeterminate: boolean) => {
  console.log('选择框选择');
  console.log(data);
  console.log(data?.tag);
  if (data?.tag == ProdLayersTypeEnum.file) {
    props.qvMap?.showOrCloseFileLayers(data?.uid, checked);
  } else if (data?.tag == ProdLayersTypeEnum.buffer) {
    props.qvMap?.showOrCloseBufferLayers(data?.uid, checked);
  } else if (
    data?.tag == ProdLayersTypeEnum.vec_c_jwd ||
    data?.tag == ProdLayersTypeEnum.vec_jwd_label ||
    data?.tag == ProdLayersTypeEnum.vec_c_mkt ||
    data?.tag == ProdLayersTypeEnum.vec_mkt_label ||
    data?.tag == ProdLayersTypeEnum.img_c_jwd ||
    data?.tag == ProdLayersTypeEnum.img_jwd_label ||
    data?.tag == ProdLayersTypeEnum.img_c_mkt ||
    data?.tag == ProdLayersTypeEnum.img_mkt_label
  ) {
    // todo: 看看有没有异常

    props.qvMap?.showOrDisplay(data?.tag, checked);
  }
};
ipcRenderer.on('gen-pointOrLine-show', function (event, args) {
  console.log('左侧图层', args);
  const fileName = path.basename(args.fileName);
  console.log('filename', fileName);
  let findNodeByLabel1 = findNodeByLabel(data.value, '文件图层');
  let nodeId = args.uid;
  findNodeByLabel1.children.unshift({
    id: nodeId,
    label: fileName,
    uid: args.uid,
    tag: ProdLayersTypeEnum.file,
  });

  nextTick(() => {
    defaultCheckedKeys.value = defaultCheckedKeys.value.concat(nodeId);
  });
});

ipcRenderer.on('gen-shp-show', function (event, args) {
  console.log('左侧图层', args);
  const fileName = path.basename(args.fileName);
  console.log('filename', fileName);
  let findNodeByLabel1 = findNodeByLabel(data.value, '文件图层');
  let nodeId = args.uid;
  findNodeByLabel1.children.unshift({
    id: args.uid,
    label: fileName,
    uid: args.uid,
    tag: ProdLayersTypeEnum.file,
  });

  nextTick(() => {
    defaultCheckedKeys.value = defaultCheckedKeys.value.concat(nodeId);
  });
});
const defaultCheckedKeys = ref([]);
const contextmenuConfig = reactive({
  x: 0,
  y: 0,
});

const showAttrTable = () => {
  ipcRenderer.send('openAttrTable', { geojson: JSON.parse(curData.geojson) });
};

const showBufferConfigWindows = () => {
  ipcRenderer.send('showBufferConfigWindows', {
    fileName: curData.curNode?.data?.label,
    json: curData.geojson,
  });
};
ipcRenderer.on('findLayers', (event, args) => {
  ipcRenderer.send('layers', {
    data: JSON.parse(JSON.stringify(data.value)),
  });
});
ipcRenderer.on('findLayersGeoJson', (event, args) => {
  let map = [];
  let fileLayer = props.qvMap?.GetAllfileLayer();
  fileLayer?.forEach((v, k) => {
    let fet = v?.getSource().getFeatures();
    let geoJSON = geojson.writeFeatures(fet, {
      featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
    });
    map.push({
      uid: k,
      geojson: geoJSON,
    });
  });

  let bufferLayer = props.qvMap?.GetAllbufferLayer();
  bufferLayer?.forEach((v, k) => {
    let fet = v?.getSource().getFeatures();
    let geoJSON = geojson.writeFeatures(fet, {
      featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
    });
    map.push({
      uid: k,
      geojson: geoJSON,
    });
  });
  ipcRenderer.send('layerGeojson', {
    data: JSON.parse(JSON.stringify(map)),
  });
});

ipcRenderer.on('buffer-config-data-complete', (event, args) => {
  console.log('开始缓冲区见图');
  let findNodeByLabel1 = findNodeByLabel(data.value, '缓冲区分析');
  let nodeId = uuidv4();
  let label = args.layerName;

  if (args.geojson) {
    props.qvMap?.addBufferLayer(nodeId, args.geojson, args.size, args.unity);
  } else {
    props.qvMap?.addBufferLayer(nodeId, props.qvMap?.GetGeojsonWithLayer(args.id), args.size, args.unity);
  }

  findNodeByLabel1.children.unshift({
    id: nodeId,
    label: label + '-' + saveBufferCount(label),
    sourceName: label,
    uid: nodeId,
    tag: ProdLayersTypeEnum.buffer,
  });
  nextTick(() => {
    defaultCheckedKeys.value = defaultCheckedKeys.value.concat(nodeId);
  });
});
const exportData = () => {
  // 导出数据
};
</script>

<template>
  <div>
    <el-tree
      :default-checked-keys="defaultCheckedKeys"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="data"
      draggable
      default-expand-all
      node-key="id"
      show-checkbox
      @check-change="handleCheckChange"
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
    <div
      v-show="showMenu"
      :style="{
        top: contextmenuConfig.y + 'px',
        left: contextmenuConfig.x + 'px',
      }"
      id="contextmenu"
      @mouseleave="showMenu = false"
      @mousemove.stop
    >
      <div>
        <el-button @click="showAttrTable()">查看属性表 </el-button>
        <el-button @click="showBufferConfigWindows()">建立缓冲区 </el-button>
        <el-button @click="exportData()">导出数据 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#contextmenu {
  position: fixed;
  height: auto;
  width: 120px;
  border-radius: 3px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  padding: 10px;
  z-index: 12;

  button {
    display: block;
    margin: 0 0 5px;
  }
}
</style>
