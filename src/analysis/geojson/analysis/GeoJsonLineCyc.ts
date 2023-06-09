import { CoreSplitLine } from './LineSplit';
import { CoreFindCyc } from './FindLineCyc';

function calcRing(d: any) {
  let coreSplitLine = CoreSplitLine(d);

  let cyc = CoreFindCyc(coreSplitLine);

  console.log(cyc);
  let e = [];
  for (let c of cyc) {
    for (let ct of c) {
      e.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [ct.start.x, ct.start.y],
            [ct.end.x, ct.end.y],
          ],
        },
      });
    }
  }
  return e;
}

/**
 *
 * @param d
 * @constructor
 */
export function GeoJsonLineWithOnceCyc(d: any) {
  let e = calcRing(d);

  return {
    type: 'FeatureCollection',
    features: e,
  };
}

export function GeoJsonLineCollectionCyc(d: any) {
  let res = [];
  for (let a of d.features) {
    res.push(...calcRing(d));
  }
  return {
    type: 'FeatureCollection',
    features: res,
  };
}

export function GeoJsonLineCyc(d: any) {
  if (d.type == 'FeatureCollection') {
    return GeoJsonLineCollectionCyc(d);
  } else {
    return GeoJsonLineWithOnceCyc(d);
  }
}
