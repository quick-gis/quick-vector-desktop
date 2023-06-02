/**
 * 防抖函数
 * @param func 方法
 * @param delay 单位ms
 */
export function debounce(func: Function, delay: number) {
  let timer: number;
  console.log('aaaaa');
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// 生成随机颜色
export function randomColor() {
  var randomNum = Math.floor(Math.random() * 16777216);
  var hexColor = randomNum.toString(16).padStart(6, '0');
  return '#' + hexColor;
}
