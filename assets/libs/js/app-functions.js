
function initiateWeather(flag) {
    var hrSize = 12;
    if (flag === "N") {
        hrSize = 24;
    }
    // loadTideData(tideData)
    for (var i = 0; i < weatherParams.length; i++) {
        allLayerData[weatherParams[i]] = [];
        hoursValues = [];
        dateValues = [];
        timestamps = [];
        for (var j = 0; j < hrSize; j++) {
            var dateStr = getWrfDateStr(j);
            hoursValues.push(dateStr.slice(-2))
            dateValues.push(getDateStr(dateStr));
            timestamps.push(getWrfTs(j));
            // var url = "http://127.0.0.1:8080//data/data/com.numer8.fishedgemap/app_flutter/flutter_assets/weather/" + weatherParams[i] + "/" + dateStr + ".json";
            // var myFile = File(url)
            // console.log(`20 ${url} ${myFile.exists()}`)
            // var isInitial = j == 0 ? true : false;
            // loadWeather(weatherParams[i], url, isInitial);
        }
    }
}

function initiateOc() {
    var hrSize = 12;
    allLayerData['oc_uv'] = [];
    // for (var j = 0; j < hrSize; j++) {
    //     var dateStr = getWrfDateStr(j);
    //     var url = "http://127.0.0.1:" + PORT + "/weather/oc_uv/" + dateStr + ".json";
    //     loadOc(url, j);
    // }
}

function loadOc(res, j) {
    try {
        allLayerData['oc_uv'].push(JSON.parse(res));
    } catch (error) {
        allLayerData['oc_uv'].push(res);
    }
    reorderLayerData('oc_uv');
    if ((j == 0 || ocLayer == null))
        showOc(0, false);
}

function getDateStr(dateStr) {
    var dateStrC = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2)
    var dt = new Date(dateStrC);
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    return weekday[dt.getDay()] + " " + dateStr.substr(6, 2);
}

function showTemperature(index, isVisible) {
    var layerData = allLayerData['temperature'][index];
    var dataArray = JSON.parse(layerData['rasterData']);
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var v = ((dataArray[i][j] - layerData['minValue']) / (layerData['maxValue'] - layerData['minValue'])) * 255;
            var pos = (i * width + j) * 4;
            buffer[pos] = v <= 127 ? (v * 2) : 255;
            buffer[pos + 1] = v <= 127 ? (v * 2) + 20 : (255 - (v - 127) * 2) + 80;
            buffer[pos + 2] = v <= 127 ? 255 : (255 - (v - 127) * 2);
            buffer[pos + 3] = dataArray[i][j] === 0 ? 0 : 140;
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['filteredExtent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    if (tempLayer) {
        map.removeLayer(tempLayer);
    }
    map.createPane('temperature');
    map.getPane('temperature').style.zIndex = 400;
    tempLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'temperature' });
    if (isVisible)
        tempLayer.addTo(map);
    layers["temperature"] = {
        "id": "temperature",
        "layers": [tempLayer],
        "showDefault": isVisible,
        "Checked": isVisible
    };
    updateLayerList()
}

function showPrecipitation(index, isVisible) {
    var layerData = allLayerData['precipitation'][index];
    var dataArray = JSON.parse(layerData['rasterData']);
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            let value = dataArray[i][j];
            rgbaVal = getRainfallColor(value, layerData['minValue'], layerData['maxValue']);
            var pos = (i * width + j) * 4;
            buffer[pos] = rgbaVal[0];
            buffer[pos + 1] = rgbaVal[1];
            buffer[pos + 2] = rgbaVal[2];
            buffer[pos + 3] = value > 0 ? rgbaVal[3] : 0;
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['filteredExtent']);
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    if (precipitationLayer) {
        map.removeLayer(precipitationLayer);
    }
    map.createPane('precipitationL');
    map.getPane('precipitationL').style.zIndex = 400;
    precipitationLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'precipitationL' });
    if (isVisible)
        precipitationLayer.addTo(map).bringToFront();
    layers["precipitation"] = {
        "id": "precipitation",
        "layers": [precipitationLayer],
        "showDefault": isVisible,
        "Checked": isVisible
    };
    updateLayerList()
}

function getRainfallColor(value, min, max) {
    try {
        var colorRamp = [[139, 204, 251, 0, 0], [139, 204, 251, 200, 10], [22, 153, 247, 255, 100]];
        var colorRampSize = colorRamp.length;
        var rampRatio = (1 / (colorRampSize - 1));
        var overAllRatio = (value - min) / (max - min);
        var index = Math.floor(overAllRatio / rampRatio);
        var startColor = colorRamp[index];
        var endColor = (index + 1) >= colorRamp.length ? colorRamp[index] : colorRamp[index + 1];
        var startColorX = startColor[4] / 100;
        var endColorX = endColor[4] / 100;
        var currentX = overAllRatio - startColorX;
        var localRatio = currentX / endColorX;
        return getRatioColor(endColor, startColor, localRatio);
    } catch (e) {
        return [0, 0, 0, 0]
    }
}

function showLightning(layerData) {
    var dataArray = JSON.parse(layerData['rasterData']);
    var nx = layerData['nx'], ny = layerData['ny'], min = layerData['minValue'], max = layerData['maxValue'];

    var geom = JSON.parse(layerData['filteredExtent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];

    var y1 = geom.coordinates[0][0][1];
    var x1 = geom.coordinates[0][0][0];
    var y2 = geom.coordinates[0][2][1];
    var x2 = geom.coordinates[0][2][0];
    var xRes = Math.abs(x1 - x2) / nx;
    var yRes = Math.abs(y1 - y2) / ny;
    var maxISize = 15;
    var minISize = 10;
    var clusterISize = 15;
    var markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: false,
        disableClusteringAtZoom: 12,
        iconCreateFunction: function (cluster) {
            return L.divIcon({ html: '<img style="border: none" src="../libs/images/lightning.png" width="' + clusterISize + '" height="' + clusterISize + '" />' });
        }
    });

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < dataArray[i].length; j++) {
            var x = x1 + j * yRes;
            var y = y1 - i * xRes;
            var v = dataArray[i][j];
            var iSize = minISize + (((v - min) / (max - min)) * (maxISize - minISize));
            var iOpacity = 0.40 + (((v - min) / (max - min)) * 0.80);
            if (v > 0) {
                var icon = L.icon({
                    iconUrl: '../libs/images/lightning.png',
                    iconSize: [iSize, iSize],
                });
                markers.addLayer(L.marker([y, x], { opacity: iOpacity, icon: icon }))
            }
        }
    }
    lightningLayer = markers
    if (!layers["precipitation"]) {
        layers["precipitation"] = {
            "id": "precipitation",
            "layers": [lightningLayer],
            "showDefault": false,
            "Checked": false
        };
    } else {
        layers["precipitation"]["layers"].push(lightningLayer);
    }
    updateLayerList()
}

function showWind(index, isVisible) {
    try {
        var layerData = allLayerData['wind_uv'][index];
        var uHeader = JSON.parse(layerData['uAttrs']).header;
        var vHeader = JSON.parse(layerData['vAttrs']).header;
        var nx = layerData['nx'], ny = layerData['ny'];
        var geom = JSON.parse(layerData['filteredExtent'])
        var y1 = geom.coordinates[0][0][1];
        var x1 = geom.coordinates[0][0][0];
        var y2 = geom.coordinates[0][2][1];
        var x2 = geom.coordinates[0][2][0];
        var xRes = Math.abs(x1 - x2) / nx;
        var yRes = Math.abs(y1 - y2) / ny;

        uHeader = {
            ...uHeader,
            dx: xRes,
            dy: yRes,
            nx: nx,
            ny: ny,
            la1: y1,
            la2: y2,
            lo1: x1,
            lo2: x2,
            numberPoints: nx * ny,
            gribLength: nx * ny,
            parameterNumberName: 'U-component_of_wind',
            parameterCategory: 2,
            parameterNumber: 2
        };

        vHeader = {
            ...vHeader,
            dx: xRes,
            dy: yRes,
            nx: nx,
            ny: ny,
            la1: y1,
            la2: y2,
            lo1: x1,
            lo2: x2,
            numberPoints: nx * ny,
            gribLength: nx * ny,
            parameterNumberName: 'V-component_of_wind',
            parameterCategory: 2,
            parameterNumber: 3
        };

        var uData = [].concat(...JSON.parse(layerData['uRasterData']));
        var vData = [].concat(...JSON.parse(layerData['vRasterData']));

        var uvWindData = [
            {
                header: uHeader,
                data: uData
            },
            {
                header: vHeader,
                data: vData
            }
        ];

        if (velocityLayer)
            map.removeLayer(velocityLayer);
        
        map.createPane('windUvLayer');
        map.getPane('windUvLayer').style.zIndex = 450;

        velocityLayer = L.velocityLayer({
            displayValues: false,
            displayOptions: {
                velocityType: "Global Wind",
                displayPosition: "bottomleft",
                displayEmptyString: "No wind data"
            },
            data: uvWindData,
            minVelocity: 0,
            maxVelocity: 10,
            particleMultiplier: 0.001,
            velocityScale: 0.005,
            lineWidth: 2,
            paneName: 'windUvLayer',
            particleAge: 90,

            colorScale: ["#FFFFFF"]
        });

        if (isVisible)
            velocityLayer.addTo(map);
        if (!layers["wind_uv"]) {
            layers["wind_uv"] = {
                "id": "wind_uv",
                "layers": [velocityLayer],
                "showDefault": isVisible,
                "Checked": isVisible
            };
        } else {
            layers["wind_uv"].layers.push(velocityLayer);
        }
        updateLayerList()
    }
    catch (e) {
        console.log(e);
    }
}

function showOc(index, isVisible) {
    try {
        var layerData = allLayerData['oc_uv'][index];
        var uHeader = JSON.parse(layerData['uAttrs']).header;
        var vHeader = JSON.parse(layerData['vAttrs']).header;
        var nx = layerData['nx'], ny = layerData['ny'];
        var geom = JSON.parse(layerData['filteredExtent'])
        var y1 = geom.coordinates[0][0][1];
        var x1 = geom.coordinates[0][0][0];
        var y2 = geom.coordinates[0][2][1];
        var x2 = geom.coordinates[0][2][0];
        var xRes = Math.abs(x1 - x2) / nx;
        var yRes = Math.abs(y1 - y2) / ny;

        uHeader = {
            ...uHeader,
            dx: xRes,
            dy: yRes,
            nx: nx,
            ny: ny,
            la1: y1,
            la2: y2,
            lo1: x1,
            lo2: x2,
            numberPoints: nx * ny,
            gribLength: nx * ny,
            parameterNumberName: 'U-component_of_wind',
            parameterCategory: 2,
            parameterNumber: 2
        };

        vHeader = {
            ...vHeader,
            dx: xRes,
            dy: yRes,
            nx: nx,
            ny: ny,
            la1: y1,
            la2: y2,
            lo1: x1,
            lo2: x2,
            numberPoints: nx * ny,
            gribLength: nx * ny,
            parameterNumberName: 'V-component_of_wind',
            parameterCategory: 2,
            parameterNumber: 3
        };

        var uData = [].concat(...JSON.parse(layerData['uRasterData']));
        var vData = [].concat(...JSON.parse(layerData['vRasterData']));

        var uvWindData = [
            {
                header: uHeader,
                data: uData
            },
            {
                header: vHeader,
                data: vData
            }
        ];
        var min = Math.min(...uvWindData[0].data, ...uvWindData[1].data);
        var max = Math.max(...uvWindData[0].data, ...uvWindData[1].data);

        if (ocLayer)
            map.removeLayer(ocLayer);
            
        map.createPane('ocLayer');
        map.getPane('ocLayer').style.zIndex = 450;

        ocLayer = L.velocityLayer({
            displayValues: false,
            displayOptions: {
                velocityType: "Global Wind",
                displayPosition: "bottomleft",
                displayEmptyString: "No wind data"
            },
            data: uvWindData,
            minVelocity: min,
            maxVelocity: max,
            particleMultiplier: 0.002,
            velocityScale: 0.8,
            lineWidth: 0.6,
            particleAge: 40,
            colorScale: ["#10539A"],
            dataType: 'OC',
            paneName: "ocLayer",
        });

        if (isVisible)
            ocLayer.addTo(map);
        layers["oc_uv"] = {
            "id": "oc_uv",
            "layers": [ocLayer],
            "showDefault": isVisible,
            "Checked": isVisible
        };
        updateLayerList()
    }
    catch (e) {
        console.log(e);
    }
}

