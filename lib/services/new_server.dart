import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

class AppServer {
  static startServer() async {
    /* var handler =
        const Pipeline().addMiddleware(logHttpRequests()).addHandler(_echoHttpRequest);

    var server = await shelf_io.serve(handler, '127.0.0.1', 8080);

    // Enable content compression
    server.autoCompress = true;

    print('Serving at http://${server.address.host}:${server.port}'); */
    var server = await HttpServer.bind('127.0.0.1', 8080);
    print("Server running on IP : " +
        server.address.toString() +
        " On Port : " +
        server.port.toString());
    server.listen((request) async {
      echoHttpRequest(request);
    });

    print("Server running on IP : " +
        server.address.toString() +
        " On Port : " +
        server.port.toString());
  }

  static echoHttpRequest(HttpRequest request) async {
    switch (
        request.requestedUri.path.split(".").last.toString().toLowerCase()) {
      case "html":
        return await ServerUtils.sendHtmlResponse(request);
      case "css":
        return await ServerUtils.sendCssResponse(request);
      case "js":
        return await ServerUtils.sendJsResponse(request);
      case "ttf":
        return await ServerUtils.sendTtfResponse(request);
      case "png":
        return await ServerUtils.sendImageResponse(request);
      case "pmtiles":
        return await ServerUtils.readFileStream(request);
      default:
        return await ServerUtils.sendErrResponse(request);
    }
    // if (request.requestedUri.path.contains('index.html')) {

    // } else {
    //   return Response.ok('HttpRequest for "${request.url}"');
    // }
  }
}

class ServerUtils {
  static Future<String> loadAsset(String path) async {
    var parts = path.split("/");
    parts.removeAt(0);
    var joined = parts.join("/");
    return await rootBundle.loadString(joined);
  }

  static Future<Uint8List> loadImage(String path) async {
    var parts = path.split("/");
    parts.removeAt(0);
    var joined = parts.join("/");
    var data = await rootBundle.load(joined);
    return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
  }

  static Future<Uint8List?> loadPhoneAsset(String path) async {
    var parts = path.split("/");
    parts.removeAt(0);
    var joined = parts.join("/");
    var sysDir = await getApplicationDocumentsDirectory();
    var mydir = Directory(sysDir.path + '/flutter_assets/$joined');
    var file = File(mydir.path);
    var exist = await file.exists();
    if (exist) {
      var streamData = await file.readAsBytes();
      return streamData;
    } else {
      print('File does not exist');
    }
    // return await rootBundle.loadString(joined);
  }

