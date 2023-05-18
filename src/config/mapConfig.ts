/**
 * 令牌
 */
export interface Token {
  /**
   * 令牌
   */
  token: string | '';
}

/**
 * 官方配置：http://lbs.tianditu.gov.cn/server/MapService.html
 */
export class TianDiTuConfigImpl {
  /**
   * 天地图_矢量底图_经纬度投影
   */
  static vec_c: string = '';

  /**
   * 天地图_矢量底图_球面墨卡托投影
   */
  static vec_w: string = '';

  /**
   * 天地图_矢量注记_经纬度投影
   */
  static cva_c: string = '';

  /**
   * 天地图_矢量注记_球面墨卡托投影
   */
  static cva_w: string = '';

  /**
   * 天地图_影像底图_经纬度投影
   */
  static img_c: string = '';

  /**
   * 天地图_影像底图_球面墨卡托投影
   */
  static img_w: string = '';

  /**
   * 天地图_影像注记_经纬度投影
   */
  static cia_c: string = '';

  /**
   * 天地图_影像注记_球面墨卡托投影
   */
  static cia_w: string = '';
}

export class BaiDuConfigImpl {}

// 文档: https://blog.csdn.net/zyh_1988/article/details/120670402
