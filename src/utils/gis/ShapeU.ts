const shapefile = require('shapefile');

async function readShapefile(file: string) {
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

// (async () => {
//   try {
//     const file =
//       '/Users/zhangsan/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/3e1688e41a37b2106df8b4a1c2cd0794/Message/MessageTemp/52c0e88570fd6a7c3a9cb231cb8ebbc2/File/lanxi0602/Lanxiline-20230602.shp';
//
//     const result = await readShapefile(file);
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// })();
