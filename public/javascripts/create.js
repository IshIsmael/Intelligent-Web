// Opening IndexedDB
const sightingIndexedDB = window.indexedDB.open('sightings');
sightingIndexedDB.addEventListener('upgradeneeded', handleUpgradeOne);
sightingIndexedDB.addEventListener('error', handleErrorOne);

//Sync posts from indexedDB onto mongoDB
async function syncPostLater() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.sync.register('sync-posts');
    const thisContent = document.querySelector('.checkNickname');
    thisContent.classList.add('hidden');
    thisContent.insertAdjacentHTML(
      'afterend',
      `<section class="content"> <h1> Event Created! </h1> </section>`
    );
  } catch {
    console.log('Background Sync could not be registered!');
  }
}

//Submit plant sighting from create form to indexedDB
//  then sync to mongoDB once internet is connected
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

//Output once indexedDB is created
function handleSuccessOne(ev) {
  console.log('Opened..'); // USED FOR TESTING
}

//creates the indexedDB
function handleUpgradeOne(ev) {
  const db = ev.target.result;
  let store = db.createObjectStore('sightings', {
    keyPath: 'id',
    autoIncrement: true,
  }); //Creates the object key
  console.log('Upgraded object store...'); // USED FOR TESTING
}

//Output error message if error occurs
function handleErrorOne(ev) {
  console.error(`Database Error:`);
}

//check if navigator is online
//if not then don't allow dbPedia
if (!navigator.onLine) {
  document.getElementById('dbpedia').classList.add('hidden');
}