function showWindSpeed(index, isVisible) {
    var layerData = allLayerData['wind_speed'][index];
    var colorRamp = [[35, 127, 208, 150, 0], [23, 178, 45, 150, 50], [227, 130, 49, 150, 100]];
    var dataArray = JSON.parse(layerData['rasterData']);
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var value = dataArray[i][j];
            var colorRampSize = colorRamp.length;
            var rampRatio = (1 / (colorRampSize - 1));
            var overAllRatio = (value - 0) / (layerData['maxValue'] - 0);
            var index = Math.floor(overAllRatio / rampRatio);
            var startColor = colorRamp[index];
            var endColor = (index + 1) >= colorRamp.length ? colorRamp[index] : colorRamp[index + 1];
            var startColorX = startColor[4] / 100;
            var endColorX = endColor[4] / 100;
            var currentX = overAllRatio - startColorX;
            var localRatio = currentX / endColorX;
            rgbaVal = getRatioColor(endColor, startColor, localRatio);
            var pos = (i * width + j) * 4;
            buffer[pos] = rgbaVal[0];
            buffer[pos + 1] = rgbaVal[1];
            buffer[pos + 2] = rgbaVal[2];
            buffer[pos + 3] = value > 0 ? rgbaVal[3] : 0;
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['filteredExtent']);
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    if (windSpeedLayer) {
        map.removeLayer(windSpeedLayer);
    }
    map.createPane('windSpeedL');
    map.getPane('windSpeedL').style.zIndex = 400;
    windSpeedLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'windSpeedL' }); // .addTo(map);
    if (isVisible)
        windSpeedLayer.addTo(map);
    if (!layers["wind_uv"]) {
        layers["wind_uv"] = {
            "id": "wind_uv",
            "layers": [windSpeedLayer],
            "showDefault": isVisible,
            "Checked": isVisible
        };
    } else {
        layers["wind_uv"].layers.push(windSpeedLayer);
    }
    updateLayerList()
}

function flatten(ary, ret) {
    if (!ret)
        ret = [];
    for (const entry of ary) {
        if (Array.isArray(entry)) {
            flatten(entry, ret);
        } else {
            ret.push(entry);
        }
    }
    return ret;
}

function showPfz(layerData) {
    if (pfzLayer)
        map.removeLayer(pfzLayer);
    var dataArray = JSON.parse(layerData['rasterData']);
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var v = dataArray[i][j]
            var pos = (i * width + j) * 4;
            buffer[pos] = v == 25 ? 209 : v == 50 ? 137 : 92
            buffer[pos + 1] = v == 25 ? 110 : v == 50 ? 32 : 22
            buffer[pos + 2] = v == 25 ? 255 : v == 50 ? 186 : 124
            buffer[pos + 3] = dataArray[i][j] === 0 ? 0 : 75 + (180 * v);
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['extent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    map.createPane('pfzL');
    map.getPane('pfzL').style.zIndex = 450;
    pfzLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'pfzL' });
    pfzLayer.addTo(map)
    layers["pfz"] = {
        "id": "pfz",
        "layers": [pfzLayer],
        "showDefault": true,
        "Checked": true
    };
    updateLayerList()
}

function showAlgalBloom(layerData) {
    var dataArray = JSON.parse(layerData['rasterData']);
    allLayerData["algalBloom"] = layerData;
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var v = 1 - ((dataArray[i][j] - layerData['minValue']) / (layerData['maxValue'] - layerData['minValue']));
            var pos = (i * width + j) * 4;
            if (dataArray[i][j] >= 6) {
                buffer[pos] = (228 - v * (228 - 0));
                buffer[pos + 1] = (71 - v * (71 - 0));
                buffer[pos + 2] = (27 - v * (27 - 0));
            } else {
                buffer[pos] = (100 - v * (100 - 32));
                buffer[pos + 1] = (249 - v * (249 - 148));
                buffer[pos + 2] = (105 - v * (105 - 36));
            }
            buffer[pos + 3] = dataArray[i][j] === 0 ? 0 : 200 + (55 * v);
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['extent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    map.createPane('algalL');
    map.getPane('algalL').style.zIndex = 450;
    algalBloomLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'algalL' });
    algalBloomLayer.addTo(map)
    layers["algal_bloom"] = {
        "id": "algal_bloom",
        "layers": [algalBloomLayer],
        "showDefault": true,
        "Checked": true
    };
    updateLayerList()
}


var legendTypes = {
    'graticule': {
        'type': 'single',
        'layerId': 'graticule',
        'value': '<td style="background-image: linear-gradient(to bottom, #ffffff00 0%, #ffffff00 46%, #838383 46%, #838383 54%, #ffffff00 54%, #ffffff00 100%);color:transparent;font-size:2px;min-width:50px">SomePlaceHolder</td>'
    },
    'precipitation': {
        'type': 'single',
        'layerId': 'precipitation',
        'value': '<td style="background-image: linear-gradient(to left, #0B8DF1, #F3FAFF);color:transparent">SomePlaceHolder</td>'
    },
    'lightning': {
        'type': 'single',
        'layerId': 'precipitation',
        'value': '<td style="background-image: linear-gradient(to right, #305780, #FFFFFF ,#EE8A5B);color:transparent">SomePlaceHolder</td>'
    },
    'temperature': {
        'type': 'gradient',
        'layerId': 'temperature',
        'value': '<td style="background-image: linear-gradient(to left, orange,yellow, white,blue);color:transparent">SomePlaceHolder</td>'
    },
    'pfz': {
        'type': 'gradient',
        'layerId': 'pfz',
        'value': '<td style="background-image: linear-gradient(to left, #500458, #E600FF);color:transparent">SomePlaceHolder</td>'
    },
    'bathy_topo': {
        'type': 'single',
        'layerId': 'bathy_topo',
        'value': '<td style="background-image: linear-gradient(to right, #F9F9F9, #6B6B6B);color:transparent">SomePlaceHolder</td>'
    },
    'algal_bloom': {
        'type': 'gradient',
        'layerId': 'algal_bloom',
        'value': '<td style="background-image: linear-gradient(to left, #E4471B, #FFA78E, #0AFF01, #097805);color:transparent">SomePlaceHolder</td>'
    },
    'wind_uv': {
        'type': 'gradient',
        'layerId': 'wind_uv',
        'value': '<td style="background-image: linear-gradient(to right, #237FD0, #17B22D, #E38231);color:transparent">SomePlaceHolder</td>'
    },
    'oc_uv': {
        'type': 'gradient',
        'layerId': 'oc_uv',
        'value': '<td style="background-image: linear-gradient(to right, #10539A, #10539A, #10539A);color:transparent">SomePlaceHolder</td>'
    },
    'tide_height': {
        'type': 'images',
        'layerId': 'algal_bloom',
        'value': [
            '<td style="text-align:center;"><img src="../libs/images/lowtide1.png" width="20" /></td>',
            '<td style="text-align:center;"><img src="../libs/images/hightide1.png" width="20" /></td>',
            '<td style="text-align:center;"><img src="../libs/images/notide1.png" width="20" /></td>'
        ]
    },
}

function updateLayerList() {
    var layerStr = "<div style='display: flex;'>"
        + "<div style='flex: 50%;text-align:left;padding:8px;white-space:nowrap'>" + uiWords['layer_list'].name + "</div>"
        + "<div style='flex: 50%;text-align:right;padding:8px;'><span onclick='layersHelp()'>&#9432;</span></div>"
        + "</div>";
    const layerKeys = ['graticule', 'bathy_topo', 'pfz', 'algal_bloom', 'precipitation', 'lightning', 'wind_uv', 'oc_uv', 'temperature'];
    var radioDivider = null;
    for (var i = 0; i < layerKeys.length; i++) {
        var layer = layers[layerKeys[i]];
        if (!layer)
            continue;
        if (i === 0) {
            layerStr += '<table style="width:100%;">'
                + '<tr>'
                + '<td style="font-size:5px;white-space: nowrap;text-align:center">------   ' + uiWords['select_all'].name + '   ------</td>'
                + '</tr>'
                + '</table>'
        }
        if (radioDivider === null && (layer.id === 'temperature' || layer.id === 'precipitation' || layer.id === 'lightning' || layer.id === 'wind_uv' || layer.id === 'oc_uv')) {
            layerStr += '<table style="width:100%;">'
                + '<tr>'
                + '<td style="font-size:5px;white-space: nowrap;text-align:center">------   ' + uiWords['select_any'].name + '   ------</td>'
                + '</tr>'
                + '</table>';
            radioDivider = 'added'
        }
        var ischecked = layer.Checked ? 'checked' : '';
        var labelHtml = layerNames[layer.id].name
        if (layer.id === 'graticule' || layer.id === 'bathy_topo' || layer.id === 'temperature' || layer.id === 'precipitation' || layer.id === 'lightning' || layer.id === 'algal_bloom' || layer.id === 'pfz' || layer.id === 'wind_uv' || layer.id === 'oc_uv') {
            var legendType = legendTypes[layer.id];
            labelHtml += '<table style="font-size: 10px">'
                + '<tr>'
                + legendType.value
                + '</tr>'
                + '</table>'
        }
        var inputCheckHtml = '<label class="chk-container"><p style="padding-top:3px;">' + labelHtml + '</p><input id="layer_list_check_' + layer.id + '" onclick="toggleLayer(this, \'' + layer.id + '\')" type="checkbox" ' + ischecked + ' ><span class="checkmark"></span></label>';
        var inputRadioHtml = '<label class="chk-container"><p style="padding-top:3px;">' + labelHtml + '</p><input id="layer_list_check_' + layer.id + '" onclick="toggleLayer(this, \'' + layer.id + '\')" name="layer_heat_map" type="radio" ' + ischecked + ' ><span class="checkmark checkmark-radio"></span></label>';
        var inputHtml = layer.id === 'precipitation' || layer.id === 'lightning' || layer.id === 'temperature' || layer.id === 'wind_uv' || layer.id === 'oc_uv' ? inputRadioHtml : inputCheckHtml;
        layerStr += inputHtml;
    }
    layerStr += '<table style="width:100%;">'
        + '<tr>'
        + '<td style="font-size:5px;white-space: nowrap;text-align:center">------------------</td>'
        + '</tr>'
        + '</table>';
    var legendType = legendTypes['tide_height'];
    layerStr += '<br/><span style="font-size: 12px;padding: 4px;margin-top:8px;">' + layerNames['tide_height'].name + '</span>'
        + '<table style="font-size: 10px;width:100%">'
        + '<tr>'
        + '<td style="text-align:center;">' + uiWords['low'].name + '</td>'
        + '<td style="text-align:center;">' + uiWords['high'].name + '</td>'
        + '<td style="text-align:center;">' + uiWords['no_tide'].name + '</td>'
        + '</tr>'
        + '<tr>'
        + legendType.value[0]
        + legendType.value[1]
        + legendType.value[2]
        + '</tr>'
        + '</table>'
    $('#layer-list').html(layerStr)
    reorderLayers();
}

function hidePanel(callAndroid) {
    $('#panel').css('height', '0px')
    $('#img-bottom-panel').attr('src', '../libs/images/expand-arrow.png');
    $('#location-details-1').hide()
    if (clickMarker) {
        map.removeLayer(clickMarker)
    }
    if (callAndroid)
        window.flutter_inappwebview.callHandler('showAppControlls', "TRUE");
}

