// Opening IndexedDB
const sightingIndexedDB = window.indexedDB.open('sightings');
sightingIndexedDB.addEventListener('upgradeneeded', handleUpgradeOne);
sightingIndexedDB.addEventListener('error', handleErrorOne);

async function addToDb(obj) {
  try {
    const url = '/submit-plant-sighting';
    const options = {
      method: 'POST',
      body: obj,
    };

    await fetch(url, options);
    window.location.href = '/forum';
  } catch (err) {
    console.log(err);
  }
}

async function syncPostLater() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.sync.register('sync-posts');
    window.location.href = '/forum';
  } catch {
    console.log('Background Sync could not be registered!');
  }
}

const submitForm = function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const newSighting = new FormData(e.target);
  const object = {};
  newSighting.forEach(function (value, key) {
    object[key] = value;
  });

  const db = sightingIndexedDB.result;

  const action = db.transaction('sightings', 'readwrite');
  const store = action.objectStore('sightings');

  let query = store.add(object);
  syncPostLater();
  query.onsuccess = function (event) {
    console.log('added');
    query.onerror = function (event) {
      console.log(event.target.errorCode); //Produces an error if one occurs
    };
  };
};

function handleSuccessOne(ev) {
  console.log('Opened..'); // USED FOR TESTING
}

function handleUpgradeOne(ev) {
  console.log('pokemon');
  const db = ev.target.result;
  let store = db.createObjectStore('sightings', {
    keyPath: 'id',
    autoIncrement: true,
  }); //Creates the object key
  console.log('Upgraded object store...'); // USED FOR TESTING
}

function handleErrorOne(ev) {
  console.error(`Database Error:`);
}

if (!navigator.onLine) {
  document.getElementById('dbpedia').classList.add('hidden');
}
