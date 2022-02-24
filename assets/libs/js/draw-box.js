// var MAPBOX_KEY = "pk.eyJ1IjoibWFuaXZhbm5hbjIzMTExOTk2IiwiYSI6ImNqd29nMndzbDF1ZDE0YW81YjRkdGJzYjAifQ.mGMG-Bq2e2OSU3GrxrBUKg";
var MAX_ZOOM = 20;
var MIN_ZOOM = 5;
var map = L.map('map',{
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM,
  center: MAP_CENTER,
  zoom: MIN_ZOOM
});
var _maxArea = 250000.0

var portMarker = null;

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY, {
//   maxZoom: MAX_ZOOM,
//   id: 'mapbox/light-v10'
// }).addTo(map);

var editableLayers = new L.FeatureGroup();
var drawControl = new L.Control.Draw({
	draw: {
		polygon: false,
		marker: false,
		polyline: false,
		circle: false,
		circlemarker: false,
	},
	edit: {
		featureGroup: editableLayers,
		edit: true
	}
});
map.addControl(drawControl);
map.addLayer(editableLayers);


var layer = null;

map.on(L.Draw.Event.CREATED, function (event) {
    if(layer)
        map.removeLayer(layer);
    layer = event.layer;
    updateArea();
    editableLayers.addLayer(layer);
});

map.on(L.Draw.Event.EDITED, function (event) {
    updateArea();
});

map.on(L.Draw.Event.EDITMOVE, function (event) {
    updateArea();
});

map.on(L.Draw.Event.EDITRESIZE, function (event) {
    updateArea();
});

map.on(L.Draw.Event.EDITVERTEX, function (event) {
    updateArea();
});

map.on(L.Draw.Event.EDITSTOP, function (event) {
    updateArea();
});

map.on(L.Draw.Event.DRAWVERTEX, function (event) {
    updateArea();
});

map.on(L.Draw.Event.DRAWSTOP, function (event) {
    updateArea();
});

map.on(L.Draw.Event.DELETED, function (event) {
    clearArea();
});

map.on(L.Draw.Event.EDITCLICK, function (event) {
	_layer = event.layer;
	_marker = event.marker;
	if(_marker === _layer._moveMarker){
		return;
	}
	openModal(_marker.getLatLng().lat, _marker.getLatLng().lng)
});
initJs()

function updateArea(){
	if(!layer){
		clearArea()
		return
	}
	var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var areaKm2 = (area/1000000).toFixed(2);
    $('#info').html('Area: ' + areaKm2 + "Sq.Km");
    layer.setStyle({
        color: 'blue'
    });

    if(validateLayer()){
        var jsonStr = JSON.stringify(layer.toGeoJSON().geometry)
        var extentStr = layer.getBounds().toBBoxString()
        // Android.regionValidation("TRUE", area+"", jsonStr, extentStr)
        window.flutter_inappwebview.callHandler('regionDrawValidator', "TRUE", area+"", jsonStr, extentStr);
    }else{
        // Android.regionValidation("FALSE", "0", "", "")
        window.flutter_inappwebview.callHandler('regionDrawValidator', "FALSE", "0", "", "");
    }
}

function clearArea(){
	$('#info').html("");
    window.flutter_inappwebview.callHandler('regionDrawValidator', "FALSE", "0", "", "");
}



var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function openModal(lat, lng){
	$('#search-lat').val(lat.toFixed(4))
	$('#search-lng').val(lng.toFixed(4))
	modal.style.display = "block";
}
function closeModal(){
	modal.style.display = "none";
}
function validateDecimal(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  if(key==229 && evt.target.value.indexOf('.')>-1){
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
function confirmCoordinates(){
	closeModal();
	var lat = parseFloat($('#search-lat').val());
	var lng = parseFloat($('#search-lng').val());
	var latlng = new L.LatLng(lat, lng);
	var corners = _layer._getCorners(), marker = _marker, currentCornerIndex = marker._cornerIndex;
	_layer._oppositeCorner = corners[(currentCornerIndex + 2) % 4];
	_layer._shape.setBounds(L.latLngBounds((latlng), _layer._oppositeCorner));
	var bounds = _layer._shape.getBounds();
	_layer._moveMarker.setLatLng(bounds.getCenter());
	_layer._toggleCornerMarkers(0, currentCornerIndex);
	_layer.updateMarkers();
	_layer._fireEdit();
}

var bufferStart = 0;
var bufferEnd = 50000;
var MAX_AREA = 1000000;
var MIN_AREA = 5000;

function initJs(){
    // Android.initiate()
}

var portJson = null;
function showPort(portJsonStr, maxArea, geomStr){
    console.log(`Port Json Str from flutter ${geomStr}`);
    _maxArea = parseFloat(maxArea);
    try{
    portJson = JSON.parse(portJsonStr);
    }catch{
        portJson = portJsonStr;
    }
    try{
        geomStr = JSON.parse(geomStr);
    }catch(e){
        geomStr = null
        console.log("No data for existing region: ", geomStr);
    }
    if(portMarker)
        map.removeLayer(portMarker);
    if(layer)
            map.removeLayer(layer);
    var portLatLng = new L.LatLng(portJson.latitude, portJson.longitude);
    portMarker = L.marker([portJson.latitude, portJson.longitude]).addTo(map);
    portMarker.bindPopup("<b>Your port:</b>" + portJson.name);
    var destLatLngNorth = L.GeometryUtil.destination(portLatLng, 0, _maxArea*2/3);
    var destLatLngSouth = L.GeometryUtil.destination(portLatLng, 180, _maxArea*2/3);
    var destLatLngEast = L.GeometryUtil.destination(portLatLng, 90, _maxArea*2/3);
    var destLatLngWest = L.GeometryUtil.destination(portLatLng, 270, _maxArea*2/3);
    var topLeft = new L.LatLng(destLatLngNorth.lat, destLatLngWest.lng);
    var bottomRight = new L.LatLng(destLatLngSouth.lat, destLatLngEast.lng);
    var rectangle = L.rectangle([
                        topLeft,
                        bottomRight
                    ]);
    if(geomStr){
        //{"type":"Polygon","coordinates":[]}
        var coordinates = geomStr.coordinates;
        rectangle = L.rectangle([
                        new L.LatLng(coordinates[0][0][1], coordinates[0][0][0]),
                        new L.LatLng(coordinates[0][2][1], coordinates[0][2][0])
                    ]);
        console.log(JSON.stringify(coordinates))
    }
    rectangle.addTo(editableLayers);
    map.fitBounds(rectangle.getBounds());
    layer = rectangle
    updateArea()
    validateLayer()
    $('.leaflet-draw-edit-edit')[0].click()
}

function validateLayer(){
    var portLatLng = new L.LatLng(portJson.latitude, portJson.longitude);
    if(!isLatLngInsidePolygon(portLatLng, layer)){
        $('#info').html("Your port should be within the box chosen");
        layer.setStyle({
            color: 'red'
        });
        return false;
    }
    var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    area = area/1000000;
    if(area<5000){
        $('#info').html("Area should be greater than 5000 sq.km");
        layer.setStyle({
            color: 'red'
        });
        return false;
    }
    if(area>_maxArea){
        $('#info').html("Area should be less than "+Math.round(_maxArea)+" sq.km");
        layer.setStyle({
            color: 'red'
        });
        return false;
    }
    return true;
}

function isLatLngInsidePolygon(latLng, poly) {
    var polyPoints = poly.getLatLngs()[0];
    var x = latLng.lat, y = latLng.lng;

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function setMaxArea(maxArea){
    _maxArea = parseFloat(maxArea)
    console.log(_maxArea)
}

function add12nmLayer(res){
    try {
        L.geoJSON(JSON.parse(res).geom, {
            "color": "#666",
            "weight": 1,
            "opacity": 0.65,
            "fill": false
        }).addTo(map);
    } catch (error) {
        L.geoJSON(res.geom, {
            "color": "#666",
            "weight": 1,
            "opacity": 0.65,
            "fill": false
        }).addTo(map);
    }
}

function addEezLayer(res){
    try {
        L.geoJSON(JSON.parse(res).geom, {
            "color": "#666",
            "fillColor": "#01C204",
            "weight": 1,
            "opacity": 0.65,
            "fill": false
        }).addTo(map);
    } catch (error) {
        L.geoJSON(res.geom, {
            "color": "#666",
            "fillColor": "#01C204",
            "weight": 1,
            "opacity": 0.65,
            "fill": false
        }).addTo(map);
    }
}

var bmLayer = null;
function addBasemap(pmTilesUrl, styleStr){
    let json_style = JSON.parse(styleStr);
    let result = protomaps.json_style(json_style,{})
    const p = new protomaps.PMTiles(pmTilesUrl)
    p.metadata().then(m => {
        let bounds_str = m.bounds.split(',')
        let bounds = [[+bounds_str[1],+bounds_str[0]],[+bounds_str[3],+bounds_str[2]]]
        bmLayer = new protomaps.LeafletLayer({url:p,bounds:bounds, paint_rules:result.paint_rules,label_rules:result.label_rules})
        bmLayer.addTo(map)
    });
}