/***  Bottom Panel  ***/
function togglePanel(latLng) {
    if (clickMarker) {
        map.removeLayer(clickMarker)
    }
    var isMarkerLocation = false;
    var showPopup = false
    if (!latLng) {
        if ($('#panel').css('height') == '0px') {
            showPopup = true;
            var mapCenter = map.getCenter()
            isMarkerLocation = false;
            $('#panel').css('height', 'auto')
            $('#img-bottom-panel').attr('src', '../libs/images/minus.png');
            $('#location-details-1').show()
            window.flutter_inappwebview.callHandler('showAppControlls', "FALSE");
            clickMarker = L.marker(mapCenter)
            clickMarker.addTo(map)
            latLng = mapCenter;
        } else {
            $('#panel').css('height', '0px')
            $('#img-bottom-panel').attr('src', '../libs/images/expand-arrow.png');
            $('#location-details-1').hide()
            window.flutter_inappwebview.callHandler('showAppControlls', "TRUE");
        }
    } else {
        showPopup = true;
        $('#panel').css('height', 'auto')
        $('#img-bottom-panel').attr('src', '../libs/images/minus.png');
        $('#location-details-1').show()
        window.flutter_inappwebview.callHandler('showAppControlls', "FALSE");
        clickMarker = L.marker(latLng)
        clickMarker.addTo(map)
    }
    if (showPopup) {
        $('#layer-list').css('display', 'none');
        $('#img-layer-list').attr('src', '../libs/images/layers_icon.png');
        var direction = "-";
        var distance = "-";
        if (marker != null && !isMarkerLocation) {
            var angle = L.GeometryUtil.angle(map, marker.getLatLng(), latLng);
            distance = L.GeometryUtil.length([marker.getLatLng(), latLng]);
            direction = angleToDir(angle);
            direction = "&nbsp;<img  style='transform:rotate(" + angle + "deg);' width='10' src='../libs/images/wind_dir_arrow.png' />" + direction
        }
        map.setView(latLng, map.getZoom())
        var pfzValue = getDataForLocation("pfz", latLng)
        pfzValue = pfzValue == -1 ? "NA" : pfzValue
        var depth = getDataForLocation("bathymetry", latLng);
        var depthTitle = ""
        if (depth == 'NA' || depth <= 0) {
            depthTitle = uiWords['depth'].name
        } else {
            depthTitle = uiWords['elevation'].name
        }
        depth = depth == -10000 ? "-" : depth
        if (depth != "-")
            depth = UnitConverter.convertDepth(units.depthUnit, depth);
        var algalBloom = getDataForLocation("algalBloom", latLng);
        algalBloom = algalBloom == -1 ? "NA" : algalBloom
        var latitude = UnitConverter.convertLocation(units.locationUnit, latLng.lat);
        var longitude = UnitConverter.convertLocation(units.locationUnit, latLng.lng);
        $('#latitude').html(latitude)
        $('#longitude').html(longitude)
        $('#depth').html(depth)
        $('#direction').html(direction)
        if (distance != '-')
            distance = UnitConverter.convertDistance(units.distanceUnit, distance)
        $('#distance').html(distance)

        $('#dist-title').html(uiWords['distance'].name)
        $('#dir-title').html(uiWords['direction'].name)
        $('#lat-title').html(uiWords['latitude'].name)
        $('#lng-title').html(uiWords['longitude'].name)
        $('#depth-title').html(depthTitle)

        var precipitationValues = getDummyWeatherDataForLocation("precipitation", latLng).map(function (v) {
            return v;
        });
        var temperatureValues = getDummyWeatherDataForLocation("temperature", latLng).map(function (v) {
            if (v == 'NA')
                return '-';
            return UnitConverter.convertTemperature(units.temperatureUnit, v);
        });
        var windDirectionValues = getDummyWeatherDataForLocation("wind_direction", latLng);
        var windSpeedValues = getDummyWeatherDataForLocation("wind_speed", latLng).map(function (v) {
            if (v == 'NA')
                return '-';
            return UnitConverter.convertSpeed(units.windSpeedUnit, v);
        });

        if (!hasAccess('GFS_WEATHER')) {
            hoursValues = [];
            dateValues = [];
            for (var j = 0; j < 12; j++) {
                var dateStr = getWrfDateStr(j);
                hoursValues.push(dateStr.slice(-2))
                dateValues.push(getDateStr(dateStr));
            }
        }

        if (hasAccess('GFS_WEATHER')) {
            precipitationValues = getWeatherDataForLocation("precipitation", latLng).map(function (v) {
                return v;
            });
            temperatureValues = getWeatherDataForLocation("temperature", latLng).map(function (v) {
                if (v == 'NA')
                    return '-';
                return UnitConverter.convertTemperature(units.temperatureUnit, v);
            });
            windDirectionValues = getWeatherDataForLocation("wind_direction", latLng);
            windSpeedValues = getWeatherDataForLocation("wind_speed", latLng).map(function (v) {
                if (v == 'NA')
                    return '-';
                return UnitConverter.convertSpeed(units.windSpeedUnit, v);
            });
        }


        var tideFilteredValues = getDummyTideDataForLocation(latLng).map(function (v) {
            return v;
        });
        if (hasAccess('TIDE')) {
            tideFilteredValues = getTideDataForLocation(latLng).map(function (v) {
                return v;
            });
        }

        var prevValue = ""
        var prevColor = ""
        var dateCommCount = 1;
        var str = ""
        var initColor = "#ffffff";
        var timeLength = 0;
        var timeAndDateArray = [];
        var returnLoadTide = [];
        var returnTideData;

        initColor = "#ffffff";
        str += "<tr>";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/calendar.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;background:#666'>&nbsp;<span style='color:#fff'>" + uiWords['date'].name + "</span></td>"

        dateValues.map(function (v, dateIndex) {
            if (dateValues.length <= dateIndex + 1 || dateValues[dateIndex + 1] !== v) {
                var colorGradient = getDayColorGradient(v);//position:sticky;left:40px;
                str += "<td id='" + getWrfDateColId(dateIndex) + "' colspan='" + dateCommCount + "' style='text-align:left; background: " + colorGradient + "'>&nbsp;<span class='date-sticky' style='color:#fff;padding-left:10px;'>" + v + "</span></td>";
                dateCommCount = 1;
            } else {
                dateCommCount++;
            }
            prevValue = v
        })
        str += "</tr>"

        initColor = "#fff";//getHourColor(hoursValues[0]||"#ffffff");
        str += "<tr>";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/clock.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#555;font-size:10px;background:" + initColor + "'>&nbsp;" + uiWords['hours'].name + "</td>"
        hoursValues.map(function (v, i) {
            var nxtHr = null;
            if (i + 1 < hoursValues.length)
                nxtHr = hoursValues[i + 1]
            var colorGradient = getHourColorGradient(v, nxtHr);
            str += "<td class='wrf-hr-col' style='background: " + colorGradient + ";color:" + getHourTextColor(v) + "'>" + getHrsTxt(v) + "</td>"
            timeLength = timeLength + 1;
            timeAndDateArray.push([getHrsTxt(v), dateValues[i]])
        })
        str += "</tr>"

        initColor = "#fff";//precipitationValues.length>=2?(getPrecipitationColorGradientV2(0, precipitationValues[0], precipitationValues[1])):"#ffffff";
        str += "<tr>";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/rain.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;background:" + initColor + "'>&nbsp;" + layerNames['precipitation'].name + "(mm/hr)</td>"
        precipitationValues.map(function (v, i) {
            var nxtVal = null;
            if (i + 1 < precipitationValues.length)
                nxtVal = precipitationValues[i + 1]
            var colorGradient = getPrecipitationColorGradientV2(i, v, nxtVal);
            str += "<td style='background: " + colorGradient + "'>" + (v === 'NA' ? "-" : v) + "</td>"
        })
        str += "</tr>"

        initColor = "#fff";//getTempColor(temperatureValues[0]||"#ffffff", Math.min(...temperatureValues), Math.max(...temperatureValues));
        str += "<tr style=\"white-space: nowrap;\">";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/thermometer.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;background:" + initColor + "'>&nbsp;" + layerNames['temperature'].name + "(" + UnitHelper.getUnitSymbol(units.temperatureUnit) + ")" + "</td>"
        temperatureValues.map(function (v, i) {
            var nxtVal = null;
            if (i + 1 < temperatureValues.length)
                nxtVal = temperatureValues[i + 1]
            var colorGradient = getTempColorGradient(v, nxtVal, Math.min(...temperatureValues), Math.max(...temperatureValues));
            str += "<td style='background: " + colorGradient + "'>" + v + "</td>"
        })
        str += "</tr>"

        initColor = "#fff";//getWindColor(windSpeedValues[0]||"#ffffff", Math.min(...windSpeedValues), Math.max(...windSpeedValues));
        str += "<tr style=\"white-space: nowrap;\">";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/wind-speed.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;margin-left: 30px;background:" + initColor + "'>&nbsp;" + layerNames['wind_speed'].name + "(" + UnitHelper.getUnitSymbol(units.windSpeedUnit) + ")" + "</td>"
        windSpeedValues.map(function (v, i) {
            var nxtVal = null;
            if (i + 1 < windSpeedValues.length)
                nxtVal = windSpeedValues[i + 1]
            var colorGradient = getWindColorGradient(v, nxtVal, Math.min(...windSpeedValues), Math.max(...windSpeedValues));
            str += "<td style='background: " + colorGradient + "'>" + (v) + "</td>"
        })
        str += "</tr>"

        str += "<tr>";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/wind-sock.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;'>&nbsp;" + layerNames['wind_direction'].name + "</td>"
        windDirectionValues.map(function (v) {
            var imgRotDeg = v !== 'NA' ? (180 + v) <= 360 ? (180 + v) : (v - 180) : 0;
            var imgStr = v !== 'NA' ? "<img class='default-img' style='transform:rotate(" + (imgRotDeg) + "deg);' width='10' src='../libs/images/wind_dir_arrow.png' />" : "";
            str += "<td>" + angleToDirAnti(v) + "&nbsp;" + imgStr + "</td>"
        })
        str += "</tr>"

        str += "<tr>";
        str += '<td class="headcol">'
            + '<img class="default-img" src="../libs/images/tide.png" style="" />'
            + '</td>';
        str += "<td style='text-align: left;color:#999;font-size:10px;'>&nbsp;" + layerNames['tide_height'].name + "</td>"
        var tideValues = tideFilteredValues;
        if (tideValues.length != 0) {
            for (let i = 0; i < timeAndDateArray.length; i++) {
                var returnTideDataFinal = CheckTideDataByTopRowDateAndTime(timeAndDateArray[i][1], timeAndDateArray[i][0], timeLength, tideValues).map(function (v) {
                    return v;
                });
                if (returnTideDataFinal[0] == "0") {
                    str += "<td><img class='default-img img1' src='../libs/images/" + returnTideDataFinal[3] + ".png' style='object-fit: contain;' /><div><div id='span1' class='t'>" + returnTideDataFinal[1] + "</div><div id='span2' class='t r'>" + returnTideDataFinal[2] + "</div></div></td>"
                }
                else {
                    str += "<td><img class='default-img img1'  src='../libs/images/notide1.png' style='object-fit: contain;' /></td>"
                }
            }
            str += "</tr>"
        } else {
            windDirectionValues.map(function (v) {
                str += "<td>-</td>";
            })
            str += "</tr>"
        }

        $('#weather_table').html(str)
        activePanel = "bottom_panel";
        if (hasAccess('GFS_WEATHER') || hasAccess('OC')) {
            setActiveHrColumn(2);
            document.getElementById("weather_table").onclick = onBottomPanelClick;
        }
        if (!hasAccess('GFS_WEATHER')) {
            var rowHts = getRowHeightsAndPos();
            var gfsOverLayPos = rowHts[3];
            var gfsOverlayHt = rowHts[1];
            $('#gfs_overlay').css({
                top: rowHts[5] + gfsOverLayPos[0],
                left: gfsOverLayPos[1],
                height: gfsOverlayHt
            })
            $('#btn_gfs_overlay').html(uiWords['weather_unlock'].name)
            $('#btn_gfs_overlay').css({
                'margin-top': gfsOverlayHt / 3
            });
            $('#btn_gfs_overlay').unbind("click");
            $('#btn_gfs_overlay').on('click', () => { openUpgradeSubscription(); });
            $('#gfs_overlay').show();
        } else {
            $('#gfs_overlay').hide();
        }
        if (!hasAccess('TIDE')) {
            var rowHts = getRowHeightsAndPos();
            var tideOverLayPos = rowHts[4];
            var tideOverlayHt = rowHts[2];
            $('#tide_overlay').css({
                top: rowHts[5] + tideOverLayPos[0],
                left: tideOverLayPos[1],
                height: tideOverlayHt
            })
            $('#btn_tide_overlay').html(uiWords['tide_unlock'].name)
            $('#btn_tide_overlay').css({
                'margin-top': tideOverlayHt / 3
            });
            $('#btn_tide_overlay').unbind("click");
            $('#btn_tide_overlay').on('click', () => { openUpgradeSubscription(); });
            $('#tide_overlay').show();
        } else {
            $('#tide_overlay').hide();
        }
    } else {
        activePanel = null;
        if (hasAccess('GFS_WEATHER') || hasAccess('OC'))
            setActiveHrColumn(2);
    }

    // let locationStr = window.clickedPoint.lat + "," + window.clickedPoint.lng;
    if (showPopup) {
        // Android.toggleBottomPanel("open", locationStr);
    } else {
        // Android.toggleBottomPanel("close", locationStr);
    }
}
function getRowHeightsAndPos() {
    var table = document.getElementById("weather_table");
    var beforeGfsHeight = 0;
    var gfsHeight = 0;
    var gfsPos = [0, 0];
    var tidePos = [0, 0];
    var tideHeight = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
        var heightValue = parseFloat(($(row).css('height')).replace('px', ''));
        if (i === 2) {
            gfsPos = [$(row).position().top, $(row).position().left];
        }
        if (i == 6) {
            tidePos = [$(row).position().top, $(row).position().left]
        }
        if (i >= 2 && i <= 5)
            gfsHeight += heightValue;
        if (i < 2)
            beforeGfsHeight += heightValue;
        if (i == 6)
            tideHeight += heightValue;
    }
    var toggleHeight = parseFloat(($('#panel-toggle-icon').css('height')).replace('px', '')) + 12;
    return [beforeGfsHeight, gfsHeight, tideHeight, gfsPos, tidePos, toggleHeight];
}
let timer = null;
function onBottomPanelScroll() {
    if (!hasAccess('GFS_WEATHER') && !hasAccess('OC'))
        return;
    if (timer)
        clearTimeout(timer);
    timer = setTimeout(function () {
        var table = document.getElementById("weather_table");
        var closestToCenter = screen.width;
        var closest = "";
        var closestText = "";
        for (var i = 0, row; row = table.rows[i]; i++) {
            if (i === 0) { continue; } if (i > 1) { break; }
            for (var j = 0, col; col = row.cells[j]; j++) {
                var lo = col.getBoundingClientRect().left;
                if ((new Date(timestamps[j - 2])).getHours() === 23 && lo < 40) {
                    $("#" + getWrfDateColId(j - 2) + " > span").addClass('date-hide');
                    $("#" + getWrfDateColId(j - 2) + " > span").removeClass('date-sticky');
                } else {
                    $("#" + getWrfDateColId(j - 2) + " > span").removeClass('date-hide');
                    $("#" + getWrfDateColId(j - 2) + " > span").addClass('date-sticky');
                }
                if (lo < 0 || lo > screen.width) {
                    continue;
                }
                if (Math.abs((screen.width / 2) - col.getBoundingClientRect().left) < closestToCenter) {
                    closest = j;
                    closestText = col.innerText;
                    closestToCenter = (screen.width / 2) - col.getBoundingClientRect().left;
                }
            }
        }
        setActiveHrColumn(closest);
    }, 150);
}

