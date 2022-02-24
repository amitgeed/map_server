var PORT = 8080;
var REGION_EXTENT = [[15.0, 69 ], [20.6, 74.0]];
var COUNTRY_BOUNDS = [[37.105878, 63.873177],[-5.0, 99.111090]];
var MAP_CENTER = [22.402818, 78.134574];

function getBathymetryColor(elevation){
    if(elevation<=-5500){
        return {
            color: "#000",
            opacity: 0.1
        }
    }else if(elevation<=-5000){
        return {
            color: "#222",
            opacity: 0.1
        }
    }else if(elevation<=-4500){
        return {
            color: "#444",
            opacity: 0.1
        }
    }else if(elevation<=-4000){
        return {
            color: "#666",
            opacity: 0.1
        }
    }else if(elevation<=-3500){
        return {
            color: "#777",
            opacity: 0.1
        }
    }else if(elevation<=-3000){
        return {
            color: "#888",
            opacity: 0.1
        }
    }else if(elevation<=-2500){
        return {
            color: "#999",
            opacity: 0.1
        }
    }else if(elevation<=-2000){
        return {
            color: "#AAA",
            opacity: 0.1
        }
    }else if(elevation<=-1500){
        return {
            color: "#bbb",
            opacity: 0.1
        }
    }else if(elevation<=-1000){
        return {
            color: "#ccc",
            opacity: 0.1
        }
    }else if(elevation<=-500){
        return {
            color: "#ddd",
            opacity: 0.1
        }
    }else{
        return {
            color: "#eee",
            opacity: 0.1
        }
    }
}