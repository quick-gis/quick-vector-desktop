import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { BingMaps } from 'ol/source';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Point } from 'ol/geom';
import { getProj, ProdLayersTypeEnum } from './ConstValue';
import { GetTianDiTuLayers } from './Tdt';
import { Layer } from 'ol/layer';
import { SelectedStyles } from '../../config/mapmapStyle';
import { MapBrowserEvent } from 'ol';
import { reactive } from 'vue';
import { Select } from 'ol/interaction';
function getSelectPlus(mapData) {
  const clickInteraction = new Select({ multi: false });
  clickInteraction.on('select', function (event) {
    let selectedFeatures = event.target.getFeatures();
    let data = null;
    if (selectedFeatures.getLength() > 0) {
      data = selectedFeatures.item(0);
    } else {
      data = event.selected[0];
    }
    if (data) {
      mapData.isSelect = true;
    } else {
      mapData.isSelect = false;
    }
    var format = new GeoJSON();

    if (data) {
      var geoJSON = format.writeFeature(data, {
        featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
      });
      mapData.selectData = geoJSON;

      console.log('当前点击数据GEOJSON', geoJSON);
      console.log('当前点击数据', data);
    }
  });
  return clickInteraction;
}

const a = {
  default_click: (e: MapBrowserEvent<any>, mapData, map) => {
    console.log('当前点击坐标111', e.coordinate);
    mapData.coordinates = e.coordinate;
    mapData.click = true;
  },
  move_mouse: (e, mapData) => {
    mapData.coordinates = e.coordinate;
  },
};

export class QvMap {
  target: string;
  hh: OlMap = new OlMap();
  // @ts-ignore
  private _map: OlMap;
  /**
   * 地图
   * @private
   */
  private diTu = new Map<ProdLayersTypeEnum, Layer>();

  /**
   * 文件转换图层
   * @private
   */
  private fileLayer = new Map<String, Layer>();

  static addLayerBaseIndex = 10000;
  private curLayerIndex = QvMap.addLayerBaseIndex;
  // @ts-ignore
  private mapData = reactive({
    coordinates: null,
    click: false,
    openSelect: false,
    selectData: {},
    isSelect: false,
  });
  private openSelect = false;
  openOrClose() {
    if (this.openSelect) {
      this.mapData.openSelect = false;
      this._map.removeInteraction(getSelectPlus(this.mapData));
    } else {
      this.mapData.openSelect = true;
      this._map.addInteraction(getSelectPlus(this.mapData));
    }
    this.openSelect = !this.openSelect;
  }

  constructor(target: string, obj) {
    this.target = target;
    this.mapData = obj;
  }

  //  3. 要素图层的序号应该从10000开始
  initMap() {
    this._map = new OlMap({
      target: this.target,
      controls: [],

      layers: [],

      view: new View({
        center: [119.45436769887343, 29.2080525919085],

        zoom: 8,
        projection: 'EPSG:4326',
      }),
    });
    this._map.on('click', ($event) => {
      a['default_click']($event, this.mapData, this._map);
    });
    this._map.on('pointermove', ($event) => {
      a['move_mouse']($event, this.mapData);
    });
    return this._map;
  }

  showOrDisplay(layer: ProdLayersTypeEnum, check: boolean) {
    let layer1 = this.diTu.get(layer);
    if (layer1) {
      layer1.setVisible(check);
    } else {
      let tileLayer = GetTianDiTuLayers(layer);
      if (tileLayer) {
        this._map.addLayer(tileLayer);
        this.diTu.set(layer, tileLayer);
      }
    }
  }
  addMap(layer: ProdLayersTypeEnum) {
    this.diTu.forEach((v, k) => {
      v.setVisible(false);
    });
    let cache = this.diTu.get(layer);
    if (cache) {
      cache.setVisible(true);
    } else {
      let tileLayer = GetTianDiTuLayers(layer);
      if (tileLayer) {
        this._map.addLayer(tileLayer);
        this.diTu.set(layer, tileLayer);
      }
    }
  }

  showOrCloseFileLayers(uid, checked) {
    console.log('iiiiii', uid);
    let layer1 = this.fileLayer.get(uid);
    layer1.setVisible(checked);
  }
  getFileLayer(uid) {
    return this.fileLayer.get(uid);
  }
  addGeoJsonForImport(uid, json, type) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(json),
      }),
      style: SelectedStyles[type],
    });
    this.curLayerIndex = this.curLayerIndex + 1;
    vectorLayer.setZIndex(this.curLayerIndex);
    this.fileLayer.set(uid, vectorLayer);
    this._map.addLayer(vectorLayer);
  }

  /**
   * 移动到xy
   */
  moveToXY(x: number, y: number, zoom?: number) {
    const view = this._map.getView();
    view.setCenter([x, y]);

    if (zoom) {
      view.setZoom(zoom);
    }
  }
}