function onBottomPanelClick(e) {
    e = e || window.event; //for IE87 backward compatibility
    var t = e.target || e.srcElement; //IE87 backward compatibility
    while (t.nodeName != 'TD' && t.nodeName != 'TH' && t.nodeName != 'TABLE') {
        t = t.parentNode;
    }
    if (t.nodeName == 'TABLE') {
        return;
    }
    var c = t.parentNode.cells;
    var j = 0;
    for (var i = 0; i < c.length; i++) {
        if (c[i] == t) {
            j = i;
        }
    }
    setActiveHrColumn(j);
}

function setActiveHrColumn(closest) {
    activeHr = closest;
    var table = document.getElementById("weather_table");
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (i === 0) { continue; }
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (j === closest) {
                if (i === 1) {
                    col.style.borderTop = "1px solid #777";
                }
                if (i === 6) {
                    col.style.borderBottom = "1px solid #777";
                }
                col.style.borderLeft = "1px solid #777";
                col.style.borderRight = "1px solid #777";
            } else {
                col.style.border = "0px solid #777";
            }
        }
    }
    if (hasAccess('GFS_WEATHER')) {
        showTemperature(closest - 2, tempLayer && map.hasLayer(tempLayer));
        layers["precipitation"] = null;
        showPrecipitation(closest - 2, precipitationLayer && map.hasLayer(precipitationLayer));
        showLightningHeatMap(closest - 2, lightningLayer && map.hasLayer(lightningLayer));
        layers["wind_uv"] = null;
        showWind(closest - 2, velocityLayer && map.hasLayer(velocityLayer));
        showWindSpeed(closest - 2, velocityLayer && map.hasLayer(windSpeedLayer));
    }
    if (hasAccess('OC'))
        showOc(closest - 2, ocLayer && map.hasLayer(ocLayer));
}

function convertWindSpeed(v) {
    try {
        var r = parseFloat(v)
        return (r * 3.6).toFixed(2)
    } catch (err) {
        return 'NA'
    }
}

function getDataForLocation(layerName, location) {
    var layerData = allLayerData[layerName];
    if (!layerData)
        return -1;
    try {
        var layerExtent = L.geoJSON(JSON.parse(layerData.extent));
        var isInside = layerExtent.getBounds().contains(location);
        //        console.log(JSON.stringify(layerExtent.getBounds()), layerData.extent)
        var rowIndex = Math.abs(Math.floor((location.lat - layerData.y1) / layerData.yRes));
        var colIndex = Math.abs(Math.floor((location.lng - layerData.x1) / layerData.xRes));
        var dataArray = JSON.parse(layerData["rasterData"]);
        if (isInside && rowIndex >= 1 && rowIndex < layerData.ny && colIndex >= 1 && colIndex < layerData.nx) {
            return dataArray[rowIndex][colIndex];
        } else {
            return layerName === "bathymetry" ? -10000 : -1;
        }
    } catch (e) {
        return layerName === "bathymetry" ? -10000 : -1;
    }
}

function getWeatherDataForLocation(paramName, location) {
    var layerData = allLayerData[paramName];
    if (!layerData)
        return ["NA"];
    var resArr = []
    for (var i = 0; i < layerData.length; i++) {
        var layerDataForHour = layerData[i];
        var x1 = layerDataForHour.x1;
        var y1 = layerDataForHour.y1;
        try {
            var filteredExtent = JSON.parse(layerDataForHour['filteredExtent']);
            y1 = filteredExtent.coordinates[0][0][1];
            x1 = filteredExtent.coordinates[0][0][0];
        } catch (e) {
            console.log(JSON.stringify(e))
        }
        var rowIndex = (Math.floor((y1 - location.lat) / layerDataForHour.yRes));
        var colIndex = (Math.floor((location.lng - x1) / layerDataForHour.xRes));



        var dataArray = JSON.parse(layerDataForHour["rasterData"]);
        if (rowIndex >= 0 && rowIndex < layerDataForHour.ny && colIndex >= 0 && colIndex < layerDataForHour.nx) {
            //            console.log(paramName, rowIndex, colIndex, location.lat, location.lng, y1, x1, (dataArray[rowIndex][colIndex]).toFixed(2))
            resArr.push((dataArray[rowIndex][colIndex]).toFixed(1));
        } else {
            resArr.push("NA");
        }
    }
    return resArr;
}

function getDummyWeatherDataForLocation(paramName, location) {
    var resArr = []
    for (var i = 0; i < 12; i++) {
        var value = 0;
        switch (paramName) {
            case "precipitation":
                value = getRandomFloat(0.00, 1.0);
                break;
            case "temperature":
                value = getRandomFloat(27, 30);
                break;
            case "wind_direction":
                value = getRandomFloat(0, 360);
                break;
            case "wind_speed":
                value = getRandomFloat(0.00, 10.0);
                break;
            case "lightning":
                value = getRandomFloat(0, 3600);
                break;
        }
        resArr.push((value).toFixed(1));
    }
    return resArr;
}

function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min)
}

function angleToDirAnti(angle) {
    if (angle === "NA")
        return "-";
    if (angle < 11.25 || angle > 348.75)
        return "S";
    if (angle < 33.75 && angle > 11.25)
        return "SSW";
    if (angle < 56.25 && angle > 33.75)
        return "SW";
    if (angle < 78.75 && angle > 56.25)
        return "WSW";
    if (angle < 101.25 && angle > 78.75)
        return "W";
    if (angle < 123.75 && angle > 101.25)
        return "WNW";
    if (angle < 146.25 && angle > 123.75)
        return "NW";
    if (angle < 168.75 && angle > 146.25)
        return "NNW";
    if (angle < 191.25 && angle > 168.75)
        return "N";
    if (angle < 213.75 && angle > 191.25)
        return "NNE";
    if (angle < 236.25 && angle > 213.75)
        return "NE";
    if (angle < 258.75 && angle > 236.25)
        return "ENE";
    if (angle < 281.25 && angle > 258.75)
        return "E";
    if (angle < 303.75 && angle > 281.25)
        return "ESE";
    if (angle < 326.25 && angle > 303.75)
        return "SE";
    if (angle < 348.75 && angle > 326.25)
        return "SSE";
    return "N";
}

function angleToDir(angle) {
    if (angle < 11.25 || angle > 348.75)
        return "N";
    if (angle < 33.75 && angle > 11.25)
        return "NNE";
    if (angle < 56.25 && angle > 33.75)
        return "NE";
    if (angle < 78.75 && angle > 56.25)
        return "ENE";
    if (angle < 101.25 && angle > 78.75)
        return "E";
    if (angle < 123.75 && angle > 101.25)
        return "ESE";
    if (angle < 146.25 && angle > 123.75)
        return "SE";
    if (angle < 168.75 && angle > 146.25)
        return "SSE";
    if (angle < 191.25 && angle > 168.75)
        return "S";
    if (angle < 213.75 && angle > 191.25)
        return "SSW";
    if (angle < 236.25 && angle > 213.75)
        return "SW";
    if (angle < 258.75 && angle > 236.25)
        return "WSW";
    if (angle < 281.25 && angle > 258.75)
        return "W";
    if (angle < 303.75 && angle > 281.25)
        return "WNW";
    if (angle < 326.25 && angle > 303.75)
        return "NW";
    if (angle < 348.75 && angle > 326.25)
        return "NNW";
    return "N";
}

function zoomToFullExtent() {
    //    map.setView([18.761220, 72.820985], 8);
    if (!MAP_BOUNDS)
        return;
    //    map.setView([18.761220, 72.820985], 8);
    map.fitBounds(MAP_BOUNDS);
}

function getWrfDateStr(hr) {
    var dto = new Date();
    var dt = new Date(dto.getTime() + (hr * 60 * 60 * 1000));
    var hrStr = dt.getHours().toString().length === 1 ? "0" + dt.getHours().toString() : dt.getHours().toString();
    var dateStr = dt.getDate().toString().length === 1 ? "0" + dt.getDate().toString() : dt.getDate().toString();
    var month = dt.getMonth() + 1;
    var monthStr = month.toString().length === 1 ? "0" + month.toString() : month.toString();
    var yearStr = dt.getFullYear().toString().length === 1 ? "0" + dt.getFullYear().toString() : dt.getFullYear().toString();
    return yearStr + monthStr + dateStr + hrStr;
}

