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

const feature = {
  type: 'Feature',
  geometry: {
    type: 'MultiLineString',
    coordinates: [
      [
        [1, 3],
        [4, 4],
      ],
      [
        [4, 8],
        [1, 3],
      ],
      [
        [1, 2],
        [1, 3],
      ],
    ],
  },
};

const isLinked = checkMultiLineStringSelf(feature);
console.log(isLinked);
