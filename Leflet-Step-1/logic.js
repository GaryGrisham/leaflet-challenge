// Gary's homework 
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
// create a function to choose the color based on depth 
function chooseColor(depth) {
  // if (depth >= 90){
  //   return "#f50707"
  // }
  // if (depth <= 80){
  //   return "#eb9634"
  // }
  // if (depth <= 70){
  //   return "#ebb134"
  // }
  switch (depth) {
  case depth > 90:
    return "#f50707";
  case depth <= 90:
    return "#eb9634";
  case depth <= 70:
    return "#ebb134";
  case depth <= 50:
    return "#ebd934";
  case depth <= 30:
    return "#d3eb34";
  case depth <= 10:
    return "#59eb34";
  default:
    return "#59eb34";
  }
}
function getRadius(magintuted){
  if (magintuted <= 0){
    return 2
  } 
  if (magintuted <= 1){
    return 4
  } 
  if (magintuted <= 2){
    return 6
  } 
  if (magintuted <= 3){
    return 8
  } 
  if (magintuted <= 4){
    return 10
  } 
  if (magintuted <= 5){
    return 12
  } 
  else {
    return 14
  }
}
function createFeatures(earthquakeData) {
console.log(earthquakeData)
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" +   "<br/> Place: " + feature.properties.place +
    // add your features here - look at d3 homework
   "<br/> Magnitude: " +
    feature.properties.mag +
    "<br/> Depth: " +
    feature.geometry.coordinates[2] +
    // abouve is the magintuted
      "</h3><hr><p>" +   "<br/> Time: " + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
    onEachFeature: onEachFeature,
        // Style each feature (in this case a neighborhood)
        style: function(feature) {
          return {
            color: "white",
            // Call the chooseColor function to decide which color to color our circles
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            fillOpacity: 0.5,
            weight: 1.5
          };
        },
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
// create l. createing a tile
function createMap(earthquakes) {

  // Define streetmap 
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers


  // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   Earthquakes: earthquakes
  // };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // L.control.layers(overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    // var limits = geoJSON.options.limits;
    // var colors = geoJSON.options.colors;
    // var labels = [];


    var numlist = [-10, 10, 30, 50, 70, 90]
    var colorlist = ["#59eb34", "#d3eb34", "#ebd934", "#ebb134", "#eb9634", "#f50707"]
    // Add min & max
    // var legendInfo = "<h1>Earthquake Depth</h1>" +
    //   "<div class=\"labels\">" +
    //     "<div class=\"min\">" + limits[0] + "</div>" +
    //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //   "</div>";

    // div.innerHTML = legendInfo;

    // limits.forEach(function(limit, index) {
    //   labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    // });
    for (var i=0; i<numlist.length; i=i+1){
      console.log(i)
      div.innerHTML += "<li style='background: " + colorlist[i] + "'></li> " 
      + numlist[i] + (numlist[i + 1] ? "&ndash;" + numlist[i + 1] + "<br>" : "+");

    }
    return div; 
    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    // return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
};
// activite 4 day 2 for legend.  