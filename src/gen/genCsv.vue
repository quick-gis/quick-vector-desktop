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

    <div v-if="(gen_shp.type == 'point' && gen_shp.hasGeo == '是') || this.vlink">
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
    <el-dialog v-model="link_config.display" title="引用配置" width="40%" @close="linkClose">
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

  <div>源文件</div>
  <div>{{ this.csv }}</div>
  <div>链接文件</div>
  <div>{{ this.linkcsv }}</div>
  <dev>geojson</dev>
  <div>{{ this.res }}</div>
</template>
<script lang="ts">
import { ipcRenderer } from 'electron';
import { CsvHeader, csvToListAndMap } from '../utils/CsvUtils';

export default {
  methods: {
    ipcRenderer() {
      return ipcRenderer;
    },
    linkClose() {
      console.log('链接表窗口关闭');
      this.vlink = this.validateLinkConfig();
      this.link_config.ref_field.forEach((e) => {
        this.gen_shp.fields.push(this.link_config.pre + '_' + e);
      });
      this.csv.data.forEach((ee) => {
        let ss = ee[this.link_config.source_field];
        let o = this.find(ss, this.link_config.target_field);

        for (let refFieldElement of this.link_config.ref_field) {
          if (o) {
            ee[this.link_config.pre + '_' + refFieldElement] = o[refFieldElement];
          }
        }
        console.log('sssssssssss', ss);
        console.log('oooooo', o);
      });
    },
    find(ss, field) {
      let o = null;
      this.linkcsv.data.forEach((e) => {
        if (e[field] == ss) {
          o = e;
          return;
        }
      });
      return o;
    },
    ok() {
      let features: any[] = [];

      if (this.gen_shp.type == 'point') {
        for (let datum of this.csv.data) {
          let once = {
            type: 'Feature',
            properties: datum,
            geometry: {
              coordinates: [Number(datum[this.gen_shp.point.x_field]), Number(datum[this.gen_shp.point.y_field])],
              type: 'Point',
            },
          };
          features.push(once);
        }
      } else if (this.gen_shp.type == 'line') {
      }
      console.log(features);
      this.res = features;
    },

    error() {},
    validateLinkConfig() {
      let vPre = this.link_config.pre != '';
      let vRefField = this.link_config.ref_field.length > 0;
      return vPre == true && vRefField == true;
    },
  },
  mounted() {
    ipcRenderer.on('open-select-csv-success', (event, args) => {
      this.gen_shp.file = args;
      let csvToListAndMap1 = csvToListAndMap(args);
      this.gen_shp.fields = csvToListAndMap1.header;
      this.csv.header = csvToListAndMap1.header;
      this.csv.data = csvToListAndMap1.list;
    });
    ipcRenderer.on('open-link-select-csv-success', (event, args) => {
      this.link_config.file = args;
      let csvToListAndMap1 = csvToListAndMap(args);
      this.link_config.fields = csvToListAndMap1.header;
      this.linkcsv.data = csvToListAndMap1.list;
    });
  },

  data() {
    return {
      res: null,
      csv: {
        header: [],
        data: [],
      },
      vlink: false,
      linkcsv: {
        data: [],
        header: [],
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
