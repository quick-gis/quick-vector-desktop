import { getTopLeft, getWidth } from 'ol/extent';

import TileLayer from 'ol/layer/Tile';

import WMTS from 'ol/source/WMTS';

import WMTSTileGrid from 'ol/tilegrid/WMTS';

import { get, Projection } from 'ol/proj';

// 全局变量

let key = 'af329b7c71730694d8ffadce86e45236';

let projection: Projection | null = get('EPSG:4326');

// @ts-ignore
let projectionExtent = projection.getExtent();

let size = getWidth(projectionExtent) / 256;

/**
 * 私有方法
 */

function getResolutions() {
  let resolutions = [];

  for (let z = 2; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
  }

  return resolutions;
}

export function getProjection() {
  return projection;
}

// WMTS 形式

function getWMTSLayer(url, layer) {
  return new TileLayer({
    source: new WMTS({
      name: '中国',
      url: url,
      layer: layer,
      style: 'default',
      matrixSet: 'c',
      format: 'tiles',
      wrapX: true,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: getResolutions(),
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      }),
    }),
  });
}

/**
 * 矢量底图 + 矢量注记
 */

export function vec_c() {
  return [
    getWMTSLayer('http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=' + key, 'vec'),

    getWMTSLayer('http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk=' + key, 'cva'),
  ];
}

/**
 * 影像底图 + 影像注记
 */

export function img_c() {
  return [
    getWMTSLayer('http://t{0-7}.tianditu.gov.cn/img_c/wmts?tk=' + key, 'img'),

    getWMTSLayer('http://t{0-7}.tianditu.gov.cn/cia_c/wmts?tk=' + key, 'cia'),
  ];
}
