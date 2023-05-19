<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GetLog } from '../utils/LogUtils';
import { DiTuConfig } from './mapConfig';
const input1 = ref('');
const router = useRoute();
let type;

const blur = () => {
  GetLog().info('失去焦点' + input1.value);
  let instance = DiTuConfig.getInstance();
  GetLog().info('失去焦点' + JSON.parse(instance));

  if (type == 'tdt') {
    instance.tdt.token = input1.value;
  }
  instance.Save();
};
onMounted(() => {
  console.log('kkk');
  GetLog().info(router.query.type);
});
</script>

<template>
  <button @click="blur">aaa</button>
  <div>
    <el-form label-width="120px">
      <el-form-item label="令牌">
        <el-input :blur="blur" v-model="input1" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
