# Quick Vector Editor

This project is based on `Electron`, `VUE`, `OpenLayers`, `jsts`. The project is developed using the `EPSG:4326(WGS84)` coordinate system.

## Function list
- CSV mapping (supports production with and without coordinate data in the source file)
  - [x] Point mapping
  - [x] Line plotting
- EXCEL plotting (in the same way as CSV)
  - [ ] Point plot
  - [ ] Line charting
- [ ] MYSQL database charting
- [ ] WMS/WMST Preview
- Export
  - [ ] Export SHP
  - [ ] Export GeoJson
- Skymap
  - [x] Skymap Secret Key Configuration
  - [x] Skymap vector map loading
  - [ x ] Skymap image loading
  - [ ] Skymap Coordinate Pickup
  - [ ] Sky map address encoding (input address to get coordinates)
- Main Window
  - [x] Layer tree
  - [x] Properties window
  - Attribute table window
    - [ ] Attribute calculation
    - [ ] Attribute Search
    - [ ] Positioning
    - [ ] Value Change
    - [ ] Add Field
    - [ ] Delete Fields
    - [ ] Hide/Show Fields
- Edit
  - Crop
    - [ ] Line cropping
    - [ ] Face Crop
  - [ ] Copy Elements
  - [ ] Delete element
  - [ ] Modify elements (properties, coordinates)
  - Coordinate conversion
    - [ ] WGS84
    - [ ] Baidu Map
    - [ ] Gaode Map
    - [ ] EPSG coordinates
- Analysis
  - Isolated Point Analysis
    - [ ] Attribute isolation
    - [ ] Spatial Isolation
  - [ ] Superposition analysis
  - [ ] Connectivity analysis (valid for line segments)
- Service Release
  - [ ] GeoServer Release

## License
[License](LICENSE)
