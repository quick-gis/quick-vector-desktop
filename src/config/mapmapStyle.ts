import { Circle, Fill, Stroke, Style } from 'ol/style';

interface MapStyle {
  name: string;
  style: Style;
  type: 'point' | 'line' | 'polygon';
}

// todo: 思考样式序列化和反序列化

/**
 * 选中样式的静态表
 */
const SelectedStyles = {
  point: new Style({
    image: new Circle({
      radius: 6, // 圆点的半径
      fill: new Fill({ color: '#fd0606' }), // 填充色
      stroke: new Stroke({ color: '#000', width: 2 }), // 边框样式
    }),
  }),
  line: new Style({
    stroke: new Stroke({
      color: '#fd0606', // 线段的颜色
      width: 4, // 线段的宽度，即加粗的程度
    }),
  }),
  polygon: new Style({
    fill: new Fill({
      color: '#FF0000', // 红色填充
    }),
    stroke: new Stroke({
      color: '#000000', // 黑色边框
      width: 3, // 边框粗细为3
    }),
  }),
};
