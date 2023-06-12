const count = new Map();

export function saveBufferCount(layerName: string) {
  if (count.has(layerName)) {
    const currentCount = count.get(layerName) as number;
    count.set(layerName, currentCount + 1);
  } else {
    count.set(layerName, 1);
  }
  return count.get(layerName);
}
