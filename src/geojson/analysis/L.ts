function checkLinkage(featureCollection: any): any {
  const invalidFeatures = new Set();

  const arrays = [];

  for (let i = 0; i < featureCollection.features.length; i++) {
    const feature1 = featureCollection.features[i];

    if (feature1.geometry.type == 'MultiLineString') {
      // 自查子线是否自身全连接
      let b = checkMultiLineStringSelf(feature1);
      if (!b) {
        if (!invalidFeatures.has(feature1)) {
          invalidFeatures.add(feature1);
        }
        continue;
      }
    }

    // 循环内操作的都应该是feature1
    // 对比两个都是LineString的数据
    let b1 = checkLineStringWithLineString(feature1, featureCollection);
    if (b1 < 0) {
      if (!invalidFeatures.has(feature1)) {
        invalidFeatures.add(feature1);
        continue;
      }
    }
    let b2 = checkLineStringWithMultiLineString(feature1, featureCollection);
    if (b2 < 0) {
      if (!invalidFeatures.has(feature1)) {
        invalidFeatures.add(feature1);
        continue;
      }
    }

    let b3 = checkMultiLineStringWithMultiLineString(feature1, featureCollection);
    if (b3 < 0) {
      if (!invalidFeatures.has(feature1)) {
        invalidFeatures.add(feature1);
        continue;
      }
    }
  }

  return invalidFeatures;
}
function checkMultiLineStringWithMultiLineString(feature1: any, featureCollection: any): 0 | -1 | 1 {
  let checkOther = [];
  for (let j = 0; j < featureCollection.features.length; j++) {
    const feature2 = featureCollection.features[j];
    if (!areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
      if (feature1.geometry.type == 'MultiLineString' && feature2.geometry.type == 'MultiLineString') {
        let b1 = isMultiLinkedAndMultiLinked(feature1, feature2);
        checkOther.push(b1);
      }
    }
  }
  if (checkOther.length == 0) {
    return 0;
  }
  return checkOther.includes(true) ? 1 : -1;
}
function isMultiLinkedAndMultiLinked(feature1: any, feature2: any): boolean {
  // todo
  let f1Lines = feature1.geometry.coordinates;
  let f2Lines = feature2.geometry.coordinates;

  let re = [];

  for (let l1 of f1Lines) {
    const curStartPoint = l1[0];
    const curEndPoint = l1[l1.length - 1];

    let checkOther = [];

    for (let l2 of f2Lines) {
      const tarStartPoint = l2[0];
      const tarEndPoint = l2[l2.length - 1];
      let b =
        areArraysEqual(curEndPoint, tarEndPoint) ||
        areArraysEqual(curEndPoint, tarStartPoint) ||
        areArraysEqual(curStartPoint, tarEndPoint) ||
        areArraysEqual(curStartPoint, tarStartPoint);
      checkOther.push(b);
    }
    re.push(checkOther.includes(true));
  }
  return re.includes(true);
}

/**
 * LineString 和 LineString 自查
 * @param feature1
 * @param featureCollection
 * @return 0 不要计算，-1没 1 有
 */
function checkLineStringWithLineString(feature1: any, featureCollection: any): number {
  let checkOther = [];

  for (let j = 0; j < featureCollection.features.length; j++) {
    const feature2 = featureCollection.features[j];
    if (!areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
      if (feature1.geometry.type == 'LineString' && feature2.geometry.type == 'LineString') {
        let b1 = isLineStringLinked(feature1, feature2);
        checkOther.push(b1);
      }
    }
  }
  if (checkOther.length == 0) {
    return 0;
  }
  return checkOther.includes(true) ? 1 : -1;
}

function checkLineStringWithMultiLineString(feature1: any, featureCollection: any) {
  let checkOther = [];

  for (let j = 0; j < featureCollection.features.length; j++) {
    const feature2 = featureCollection.features[j];
    if (!areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
      if (feature1.geometry.type == 'LineString' && feature2.geometry.type == 'MultiLineString') {
        let b1 = isLineStringAndMultiLinked(feature1, feature2);
        checkOther.push(b1);
      }
    }
  }
  if (checkOther.length == 0) {
    return 0;
  }
  return checkOther.includes(true) ? 1 : -1;
}

function isLineStringAndMultiLinked(lineString1: any, lineString2: any): boolean {
  const coordinates1 = lineString1.geometry.coordinates;
  const coordinates2 = lineString2.geometry.coordinates;
  const curStartPoint = coordinates1[0];
  const curEndPoint = coordinates1[coordinates1.length - 1];
  let checkOther = [];

  for (let line2 of coordinates2) {
    const tarStartPoint = line2[0];
    const tarEndPoint = line2[line2.length - 1];
    let b =
      areArraysEqual(curEndPoint, tarEndPoint) ||
      areArraysEqual(curEndPoint, tarStartPoint) ||
      areArraysEqual(curStartPoint, tarEndPoint) ||
      areArraysEqual(curStartPoint, tarStartPoint);
    checkOther.push(b);
  }
  return checkOther.includes(true);
}

function isLineStringLinked(lineString1: any, lineString2: any): boolean {
  const coordinates1 = lineString1.geometry.coordinates;
  const coordinates2 = lineString2.geometry.coordinates;

  const startPoint1 = coordinates1[0];
  const endPoint1 = coordinates1[coordinates1.length - 1];
  const startPoint2 = coordinates2[0];
  const endPoint2 = coordinates2[coordinates2.length - 1];

  return (
    areArraysEqual(startPoint1, startPoint2) ||
    areArraysEqual(startPoint1, endPoint2) ||
    areArraysEqual(endPoint1, startPoint2) ||
    areArraysEqual(endPoint1, endPoint2)
  );
}
function checkMultiLineStringSelf(feature: any): boolean {
  const geometry = feature.geometry;

  const coordinates = geometry.coordinates;

  if (coordinates.length == 1) {
    return true;
  }
  let re = [];
  for (const line of coordinates) {
    const curStartPoint = line[0];
    const curEndPoint = line[line.length - 1];
    let checkOther = [];

    for (const line2 of coordinates) {
      const tarStartPoint = line2[0];
      const tarEndPoint = line2[line2.length - 1];
      // 不相同对比
      if (!areArraysEqual(line, line2)) {
        let b =
          areArraysEqual(curEndPoint, tarEndPoint) ||
          areArraysEqual(curEndPoint, tarStartPoint) ||
          areArraysEqual(curStartPoint, tarEndPoint) ||
          areArraysEqual(curStartPoint, tarStartPoint);
        checkOther.push(b);
      }
    }
    re.push(checkOther.includes(true));
  }

  return !re.includes(false);
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

// 示例数据
const geoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      propties: {
        id: '1',
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [1, 9],
            [4, 4],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      propties: {
        id: '2',
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [1, 9],
            [4, 2],
          ],
          [
            [4, 4],
            [1, 2],
          ],
        ],
      },
    },
  ],
};

const disconnectedLines = checkLinkage(geoJson);
console.log(disconnectedLines);
