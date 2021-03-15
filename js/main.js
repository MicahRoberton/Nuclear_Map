// 1. Create a map object.
var mymap = L.map('map', {
    center: [40.7511, -90.7401],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});


// 2. Add a base map.
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var nukes = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Set2').mode('lch').colors(10);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 13; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 300px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
nukes= L.geoJson.ajax("assets/nukes.geojson", {
  // assign a function to the onEachFeature parameter of the cellTowers object.
  // Then each (point) feature will bind a popup window.
  // The content of the popup window is the value of `feature.properties.company`
  onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.name);
  },


  pointToLayer: function (feature, latlng) {
        var id = 0;

        if (feature.properties.medium == "Air") {
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane'})});
        } else if (feature.properties.medium == "Underground") {
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-arrow-down'})});
        } else { // "N"
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-ship'})});
        }
    },

    attribution: 'Data accessed and cleaned by Thomas Drabing at https://data.world/tdreabing/nuclear-weapon-explosions | Base Map &copy; CartoDB | Made By Micah Roberton'
}).addTo(mymap);

nukes.addTo(mymap);

function popup(feature) {
    return feature.properties.name;
}

marker.on('mouseover', function(e) {
  //open popup;
  var popup = L.popup()
   .setLatLng(e.latlng)
   .setContent('popup')
   .openOn(map);
});

// 6. Set function for color ramp
colors = chroma.scale(['#ffff00','#ff0000'])
    .mode('lch').colors(6)

function setColor(lat_lng, max_yield) {
    var id = 0;
    if (max_yield > 36,140) { id = 4; }
    else if (max_yield > 27,300 && max_yield <= 36,140) { id = 3; }
    else if (max_yield > 18,200 && max_yield <= 27,300) { id = 2; }
    else if (max_yield > 9,100 &&  max_yield <= 18,200) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return L.marker{
        fillColor: setColor(feature.properties.max_yield),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#ffff00',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create counties variable, and assign null to it.


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># Max Yield</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 61+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 46-60 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 12-45 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 3-11 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-2 </p>';
    div.innerHTML += '<hr><b>Bomb Location Medium<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Air </p>';
    div.innerHTML += '<i class="fa fa-ship marker-color-2"></i><p> Water </p>';
    div.innerHTML += '<i class="fa fa-arrow-down marker-color-2"></i><p> Buried </p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
