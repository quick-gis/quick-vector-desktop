// @ts-ignore
import jsts from 'jsts';
import Geometry = jsts.geom.Geometry;
import Coordinate = jsts.geom.Coordinate;
import Point = jsts.geom.Point;

let wktReader = new jsts.io.WKTReader();
let wktWriter = new jsts.io.WKTWriter();

let geojsonReader = new jsts.io.GeoJSONReader();
let geojsonWriter = new jsts.io.GeoJSONWriter();

export function GeoJsonRead(source: Geometry) {
  return geojsonReader.read(source);
}

export function GeoJsonWrite(source: Geometry) {
  return geojsonWriter.write(source);
}

/**
 * wkt to Geometry
 * @param {string}  wkt
 * @return {Geometry}
 * @constructor
 */
export function WktToGeometry(wkt: string): Geometry {
  return wktReader.read(wkt);
}

/**
 * Geometry to wkt
 * @param source
 * @constructor
 */
export function GeometryToWkt(source: Geometry): string {
  return wktWriter.write(source);
}

/**
 * 叠加分析
 * @param {Geometry} source 被测
 * @param {Geometry} target 基准
 * @return true: 重叠，false: 不重叠
 * @constructor
 */
export function Overlay(source: Geometry, target: Geometry): boolean {
  return target.overlaps(source);
}

/**
 * 缓冲区
 * @param {Geometry} source 原始对象
 * @param len 扩充
 * @constructor
 */
export function Buffer(source: Geometry, len: number): Geometry {
  return source.buffer(len);
}

/**
 * 取交集
 * @param source
 * @param target
 * @constructor
 */
export function Intersects(source: Geometry, target: Geometry): Geometry {
  return source.intersection(target);
}

/**
 * 补集
 * @param source
 * @param target
 * @constructor
 */
export function Difference(source: Geometry, target: Geometry): Geometry {
  return source.difference(target);
}

/**
 * 合并要素
 * @param source
 * @param target
 * @constructor
 */
export function Union(source: Geometry, target: Geometry): Geometry {
  return source.union(target);
}

/**
 * 获取所有点集合
 * @param source
 * @constructor
 */
export function GetPoints(source: Geometry): Coordinate[] {
  return source.getCoordinates();
}

/**
 * 获取面积
 * @param source
 * @constructor
 */
export function GetArea(source: Geometry): number {
  return source.getArea();
}

/**
 * 获取长度
 * @param source
 * @constructor
 */
export function GetLength(source: Geometry): number {
  return source.getLength();
}

/**
 * 获取简单外接矩形
 * @param source
 * @constructor
 */
export function SimpleExternalRectangle(source: Geometry): Geometry {
  return source.getEnvelope();
}

/**
 * 获取中心点
 * @param source
 * @constructor
 */
export function GetCenter(source: Geometry): Point {
  return source.getCentroid();
}

/**
 * 凸包
 * @param source
 * @constructor
 */
export function ConvexHull(source: Geometry): Geometry {
  return source.convexHull();
}

export function SingPoint(source: Point, target: Geometry) {
  return Overlay(source, target);
}
