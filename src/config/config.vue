<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GetLog } from '../utils/LogUtils';
import { DiTuConfig } from './mapConfig';
const input1 = ref('');
const router = useRoute();
let type;

const blur = () => {
  let instance = DiTuConfig.getInstance();

  if (type == 'tdt') {
    instance.tdt.token = input1.value;
    console.log('tdt', input1.value);
  }
};
onMounted(() => {
  console.log('kkk');
  console.log('type = ', router.query.type);
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
