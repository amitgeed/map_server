var protomaps = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/@mapbox/point-geometry/index.js
  var require_point_geometry = __commonJS({
    "node_modules/@mapbox/point-geometry/index.js"(exports, module) {
      "use strict";
      module.exports = Point7;
      function Point7(x, y) {
        this.x = x;
        this.y = y;
      }
      Point7.prototype = {
        clone: function() {
          return new Point7(this.x, this.y);
        },
        add: function(p) {
          return this.clone()._add(p);
        },
        sub: function(p) {
          return this.clone()._sub(p);
        },
        multByPoint: function(p) {
          return this.clone()._multByPoint(p);
        },
        divByPoint: function(p) {
          return this.clone()._divByPoint(p);
        },
        mult: function(k) {
          return this.clone()._mult(k);
        },
        div: function(k) {
          return this.clone()._div(k);
        },
        rotate: function(a) {
          return this.clone()._rotate(a);
        },
        rotateAround: function(a, p) {
          return this.clone()._rotateAround(a, p);
        },
        matMult: function(m) {
          return this.clone()._matMult(m);
        },
        unit: function() {
          return this.clone()._unit();
        },
        perp: function() {
          return this.clone()._perp();
        },
        round: function() {
          return this.clone()._round();
        },
        mag: function() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        equals: function(other) {
          return this.x === other.x && this.y === other.y;
        },
        dist: function(p) {
          return Math.sqrt(this.distSqr(p));
        },
        distSqr: function(p) {
          var dx = p.x - this.x, dy = p.y - this.y;
          return dx * dx + dy * dy;
        },
        angle: function() {
          return Math.atan2(this.y, this.x);
        },
        angleTo: function(b) {
          return Math.atan2(this.y - b.y, this.x - b.x);
        },
        angleWith: function(b) {
          return this.angleWithSep(b.x, b.y);
        },
        angleWithSep: function(x, y) {
          return Math.atan2(this.x * y - this.y * x, this.x * x + this.y * y);
        },
        _matMult: function(m) {
          var x = m[0] * this.x + m[1] * this.y, y = m[2] * this.x + m[3] * this.y;
          this.x = x;
          this.y = y;
          return this;
        },
        _add: function(p) {
          this.x += p.x;
          this.y += p.y;
          return this;
        },
        _sub: function(p) {
          this.x -= p.x;
          this.y -= p.y;
          return this;
        },
        _mult: function(k) {
          this.x *= k;
          this.y *= k;
          return this;
        },
        _div: function(k) {
          this.x /= k;
          this.y /= k;
          return this;
        },
        _multByPoint: function(p) {
          this.x *= p.x;
          this.y *= p.y;
          return this;
        },
        _divByPoint: function(p) {
          this.x /= p.x;
          this.y /= p.y;
          return this;
        },
        _unit: function() {
          this._div(this.mag());
          return this;
        },
        _perp: function() {
          var y = this.y;
          this.y = this.x;
          this.x = -y;
          return this;
        },
        _rotate: function(angle) {
          var cos = Math.cos(angle), sin = Math.sin(angle), x = cos * this.x - sin * this.y, y = sin * this.x + cos * this.y;
          this.x = x;
          this.y = y;
          return this;
        },
        _rotateAround: function(angle, p) {
          var cos = Math.cos(angle), sin = Math.sin(angle), x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y), y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
          this.x = x;
          this.y = y;
          return this;
        },
        _round: function() {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
        }
      };
      Point7.convert = function(a) {
        if (a instanceof Point7) {
          return a;
        }
        if (Array.isArray(a)) {
          return new Point7(a[0], a[1]);
        }
        return a;
      };
    }
  });

  // node_modules/@mapbox/vector-tile/lib/vectortilefeature.js
  var require_vectortilefeature = __commonJS({
    "node_modules/@mapbox/vector-tile/lib/vectortilefeature.js"(exports, module) {
      "use strict";
      var Point7 = require_point_geometry();
      module.exports = VectorTileFeature;
      function VectorTileFeature(pbf, end, extent, keys, values) {
        this.properties = {};
        this.extent = extent;
        this.type = 0;
        this._pbf = pbf;
        this._geometry = -1;
        this._keys = keys;
        this._values = values;
        pbf.readFields(readFeature, this, end);
      }
      function readFeature(tag, feature, pbf) {
        if (tag == 1)
          feature.id = pbf.readVarint();
        else if (tag == 2)
          readTag(pbf, feature);
        else if (tag == 3)
          feature.type = pbf.readVarint();
        else if (tag == 4)
          feature._geometry = pbf.pos;
      }
      function readTag(pbf, feature) {
        var end = pbf.readVarint() + pbf.pos;
        while (pbf.pos < end) {
          var key = feature._keys[pbf.readVarint()], value = feature._values[pbf.readVarint()];
          feature.properties[key] = value;
        }
      }
      VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"];
      VectorTileFeature.prototype.loadGeometry = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;
        var end = pbf.readVarint() + pbf.pos, cmd = 1, length = 0, x = 0, y = 0, lines = [], line;
        while (pbf.pos < end) {
          if (length <= 0) {
            var cmdLen = pbf.readVarint();
            cmd = cmdLen & 7;
            length = cmdLen >> 3;
          }
          length--;
          if (cmd === 1 || cmd === 2) {
            x += pbf.readSVarint();
            y += pbf.readSVarint();
            if (cmd === 1) {
              if (line)
                lines.push(line);
              line = [];
            }
            line.push(new Point7(x, y));
          } else if (cmd === 7) {
            if (line) {
              line.push(line[0].clone());
            }
          } else {
            throw new Error("unknown command " + cmd);
          }
        }
        if (line)
          lines.push(line);
        return lines;
      };
      VectorTileFeature.prototype.bbox = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;
        var end = pbf.readVarint() + pbf.pos, cmd = 1, length = 0, x = 0, y = 0, x1 = Infinity, x2 = -Infinity, y1 = Infinity, y2 = -Infinity;
        while (pbf.pos < end) {
          if (length <= 0) {
            var cmdLen = pbf.readVarint();
            cmd = cmdLen & 7;
            length = cmdLen >> 3;
          }
          length--;
          if (cmd === 1 || cmd === 2) {
            x += pbf.readSVarint();
            y += pbf.readSVarint();
            if (x < x1)
              x1 = x;
            if (x > x2)
              x2 = x;
            if (y < y1)
              y1 = y;
            if (y > y2)
              y2 = y;
          } else if (cmd !== 7) {
            throw new Error("unknown command " + cmd);
          }
        }
        return [x1, y1, x2, y2];
      };
      VectorTileFeature.prototype.toGeoJSON = function(x, y, z) {
        var size = this.extent * Math.pow(2, z), x0 = this.extent * x, y0 = this.extent * y, coords = this.loadGeometry(), type = VectorTileFeature.types[this.type], i, j;
        function project3(line) {
          for (var j2 = 0; j2 < line.length; j2++) {
            var p = line[j2], y2 = 180 - (p.y + y0) * 360 / size;
            line[j2] = [
              (p.x + x0) * 360 / size - 180,
              360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
            ];
          }
        }
        switch (this.type) {
          case 1:
            var points = [];
            for (i = 0; i < coords.length; i++) {
              points[i] = coords[i][0];
            }
            coords = points;
            project3(coords);
            break;
          case 2:
            for (i = 0; i < coords.length; i++) {
              project3(coords[i]);
            }
            break;
          case 3:
            coords = classifyRings(coords);
            for (i = 0; i < coords.length; i++) {
              for (j = 0; j < coords[i].length; j++) {
                project3(coords[i][j]);
              }
            }
            break;
        }
        if (coords.length === 1) {
          coords = coords[0];
        } else {
          type = "Multi" + type;
        }
        var result = {
          type: "Feature",
          geometry: {
            type,
            coordinates: coords
          },
          properties: this.properties
        };
        if ("id" in this) {
          result.id = this.id;
        }
        return result;
      };
      function classifyRings(rings) {
        var len = rings.length;
        if (len <= 1)
          return [rings];
        var polygons = [], polygon, ccw;
        for (var i = 0; i < len; i++) {
          var area = signedArea(rings[i]);
          if (area === 0)
            continue;
          if (ccw === void 0)
            ccw = area < 0;
          if (ccw === area < 0) {
            if (polygon)
              polygons.push(polygon);
            polygon = [rings[i]];
          } else {
            polygon.push(rings[i]);
          }
        }
        if (polygon)
          polygons.push(polygon);
        return polygons;
      }
      function signedArea(ring) {
        var sum = 0;
        for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
          p1 = ring[i];
          p2 = ring[j];
          sum += (p2.x - p1.x) * (p1.y + p2.y);
        }
        return sum;
      }
    }
  });

  // node_modules/@mapbox/vector-tile/lib/vectortilelayer.js
  var require_vectortilelayer = __commonJS({
    "node_modules/@mapbox/vector-tile/lib/vectortilelayer.js"(exports, module) {
      "use strict";
      var VectorTileFeature = require_vectortilefeature();
      module.exports = VectorTileLayer;
      function VectorTileLayer(pbf, end) {
        this.version = 1;
        this.name = null;
        this.extent = 4096;
        this.length = 0;
        this._pbf = pbf;
        this._keys = [];
        this._values = [];
        this._features = [];
        pbf.readFields(readLayer, this, end);
        this.length = this._features.length;
      }
      function readLayer(tag, layer, pbf) {
        if (tag === 15)
          layer.version = pbf.readVarint();
        else if (tag === 1)
          layer.name = pbf.readString();
        else if (tag === 5)
          layer.extent = pbf.readVarint();
        else if (tag === 2)
          layer._features.push(pbf.pos);
        else if (tag === 3)
          layer._keys.push(pbf.readString());
        else if (tag === 4)
          layer._values.push(readValueMessage(pbf));
      }
      function readValueMessage(pbf) {
        var value = null, end = pbf.readVarint() + pbf.pos;
        while (pbf.pos < end) {
          var tag = pbf.readVarint() >> 3;
          value = tag === 1 ? pbf.readString() : tag === 2 ? pbf.readFloat() : tag === 3 ? pbf.readDouble() : tag === 4 ? pbf.readVarint64() : tag === 5 ? pbf.readVarint() : tag === 6 ? pbf.readSVarint() : tag === 7 ? pbf.readBoolean() : null;
        }
        return value;
      }
      VectorTileLayer.prototype.feature = function(i) {
        if (i < 0 || i >= this._features.length)
          throw new Error("feature index out of bounds");
        this._pbf.pos = this._features[i];
        var end = this._pbf.readVarint() + this._pbf.pos;
        return new VectorTileFeature(this._pbf, end, this.extent, this._keys, this._values);
      };
    }
  });

  // node_modules/@mapbox/vector-tile/lib/vectortile.js
  var require_vectortile = __commonJS({
    "node_modules/@mapbox/vector-tile/lib/vectortile.js"(exports, module) {
      "use strict";
      var VectorTileLayer = require_vectortilelayer();
      module.exports = VectorTile2;
      function VectorTile2(pbf, end) {
        this.layers = pbf.readFields(readTile, {}, end);
      }
      function readTile(tag, layers, pbf) {
        if (tag === 3) {
          var layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
          if (layer.length)
            layers[layer.name] = layer;
        }
      }
    }
  });

  // node_modules/@mapbox/vector-tile/index.js
  var require_vector_tile = __commonJS({
    "node_modules/@mapbox/vector-tile/index.js"(exports, module) {
      module.exports.VectorTile = require_vectortile();
      module.exports.VectorTileFeature = require_vectortilefeature();
      module.exports.VectorTileLayer = require_vectortilelayer();
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/pbf/index.js
  var require_pbf = __commonJS({
    "node_modules/pbf/index.js"(exports, module) {
      "use strict";
      module.exports = Pbf;
      var ieee754 = require_ieee754();
      function Pbf(buf) {
        this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
        this.pos = 0;
        this.type = 0;
        this.length = this.buf.length;
      }
      Pbf.Varint = 0;
      Pbf.Fixed64 = 1;
      Pbf.Bytes = 2;
      Pbf.Fixed32 = 5;
      var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
      var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
      var TEXT_DECODER_MIN_LENGTH = 12;
      var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf8");
      Pbf.prototype = {
        destroy: function() {
          this.buf = null;
        },
        readFields: function(readField, result, end) {
          end = end || this.length;
          while (this.pos < end) {
            var val = this.readVarint(), tag = val >> 3, startPos = this.pos;
            this.type = val & 7;
            readField(tag, result, this);
            if (this.pos === startPos)
              this.skip(val);
          }
          return result;
        },
        readMessage: function(readField, result) {
          return this.readFields(readField, result, this.readVarint() + this.pos);
        },
        readFixed32: function() {
          var val = readUInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
        },
        readSFixed32: function() {
          var val = readInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
        },
        readFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
        },
        readSFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
        },
        readFloat: function() {
          var val = ieee754.read(this.buf, this.pos, true, 23, 4);
          this.pos += 4;
          return val;
        },
        readDouble: function() {
          var val = ieee754.read(this.buf, this.pos, true, 52, 8);
          this.pos += 8;
          return val;
        },
        readVarint: function(isSigned) {
          var buf = this.buf, val, b;
          b = buf[this.pos++];
          val = b & 127;
          if (b < 128)
            return val;
          b = buf[this.pos++];
          val |= (b & 127) << 7;
          if (b < 128)
            return val;
          b = buf[this.pos++];
          val |= (b & 127) << 14;
          if (b < 128)
            return val;
          b = buf[this.pos++];
          val |= (b & 127) << 21;
          if (b < 128)
            return val;
          b = buf[this.pos];
          val |= (b & 15) << 28;
          return readVarintRemainder(val, isSigned, this);
        },
        readVarint64: function() {
          return this.readVarint(true);
        },
        readSVarint: function() {
          var num = this.readVarint();
          return num % 2 === 1 ? (num + 1) / -2 : num / 2;
        },
        readBoolean: function() {
          return Boolean(this.readVarint());
        },
        readString: function() {
          var end = this.readVarint() + this.pos;
          var pos = this.pos;
          this.pos = end;
          if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
            return readUtf8TextDecoder(this.buf, pos, end);
          }
          return readUtf8(this.buf, pos, end);
        },
        readBytes: function() {
          var end = this.readVarint() + this.pos, buffer = this.buf.subarray(this.pos, end);
          this.pos = end;
          return buffer;
        },
        readPackedVarint: function(arr2, isSigned) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readVarint(isSigned));
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readVarint(isSigned));
          return arr2;
        },
        readPackedSVarint: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readSVarint());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readSVarint());
          return arr2;
        },
        readPackedBoolean: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readBoolean());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readBoolean());
          return arr2;
        },
        readPackedFloat: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readFloat());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readFloat());
          return arr2;
        },
        readPackedDouble: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readDouble());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readDouble());
          return arr2;
        },
        readPackedFixed32: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readFixed32());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readFixed32());
          return arr2;
        },
        readPackedSFixed32: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readSFixed32());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readSFixed32());
          return arr2;
        },
        readPackedFixed64: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readFixed64());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readFixed64());
          return arr2;
        },
        readPackedSFixed64: function(arr2) {
          if (this.type !== Pbf.Bytes)
            return arr2.push(this.readSFixed64());
          var end = readPackedEnd(this);
          arr2 = arr2 || [];
          while (this.pos < end)
            arr2.push(this.readSFixed64());
          return arr2;
        },
        skip: function(val) {
          var type = val & 7;
          if (type === Pbf.Varint)
            while (this.buf[this.pos++] > 127) {
            }
          else if (type === Pbf.Bytes)
            this.pos = this.readVarint() + this.pos;
          else if (type === Pbf.Fixed32)
            this.pos += 4;
          else if (type === Pbf.Fixed64)
            this.pos += 8;
          else
            throw new Error("Unimplemented type: " + type);
        },
        writeTag: function(tag, type) {
          this.writeVarint(tag << 3 | type);
        },
        realloc: function(min) {
          var length = this.length || 16;
          while (length < this.pos + min)
            length *= 2;
          if (length !== this.length) {
            var buf = new Uint8Array(length);
            buf.set(this.buf);
            this.buf = buf;
            this.length = length;
          }
        },
        finish: function() {
          this.length = this.pos;
          this.pos = 0;
          return this.buf.subarray(0, this.length);
        },
        writeFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
        },
        writeSFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
        },
        writeFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
        },
        writeSFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
        },
        writeVarint: function(val) {
          val = +val || 0;
          if (val > 268435455 || val < 0) {
            writeBigVarint(val, this);
            return;
          }
          this.realloc(4);
          this.buf[this.pos++] = val & 127 | (val > 127 ? 128 : 0);
          if (val <= 127)
            return;
          this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
          if (val <= 127)
            return;
          this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
          if (val <= 127)
            return;
          this.buf[this.pos++] = val >>> 7 & 127;
        },
        writeSVarint: function(val) {
          this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
        },
        writeBoolean: function(val) {
          this.writeVarint(Boolean(val));
        },
        writeString: function(str) {
          str = String(str);
          this.realloc(str.length * 4);
          this.pos++;
          var startPos = this.pos;
          this.pos = writeUtf8(this.buf, str, this.pos);
          var len = this.pos - startPos;
          if (len >= 128)
            makeRoomForExtraLength(startPos, len, this);
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
        },
        writeFloat: function(val) {
          this.realloc(4);
          ieee754.write(this.buf, val, this.pos, true, 23, 4);
          this.pos += 4;
        },
        writeDouble: function(val) {
          this.realloc(8);
          ieee754.write(this.buf, val, this.pos, true, 52, 8);
          this.pos += 8;
        },
        writeBytes: function(buffer) {
          var len = buffer.length;
          this.writeVarint(len);
          this.realloc(len);
          for (var i = 0; i < len; i++)
            this.buf[this.pos++] = buffer[i];
        },
        writeRawMessage: function(fn, obj) {
          this.pos++;
          var startPos = this.pos;
          fn(obj, this);
          var len = this.pos - startPos;
          if (len >= 128)
            makeRoomForExtraLength(startPos, len, this);
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
        },
        writeMessage: function(tag, fn, obj) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeRawMessage(fn, obj);
        },
        writePackedVarint: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedVarint, arr2);
        },
        writePackedSVarint: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedSVarint, arr2);
        },
        writePackedBoolean: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedBoolean, arr2);
        },
        writePackedFloat: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedFloat, arr2);
        },
        writePackedDouble: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedDouble, arr2);
        },
        writePackedFixed32: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedFixed32, arr2);
        },
        writePackedSFixed32: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedSFixed32, arr2);
        },
        writePackedFixed64: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedFixed64, arr2);
        },
        writePackedSFixed64: function(tag, arr2) {
          if (arr2.length)
            this.writeMessage(tag, writePackedSFixed64, arr2);
        },
        writeBytesField: function(tag, buffer) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeBytes(buffer);
        },
        writeFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFixed32(val);
        },
        writeSFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeSFixed32(val);
        },
        writeFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeFixed64(val);
        },
        writeSFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeSFixed64(val);
        },
        writeVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeVarint(val);
        },
        writeSVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeSVarint(val);
        },
        writeStringField: function(tag, str) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeString(str);
        },
        writeFloatField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFloat(val);
        },
        writeDoubleField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeDouble(val);
        },
        writeBooleanField: function(tag, val) {
          this.writeVarintField(tag, Boolean(val));
        }
      };
      function readVarintRemainder(l, s, p) {
        var buf = p.buf, h, b;
        b = buf[p.pos++];
        h = (b & 112) >> 4;
        if (b < 128)
          return toNum(l, h, s);
        b = buf[p.pos++];
        h |= (b & 127) << 3;
        if (b < 128)
          return toNum(l, h, s);
        b = buf[p.pos++];
        h |= (b & 127) << 10;
        if (b < 128)
          return toNum(l, h, s);
        b = buf[p.pos++];
        h |= (b & 127) << 17;
        if (b < 128)
          return toNum(l, h, s);
        b = buf[p.pos++];
        h |= (b & 127) << 24;
        if (b < 128)
          return toNum(l, h, s);
        b = buf[p.pos++];
        h |= (b & 1) << 31;
        if (b < 128)
          return toNum(l, h, s);
        throw new Error("Expected varint not more than 10 bytes");
      }
      function readPackedEnd(pbf) {
        return pbf.type === Pbf.Bytes ? pbf.readVarint() + pbf.pos : pbf.pos + 1;
      }
      function toNum(low, high, isSigned) {
        if (isSigned) {
          return high * 4294967296 + (low >>> 0);
        }
        return (high >>> 0) * 4294967296 + (low >>> 0);
      }
      function writeBigVarint(val, pbf) {
        var low, high;
        if (val >= 0) {
          low = val % 4294967296 | 0;
          high = val / 4294967296 | 0;
        } else {
          low = ~(-val % 4294967296);
          high = ~(-val / 4294967296);
          if (low ^ 4294967295) {
            low = low + 1 | 0;
          } else {
            low = 0;
            high = high + 1 | 0;
          }
        }
        if (val >= 18446744073709552e3 || val < -18446744073709552e3) {
          throw new Error("Given varint doesn't fit into 10 bytes");
        }
        pbf.realloc(10);
        writeBigVarintLow(low, high, pbf);
        writeBigVarintHigh(high, pbf);
      }
      function writeBigVarintLow(low, high, pbf) {
        pbf.buf[pbf.pos++] = low & 127 | 128;
        low >>>= 7;
        pbf.buf[pbf.pos++] = low & 127 | 128;
        low >>>= 7;
        pbf.buf[pbf.pos++] = low & 127 | 128;
        low >>>= 7;
        pbf.buf[pbf.pos++] = low & 127 | 128;
        low >>>= 7;
        pbf.buf[pbf.pos] = low & 127;
      }
      function writeBigVarintHigh(high, pbf) {
        var lsb = (high & 7) << 4;
        pbf.buf[pbf.pos++] |= lsb | ((high >>>= 3) ? 128 : 0);
        if (!high)
          return;
        pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
        if (!high)
          return;
        pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
        if (!high)
          return;
        pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
        if (!high)
          return;
        pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
        if (!high)
          return;
        pbf.buf[pbf.pos++] = high & 127;
      }
      function makeRoomForExtraLength(startPos, len, pbf) {
        var extraLen = len <= 16383 ? 1 : len <= 2097151 ? 2 : len <= 268435455 ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));
        pbf.realloc(extraLen);
        for (var i = pbf.pos - 1; i >= startPos; i--)
          pbf.buf[i + extraLen] = pbf.buf[i];
      }
      function writePackedVarint(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeVarint(arr2[i]);
      }
      function writePackedSVarint(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeSVarint(arr2[i]);
      }
      function writePackedFloat(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeFloat(arr2[i]);
      }
      function writePackedDouble(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeDouble(arr2[i]);
      }
      function writePackedBoolean(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeBoolean(arr2[i]);
      }
      function writePackedFixed32(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeFixed32(arr2[i]);
      }
      function writePackedSFixed32(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeSFixed32(arr2[i]);
      }
      function writePackedFixed64(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeFixed64(arr2[i]);
      }
      function writePackedSFixed64(arr2, pbf) {
        for (var i = 0; i < arr2.length; i++)
          pbf.writeSFixed64(arr2[i]);
      }
      function readUInt32(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + buf[pos + 3] * 16777216;
      }
      function writeInt32(buf, val, pos) {
        buf[pos] = val;
        buf[pos + 1] = val >>> 8;
        buf[pos + 2] = val >>> 16;
        buf[pos + 3] = val >>> 24;
      }
      function readInt32(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + (buf[pos + 3] << 24);
      }
      function readUtf8(buf, pos, end) {
        var str = "";
        var i = pos;
        while (i < end) {
          var b0 = buf[i];
          var c = null;
          var bytesPerSequence = b0 > 239 ? 4 : b0 > 223 ? 3 : b0 > 191 ? 2 : 1;
          if (i + bytesPerSequence > end)
            break;
          var b1, b2, b3;
          if (bytesPerSequence === 1) {
            if (b0 < 128) {
              c = b0;
            }
          } else if (bytesPerSequence === 2) {
            b1 = buf[i + 1];
            if ((b1 & 192) === 128) {
              c = (b0 & 31) << 6 | b1 & 63;
              if (c <= 127) {
                c = null;
              }
            }
          } else if (bytesPerSequence === 3) {
            b1 = buf[i + 1];
            b2 = buf[i + 2];
            if ((b1 & 192) === 128 && (b2 & 192) === 128) {
              c = (b0 & 15) << 12 | (b1 & 63) << 6 | b2 & 63;
              if (c <= 2047 || c >= 55296 && c <= 57343) {
                c = null;
              }
            }
          } else if (bytesPerSequence === 4) {
            b1 = buf[i + 1];
            b2 = buf[i + 2];
            b3 = buf[i + 3];
            if ((b1 & 192) === 128 && (b2 & 192) === 128 && (b3 & 192) === 128) {
              c = (b0 & 15) << 18 | (b1 & 63) << 12 | (b2 & 63) << 6 | b3 & 63;
              if (c <= 65535 || c >= 1114112) {
                c = null;
              }
            }
          }
          if (c === null) {
            c = 65533;
            bytesPerSequence = 1;
          } else if (c > 65535) {
            c -= 65536;
            str += String.fromCharCode(c >>> 10 & 1023 | 55296);
            c = 56320 | c & 1023;
          }
          str += String.fromCharCode(c);
          i += bytesPerSequence;
        }
        return str;
      }
      function readUtf8TextDecoder(buf, pos, end) {
        return utf8TextDecoder.decode(buf.subarray(pos, end));
      }
      function writeUtf8(buf, str, pos) {
        for (var i = 0, c, lead; i < str.length; i++) {
          c = str.charCodeAt(i);
          if (c > 55295 && c < 57344) {
            if (lead) {
              if (c < 56320) {
                buf[pos++] = 239;
                buf[pos++] = 191;
                buf[pos++] = 189;
                lead = c;
                continue;
              } else {
                c = lead - 55296 << 10 | c - 56320 | 65536;
                lead = null;
              }
            } else {
              if (c > 56319 || i + 1 === str.length) {
                buf[pos++] = 239;
                buf[pos++] = 191;
                buf[pos++] = 189;
              } else {
                lead = c;
              }
              continue;
            }
          } else if (lead) {
            buf[pos++] = 239;
            buf[pos++] = 191;
            buf[pos++] = 189;
            lead = null;
          }
          if (c < 128) {
            buf[pos++] = c;
          } else {
            if (c < 2048) {
              buf[pos++] = c >> 6 | 192;
            } else {
              if (c < 65536) {
                buf[pos++] = c >> 12 | 224;
              } else {
                buf[pos++] = c >> 18 | 240;
                buf[pos++] = c >> 12 & 63 | 128;
              }
              buf[pos++] = c >> 6 & 63 | 128;
            }
            buf[pos++] = c & 63 | 128;
          }
        }
        return pos;
      }
    }
  });

  // node_modules/rbush/rbush.min.js
  var require_rbush_min = __commonJS({
    "node_modules/rbush/rbush.min.js"(exports, module) {
      !function(t, i) {
        typeof exports == "object" && typeof module != "undefined" ? module.exports = i() : typeof define == "function" && define.amd ? define(i) : (t = t || self).RBush = i();
      }(exports, function() {
        "use strict";
        function t(t2, r2, e2, a2, h2) {
          !function t3(n2, r3, e3, a3, h3) {
            for (; a3 > e3; ) {
              if (a3 - e3 > 600) {
                var o2 = a3 - e3 + 1, s2 = r3 - e3 + 1, l2 = Math.log(o2), f2 = 0.5 * Math.exp(2 * l2 / 3), u2 = 0.5 * Math.sqrt(l2 * f2 * (o2 - f2) / o2) * (s2 - o2 / 2 < 0 ? -1 : 1), m2 = Math.max(e3, Math.floor(r3 - s2 * f2 / o2 + u2)), c2 = Math.min(a3, Math.floor(r3 + (o2 - s2) * f2 / o2 + u2));
                t3(n2, r3, m2, c2, h3);
              }
              var p2 = n2[r3], d2 = e3, x = a3;
              for (i(n2, e3, r3), h3(n2[a3], p2) > 0 && i(n2, e3, a3); d2 < x; ) {
                for (i(n2, d2, x), d2++, x--; h3(n2[d2], p2) < 0; )
                  d2++;
                for (; h3(n2[x], p2) > 0; )
                  x--;
              }
              h3(n2[e3], p2) === 0 ? i(n2, e3, x) : i(n2, ++x, a3), x <= r3 && (e3 = x + 1), r3 <= x && (a3 = x - 1);
            }
          }(t2, r2, e2 || 0, a2 || t2.length - 1, h2 || n);
        }
        function i(t2, i2, n2) {
          var r2 = t2[i2];
          t2[i2] = t2[n2], t2[n2] = r2;
        }
        function n(t2, i2) {
          return t2 < i2 ? -1 : t2 > i2 ? 1 : 0;
        }
        var r = function(t2) {
          t2 === void 0 && (t2 = 9), this._maxEntries = Math.max(4, t2), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
        };
        function e(t2, i2, n2) {
          if (!n2)
            return i2.indexOf(t2);
          for (var r2 = 0; r2 < i2.length; r2++)
            if (n2(t2, i2[r2]))
              return r2;
          return -1;
        }
        function a(t2, i2) {
          h(t2, 0, t2.children.length, i2, t2);
        }
        function h(t2, i2, n2, r2, e2) {
          e2 || (e2 = p(null)), e2.minX = 1 / 0, e2.minY = 1 / 0, e2.maxX = -1 / 0, e2.maxY = -1 / 0;
          for (var a2 = i2; a2 < n2; a2++) {
            var h2 = t2.children[a2];
            o(e2, t2.leaf ? r2(h2) : h2);
          }
          return e2;
        }
        function o(t2, i2) {
          return t2.minX = Math.min(t2.minX, i2.minX), t2.minY = Math.min(t2.minY, i2.minY), t2.maxX = Math.max(t2.maxX, i2.maxX), t2.maxY = Math.max(t2.maxY, i2.maxY), t2;
        }
        function s(t2, i2) {
          return t2.minX - i2.minX;
        }
        function l(t2, i2) {
          return t2.minY - i2.minY;
        }
        function f(t2) {
          return (t2.maxX - t2.minX) * (t2.maxY - t2.minY);
        }
        function u(t2) {
          return t2.maxX - t2.minX + (t2.maxY - t2.minY);
        }
        function m(t2, i2) {
          return t2.minX <= i2.minX && t2.minY <= i2.minY && i2.maxX <= t2.maxX && i2.maxY <= t2.maxY;
        }
        function c(t2, i2) {
          return i2.minX <= t2.maxX && i2.minY <= t2.maxY && i2.maxX >= t2.minX && i2.maxY >= t2.minY;
        }
        function p(t2) {
          return { children: t2, height: 1, leaf: true, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
        }
        function d(i2, n2, r2, e2, a2) {
          for (var h2 = [n2, r2]; h2.length; )
            if (!((r2 = h2.pop()) - (n2 = h2.pop()) <= e2)) {
              var o2 = n2 + Math.ceil((r2 - n2) / e2 / 2) * e2;
              t(i2, o2, n2, r2, a2), h2.push(n2, o2, o2, r2);
            }
        }
        return r.prototype.all = function() {
          return this._all(this.data, []);
        }, r.prototype.search = function(t2) {
          var i2 = this.data, n2 = [];
          if (!c(t2, i2))
            return n2;
          for (var r2 = this.toBBox, e2 = []; i2; ) {
            for (var a2 = 0; a2 < i2.children.length; a2++) {
              var h2 = i2.children[a2], o2 = i2.leaf ? r2(h2) : h2;
              c(t2, o2) && (i2.leaf ? n2.push(h2) : m(t2, o2) ? this._all(h2, n2) : e2.push(h2));
            }
            i2 = e2.pop();
          }
          return n2;
        }, r.prototype.collides = function(t2) {
          var i2 = this.data;
          if (!c(t2, i2))
            return false;
          for (var n2 = []; i2; ) {
            for (var r2 = 0; r2 < i2.children.length; r2++) {
              var e2 = i2.children[r2], a2 = i2.leaf ? this.toBBox(e2) : e2;
              if (c(t2, a2)) {
                if (i2.leaf || m(t2, a2))
                  return true;
                n2.push(e2);
              }
            }
            i2 = n2.pop();
          }
          return false;
        }, r.prototype.load = function(t2) {
          if (!t2 || !t2.length)
            return this;
          if (t2.length < this._minEntries) {
            for (var i2 = 0; i2 < t2.length; i2++)
              this.insert(t2[i2]);
            return this;
          }
          var n2 = this._build(t2.slice(), 0, t2.length - 1, 0);
          if (this.data.children.length)
            if (this.data.height === n2.height)
              this._splitRoot(this.data, n2);
            else {
              if (this.data.height < n2.height) {
                var r2 = this.data;
                this.data = n2, n2 = r2;
              }
              this._insert(n2, this.data.height - n2.height - 1, true);
            }
          else
            this.data = n2;
          return this;
        }, r.prototype.insert = function(t2) {
          return t2 && this._insert(t2, this.data.height - 1), this;
        }, r.prototype.clear = function() {
          return this.data = p([]), this;
        }, r.prototype.remove = function(t2, i2) {
          if (!t2)
            return this;
          for (var n2, r2, a2, h2 = this.data, o2 = this.toBBox(t2), s2 = [], l2 = []; h2 || s2.length; ) {
            if (h2 || (h2 = s2.pop(), r2 = s2[s2.length - 1], n2 = l2.pop(), a2 = true), h2.leaf) {
              var f2 = e(t2, h2.children, i2);
              if (f2 !== -1)
                return h2.children.splice(f2, 1), s2.push(h2), this._condense(s2), this;
            }
            a2 || h2.leaf || !m(h2, o2) ? r2 ? (n2++, h2 = r2.children[n2], a2 = false) : h2 = null : (s2.push(h2), l2.push(n2), n2 = 0, r2 = h2, h2 = h2.children[0]);
          }
          return this;
        }, r.prototype.toBBox = function(t2) {
          return t2;
        }, r.prototype.compareMinX = function(t2, i2) {
          return t2.minX - i2.minX;
        }, r.prototype.compareMinY = function(t2, i2) {
          return t2.minY - i2.minY;
        }, r.prototype.toJSON = function() {
          return this.data;
        }, r.prototype.fromJSON = function(t2) {
          return this.data = t2, this;
        }, r.prototype._all = function(t2, i2) {
          for (var n2 = []; t2; )
            t2.leaf ? i2.push.apply(i2, t2.children) : n2.push.apply(n2, t2.children), t2 = n2.pop();
          return i2;
        }, r.prototype._build = function(t2, i2, n2, r2) {
          var e2, h2 = n2 - i2 + 1, o2 = this._maxEntries;
          if (h2 <= o2)
            return a(e2 = p(t2.slice(i2, n2 + 1)), this.toBBox), e2;
          r2 || (r2 = Math.ceil(Math.log(h2) / Math.log(o2)), o2 = Math.ceil(h2 / Math.pow(o2, r2 - 1))), (e2 = p([])).leaf = false, e2.height = r2;
          var s2 = Math.ceil(h2 / o2), l2 = s2 * Math.ceil(Math.sqrt(o2));
          d(t2, i2, n2, l2, this.compareMinX);
          for (var f2 = i2; f2 <= n2; f2 += l2) {
            var u2 = Math.min(f2 + l2 - 1, n2);
            d(t2, f2, u2, s2, this.compareMinY);
            for (var m2 = f2; m2 <= u2; m2 += s2) {
              var c2 = Math.min(m2 + s2 - 1, u2);
              e2.children.push(this._build(t2, m2, c2, r2 - 1));
            }
          }
          return a(e2, this.toBBox), e2;
        }, r.prototype._chooseSubtree = function(t2, i2, n2, r2) {
          for (; r2.push(i2), !i2.leaf && r2.length - 1 !== n2; ) {
            for (var e2 = 1 / 0, a2 = 1 / 0, h2 = void 0, o2 = 0; o2 < i2.children.length; o2++) {
              var s2 = i2.children[o2], l2 = f(s2), u2 = (m2 = t2, c2 = s2, (Math.max(c2.maxX, m2.maxX) - Math.min(c2.minX, m2.minX)) * (Math.max(c2.maxY, m2.maxY) - Math.min(c2.minY, m2.minY)) - l2);
              u2 < a2 ? (a2 = u2, e2 = l2 < e2 ? l2 : e2, h2 = s2) : u2 === a2 && l2 < e2 && (e2 = l2, h2 = s2);
            }
            i2 = h2 || i2.children[0];
          }
          var m2, c2;
          return i2;
        }, r.prototype._insert = function(t2, i2, n2) {
          var r2 = n2 ? t2 : this.toBBox(t2), e2 = [], a2 = this._chooseSubtree(r2, this.data, i2, e2);
          for (a2.children.push(t2), o(a2, r2); i2 >= 0 && e2[i2].children.length > this._maxEntries; )
            this._split(e2, i2), i2--;
          this._adjustParentBBoxes(r2, e2, i2);
        }, r.prototype._split = function(t2, i2) {
          var n2 = t2[i2], r2 = n2.children.length, e2 = this._minEntries;
          this._chooseSplitAxis(n2, e2, r2);
          var h2 = this._chooseSplitIndex(n2, e2, r2), o2 = p(n2.children.splice(h2, n2.children.length - h2));
          o2.height = n2.height, o2.leaf = n2.leaf, a(n2, this.toBBox), a(o2, this.toBBox), i2 ? t2[i2 - 1].children.push(o2) : this._splitRoot(n2, o2);
        }, r.prototype._splitRoot = function(t2, i2) {
          this.data = p([t2, i2]), this.data.height = t2.height + 1, this.data.leaf = false, a(this.data, this.toBBox);
        }, r.prototype._chooseSplitIndex = function(t2, i2, n2) {
          for (var r2, e2, a2, o2, s2, l2, u2, m2 = 1 / 0, c2 = 1 / 0, p2 = i2; p2 <= n2 - i2; p2++) {
            var d2 = h(t2, 0, p2, this.toBBox), x = h(t2, p2, n2, this.toBBox), v = (e2 = d2, a2 = x, o2 = void 0, s2 = void 0, l2 = void 0, u2 = void 0, o2 = Math.max(e2.minX, a2.minX), s2 = Math.max(e2.minY, a2.minY), l2 = Math.min(e2.maxX, a2.maxX), u2 = Math.min(e2.maxY, a2.maxY), Math.max(0, l2 - o2) * Math.max(0, u2 - s2)), M = f(d2) + f(x);
            v < m2 ? (m2 = v, r2 = p2, c2 = M < c2 ? M : c2) : v === m2 && M < c2 && (c2 = M, r2 = p2);
          }
          return r2 || n2 - i2;
        }, r.prototype._chooseSplitAxis = function(t2, i2, n2) {
          var r2 = t2.leaf ? this.compareMinX : s, e2 = t2.leaf ? this.compareMinY : l;
          this._allDistMargin(t2, i2, n2, r2) < this._allDistMargin(t2, i2, n2, e2) && t2.children.sort(r2);
        }, r.prototype._allDistMargin = function(t2, i2, n2, r2) {
          t2.children.sort(r2);
          for (var e2 = this.toBBox, a2 = h(t2, 0, i2, e2), s2 = h(t2, n2 - i2, n2, e2), l2 = u(a2) + u(s2), f2 = i2; f2 < n2 - i2; f2++) {
            var m2 = t2.children[f2];
            o(a2, t2.leaf ? e2(m2) : m2), l2 += u(a2);
          }
          for (var c2 = n2 - i2 - 1; c2 >= i2; c2--) {
            var p2 = t2.children[c2];
            o(s2, t2.leaf ? e2(p2) : p2), l2 += u(s2);
          }
          return l2;
        }, r.prototype._adjustParentBBoxes = function(t2, i2, n2) {
          for (var r2 = n2; r2 >= 0; r2--)
            o(i2[r2], t2);
        }, r.prototype._condense = function(t2) {
          for (var i2 = t2.length - 1, n2 = void 0; i2 >= 0; i2--)
            t2[i2].children.length === 0 ? i2 > 0 ? (n2 = t2[i2 - 1].children).splice(n2.indexOf(t2[i2]), 1) : this.clear() : a(t2[i2], this.toBBox);
        }, r;
      });
    }
  });

  // node_modules/tinyqueue/tinyqueue.js
  var require_tinyqueue = __commonJS({
    "node_modules/tinyqueue/tinyqueue.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.TinyQueue = factory());
      })(exports, function() {
        "use strict";
        var TinyQueue = function TinyQueue2(data, compare) {
          if (data === void 0)
            data = [];
          if (compare === void 0)
            compare = defaultCompare;
          this.data = data;
          this.length = this.data.length;
          this.compare = compare;
          if (this.length > 0) {
            for (var i = (this.length >> 1) - 1; i >= 0; i--) {
              this._down(i);
            }
          }
        };
        TinyQueue.prototype.push = function push(item) {
          this.data.push(item);
          this.length++;
          this._up(this.length - 1);
        };
        TinyQueue.prototype.pop = function pop() {
          if (this.length === 0) {
            return void 0;
          }
          var top = this.data[0];
          var bottom = this.data.pop();
          this.length--;
          if (this.length > 0) {
            this.data[0] = bottom;
            this._down(0);
          }
          return top;
        };
        TinyQueue.prototype.peek = function peek() {
          return this.data[0];
        };
        TinyQueue.prototype._up = function _up(pos) {
          var ref = this;
          var data = ref.data;
          var compare = ref.compare;
          var item = data[pos];
          while (pos > 0) {
            var parent = pos - 1 >> 1;
            var current = data[parent];
            if (compare(item, current) >= 0) {
              break;
            }
            data[pos] = current;
            pos = parent;
          }
          data[pos] = item;
        };
        TinyQueue.prototype._down = function _down(pos) {
          var ref = this;
          var data = ref.data;
          var compare = ref.compare;
          var halfLength = this.length >> 1;
          var item = data[pos];
          while (pos < halfLength) {
            var left = (pos << 1) + 1;
            var best = data[left];
            var right = left + 1;
            if (right < this.length && compare(data[right], best) < 0) {
              left = right;
              best = data[right];
            }
            if (compare(best, item) >= 0) {
              break;
            }
            data[pos] = best;
            pos = left;
          }
          data[pos] = item;
        };
        function defaultCompare(a, b) {
          return a < b ? -1 : a > b ? 1 : 0;
        }
        return TinyQueue;
      });
    }
  });

  // node_modules/polylabel/polylabel.js
  var require_polylabel = __commonJS({
    "node_modules/polylabel/polylabel.js"(exports, module) {
      "use strict";
      var Queue = require_tinyqueue();
      if (Queue.default)
        Queue = Queue.default;
      module.exports = polylabel2;
      module.exports.default = polylabel2;
      function polylabel2(polygon, precision, debug) {
        precision = precision || 1;
        var minX, minY, maxX, maxY;
        for (var i = 0; i < polygon[0].length; i++) {
          var p = polygon[0][i];
          if (!i || p[0] < minX)
            minX = p[0];
          if (!i || p[1] < minY)
            minY = p[1];
          if (!i || p[0] > maxX)
            maxX = p[0];
          if (!i || p[1] > maxY)
            maxY = p[1];
        }
        var width = maxX - minX;
        var height = maxY - minY;
        var cellSize = Math.min(width, height);
        var h = cellSize / 2;
        if (cellSize === 0) {
          var degeneratePoleOfInaccessibility = [minX, minY];
          degeneratePoleOfInaccessibility.distance = 0;
          return degeneratePoleOfInaccessibility;
        }
        var cellQueue = new Queue(void 0, compareMax);
        for (var x = minX; x < maxX; x += cellSize) {
          for (var y = minY; y < maxY; y += cellSize) {
            cellQueue.push(new Cell(x + h, y + h, h, polygon));
          }
        }
        var bestCell = getCentroidCell(polygon);
        var bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
        if (bboxCell.d > bestCell.d)
          bestCell = bboxCell;
        var numProbes = cellQueue.length;
        while (cellQueue.length) {
          var cell = cellQueue.pop();
          if (cell.d > bestCell.d) {
            bestCell = cell;
            if (debug)
              console.log("found best %d after %d probes", Math.round(1e4 * cell.d) / 1e4, numProbes);
          }
          if (cell.max - bestCell.d <= precision)
            continue;
          h = cell.h / 2;
          cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
          cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
          cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
          cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
          numProbes += 4;
        }
        if (debug) {
          console.log("num probes: " + numProbes);
          console.log("best distance: " + bestCell.d);
        }
        var poleOfInaccessibility = [bestCell.x, bestCell.y];
        poleOfInaccessibility.distance = bestCell.d;
        return poleOfInaccessibility;
      }
      function compareMax(a, b) {
        return b.max - a.max;
      }
      function Cell(x, y, h, polygon) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.d = pointToPolygonDist(x, y, polygon);
        this.max = this.d + this.h * Math.SQRT2;
      }
      function pointToPolygonDist(x, y, polygon) {
        var inside = false;
        var minDistSq = Infinity;
        for (var k = 0; k < polygon.length; k++) {
          var ring = polygon[k];
          for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
            var a = ring[i];
            var b = ring[j];
            if (a[1] > y !== b[1] > y && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])
              inside = !inside;
            minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
          }
        }
        return minDistSq === 0 ? 0 : (inside ? 1 : -1) * Math.sqrt(minDistSq);
      }
      function getCentroidCell(polygon) {
        var area = 0;
        var x = 0;
        var y = 0;
        var points = polygon[0];
        for (var i = 0, len = points.length, j = len - 1; i < len; j = i++) {
          var a = points[i];
          var b = points[j];
          var f = a[0] * b[1] - b[0] * a[1];
          x += (a[0] + b[0]) * f;
          y += (a[1] + b[1]) * f;
          area += f * 3;
        }
        if (area === 0)
          return new Cell(points[0][0], points[0][1], 0, polygon);
        return new Cell(x / area, y / area, 0, polygon);
      }
      function getSegDistSq(px, py, a, b) {
        var x = a[0];
        var y = a[1];
        var dx = b[0] - x;
        var dy = b[1] - y;
        if (dx !== 0 || dy !== 0) {
          var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
          if (t > 1) {
            x = b[0];
            y = b[1];
          } else if (t > 0) {
            x += dx * t;
            y += dy * t;
          }
        }
        dx = px - x;
        dy = py - y;
        return dx * dx + dy * dy;
      }
    }
  });

  // node_modules/linelabel/xy.js
  var require_xy = __commonJS({
    "node_modules/linelabel/xy.js"(exports, module) {
      module.exports = function(pts, max_angle_delta) {
        var chunks = [];
        var cur_angles = [null];
        var a, b, c, i = 0, n = 0, d = 0;
        var abmag = 0, bcmag = 0;
        var abx = 0, aby = 0;
        var bcx = 0, bcy = 0;
        var dt = 0;
        var i_start = 0;
        var d_start = 0;
        if (pts.length < 2)
          return [];
        if (pts.length === 2) {
          d = Math.sqrt(Math.pow(pts[1].x - pts[0].x, 2) + Math.pow(pts[1].y - pts[0].y, 2));
          return [{
            length: d,
            beginIndex: 0,
            beginDistance: 0,
            endIndex: 2,
            endDistance: d,
            angles: [null, null]
          }];
        }
        abmag = Math.sqrt(Math.pow(pts[1].x - pts[0].x, 2) + Math.pow(pts[1].y - pts[0].y, 2));
        for (i = 1, n = pts.length - 1; i < n; i++) {
          a = pts[i - 1];
          b = pts[i];
          c = pts[i + 1];
          abx = b.x - a.x;
          aby = b.y - a.y;
          bcx = c.x - b.x;
          bcy = c.y - b.y;
          bcmag = Math.sqrt(bcx * bcx + bcy * bcy);
          d += abmag;
          dt = Math.acos((abx * bcx + aby * bcy) / (abmag * bcmag));
          cur_angles.push(dt);
          if (dt > max_angle_delta) {
            chunks.push({
              length: d - d_start,
              beginDistance: d_start,
              beginIndex: i_start,
              endIndex: i + 1,
              endDistance: d,
              angles: cur_angles
            });
            i_start = i;
            d_start = d;
            cur_angles = [dt];
          }
          abmag = bcmag;
        }
        cur_angles.push(null);
        if (i - i_start > 0) {
          chunks.push({
            length: d - d_start + bcmag,
            beginIndex: i_start,
            beginDistance: d_start,
            endIndex: i + 1,
            endDistance: d + bcmag,
            angles: cur_angles
          });
        }
        return chunks;
      };
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    CenteredTextSymbolizer: () => CenteredTextSymbolizer,
    CircleSymbolizer: () => CircleSymbolizer,
    Font: () => Font,
    GroupSymbolizer: () => GroupSymbolizer,
    IconSymbolizer: () => IconSymbolizer,
    LeafletLayer: () => LeafletLayer,
    LineLabelSymbolizer: () => LineLabelSymbolizer,
    LineSymbolizer: () => LineSymbolizer,
    OffsetTextSymbolizer: () => OffsetTextSymbolizer,
    PMTiles: () => PMTiles,
    PolygonLabelSymbolizer: () => PolygonLabelSymbolizer,
    PolygonSymbolizer: () => PolygonSymbolizer,
    Sprites: () => Sprites,
    Static: () => Static,
    arr: () => arr,
    createPattern: () => createPattern,
    exp: () => exp,
    json_style: () => json_style,
    leafletLayer: () => leafletLayer
  });

  // src/frontends/static.ts
  var import_point_geometry5 = __toModule(require_point_geometry());

  // src/tilecache.ts
  var import_point_geometry = __toModule(require_point_geometry());
  var import_vector_tile = __toModule(require_vector_tile());
  var import_pbf = __toModule(require_pbf());

  // node_modules/pmtiles/index.mjs
  var shift = (number, shift2) => {
    return number * Math.pow(2, shift2);
  };
  var getUint24 = (dataview, pos) => {
    return shift(dataview.getUint16(pos + 1, true), 8) + dataview.getUint8(pos, true);
  };
  var getUint48 = (dataview, pos) => {
    return shift(dataview.getUint32(pos + 2, true), 16) + dataview.getUint16(pos, true);
  };
  var parseHeader = (dataview) => {
    var magic = dataview.getUint16(0, true);
    var version = dataview.getUint16(2, true);
    var json_size = dataview.getUint32(4, true);
    var root_entries = dataview.getUint16(8, true);
    return { version, json_size, root_entries };
  };
  var bytesToMap = (dataview) => {
    let m = new Map();
    for (var i = 0; i < dataview.byteLength; i += 17) {
      var z_raw = dataview.getUint8(i, true);
      var z = z_raw & 127;
      var is_dir = z_raw >> 7;
      var x = getUint24(dataview, i + 1);
      var y = getUint24(dataview, i + 4);
      var offset = getUint48(dataview, i + 7);
      var length = dataview.getUint32(i + 13, true);
      m.set(z + "_" + x + "_" + y, [offset, length, is_dir]);
    }
    return m;
  };
  var PMTiles = class {
    constructor(url) {
      __publicField(this, "metadata", (func) => {
        return new Promise((resolve, reject) => {
          this.root.then((root) => {
            resolve(root.metadata);
          });
        });
      });
      __publicField(this, "getLeaf", (offset, len) => {
        return new Promise((resolve, reject) => {
          if (this.leaves.has(offset)) {
            this.leaves.get(offset)[0]++;
            resolve(this.leaves.get(offset)[1]);
          } else if (this.outstanding_requests.has(offset)) {
            this.outstanding_requests.get(offset).push(resolve);
          } else {
            this.outstanding_requests.set(offset, []);
            fetch(this.url, { headers: { Range: "bytes=" + offset + "-" + (offset + len - 1) } }).then((resp) => {
              return resp.arrayBuffer();
            }).then((buf) => {
              var map = bytesToMap(new DataView(buf), len / 17);
              if (this.leaves.size > 32) {
                var minStep = Infinity;
                var minKey = void 0;
                this.leaves.forEach((val, key) => {
                  if (val[0] < minStep) {
                    minStep = val[0];
                    minKey = key;
                  }
                });
                this.leaves.delete(minKey);
              }
              this.leaves.set(offset, [this.step++, map]);
              resolve(map);
              this.outstanding_requests.get(offset).forEach((f) => f(map));
              this.outstanding_requests.delete(offset);
            });
          }
        });
      });
      __publicField(this, "getZxy", (z, x, y) => {
        var strid = z + "_" + x + "_" + y;
        return this.root.then((root) => {
          if (root.dir.has(strid) && root.dir.get(strid)[2] == 0) {
            return root.dir.get(strid);
          } else {
            if (z >= 7) {
              var z7_tile_diff = z - 7;
              var z7_tile = [7, Math.trunc(x / (1 << z7_tile_diff)), Math.trunc(y / (1 << z7_tile_diff))];
              var z7_tile_str = z7_tile[0] + "_" + z7_tile[1] + "_" + z7_tile[2];
              if (root.dir.has(z7_tile_str) && root.dir.get(z7_tile_str)[2] == 1) {
                const val = root.dir.get(z7_tile_str);
                return this.getLeaf(val[0], val[1]).then((leafdir) => {
                  if (leafdir.has(strid)) {
                    return leafdir.get(strid);
                  }
                  return null;
                });
              }
            }
          }
          return null;
        });
      });
      __publicField(this, "transformRequest", (u, t, tile, done) => {
        if (u.endsWith(".pmtiles") && done) {
          var tid = tile.tileID.canonical;
          var strid = tid.z + "_" + tid.x + "_" + tid.y;
          this.getZxy(tid.z, tid.x, tid.y).then((val) => {
            if (val) {
              done({ url: this.url, headers: { "Range": "bytes=" + val[0] + "-" + (val[0] + val[1] - 1) } });
            }
          });
        }
        return { url: u };
      });
      __publicField(this, "leafletLayer", (options) => {
        const self2 = this;
        var cls = L.GridLayer.extend({
          createTile: function(coord, done) {
            var tile = document.createElement("img");
            var error;
            self2.getZxy(coord.z, coord.x, coord.y).then((result) => {
              if (result === null)
                return;
              fetch(self2.url, { headers: { Range: "bytes=" + result[0] + "-" + (result[0] + result[1] - 1) } }).then((resp) => {
                return resp.arrayBuffer();
              }).then((buf) => {
                var blob = new Blob([buf], { type: "image/png" });
                var imageUrl = window.URL.createObjectURL(blob);
                tile.src = imageUrl;
                done(error, tile);
              });
            });
            return tile;
          },
          _removeTile: function(key) {
            var tile = this._tiles[key];
            if (!tile) {
              return;
            }
            tile.el.width = 0;
            tile.el.height = 0;
            tile.el.deleted = true;
            L.DomUtil.remove(tile.el);
            delete this._tiles[key];
            this.fire("tileunload", {
              tile: tile.el,
              coords: this._keyToTileCoords(key)
            });
          }
        });
        return new cls(options);
      });
      this.url = url;
      const controller = new AbortController();
      const signal = controller.signal;
      this.root = fetch(this.url, { signal, headers: { Range: "bytes=0-511999" } }).then((resp) => {
        if (resp.headers.get("Content-Length") != 512e3) {
          console.error("Content-Length mismatch indicates byte serving not supported; aborting.");
          controller.abort();
        }
        return resp.arrayBuffer();
      }).then((buf) => {
        const header = parseHeader(new DataView(buf, 0, 10));
        var dec = new TextDecoder("utf-8");
        return {
          metadata: JSON.parse(dec.decode(new DataView(buf, 10, header.json_size))),
          dir: bytesToMap(new DataView(buf, 10 + header.json_size, 17 * header.root_entries))
        };
      });
      this.step = 0;
      this.leaves = new Map();
      this.outstanding_requests = new Map();
    }
  };

  // src/tilecache.ts
  var GeomType;
  (function(GeomType2) {
    GeomType2[GeomType2["Point"] = 1] = "Point";
    GeomType2[GeomType2["Line"] = 2] = "Line";
    GeomType2[GeomType2["Polygon"] = 3] = "Polygon";
  })(GeomType || (GeomType = {}));
  function toIndex(c) {
    return c.x + ":" + c.y + ":" + c.z;
  }
  var loadGeomAndBbox = (pbf, geometry, scale) => {
    pbf.pos = geometry;
    var end = pbf.readVarint() + pbf.pos, cmd = 1, length = 0, x = 0, y = 0, lines = [], line, x1 = Infinity, x2 = -Infinity, y1 = Infinity, y2 = -Infinity;
    while (pbf.pos < end) {
      if (length <= 0) {
        var cmdLen = pbf.readVarint();
        cmd = cmdLen & 7;
        length = cmdLen >> 3;
      }
      length--;
      if (cmd === 1 || cmd === 2) {
        x += pbf.readSVarint() * scale;
        y += pbf.readSVarint() * scale;
        if (x < x1)
          x1 = x;
        if (x > x2)
          x2 = x;
        if (y < y1)
          y1 = y;
        if (y > y2)
          y2 = y;
        if (cmd === 1) {
          if (line)
            lines.push(line);
          line = [];
        }
        line.push(new import_point_geometry.default(x, y));
      } else if (cmd === 7) {
        if (line)
          line.push(line[0].clone());
      } else
        throw new Error("unknown command " + cmd);
    }
    if (line)
      lines.push(line);
    return { geom: lines, bbox: [x1, y1, x2, y2] };
  };
  function parseTile(buffer, tileSize) {
    let v = new import_vector_tile.VectorTile(new import_pbf.default(buffer));
    let result = new Map();
    for (let [key, value] of Object.entries(v.layers)) {
      let features = [];
      let layer = value;
      for (let i = 0; i < layer.length; i++) {
        let feat = layer.feature(i);
        let result2 = loadGeomAndBbox(feat._pbf, feat._geometry, tileSize / layer.extent);
        let numVertices = 0;
        for (let part of result2.geom)
          numVertices += part.length;
        features.push({
          geomType: layer.feature(i).type,
          geom: result2.geom,
          numVertices,
          bbox: result2.bbox,
          properties: layer.feature(i).properties
        });
      }
      result.set(key, features);
    }
    return result;
  }
  var PmtilesSource = class {
    constructor(url) {
      if (url.url) {
        this.p = url;
      } else {
        this.p = new PMTiles(url);
      }
      this.controllers = [];
    }
    get(c, tileSize) {
      return __async(this, null, function* () {
        this.controllers = this.controllers.filter((cont) => {
          if (cont[0] != c.z) {
            cont[1].abort();
            return false;
          }
          return true;
        });
        let result = yield this.p.getZxy(c.z, c.x, c.y);
        if (!result)
          throw new Error(`Tile ${c.z} ${c.x} ${c.y} not found in archive`);
        const controller = new AbortController();
        this.controllers.push([c.z, controller]);
        const signal = controller.signal;
        return new Promise((resolve, reject) => {
          fetch(this.p.url, { headers: { Range: "bytes=" + result[0] + "-" + (result[0] + result[1] - 1) }, signal }).then((resp) => {
            return resp.arrayBuffer();
          }).then((buffer) => {
            let result2 = parseTile(buffer, tileSize);
            resolve(result2);
          }).catch((e) => {
            reject(e);
          });
        });
      });
    }
  };
  var ZxySource = class {
    constructor(url) {
      this.url = url;
      this.controllers = [];
    }
    get(c, tileSize) {
      return __async(this, null, function* () {
        this.controllers = this.controllers.filter((cont) => {
          if (cont[0] != c.z) {
            cont[1].abort();
            return false;
          }
          return true;
        });
        let url = this.url.replace("{z}", c.z.toString()).replace("{x}", c.x.toString()).replace("{y}", c.y.toString());
        const controller = new AbortController();
        this.controllers.push([c.z, controller]);
        const signal = controller.signal;
        return new Promise((resolve, reject) => {
          fetch(url, { signal }).then((resp) => {
            return resp.arrayBuffer();
          }).then((buffer) => {
            let result = parseTile(buffer, tileSize);
            resolve(result);
          }).catch((e) => {
            reject(e);
          });
        });
      });
    }
  };
  var R = 6378137;
  var MAX_LATITUDE = 85.0511287798;
  var MAXCOORD = R * Math.PI;
  var project = (latlng) => {
    let d = Math.PI / 180;
    let constrained_lat = Math.max(Math.min(MAX_LATITUDE, latlng[0]), -MAX_LATITUDE);
    let sin = Math.sin(constrained_lat * d);
    return new import_point_geometry.default(R * latlng[1] * d, R * Math.log((1 + sin) / (1 - sin)) / 2);
  };
  var TileCache = class {
    constructor(source, tileSize) {
      this.source = source;
      this.cache = new Map();
      this.inflight = new Map();
      this.tileSize = tileSize;
    }
    queryFeatures(lng, lat, zoom) {
      let projected = project([lat, lng]);
      let normalized = new import_point_geometry.default((projected.x + MAXCOORD) / (MAXCOORD * 2), 1 - (projected.y + MAXCOORD) / (MAXCOORD * 2));
      let on_zoom = normalized.mult(1 << zoom);
      let tile_x = Math.floor(on_zoom.x);
      let tile_y = Math.floor(on_zoom.y);
      const idx = toIndex({ z: zoom, x: tile_x, y: tile_y });
      let retval = [];
      if (this.cache.has(idx)) {
        const center_bbox_x = (on_zoom.x - tile_x) * this.tileSize;
        const center_bbox_y = (on_zoom.y - tile_y) * this.tileSize;
        let entry = this.cache.get(idx);
        let query_bbox = [center_bbox_x - 8, center_bbox_y - 8, center_bbox_x + 8, center_bbox_y + 8];
        for (let [layer_name, layer_arr] of entry.data.entries()) {
          for (let feature of layer_arr) {
            if (query_bbox[2] >= feature.bbox[0] && feature.bbox[2] >= query_bbox[0] && (query_bbox[3] >= feature.bbox[3] && feature.bbox[3] >= query_bbox[1])) {
              retval.push(feature);
            }
          }
        }
      }
      return retval;
    }
    get(c) {
      return __async(this, null, function* () {
        const idx = toIndex(c);
        return new Promise((resolve, reject) => {
          if (this.cache.has(idx)) {
            let entry = this.cache.get(idx);
            entry.used = performance.now();
            resolve(entry.data);
          } else if (this.inflight.has(idx)) {
            this.inflight.get(idx).push([resolve, reject]);
          } else {
            this.inflight.set(idx, []);
            this.source.get(c, this.tileSize).then((tile) => {
              this.cache.set(idx, { used: performance.now(), data: tile });
              this.inflight.get(idx).forEach((f) => f[0](tile));
              this.inflight.delete(idx);
              resolve(tile);
              if (this.cache.size >= 64) {
                let min_used = Infinity;
                let min_key = void 0;
                this.cache.forEach((value, key) => {
                  if (value.used < min_used)
                    min_key = key;
                });
                this.cache.delete(min_key);
              }
            }).catch((e) => {
              this.inflight.get(idx).forEach((f) => f[1](e));
              this.inflight.delete(idx);
              reject(e);
            });
          }
        });
      });
    }
  };

  // src/view.ts
  var import_point_geometry2 = __toModule(require_point_geometry());
  var transformGeom = (geom, scale, translate) => {
    let retval = [];
    for (let arr2 of geom) {
      let loop = [];
      for (let coord of arr2) {
        loop.push(coord.clone().mult(scale).add(translate));
      }
      retval.push(loop);
    }
    return retval;
  };
  var View = class {
    constructor(tileCache, maxDataLevel, levelDiff) {
      this.tileCache = tileCache;
      this.maxDataLevel = maxDataLevel;
      this.levelDiff = levelDiff;
    }
    dataTilesForBounds(display_zoom, bounds) {
      let needed = [];
      var scale = 1;
      var dim = this.tileCache.tileSize;
      if (display_zoom < this.levelDiff) {
        scale = 1 / (1 << this.levelDiff - display_zoom);
        needed.push({
          data_tile: { z: 0, x: 0, y: 0 },
          origin: new import_point_geometry2.default(0, 0),
          scale,
          dim: dim * scale
        });
      } else if (display_zoom <= this.levelDiff + this.maxDataLevel) {
        let f = 1 << this.levelDiff;
        let mintile_x = Math.floor(bounds[0] / f / 256);
        let mintile_y = Math.floor(bounds[1] / f / 256);
        let maxtile_x = Math.floor(bounds[2] / f / 256);
        let maxtile_y = Math.floor(bounds[3] / f / 256);
        for (var tx = mintile_x; tx <= maxtile_x; tx++) {
          for (var ty = mintile_y; ty <= maxtile_y; ty++) {
            let origin = new import_point_geometry2.default(tx * f * 256, ty * f * 256);
            needed.push({
              data_tile: { z: display_zoom - this.levelDiff, x: tx, y: ty },
              origin,
              scale: 1,
              dim
            });
          }
        }
      } else {
        let f = 1 << this.levelDiff;
        scale = 1 << display_zoom - this.maxDataLevel - this.levelDiff;
        let mintile_x = Math.floor(bounds[0] / f / 256 / scale);
        let mintile_y = Math.floor(bounds[1] / f / 256 / scale);
        let maxtile_x = Math.floor(bounds[2] / f / 256 / scale);
        let maxtile_y = Math.floor(bounds[3] / f / 256 / scale);
        for (var tx = mintile_x; tx <= maxtile_x; tx++) {
          for (var ty = mintile_y; ty <= maxtile_y; ty++) {
            let origin = new import_point_geometry2.default(tx * f * 256 * scale, ty * f * 256 * scale);
            needed.push({
              data_tile: { z: this.maxDataLevel, x: tx, y: ty },
              origin,
              scale,
              dim: dim * scale
            });
          }
        }
      }
      return needed;
    }
    dataTileForDisplayTile(display_tile) {
      var data_tile;
      var scale = 1;
      var dim = this.tileCache.tileSize;
      var origin;
      if (display_tile.z < this.levelDiff) {
        data_tile = { z: 0, x: 0, y: 0 };
        scale = 1 / (1 << this.levelDiff - display_tile.z);
        origin = new import_point_geometry2.default(0, 0);
        dim = dim * scale;
      } else if (display_tile.z <= this.levelDiff + this.maxDataLevel) {
        let f = 1 << this.levelDiff;
        data_tile = {
          z: display_tile.z - this.levelDiff,
          x: Math.floor(display_tile.x / f),
          y: Math.floor(display_tile.y / f)
        };
        origin = new import_point_geometry2.default(data_tile.x * f * 256, data_tile.y * f * 256);
      } else {
        scale = 1 << display_tile.z - this.maxDataLevel - this.levelDiff;
        let f = 1 << this.levelDiff;
        data_tile = {
          z: this.maxDataLevel,
          x: Math.floor(display_tile.x / f / scale),
          y: Math.floor(display_tile.y / f / scale)
        };
        origin = new import_point_geometry2.default(data_tile.x * f * scale * 256, data_tile.y * f * scale * 256);
        dim = dim * scale;
      }
      return { data_tile, scale, origin, dim };
    }
    getBbox(display_zoom, bounds) {
      return __async(this, null, function* () {
        let needed = this.dataTilesForBounds(display_zoom, bounds);
        let result = yield Promise.all(needed.map((tt) => this.tileCache.get(tt.data_tile)));
        return result.map((data, i) => {
          let tt = needed[i];
          return {
            data,
            z: display_zoom,
            data_tile: tt.data_tile,
            scale: tt.scale,
            dim: tt.dim,
            origin: tt.origin
          };
        });
      });
    }
    getDisplayTile(display_tile) {
      return __async(this, null, function* () {
        let tt = this.dataTileForDisplayTile(display_tile);
        const data = yield this.tileCache.get(tt.data_tile);
        return {
          data,
          z: display_tile.z,
          data_tile: tt.data_tile,
          scale: tt.scale,
          origin: tt.origin,
          dim: tt.dim
        };
      });
    }
    queryFeatures(lng, lat, display_zoom) {
      return this.tileCache.queryFeatures(lng, lat, Math.min(display_zoom - this.levelDiff, this.maxDataLevel));
    }
  };

  // src/painter.ts
  var import_point_geometry3 = __toModule(require_point_geometry());
  function painter(ctx, prepared_tiles, label_data, rules, bbox, origin, clip, debug) {
    let start = performance.now();
    ctx.save();
    ctx.miterLimit = 2;
    for (var prepared_tile of prepared_tiles) {
      let po = prepared_tile.origin;
      let ps = prepared_tile.scale;
      ctx.save();
      if (clip) {
        ctx.beginPath();
        ctx.rect(po.x - origin.x, po.y - origin.y, prepared_tile.dim, prepared_tile.dim);
        ctx.clip();
      }
      ctx.translate(po.x - origin.x, po.y - origin.y);
      for (var rule of rules) {
        if (rule.minzoom && prepared_tile.z < rule.minzoom)
          continue;
        if (rule.maxzoom && prepared_tile.z > rule.maxzoom)
          continue;
        var layer = prepared_tile.data.get(rule.dataLayer);
        if (layer === void 0)
          continue;
        rule.symbolizer.before(ctx, prepared_tile.z);
        for (var feature of layer) {
          let geom = feature.geom;
          let fbox = feature.bbox;
          if (fbox[2] * ps + po.x < bbox[0] || fbox[0] * ps + po.x > bbox[2] || fbox[1] * ps + po.y > bbox[3] || fbox[3] * ps + po.y < bbox[1]) {
            continue;
          }
          let properties = feature.properties;
          if (rule.filter && !rule.filter(properties))
            continue;
          if (ps != 1) {
            geom = transformGeom(geom, ps, new import_point_geometry3.default(0, 0));
          }
          rule.symbolizer.draw(ctx, geom, properties);
        }
      }
      ctx.restore();
    }
    let matches = label_data.searchBbox({ minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] }, Infinity);
    for (var label of matches) {
      ctx.save();
      ctx.translate(label.anchor.x - origin.x, label.anchor.y - origin.y);
      label.draw(ctx);
      if (debug) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = debug;
        ctx.fillStyle = debug;
        ctx.globalAlpha = 1;
        ctx.fillRect(-2, -2, 4, 4);
        for (let bbox2 of label.bboxes) {
          ctx.strokeRect(bbox2.minX - origin.x, bbox2.minY - origin.y, bbox2.maxX - bbox2.minX, bbox2.maxY - bbox2.minY);
        }
      }
      ctx.restore();
    }
    ctx.restore();
    return performance.now() - start;
  }

  // src/labeler.ts
  var import_rbush = __toModule(require_rbush_min());
  var covering = (display_zoom, tile_width, bbox) => {
    let res = 256;
    let f = tile_width / res;
    let minx = Math.floor(bbox.minX / res);
    let miny = Math.floor(bbox.minY / res);
    let maxx = Math.floor(bbox.maxX / res);
    let maxy = Math.floor(bbox.maxY / res);
    let leveldiff = Math.log2(f);
    let retval = [];
    for (let x = minx; x <= maxx; x++) {
      for (let y = miny; y <= maxy; y++) {
        retval.push({
          display: toIndex({ z: display_zoom, x, y }),
          key: toIndex({ z: display_zoom - leveldiff, x: Math.floor(x / f), y: Math.floor(y / f) })
        });
      }
    }
    return retval;
  };
  var Index = class {
    constructor() {
      this.tree = new import_rbush.default();
      this.current = new Map();
    }
    has(tileKey) {
      return this.current.has(tileKey);
    }
    size() {
      return this.current.size;
    }
    keys() {
      return this.current.keys();
    }
    searchBbox(bbox, order) {
      let labels = new Set();
      for (let match of this.tree.search(bbox)) {
        if (match.indexed_label.order <= order) {
          labels.add(match.indexed_label);
        }
      }
      return labels;
    }
    searchLabel(label, order) {
      let labels = new Set();
      for (let bbox of label.bboxes) {
        for (let match of this.tree.search(bbox)) {
          if (match.indexed_label.order <= order) {
            labels.add(match.indexed_label);
          }
        }
      }
      return labels;
    }
    bboxCollides(bbox, order) {
      for (let match of this.tree.search(bbox)) {
        if (match.indexed_label.order <= order)
          return true;
      }
      return false;
    }
    labelCollides(label, order) {
      for (let bbox of label.bboxes) {
        for (let match of this.tree.search(bbox)) {
          if (match.indexed_label.order <= order)
            return true;
        }
      }
      return false;
    }
    insert(label, order, tileKey) {
      let indexed_label = {
        anchor: label.anchor,
        bboxes: label.bboxes,
        draw: label.draw,
        order,
        tileKey
      };
      if (!this.current.has(tileKey)) {
        let newSet = new Set();
        newSet.add(indexed_label);
        this.current.set(tileKey, newSet);
      } else {
        this.current.get(tileKey).add(indexed_label);
      }
      for (let bbox of label.bboxes) {
        var b = bbox;
        b.indexed_label = indexed_label;
        this.tree.insert(b);
      }
    }
    prune(keyToRemove) {
      let indexed_labels = this.current.get(keyToRemove);
      let entries_to_delete = [];
      for (let entry of this.tree.all()) {
        if (indexed_labels.has(entry.indexed_label)) {
          entries_to_delete.push(entry);
        }
      }
      entries_to_delete.forEach((entry) => {
        this.tree.remove(entry);
      });
      this.current.delete(keyToRemove);
    }
    removeLabel(labelToRemove) {
      let entries_to_delete = [];
      for (let entry of this.tree.all()) {
        if (labelToRemove == entry.indexed_label) {
          entries_to_delete.push(entry);
        }
      }
      entries_to_delete.forEach((entry) => {
        this.tree.remove(entry);
      });
      this.current.get(labelToRemove.tileKey).delete(labelToRemove);
    }
  };
  var Labeler = class {
    constructor(z, scratch, labelRules2, callback) {
      this.index = new Index();
      this.z = z;
      this.scratch = scratch;
      this.labelRules = labelRules2;
      this.callback = callback;
    }
    layout(pt) {
      let start = performance.now();
      let key = toIndex(pt.data_tile);
      let tiles_invalidated = new Set();
      for (var [order, rule] of this.labelRules.entries()) {
        if (rule.visible == false)
          continue;
        if (rule.minzoom && this.z < rule.minzoom)
          continue;
        if (rule.maxzoom && this.z > rule.maxzoom)
          continue;
        let layer = pt.data.get(rule.dataLayer);
        if (layer === void 0)
          continue;
        let feats = layer;
        if (rule.sort)
          feats.sort((a, b) => rule.sort(a.properties, b.properties));
        for (let feature of feats) {
          if (rule.filter && !rule.filter(feature.properties))
            continue;
          let transformed = transformGeom(feature.geom, pt.scale, pt.origin);
          let labels = rule.symbolizer.stash(this.index, order, this.scratch, transformed, feature, this.z);
          if (!labels)
            continue;
          for (let label of labels) {
            var label_added = false;
            if (this.index.labelCollides(label, Infinity)) {
              if (!this.index.labelCollides(label, order)) {
                let conflicts = this.index.searchLabel(label, Infinity);
                for (let conflict of conflicts) {
                  this.index.removeLabel(conflict);
                  for (let bbox of conflict.bboxes) {
                    this.findInvalidatedTiles(tiles_invalidated, pt.dim, bbox, key);
                  }
                }
                this.index.insert(label, order, key);
                label_added = true;
              }
            } else {
              this.index.insert(label, order, key);
              label_added = true;
            }
            if (label_added) {
              for (let bbox of label.bboxes) {
                if (bbox.maxX > pt.origin.x + pt.dim || bbox.minX < pt.origin.x || bbox.minY < pt.origin.y || bbox.maxY > pt.origin.y + pt.dim) {
                  this.findInvalidatedTiles(tiles_invalidated, pt.dim, bbox, key);
                }
              }
            }
          }
        }
      }
      if (tiles_invalidated.size > 0 && this.callback) {
        this.callback(tiles_invalidated);
      }
      return performance.now() - start;
    }
    findInvalidatedTiles(tiles_invalidated, dim, bbox, key) {
      let touched = covering(this.z, dim, bbox);
      for (let s of touched) {
        if (s.key != key && this.index.has(s.key)) {
          tiles_invalidated.add(s.display);
        }
      }
    }
    pruneCache(added) {
      if (this.index.size() > 16) {
        let max_key = void 0;
        let max_dist = 0;
        for (let key of this.index.keys()) {
          let split = key.split(":");
          let dist = Math.sqrt(Math.pow(+split[0] - added.data_tile.x, 2) + Math.pow(+split[1] - added.data_tile.y, 2));
          if (dist > max_dist) {
            max_dist = dist;
            max_key = key;
          }
        }
        this.index.prune(max_key);
      }
    }
    add(prepared_tile) {
      let idx = toIndex(prepared_tile.data_tile);
      if (this.index.has(idx)) {
        return 0;
      } else {
        let timing = this.layout(prepared_tile);
        this.pruneCache(prepared_tile);
        return timing;
      }
    }
  };
  var Labelers = class {
    constructor(scratch, labelRules2, callback) {
      this.labelers = new Map();
      this.scratch = scratch;
      this.labelRules = labelRules2;
      this.callback = callback;
    }
    add(prepared_tile) {
      if (!this.labelers.get(prepared_tile.z)) {
        this.labelers.set(prepared_tile.z, new Labeler(prepared_tile.z, this.scratch, this.labelRules, this.callback));
      }
      return this.labelers.get(prepared_tile.z).add(prepared_tile);
    }
    getIndex(z) {
      return this.labelers.get(z).index;
    }
  };

  // src/symbolizer.ts
  var import_point_geometry4 = __toModule(require_point_geometry());
  var import_polylabel = __toModule(require_polylabel());

  // src/text.ts
  function linebreak(str) {
    if (str.length <= 15)
      return [str];
    let space_before = str.lastIndexOf(" ", 14);
    let space_after = str.indexOf(" ", 14);
    if (space_before == -1 && space_after == -1) {
      return [str];
    }
    let first;
    let after;
    if (space_after == -1 || space_before >= 0 && 14 - space_before < space_after - 14) {
      first = str.substring(0, space_before);
      after = str.substring(space_before + 1, str.length);
    } else {
      first = str.substring(0, space_after);
      after = str.substring(space_after + 1, str.length);
    }
    return [first, ...linebreak(after)];
  }
  var CJK_CHARS = "\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DB5\u4E00-\u9FEA\uF900-\uFA6D\uFA70-\uFAD9\u2000";
  var cjk_test = new RegExp("^[" + CJK_CHARS + "]+$");
  var TextSpec = class {
    constructor(options = {}) {
      this.properties = options.properties || ["name"];
      this.textTransform = options.textTransform;
    }
    str(z, f) {
      var retval;
      for (let property of this.properties) {
        if (f.hasOwnProperty(property)) {
          retval = f[property];
          break;
        }
      }
      if (retval && this.textTransform === "uppercase")
        retval = retval.toUpperCase();
      return retval;
    }
  };
  var FontSpec = class {
    constructor(options) {
      if (options.font) {
        this.font = options.font;
      } else {
        this.family = options.fontFamily || "sans-serif";
        this.size = options.fontSize || 12;
        this.weight = options.fontWeight;
        this.style = options.fontStyle;
      }
    }
    str(z, f) {
      if (this.font) {
        if (typeof this.font === "function") {
          return this.font(z, f);
        } else {
          return this.font;
        }
      } else {
        var style = "";
        if (this.style) {
          if (typeof this.style === "function") {
            style = this.style(z, f) + " ";
          } else {
            style = this.style + " ";
          }
        }
        var weight = "";
        if (this.weight) {
          if (typeof this.weight === "function") {
            weight = this.weight(z, f) + " ";
          } else {
            weight = this.weight + " ";
          }
        }
        var size;
        if (typeof this.size === "function") {
          size = this.size(z, f);
        } else {
          size = this.size;
        }
        var family;
        if (typeof this.family === "function") {
          family = this.family(z, f);
        } else {
          family = this.family;
        }
        return `${style}${weight}${size}px ${family}`;
      }
    }
  };

  // src/line.ts
  var import_xy = __toModule(require_xy());
  function simpleLabel(mls, minimum) {
    let longestStart;
    let longestEnd;
    let longestLength = 0;
    for (let ls of mls) {
      let segments = (0, import_xy.default)(ls, Math.PI / 2 / 18);
      for (let segment of segments) {
        if (segment.length >= minimum && segment.length > longestLength) {
          longestLength = segment.length;
          longestStart = ls[segment.beginIndex];
          longestEnd = ls[segment.endIndex - 1];
        }
      }
    }
    if (!longestStart)
      return void 0;
    if (longestStart.x == longestEnd.x && longestStart.y == longestEnd.y) {
      return void 0;
    }
    return { start: longestStart, end: longestEnd };
  }
  function lineCells(a, b, length, spacing) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    let retval = [];
    for (var i = spacing; i < length; i += 2 * spacing) {
      let factor = i * 1 / dist;
      retval.push({ x: a.x + factor * dx, y: a.y + factor * dy });
    }
    return retval;
  }

  // src/symbolizer.ts
  var createPattern = (width, height, fn) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    fn(canvas, ctx);
    return canvas;
  };
  var PolygonSymbolizer = class {
    constructor(options) {
      this.fill = options.fill || "#000000";
      this.opacity = options.opacity || 1;
      this.pattern = options.pattern;
    }
    before(ctx) {
      if (this.pattern) {
        ctx.fillStyle = ctx.createPattern(this.pattern, "repeat");
      } else {
        ctx.fillStyle = this.fill;
      }
      ctx.globalAlpha = this.opacity;
    }
    draw(ctx, geom, properties) {
      ctx.beginPath();
      for (var poly of geom) {
        for (var p = 0; p < poly.length - 1; p++) {
          let pt = poly[p];
          if (p == 0)
            ctx.moveTo(pt.x, pt.y);
          else
            ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.fill();
    }
  };
  function arr(base, a) {
    return (z) => {
      let b = z - base;
      if (b >= 0 && b < a.length) {
        return a[b];
      }
      return 0;
    };
  }
  function exp(base, stops) {
    return (z) => {
      if (z <= stops[0][0])
        return stops[0][1];
      if (z >= stops[stops.length - 1][0])
        return stops[stops.length - 1][1];
      let idx = 0;
      while (stops[idx + 1][0] < z)
        idx++;
      let difference = stops[idx + 1][0] - stops[idx][0];
      let progress = z - stops[idx][0];
      var factor;
      if (difference === 0)
        factor = 0;
      else if (base === 1)
        factor = progress / difference;
      else
        factor = (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
      return factor * (stops[idx + 1][1] - stops[idx][1]) + stops[idx][1];
    };
  }
  function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }
  var LineSymbolizer = class {
    constructor(options) {
      this.color = options.color || "#000000";
      this.width = options.width || 1;
      this.opacity = options.opacity || 1;
      this.skip = false;
      this.dash = options.dash;
      this.dashColor = options.dashColor || "black";
      this.dashWidth = options.dashWidth || 1;
    }
    before(ctx, z) {
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.opacity;
      if (isFunction(this.width) && this.width.length == 1) {
        let width = this.width(z);
        this.skip = width === 0;
        ctx.lineWidth = width;
      } else {
        ctx.lineWidth = this.width;
      }
    }
    draw(ctx, geom, properties) {
      if (this.skip)
        return;
      ctx.beginPath();
      for (var ls of geom) {
        for (var p = 0; p < ls.length; p++) {
          let pt = ls[p];
          if (p == 0)
            ctx.moveTo(pt.x, pt.y);
          else
            ctx.lineTo(pt.x, pt.y);
        }
      }
      if (this.dash) {
        ctx.save();
        ctx.lineWidth = this.dashWidth;
        ctx.strokeStyle = this.dashColor;
        ctx.setLineDash(this.dash);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.stroke();
      }
    }
  };
  var IconSymbolizer = class {
    constructor(options) {
      this.sprites = options.sprites;
      this.name = options.name;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      let pt = geom[0];
      let a = new import_point_geometry4.default(geom[0][0].x, geom[0][0].y);
      let bbox = {
        minX: a.x - 32,
        minY: a.y - 32,
        maxX: a.x + 32,
        maxY: a.y + 32
      };
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        let r = this.sprites.get(this.name);
        ctx.drawImage(r.canvas, r.x, r.y, r.w, r.h, -8, -8, r.w, r.h);
      };
      return [{ anchor: a, bboxes: [bbox], draw }];
    }
  };
  var CircleSymbolizer = class {
    constructor(options) {
      this.radius = options.radius || 3;
      this.fill = options.fill || "black";
      this.stroke = options.stroke || "white";
      this.width = options.width || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      let pt = geom[0];
      let a = new import_point_geometry4.default(geom[0][0].x, geom[0][0].y);
      let bbox = {
        minX: a.x - this.radius,
        minY: a.y - this.radius,
        maxX: a.x + this.radius,
        maxY: a.y + this.radius
      };
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        if (this.width > 0) {
          ctx.fillStyle = this.stroke;
          ctx.beginPath();
          ctx.arc(0, 0, this.radius + this.width, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fill();
      };
      return [{ anchor: a, bboxes: [bbox], draw }];
    }
  };
  var ShieldSymbolizer = class {
    constructor(options) {
      this.font = new FontSpec(options);
      this.text = new TextSpec(options);
      this.fill = options.fill || "black";
      this.stroke = options.stroke || "white";
      this.background = options.background || "white";
      this.padding = options.padding || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      let property = this.text.str(zoom, feature.properties);
      if (!property)
        return void 0;
      let font = this.font.str(zoom, feature.properties);
      scratch.font = font;
      let metrics = scratch.measureText(property);
      let width = metrics.width;
      let ascent = metrics.actualBoundingBoxAscent;
      let descent = metrics.actualBoundingBoxDescent;
      let pt = geom[0];
      let a = new import_point_geometry4.default(geom[0][0].x, geom[0][0].y);
      let p = this.padding;
      let bbox = {
        minX: a.x - width / 2 - p,
        minY: a.y - ascent - p,
        maxX: a.x + width / 2 + p,
        maxY: a.y + descent + p
      };
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.background;
        ctx.fillRect(-width / 2 - p, -ascent - p, width + 2 * p, ascent + descent + 2 * p);
        ctx.fillStyle = this.fill;
        ctx.font = font;
        ctx.fillText(property, -width / 2, 0);
      };
      return [{ anchor: a, bboxes: [bbox], draw }];
    }
  };
  var mergeBbox = (b1, b2) => {
    return {
      minX: Math.min(b1.minX, b2.minX),
      minY: Math.min(b1.minY, b2.minY),
      maxX: Math.max(b1.maxX, b2.maxX),
      maxY: Math.max(b1.maxY, b2.maxY)
    };
  };
  var GroupSymbolizer = class {
    constructor(list) {
      this.list = list;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      var labels = this.list[0].stash(index, order, scratch, geom, feature, zoom);
      var label = labels[0];
      let anchor = label.anchor;
      let bbox = label.bboxes[0];
      let draws = [label.draw];
      for (let i = 1; i < this.list.length; i++) {
        labels = this.list[i].stash(index, order, scratch, geom, feature, zoom);
        if (!labels)
          return void 0;
        label = labels[0];
        bbox = mergeBbox(bbox, label.bboxes[0]);
        draws.push(label.draw);
      }
      let draw = (ctx) => {
        draws.forEach((d) => d(ctx));
      };
      return [{ anchor, bboxes: [bbox], draw }];
    }
  };
  var CenteredTextSymbolizer = class {
    constructor(options) {
      this.font = new FontSpec(options);
      this.text = new TextSpec(options);
      this.fill = options.fill;
      this.stroke = options.stroke || "black";
      this.width = options.width || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      if (feature.geomType !== GeomType.Point)
        return void 0;
      let property = this.text.str(zoom, feature.properties);
      if (!property)
        return void 0;
      let font = this.font.str(zoom, feature.properties);
      scratch.font = font;
      let metrics = scratch.measureText(property);
      let width = metrics.width;
      let ascent = metrics.actualBoundingBoxAscent;
      let descent = metrics.actualBoundingBoxDescent;
      let a = new import_point_geometry4.default(geom[0][0].x, geom[0][0].y);
      let bbox = {
        minX: a.x - width / 2,
        minY: a.y - ascent,
        maxX: a.x + width / 2,
        maxY: a.y + descent
      };
      let textX = -width / 2;
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        ctx.font = font;
        if (this.width) {
          ctx.lineWidth = this.width * 2;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(property, textX, 0);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(property, textX, 0);
      };
      return [{ anchor: a, bboxes: [bbox], draw }];
    }
  };
  var OffsetTextSymbolizer = class {
    constructor(options) {
      this.font = new FontSpec(options);
      this.text = new TextSpec(options);
      this.fill = options.fill;
      this.stroke = options.stroke || "black";
      this.width = options.width || 0;
      this.offset = options.offset || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      if (feature.geomType !== GeomType.Point)
        return void 0;
      let property = this.text.str(zoom, feature.properties);
      if (!property)
        return void 0;
      let font = this.font.str(zoom, feature.properties);
      scratch.font = font;
      let metrics = scratch.measureText(property);
      let width = metrics.width;
      let ascent = metrics.actualBoundingBoxAscent;
      let descent = metrics.actualBoundingBoxDescent;
      let a = new import_point_geometry4.default(geom[0][0].x, geom[0][0].y);
      let offset = this.offset;
      var text_origin = new import_point_geometry4.default(offset, -offset);
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        ctx.font = font;
        if (this.width) {
          ctx.lineWidth = this.width * 2;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(property, text_origin.x, text_origin.y);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(property, text_origin.x, text_origin.y);
      };
      var bbox = {
        minX: a.x + text_origin.x,
        minY: a.y - ascent + text_origin.y,
        maxX: a.x + width + text_origin.x,
        maxY: a.y + descent + text_origin.y
      };
      if (!index.bboxCollides(bbox, order))
        return [{ anchor: a, bboxes: [bbox], draw }];
      text_origin = new import_point_geometry4.default(-width - offset, -offset);
      bbox = {
        minX: a.x + text_origin.x,
        minY: a.y - ascent + text_origin.y,
        maxX: a.x + width + text_origin.x,
        maxY: a.y + descent + text_origin.y
      };
      if (!index.bboxCollides(bbox, order))
        return [{ anchor: a, bboxes: [bbox], draw }];
      return void 0;
    }
  };
  var LineLabelSymbolizer = class {
    constructor(options) {
      this.font = new FontSpec(options);
      this.text = new TextSpec(options);
      this.fill = options.fill || "black";
      this.stroke = options.stroke || "black";
      this.width = options.width || 0;
      this.offset = options.offset || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      let name = this.text.str(zoom, feature.properties);
      if (!name)
        return void 0;
      if (name.length > 20)
        return void 0;
      let fbbox = feature.bbox;
      let area = (fbbox[3] - fbbox[1]) * (fbbox[2] - fbbox[0]);
      if (area < 100)
        return void 0;
      let font = this.font.str(zoom, feature.properties);
      scratch.font = font;
      let metrics = scratch.measureText(name);
      let width = metrics.width;
      let result = simpleLabel(geom, width);
      if (!result)
        return void 0;
      let dx = result.end.x - result.start.x;
      let dy = result.end.y - result.start.y;
      let Q = 8;
      let cells = lineCells(result.start, result.end, width, 8);
      let bboxes = cells.map((c) => {
        return {
          minX: c.x - Q,
          minY: c.y - Q,
          maxX: c.x + Q,
          maxY: c.y + Q
        };
      });
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        ctx.rotate(Math.atan2(dy, dx));
        if (dx < 0) {
          ctx.scale(-1, -1);
          ctx.translate(-width, 0);
        }
        ctx.translate(0, -this.offset);
        ctx.font = font;
        if (this.width) {
          ctx.lineWidth = this.width;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(name, 0, 0);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(name, 0, 0);
      };
      return [{ anchor: result.start, bboxes, draw }];
    }
  };
  var PolygonLabelSymbolizer = class {
    constructor(options) {
      this.font = new FontSpec(options);
      this.text = new TextSpec(options);
      this.fill = options.fill || "black";
      this.stroke = options.stroke || "black";
      this.width = options.width || 0;
    }
    stash(index, order, scratch, geom, feature, zoom) {
      let fbbox = feature.bbox;
      let area = (fbbox[3] - fbbox[1]) * (fbbox[2] - fbbox[0]);
      if (area < 2e4)
        return [];
      let property = this.text.str(zoom, feature.properties);
      if (!property)
        return void 0;
      let first_poly = geom[0];
      let found = (0, import_polylabel.default)([first_poly.map((c) => [c.x, c.y])]);
      let a = new import_point_geometry4.default(found[0], found[1]);
      let font = this.font.str(zoom, feature.properties);
      scratch.font = font;
      let lines = linebreak(property);
      let lineHeight = 14;
      var longestLine;
      var longestLineLen = 0;
      for (let line of lines) {
        if (line.length > longestLineLen) {
          longestLineLen = line.length;
          longestLine = line;
        }
      }
      let metrics = scratch.measureText(longestLine);
      let width = metrics.width;
      let bbox = {
        minX: a.x - width / 2,
        minY: a.y - metrics.actualBoundingBoxAscent,
        maxX: a.x + width / 2,
        maxY: a.y + (lineHeight * lines.length - metrics.actualBoundingBoxAscent)
      };
      let fill = this.fill;
      let draw = (ctx) => {
        ctx.globalAlpha = 1;
        ctx.font = font;
        var y = 0;
        for (let line of lines) {
          if (this.width) {
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.stroke;
            ctx.strokeText(line, -width / 2, y);
          }
          ctx.fillStyle = fill;
          ctx.fillText(line, -width / 2, y);
          y += lineHeight;
        }
      };
      return [{ anchor: a, bboxes: [bbox], draw }];
    }
  };

  // src/default_style/style.ts
  var paintRules = (params) => {
    return [
      {
        dataLayer: "earth",
        symbolizer: new PolygonSymbolizer({
          fill: params.earth
        })
      },
      {
        dataLayer: "natural",
        symbolizer: new PolygonSymbolizer({
          fill: params.glacier
        }),
        filter: (f) => {
          return f.natural == "glacier";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.residential
        }),
        filter: (f) => {
          return f.landuse == "residential" || f.place == "neighbourhood";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.hospital
        }),
        filter: (f) => {
          return f.amenity == "hospital";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.cemetery
        }),
        filter: (f) => {
          return f.landuse == "cemetery";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.school
        }),
        filter: (f) => {
          return f.amenity == "school" || f.amenity == "kindergarten" || f.amenity == "university" || f.amenity == "college";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.industrial
        }),
        filter: (f) => {
          return f.landuse == "industrial";
        }
      },
      {
        dataLayer: "natural",
        symbolizer: new PolygonSymbolizer({
          fill: params.wood
        }),
        filter: (f) => {
          return f.natural == "wood";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.grass
        }),
        filter: (f) => {
          return f.landuse == "grass";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonSymbolizer({
          fill: params.park
        }),
        filter: (f) => {
          return f.leisure == "park";
        }
      },
      {
        dataLayer: "water",
        symbolizer: new PolygonSymbolizer({
          fill: params.water
        })
      },
      {
        dataLayer: "natural",
        symbolizer: new PolygonSymbolizer({
          fill: params.sand
        }),
        filter: (f) => {
          return f.natural == "sand";
        }
      },
      {
        dataLayer: "buildings",
        symbolizer: new PolygonSymbolizer({
          fill: params.buildings
        })
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.highwayCasing,
          width: exp(1.4, [[5, 1.5], [11, 4], [16, 9], [20, 40]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "highway";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.majorRoadCasing,
          width: exp(1.4, [[9, 3], [12, 4], [17, 8], [20, 22]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "major_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.mediumRoadCasing,
          width: exp(1.4, [[13, 3], [17, 6], [20, 18]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "medium_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.minorRoadCasing,
          width: exp(1.4, [[14, 2], [17, 5], [20, 15]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "minor_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.minorRoad,
          width: exp(1.4, [[14, 1], [17, 3], [20, 13]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "minor_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.mediumRoad,
          width: exp(1.4, [[13, 2], [17, 4], [20, 15]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "medium_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.majorRoad,
          width: exp(1.4, [[9, 2], [12, 3], [17, 6], [20, 20]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "major_road";
        }
      },
      {
        dataLayer: "roads",
        symbolizer: new LineSymbolizer({
          color: params.highway,
          width: exp(1.4, [[5, 0.5], [11, 2.5], [16, 7], [20, 30]])
        }),
        filter: (f) => {
          return f["pmap:kind"] == "highway";
        }
      },
      {
        dataLayer: "boundaries",
        symbolizer: new LineSymbolizer({
          color: params.boundaries,
          width: 2,
          opacity: 0.4
        })
      },
      {
        dataLayer: "mask",
        symbolizer: new PolygonSymbolizer({
          fill: params.mask
        })
      }
    ];
  };
  var labelRules = (params) => {
    return [
      {
        dataLayer: "places",
        symbolizer: new CenteredTextSymbolizer({
          fill: params.countryLabel,
          font: (z, p) => {
            if (z < 6)
              return "200 14px sans-serif";
            return "200 20px sans-serif";
          },
          textTransform: "uppercase"
        }),
        filter: (f) => {
          return f["pmap:kind"] == "country";
        }
      },
      {
        dataLayer: "places",
        symbolizer: new CenteredTextSymbolizer({
          fill: params.stateLabel,
          font: "300 16px sans-serif"
        }),
        filter: (f) => {
          return f["pmap:kind"] == "state";
        }
      },
      {
        dataLayer: "places",
        filter: (f) => {
          return f["pmap:kind"] == "city";
        },
        minzoom: 7,
        symbolizer: new CenteredTextSymbolizer({
          fill: params.cityLabel,
          font: (z, p) => {
            if (p["pmap:rank"] == 1) {
              if (z > 8)
                return "600 20px sans-serif";
              return "600 12px sans-serif";
            } else {
              if (z > 8)
                return "600 16px sans-serif";
              return "600 10px sans-serif";
            }
          }
        }),
        sort: (a, b) => {
          return a["pmap:rank"] - b["pmap:rank"];
        }
      },
      {
        dataLayer: "places",
        filter: (f) => {
          return f["pmap:kind"] == "city";
        },
        maxzoom: 6,
        symbolizer: new GroupSymbolizer([
          new CircleSymbolizer({
            radius: 2,
            fill: params.cityLabel
          }),
          new OffsetTextSymbolizer({
            fill: params.cityLabel,
            offset: 2,
            font: (z, p) => {
              if (p["pmap:rank"] == 1) {
                if (z > 8)
                  return "600 20px sans-serif";
                return "600 12px sans-serif";
              } else {
                if (z > 8)
                  return "600 16px sans-serif";
                return "600 10px sans-serif";
              }
            }
          })
        ]),
        sort: (a, b) => {
          return a["pmap:rank"] - b["pmap:rank"];
        }
      },
      {
        dataLayer: "places",
        symbolizer: new CenteredTextSymbolizer({
          fill: params.neighbourhoodLabel,
          font: "500 10px sans-serif",
          textTransform: "uppercase"
        }),
        filter: (f) => {
          return f["pmap:kind"] == "neighbourhood";
        }
      },
      {
        dataLayer: "landuse",
        symbolizer: new PolygonLabelSymbolizer({
          fill: params.landuseLabel,
          font: "300 12px sans-serif"
        })
      },
      {
        dataLayer: "water",
        symbolizer: new PolygonLabelSymbolizer({
          fill: params.waterLabel,
          font: "italic 600 12px sans-serif"
        })
      },
      {
        dataLayer: "natural",
        symbolizer: new PolygonLabelSymbolizer({
          fill: params.naturalLabel,
          font: "italic 300 12px sans-serif"
        })
      },
      {
        dataLayer: "roads",
        symbolizer: new LineLabelSymbolizer({
          fill: params.roadsLabel,
          font: "500 12px sans-serif"
        }),
        minzoom: 12
      },
      {
        dataLayer: "roads",
        symbolizer: new ShieldSymbolizer({
          properties: ["ref"],
          font: "600 9px sans-serif",
          background: params.highway,
          padding: 2,
          fill: "#999"
        }),
        filter: (f) => {
          return f["pmap:kind"] == "highway";
        }
      },
      {
        dataLayer: "pois",
        symbolizer: new GroupSymbolizer([
          new CircleSymbolizer({
            radius: 2,
            fill: params.poisLabel
          }),
          new OffsetTextSymbolizer({
            fill: params.poisLabel,
            offset: 2,
            font: "300 10px sans-serif"
          })
        ])
      }
    ];
  };

  // src/default_style/light.ts
  var light = {
    earth: "#FFFBF6",
    glacier: "#ffffff",
    residential: "#F4F4F8",
    hospital: "#FFF6F6",
    cemetery: "#EFF2EE",
    school: "#F7F6FF",
    industrial: "#FFF9EF",
    wood: "#F4F9EF",
    grass: "#EBF9E3",
    park: "#E5F9D5",
    water: "#B7DFF2",
    sand: "#ebebeb",
    buildings: "#F2EDE8",
    highwayCasing: "#FFC3C3",
    majorRoadCasing: "#FFB9B9",
    mediumRoadCasing: "#FFCE8E",
    minorRoadCasing: "#cccccc",
    highway: "#FFCEBB",
    majorRoad: "#FFE4B3",
    mediumRoad: "#FFF2C8",
    minorRoad: "#ffffff",
    boundaries: "#9e9e9e",
    mask: "#dddddd",
    countryLabel: "#aaaaaa",
    cityLabel: "#6C6C6C",
    stateLabel: "#999999",
    neighbourhoodLabel: "#888888",
    landuseLabel: "#898989",
    waterLabel: "#41ABDC",
    naturalLabel: "#4B8F14",
    roadsLabel: "#888888",
    poisLabel: "#606060"
  };
  var paint_rules = paintRules(light);
  var label_rules = labelRules(light);

  // src/frontends/static.ts
  var R2 = 6378137;
  var MAX_LATITUDE2 = 85.0511287798;
  var MAXCOORD2 = R2 * Math.PI;
  var project2 = (latlng) => {
    let d = Math.PI / 180;
    let constrained_lat = Math.max(Math.min(MAX_LATITUDE2, latlng[0]), -MAX_LATITUDE2);
    let sin = Math.sin(constrained_lat * d);
    return new import_point_geometry5.default(R2 * latlng[1] * d, R2 * Math.log((1 + sin) / (1 - sin)) / 2);
  };
  var Static = class {
    constructor(options) {
      this.paint_rules = options.paint_rules || paint_rules;
      this.label_rules = options.label_rules || label_rules;
      let source;
      if (options.url.url) {
        source = new PmtilesSource(options.url);
      } else if (options.url.endsWith(".pmtiles")) {
        source = new PmtilesSource(options.url);
      } else {
        source = new ZxySource(options.url);
      }
      let cache = new TileCache(source, 1024);
      this.view = new View(cache, 14, 2);
      this.debug = options.debug || false;
    }
    drawContext(ctx, width, height, latlng, display_zoom) {
      return __async(this, null, function* () {
        let center = project2(latlng);
        let normalized_center = new import_point_geometry5.default((center.x + MAXCOORD2) / (MAXCOORD2 * 2), 1 - (center.y + MAXCOORD2) / (MAXCOORD2 * 2));
        let origin = normalized_center.clone().mult((1 << display_zoom) * 256).sub(new import_point_geometry5.default(width / 2, height / 2));
        let bbox = [origin.x, origin.y, origin.x + width, origin.y + height];
        let prepared_tiles = yield this.view.getBbox(display_zoom, bbox);
        let start = performance.now();
        let labeler = new Labeler(display_zoom, ctx, this.label_rules, null);
        for (var prepared_tile of prepared_tiles) {
          yield labeler.add(prepared_tile);
        }
        let p = painter(ctx, prepared_tiles, labeler.index, this.paint_rules, bbox, origin, true, this.debug);
        if (this.debug) {
          ctx.save();
          ctx.translate(-origin.x, -origin.y);
          for (var prepared_tile of prepared_tiles) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(prepared_tile.origin.x, prepared_tile.origin.y, prepared_tile.dim, prepared_tile.dim);
          }
          ctx.restore();
        }
        return performance.now() - start;
      });
    }
    drawCanvas(canvas, latlng, display_zoom) {
      return __async(this, null, function* () {
        let dpr = window.devicePixelRatio;
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        let ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        return this.drawContext(ctx, width, height, latlng, display_zoom);
      });
    }
  };

  // src/frontends/leaflet.ts
  var import_point_geometry6 = __toModule(require_point_geometry());

  // src/default_style/dark.ts
  var dark = {
    earth: "#151515",
    glacier: "#1c1c1c",
    residential: "#252B2F",
    hospital: "#3E2C2C",
    cemetery: "#36483D",
    school: "#2C3440",
    industrial: "#33312C",
    wood: "#3A3E38",
    grass: "#4E604D",
    park: "#2C4034",
    water: "#4D5B73",
    sand: "#777777",
    buildings: "#464545",
    highwayCasing: "#000000",
    majorRoadCasing: "#1C1B1B",
    mediumRoadCasing: "#3E3E3E",
    minorRoadCasing: "#000000",
    highway: "#5B5B5B",
    majorRoad: "#595959",
    mediumRoad: "#4F4F4F",
    minorRoad: "#393939",
    boundaries: "#666666",
    mask: "#dddddd",
    countryLabel: "#ffffff",
    cityLabel: "#FFFFFF",
    stateLabel: "#ffffff",
    neighbourhoodLabel: "#FDFDFD",
    landuseLabel: "#DDDDDD",
    waterLabel: "#707E95",
    naturalLabel: "#4c4c4c",
    roadsLabel: "#C4C4C4",
    poisLabel: "#959393"
  };
  var paint_rules2 = paintRules(dark);
  var label_rules2 = labelRules(dark);

  // src/frontends/leaflet.ts
  var CanvasPool = class {
    constructor(lang) {
      this.lang = lang;
      this.unused = [];
    }
    get(tile_size) {
      if (this.unused.length) {
        let tile = this.unused.shift();
        tile.removed = false;
        return tile;
      }
      let element = L.DomUtil.create("canvas", "leaflet-tile");
      element.width = tile_size;
      element.height = tile_size;
      element.lang = this.lang;
      return element;
    }
    put(elem) {
      L.DomUtil.removeClass(elem, "leaflet-tile-loaded");
      this.unused.push(elem);
    }
  };
  var timer = (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  };
  var LeafletLayer = class extends L.GridLayer {
    constructor(options) {
      // console.log(Object.values(options));
      for(const key in options){
        var op = options[key]
        //  for(const i in options[key]) {
        //    try{
        //     console.log(JSON.parse(op[i]))
        //    } catch {
        //     console.log(op[i])
        //    }
        //  }
        console.log(op[key])
      }
      if (options.noWrap && !options.bounds)
        options.bounds = [[-90, -180], [90, 180]];
      super(options);
      this.paint_rules = options.paint_rules || (options.dark ? paint_rules2 : paint_rules);
      this.label_rules = options.label_rules || (options.dark ? label_rules2 : label_rules);
      this.lastRequestedZ = void 0;
      let source;
      if (options.url.url) {
        source = new PmtilesSource(options.url);
      } else if (options.url.endsWith(".pmtiles")) {
        source = new PmtilesSource(options.url);
      } else {
        source = new ZxySource(options.url);
      }
      this.tasks = options.tasks || [];
      let cache = new TileCache(source, 1024);
      this.view = new View(cache, 14, 2);
      this.debug = options.debug;
      let scratch = document.createElement("canvas").getContext("2d");
      this.scratch = scratch;
      this.onTilesInvalidated = (tiles) => {
        tiles.forEach((t) => {
          this.rerenderTile(t);
        });
      };
      this.labelers = new Labelers(this.scratch, this.label_rules, this.onTilesInvalidated);
      this.tile_size = 256 * window.devicePixelRatio;
      this.pool = new CanvasPool(options.lang);
    }
    setDefaultStyle(dark2) {
      this.paint_rules = dark2 ? paint_rules2 : paint_rules;
      this.label_rules = dark2 ? label_rules2 : label_rules;
    }
    renderTile(coords, element, key, done = () => {
    }) {
      return __async(this, null, function* () {
        this.lastRequestedZ = coords.z;
        var prepared_tile;
        try {
          prepared_tile = yield this.view.getDisplayTile(coords);
        } catch (e) {
          if (e.name == "AbortError")
            return;
          else
            throw e;
        }
        if (element.key != key)
          return;
        if (this.lastRequestedZ !== coords.z)
          return;
        yield Promise.allSettled(this.tasks);
        if (element.key != key)
          return;
        if (this.lastRequestedZ !== coords.z)
          return;
        let layout_time = yield this.labelers.add(prepared_tile);
        if (element.key != key)
          return;
        if (this.lastRequestedZ !== coords.z)
          return;
        let label_data = this.labelers.getIndex(prepared_tile.z);
        if (!this._map)
          return;
        let center = this._map.getCenter().wrap();
        let pixelBounds = this._getTiledPixelBounds(center), tileRange = this._pxBoundsToTileRange(pixelBounds), tileCenter = tileRange.getCenter();
        let priority = coords.distanceTo(tileCenter) * 5;
        yield timer(priority);
        if (element.key != key)
          return;
        if (this.lastRequestedZ !== coords.z)
          return;
        let BUF = 16;
        let bbox = [256 * coords.x - BUF, 256 * coords.y - BUF, 256 * (coords.x + 1) + BUF, 256 * (coords.y + 1) + BUF];
        let origin = new import_point_geometry6.default(256 * coords.x, 256 * coords.y);
        let ctx = element.getContext("2d");
        ctx.setTransform(this.tile_size / 256, 0, 0, this.tile_size / 256, 0, 0);
        ctx.clearRect(0, 0, 256, 256);
        let painting_time = painter(ctx, [prepared_tile], label_data, this.paint_rules, bbox, origin, false, this.debug);
        if (this.debug) {
          let data_tile = prepared_tile.data_tile;
          ctx.save();
          ctx.fillStyle = this.debug;
          ctx.font = "600 12px sans-serif";
          ctx.fillText(coords.z + " " + coords.x + " " + coords.y, 4, 14);
          ctx.font = "200 12px sans-serif";
          if ((data_tile.x % 2 + data_tile.y % 2) % 2 == 0) {
            ctx.font = "200 italic 12px sans-serif";
          }
          ctx.fillText(data_tile.z + " " + data_tile.x + " " + data_tile.y, 4, 28);
          ctx.font = "600 10px sans-serif";
          if (painting_time > 8) {
            ctx.fillText(painting_time.toFixed() + " ms paint", 4, 42);
          }
          if (layout_time > 8) {
            ctx.fillText(layout_time.toFixed() + " ms layout", 4, 56);
          }
          ctx.strokeStyle = this.debug;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(0, 0, 256, 256);
          ctx.restore();
        }
        done();
      });
    }
    rerenderTile(key) {
      for (let unwrapped_k in this._tiles) {
        let wrapped_coord = this._wrapCoords(this._keyToTileCoords(unwrapped_k));
        if (key === this._tileCoordsToKey(wrapped_coord)) {
          this.renderTile(wrapped_coord, this._tiles[unwrapped_k].el, key);
        }
      }
    }
    clearLayout() {
      this.labelers = new Labelers(this.scratch, this.label_rules, this.onTilesInvalidated);
    }
    rerenderTiles() {
      for (let unwrapped_k in this._tiles) {
        let wrapped_coord = this._wrapCoords(this._keyToTileCoords(unwrapped_k));
        let key = this._tileCoordsToKey(wrapped_coord);
        this.renderTile(wrapped_coord, this._tiles[unwrapped_k].el, key);
      }
    }
    createTile(coords, showTile) {
      let element = this.pool.get(this.tile_size);
      let key = this._tileCoordsToKey(coords);
      element.key = key;
      this.renderTile(coords, element, key, () => {
        showTile(null, element);
      });
      return element;
    }
    _removeTile(key) {
      let tile = this._tiles[key];
      if (!tile) {
        return;
      }
      tile.el.removed = true;
      tile.el.key = void 0;
      L.DomUtil.remove(tile.el);
      this.pool.put(tile.el);
      delete this._tiles[key];
      this.fire("tileunload", {
        tile: tile.el,
        coords: this._keyToTileCoords(key)
      });
    }
    queryFeatures(lng, lat) {
      return this.view.queryFeatures(lng, lat, this._map.getZoom());
    }
  };
  var leafletLayer = (options) => {
    return new LeafletLayer(options);
  };

  // src/compat/json_style.ts
  function filterFn(arr2) {
    if (arr2.includes("$type")) {
      return (f) => true;
    } else if (arr2[0] == "==") {
      return (f) => f[arr2[1]] === arr2[2];
    } else if (arr2[0] == "!=") {
      return (f) => f[arr2[1]] !== arr2[2];
    } else if (arr2[0] === "<") {
      return (f) => f[arr2[1]] < arr2[2];
    } else if (arr2[0] === ">") {
      return (f) => f[arr2[1]] > arr2[2];
    } else if (arr2[0] === "in") {
      return (f) => arr2.slice(2, arr2.length).includes(f[arr2[1]]);
    } else if (arr2[0] === "!in") {
      return (f) => !arr2.slice(2, arr2.length).includes(f[arr2[1]]);
    } else if (arr2[0] === "has") {
      return (f) => f.hasOwnProperty(arr2[1]);
    } else if (arr2[0] === "all") {
      let parts = arr2.slice(1, arr2.length).map((e) => filterFn(e));
      return (f) => parts.every((p) => {
        return p(f);
      });
    } else if (arr2[0] === "any") {
      let parts = arr2.slice(1, arr2.length).map((e) => filterFn(e));
      return (f) => parts.some((p) => {
        return p(f);
      });
    } else {
      console.log("Unimplemented filter: ", arr2[0]);
    }
  }
  function numberFn(obj) {
    if (obj.base && obj.stops) {
      return (z, f) => {
        return exp(obj.base, obj.stops)(z - 1);
      };
    } else if (obj[0] == "interpolate" && obj[1][0] == "exponential" && obj[2] == "zoom") {
      let slice = obj.slice(3);
      let stops = [];
      for (var i = 0; i < slice.length; i += 2) {
        stops.push([slice[i], slice[i + 1]]);
      }
      return (z) => {
        return exp(obj[1][1], stops)(z - 1);
      };
    } else if (obj[0] == "step" && obj[1][0] == "get") {
      let slice = obj.slice(2);
      let prop = obj[1][1];
      return (z, props) => {
        let val = props[prop];
        if (val < slice[1])
          return slice[0];
        for (i = 1; i < slice.length; i += 2) {
          if (val <= slice[i])
            return slice[i + 1];
        }
        return slice[slice.length - 1];
      };
    } else {
      console.log("Unimplemented numeric fn: ", obj);
    }
  }
  function numberOrFn(obj, defaultValue = 0) {
    if (!obj)
      return defaultValue;
    if (typeof obj == "number") {
      return obj;
    }
    return numberFn(obj);
  }
  function widthFn(width_obj, gap_obj) {
    let w = numberOrFn(width_obj, 1);
    let g = numberOrFn(gap_obj);
    return (z) => {
      let tmp = typeof w == "number" ? w : w(z, {});
      if (g) {
        return tmp + (typeof g == "number" ? g : g(z, {}));
      }
      return tmp;
    };
  }
  function getFont(obj, fontsubmap) {
    let fontfaces = [];
    for (let wanted_face of obj["text-font"]) {
      if (fontsubmap.hasOwnProperty(wanted_face)) {
        fontfaces.push(fontsubmap[wanted_face]);
      }
    }
    if (fontfaces.length === 0)
      fontfaces.push({ face: "sans-serif" });
    let text_size = obj["text-size"];
    var weight = "";
    if (fontfaces.length && fontfaces[0].weight)
      weight = fontfaces[0].weight + " ";
    var style = "";
    if (fontfaces.length && fontfaces[0].style)
      style = fontfaces[0].style + " ";
    if (typeof text_size == "number") {
      return `${style}${weight}${text_size}px ${fontfaces.map((f) => f.face).join(", ")}`;
    } else if (text_size.stops) {
      var base = 1.4;
      if (text_size.base)
        base = text_size.base;
      let t = numberFn(text_size);
      return (z) => {
        return `${style}${weight}${t(z, {})}px ${fontfaces.map((f) => f.face).join(", ")}`;
      };
    } else if (text_size[0] == "step") {
      let t = numberFn(text_size);
      return (z, p) => {
        return `${style}${weight}${t(z, p)}px ${fontfaces.map((f) => f.face).join(", ")}`;
      };
    } else {
      console.log("Can't parse font: ", obj);
    }
  }
  function json_style(obj, fontsubmap) {
    let paint_rules3 = [];
    let label_rules3 = [];
    let refs = new Map();
    for (var layer of obj.layers) {
      refs.set(layer.id, layer);
      if (layer.layout && layer.layout.visibility == "none") {
        continue;
      }
      if (layer.ref) {
        let referenced = refs.get(layer.ref);
        layer.type = referenced.type;
        layer.filter = referenced.filter;
        layer.source = referenced["source"];
        layer["source-layer"] = referenced["source-layer"];
      }
      let sourceLayer = layer["source-layer"];
      var symbolizer;
      var filter = void 0;
      if (layer.filter) {
        filter = filterFn(layer.filter);
      }
      if (layer.type == "fill") {
        paint_rules3.push({
          dataLayer: layer["source-layer"],
          filter,
          symbolizer: new PolygonSymbolizer({
            fill: layer.paint["fill-color"],
            opacity: layer.paint["fill-opacity"]
          })
        });
      } else if (layer.type == "fill-extrusion") {
        paint_rules3.push({
          dataLayer: layer["source-layer"],
          filter,
          symbolizer: new PolygonSymbolizer({
            fill: layer.paint["fill-extrusion-color"],
            opacity: layer.paint["fill-extrusion-opacity"]
          })
        });
      } else if (layer.type == "line") {
        if (layer.paint["line-dasharray"]) {
          paint_rules3.push({
            dataLayer: layer["source-layer"],
            filter,
            symbolizer: new LineSymbolizer({
              width: widthFn(layer.paint["line-width"], layer.paint["line-gap-width"]),
              dash: layer.paint["line-dasharray"],
              dashColor: layer.paint["line-color"]
            })
          });
        } else {
          paint_rules3.push({
            dataLayer: layer["source-layer"],
            filter,
            symbolizer: new LineSymbolizer({
              color: layer.paint["line-color"],
              width: widthFn(layer.paint["line-width"], layer.paint["line-gap-width"])
            })
          });
        }
      } else if (layer.type == "symbol") {
        if (layer.layout["symbol-placement"] == "line") {
          label_rules3.push({
            dataLayer: layer["source-layer"],
            filter,
            symbolizer: new LineLabelSymbolizer({
              font: getFont(layer.layout, fontsubmap),
              fill: layer.paint["text-color"],
              width: layer.paint["text-halo-width"],
              stroke: layer.paint["text-halo-color"],
              properties: ["name:latin"],
              textTransform: layer.layout["text-transform"]
            })
          });
        } else {
          label_rules3.push({
            dataLayer: layer["source-layer"],
            filter,
            symbolizer: new CenteredTextSymbolizer({
              font: getFont(layer.layout, fontsubmap),
              fill: layer.paint["text-color"],
              stroke: layer.paint["text-halo-color"],
              width: layer.paint["text-halo-width"],
              properties: ["name:latin"],
              textTransform: layer.layout["text-transform"]
            })
          });
        }
      }
    }
    label_rules3.reverse();
    return { paint_rules: paint_rules3, label_rules: label_rules3, tasks: [] };
  }

  // node_modules/protosprites/index.js
  var potpack = (boxes) => {
    let area = 0;
    let maxWidth = 0;
    for (const box of boxes) {
      area += box.w * box.h;
      maxWidth = Math.max(maxWidth, box.w);
    }
    boxes.sort((a, b) => b.h - a.h);
    const startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);
    const spaces = [{ x: 0, y: 0, w: startWidth, h: Infinity }];
    let width = 0;
    let height = 0;
    for (const box of boxes) {
      for (let i = spaces.length - 1; i >= 0; i--) {
        const space = spaces[i];
        if (box.w > space.w || box.h > space.h)
          continue;
        box.x = space.x;
        box.y = space.y;
        height = Math.max(height, box.y + box.h);
        width = Math.max(width, box.x + box.w);
        if (box.w === space.w && box.h === space.h) {
          const last = spaces.pop();
          if (i < spaces.length)
            spaces[i] = last;
        } else if (box.h === space.h) {
          space.x += box.w;
          space.w -= box.w;
        } else if (box.w === space.w) {
          space.y += box.h;
          space.h -= box.h;
        } else {
          spaces.push({
            x: space.x + box.w,
            y: space.y,
            w: space.w - box.w,
            h: box.h
          });
          space.y += box.h;
          space.h -= box.h;
        }
        break;
      }
    }
    return {
      w: width,
      h: height,
      fill: area / (width * height) || 0
    };
  };
  var mkimg = (src) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject("Invalid SVG");
      img.src = src;
    });
  };
  var MISSING = `
<svg width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="#cccccc"/>
    <g transform="translate(5,5)">
        <path fill="none" stroke="#666666" stroke-width="7" d="m11,12a8.5,8 0 1,1 17,0q0,4-4,6t-4.5,4.5-.4,4v.2m0,3v7"/>
    </g>
</svg>
`;
  var Protosprites = class {
    constructor(src) {
      this.src = src;
      this.canvas = null;
    }
    load() {
      return __async(this, null, function* () {
        let src = this.src;
        let scale = window.devicePixelRatio;
        if (src.endsWith(".html")) {
          let c = yield fetch(src);
          src = yield c.text();
        }
        let tree = new window.DOMParser().parseFromString(src, "text/html");
        let icons = tree.body.children;
        this.mapping = {};
        let missingImg = yield mkimg("data:image/svg+xml;base64," + btoa(MISSING));
        let boxes = [
          { w: missingImg.width * scale, h: missingImg.height * scale, img: missingImg }
        ];
        let serializer = new XMLSerializer();
        for (let ps of icons) {
          var svg64 = btoa(serializer.serializeToString(ps));
          var image64 = "data:image/svg+xml;base64," + svg64;
          let img = yield mkimg(image64);
          boxes.push({ w: img.width * scale, h: img.height * scale, img, id: ps.id });
        }
        let packresult = potpack(boxes);
        this.canvas = document.createElement("canvas");
        this.canvas.width = packresult.w;
        this.canvas.height = packresult.h;
        let ctx = this.canvas.getContext("2d");
        for (let box of boxes) {
          ctx.drawImage(box.img, box.x, box.y, box.w, box.h);
          if (box.id)
            this.mapping[box.id] = { x: box.x, y: box.y, w: box.w, h: box.h };
          else
            this.missingBox = { x: box.x, y: box.y, w: box.w, h: box.h };
        }
        return this;
      });
    }
    get(name) {
      let result = this.mapping[name];
      if (!result)
        result = this.missingBox;
      result.canvas = this.canvas;
      return result;
    }
  };

  // src/task.ts
  var Font = (name, url, weight) => {
    let ff = new FontFace(name, "url(" + url + ")", { weight });
    document.fonts.add(ff);
    return ff.load();
  };
  var Sprites = (url) => {
    return new Protosprites(url);
  };
  return src_exports;
})();
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
