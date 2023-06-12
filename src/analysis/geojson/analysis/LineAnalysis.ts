import { CoreSplitLine } from './LineSplit';

const turf = require('@turf/turf');

export class LineAnalysis {
  /**
   * 图形形状检查，没有方向
   * @param featureCollection
   */
  public checkLinkage(featureCollection: any): any {
    const invalidFeatures = new Set();

    const arrays = [];

    for (let i = 0; i < featureCollection.features.length; i++) {
      const feature1 = featureCollection.features[i];

      if (feature1.geometry.type == 'MultiLineString') {
        // 自查子线是否自身全连接
        let b = this.checkMultiLineStringSelf(feature1);
        if (!b) {
          if (!invalidFeatures.has(feature1)) {
            invalidFeatures.add(feature1);
          }
          continue;
        }
      }

      // 循环内操作的都应该是feature1
      // 对比两个都是LineString的数据
      let b1 = this.checkLineStringWithLineString(feature1, featureCollection);
      if (b1 < 0) {
        if (!invalidFeatures.has(feature1)) {
          invalidFeatures.add(feature1);
          continue;
        }
      }
      let b2 = this.checkLineStringWithMultiLineString(feature1, featureCollection);
      if (b2 < 0) {
        if (!invalidFeatures.has(feature1)) {
          invalidFeatures.add(feature1);
          continue;
        }
      }

      let b3 = this.checkMultiLineStringWithMultiLineString(feature1, featureCollection);
      if (b3 < 0) {
        if (!invalidFeatures.has(feature1)) {
          invalidFeatures.add(feature1);
          continue;
        }
      }
      // todo: MultiLineString 和 LineString 对比
      let b4 = this.checkMultiLineStringWithLineString(feature1, featureCollection);
      if (b4 < 0) {
        if (!invalidFeatures.has(feature1)) {
          invalidFeatures.add(feature1);
          continue;
        }
      }
    }

    return invalidFeatures;
  }
  checkMultiLineStringWithMultiLineString(feature1: any, featureCollection: any): 0 | -1 | 1 {
    let checkOther = [];
    for (let j = 0; j < featureCollection.features.length; j++) {
      const feature2 = featureCollection.features[j];
      if (!this.areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
        if (feature1.geometry.type == 'MultiLineString' && feature2.geometry.type == 'MultiLineString') {
          let b1 = this.isMultiLinkedAndMultiLinked(feature1, feature2);
          checkOther.push(b1);
        }
      }
    }
    if (checkOther.length == 0) {
      return 0;
    }
    return checkOther.includes(true) ? 1 : -1;
  }
  isMultiLinkedAndMultiLinked(feature1: any, feature2: any): boolean {
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
          this.areArraysEqual(curEndPoint, tarEndPoint) ||
          this.areArraysEqual(curEndPoint, tarStartPoint) ||
          this.areArraysEqual(curStartPoint, tarEndPoint) ||
          this.areArraysEqual(curStartPoint, tarStartPoint);
        checkOther.push(b);
      }
      re.push(checkOther.includes(true));
    }
    return re.includes(true);
  }
  checkMultiLineStringWithLineString(feature1: any, featureCollection: any) {
    let checkOther = [];
    for (let j = 0; j < featureCollection.features.length; j++) {
      const feature2 = featureCollection.features[j];
      if (!this.areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
        if (feature1.geometry.type == 'MultiLineString' && feature2.geometry.type == 'LineString') {
          let b1 = this.isMultiLinkedAndLineStringLinked(feature1, feature2);
          checkOther.push(b1);
        }
      }
    }
    if (checkOther.length == 0) {
      return 0;
    }
    return checkOther.includes(true) ? 1 : -1;
  }
  isMultiLinkedAndLineStringLinked(feature1: any, feature2: any): boolean {
    let f1Line = feature1.geometry.coordinates;
    let f2Line = feature2.geometry.coordinates;
    const tarStartPoint = f2Line[0];
    const tarEndPoint = f2Line[f2Line.length - 1];
    let checkOther = [];
    for (let l1 of f1Line) {
      const curStartPoint = l1[0];
      const curEndPoint = l1[l1.length - 1];
      let b =
        this.areArraysEqual(curEndPoint, tarEndPoint) ||
        this.areArraysEqual(curEndPoint, tarStartPoint) ||
        this.areArraysEqual(curStartPoint, tarEndPoint) ||
        this.areArraysEqual(curStartPoint, tarStartPoint);
      checkOther.push(b);
    }
    return checkOther.includes(true);
  }

  /**
   * LineString 和 LineString 自查
   * @param feature1
   * @param featureCollection
   * @return 0 不要计算，-1没 1 有
   */
  checkLineStringWithLineString(feature1: any, featureCollection: any): number {
    let checkOther = [];

    for (let j = 0; j < featureCollection.features.length; j++) {
      const feature2 = featureCollection.features[j];
      if (!this.areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
        if (feature1.geometry.type == 'LineString' && feature2.geometry.type == 'LineString') {
          let b1 = this.isLineStringLinked(feature1, feature2);
          checkOther.push(b1);
        }
      }
    }
    if (checkOther.length == 0) {
      return 0;
    }
    return checkOther.includes(true) ? 1 : -1;
  }

  checkLineStringWithMultiLineString(feature1: any, featureCollection: any) {
    let checkOther = [];

    for (let j = 0; j < featureCollection.features.length; j++) {
      const feature2 = featureCollection.features[j];
      if (!this.areArraysEqual(feature1.geometry.coordinates, feature2.geometry.coordinates)) {
        if (feature1.geometry.type == 'LineString' && feature2.geometry.type == 'MultiLineString') {
          let b1 = this.isLineStringAndMultiLinked(feature1, feature2);
          checkOther.push(b1);
        }
      }
    }
    if (checkOther.length == 0) {
      return 0;
    }
    return checkOther.includes(true) ? 1 : -1;
  }

  isLineStringAndMultiLinked(lineString1: any, lineString2: any): boolean {
    const coordinates1 = lineString1.geometry.coordinates;
    const coordinates2 = lineString2.geometry.coordinates;
    const curStartPoint = coordinates1[0];
    const curEndPoint = coordinates1[coordinates1.length - 1];
    let checkOther = [];

    for (let line2 of coordinates2) {
      const tarStartPoint = line2[0];
      const tarEndPoint = line2[line2.length - 1];
      let b =
        this.areArraysEqual(curEndPoint, tarEndPoint) ||
        this.areArraysEqual(curEndPoint, tarStartPoint) ||
        this.areArraysEqual(curStartPoint, tarEndPoint) ||
        this.areArraysEqual(curStartPoint, tarStartPoint);
      checkOther.push(b);
    }
    return checkOther.includes(true);
  }

  isLineStringLinked(lineString1: any, lineString2: any): boolean {
    const coordinates1 = lineString1.geometry.coordinates;
    const coordinates2 = lineString2.geometry.coordinates;

    const startPoint1 = coordinates1[0];
    const endPoint1 = coordinates1[coordinates1.length - 1];
    const startPoint2 = coordinates2[0];
    const endPoint2 = coordinates2[coordinates2.length - 1];

    return (
      this.areArraysEqual(startPoint1, startPoint2) ||
      this.areArraysEqual(startPoint1, endPoint2) ||
      this.areArraysEqual(endPoint1, startPoint2) ||
      this.areArraysEqual(endPoint1, endPoint2)
    );
  }
  checkMultiLineStringSelf(feature: any): boolean {
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
        if (!this.areArraysEqual(line, line2)) {
          let b =
            this.areArraysEqual(curEndPoint, tarEndPoint) ||
            this.areArraysEqual(curEndPoint, tarStartPoint) ||
            this.areArraysEqual(curStartPoint, tarEndPoint) ||
            this.areArraysEqual(curStartPoint, tarStartPoint);
          checkOther.push(b);
        }
      }
      re.push(checkOther.includes(true));
    }

    return !re.includes(false);
  }
  areArraysEqual(arr1: [], arr2: []) {
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

  /**
   * 完全重叠
   * @param geojson
   */
  findSelfFullOverlaps(geojson: any): any {
    const lineStrings: any[] = geojson.features.map((feature: any) => feature.geometry);

    const selfOverlaps: any[] = [];

    for (let i = 0; i < lineStrings.length; i++) {
      for (let j = i + 1; j < lineStrings.length; j++) {
        let lineStringA;
        if (lineStrings[i].type == 'LineString') {
          lineStringA = turf.lineString(lineStrings[i].coordinates);
        } else if (lineStrings[i].type == 'MultiLineString') {
          lineStringA = turf.multiLineString(lineStrings[i].coordinates);
        }
        let lineStringB = null;
        if (lineStrings[j].type == 'LineString') {
          lineStringB = turf.lineString(lineStrings[j].coordinates);
        } else if (lineStrings[j].type == 'MultiLineString') {
          lineStringB = turf.multiLineString(lineStrings[j].coordinates);
        }

        if (turf.booleanContains(lineStringA, lineStringB) || turf.booleanContains(lineStringB, lineStringA)) {
          selfOverlaps.push(geojson.features[i]);
          selfOverlaps.push(geojson.features[j]);
        }
      }
    }
    return selfOverlaps;
  }

  /**
   * 部分重叠
   * @param geojson
   */
  findSelfPartialOverlaps(geojson: any): any {
    const lineStrings: any[] = geojson.features.map((feature: any) => feature.geometry);

    const selfOverlaps: any[] = [];

    for (let i = 0; i < lineStrings.length; i++) {
      for (let j = i + 1; j < lineStrings.length; j++) {
        let lineStringA;
        if (lineStrings[i].type == 'LineString') {
          lineStringA = turf.lineString(lineStrings[i].coordinates);
        } else if (lineStrings[i].type == 'MultiLineString') {
          lineStringA = turf.multiLineString(lineStrings[i].coordinates);
        }
        let lineStringB = null;
        if (lineStrings[j].type == 'LineString') {
          lineStringB = turf.lineString(lineStrings[j].coordinates);
        } else if (lineStrings[j].type == 'MultiLineString') {
          lineStringB = turf.multiLineString(lineStrings[j].coordinates);
        }

        if (turf.lineOverlap(lineStringA, lineStringB)) {
          selfOverlaps.push(geojson.features[i]);
          selfOverlaps.push(geojson.features[j]);
        }
      }
    }
    return selfOverlaps;
  }

  /**
   * 自重叠分析
   * @param geojson geojson
   * @param full 是否需要完全重叠，true: 完全重叠，false：部分重叠
   */
  findSelfOverlaps(geojson: any, full: boolean) {
    if (full) {
      return { type: 'FeatureCollection', features: this.findSelfFullOverlaps(geojson) };
    } else {
      return { type: 'FeatureCollection', features: this.findSelfPartialOverlaps(geojson) };
    }
  }
}
