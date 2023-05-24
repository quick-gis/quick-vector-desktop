<template>
  <div>
    <div>
      <label for="inputX">X:</label>
      <el-input id="inputX" v-model="x"></el-input>
    </div>
    <div>
      <label for="inputY">Y:</label>
      <el-input id="inputY" v-model="y"></el-input>
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
