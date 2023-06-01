import { get, Projection, transformExtent } from 'ol/proj';
import { getTopLeft, getWidth } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { ProdLayersTypeEnum } from './ConstValue';
import { GetDiTuConfigFile, ReadDiTuConfig } from '../../utils/FileUtils';
import fs from 'fs';

function getResolutions(size: number) {
  let resolutions = [];

  for (let z = 2; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
  }

  return resolutions;
}

export function GetTdtToken() {
  let readDiTuConfig = ReadDiTuConfig();
  if (!readDiTuConfig['token']) {
    throw Error('没有配置底图秘钥');
  }
  if (!readDiTuConfig['token']['tdt']) {
    throw Error('没有配置天地图秘钥');
  }
  return readDiTuConfig['token']['tdt'];
}

export function GetTianDiTuLayers(layer: ProdLayersTypeEnum) {
  let key = GetTdtToken();
  let projection: Projection | null;
  if (
    layer == ProdLayersTypeEnum.vec_c_mkt ||
    layer == ProdLayersTypeEnum.vec_mkt_label ||
    layer == ProdLayersTypeEnum.img_c_mkt ||
    layer == ProdLayersTypeEnum.img_mkt_label
  ) {
    projection = get('EPSG:3857');
  } else {
    projection = get('EPSG:4326');
  }

  let url: string = '';
  let ly: string = '';
  let index = -1;
  if (layer == ProdLayersTypeEnum.vec_c_jwd) {
    url = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=' + key;
    index = 5;
    ly = 'vec';
  } else if (layer == ProdLayersTypeEnum.vec_jwd_label) {
    url = 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk=' + key;
    index = 6;
    ly = 'cva';
  } else if (layer == ProdLayersTypeEnum.vec_c_mkt) {
    url = 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk=' + key;
    index = 3;
    ly = 'vec';
  } else if (layer == ProdLayersTypeEnum.vec_mkt_label) {
    url = 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk=' + key;
    index = 4;
    ly = 'cva';
  } else if (layer == ProdLayersTypeEnum.img_c_jwd) {
    url = 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?tk=' + key;
    index = 1;
    ly = 'img';
  } else if (layer == ProdLayersTypeEnum.img_jwd_label) {
    url = 'http://t{0-7}.tianditu.gov.cn/cia_c/wmts?tk=' + key;
    index = 2;
    ly = 'cia';
  } else if (layer == ProdLayersTypeEnum.img_c_mkt) {
    url = 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?tk=' + key;
    index = 7;
    ly = 'img';
  } else if (layer == ProdLayersTypeEnum.img_mkt_label) {
    url = 'http://t{0-7}.tianditu.gov.cn/cia_w/wmts?tk=' + key;
    index = 8;
    ly = 'cia';
  }

  if (projection != null) {
    let projectionExtent = projection.getExtent();
    let size = getWidth(projectionExtent) / 256;

    return new TileLayer({
      zIndex: index,
      visible: true,

      source: new WMTS({
        url: url,
        layer: ly,
        style: 'default',
        matrixSet: 'c',
        format: 'tiles',
        wrapX: true,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: getResolutions(size),
          // @ts-ignore
          matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        }),
      }),
    });
  } else {
    throw new Error('坐标异常');
  }
}
