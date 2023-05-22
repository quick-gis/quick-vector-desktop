// @ts-ignore
const axios = require('axios');

interface XY {
  x: number;
  y: number;
}

abstract class GeoCodeParam {
  address: string | undefined;
  city: string | undefined;
}

export class GaoDeGeoCodeParam extends GeoCodeParam {
  key: string | undefined;
}

interface GeoCoding {
  code(param: GeoCodeParam): Promise<XY[]>;
}

export class GaoDeGeoCoding implements GeoCoding {
  async code(param: GaoDeGeoCodeParam): Promise<XY[]> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://restapi.amap.com/v3/geocode/geo?address=${param.address}&key=${param.key}&city=${param.city}`,
      headers: {},
    };

    let res = await axios.request(config);

    let result: XY[] = [];
    if (res.status == 200) {
      let cs = res.data?.geocodes;
      for (let index in cs) {
        let e = cs[index];
        let location = e.location;
        let sp = location.split(',');
        result.push({
          x: sp[0],
          y: sp[1],
        });
      }
    }

    return result;
  }
}

// function f() {
//   let g = new GaoDeGeoCoding();
//   let gaoDeGeoCodeParam = new GaoDeGeoCodeParam();
//   gaoDeGeoCodeParam.key = 'df9e141f75c34da017e73b62a4617096';
//   gaoDeGeoCodeParam.address = '北京市朝阳区阜通东大街6号';
//   gaoDeGeoCodeParam.city = '北京';
//
//   g.code(gaoDeGeoCodeParam).then((e) => {
//     console.log(e);
//   });
// }
//
// f();
