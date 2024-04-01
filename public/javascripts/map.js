document.addEventListener('DOMContentLoaded', function() {
    //map is centqred on Sheffield
    var mymap = L.map('mapid').setView([53.3814, -1.4884], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 18,
    }).addTo(mymap);
    
    var marker;

    mymap.on('click', function(e) {
        if (marker) mymap.removeLayer(marker);
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
        document.getElementById('latitude').value = e.latlng.lat;
        document.getElementById('longitude').value = e.latlng.lng;
    });
});
