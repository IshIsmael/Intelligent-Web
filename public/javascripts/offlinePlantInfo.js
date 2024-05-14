
const urlParams = new URLSearchParams(window.location.search);
const currentParams = urlParams.get('Plant')
const Plant = decodeURIComponent(currentParams)
const handleSuccess4 = (event) => {
    console.log("Opened..")// USED FOR TESTING
    window.addEventListener('offline',isOffline)
}

const handleUpgrade4 = (ev) => {
    const db = ev.target.result
    let store = db.createObjectStore('plants', {keyPath: "id",autoIncrement : true}) //Creates the object key
    store.createIndex("commonName","identification.commonName", {unique:false})
    store.createIndex("dateSeen","dateSeen", {unique: false})
    store.createIndex("plantID","_id", {unique: true} )
    console.log("Upgraded object store...") // USED FOR TESTING
}
const handleError4=() => {
    console.error(`Database Error:`)
}

function isOffline(){
    const db = plantsIndexedDB.result
    const action = db.transaction('plants', 'readwrite') //states what action is going to happen to what objects
    const store = action.objectStore('plants')
    const plant = document.getElementById("SelectedPlant").value
    document.getElementById('populateWithCommonName').innerText = plant.identification.commonName
}
const plantsIndexedDB = window.indexedDB.open('plantsDatabase')
plantsIndexedDB.addEventListener("upgradeneeded", handleUpgrade4)
plantsIndexedDB.addEventListener("success", handleSuccess4)
plantsIndexedDB.addEventListener("error", handleError4)