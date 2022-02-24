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
