const fs = require('fs');
const csv = require('csv-parser');

interface Link {
  source: string;
  target: string;
  /**
   * 链接前缀
   */
  link_pre: string;
  /**
   * 需要链接的属性
   */
  link_field: any[];
}

export class LineCsvObe {
  rows: any;
  headers: any[];
  path: string;
  datas: any = [];

  constructor(path: string) {
    this.path = path;
    const fileData = fs.readFileSync(path, 'utf8');

    let rows = fileData.split('\n');
    this.rows = rows;
    this.headers = rows[0].split(',');
  }

  LinkData(param: [], link: Link) {
    for (let datasKey in this.datas) {
      let d = this.datas[datasKey][link.source];
      let query = find(param, link.target, d);
      if (query != null) {
        for (const e of link.link_field) {
          let s = link.link_pre + '_' + e;
          this.datas[datasKey][s] = query[e];
        }
      }

      console.log();
    }

    function find(param: [], field: string, val: any): any {
      for (let datasKey in param) {
        if (param[datasKey][field] == val) {
          return param[datasKey];
        }
      }
      return {};
    }
  }

  LoadLineCsv(sxField: string, syField: string, zxField: string, zyField: string) {
    let features: any[] = [];

    for (let i = 1; i < this.rows.length; i++) {
      const row = this.rows[i].split(',');
      if (row.length !== this.headers.length) {
        console.error(`Invalid row at line ${i + 1}`);
        continue;
      }

      let data: any = {};
      for (let j = 0; j < this.headers.length; j++) {
        data[this.headers[j]] = row[j];
      }

      let once = {
        type: 'Feature',
        properties: data,
        geometry: {
          coordinates: [
            [Number(data[sxField]), Number(data[syField])],
            [Number(data[zxField]), Number(data[zyField])],
          ],
          type: 'LineString',
        },
      };
      this.datas.push(data);
      features.push(once);
    }

    return {
      type: 'FeatureCollection',
      features: features,
    };
  }
}

export class PointCsvObe {
  rows: any;
  headers: any[];
  path: string;
  datas: any = [];

  constructor(path: string) {
    this.path = path;
    const fileData = fs.readFileSync(path, 'utf8');

    let rows = fileData.split('\n');
    this.rows = rows;
    this.headers = rows[0].split(',');
  }

  LoadPointCsv(xField: string, yField: string) {
    let features: any[] = [];

    for (let i = 1; i < this.rows.length; i++) {
      const row = this.rows[i].split(',');
      if (row.length !== this.headers.length) {
        console.error(`Invalid row at line ${i + 1}`);
        continue;
      }

      let data: any = {};
      for (let j = 0; j < this.headers.length; j++) {
        data[this.headers[j]] = row[j];
      }

      let once = {
        type: 'Feature',
        properties: data,
        geometry: {
          coordinates: [Number(data[xField]), Number(data[yField])],
          type: 'Point',
        },
      };
      this.datas.push(data);
      features.push(once);
    }

    return {
      type: 'FeatureCollection',
      features: features,
    };
  }
}

//
// let a = new PointCsvObe('/Users/zhangsan/temp/electron-vite-vue/sample/data.csv');
// console.log(JSON.stringify(a.LoadPointCsv('x', 'y')));
//
// let b = new LineCsvObe('/Users/zhangsan/temp/electron-vite-vue/sample/data-line.csv');
// console.log(JSON.stringify(b.LoadLineCsv('sx', 'sy', 'zx', 'zy')));
//
// b.LinkData(a.datas, {
//   source: 'name',
//   target: 'name',
//   link_field: ['x', 'y'],
//   link_pre: '起点',
// });
// console.log(JSON.stringify(b.datas));
// // export { PointCsvObe };

export function CsvHeader(path: string) {
  const fileData = fs.readFileSync(path, 'utf8');

  let rows = fileData.split('\n');
  return {
    head: rows[0].split(','),
    row: rows,
  };
}

export function csvToListAndMap(csvFilePath) {
  const fileData = fs.readFileSync(csvFilePath, 'utf8');
  const rows = fileData.split('\n');
  const header = rows[0].split(',');

  const list = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',');

    if (values.length === header.length) {
      let rowObject = {};

      for (let j = 0; j < header.length; j++) {
        // @ts-ignore
        rowObject[header[j]] = values[j];
      }

      list.push(rowObject);
    }
  }

  return { list: list, header: header };
}
