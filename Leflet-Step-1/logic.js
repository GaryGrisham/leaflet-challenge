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

function getRadius(magnitude){
  if (magnitude <= 0){
    return 2
  } 
  if (magnitude <= 1){
    return 4
  } 
  if (magnitude <= 2){
    return 6
  } 
  if (magnitude <= 3){
    return 8
  } 
  if (magnitude <= 4){
    return 10
  } 
  if (magnitude <= 5){
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
    // above is the magnitude
      "</h3><hr><p>" +   "<br/> Time: " + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
    onEachFeature: onEachFeature,
        // Style each feature 
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



  // Create our map, giving it the earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");


    var numlist = [-10, 10, 30, 50, 70, 90]
    var colorlist = ["#59eb34", "#d3eb34", "#ebd934", "#ebb134", "#eb9634", "#f50707"]

    for (var i=0; i<numlist.length; i=i+1){
      console.log(i)
      div.innerHTML += "<li style='background: " + colorlist[i] + "'></li> " 
      + numlist[i] + (numlist[i + 1] ? "&ndash;" + numlist[i + 1] + "<br>" : "+");

    }
    return div; 

  };

  // Adding legend to the map
  legend.addTo(myMap);
};
