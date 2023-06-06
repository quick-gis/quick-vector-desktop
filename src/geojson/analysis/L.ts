function checkLinkage(featureCollection: any): any[] {
  const invalidFeatures: any[] = [];

  for (let i = 0; i < featureCollection.features.length; i++) {
    const feature1 = featureCollection.features[i];

    if (feature1.geometry.type == 'MultiLineString') {
      // 自查子线是否自身全连接
      let b = checkMultiLineStringSelf(feature1);
      if (!b) {
        invalidFeatures.push(feature1);
      }
    }

    // 循环内操作的都应该是feature1
    // 对比两个都是LineString的数据
    let b1 = checkLineStringWithLineString(feature1, featureCollection);
    if (!b1) {
      invalidFeatures.push(feature1);
    }

    console.log();
  }

  return invalidFeatures;
}

/**
 * LineString 和 LineString 自查
 * @param feature1
 * @param featureCollection
 */
function checkLineStringWithLineString(feature1: any, featureCollection: any) {
  let checkOther = [];

  for (let j = 0; j < featureCollection.features.length; j++) {
    const feature2 = featureCollection.features[j];
    if (feature1.geometry.type == 'LineString' && feature2.geometry.type == 'LineString') {
      if (!areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
        let b1 = isLineStringLinked(feature1, feature2);
        checkOther.push(b1);
      }
    }
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
        type: 'LineString',
        coordinates: [
          [1, 3],
          [4, 4],
        ],
      },
    },
    {
      type: 'Feature',
      propties: {
        id: '2',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1, 31],
          [4, 1],
        ],
      },
    },
  ],
};

const disconnectedLines = checkLinkage(geoJson);
console.log(disconnectedLines);
