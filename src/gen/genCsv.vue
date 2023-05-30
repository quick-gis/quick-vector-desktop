<template>
  <div>CSV成图</div>

  <el-form :model="gen_shp" label-width="120px">
    <el-form-item label="选择文件">
      <el-input v-model="gen_shp.file" disabled></el-input>
      <el-button @click="ipcRenderer().send('open-select-csv')">...</el-button>
    </el-form-item>
    <el-form-item label="成图类型">
      <el-select v-model="gen_shp.type" placeholder="请选择成图类型">
        <el-option label="点" value="point" />
        <el-option label="线" value="line" />
      </el-select>
    </el-form-item>

    <el-form-item label="是否包含坐标">
      <el-radio-group v-model="gen_shp.hasGeo">
        <el-radio label="是" value="是" />
        <el-radio label="否" value="否" />
      </el-radio-group>
    </el-form-item>

    <div v-if="gen_shp.hasGeo == '否'">
      <el-form-item label="属性链接配置">
        <el-button @click="link_config.display = true">配置</el-button>
      </el-form-item>
    </div>

    <div v-if="gen_shp.type == 'point' && gen_shp.hasGeo == '是'">
      <el-form-item label="X坐标">
        <el-select v-model="gen_shp.point.x_field" placeholder="请选择X坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
            >{{ gen_shp.fields[idx] }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Y坐标">
        <el-select v-model="gen_shp.point.y_field" placeholder="请选择Y坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
    </div>
    <div v-if="gen_shp.type == 'line' && gen_shp.hasGeo == '是'">
      <el-form-item label="起点X坐标">
        <el-select v-model="gen_shp.line.sx_field" placeholder="请选择起点X坐标"></el-select>
      </el-form-item>

      <el-form-item label="起点Y坐标">
        <el-select v-model="gen_shp.line.sy_field" placeholder="请选择起点Y坐标"></el-select>
      </el-form-item>
      <el-form-item label="终点X坐标">
        <el-select v-model="gen_shp.line.ex_field" placeholder="请选择终点X坐标"></el-select>
      </el-form-item>
      <el-form-item label="终点Y坐标">
        <el-select v-model="gen_shp.line.ey_field" placeholder="请选择终点Y坐标"></el-select>
      </el-form-item>
    </div>
  </el-form>

  <div>
    <el-dialog v-model="link_config.display" title="引用配置" width="40%">
      <el-form :model="link_config" label-width="120px">
        <el-form-item label="选择链接文件">
          <el-input v-model="link_config.file" disabled></el-input>
          <el-button @click="ipcRenderer().send('open-link-select-csv')">...</el-button>
        </el-form-item>
      </el-form>
      <el-form-item label="原始表字段">
        <el-select v-model="link_config.source_field" placeholder="请选择原始表字段">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标表字段">
        <el-select v-model="link_config.target_field" placeholder="请选择目标表字段">
          <el-option
            v-for="(col, idx) in link_config.fields"
            :key="idx"
            :index="idx"
            :label="link_config.fields[idx]"
            :value="link_config.fields[idx]"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="前缀">
        <el-input v-model="link_config.pre" placeholder="请输入前缀"></el-input>
      </el-form-item>
      <el-form-item label="引用字段">
        <el-select v-model="link_config.ref_field" multiple placeholder="请选择引用字段">
          <el-option
            v-for="(col, idx) in link_config.fields"
            :key="idx"
            :index="idx"
            :label="link_config.fields[idx]"
            :value="link_config.fields[idx]"
          />
        </el-select>
      </el-form-item>
    </el-dialog>
  </div>

  <div>
    <el-button @click="ok">确认</el-button>
    <el-button @click="error">取消</el-button>
  </div>
  <div>{{ this.gen_shp }}</div>
  <div>{{ this.link_config }}</div>
</template>
<script lang="ts">
import { ipcRenderer } from 'electron';
import { CsvHeader } from '../utils/CsvUtils';

export default {
  methods: {
    ipcRenderer() {
      return ipcRenderer;
    },
    ok() {
      let features: any[] = [];

      if (this.gen_shp.type == 'point') {
        for (let i = 1; i < this.csv.row.length; i++) {
          const row = this.csv.row[i].split(',');
          if (row.length !== this.csv.header.length) {
            continue;
          }

          let data: any = {};
          for (let j = 0; j < this.csv.header.length; j++) {
            data[this.csv.header[j]] = row[j];
          }

          let once = {
            type: 'Feature',
            properties: data,
            geometry: {
              coordinates: [Number(data[this.gen_shp.point.x_field]), Number(data[this.gen_shp.point.y_field])],
              type: 'Point',
            },
          };
          features.push(once);
        }
      } else if (this.gen_shp.type == 'line') {
      }
      console.log(features);
    },
    error() {},
  },
  mounted() {
    ipcRenderer.on('open-select-csv-success', (event, args) => {
      console.log(event);
      console.log(args);
      this.gen_shp.file = args;

      let csvHeader = CsvHeader(args);
      this.gen_shp.fields = csvHeader.head;
      this.csv.row = csvHeader.row;
      this.csv.header = csvHeader.head;
    });
    ipcRenderer.on('open-link-select-csv-success', (event, args) => {
      console.log(event);
      console.log(args);
      this.link_config.file = args;
      let csvHeader = CsvHeader(args);
      this.link_config.fields = csvHeader.head;
      this.linkcsv.row = csvHeader.row;
    });
  },

  data() {
    return {
      csv: {
        header: [],
        row: [],
      },
      linkcsv: {
        row: [],
      },
      link_config: {
        fields: [],
        display: false,
        file: '',
        source_field: '',
        target_field: '',
        pre: '',
        ref_field: [],
      },
      gen_shp: {
        file: '',
        type: '',
        hasGeo: false,
        fields: [],
        point: {
          x_field: '',
          y_field: '',
        },
        line: {
          sx_field: '',
          sy_field: '',
          ex_field: '',
          ey_field: '',
        },
      },
    };
  },
};
</script>
<style></style>
