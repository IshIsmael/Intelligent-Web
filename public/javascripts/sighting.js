//const PlantSighting = require('../../models/plantSighting');
const handleSuccessOne = (event) => {
    console.log("Opened..")// USED FOR TESTING

    document.getElementById("addSighting").addEventListener("click", submitSighting)
}

const handleUpgradeOne = (ev) => {
    const db = ev.target.result
    let store = db.createObjectStore('sightings', {keyPath: "id", autoIncrement: true}) //Creates the object key
    console.log("Upgraded object store...") // USED FOR TESTING
}

const handleErrorOne=() => {
    console.error(`Database Error:`)
}

function submitSighting (){
    const db = sightingIndexedDB.result
    let nickName = document.getElementById('userNickname').value
    let commonName = document.getElementById('commonName').value
    let scientificName = document.getElementById('scientificName').value
    let plantDescription = document.getElementById('description').value
    let plantLength = document.getElementById('plantLength').value
    let plantHeight = document.getElementById('plantHeight').value
    let dateFound = document.getElementById('dateSeen').value
    let fruitOrSeeds = document.getElementById('hasFruitsOrSeeds').value
    let hasFlowers = document.getElementById('hasFlowers').value
    let hasLeaves = document.getElementById('hasLeaves').value
    let dbPedia = document.getElementById('dbPediaUri').value
    let plantColour = document.getElementById('flowerColor').value
    let plantSpread = document.getElementById('plantSpread').value
    let sunExposure = document.getElementById('sunExposure').value


    const action = db.transaction('sightings', 'readwrite')
    const store = action.objectStore('sightings')
    queryData = {nickname: nickName,
        commonname: commonName,
        scientificname: scientificName,
        description: plantDescription,
        length: plantLength,
        height: plantHeight,
        datefound: dateFound,
        hasflowers: hasFlowers,
        fruitorseeds: fruitOrSeeds,
        hasleaves: hasLeaves,
        dbpedia: dbPedia,
        colour: plantColour,
        exposure: sunExposure,
        spread: plantSpread
    }
    let query = store.add(queryData)
    query.onsuccess = function (event) {
        console.log("added")
        query.onerror = function (event) {
            console.log(event.target.errorCode) //Produces an error if one occurs
        }
    }
}
//

const sightingIndexedDB = window.indexedDB.open("Sightings")
sightingIndexedDB.addEventListener("upgradeneeded", handleUpgradeOne)
sightingIndexedDB.addEventListener("success", handleSuccessOne)
sightingIndexedDB.addEventListener("error", handleErrorOne)
function nowOnline(){
    console.log('window is online')

    const db = sightingIndexedDB.result
    const objectStore = db.transaction('sightings', 'readwrite').objectStore('sightings')
    objectStore.openCursor().onsuccess = async (event) => {
        const cursor = event.target.result
        if (cursor) {
            console.log(cursor)

            let newSighting = {
                dateSeen: new Date(cursor.value.datefound),
                userNickname: cursor.value.nickname,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat('0.0'), parseFloat('0.0')],
                },
                identification: {
                    commonName: cursor.value.commonName,
                    scientificName: cursor.value.scientificName,
                    description: cursor.value.description,
                    dbPediaUri: cursor.value.dbpedia,
                    confirmation: 'Pending Confirmation',
                },
                plantCharacteristics: {
                    hasFlowers: cursor.value.hasflowers,
                    hsaLeaves: cursor.value.hasleaves,
                    hasFruitsOrSeeds: cursor.value.hasFruitsOrSeeds,
                    sunExposure: cursor.value.sunExposure,
                    flowerColor: cursor.value.flowerColor,
                    plantLength: cursor.value.length,
                    plantHeight: cursor.value.height,
                    plantSpread: cursor.value.spread,
                }
            }
            console.log(newSighting)
            await newSighting.save();

            console.log('saved')

            objectStore.delete(cursor.key)
            cursor.continue()
        } else {
            console.log('no more sightings')
        }
    }

}
window.addEventListener('online', nowOnline)