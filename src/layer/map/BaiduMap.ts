import TileLayer from 'ol/layer/Tile';

import { get } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import { TileImage } from 'ol/source';

//百度地图
var projection = get('EPSG:3857');
var resolutions = [];
for (var i = 0; i < 19; i++) {
  resolutions[i] = Math.pow(2, 18 - i);
}
var tilegrid = new TileGrid({
  origin: [0, 0],
  resolutions: resolutions,
});

var baidu_source = new TileImage({
  projection: projection,
  tileGrid: tilegrid,
  tileUrlFunction: function (tileCoord, pixelRatio, proj) {
    if (!tileCoord) {
      return '';
    }
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = tileCoord[2];
    if (x < 0) {
      x = 'M' + -x;
    }
    if (y < 0) {
      y = 'M' + -y;
    }
    return (
      'http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=' +
      x +
      '&y=' +
      y +
      '&z=' +
      z +
      '&styles=pl&udt=20170809&scaler=1&p=1'
    );
  },
});

var baiduMapLayer = new TileLayer({
  source: baidu_source,
});
