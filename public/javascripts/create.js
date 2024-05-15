// Opening IndexedDB
const sightingIndexedDB = window.indexedDB.open('sightings');
sightingIndexedDB.addEventListener('success', handleSuccessOne);
sightingIndexedDB.addEventListener('upgradeneeded', handleUpgradeOne);
sightingIndexedDB.addEventListener('error', handleErrorOne);

async function addToDb(obj) {
  try {
    const url = '/submit-plant-sighting';
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(obj),
    };

    await fetch(url, options);
  } catch (err) {
    console.log(err);
  }
}

const submitForm = function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const newSighting = new FormData(e.target);
  const sightingObj = {};
  newSighting.forEach((value, key) => (sightingObj[key] = value));

  if (navigator.onLine) {
    addToDb(sightingObj);
    window.location.href = '/forum';
  } else {
    const db = sightingIndexedDB.result;

    const action = db.transaction('sightings', 'readwrite');
    const store = action.objectStore('sightings');

    let query = store.add(sightingObj);
    query.onsuccess = function (event) {
      console.log('added');
      query.onerror = function (event) {
        console.log(event.target.errorCode); //Produces an error if one occurs
      };
    };
  }
};

window.addEventListener('online', syncIndexToMongo);

function syncIndexToMongo() {
  const db = sightingIndexedDB.result;
  const objectStore = db
    .transaction('sightings', 'readwrite')
    .objectStore('sightings')
    .getAll();

  objectStore.onsuccess = () => {
    addToDb(objectStore.result[0]);
  };
}

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
