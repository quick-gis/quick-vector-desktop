const feature2 = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [1, 9],
      [4, 4],
    ],
  },
};
const feature1 = {
  type: 'Feature',
  geometry: {
    type: 'MultiLineString',
    coordinates: [
      [
        [1, 2],
        [4, 2],
      ],
      [
        [4, 1],
        [1, 2],
        [1, 3],
        [1, 2],
      ],
      [
        [4, 2],
        [4, 4],
      ],
    ],
  },
};
/**
 * 判断是否链接
 */
function isFlowLinked(curEndPoint: [], tarStartPoint: []): boolean {
  // 线1的终点是线2的起点，
  return areArraysEqual(curEndPoint, tarStartPoint);
}
function areArraysEqual(arr1: [], arr2: []) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function extracted(le1: any, le2: any) {
  const curEndPoint = le1[le1.length - 1];
  const tarStartPoint = le2[0];
  return isFlowLinked(curEndPoint, tarStartPoint);
}

/**
 * 检查两个LineString流向是否链接
 */
function isLineStringAndLineStringFlowLinked(feat1: any, feat2: any): boolean {
  let le1 = feat1.geometry.coordinates;
  let le2 = feat1.geometry.coordinates;
  return extracted(le1, le2);
}

function MultiLineStringSelfFlowLinked(feat1: any) {
  let le1 = feat1.geometry.coordinates;
  let re = [];
  for (let line1 of le1) {
    let checkOut = [];
    for (let line2 of le1) {
      if (!areArraysEqual(line1, line2)) {
        // let b = extracted(line1, line2);
        checkOut.push(b);
      }
    }
    re.push(checkOut.includes(true));
  }
  return !re.includes(false);
}

console.log(MultiLineStringSelfFlowLinked(feature1));
