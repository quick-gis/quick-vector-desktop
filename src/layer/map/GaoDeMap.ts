import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

let shiliang = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}',
  }),
});
let a = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=en&size=1&style=8&x={x}&y={y}&z={z}',
  }),
});
