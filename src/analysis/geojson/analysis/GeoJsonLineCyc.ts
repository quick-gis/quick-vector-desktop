import { CoreSplitLine } from './LineSplit';
import { CoreFindCyc } from './FindLineCyc';

/**
 *
 * @param d
 * @constructor
 */
export function GeoJsonLineWithOnceCyc(d: any) {
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

  return {
    type: 'FeatureCollection',
    features: e,
  };
}
