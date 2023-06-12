/**
 * 拆线工具，将LineString或者MultiLineString拆分为只有起点终点的线
 */

/**
 * let d = [
 *       [1, 9],
 *       [4, 4],
 *       [4, 9],
 *     ]
 */
function splitLineString(d: any) {
  return connectPoints(d);
}

function splitMultiLineString(d: any) {
  let res = [];
  for (let dt of d) {
    res.push(...connectPoints(dt));
  }
  return res;
}

function connectPoints(points: any): [] {
  const connections: any = [];

  for (let i = 0; i < points.length - 1; i++) {
    const startPoint: any = points[i];
    const endPoint: any = points[i + 1];
    const connection: any = {
      start: {
        x: startPoint[0],
        y: startPoint[1],
      },
      end: {
        x: endPoint[0],
        y: endPoint[1],
      },
    };
    connections.push(connection);
  }

  return connections;
}

export function CoreSplitLine(d: any) {
  if (d.type == 'FeatureCollection') {
    let r = [];
    for (let o of d.features) {
      r.push(...CoreSplitLine(o));
    }
    return r;
  }

  let type = d.geometry.type;
  if (type == 'LineString') {
    return splitLineString(d.geometry.coordinates);
  } else if (type == 'MultiLineString') {
    return splitMultiLineString(d.geometry.coordinates);
  }
  return null;
}
