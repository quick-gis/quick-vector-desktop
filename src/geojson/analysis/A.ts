function isMultiLinkedAndMultiLinked(feature1: any, feature2: any): boolean {
  // 1. 拆解 feat1 的坐标元素
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

const feature1 = {
  type: 'Feature',
  geometry: {
    type: 'MultiLineString',
    coordinates: [
      [
        [1, 9],
        [4, 4],
      ],
    ],
  },
};
const feature2 = {
  type: 'Feature',
  geometry: {
    type: 'MultiLineString',
    coordinates: [
      [
        [1, 9],
        [4, 2],
      ],
      [
        [1, 0],
        [4, 6],
      ],
    ],
  },
};

console.log(isMultiLinkedAndMultiLinked(feature1, feature2));
