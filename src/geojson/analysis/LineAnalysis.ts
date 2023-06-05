const turf = require('@turf/turf');

export class LineAnalysis {
  /**
   * 完全重叠
   * @param geojson
   */
  findSelfFullOverlaps(geojson: any): any {
    const lineStrings: any[] = geojson.features.map((feature: any) => feature.geometry);

    const selfOverlaps: any[] = [];

    for (let i = 0; i < lineStrings.length; i++) {
      for (let j = i + 1; j < lineStrings.length; j++) {
        const lineStringA = turf.lineString(lineStrings[i].coordinates);
        const lineStringB = turf.lineString(lineStrings[j].coordinates);

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
        const lineStringA = turf.lineString(lineStrings[i].coordinates);
        const lineStringB = turf.lineString(lineStrings[j].coordinates);

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
      return this.findSelfFullOverlaps(geojson);
    } else {
      return this.findSelfPartialOverlaps(geojson);
    }
  }

  /**
   * 如果线上的点和其他线有接触(点和线相交)则表示这个线联通
   * @param featureCollection
   */
  checkMultiLineStringConnectivity(featureCollection: any): any[] {
    const connectedLines: any[] = [];

    for (let i = 0; i < featureCollection.features.length; i++) {
      const currentFeature = featureCollection.features[i];
      let isLineConnected = false;

      for (let j = 0; j < featureCollection.features.length; j++) {
        if (i === j) continue;

        const otherFeature = featureCollection.features[j];

        if (isLineConnectedToOtherLineForMultiLineString(currentFeature, otherFeature)) {
          isLineConnected = true;
          break;
        }
      }

      if (isLineConnected) {
        connectedLines.push(currentFeature);
      }
    }

    return connectedLines;
  }

  isLineConnectedToOtherLineForMultiLineString(line1: any, line2: any): boolean {
    if (areCoordinatesEqualForMultiLineString(line1.geometry.coordinates, line2.geometry.coordinates)) {
      return false;
    }

    const line1Coordinates =
      line1.geometry.type === 'LineString' ? [line1.geometry.coordinates] : line1.geometry.coordinates;
    const line2Coordinates =
      line2.geometry.type === 'LineString' ? [line2.geometry.coordinates] : line2.geometry.coordinates;

    for (const coords1 of line1Coordinates) {
      for (const coords2 of line2Coordinates) {
        for (const point of coords1) {
          if (isPointOnLineForMultiLineString(point, coords2)) {
            return true;
          }
        }

        for (const point of coords2) {
          if (isPointOnLineForMultiLineString(point, coords1)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  areCoordinatesEqualForMultiLineString(coordinates1: number[][], coordinates2: number[][]): boolean {
    if (coordinates1.length !== coordinates2.length) {
      return false;
    }

    for (let i = 0; i < coordinates1.length; i++) {
      const coord1 = coordinates1[i];
      const coord2 = coordinates2[i];

      if (coord1.length !== coord2.length) {
        return false;
      }

      if (!coord1.every((value, index) => value === coord2[index])) {
        return false;
      }
    }

    return true;
  }

  isPointOnLineForMultiLineString(point: number[], line: number[][]): boolean {
    const turfPoint = turf.point(point);
    const turfLine = turf.multiLineString(line);

    return turf.booleanPointOnLine(turfPoint, turfLine);
  }
}
