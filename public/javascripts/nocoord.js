// public/javascripts/nocoord.js
// prevents the sighting creation for from being submitted unless a location on the map has been picked
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('plantSightingForm');
  const mapError = document.getElementById('noCoord');

  form.addEventListener('submit', function (event) {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    // Check if the coordinates are not numbers or not set
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      event.preventDefault(); // Prevent the form from submitting
      mapError.style.display = 'block'; // Show the error message
      document
        .getElementById('map')
        .scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the map element

      document.getElementById('map').style.border = '4px solid red';
      setTimeout(() => {
        document.getElementById('map').style.border = '';
      }, 7000);
    } else {
      mapError.style.display = 'none'; // Hide the error message if coordinates are valid
    }
  });
});
