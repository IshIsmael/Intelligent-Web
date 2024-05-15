if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function (reg) {
      console.log('Service Worker Registered!', reg);
    })
    .catch(function (err) {
      console.log('Service Worker registration failed: ', err);
    });
}

const firstSection = document.querySelector('.plants-section');

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async pos => {
    const url = `/closest-plants/${[
      pos.coords.longitude,
      pos.coords.latitude,
    ]}`;

    const apiCall = await fetch(url);
    const response = await apiCall.json();

    const closestPlants = response.plants;

    const html = `
    <div class="plants-section">
        <h1>Closest Plants</h1>
        <div class="entries">
        ${thisfunction(closestPlants)}
        </div>
    </div>`;

    firstSection.insertAdjacentHTML('afterend', html);
  });
}

const thisfunction = function (plants) {
  let html = '';

  plants.forEach(plant => {
    html += `
    <div class="entry">
    <img
    src="${plant.identification.photo}"
    class="card-img-top"
    alt="Plant Image"
    onclick="window.location.href = 'plant-info/${plant._id}'"
    />
    <div
    class="entry-info"
    onclick="window.location.href = 'plant-info/${plant._id}'"
    >
    <p class="entry-title">
        ${plant.identification.commonName}
    </p>
    <p>Status: ${plant.identification.confirmation} </p>
    </div>
    </div>
    `;
  });

  return html;
};
