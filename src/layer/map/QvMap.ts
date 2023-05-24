import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { BingMaps } from 'ol/source';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Geometry, LineString, Point } from 'ol/geom';
import { Circle, Fill, RegularShape, Stroke, Style } from 'ol/style';

export class QvMap {
  target: string;

  // @ts-ignore
  private _map: Map;

  constructor(target: string) {
    this.target = target;
  }

  // todo:
  //  1. 地图图层不能直接写死
  //  2. 视图需要传输
  //  3. 要素图层的序号应该从10000开始
  initMap() {
    this._map = new Map({
      target: this.target,
      controls: [],

      layers: [
        new TileLayer({
          source: new BingMaps({
            key: 'AuWr3eXukkN34apjqfnABbs2nvmHRfVso9gH-X9HYB4lam8xwBbfHvKlDC0MFSyq',
            imagerySet: 'Aerial',
          }),
        }),
      ],

      view: new View({
        center: [119.45436769887343, 29.2080525919085],
        zoom: 15,
        projection: 'EPSG:4326',
      }),
    });
    return this._map;
  }

  hh: Map = new Map();
  testChangeData() {
    let a = this.hh.get('a');

    a.getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([119.45436769887343, 29.21]));
  }
  testAddLayers() {
    let geojsonObject = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            coordinates: [119.45436769887343, 29.2080525919085],
            type: 'Point',
          },
        },
      ],
    };

    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojsonObject),
      }),
      style: new Style({
        image: new RegularShape({
          fill: new Fill({
            color: 'red',
          }), //填充色
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }), //边线样式
          points: 3, //边数
          radius: 10, //半径
          angle: 0, //形状的角度(弧度单位)
        }),
      }),
    });

    this.hh.set('a', vectorLayer);
    // 将矢量图
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
