// Save earthquake API URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET for earthquake data
d3.json(queryUrl).then(function(data) {

    // Store relevant variables for map construction
    var longitude = data.features.map(d => d.geometry.coordinates[0])
    var latitude = data.features.map(d => d.geometry.coordinates[1])
    var magnitude = data.features.map(d => d.properties.mag)
    var place = data.features.map(d => d.properties.place)

    // Generate map and tiles
    var myMap = L.map("map", {
        center: [61.21, -149.90],
        zoom: 4
    });
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: "pk.eyJ1IjoibG9yZW56YWN1bG90dGEiLCJhIjoiY2tidmdhY2xhMDIzNjJ1bzZjMnl4cTU2ZyJ9.wIHvLZvxF0eQbPLiAtqsng"
    }).addTo(myMap);

    // Create marker - sizes and colors
    for (var i = 0; i< place.length; i++) {

        // Designate circle colors
        var colorScale = ""
    
        if (magnitude[i] > 4.0) {
            colorScale = "#3C1642"
        }
    
        else if (magnitude[i] >3.0) {
            colorScale = "#2F3070"
        }
    
        else if(magnitude[i] > 2.0) {
            colorScale = "#086375"
        }
    
        else if (magnitude[i] > 1.0) {
            colorScale =  "#1DD3B0"
        }
    
        else {
            colorScale = "#AFFC41"
        }
    
        // Create circle markers and pop-up text
        L.circle([latitude[i], longitude[i]], {
            color: "black",
            fillColor: colorScale,
            fillOpacity: 0.7,
            weight: 0.5,
            radius: magnitude[i]*10000
        }).bindPopup("<h2>" + place[i] + "</h2><hr><ul><li>Magnitude: " + magnitude[i] + "</li>" ).addTo(myMap)
    }

    // Set up the legend
    var legend = L.control({position: 'bottomleft'});
    var size = [0,1,2,3,4]

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = size,
        colors = ["#AFFC41","#1DD3B0","#086375","#2F3070","#3C1642"];

        // Loop through our intervals and generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<div class='legend-map' style='background: " + colors[i] + "'> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+" + "</div>");
        }
        
        return div;
    };

    legend.addTo(myMap);

});