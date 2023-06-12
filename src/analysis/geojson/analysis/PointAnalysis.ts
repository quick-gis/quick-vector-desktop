export class PointAnalysis {
  /**
   * 属性重复使用
   * @param geojson
   * @param attributeField
   */
  filterFeaturesByAttribute(geojson: any, attributeField: string): [] {
    const features = geojson.features;

    return features.filter((feature: any) => {
      const attributeValue = feature.properties[attributeField];
      return features.some((f: any) => f !== feature && f.properties[attributeField] === attributeValue);
    });
  }

  /**
   * 坐标重复使用
   * @param geojson
   */
  findFeaturesWithSameCoordinates(geojson: any): [] {
    // 获取所有要素
    const features = geojson.features;

    // 用于存储具有相同坐标的要素
    const featuresWithSameCoordinates: any = [];

    // 比较要素的坐标是否相同
    for (let i = 0; i < features.length - 1; i++) {
      for (let j = i + 1; j < features.length; j++) {
        if (this.coordinatesMatch(features[i].geometry.coordinates, features[j].geometry.coordinates)) {
          featuresWithSameCoordinates.push(features[i], features[j]);
        }
      }
    }

    // 返回具有相同坐标的要素
    return featuresWithSameCoordinates;
  }

  private coordinatesMatch(coords1: [], coords2: []): boolean {
    if (coords1.length !== coords2.length) {
      return false;
    }
    return coords1.every((value, index) => value === coords2[index]);
  }
}
