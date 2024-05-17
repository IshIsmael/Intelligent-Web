// public/javascripts/map.js
// Map is centered on Sheffield
const map = L.map('map').setView([53.3814, -1.4884], 13);
//Create map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 18,
}).addTo(map);

let marker;

//display the map marker where it was clicked
function updateMarker(latitude, longitude) {
  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([latitude, longitude]).addTo(map);
}

// return coordinate values from click on the map of create page
map.on('click', function (e) {
  const latitude = e.latlng.lat;
  const longitude = e.latlng.lng;
  document.getElementById('latitude').value = latitude;
  document.getElementById('longitude').value = longitude;
  updateMarker(latitude, longitude);
});

// Return coordinate values using geolocation
const getLocationBtn = document.getElementById('getLocationBtn');
getLocationBtn.addEventListener('click', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
        updateMarker(latitude, longitude);
        map.setView([latitude, longitude], 13);
      },
      function (error) {
        console.error('Error getting location:', error);
        alert(
          'Failed to get current location. Please manually select a location on the map.'
        );
      }
    );
  } else {
    alert(
      'Geolocation is not supported by your browser. Please manually select a location on the map.'
    );
  }
});
