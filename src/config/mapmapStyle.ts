import Style from 'ol/style/Style.js';

interface MapStyle {
  name: string;
  style: Style;
  type: 'point' | 'line' | 'polygon';
}
// todo: 思考样式序列化和反序列化
