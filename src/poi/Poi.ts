import axios from 'axios';

/**
 * poi 数据对象
 */
interface PoiDataIns {
  /**
   * 名称
   */
  name: string;

  /**
   * 兴趣点类型
   */
  type: string;

  /**
   * 兴趣点类型编码
   */

  typecode: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 经纬度
   */
  location: string;

  /**
   * 城市名
   */
  cityname: string;
}

abstract class PoiSearchParam {
  /**
   * 面坐标
   */
  // @ts-ignore
  polygon: string;
  /**
   * 关键字
   */
  // @ts-ignore
  keywords: string;
  /**
   * 页码
   */
  // @ts-ignore
  page: number | null;
}

class GaoDePoiSearchParam extends PoiSearchParam {
  // @ts-ignore
  key: string;
  page = 1;
}

interface PoiRest {
  search(param: PoiSearchParam): Promise<PoiDataIns[]>;
}

export class GaoDePoiRest implements PoiRest {
  async search(param: GaoDePoiSearchParam): Promise<PoiDataIns[]> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://restapi.amap.com/v3/place/polygon?polygon=${param.polygon}&keywords=${param.keywords}&key=${param.key}&page=${param.page}`,
      headers: {},
    };
    let res: PoiDataIns[] | null = [];

    const result = await axios.request(config);

    if (result.status == 200) {
      let pois = result.data?.pois;

      for (let index in pois) {
        let c = pois[index];
        res?.push({
          name: c.name,
          type: c.type,
          typecode: c.typecode,
          address: c.address,
          location: c.location,
          cityname: c.cityname,
        });
      }
    }
    return res;
  }
}

// function f() {
//   let g = new GaoDePoiRest();
//   let gaoDePoiSearchParam = new GaoDePoiSearchParam();
//
//   gaoDePoiSearchParam.key = 'df9e141f75c34da017e73b62a4617096';
//   gaoDePoiSearchParam.polygon =
//     '116.460988,40.006919|116.48231,40.007381|116.47516,39.99713|116.472596,39.985227|116.45669,39.984989|116.460988,40.006919';
//   gaoDePoiSearchParam.keywords = 'kfc';
//   g.search(gaoDePoiSearchParam).then((e) => {
//     console.log(e);
//   });
// }
//
// f();
