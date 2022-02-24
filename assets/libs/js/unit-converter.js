
var UnitHelper = {
    getUnitSymbol: function(unit) {
        switch(unit){
            case Units.METER:
                  return "m"
            case Units.FATHOM:
                  return "fath"
            case Units.FEET:
                  return "ft"
            case Units.DECIMAL_DEGREES:
                  return "&#176;"
            case Units.DEGREES_MINUTES_SECONDS:
                  return ""
            case Units.CELSIUS:
                  return "&#176;C"
            case Units.KELVIN:
                  return "K"
            case Units.FAHRENHEIT:
                  return "&#176;F"
            case Units.MPH:
                  return "mi/hr"
            case Units.KMPH:
                  return "km/hr"
            case Units.NMPH:
                  return "nm/hr"
            case Units.MPS:
                  return "m/s"
            case Units.KG:
                  return "kg"
            case Units.TONNE:
                  return "ton"
            case Units.KM:
                  return "km"
            case Units.MILE:
                  return "mi"
            case Units.NAUTICAL_MILE:
                  return "nm"
        }
        return "";
    },
    defaultTemperature: function(from, value) {
        switch(from){
            case Units.KELVIN:
                return value - 273;
            case Units.FAHRENHEIT:
                return (value-32)*5/9;
        }
        return value;
    },
    defaultDistance: function(from, value) {
        switch(from){
            case Units.KM:
                return value*1000;
            case Units.MILE:
                return value*1609;
            case Units.NAUTICAL_MILE:
                return value*1852;
        }
        return value;
    },
    defaultDepth: function(from, value) {
        switch(from){
            case Units.FEET:
                return value*0.3048;
            case Units.FATHOM:
                return value*1.8288;
        }
        return value;
    },
    defaultSpeed: function(from, value) {
        switch(from){
            case Units.KMPH:
                return value/3.6;
            case Units.MPH:
                return value/2.237;
            case Units.NMPH:
                return value/1.94384;
        }
        return value;
    },
    defaultQuantity: function(from, value) {
        switch(from){
            case Units.TONNE:
                return value/1000;
        }
        return value;
    },
}

var UnitConverter = {
	convertTemperature: function(to, value, from) {
	    if(!from)
	        from=Units.CELSIUS
	    value = parseFloat(value);
		var a = UnitHelper.defaultTemperature(from, value);
		var v = 0;
		switch(to){
			case Units.FAHRENHEIT:
				v = (a*9/5)+32;
				break;
			case Units.KELVIN:
				v = a+273;
				break;
			default:
				v = a;
				break;
		}
		return (v).toFixed(1)// + " " + UnitHelper.getUnitSymbol(to);
	},
	convertDistance: function(to, value, from) {
	    if(!from)
	        from=Units.METER
	    value = parseFloat(value);
		var a = UnitHelper.defaultDistance(from, value);
		var v = 0;
		switch(to){
			case Units.KM:
				v = a/1000;
				break;
			case Units.MILE:
				v = a/1609;
				break;
			case Units.NAUTICAL_MILE:
				v = a/1852;
				break;
			default:
				v = a;
				break;
		}
		return v.toFixed(0) + " " + UnitHelper.getUnitSymbol(to);
	},
	convertQuantity: function(to, value, from) {
	    if(!from)
	        from=Units.KG
	    value = parseFloat(value);
		var a = UnitHelper.defaultQuantity(from, value);
		var v = 0;
		switch(to){
			case Units.TONNE:
				v = a/1000;
				break;
			default:
				v = a;
				break;
		}
		return v.toFixed(3) + " " + UnitHelper.getUnitSymbol(to);
	},
	convertDepth: function(to, value, from) {
	    if(!from)
	        from=Units.METER
	    value = parseFloat(value);
		var a = UnitHelper.defaultDepth(from, value);
		var v = 0;
		switch(to){
			case Units.FEET:
				v = a*3.28084;
				break;
			case Units.FATHOM:
				v = a/1.8288;
				break;
			default:
				v = a;
				break;
		}
		console.log(to)
		return v.toFixed(0) + " " + UnitHelper.getUnitSymbol(to);
	},
	convertSpeed: function(to, value, from) {
	    if(!from)
	        from=Units.MPS
	    value = parseFloat(value);
		var a = UnitHelper.defaultSpeed(from, value);
		var v = 0;
		switch(to){
			case Units.KMPH:
				v = a*3.6;
				break;
			case Units.MPH:
				v = a*2.273;
				break;
			case Units.NMPH:
				v = a*1.94384;
				break;
			default:
				v = a;
				break;
		}
		return v.toFixed(1)// + " " + UnitHelper.getUnitSymbol(to);
	},
	convertLocation: function(to, value, from) {
	    if(!from)
	        from=Units.MPS
	    value = parseFloat(value);
		var a = (value);
		switch(to){
			case Units.DEGREES_MINUTES_SECONDS:
				var degrees = Math.floor(a)
                var minutes = Math.floor(((a - degrees) * 60))
                var seconds = Math.floor((((((a - degrees) * 60)) - minutes)*60))
				return degrees + "&#176;" + minutes + "\'" + seconds + "\"";
		}
		return a.toFixed(2) + " &#176;";
	},
};

var Units = {
	METER: "METER",
    FEET: "FEET",
    DECIMAL_DEGREES: "DECIMAL_DEGREES",
    DEGREES_MINUTES_SECONDS: "DEGREES_MINUTES_SECONDS",
    CELSIUS: "CELSIUS",
    KELVIN: "KELVIN",
    FAHRENHEIT: "FAHRENHEIT",
    MPH: "MPH",
    KMPH: "KMPH",
    NMPH: "NMPH",
    MPS: "MPS",
    KG: "KG",
    TONNE: "TONNE",
    KM: "KM",
    MILE: "MILE",
    FATHOM: "FATHOM",
    NAUTICAL_MILE: "NAUTICAL_MILE",
};