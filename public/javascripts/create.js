const sightingIndexedDB = window.indexedDB.open('sightings');
sightingIndexedDB.addEventListener('upgradeneeded', handleUpgradeOne);
sightingIndexedDB.addEventListener('success', handleSuccessOne);
sightingIndexedDB.addEventListener('error', handleErrorOne);

const submitForm = function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const formdata = new FormData(e.target);

  var object = {};
  formdata.forEach((value, key) => (object[key] = value));
  // var json = JSON.stringify(object);

  const db = sightingIndexedDB.result;
  // let nickName = document.getElementById('userNickname').value;
  // let commonName = document.getElementById('commonName').value;
  // let scientificName = document.getElementById('scientificName').value;
  // let plantDescription = document.getElementById('description').value;
  // let plantLength = document.getElementById('plantLength').value;
  // let plantHeight = document.getElementById('plantHeight').value;
  // let dateFound = document.getElementById('dateSeen').value;
  // let fruitOrSeeds = document.getElementById('hasFruitsOrSeeds').value;
  // let hasFlowers = document.getElementById('hasFlowers').value;
  // let hasLeaves = document.getElementById('hasLeaves').value;
  // let dbPedia = document.getElementById('dbPediaUri').value;
  // let plantColour = document.getElementById('flowerColor').value;
  // let plantSpread = document.getElementById('plantSpread').value;
  // let sunExposure = document.getElementById('sunExposure').value;

  const action = db.transaction('sightings', 'readwrite');
  const store = action.objectStore('sightings');
  // let queryData = {
  //   nickname: nickName,
  //   commonname: commonName,
  //   scientificname: scientificName,
  //   description: plantDescription,
  //   length: plantLength,
  //   height: plantHeight,
  //   datefound: dateFound,
  //   hasflowers: hasFlowers,
  //   fruitorseeds: fruitOrSeeds,
  //   hasleaves: hasLeaves,
  //   dbpedia: dbPedia,
  //   colour: plantColour,
  //   exposure: sunExposure,
  //   spread: plantSpread,
  // };
  let query = store.add(object);
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

function nowOnline() {
  console.log('window is online');

  const db = sightingIndexedDB.result;
  const objectStore = db
    .transaction('sightings', 'readwrite')
    .objectStore('sightings')
    .getAll();

  console.log(objectStore);

  // objectStore.openCursor().onsuccess = async event => {
  //   const cursor = event.target.result;
  //   if (cursor) {
  //     console.log(cursor);
  //     let newSighting = {
  //       dateSeen: new Date(cursor.value.datefound),
  //       userNickname: cursor.value.nickname,
  //       location: {
  //         type: 'Point',
  //         coordinates: [parseFloat('0.0'), parseFloat('0.0')],
  //       },
  //       identification: {
  //         commonName: cursor.value.commonName,
  //         scientificName: cursor.value.scientificName,
  //         description: cursor.value.description,
  //         dbPediaUri: cursor.value.dbpedia,
  //         confirmation: 'Pending Confirmation',
  //       },
  //       plantCharacteristics: {
  //         hasFlowers: cursor.value.hasflowers,
  //         hsaLeaves: cursor.value.hasleaves,
  //         hasFruitsOrSeeds: cursor.value.hasFruitsOrSeeds,
  //         sunExposure: 'full sun',
  //         flowerColor: 'kjn',
  //         plantLength: 1,
  //         plantHeight: 1,
  //         plantSpread: 1,
  //       },
  //     };

  //     console.log(newSighting);

  objectStore.onsuccess = () => {
    addToDb(objectStore.result[0]);
    // console.log(objectStore.result[0]);
  };

  // addToDb(objectStore.result[1]);

  //     // objectStore.delete(cursor.key);
  //     cursor.continue();
  //   } else {
  //     console.log('no more sightings');
  //   }
  // };
}

window.addEventListener('online', nowOnline);

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
