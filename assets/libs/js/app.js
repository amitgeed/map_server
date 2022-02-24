// const MAPBOX_KEY = "pk.eyJ1IjoibWFuaW51bWVyOCIsImEiOiJja24wZXE4dGIwbXU4Mm9tZjhhcjh0NjdpIn0.KEWE9FRHQIt6_NogL4ZhjQ";//"pk.eyJ1IjoibWFuaXZhbm5hbjIzMTExOTk2IiwiYSI6ImNqd29nMndzbDF1ZDE0YW81YjRkdGJzYjAifQ.mGMG-Bq2e2OSU3GrxrBUKg";
// const MAPBOX_KEY = "pk.eyJ1IjoibWFuaS1udW1lcjgiLCJhIjoiY2t1bTd4Zmk5MGJ0ZjJ3cGk4azUwcGN1dCJ9.aZG8b4U6WwJygbDqSDriWQ";
var MAX_ZOOM = 14;
var MIN_ZOOM = 5;
var searchLocationType = "DEGREES_MINUTES_SECONDS";
var weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";
let pmTilesUrl = null;
/**  500 Km buffer distance  **/
var TIDE_MAXIMUM_BUFFER = 500 * 1000;

var MAP_BOUNDS = null;
var IN_MAP_BOUNDS = "63.873177,37.105878,96.476435,6.081502";
var allLayerData = {};
var collisionLayer = L.LayerGroup.collision({ margin: 5 });
var hoursValues = [];
var dateValues = [];
var timestamps = [];
var subscriptionAccess = [];

/***  Holds active panel: layer_list_panel, bottom_panel, search_panel  ***/
var activePanel = null;

var map = null;
var marker = null;
var gpsIcon = L.icon({
    iconUrl: '../libs/images/gps_marker.png',
    iconSize: [40, 40],
});
var deviceGpsIcon = L.icon({
    iconUrl: '../libs/images/device_gps_icon.png',
    iconSize: [40, 40],
});
var tripPointIcon = L.icon({
    iconUrl: '../libs/images/bookmarked-point.png',
    iconSize: [10, 10],
});
var tripPointBookmarkedIcon = L.icon({
    iconUrl: '../libs/images/star_dark.png',
    iconSize: [15, 15],
});
var startIcon = L.icon({
    iconUrl: '../libs/images/start-flag.png',
    iconSize: [20, 20],
    iconAnchor: [5, 17]
});
var layerNames = {
    algal_bloom: { name: "Algal bloom" },
    graticule: { name: "Grid" },
    lightning: { name: "Lightning" },
    pfz: { name: "Potential Fishing Zones" },
    precipitation: { name: "Rainfall" },
    temperature: { name: "Temperature" },
    wind_direction: { name: "Wind direction" },
    wind_speed: { name: "Wind speed" },
    wind_uv: { name: "Wind" },
    oc_uv: { name: "Ocean currents" },
    tide_height: { name: "Tide height" },
    bathy_topo: { name: "Bathymetry" }
};
var uiWords = {
    hours: { name: "Hours" },
    high: { name: "High" },
    low: { name: "Low" },
    no_tide: { name: "No Data" },
    latitude: { name: "Latitude" },
    longitude: { name: "Longitude" },
    depth: { name: "Depth" },
    elevation: { name: "Elevation" },
    direction: { name: "Direction" },
    distance: { name: "Distance" },
    legend: { name: "Legend" },
    date: { name: "Date" },
    layer_info: { name: "Layer information" },
    layer_list: { name: "Layer list" },
    search_error: { name: "Invalid coordinates. Please, check your inputs" },
    search_location: { name: "Search location" },
    latitude: { name: "Latitude" },
    longitude: { name: "Longitude" },
    search: { name: "Search" },
    close: { name: "Close" },
    select_any: { name: "Select any" },
    select_all: { name: "Select any or all" },
    weather_unlock: { name: "Add weather pack to unlock" },
    tide_unlock: { name: "Add tide pack to unlock" },
    layer_title: { name: "Layer details" },
    pfz_def: { name: "Potential Fishing Zone (PFZ) is a reliable and short-term forecast on the fish aggregation zones in the open sea. PFZ advisories indicate the places where possible fish shoals may be present" },
    algal_bloom_def: { name: "Algal bloom is a rapid increase or accumulation in the population of algae in marine waters. It contains organisms (usually algae) that can severely lower oxygen levels in natural waters, killing marine life." },
    temperature_def: { name: "Indicates the temperature of the selected region." },
    wind_def: { name: "Shows wind speed and direction in a graphical representation." },
    rain_def: { name: "Indicates the rainfall and lightning of the selected region." },
    graticule_def: { name: "This layer shows graticule which is a network of lines representing meridians and parallels. It can be used to locate a particular latitude/longitude coordinate on the map." },
    bathy_def: { name: "Bathymetric layer shows depths of landforms below sea level." },
    lightning_def: { name: "Lightning layer shows heatmap which indicates the potential of a lightning to occur on a particular location." },
    oc_def: { name: "Indicates directional movement of seawater driven by gravity, wind and water density. They move horizontally and vertically." }
};
var currentPoints = null;
var route = null;
var routeDecorators = null;
var pointMarkers = [];
var clickMarker = null;
var velocityLayer = null;
var windSpeedLayer = null;
var ocLayer = null;

var units = {
    distanceUnit: "METER",
    depthUnit: "METER",
    locationUnit: "DECIMAL_DEGREES",
    quantityUnit: "KG",
    temperatureUnit: "CELSIUS",
    windSpeedUnit: "KMPH"
};

var pfzLayer = null;
var algalBloomLayer = null;
var windUVLayer = null;
var tempLayer = null;
var precipitationLayer = null;
var lightningLayer = null;

var weatherParams = ["lightning", "precipitation", "temperature", "wind_speed", "wind_direction", "wind_uv", "oc_uv"]

var layers = {};
L.TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
        var geojson, key;
        if (data.type === "Topology") {
            for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                    geojson = topojson.feature(data, data.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }
            return this;
        }
        L.GeoJSON.prototype.addData.call(this, data);
        return this;
    }
});
L.topoJson = function (data, options) {
    return new L.TopoJSON(data, options);
};

var graticuleLayer = L.latlngGraticule({
    showLabel: true,
    zoomInterval: [
        { start: 2, end: 3, interval: 30 },
        { start: 4, end: 4, interval: 10 },
        { start: 5, end: 7, interval: 5 },
        { start: 8, end: 9, interval: 1 },
        { start: 10, end: 10, interval: 0.5 },
        { start: 11, end: 11, interval: 0.25 },
        { start: 12, end: 12, interval: 0.125 },
        { start: 13, end: 14, interval: 0.0625 }
    ],
    opacity: 0.8,
    color: '#333',
    fontColor: '#333'
});

layers["graticule"] = {
    "id": "graticule",
    "layers": [graticuleLayer],
    "showDefault": false,
    "Checked": false
};

function isReady() { console.log("wvready") }
$('#cloud-cover-container').hide();