  static sendErrResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "text/javascript")
      ..write("Unable to load $path")
      ..close();
  }

  static sendHtmlResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "text/html")
      ..write(index)
      ..close();
  }

  static sendCssResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "text/css")
      ..write(index)
      ..close();
  }

  static sendImageResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadImage(path);
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "image/png")
      ..write(index)
      ..close();
  }

  static sendTtfResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadImage(path);
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "image/png")
      ..write(index)
      ..close();
  }

  static sendJsResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    request.response
      ..headers.add(HttpHeaders.contentTypeHeader, "text/javascript")
      ..write(index)
      ..close();
  }

  static sendPMTilesResponse(HttpRequest request) async {
    var path = request.requestedUri.path;
    var range = request.headers.value("Range")!;
    print(range);
    if (range != null || int.parse(range) != -1) {
      var rangeVal = List.empty(growable: true);
      rangeVal = range.split("=")[1].split("-");

      var index = await ServerUtils.loadPhoneAsset(path);

      request.response
        ..headers.add('Access-Control-Allow-Origin', "*")
        ..headers.add("Content-Type", "text/html")
        ..headers.add("Content-Length", int.parse(rangeVal[1]))
        ..headers.add("Content-Range",
            'range ${int.parse(rangeVal[0])}-${int.parse(rangeVal[1])}/81998309')
        ..write(index)
        ..close();
    } else {
      sendErrResponse(request);
    }
  }

  static readFileStream(HttpRequest request) async {
    var path = request.requestedUri.path;
    var range = request.headers.value("Range")!;
    if (range != null || int.parse(range) != -1) {
      print("range: $range");
      var rangeVal = List.empty(growable: true);
      rangeVal = range.split("=")[1].split("-");
      var data = await readbyteRange(
          path, int.parse(rangeVal[0]), int.parse(rangeVal[1]));
      request.response
        ..headers.set('Access-Control-Allow-Origin', "*")
        ..headers.set("Content-Length", int.parse(rangeVal[1]) + 1)
        ..headers.set("content-type", "Range")
        // ..headers.add("Content-Range",
        //     'range ${int.parse(rangeVal[0])}-${int.parse(rangeVal[1])}/81998309')
        // ..headers.add("Accept-Ranges", "bytes")
        // ..headers.add("Access-Control-Allow-Credentials", true)
        // ..headers.add("Cache-Control", "public, max-age=0")
        // ..headers.add("Connection", "keep-alive")
        // ..headers.add("Keep-Alive", "timeout=5")
        ..add(data!)
        ..done;
    } else {
      sendErrResponse(request);
    }
  }

  static Future<Uint8List?> readbyteRange(path, start, end) async {
    var parts = path.split("/");
    parts.removeAt(0);
    var joined = parts.join("/");
    var sysDir = await getApplicationDocumentsDirectory();
    var mydir = Directory(sysDir.path + '/flutter_assets/$joined');
    var file = File(mydir.path);
    var exist = await file.exists();

    if (exist) {
      // var fileData = await file.readAsBytes();
      // print("Length ${fileData.length}");
      // print("IN bytes ${fileData.lengthInBytes}");
      RandomAccessFile fileOpen = await file.open(mode: FileMode.read);
      fileOpen = await fileOpen.setPosition(start);
      Uint8List convertedData = fileOpen.readSync((end - start) + 1);
      print("UNIT LENGTH:  ${convertedData.length}");
      fileOpen.flush();
      // return fileOpen.read(end);
      return convertedData;
    }
    // List.copyRange(bytes, bytes.length, bytes, start, end);
    // var res = String.fromCharCodes(bytes, 0, bytes.length);
    // return shared;
  }
}


      // var data = index.toList();
      // var dataList = data
      //     .getRange(int.parse(rangeVal[0]), int.parse(rangeVal[1]))
      //     .toList();
      // var cut = index!.sublist(int.parse(rangeVal[0]), int.parse(rangeVal[1]));
      // print('Cut length: ${cut.length}');
      // var intoInt8 = Uint8List.fromList(cut);
      // print('Coverted Length: ${intoInt8.length}');
      // var utf8 = Utf8Codec();
      // var encodedLen = utf8.encode(index.toString());
      // var secondSplit = utf8.encoder.convert(encodedLen.toString(),
      //     int.parse(rangeVal[0]), int.parse(rangeVal[1]));
      // print("1: " + encodedLen.length.toString());
      // print("2: " + secondSplit.length.toString());
      // print("3: " + utf8.encode(secondSplit.toString()).length.toString());
      // final buffer = index!.buffer;
      // var byteData =
      //     buffer.asUint8List(index.offsetInBytes, int.parse(rangeVal[1]) + 1);


      // var fileData = await file.readAsBytes();
      // var utf8 = Utf8Codec();
      // print('Total file size: ${fileData.lengthInBytes}');

      // var buffer = new Uint8List.fromList(fileData.sublist(start, end));
      // var bdata = buffer.buffer.asByteData();
      // print("bdata: ${bdata.getUint16(bdata.offsetInBytes)}");
      // // print(utf8.encode(fileData.sublist(start, end).toString()).getRange(start, end);
      // // return fileData.sublist(1, end);
      // return fileData.sublist(start, bdata.getUint16(bdata.offsetInBytes, Endian.little) * 17);
      // RandomAccessFile fileOpen = await file.open(mode: FileMode.read);

      // int count = 0;
      // List<int> bytes = [];
      // int byte = 0;
      // print("EXACT BYTES :${(512000 ~/ 3.033) - 35}");
      // while (byte != -1 && count < 168775.5) {
      //   byte = fileOpen.readByteSync();
      //   bytes.add(byte);
      //   count++;
      // }

      // await fileOpen.close();
      
      
      // print("Length ${fileOpen.length}");
      // print("IN bytes ${fileOpen.lengthInBytes}");
      // int count = start;
      // int byte = 0;
      // print("EXACT BYTES :${(512000 ~/ 3.033) - 35}");
      // while (byte != -1 && count < end) {
      //   byte = fileOpen.readByteSync();
      //   bytes.add(byte);
      //   // print("NEXT BYTE: $byte");
      //   // print("COUNT: $count");
      //   count++;
      // }