import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:test_server/services/new_server.dart';

class HomeView extends StatefulWidget {
  @override
  _HomeViewState createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  @override
  void initState() {
    super.initState();
    init();
  }

  var isLoading = true;

  init() async {
    await AppServer.startServer();
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : InAppWebView(
              onLoadStart: (controller, url) {
                controller.setOptions(
                    options: InAppWebViewGroupOptions(
                  crossPlatform: InAppWebViewOptions(
                    allowFileAccessFromFileURLs: true,
                    allowUniversalAccessFromFileURLs: true,
                    javaScriptEnabled: true,
                    supportZoom: false,
                  ),
                ));
              },
              /* shouldInterceptFetchRequest:
                  (controller, FetchRequest fetchRequest) async {
                final fetchRequestWithAuthorization = fetchRequest.headers![{
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                  'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                }];

                return fetchRequestWithAuthorization;
              }, */
              onConsoleMessage: (controller, consoleMessage) {
                print(consoleMessage.message);
              },
              initialUrlRequest: URLRequest(
                url: Uri.parse('http:127.0.0.1:8080/assets/index.html'),
              ),
              onLoadStop: (InAppWebViewController controller, url) {
                // var url =
                //     "https://storage.googleapis.com/fishedge.appspot.com/gis/basemap/in.pmtiles?GoogleAccessId=gs-reader%40fishedge.iam.gserviceaccount.com&Expires=1662760218&Signature=sYXX1xMD9kuUlkO%2BQoqGdMLeTk00eRTKIvIg822dverUxl0TpsZjpfeWe6EpieeLv2GbY5dPI6O3O%2BPohll%2FBPZ34EdRETnnARur1CqQJNOEi7kYkwVwlHszTSBk4gP2tJTylN0%2B0yxxq2aVevrClvsims5xusBIycXQUCBE83q3Ndrd34Lsg23rdO6GJJb37KZkc%2Fj28wg6LC%2B0Xk%2BXmobx7HepD8G8fDPxJXJSIrxlsGPAYl9F0Z11VjL5UgY%2FL7xlPJqpR109IrvtiTZgMVF28ko1Z5Y9ikNd4OJs4pUKyW%2Fel06sVFOYD6kjVVxJQfY9vrXNG9%2Fh6htYFDo0gw%3D%3D";
                // var style =
                //     "{\"layers\":[{\"type\":\"line\",\"source-layer\":\"transportation\",\"paint\":{\"line-color\":\"#f3f3f3\",\"line-width\":2}},{\"type\":\"line\",\"source-layer\":\"waterway\",\"paint\":{\"line-color\":\"#c2c2c2\",\"line-width\":2}},{\"type\":\"line\",\"source-layer\":\"aeroway\",\"paint\":{\"line-color\":\"#f3f3f3\",\"line-width\":4}},{\"type\":\"fill\",\"source-layer\":\"building\",\"paint\":{\"fill-color\":\"#f3f3f3\",\"fill-opacity\":0.5}},{\"type\":\"fill\",\"source-layer\":\"water\",\"paint\":{\"fill-color\":\"#bfbfbf\",\"fill-opacity\":1}},{\"type\":\"line\",\"source-layer\":\"state_boundary\",\"paint\":{\"line-color\":\"#6a6a6a77\",\"line-width\":2}},{\"type\":\"line\",\"source-layer\":\"country_boundary\",\"paint\":{\"line-color\":\"#727272\",\"line-width\":0.25}},{\"type\":\"symbol\",\"source-layer\":\"transportation_name\",\"layout\":{\"text-size\":10,\"text-font\":\"sans-serif\",\"symbol-placement\":\"line\"},\"paint\":{\"text-color\":\"#070707\",\"text-halo-color\":\"#00000000\",\"text-halo-width\":0}},{\"type\":\"fill\",\"source-layer\":\"buildings\",\"paint\":{\"fill-color\":\"black\"}},{\"type\":\"symbol\",\"source-layer\":\"place\",\"layout\":{\"text-size\":10,\"text-font\":\"sans-serif\"},\"paint\":{\"text-color\":\"#070707\"}}]}";
                // controller.evaluateJavascript(
                //     source: "addBasemap('$url', '$style')");
              },
            ),
    );
  }
}
