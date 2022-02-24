import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

class AppServer {
  static startServer() async {
    var handler =
        const Pipeline().addMiddleware(logRequests()).addHandler(_echoRequest);

    var server = await shelf_io.serve(handler, '127.0.0.1', 8080);

    // Enable content compression
    server.autoCompress = true;

    print('Serving at http://${server.address.host}:${server.port}');
  }

  static Future<Response> _echoRequest(Request request) async {
    print(request.protocolVersion);
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
        return await ServerUtils.sendPMTilesResponse(request);
      default:
        return await ServerUtils.sendErrResponse(request);
    }
    // if (request.requestedUri.path.contains('index.html')) {

    // } else {
    //   return Response.ok('Request for "${request.url}"');
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

  static Future<Response> sendErrResponse(Request request) async {
    var path = request.requestedUri.path;
    return Response.ok(
      "Unable to load $path",
      headers: {
        HttpHeaders.contentTypeHeader: "text/html",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static Future<Response> sendHtmlResponse(Request request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    return Response.ok(
      index,
      headers: {
        HttpHeaders.contentTypeHeader: "text/html",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static sendCssResponse(Request request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    return Response.ok(
      index,
      headers: {
        HttpHeaders.contentTypeHeader: "text/css",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static sendImageResponse(Request request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadImage(path);
    return Response.ok(
      index,
      headers: {
        HttpHeaders.contentTypeHeader: "image/png",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static sendTtfResponse(Request request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadImage(path);
    return Response.ok(
      index,
      headers: {
        HttpHeaders.contentTypeHeader: "text/html",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static sendJsResponse(Request request) async {
    var path = request.requestedUri.path;
    var index = await ServerUtils.loadAsset(path);
    return Response.ok(
      index,
      headers: {
        HttpHeaders.contentTypeHeader: "text/javascript",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*"
      },
    );
  }

  static sendPMTilesResponse(Request request) async {
    var path = request.requestedUri.path;
    print(request.contentLength.toString());
    var range = request.headers['range'];
    var contentLength =
        request.contentLength != null ? request.contentLength! : null;
    var rangeVal = List.empty(growable: true);
    if (range != null) {
      rangeVal = range.split("=")[1].split("-");
    }
    var index = await ServerUtils.loadImage(path);
    var dataList = index
        .toList()
        .getRange(int.parse(rangeVal[0]), int.parse(rangeVal[1]))
        .toList();
    print(Uint8List.fromList(dataList).length);
    return Response(
      206,
      body: dataList.toString(),
      headers: {
        HttpHeaders.contentTypeHeader: "application/octet-stream",
        HttpHeaders.allowHeader: "*",
        'Access-Control-Allow-Origin': "*",
        "Content-Length": int.parse(rangeVal[1]) + 1,
        "Content-Range":
            "bytes ${int.parse(rangeVal[0])}-${int.parse(rangeVal[1])}",
      },
    );
  }
}
