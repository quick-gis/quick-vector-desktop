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
        [1, 0],
        [4, 4],
      ],
    ],
  },
};
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

function isMultiLinkedAndLineStringLinked(feature1: any, feature2: any): boolean {
  let f1Line = feature1.geometry.coordinates;
  let f2Line = feature2.geometry.coordinates;
  const tarStartPoint = f2Line[0];
  const tarEndPoint = f2Line[f2Line.length - 1];
  let checkOther = [];
  for (let l1 of f1Line) {
    const curStartPoint = l1[0];
    const curEndPoint = l1[l1.length - 1];
    let b =
      areArraysEqual(curEndPoint, tarEndPoint) ||
      areArraysEqual(curEndPoint, tarStartPoint) ||
      areArraysEqual(curStartPoint, tarEndPoint) ||
      areArraysEqual(curStartPoint, tarStartPoint);
    checkOther.push(b);
  }
  return checkOther.includes(true);
}
console.log(isMultiLinkedAndLineStringLinked(feature1, feature2));
