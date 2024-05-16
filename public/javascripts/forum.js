// public/javascripts/forum.js
const sortSelect = document.getElementById('sortSelect');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const statusFilter = document.getElementById('statusFilter');

// Gets the current sort and filter values from the URL
const urlParams = new URLSearchParams(window.location.search);
const currentSort = urlParams.get('sort') || 'default';
const currentFilters = {
  hasFlowers: urlParams.get('hasFlowers') === 'true',
  hasLeaves: urlParams.get('hasLeaves') === 'true',
  hasFruitsOrSeeds: urlParams.get('hasFruitsOrSeeds') === 'true',
  confirmation: urlParams.get('confirmation') || '',
};

// Sets values of the sort select and filter checkboxes
sortSelect.value = currentSort;
document.getElementById('hasFlowersFilter').checked = currentFilters.hasFlowers;
document.getElementById('hasLeavesFilter').checked = currentFilters.hasLeaves;
document.getElementById('hasFruitsOrSeedsFilter').checked =
  currentFilters.hasFruitsOrSeeds;
statusFilter.value = currentFilters.confirmation;

sortSelect.addEventListener('change', function () {
  const selectedSort = this.value;
  const filters = getSelectedFilters();
  const url = `/forum?sort=${selectedSort}&${filters}`;
  window.location.href = url;
});

applyFiltersBtn.addEventListener('click', function () {
  const selectedSort = sortSelect.value;
  const filters = getSelectedFilters();
  const url = `/forum?sort=${selectedSort}&${filters}`;
  window.location.href = url;
});

statusFilter.addEventListener('change', function () {
  const selectedSort = sortSelect.value;
  const filters = getSelectedFilters();
  const url = `/forum?sort=${selectedSort}&${filters}`;
  window.location.href = url;
});

function getSelectedFilters() {
  const hasFlowersFilter = document.getElementById('hasFlowersFilter').checked;
  const hasLeavesFilter = document.getElementById('hasLeavesFilter').checked;
  const hasFruitsOrSeedsFilter = document.getElementById(
    'hasFruitsOrSeedsFilter'
  ).checked;
  const statusFilterValue = statusFilter.value;

  let filters = '';
  if (hasFlowersFilter) {
    filters += 'hasFlowers=true&';
  }
  if (hasLeavesFilter) {
    filters += 'hasLeaves=true&';
  }
  if (hasFruitsOrSeedsFilter) {
    filters += 'hasFruitsOrSeeds=true&';
  }
  if (statusFilterValue) {
    filters += `confirmation=${statusFilterValue}&`;
  }

  return filters.slice(0, -1);
}

const sightingIndexedDB = window.indexedDB.open('sightings');

const entries = document.querySelector('.entries');

const insertHTML = function (plants) {
  let html = '';

  plants.forEach(plant => {
    html += `
    <div class="entry">
    <img
    src="images/Logo.png"
    class="card-img-top"
    alt="Plant Image"
    onclick="window.location.href = 'plant-info/'"
    />
    <div
    class="entry-info"
    onclick="window.location.href = 'plant-info/'"
    >
    <p class="entry-title">
        ${plant.commonName}
    </p>
    <p>Status: ${plant.confirmation} </p>
    </div>
    </div>
    `;
  });

  return html;
};

sightingIndexedDB.onsuccess = event => {
  const db = event.target.result;

  const objectStore = db
    .transaction('sightings', 'readwrite')
    .objectStore('sightings');

  const request = objectStore.getAll();

  request.onsuccess = () => {
    // console.log(request.result);
    entries.insertAdjacentHTML('beforeend', insertHTML(request.result));
  };
};
