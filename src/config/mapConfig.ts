import { ReadDiTuConfig, SaveDiTuConfig } from '../utils/FileUtils';
import { GetLog } from '../utils/LogUtils';

/**
 * 官方配置：http://lbs.tianditu.gov.cn/server/MapService.html
 */
export class TianDiTuConfigImpl {
  constructor(token: string) {
    this.token = token;
  }

  token: string;
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

export class BaiDuConfigImpl {
  constructor(token: string) {
    this.token = token;
  }

  token: string;
}

// 文档: https://blog.csdn.net/zyh_1988/article/details/120670402

// todo: 全局变量+pina
export class DiTuConfig {
  // @ts-ignore
  tdt: TianDiTuConfigImpl;
  // @ts-ignore
  bd: BaiDuConfigImpl;
  private static instance: DiTuConfig;

  public static getInstance(): DiTuConfig {
    if (!DiTuConfig.instance) {
      DiTuConfig.instance = new DiTuConfig();
      DiTuConfig.instance.Load();
    }
    return DiTuConfig.instance;
  }
  Save() {
    GetLog().info('写入配置' + JSON.stringify(DiTuConfig.getInstance()));
    SaveDiTuConfig(JSON.stringify(this));
  }
  Load() {
    let readDiTuConfig = ReadDiTuConfig();
    let d = JSON.parse(readDiTuConfig);
    let instance = DiTuConfig.getInstance();
    instance.tdt = d.tdt;
    instance.bd = d.bd;
  }
}
