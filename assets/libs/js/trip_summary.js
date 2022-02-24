const MAPBOX_KEY = "pk.eyJ1IjoibWFuaW51bWVyOCIsImEiOiJja24wZXE4dGIwbXU4Mm9tZjhhcjh0NjdpIn0.KEWE9FRHQIt6_NogL4ZhjQ";//"pk.eyJ1IjoibWFuaXZhbm5hbjIzMTExOTk2IiwiYSI6ImNqd29nMndzbDF1ZDE0YW81YjRkdGJzYjAifQ.mGMG-Bq2e2OSU3GrxrBUKg";
const MAX_ZOOM = 20;
const MIN_ZOOM = 5;
var catches = {};
var uiWords = {};

var map = L.map('map',{
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY, {
  maxZoom: MAX_ZOOM,
  id: 'mapbox/light-v10'
}).addTo(map);
L.tileLayer('http://127.0.0.1:'+PORT+'/gis/basemap_osm/osm/{z}/{x}/{y}.png', {
    maxNativeZoom: 11,
    maxZoom: MAX_ZOOM,
}).addTo(map);

var tripPointIcon = L.icon({
    iconUrl: 'http://127.0.0.1:'+PORT+'/libs/images/bookmarked-point.png',
    iconSize: [10, 10],
});
var tripPointBookmarkedIcon = L.icon({
    iconUrl: 'http://127.0.0.1:'+PORT+'/libs/images/star_dark.png',
    iconSize: [15, 15],
});
var startIcon = L.icon({
   iconUrl: 'http://127.0.0.1:'+PORT+'/libs/images/start-flag.png',
   iconSize: [20, 20],
   iconAnchor: [5, 17]
});
var endIcon = L.icon({
   iconUrl: 'http://127.0.0.1:'+PORT+'/libs/images/end-flag.png',
   iconSize: [20, 20],
   iconAnchor: [5, 17]
});

var currentPoints = null;
initiate()
function initiate(){
    if(typeof Android !== "undefined" && Android !== null) {
        Android.initiate();
    } else {
        alert("Not viewing in webview");
    }
}

function updateUnits(str){
    units = JSON.parse(str);
}

function setCurrentTrip(jsonArrStr){
    var pointsStrArr = JSON.parse(jsonArrStr);
    currentPoints = []
    for(var i=0;i<pointsStrArr.length;i++){
        var pointState = i==0?"first":i==(pointsStrArr.length-1)?"last":"mid";
        var location = JSON.parse(pointsStrArr[i])
        currentPoints.push([location[0], location[1]])
        addPoint([location[0], location[1]], location[2], location[3], location[4], pointState)
    }
    updateLine(currentPoints)
}
var route = null;
var routeDecorators = null;
function updateLine(points){
    if(route!=null){
        map.removeLayer(route)
    }
    route = L.polyline(points, {color: '#FFA94D'}).addTo(map);

    if(routeDecorators!=null){
        map.removeLayer(routeDecorators)
    }
    routeDecorators = L.polylineDecorator(points, {
        patterns: [
            { repeat: '70', symbol: L.Symbol.marker({rotate: true, markerOptions: {
                icon: L.icon({
                    iconUrl: 'http://127.0.0.1:'+PORT+'/libs/images/expand_arrow.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }})}
        ]
    }).addTo(map);
    map.fitBounds(route.getBounds());
//    map.setMaxBounds(COUNTRY_BOUNDS);
}
var pointMarkers = [];
function addPoint(point, tripId, isBookmarked, ts, pointState){
    var pointMarker = L.marker(point, {icon: isBookmarked?tripPointBookmarkedIcon:pointState==="first"?startIcon:pointState==="last"?endIcon:tripPointIcon, tripId: tripId}).addTo(map);

    if(isBookmarked && (pointState==='first' || pointState==='last')){
        var _pointMarker = L.marker(point, {icon: pointState==="first"?startIcon:endIcon}).addTo(map);
        _pointMarker.tripId = tripId;
        _pointMarker._ctStamp = ts;
        _pointMarker.isBookmarked = isBookmarked;
        _pointMarker.on('click', onMarkerClick)
        pointMarkers.push(_pointMarker)
    }

    pointMarker.tripId = tripId;
    pointMarker._ctStamp = ts;
    pointMarker.isBookmarked = isBookmarked;
    pointMarker.on('click', onMarkerClick)
    pointMarkers.push(pointMarker)
}
function onMarkerClick(e) {

    var tripPointId = e.target.tripId;
    var ts = e.target._ctStamp;
    var tsStr = (new Date(ts)).toLocaleString("in")
    var catchesArr = catches[tripPointId] || [];
    var htmlStr = "";
    var textStr = "";
    var latStr = UnitConverter.convertLocation(units.locationUnit, e.latlng.lat);
    var lngStr = UnitConverter.convertLocation(units.locationUnit, e.latlng.lng);
    if(e.target.isBookmarked){
        htmlStr += "<div style='text-align:left'>"
                +"<img onclick='Android.removeBookmark(\""+tripPointId+"\")' src='http://127.0.0.1:"+PORT+"/libs/images/star.png' width='15' />"
                +" " + latStr + ", " + lngStr + " <br/>" + tsStr
                +"</div>"
    }else{
        htmlStr += "<div style='text-align:right'>"
                +"<img onclick='Android.addBookmark(\""+tripPointId+"\")' src='http://127.0.0.1:"+PORT+"/libs/images/star_grey.png' width='15' />"
                +" " + latStr + ", " + lngStr + " <br/>" + tsStr
                +"</div>"
    }
    htmlStr += "<hr/>"
    for (var i = 0; i < catchesArr.length; i++) {
        textStr += catchesArr[i].fishType + ", " + UnitConverter.convertQuantity(units.quantityUnit, catchesArr[i].quantity) +"<br/>"
    }
    if(textStr==="")
        textStr += uiWords['no_catch'].name
    if(e.target.getPopup())
        e.target.unbindPopup()
    e.target.bindPopup(htmlStr + "<p>"+textStr+"</p>")
    e.target.openPopup();
}
function closeAllPopUps(){
    map.closePopup();
}
function clearAll(){
    for(var i=0;i<pointMarkers.length;i++){
        map.removeLayer(pointMarkers[i])
    }
    if(route!=null){
        map.removeLayer(route)
    }
}

function addTripPoint(location){
    currentPoints.push([location[0], location[1]])
    addPoint([location[0], location[1]])
    updateLine(currentPoints)
}

function updateCatches(data){
    data = JSON.parse(data)
    var sortedData = {};
    for (var i = 0; i < data.length; i++) {
        var tripPointId = data[i].tripPointId;
        var row = sortedData[tripPointId]
        if(!row){
            row = []
        }
        row.push(data[i])
        sortedData[tripPointId] = row;
    }
    catches = sortedData;
}

function updateUiWords(str){
    uiWords = JSON.parse(str);
}