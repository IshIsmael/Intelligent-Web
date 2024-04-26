// public/javascripts/nocoord.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('plantSightingForm');
    const mapError = document.getElementById('noCoord');
  
    form.addEventListener('submit', function(event) {
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;
  
      // Check if the coordinates are not numbers or not set
      if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        event.preventDefault(); // Prevent the form from submitting
        mapError.style.display = 'block'; // Show the error message
        document.getElementById('mapid').scrollIntoView({behavior: 'smooth', block: 'start'}); // Scroll to the map element
  
        document.getElementById('mapid').style.border = '4px solid red';
        setTimeout(() => {
          document.getElementById('mapid').style.border = '';
        }, 7000);
      } else {
        mapError.style.display = 'none'; // Hide the error message if coordinates are valid
      }
    });
  });