function getWrfTs(hr) {
    var dto = new Date();
    var dt = new Date(dto.getTime() + (hr * 60 * 60 * 1000));
    var hrStr = dt.getHours().toString().length === 1 ? "0" + dt.getHours().toString() : dt.getHours().toString();
    var dateStr = dt.getDate().toString().length === 1 ? "0" + dt.getDate().toString() : dt.getDate().toString();
    var month = dt.getMonth() + 1;
    var monthStr = month.toString().length === 1 ? "0" + month.toString() : month.toString();
    var yearStr = dt.getFullYear().toString().length === 1 ? "0" + dt.getFullYear().toString() : dt.getFullYear().toString();
    return (new Date(yearStr + "-" + monthStr + "-" + dateStr + ", " + hrStr + ":00:00")).getTime();
}

function getWrfDateColId(hr) {
    var dto = new Date();
    var dt = new Date(dto.getTime() + (hr * 60 * 60 * 1000));
    var hrStr = dt.getHours().toString().length === 1 ? "0" + dt.getHours().toString() : dt.getHours().toString();
    var dateStr = dt.getDate().toString().length === 1 ? "0" + dt.getDate().toString() : dt.getDate().toString();
    var month = dt.getMonth() + 1;
    var monthStr = month.toString().length === 1 ? "0" + month.toString() : month.toString();
    var yearStr = dt.getFullYear().toString().length === 1 ? "0" + dt.getFullYear().toString() : dt.getFullYear().toString();
    return "bp_wrf_date_col_" + (new Date(yearStr + "-" + monthStr + "-" + dateStr + ", " + hrStr + ":00:00")).getTime();
}

function loadWeather(res, isInitial) {
    var param = typeof (res['paramName']) != "undefined" ? res['paramName'] : "wind_uv"
    try {
        allLayerData[param].push(JSON.parse(res));
    } catch {
        allLayerData[param].push(res);
    }
    reorderLayerData(param);
    if ((isInitial || precipitationLayer == null) && param == "precipitation") {
        showPrecipitation(0, false)
    }
    if ((isInitial || lightningLayer == null) && param == "lightning") {
        showLightningHeatMap(0, false)
    }
    if ((isInitial || tempLayer == null) && param == "temperature") {
        showTemperature(0, false);
    }
    if ((isInitial || velocityLayer == null) && param == "wind_uv") {
        showWind(0, false);
    }
    if ((isInitial || windSpeedLayer == null) && param == "wind_speed") {
        showWindSpeed(0, false);
    }
}

function reorderLayerData(param) {
    allLayerData[param] = allLayerData[param].sort((a, b) => a - b);
}

function addPoint(point, tripId, isBookmarked, ts, pointState) {
    var pointMarker = L.marker(point, { icon: isBookmarked ? tripPointBookmarkedIcon : pointState === "first" ? startIcon : tripPointIcon }).addTo(map);
    if (isBookmarked && pointState === 'first') {
        var _pointMarker = L.marker(point, { icon: startIcon }).addTo(map);
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
    var htmlStr = "";

    var latStr = UnitConverter.convertLocation(units.locationUnit, e.latlng.lat);
    var lngStr = UnitConverter.convertLocation(units.locationUnit, e.latlng.lng);
    if (e.target.isBookmarked) {
        htmlStr += "<div style='text-align:left'>"
            + "<img onclick='Android.removeBookmark(\"" + tripPointId + "\")' src='../libs/images/star.png' width='15' />"
            + " " + latStr + ", " + lngStr + " <br/>" + tsStr
            + "</div>"
    } else {
        htmlStr += "<div style='text-align:right'>"
            + "<img onclick='Android.addBookmark(\"" + tripPointId + "\")' src='../libs/images/star_grey.png' width='15' />"
            + " " + latStr + ", " + lngStr + " <br/>" + tsStr
            + "</div>"
    }
    if (e.target.getPopup())
        e.target.unbindPopup()
    e.target.bindPopup(htmlStr)
    e.target.openPopup();
}
function clearAll() {
    for (var i = 0; i < pointMarkers.length; i++) {
        map.removeLayer(pointMarkers[i])
    }
    pointMarkers = [];
    if (route != null) {
        map.removeLayer(route)
    }
    if (routeDecorators != null) {
        map.removeLayer(routeDecorators)
    }
    route = null;
    routeDecorators = null;
    currentPoints = null;
}

function addTripPoint(location, isBookmarked) {
    if (currentPoints != null) {
        currentPoints.push([location[0], location[1]])
        addPoint([location[0], location[1]], isBookmarked)
        updateLine(currentPoints)
    }
}

function updatePorts(ports) {
    var portsArr
    try {
        portsArr = JSON.parse(ports);
    } catch {
        portsArr = ports;
    }

    for (var i = 0; i < portsArr.length; i++) {
        var port = portsArr[i];
        var latlng = L.latLng(port.latitude, port.longitude);
        var c = L.marker(latlng, {
            icon: L.divIcon({
                html: "<div style='width:100px'><div class='leaflet-div-icon2'></div><div class='portname port-dark'>" + port.name + "</div></div>"
            }), interactive: true, clickable: true
        });
        //        c.feature = feature;
        if (!collisionLayer)
            collisionLayer = L.LayerGroup.collision({ margin: 5 });
        collisionLayer.addLayer(c);
    }
    collisionLayer.addTo(map);
}

function loadPfz(res) {
    try {
        var layerData = JSON.parse(res);
        showPfz(layerData);
    } catch (e) {
        var layerData = res;
        showPfz(layerData);
    }
}

function loadPfzFc() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080//data/data/com.numer8.fishedgemap/app_flutter/flutter_assets/gis/pfz_fc.json",
        success: function (res) {
            console.log(`1333 ${res}`)
            var layerDataArr = JSON.parse(res);
            allLayerData["pfz_fc"] = layerDataArr;
            sliderInit();
        },
        error: function (err) {
            console.log(`1339 ${err}`);
        }
    });
}

function loadAlgalBloom(res) {
    try {
        var layerData = JSON.parse(res);
        showAlgalBloom(layerData);
    } catch (e) {
        var layerData = res;
        showAlgalBloom(layerData);
    }
}

function loadBathymetry(bathymetryData, bathyTopoData) {
    try {
        var layerData = JSON.parse(bathymetryData);
        allLayerData["bathymetry"] = layerData;
    } catch (e) {
        var layerData = bathymetryData;
        allLayerData["bathymetry"] = layerData;
    }

    try {
        var layerData = JSON.parse(bathyTopoData);
        setTimeout(function () {
            loadBathyTopo(layerData)
        }, 2000)
    } catch (e) {
        var layerData = bathyTopoData;
        setTimeout(function () {
            loadBathyTopo(layerData)
        }, 2000)
    }
}

function getRouteDistance() {
    var previousPoint = null;
    var distance = 0;
    route.getLatLngs().forEach(function (latLng) {
        if (previousPoint) {
            distance += previousPoint.distanceTo(latLng)
        }
        previousPoint = latLng;
    });
    return distance
}

function mapClickEvent(e) {
    window.clickedPoint = e.latlng;
    if (activePanel === null || activePanel === "bottom_panel") {
        var latLng = e.latlng;
        togglePanel(latLng);
    } else {
        switch (activePanel) {
            case 'layer_list_panel':
                toggleLayersPanel();
                break;
            case 'search_panel':
                closeSearchPopUp();
                break;
        }
    }
}

function initParams(extentStr) {
    try {
        var x1 = parseFloat(extentStr.split(',')[0]);
        var y1 = parseFloat(extentStr.split(',')[1]);
        var x2 = parseFloat(extentStr.split(',')[2]);
        var y2 = parseFloat(extentStr.split(',')[3]);
        var p1 = L.latLng(y1, x1), p2 = L.latLng(y2, x2);
        MAP_BOUNDS = L.latLngBounds(p1, p2);
        if (!map)
            initMap(MAP_BOUNDS)
    } catch (e) {
        console.log(`1444 ${JSON.stringify(e)}`)
    }
}

function extStrTMapBounds(extentStr) {
    var x1 = parseFloat(extentStr.split(',')[0]);
    var y1 = parseFloat(extentStr.split(',')[1]);
    var x2 = parseFloat(extentStr.split(',')[2]);
    var y2 = parseFloat(extentStr.split(',')[3]);
    var p1 = L.latLng(y1, x1), p2 = L.latLng(y2, x2);
    return L.latLngBounds(p1, p2);
}

function initMap(_MAP_BOUNDS) {
    if (!_MAP_BOUNDS)
        return;
    map = L.map('map', {
        attributionControl: false,
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM
    });
    map.fitBounds(_MAP_BOUNDS);
    map.on('click', mapClickEvent);
}

function addBasemap(pmTilesUrl, styleStr) {
    let json_style;
    try {
        json_style = JSON.parse(styleStr);
    }
    catch (e) {
        json_style = styleStr;
    }
    let result = protomaps.json_style(json_style, {})
    const p = new protomaps.PMTiles(pmTilesUrl)
    p.metadata().then(m => {
        let bounds_str = m.bounds.split(',')
        let bounds = [[+bounds_str[1], +bounds_str[0]], [+bounds_str[3], +bounds_str[2]]]
        layer = new protomaps.LeafletLayer({ url: p, bounds: bounds, paint_rules: result.paint_rules, label_rules: result.label_rules })
        layer.addTo(map)
    });
}

function add() {
    return 10 + 20;
}

function updateLocationInMap(data) {
    console.log(`1478 USer Location ${data}`)
    var isInit = false;
    if (!map) {
        isInit = true;
        initMap(MAP_BOUNDS)
    }
    if (!!marker && !!map) {
        map.removeLayer(marker)
    }
    try {
        var latLng = JSON.parse(data).location;
        var from = JSON.parse(data).from;
    } catch (e) {
        var latLng = data['location'];
        var from = data['from'];
    }

    marker = L.marker(latLng, {
        icon: from == "DEVICE_GPS" ? deviceGpsIcon : gpsIcon
    }).addTo(map);

    try {
        var latitude = UnitConverter.convertLocation(units.locationUnit, latLng[0]);
        var longitude = UnitConverter.convertLocation(units.locationUnit, latLng[1]);
        $('#view-gps-location').html(latitude + ", " + longitude);
        $('#view-gps-location-icon').show();
    } catch (e) {
        console.log(`1505 ${e}`);
    }

    if (isInit)
        map.setView(latLng, MAX_ZOOM);
}

function focusOnGps() {
    if (!!marker && !!map) {
        map.setView(marker.getLatLng(), MAX_ZOOM)
    }
}

function setCurrentTrip(extentStr, jsonArrStr) {
    var isInit = false;
    if (!map) {
        isInit = true;
        initMap(extStrTMapBounds(extentStr))
    }
    var pointsStrArr = JSON.parse(jsonArrStr);
    if (currentPoints == null) {
        currentPoints = []
        for (var i = 0; i < pointsStrArr.length; i++) {
            var pointState = i == 0 ? "first" : "mid";
            var location = JSON.parse(pointsStrArr[i])
            currentPoints.push([location[0], location[1]])
            addPoint([location[0], location[1]], location[2], location[3], location[4], pointState)
        }
    } else {
        var pointState = currentPoints.length == 0 ? "first" : "mid";
        var location = JSON.parse(pointsStrArr[pointsStrArr.length - 1])
        currentPoints.push([location[0], location[1]])
        addPoint([location[0], location[1]], location[2], location[3], location[4], pointState)
    }
    if (isInit)
        map.setView(currentPoints[currentPoints.length - 1], MAX_ZOOM);
    updateLine(currentPoints)
}

