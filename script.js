// Initialize the Map
var map = L.map('map').setView([-6.2, 106.8], 11); // DKI Jakarta Centered

// Add OSM Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Prepare Layer Groups (for Layer Control)
var layers = {
    areaBanjir: L.layerGroup(),
    batas: L.layerGroup(),
    jalan: L.layerGroup(),
    sungai: L.layerGroup(),
    buffer100m: L.layerGroup(),
    buffer200m: L.layerGroup(),
    rendah: L.layerGroup(),
    sedang: L.layerGroup(),
    tinggi: L.layerGroup()
};

// Function to Add GeoJSON as Marker Layer (for point-type data)
function addGeoJSONMarkers(url, targetLayer, icon) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var geojsonLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: icon });
                },
                onEachFeature: function (feature, layer) {
                    var props = feature.properties;
                    var popupContent = '';
                    for (var key in props) {
                        popupContent += `<b>${key}</b>: ${props[key]}<br>`;
                    }
                    layer.bindPopup(popupContent);
                }
            });
            geojsonLayer.addTo(targetLayer);
        })
        .catch(err => {
            console.error('Error loading GeoJSON: ' + url, err);
        });
}

// Function to Add GeoJSON as Polygon/Polyline Layer (with style)
function addStyledGeoJSON(url, targetLayer, styleOptions) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var geojsonLayer = L.geoJSON(data, {
                style: styleOptions,
                onEachFeature: function (feature, layer) {
                    var props = feature.properties;
                    var popupContent = '';
                    for (var key in props) {
                        popupContent += `<b>${key}</b>: ${props[key]}<br>`;
                    }
                    layer.bindPopup(popupContent);
                }
            });
            geojsonLayer.addTo(targetLayer);
        })
        .catch(err => {
            console.error('Error loading GeoJSON: ' + url, err);
        });
}

// Load Layers
addGeoJSONMarkers('asset/GeoJson/area_banjir.geojson', layers.areaBanjir, L.icon({
    iconUrl: 'icons/icon1.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
}));

addStyledGeoJSON('asset/GeoJson/batas.geojson', layers.batas, { color: '#000000', weight: 2 });
addStyledGeoJSON('asset/GeoJson/jalan.geojson', layers.jalan, { color: '#FF0000', weight: 2 });
addStyledGeoJSON('asset/GeoJson/sungai.geojson', layers.sungai, { color: '#0000FF', weight: 2 });
addStyledGeoJSON('asset/GeoJson/buffer100m.geojson', layers.buffer100m, { color: '#00FF00', weight: 1, fillOpacity: 0.3 });
addStyledGeoJSON('asset/GeoJson/buffer200m.geojson', layers.buffer200m, { color: '#FFFF00', weight: 1, fillOpacity: 0.3 });
addStyledGeoJSON('asset/GeoJson/rendah.geojson', layers.rendah, { color: '#00FF00', weight: 1 });
addStyledGeoJSON('asset/GeoJson/sedang.geojson', layers.sedang, { color: '#FFFF00', weight: 1 });
addStyledGeoJSON('asset/GeoJson/tinggi.geojson', layers.tinggi, { color: '#FF0000', weight: 1 });

// Add Layer Control Panel (Top-Left)
L.control.layers(null, {
    "Area Banjir": layers.areaBanjir,
    "Batas Administrasi": layers.batas,
    "Sungai": layers.sungai,
    "Buffer 100m": layers.buffer100m,
    "Buffer 200m": layers.buffer200m,
    "Zona Rawan Rendah": layers.rendah,
    "Zona Rawan Sedang": layers.sedang,
    "Zona Rawan Tinggi": layers.tinggi,
    "Jalan": layers.jalan
}, { collapsed: false }).addTo(map);


// Add All Layers to Map Initially
layers.areaBanjir.addTo(map);
layers.batas.addTo(map);
layers.jalan.addTo(map);
layers.sungai.addTo(map);
layers.buffer100m.addTo(map);
layers.buffer200m.addTo(map);
layers.rendah.addTo(map);
layers.sedang.addTo(map);
layers.tinggi.addTo(map);
