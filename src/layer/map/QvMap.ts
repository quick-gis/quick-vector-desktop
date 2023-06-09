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
import { DefaultSelectStyle, SelectedStyles } from '../../config/mapmapStyle';
import { MapBrowserEvent, Observable } from 'ol';
import { reactive } from 'vue';
import { Select } from 'ol/interaction';
import dp from '../../test/test';
import { Style } from 'ol/style';
import { getCenter } from 'ol/extent';
const turf = require('@turf/turf');

function getSelectPlus(mapData) {
  const clickInteraction = new Select({
    multi: false,
    style: function (f) {
      return DefaultSelectStyle[f.getGeometry().getType()];
    },
  });

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
  move_mouse: (e, mapData, map) => {
    mapData.coordinates = e.coordinate;
    var view = map.getView();
    mapData.zoom = view.getZoom();
  },
};
const geojson = new GeoJSON();

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
  private _fileLayer = new Map<String, Layer>();
  /**
   * 缓冲图层
   * @private
   */
  private _bufferLayer = new Map<String, Layer>();

  static addLayerBaseIndex = 30000;
  static bufferBaseIndex = 10000;
  private curLayerIndex = QvMap.addLayerBaseIndex;
  private curBufferLayerIndex = QvMap.bufferBaseIndex;
  // @ts-ignore
  private mapData = reactive({
    coordinates: null,
    click: false,
    openSelect: false,
    selectData: {},
    isSelect: false,
    isOpenCoordinatePicku: false,
    zoom: -1,
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
  closeSelector() {
    this.mapData.openSelect = false;
    this._map.removeInteraction(getSelectPlus(this.mapData));
    this.openSelect = !this.openSelect;
  }

  private mapClickKey: any;
  openOrCloseCoordinatePickup() {
    this.mapData.isOpenCoordinatePicku = !this.mapData.isOpenCoordinatePicku;
    if (this.mapData.isOpenCoordinatePicku) {
      this.mapClickKey = this._map.on('click', ($event) => {
        a['default_click']($event, this.mapData, this._map);
      });
    } else {
      this.closeCoordinatePickup();
    }
  }
  closeCoordinatePickup() {
    this.mapData.isOpenCoordinatePicku = false;
    this._map.un(this.mapClickKey.type, this.mapClickKey.listener);
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

    this._map.on('pointermove', ($event) => {
      a['move_mouse']($event, this.mapData, this._map);
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
    let layer1 = this._fileLayer.get(uid);
    layer1.setVisible(checked);
  }
  showOrCloseBufferLayers(uid, checked) {
    let layer1 = this._bufferLayer.get(uid);
    layer1.setVisible(checked);
  }
  getFileLayer(uid) {
    return this._fileLayer.get(uid);
  }

  CenteredDisplay(uid) {
    let fileLayer = this.getFileLayer(uid);

    let layerExtent = fileLayer?.getSource().getExtent();

    let view = this._map.getView();
    view.fit(layerExtent, {
      duration: 1000, // 动画持续时间，可选
    });
    view.setCenter(getCenter(layerExtent));
  }
  GetAllfileLayer(): Map<String, Layer> {
    return this._fileLayer;
  }

  GetAllbufferLayer(): Map<String, Layer> {
    return this._bufferLayer;
  }

  addGeojsonFile(uid, json) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(json)),
      }),
      style: function (f) {
        return SelectedStyles[f.getGeometry().getType()];
      },
    });
    this.curLayerIndex = this.curLayerIndex + 1;
    vectorLayer.setZIndex(this.curLayerIndex);
    this._fileLayer.set(uid, vectorLayer);
    this._map.addLayer(vectorLayer);
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
    this._fileLayer.set(uid, vectorLayer);
    this._map.addLayer(vectorLayer);
  }

  GetGeojsonWithLayer(uid: string) {
    let layer = this._bufferLayer.get(uid);
    if (layer) {
      let fet = layer?.getSource().getFeatures();
      let geoJSON = geojson.writeFeatures(fet, {
        featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
      });
      return geoJSON;
    }
    let layer1 = this._fileLayer.get(uid);
    if (layer1) {
      let fet = layer1?.getSource().getFeatures();
      let geoJSON = geojson.writeFeatures(fet, {
        featureProjection: 'EPSG:4326', // 指定要素的投影坐标系
      });
      return geoJSON;
    }
    return null;
  }

  /**
   * 添加buffer层
   * @param uid 唯一标识
   * @param json GeoJson
   * @param size 尺寸
   * @param unity 单位
   */
  addBufferLayer(uid: string, json: any, size: any, unity: any) {
    let geojson = turf.buffer(JSON.parse(json), size, { units: unity });
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojson),
      }),
      style: SelectedStyles['polygon'],
    });
    this.curBufferLayerIndex = this.curBufferLayerIndex + 1;
    vectorLayer.setZIndex(this.curBufferLayerIndex);
    this._bufferLayer.set(uid, vectorLayer);
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
