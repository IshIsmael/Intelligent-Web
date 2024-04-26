// public/javascripts/map.js
document.addEventListener('DOMContentLoaded', function() {
// Map is centered on Sheffield
var mymap = L.map('mapid').setView([53.3814, -1.4884], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
}).addTo(mymap);

var marker;

function updateMarker(latitude, longitude) {
    if (marker) {
    mymap.removeLayer(marker);
    }
    marker = L.marker([latitude, longitude]).addTo(mymap);
    mymap.setView([latitude, longitude], 13);
}

mymap.on('click', function(e) {
    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;
    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;
    updateMarker(latitude, longitude);
});

const getLocationBtn = document.getElementById('getLocationBtn');
getLocationBtn.addEventListener('click', function() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
        updateMarker(latitude, longitude);
        },
        function(error) {
        console.error('Error getting location:', error);
        alert('Failed to get current location. Please manually select a location on the map.');
        }
    );
    } else {
    alert('Geolocation is not supported by your browser. Please manually select a location on the map.');
    }
});
});