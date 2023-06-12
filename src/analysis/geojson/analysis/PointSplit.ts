import { CoreSplitLine } from './LineSplit';
function splitPoint(d: any) {
  return d;
}
export function CoreSplitPoint(d: any) {
  if (d.type == 'FeatureCollection') {
    let r = [];
    for (let o of d.features) {
      r.push(...CoreSplitLine(o));
    }
    return r;
  }

  let type = d.geometry.type;
  if (type == 'Point') {
    return splitPoint(d.geometry.coordinates);
  }
  return null;
}
