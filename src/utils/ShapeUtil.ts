const shapefile = require('shapefile');

export async function readShapefile(file: string) {
  const features = [];

  try {
    const source = await shapefile.open(file);
    let result = await source.read();

    while (!result.done) {
      features.push(result.value);
      result = await source.read();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features: features,
  };

  return featureCollection;
}