function updateLine(points) {
    if (route != null) {
        map.removeLayer(route)
    }
    route = L.polyline(points, { color: '#FFA94D' }).addTo(map);

    if (routeDecorators != null) {
        map.removeLayer(routeDecorators)
    }
    routeDecorators = L.polylineDecorator(points, {
        patterns: [
            //            {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {fillOpacity: 1, weight: 0}})}
            {
                repeat: '40', symbol: L.Symbol.marker({
                    rotate: true, markerOptions: {
                        icon: L.icon({
                            iconUrl: '../libs/images/expand_arrow.png',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    }
                })
            }
        ]
    }).addTo(map);
}

function updateLayerNames(layerNameStr) {
    try {
        layerNames = {
            ...layerNames,
            ...JSON.parse(layerNameStr)
        }
    } catch {
        layerNames = {
            ...layerNames,
            ...layerNameStr
        }
    }
}

function updateCountryBoundary(extentStr) {
    COUNTRY_BOUNDS = JSON.parse(extentStr)
    try {
        var x1 = parseFloat(extentStr.split(',')[0]);
        var y1 = parseFloat(extentStr.split(',')[1]);
        var x2 = parseFloat(extentStr.split(',')[2]);
        var y2 = parseFloat(extentStr.split(',')[3]);
        var p1 = L.latLng(y1, x1), p2 = L.latLng(y2, x2);
        COUNTRY_BOUNDS = L.latLngBounds(p1, p2);
        //set max bounds
    } catch (e) {
        console.log(`1589 ${JSON.stringify(e)}`)
    }
}

function toggleLayer(e, id) {
    if (!map) {
        return;
    }
    let flag = false;
    if (mapHasLayers(layers[id].layers)) {
        flag = false;
        $(e).prop('checked', false);
        layers[id].layers.map(function (l) {
            try {
                map.removeLayer(l);
                layers[id]['Checked'] = false;
            } catch (e) { console.log(e); }
        })
    } else {
        flag = true;
        if (id == "wind_uv" || id == "lightning" || id == "temperature" || id == "precipitation" || id == "oc_uv") {
            if (layers['wind_uv']) layers['wind_uv'].layers.map(l => map.removeLayer(l));
            if (layers['lightning']) layers['lightning'].layers.map(l => map.removeLayer(l));
            if (layers['temperature']) layers['temperature'].layers.map(l => map.removeLayer(l));
            if (layers['precipitation']) layers['precipitation'].layers.map(l => map.removeLayer(l));
            if (layers['oc_uv']) layers['oc_uv'].layers.map(l => map.removeLayer(l));
            $('#layer_list_check_lightning').prop('checked', false);
            $('#layer_list_check_wind_uv').prop('checked', false);
            $('#layer_list_check_temperature').prop('checked', false);
            $('#layer_list_check_precipitation').prop('checked', false);
            $('#layer_list_check_oc_uv').prop('checked', false);
        }
        layers[id].layers.map(function (l) {
            try {
                map.addLayer(l);
                layers[id]['Checked'] = true;
            } catch (e) { console.log(e); }
        });
        $(e).prop('checked', true);
    }
    reorderLayers();
    // updateLayerList();
    updateCloudCover();
}

function mapHasLayers(lis) {
    var has = true;
    lis.map(function (l) {
        if (!map.hasLayer(l))
            has = false;
    })
    return has;
}


/****  Layer list panel  ***/
function toggleLayersPanel() {
    if ($('#layer-list').css('display') !== 'none') {
        activePanel = null;
        $('#layer-list').css('display', 'none');
        $('#img-layer-list').attr('src', '../libs/images/layers_icon.png');
        window.flutter_inappwebview.callHandler('showAppControlls', "TRUE");
    } else {
        activePanel = "layer_list_panel";
        $('#layer-list').css('display', 'block');
        $('#img-layer-list').attr('src', '../libs/images/minus.png');
        $('#panel').css('height', '0px')
        $('#img-bottom-panel').attr('src', '../libs/images/expand-arrow.png');
        window.flutter_inappwebview.callHandler('showAppControlls', "FALSE");
        $('#location-details-1').hide()
        $('.custom-popup-search').hide()
    }
}

function updateUiWords(str) {
    try {
        uiWords = {
            ...uiWords,
            ...JSON.parse(str)
        }
    } catch {
        uiWords = {
            ...uiWords,
            ...str
        }
    }
}

function updateUnits(str) {
    try {
        units = JSON.parse(str);
    } catch {
        units = str;
    }
}

function layersHelp() {
    $('#layer_title').html(uiWords['layer_title'].name)

    $('#pfz_def').html(uiWords['pfz_def'].name)
    $('#algal_bloom_def').html(uiWords['algal_bloom_def'].name)
    $('#temperature_def').html(uiWords['temperature_def'].name)
    $('#wind_def').html(uiWords['wind_def'].name)
    $('#rain_def').html(uiWords['rain_def'].name)
    $('#graticule_def').html(uiWords['graticule_def'].name)
    $('#bathymetry_def').html(uiWords['bathy_def'].name)
    $('#lightning_def').html(uiWords['lightning_def'].name)
    $('#oc_def').html(uiWords['oc_def'].name)


    $('#pfz_def_title').html(layerNames['pfz'].name)
    $('#algal_bloom_def_title').html(layerNames['algal_bloom'].name)
    $('#temperature_def_title').html(layerNames['temperature'].name)
    $('#wind_def_title').html(layerNames['wind_uv'].name)
    $('#rain_def_title').html(layerNames['precipitation'].name)
    $('#graticule_def_title').html(layerNames['graticule'].name)
    $('#bathymetry_def_title').html(layerNames['bathy_topo'].name)
    $('#lightning_def_title').html(layerNames['lightning'].name)
    $('#oc_def_title').html(layerNames['oc_uv'].name)



    $('#custom-popup-container').show()
}
function closeLayersHelp() {
    $('#custom-popup-container').hide()
}
function rand(min, max) {
    return min + Math.random() * (max - min);
}

function getRandomColor() {
    var h = rand(0, 255);
    var s = rand(70, 80);
    var l = rand(50, 60);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function searchByLatLng() {
    var lat = 0;
    var lng = 0;

    if (searchLocationType === "DEGREES_MINUTES_SECONDS") {
        var ld = parseFloat($('#search-lat-d').val())
        var lm = parseFloat($('#search-lat-m').val())
        var ls = parseFloat($('#search-lat-s').val())
        var lod = parseFloat($('#search-lng-d').val())
        var lom = parseFloat($('#search-lng-m').val())
        var los = parseFloat($('#search-lng-s').val())

        if (lm >= 60 || lm < 0 || ls >= 60 || ls < 0 || lom >= 60 || lom < 0 || los >= 60 || los < 0) {
            window.flutter_inappwebview.callHandler('searchErrorHandler', "TRUE");
            return;
        }
        lat = ld + (lm / 60) + (ls / 3600)
        lng = lod + (lom / 60) + (los / 3600)
    } else {
        lat = $('#search-lat').val()
        lng = $('#search-lng').val()
        lat = parseFloat(lat)
        lng = parseFloat(lng)
    }
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        closeSearchPopUp(true)
        setTimeout(() => { togglePanel(new L.LatLng(lat, lng)); }, 1000)
        Android.addEvent("location_search", "state", "confirm");
        return;
    } else {
        window.flutter_inappwebview.callHandler('searchErrorHandler', "TRUE");
        return;
    }

}

function openSearchPopUp() {
    activePanel = "search_panel";
    $('#search-title').html(uiWords['search_location'].name)
    $('#search-search-btn').html(uiWords['search'].name)
    $('#search-close-btn').html(uiWords['close'].name)
    $('#search-lat').attr('placeholder', $('<div/>').html(uiWords['latitude'].name + " (-90 &#8211; 90)").text())
    $('#search-lng').attr('placeholder', $('<div/>').html(uiWords['longitude'].name + " (-180 &#8211; 180)").text())
    $('#lat-label').html(uiWords['latitude'].name)
    $('#lng-label').html(uiWords['longitude'].name)
    $('.custom-popup-search').show()
    window.flutter_inappwebview.callHandler('showAppControlls', "FALSE");
}
function closeSearchPopUp(isClose) {
    activePanel = null;
    $('.custom-popup-search').hide()
    window.flutter_inappwebview.callHandler('showAppControlls', "TRUE");
    // if(!isClose)
    //     Android.addEvent("location_search", "state", "cancel");
}


function add12nmLayer(res) {
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

function addEezLayer(res) {
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

function loadBathy(res) {
    var layerData = res;
    var dataArray = JSON.parse(layerData['rasterData']);

    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var v = ((dataArray[i][j] - layerData['minValue']) / (0 - layerData['minValue']));
            // console.log(layerData['maxValue'])
            // console.log(layerData['minValue'])
            var pos = (i * width + j) * 4;
            buffer[pos] = 8 - v * (8 - 59);
            buffer[pos + 1] = 127 - v * (127 - 194);
            buffer[pos + 2] = 181 - v * (181 - 255);
            // buffer[pos+3] = dataArray[i][j]===0?0:255;
            buffer[pos + 3] = dataArray[i][j] >= 0 ? 0 : 250;
            // console.log(225 - v*(225-153), 178 - v*(178-39), 247 - v*(247-207))
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['extent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    L.imageOverlay(dataUri, imageBounds).addTo(map);
    // L.imageOverlay(dataUri, imageBounds).bringToBack();
    reorderLayers()
    //    map.setView([(geom.coordinates[0][0][1]+geom.coordinates[0][2][1])/2, (geom.coordinates[0][0][0]+geom.coordinates[0][2][0])/2], 5)
}
//
function loadBathyLayered(res) {
    var layerData = res;
    var dataArray = JSON.parse(layerData['rasterData']);

    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var v = ((dataArray[i][j] - 0) / (layerData['maxValue'] - 0));
            var pos = (i * width + j) * 4;
            buffer[pos] = getBathyRed(dataArray[i][j])//8 - v*(8-59);
            buffer[pos + 1] = getBathyGreen(dataArray[i][j])//127 - v*(127-194);
            buffer[pos + 2] = getBathyBlue(dataArray[i][j])//181 - v*(181-255);
            // buffer[pos+3] = dataArray[i][j]===0?0:255;
            buffer[pos + 3] = dataArray[i][j] >= 0 ? 75 : 150;
            // console.log(225 - v*(225-153), 178 - v*(178-39), 247 - v*(247-207))
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['extent'])
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    L.imageOverlay(dataUri, imageBounds).addTo(map);
    reorderLayers()
    //    map.setView([(geom.coordinates[0][0][1]+geom.coordinates[0][2][1])/2, (geom.coordinates[0][0][0]+geom.coordinates[0][2][0])/2], 5)
}
var bathyTopoLayer = null;
function loadBathyTopo(res) {
    bathyTopoLayer = L.topoJson(res, {
        style: function (feature) {
            var elevation = feature.properties.ELEV;
            var color = getBathymetryColor(elevation).color;//"#000";
            var opacity = 0.5;//getBathymetryColor(elevation).opacity;
            return {
                color: color,
                weight: 0.1,
                fillColor: color,
                fillOpacity: opacity
            }
        },
    })
    bathyTopoLayer.bringToBack();
    layers["bathy_topo"] = {
        "id": "bathy_topo",
        "layers": [bathyTopoLayer],
        "showDefault": false,
        "Checked": false
    };
    updateLayerList();
}

function getBathyRed(v) {
    if (v > 0) {
        return 150;
    } else if (v > -1000) {
        return 179;
    } else if (v > -2000) {
        return 79;
    } else if (v > -3000) {
        return 49;
    } else if (v > -4000) {
        return 54;
    } else if (v > -5000) {
        return 54;
    } else {
        return 37;
    }
}

function getBathyGreen(v) {
    if (v > 0) {
        return 150;
    } else if (v > -1000) {
        return 222;
    } else if (v > -2000) {
        return 184;
    } else if (v > -3000) {
        return 166;
    } else if (v > -4000) {
        return 143;
    } else if (v > -5000) {
        return 115;
    } else {
        return 66;
    }
}

function getBathyBlue(v) {
    if (v > 0) {
        return 150;
    } else if (v > -1000) {
        return 255;
    } else if (v > -2000) {
        return 255;
    } else if (v > -3000) {
        return 255;
    } else if (v > -4000) {
        return 255;
    } else if (v > -5000) {
        return 255;
    } else {
        return 255;
    }
}

function reorderLayers() {
    // if (layers['bathy_topo']) {
    //     layers["bathy_topo"]["layers"][0].bringToBack()
    // }
    // if (layers['algal_bloom']) {
    //     layers["algal_bloom"]["layers"][0].bringToFront()
    // }
    // if (layers['pfz']) {
    //     layers["pfz"]["layers"][0].bringToFront()
    // }
    /* 
        if (map.hasLayer(pfzLayer)) {
            map.removeLayer(pfzLayer);
            // map.addLayer(pfzLayer);
        }
        if (map.hasLayer(algalBloomLayer)) {
            map.removeLayer(algalBloomLayer);
            // map.addLayer(algalBloomLayer);
        }
        if (map.hasLayer(bathyTopoLayer)) {
            map.removeLayer(bathyTopoLayer);
            // map.addLayer(bathyTopoLayer);
        }
        //
        console.log(`BATHYTOPO ` + bathyTopoLayer);
        if (bathyTopoLayer) {
            // map.removeLayer(bathyTopoLayer);
            L.layerGroup([pfzLayer,algalBloomLayer])
                .addLayer(bathyTopoLayer)
                .addTo(map);
        }
        if (pfzLayer) {
            // map.removeLayer(pfzLayer);
            // L.layerGroup()
            //     .addLayer(pfzLayer)
            //     .addTo(map);
        }
        if (algalBloomLayer) {
            // map.removeLayer(algalBloomLayer);
            // L.layerGroup()
            //     .addLayer(algalBloomLayer)
            //     .addTo(map);
        } */

    updateCloudCover();
}

function getHrsTxt(hrStr) {
    var hr = parseInt(hrStr);
    var m = "am";
    if (hr == 12) {
        m = "pm"
    } else if (hr > 12) {
        hr = hr - 12;
        m = "pm"
    } else if (hr == 0) {
        hr = 12;
    }
    return hr + m;
}

function invertHex(hex) {
    return (Number('0x1' + hex) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

function getHourColorGradient(htStr, nxtHr) {
    var color = getHourColor(htStr);
    if (!nxtHr)
        nxtHr = htStr;
    var nxtColor = getHourColor(nxtHr);
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getHourTextColor(hrStr) {
    return "#555";
    try {
        var color = getHourColor(hrStr);
        return invertHex(color.substr(1, 6))
    } catch (err) { return "#999" }
}

function getHourColor(htStr) {
    htStr = parseInt(htStr)
    switch (htStr) {
        case 00: return '#0a1b3b44';
        case 01: return '#372a3744';
        case 02: return '#6e3d6944';
        case 03: return '#6e3b3244';
        case 04: return '#b7522b44';
        case 05: return '#e4612b44';
        case 06: return '#ef752344';
        case 07: return '#f18e1f44';
        case 08: return '#f5b01a44';
        case 09: return '#f8d21444';
        case 10: return '#fbe14744';
        case 11: return '#fdf07a44';
        case 12: return '#ffffad44';
        case 13: return '#fdf07a44';
        case 14: return '#fbe14744';
        case 15: return '#f8d21444';
        case 16: return '#f5b01a44';
        case 17: return '#f18e1f44';
        case 18: return '#ef752344';
        case 19: return '#e4612b44';
        case 20: return '#b7522b44';
        case 21: return '#6e3b3244';
        case 22: return '#6e3d6944';
        case 23: return '#372a3744';
        default: return "#ffffffaa";
    }
}

function getDayColorGradient(day) {
    var color = "#666";
    var nxtColor = "#666";
    //Changed as per Devleena's suggestion; Grey bg for dates
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
    if (day.indexOf('Sun') !== -1) {
        color = getDayColor('Sun'); nxtColor = getDayColor('Mon');
    }
    if (day.indexOf('Mon') !== -1) {
        color = getDayColor('Mon'); nxtColor = getDayColor('Tue');
    }
    if (day.indexOf('Tue') !== -1) {
        color = getDayColor('Tue'); nxtColor = getDayColor('Wed');
    }
    if (day.indexOf('Wed') !== -1) {
        color = getDayColor('Wed'); nxtColor = getDayColor('Thu');
    }
    if (day.indexOf('Thu') !== -1) {
        color = getDayColor('Thu'); nxtColor = getDayColor('Fri');
    }
    if (day.indexOf('Fri') !== -1) {
        color = getDayColor('Fri'); nxtColor = getDayColor('Sat');
    }
    if (day.indexOf('Sat') !== -1) {
        color = getDayColor('Sat'); nxtColor = getDayColor('Sun');
    }

    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getDayColor(day) {
    if (day.length > 3) { day = day.substr(0, 3); }
    switch (day) {
        case 'Sun': return '#3464F122';
        case 'Mon': return '#14C18B22';
        case 'Tue': return '#48DF1122';
        case 'Wed': return '#DCDF1122';
        case 'Thu': return '#DF6F1122';
        case 'Fri': return '#E02A7A22';
        case 'Sat': return '#7A28BB22';
    }
}

function getTempColorGradient(val, nxtVal, min, max) {
    var color = getTempColor(val, min, max);
    if (!nxtVal)
        nxtVal = val;
    var nxtColor = getTempColor(nxtVal, min, max);
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getTempColor(value, min, max) {
    var v = ((value - min) / (max - min)) * 255;
    var r = v <= 127 ? (v * 2) : 255;
    var g = v <= 127 ? (v * 2) + 20 : (255 - (v - 127) * 2) + 80;
    var b = v <= 127 ? 255 : (255 - (v - 127) * 2);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + 0.50 + ')'
}

function getWindColorGradient(val, nxtVal, min, max) {
    var color = getWindColor(val, min, max);
    if (!nxtVal)
        nxtVal = val;
    var nxtColor = getWindColor(nxtVal, min, max);
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getWindColor(value, min, max) {
    var v = ((value - min) / (max - min));
    var hue = ((1 - v) * 120).toString(10);
    return ["hsl(", hue, ",100%,90%)"].join("");
}

function getPrecipitationColorGradient(val, nxtVal, min, max) {
    var color = getPrecipitationColor(val, min, max);
    if (!nxtVal)
        nxtVal = val;
    var nxtColor = getPrecipitationColor(nxtVal, min, max);
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getPrecipitationColorGradientV2(i, val, nxtVal) {
    var color = getRainfallColorAtIndex(val, i);
    i++;
    if (!nxtVal) {
        nxtVal = val;
        i--;
    }
    var nxtColor = getRainfallColorAtIndex(nxtVal, i);
    color = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] / 255 + ')';
    nxtColor = 'rgba(' + nxtColor[0] + ',' + nxtColor[1] + ',' + nxtColor[2] + ',' + nxtColor[3] / 255 + ')';
    return 'linear-gradient(to right, ' + color + ', ' + nxtColor + ');'
}

function getRainfallColorAtIndex(value, i) {
    if (hasAccess('GFS_WEATHER')) {
        let layerData = allLayerData['precipitation'][i];
        if (layerData) {
            let min = layerData['minValue'];
            let max = layerData['maxValue'];
            return getRainfallColor(value, min, max);
        }
    } else {
        let min = 0.00;
        let max = 1.00;
        return getRainfallColor(value, min, max);
    }
    return '#ffffff00'
}

function getPrecipitationColor(value, min, max) {
    value = ((value - min) / (max - min));
    var lightness = 50 + (1 - value) * 50;
    return ["hsl(", 200, ",100%," + lightness + "%)"].join("");
}

function _showLightning(index, isVisible) {
    var layerData = allLayerData['lightning'][index];
    //    lightningLayer = true;
    var dataArray = JSON.parse(layerData['rasterData']);
    var geom = JSON.parse(layerData['filteredExtent'])
    var xRes = layerData['xRes'], yRes = layerData['yRes'], x1 = geom.coordinates[0][0][0], y1 = geom.coordinates[0][0][1], nx = layerData['nx'], ny = layerData['ny'], min = layerData['minValue'], max = layerData['maxValue'];
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    var gridPoints = [];
    var gridMask = null;
    var mp = {
        "type": "MultiPolygon",
        "coordinates": []
    };
    try {
        for (var i = 0; i < ny; i++) {
            for (var j = 0; j < nx; j++) {
                if (dataArray[i][j] > 0) {
                    var cLng, cLat;
                    cLat = (x1 + (j * xRes));
                    cLng = (y1 - (i * yRes));
                    var l = L.polygon([
                        [cLat - yRes / 2, cLng - xRes / 2],
                        [cLat + yRes / 2, cLng - xRes / 2],
                        [cLat + yRes / 2, cLng + xRes / 2],
                        [cLat - yRes / 2, cLng + xRes / 2],
                    ]);
                    mp.coordinates.push(l.toGeoJSON().geometry.coordinates);
                }
            }
        }
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    if (mp.coordinates.length === 0) {
        lightningLayer = null;
        return;
    }
    var smoothed = turf.polygonSmooth(mp, { iterations: 5 })
    if (lightningLayer) {
        console.log('ligt index', index);
        map.removeLayer(lightningLayer);
    }
    lightningLayer = smoothed.features.length > 0 ? L.polygon(smoothed.features[0].geometry.coordinates, { fillColor: '#2A9BFF00', fillOpacity: 0.5, stroke: false, fill: 'url(../libs/images/lightning.png)' }) : null;
    if (lightningLayer) {
        layers["lightning"] = {
            "id": "lightning",
            "layers": [lightningLayer],
            "showDefault": isVisible,
            "Checked": isVisible
        };
        if (isVisible)
            lightningLayer.addTo(map);
    } else {
        lightningLayer = null;
    }
}

function _showRainfall(layerData) {
    //return;
    var dataArray = JSON.parse(layerData['rasterData']);
    var geom = JSON.parse(layerData['filteredExtent'])
    var xRes = layerData['xRes'], yRes = layerData['yRes'], x1 = geom.coordinates[0][0][0], y1 = geom.coordinates[0][0][1], nx = layerData['nx'], ny = layerData['ny'], min = layerData['minValue'], max = layerData['maxValue'];
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    var gridPoints = [];
    var gridMask = null;
    for (var i = 0; i < ny; i++) {
        for (var j = 0; j < nx; j++) {
            if (dataArray[i][j] > 0) {
                var cLng, cLat;
                cLat = (x1 + (j * xRes));
                cLng = (y1 - (i * yRes));
                var l = L.polygon([
                    //                    [cLat-yRes/2, cLng-xRes/2],
                    //                    [cLat+yRes/2, cLng-xRes/2],
                    //                    [cLat+yRes/2, cLng+xRes/2],
                    //                    [cLat-yRes/2, cLng+xRes/2],
                    [cLng - xRes / 2, cLat - yRes / 2],
                    [cLng + xRes / 2, cLat - yRes / 2],
                    [cLng + xRes / 2, cLat + yRes / 2],
                    [cLng - xRes / 2, cLat + yRes / 2],
                ]);
                if (gridMask == null)
                    gridMask = l.toGeoJSON();
                else
                    gridMask = turf.union(gridMask, l.toGeoJSON());
            }
        }
    }
    var smoothed = turf.polygonSmooth(gridMask, { iterations: 5 })
    precipitationLayer = L.geoJSON(smoothed, {
        style: function (f) { return { fillColor: '#2A9BFF', fillOpacity: 0.4, stroke: false }; }
    });
    if (!layers["precipitation"]) {
        layers["precipitation"] = {
            "id": "precipitation",
            "layers": [precipitationLayer],
            "showDefault": false,
            "Checked": false
        };
    } else {
        layers["precipitation"]["layers"].push(precipitationLayer);
    }
    updateLayerList()
}


function loadTideData(res) {
    var param = 'tide_data';
    allLayerData[param] = [];
    try {
        allLayerData[param].push(JSON.parse(res))
    } catch {
        allLayerData[param].push(res)
    }
}

function getDummyTideDataForLocation(location) {
    var count = 5;
    var minDate = (new Date()).getTime();
    var maxDate = (new Date(minDate + (1000 * 60 * 60 * 12))).getTime()
    var tideValues = [];
    for (var i = 0; i < count; i++) {
        var fcTime = Math.floor(minDate + Math.random() * (maxDate - minDate));
        var tType = Math.floor((Math.random() * (2))) === 0 ? 'low_tide' : 'high_tide';
        var tHeight = 0.0 + Math.random() * (5.0 - 0.0);
        tideValues.push({
            tidalType: tType,
            tidalHeight: tHeight,
            forecastTime: fcTime
        });
    }
    return tideValues;
}

function getTideDataForLocation(location) {
    var layerData = allLayerData['tide_data'];
    if (!layerData)
        return [];
    var resArr = []
    var targetLocation = {
        x: location.lng,
        y: location.lat,
    };
    var closest = closestLocation(targetLocation, layerData[0]);
    if (closest == null) {
        return resArr;
    }
    var distToClosest = L.GeometryUtil.length([location, L.latLng(closest.y, closest.x)]);
    if (distToClosest > TIDE_MAXIMUM_BUFFER) {
        return resArr;
    }
    layerData[0].map(function (tide) {
        if (tide.locationName == closest.locationName) {
            resArr.push(tide)
        }
    });
    return resArr;
}

function closestLocation(targetLocation, locationData) {
    function vectorDistance(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
        var dx = location1.x - location2.x,
            dy = location1.y - location2.y;
        return vectorDistance(dx, dy);
    }

    //  locationData.sort((a, b) => locationDistance(targetLocation, a)-locationDistance(targetLocation, b));
    //  return locationData[0]
    if (locationData.length === 0) {
        return null;
    }

    return locationData.reduce(function (prev, curr) {
        var prevDistance = locationDistance(targetLocation, prev),
            currDistance = locationDistance(targetLocation, curr);
        return prevDistance < currDistance ? prev : curr;
    });
}

function CheckTideDataByTopRowDateAndTime(todayDate, todayTime, timeLength, tideValues) {
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var returnValue = [];
    for (let i = 0; i < tideValues.length; i++) {
        if (tideValues[i]) {
            var tide = tideValues[i];
            var tideTime = new Date(tide.forecastTime);
            var day = days[tideTime.getDay()];
            var _date = tideTime.getDate();
            var date = String("0" + _date).slice(-2);
            var h = tideTime.getHours();
            var hour = (h > 12) ? (h - 12 + 'pm') : (h + 'am');
            if (todayDate == (day + " " + date) && todayTime == hour) {
                var height = (tide.tidalHeight).toFixed(1);
                var type = tide.tidalType;
                var s_type = uiWords['high'].name
                var returnTideImg = 'hightide1'
                if (type == 'low_tide') {
                    s_type = uiWords['low'].name
                    returnTideImg = 'lowtide1'
                }
                returnValue = ["0", s_type, height + 'm', returnTideImg];
            }
        }
    }
    if (returnValue.length != 0) {
        return returnValue;
    }
    else {
        return ["1"];
    }
}


function showLightningHeatMap(index, isVisible) {
    var layerData = allLayerData['lightning'][index];
    var colorRamp = [[48, 87, 138, 200, 0], [255, 255, 255, 200, 50], [238, 138, 91, 200, 100]];
    var dataArray = JSON.parse(layerData['rasterData']);
    var width = layerData['nx'],
        height = layerData['ny'],
        buffer = new Uint8ClampedArray(width * height * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var value = dataArray[i][j];
            var colorRampSize = colorRamp.length;
            var rampRatio = (1 / (colorRampSize - 1));
            var overAllRatio = (value - layerData['minValue']) / (layerData['maxValue'] - layerData['minValue']);
            var index = Math.floor(overAllRatio / rampRatio);
            var startColor = colorRamp[index];
            var endColor = (index + 1) >= colorRamp.length ? colorRamp[index] : colorRamp[index + 1];
            var startColorX = startColor[4] / 100;
            var endColorX = endColor[4] / 100;
            var currentX = overAllRatio - startColorX;
            var localRatio = currentX / endColorX;
            rgbaVal = getRatioColor(endColor, startColor, localRatio);
            var pos = (i * width + j) * 4;
            buffer[pos] = rgbaVal[0];
            buffer[pos + 1] = rgbaVal[1];
            buffer[pos + 2] = rgbaVal[2];
            buffer[pos + 3] = rgbaVal[3];//value>100?rgbaVal[3]:0;
        }
    }
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var iData = ctx.createImageData(width, height);
    iData.data.set(buffer);
    ctx.putImageData(iData, 0, 0);
    var dataUri = canvas.toDataURL();
    var geom = JSON.parse(layerData['filteredExtent']);
    var imageBounds = [[geom.coordinates[0][0][1], geom.coordinates[0][0][0]], [geom.coordinates[0][2][1], geom.coordinates[0][2][0]]];
    if (lightningLayer) {
        map.removeLayer(lightningLayer);
    }
    map.createPane('lightningL');
    map.getPane('lightningL').style.zIndex = 400;
    lightningLayer = L.imageOverlay(dataUri, imageBounds, { className: 'img-pixelated', pane: 'lightningL' });
    if (isVisible)
        lightningLayer.addTo(map);
    layers["lightning"] = {
        "id": "lightning",
        "layers": [lightningLayer],
        "showDefault": isVisible,
        "Checked": isVisible
    };
    updateLayerList()
}

function getRatioColor(startColor, endColor, ratio) {
    const w = ratio * 2 - 1;
    const w1 = (w + 1) / 2;
    const w2 = 1 - w1;
    return [Math.round(startColor[0] * w1 + endColor[0] * w2),
    Math.round(startColor[1] * w1 + endColor[1] * w2),
    Math.round(startColor[2] * w1 + endColor[2] * w2),
    Math.round((startColor[3] * w1 + endColor[3] * w2))];
}

function setSubscriptionAccess(accessStr) {
    try {
        subscriptionAccess = JSON.parse(accessStr).value;
    } catch (e) {
        subscriptionAccess = accessStr.value;
        console.log(`2421 ${e}`);
    }
}

function hasAccess(feature) {
    return subscriptionAccess.indexOf(feature) !== -1
}

function openUpgradeSubscription() {
    console.log('Called upgrade subscription');
    togglePanel();
    window.flutter_inappwebview.callHandler('upgradeSubscriptionHandler', "TRUE");
}



//AFTER 3.1.6
function updateCloudCover() {
    if (
        pfzLayer != null
        && map != null
        && map.hasLayer(pfzLayer)
        && allLayerData["pfz"]
        && allLayerData["pfz"].showCloudCover
        && allLayerData["pfz"].cloudCover
        && allLayerData["pfz"].cloudCover.percent
        && allLayerData["pfz"].cloudCover.tag
        && allLayerData["pfz"].cloudCover.time
    ) {
        console.log(allLayerData["pfz"].cloudCover.tag);
        switch (allLayerData["pfz"].cloudCover.tag) {
            case "cloud":
                console.log(`'cloud', ${allLayerData["pfz"].cloudCover.percent.toFixed(0) + '%'}, ${new Date(allLayerData["pfz"].cloudCover.time).toLocaleDateString("in")}, ${activePanel ? "N" : "Y"}`);
                window.flutter_inappwebview.callHandler('cloudCoverHandler', 'cloud', allLayerData["pfz"].cloudCover.percent.toFixed(0) + '%', new Date(allLayerData["pfz"].cloudCover.time).toLocaleDateString("in"), activePanel ? "N" : "Y");
                break;
            case "noSatellite":
                console.log(`'noSatellite', ${allLayerData["pfz"].cloudCover.percent.toFixed(0) + '%'}, ${new Date(allLayerData["pfz"].cloudCover.time).toLocaleDateString("in")}, ${activePanel ? "N" : "Y"}`);
                window.flutter_inappwebview.callHandler('cloudCoverHandler', 'noSatellite', allLayerData["pfz"].cloudCover.percent.toFixed(0) + '%', new Date(allLayerData["pfz"].cloudCover.time).toLocaleDateString("in"), activePanel ? "N" : "Y");
                break;
            default:
                window.flutter_inappwebview.callHandler('cloudCoverHandler', "FALSE");
                break;
        }
        //       if(imgName){
        //           $('#cloud-cover-container').show();
        //           $("#img-cloud-cover").attr("src", "http://127.0.0.1:8080/libs/images/"+imgName+".png");
        //           $('#cloud-cover-value').html(allLayerData["pfz"].cloudCover.percent+'%');
        //       }else{
        //           $('#cloud-cover-container').hide();
        //       }
        $('#cloud-cover-container').hide();
    }
    else {
        $('#cloud-cover-container').hide();
        window.flutter_inappwebview.callHandler('cloudCoverHandler', "FALSE");
        // Android.hidePfzMeta();
    }
}

function setSearchType(type) {
    searchLocationType = type;
    if (searchLocationType === 'DEGREES_MINUTES_SECONDS') {
        $('#search-lat-lng-deci-container').hide();
        $('#search-lat-lng-dms-container').show();
    } else {
        $('#search-lat-lng-deci-container').show();
        $('#search-lat-lng-dms-container').hide();
    }
}

function addBathymetryTile(pmTilesUrl, styleStr) {
   /*  let json_style;
    try {
        json_style = JSON.parse(styleStr);
    }
    catch (e) {
        json_style = styleStr;
    }
    let result = protomaps.json_style(json_style, {})
    const p = new protomaps.PMTiles(pmTilesUrl)
    p.metadata().then(m => {
        let bounds_str = m.bounds.split(',')
        let bounds = [[+bounds_str[1], +bounds_str[0]], [+bounds_str[3], +bounds_str[2]]]
        mbtilelayer = new protomaps.LeafletLayer({ url: p, bounds: bounds, paint_rules: result.paint_rules, label_rules: result.label_rules })

        layers["bathy_topo"] = {
            "id": "bathy_topo",
            "layers": [mbtilelayer],
            "showDefault": false,
            "Checked": false
        };
    }); */

    // map.createPane('mbtiles');
    // map.getPane('mbtiles').style.zIndex = 650;

    // var mb = L.tileLayer.mbTiles('../in/bathymetry_z11_bathy.mbtiles',{
    //     pane: 'mbtiles'
    // }).addTo(map);

    // layers["bathy_topo"] = {
    //     "id": "bathy_topo",
    //     "layers": [mb],
    //     "showDefault": false,
    //     "Checked": false
    // };

	// mb.on('databaseloaded', function(ev) {
	// 	console.info('MBTiles DB loaded', ev);
	// });
	// mb.on('databaseerror', function(ev) {
	// 	console.info('MBTiles DB error', ev);
	// });
    let bathyurl = 'http://localhost:5500/assets/bathy_nozip.pmtiles,headers'
    let bathy_json_style;
    var bathy_style = "{\"layers\":[{\"type\":\"line\",\"ID\":\"124\",\"paint\":{\"line-color\":\"#AB2C49\",\"line-width\":2}},{\"type\":\"fill\",\"source-layer\":\"n8ofish_bathy_3857_v2\",\"paint\":{\"fill-color\":\"#A8A8A8\",\"fill-opacity\":0.5}}]}"
    try {
      bathy_json_style = JSON.parse(bathy_style);
    }
    catch (e) {
      bathy_json_style = bathy_style;
    }
    let bathy_result = new protomaps.json_style(bathy_json_style, {})
    const bathy = new protomaps.PMTiles(bathyurl)
    bathy.metadata().then(m => {
      let bounds_str = m.bounds.split(',')
      let bounds = [[+bounds_str[1], +bounds_str[0]], [+bounds_str[3], +bounds_str[2]]]
      layer = protomaps.leafletLayer({ url: bathy, bounds: bounds, paint_rules: bathy_result.paint_rules, label_rules: bathy_result.label_rules })
      layer.addTo(map)
    });
    // const p = new protomaps.PMTiles(pmTilesUrl,{allow_200:true})
    // var mb = p.leafletLayer({attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'})
    // layers["bathy_topo"] = {
    //     "id": "bathy_topo",
    //     "layers": [mb],
    //     "showDefault": false,
    //     "Checked": false
    // };
}