const canvas = document.getElementById('map');
const map = new harp.MapView({
   canvas,
   theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json",
   projection: harp.sphereProjection,
   //For tile cache optimization:
   maxVisibleDataSourceTiles: 40, 
   tileCacheSize: 100
});

map.setCameraGeolocationAndZoom(
   new harp.GeoCoordinates(51.384880, -2.361970),
   //(51.384880, -2.361970),
   4
);

// Animation creator - set location, coordinated, += is speed
// const options = { tilt: 45, distance: 3000 };
// const coordinates = new harp.GeoCoordinates(1.278676, 103.850216);
// let azimuth = 300;
// map.addEventListener(harp.MapViewEventNames.Render, () => {
//    map.lookAt(coordinates, options.distance, options.tilt, (azimuth += 0.1))
// });
// map.beginAnimation(); 

const mapControls = new harp.MapControls(map);
const ui = new harp.MapControlsUI(mapControls);
canvas.parentElement.appendChild(ui.domElement);

mapControls.maxPitchAngle = 90;

map.resize(window.innerWidth, window.innerHeight);
window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

const omvDataSource = new harp.OmvDataSource({
   baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
   apiFormat: harp.APIFormat.XYZOMV,
   styleSetName: "tilezen",
   authenticationCode: 'ADvWfRguTjyvUs1Bu4_BnQA',
});
map.addDataSource(omvDataSource);

//Static data source
fetch('https://services5.arcgis.com/bzwep0FCMnTql4lO/ArcGIS/rest/services/FranceCityLayer/FeatureServer/0/query?where=FID%3E0&outFields=City,Efficity_Price_estimate____m2_&token=9E3zHsff1L4zdRusC6gCUMPLcDeZ4qVleCjtp63AL-iOeQ3FNQvpOirWvUgEVCem0_1IcOyjO5-MGHT3wrTt6FtVQdNsBsTPG1reoEInl2UL6oBeTkPITYHZCMl2Uqknv34kf9CB-XYGqtFi1wYAWzYpJWRBgKX0glkeNZzFH8JHFOm_EhD8z7pZVhmSBP7vDuzZJxtT0HaUaTh6t_MtZ52QNsTTLfm9F2nty2J-l1s9w9ytc-TwqaAud2XDcryqJdTnJxDlWvYD1KIleiTmdw..&f=geojson')
.then(data => data.json())
.then(data => {
   const geoJsonDataProvider = new harp.GeoJsonDataProvider("wireless-hotspots", data);
   const geoJsonDataSource = new harp.OmvDataSource({
      dataProvider: geoJsonDataProvider,
      name: "wireless-hotspots"
   });

   map.addDataSource(geoJsonDataSource).then(() => {
   const styles = [{
      when: "$geometryType == 'point'",
      technique: "circles",
      renderOrder: 10000,
      attr: {
         color: "#7ED321",
         size: 15
      }
   }]
   geoJsonDataSource.setStyleSet(styles);
   map.update();
});
})

// })

// //Tile data source - works
// const FranceCertines = new harp.OmvDataSource({
//    baseUrl: "https://xyz.api.here.com/hub/spaces/Yxjq5z5w/tile/web",
//    apiFormat: harp.APIFormat.XYZSpace,
//    authenticationCode: 'AEBbqV9MQSStWBv9XcJD8AA', //Use this token!
// });

// map.addDataSource(FranceCertines).then(() => {
//    const styles = [{
//       when: "$geometryType == 'point'",
//       technique: "circles",
//       renderOrder: 10000,
//       attr: {
//          color: "#BA55D3",
//          size: 30
//       }
//    }]


// //Tile data source - API attempt
// const FranceCertines = new harp.OmvDataSource({
//    baseUrl: "https://xyz.api.here.com/hub/spaces/Yxjq5z5w/tile/web",
//    apiFormat: harp.APIFormat.XYZSpace,
//    authenticationCode: 'AEBbqV9MQSStWBv9XcJD8AA', //Use this token!
// });

// map.addDataSource(FranceCertines).then(() => {
//    const styles = [{
//       when: "$geometryType == 'point'",
//       technique: "circles",
//       renderOrder: 10000,
//       attr: {
//          color: "#BA55D3",
//          size: 30
//       }
//    }]


//    FranceCertines.setStyleSet(styles);
//    map.update();
// });

// Styling didn't work
// map.addDataSource(globalRailroads).then(() => {
//    const styles = [
//       {
//          "when": "$geometryType ^= 'line' && properties.status == 'Open'",
//          "renderOrder": 1000,
//          "technique": "solid-line",
//          "attr": {
//             "color": "#50E3C2",
//             "transparent": true,
//             "opacity": 1,
//             "metricUnit": "Pixel",
//             "lineWidth": 1
//          }
//       },
//       {
//          "when": "$geometryType ^= 'line' && properties.status == 'Closed' || properties.status == 'Unknown'",
//          "renderOrder": 1000,
//          "technique": "solid-line",
//          "attr": {
//             "color": "#D63060",
//             "transparent": true,
//             "opacity": 1,
//             "metricUnit": "Pixel",
//             "lineWidth": 1
//          }
//       }
//    ]
//    globalRailroads.setStyleSet(styles);
//    map.update();
// });