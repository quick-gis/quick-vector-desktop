import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { BingMaps } from 'ol/source';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Geometry, LineString, Point } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';

export class QvMap {
  target: string;

  get map(): Map {
    return this._map;
  }

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
  oa() {
    let a = this.hh.get('a');

    a.getSource()
      ?.getFeatures()[0]
      .setGeometry(new Point([119.45436769887343, 29.21]));
  }
  addLayers() {
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
        image: new Circle({
          radius: 6, // 圆点的半径
          fill: new Fill({ color: '#fd0606' }), // 填充色
          stroke: new Stroke({ color: '#000', width: 2 }), // 边框样式
        }),
      }),
    });

    this.hh.set('a', vectorLayer);
    // 将矢量图
    this._map.addLayer(vectorLayer);
  }
}
