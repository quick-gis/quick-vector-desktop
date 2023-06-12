<template>
  <div>
    <div>
      <label for="inputX">X:</label>
      <el-input-number id="inputX" v-model="x" :step="0.1"></el-input-number>
    </div>
    <div>
      <label for="inputY">Y:</label>
      <el-input-number id="inputY" v-model="y" :step="0.1"></el-input-number>
    </div>

    <div>
      <el-button @click="ok">确定</el-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  data() {
    return {
      x: '',
      y: '',
    };
  },
  methods: {
    ok() {
      console.log('ok');
      // 发送窗口关闭事件和数据
      ipcRenderer.send('close-sub-window', {
        name: 'map_to_xy',
        data: {
          x: this.x,
          y: this.y,
        },
      });
    },
  },
};
</script>
