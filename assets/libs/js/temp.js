// setTimeout(() => {
//     this.newGroup = L.featureGroup();
//     // var newGroup = L.layerGroup();
//     console.log('this.nav_dashboard.level1', this.nav_dashboard.level1)

//     console.log('this.nav_dashboard.regionTriggger', this.nav_dashboard.regionTriggger)
//     var layyeerr;
//     //for geometryregion

//     for (var j = 0; j < geomData['data']['geometryData'].length; j++) {


//         this.popup1 = this.vectorClickInfo.bind(this, [
//             userId,

//         ]);

//         L.geoJSON(<GeoJSON.Geometry>geomData['data']['geometryData'][j]['geometry'], {
//             onEachFeature : this.onEachFeature.bind(this,geomData['data']['geometryData'][j])  
                                    
//                                     });

//             //  newGroup.bindPopup('x'+j);
//             // start or click popup
//             this.newGroup.addTo(this.mapCompStorage.map);
//                               }
//       //  for geometry region end
                  
//                   },1000)