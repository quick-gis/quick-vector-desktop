import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { BingMaps, OSM, XYZ } from 'ol/source';
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
}
