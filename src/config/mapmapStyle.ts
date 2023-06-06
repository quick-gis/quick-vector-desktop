import { Circle, Fill, RegularShape, Stroke, Style } from 'ol/style';
import { randomColor } from '../utils/Utils';

interface MapStyle {
  name: string;
  style: Style;
  type: 'point' | 'line' | 'polygon';
}

// todo: 思考样式序列化和反序列化

/**
 * 选中样式的静态表
 */
export const SelectedStyles = {
  point: new Style({
    image: new Circle({
      radius: 3, // 圆点的半径
      fill: new Fill({ color: randomColor() }), // 填充色
      stroke: new Stroke({ color: '#dadada', width: 2 }), // 边框样式
    }),
  }),
  line: new Style({
    stroke: new Stroke({
      color: randomColor(), // 线段的颜色
      width: 4, // 线段的宽度，即加粗的程度
    }),
  }),
  polygon: new Style({
    fill: new Fill({
      color: randomColor(), // 红色填充
    }),
    stroke: new Stroke({
      color: randomColor(), // 黑色边框
      width: 3.5, // 边框粗细为3
    }),
  }),
  //五角星
  wjx: new Style({
    image: new RegularShape({
      points: 5, // 顶点个数
      radius1: 20, // 外圈大小
      radius2: 10, // 内圈大小
      stroke: new Stroke({
        // 设置边的样式
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        // 设置五星填充样式
        color: 'blue',
      }),
    }),
  }),
  //十字架
  szj: new Style({
    image: new RegularShape({
      fill: new Fill({
        color: 'red',
      }), //填充色
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }), //边线样式
      points: 4, //边数
      radius: 10, //半径
      radius2: 0, //内半径
      angle: 0, //形状的角度(弧度单位)
    }),
  }),
  //X形状
  x: new Style({
    image: new RegularShape({
      fill: new Fill({
        color: 'red',
      }), //填充色
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }), //边线样式
      points: 4, //边数
      radius: 10, //半径
      radius2: 0, //内半径
      angle: Math.PI / 4, //形状的角度(弧度单位)
    }),
  }),
  // 三角形
  sjx: new Style({
    image: new RegularShape({
      fill: new Fill({
        color: 'red',
      }), //填充色
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }), //边线样式
      points: 3, //边数
      radius: 10, //半径
      angle: 0, //形状的角度(弧度单位)
    }),
  }),
};
