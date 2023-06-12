import { QvMap } from './QvMap';

export enum ProdLayersTypeEnum {
  vec_c_jwd = '矢量底图-经纬度',
  vec_jwd_label = '矢量底图-标注-经纬度',
  vec_c_mkt = '矢量底图-墨卡托',
  vec_mkt_label = '矢量底图-标注-墨卡托',

  img_c_jwd = '影像底图-经纬度',
  img_jwd_label = '影像底图-标注-经纬度',
  img_c_mkt = '影像底图-墨卡托',
  img_mkt_label = '影像底图-标注-墨卡托',

  file = '文件图层',
  buffer = '缓冲图层',
  line_ring = '环分析图层',
  line_self_ov = '线自叠加分析图层',
}

let qvmap: QvMap = null;

export function setQvMap(qvmapParam: QvMap) {
  qvmap = qvmapParam;
}
export function getQvmap() {
  return qvmap;
}
export function getProj(layer: ProdLayersTypeEnum) {
  if (layer == ProdLayersTypeEnum.vec_c_jwd) {
    return 'EPSG:4326';
  }
  if (layer == ProdLayersTypeEnum.vec_jwd_label) {
    return 'EPSG:4326';
  }
  if (layer == ProdLayersTypeEnum.vec_c_mkt) {
    return 'EPSG:3857';
  }
  if (layer == ProdLayersTypeEnum.vec_mkt_label) {
    return 'EPSG:3857';
  }
  if (layer == ProdLayersTypeEnum.img_c_jwd) {
    return 'EPSG:4326';
  }
  if (layer == ProdLayersTypeEnum.img_jwd_label) {
    return 'EPSG:4326';
  }
  if (layer == ProdLayersTypeEnum.img_c_mkt) {
    return 'EPSG:3857';
  }
  if (layer == ProdLayersTypeEnum.img_mkt_label) {
    return 'EPSG:3857';
  }
}
