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
  } catch (err) {
    console.log(err);
  }
}

async function syncPostLater() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.sync.register('sync-posts');
  } catch {
    console.log('Background Sync could not be registered!');
  }
}

syncPostLater();

const submitForm = function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const newSighting = new FormData(e.target);
  const object = {};
  newSighting.forEach(function (value, key) {
    object[key] = value;
  });

  if (navigator.onLine) {
    addToDb(newSighting);
    window.location.href = '/forum';
  } else {
    const db = sightingIndexedDB.result;

    const action = db.transaction('sightings', 'readwrite');
    const store = action.objectStore('sightings');

    let query = store.add(object);
    query.onsuccess = function (event) {
      console.log('added');
      syncPostLater();
      query.onerror = function (event) {
        console.log(event.target.errorCode); //Produces an error if one occurs
      };
    };
  }
};

function handleSuccessOne(ev) {
  console.log('Opened..'); // USED FOR TESTING
}

function handleUpgradeOne(ev) {
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
