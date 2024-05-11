

const handleSuccess3 = (event) => {
    console.log("Opened..")// USED FOR TESTING
    window.addEventListener('online',isOnline)
    window.addEventListener('offline',isOffline)
}

//This is what is needed to initialise the indexedDB objects in the database
const handleUpgrade3 = (ev) => {
    const db = ev.target.result
    let store = db.createObjectStore('plants', {keyPath: "id",autoIncrement : true}) //Creates the object key
    console.log("Upgraded object store...") // USED FOR TESTING
}

//This function checks if the plant's id is already in the indexedDB
//Returns a promise which is either "Already in DB" or undefined
//undefined being that is not in the database
function checkIfAlreadyDownloaded(plant){
    return new Promise((resolve,reject) =>{
        const db = plantsIndexedDB.result
        //states what action is going to happen to what objects
        const action = db.transaction('plants', 'readonly')
        const store = action.objectStore('plants')
        var pointer = store.openCursor()
        console.log("PLANT:")
        console.log(plant)
        //Pointer loops the IndexedDB list
        pointer.onsuccess = function(ev){
            //gets the current element at pointer position
            var current = ev.target.result
            //checks that the pointer is not outside the db
            if (current !== null){
                var value = current.value
                // checks if plant is already in db
                if (value._id === plant._id){
                    resolve("Already in DB")
                    // stops searching through the db
                    //checkChat(value,plant)
                    action.abort()
                } else {
                    // checks if the action was aborted
                    if (!action.target) {
                        // continues the search
                        current.continue()
                    }
                }
            } else {
                // returns undefined if not in db
                reject(undefined)
            }
        }
    })
}

//Does as the name implies, it adds a nickname to the data
function downloadPlant(plant) {
    checkIfAlreadyDownloaded(plant).then((matched) => {
        //sends a message to console to indicate that it was already in db
        console.log(matched)
    }).catch((undefined) => {
        //Adds the plant to indexedDB if not found in db
        const db = plantsIndexedDB.result
        const action = db.transaction('plants', 'readwrite') //states what action is going to happen to what objects
        const store = action.objectStore('plants')
        let query = store.add(plant) //adds the plants to it
        query.onsuccess = function (event) {
            query.onerror = function (event) {
                console.log(event.target.errorCode) //Produces an error if one occurs
            }
        }
    })
}
//This function displays the offline posts
const showOfflinePosts=(plant, amountOfPlants) =>{
    const row = document.getElementById("offlineRow")
    if (amountOfPlants > 1) {
        //Copies all the elements from the template
        const plantCard = document.getElementById("offlineCard").cloneNode()
        const imageCopy = document.getElementById("offline-image").cloneNode()
        const titleCopy = document.getElementById("offline-card-title").cloneNode()
        const statusCopy = document.getElementById("offline-card-status").cloneNode()
        imageCopy.removeAttribute("id") // otherwise this will be hidden as well
        imageCopy.src = plant.identification.photo
        imageCopy.setAttribute("plant-image-id", plant.id)
        titleCopy.removeAttribute("id")
        titleCopy.innerText = plant.identification.commonName
        titleCopy.setAttribute("plant-text-id", plant.id)
        statusCopy.removeAttribute("id")
        statusCopy.innerText = "Status: " + plant.identification.confirmation
        statusCopy.setAttribute("plant-status-id", plant.id)
        plantCard.removeAttribute("id")
        plantCard.setAttribute("plant-card-id", plant.id)
        plantCard.append(imageCopy)
        plantCard.append(titleCopy)
        plantCard.append(statusCopy)
        row.append(plantCard)
    } else {
        //Uses the template
        const plantCard = document.getElementById("offlineCard")
        const image = document.getElementById("offline-image")
        const title = document.getElementById("offline-card-title")
        const status = document.getElementById("offline-card-status")
        image.removeAttribute("id") // otherwise this will be hidden as well
        title.removeAttribute("id")
        image.src = plant.identification.photo
        image.setAttribute("plant-image-id", plant.id)
        title.removeAttribute("id")
        title.innerText = plant.identification.commonName
        title.setAttribute("plant-text-id", plant.id)
        status.removeAttribute("id")
        status.innerText = "Status: " +  plant.identification.confirmation
        status.setAttribute("plant-status-id", plant.id)
        plantCard.removeAttribute("id")
        plantCard.setAttribute("plant-card-id", plant.id)
        plantCard.append(image)
        plantCard.append(title)
        plantCard.append(status)
    }
}

//This is the function turns it back to its online counterpart
function isOnline(){
    document.getElementById('offlineStatus').style.display = "none";
    document.getElementById('onlineStatus').style.display = "block" ;
}

//This is the function that changes the forum post display to its offline counterpart
function isOffline(){
    document.getElementById('offlineStatus').style.display = "block";
    document.getElementById('onlineStatus').style.display = "none" ;
    const db = plantsIndexedDB.result
    const action = db.transaction('plants', 'readwrite') //states what action is going to happen to what objects
    const store = action.objectStore('plants')
    const getAllRequest = store.getAll()
    getAllRequest.addEventListener("success", () => {
        const plants = getAllRequest.result // Now an array
        var amountOfEntries = plants.length //gets the length of the array
        const card = document.getElementById("offlineRow")
        const defaultMessage = document.getElementById("offlineMessage")
        if (plants.length === 0){
            card.style.display = "none" //turns the template card invisible

        } else{
            defaultMessage.innerText = ""
            card.style.display = "flex" //Turns it back to visible
            for (const plant of plants) {
                if (plant !== null) {
                    showOfflinePosts(plant, amountOfEntries)
                    amountOfEntries--
                }
            }
        }
    })


}

const handleError3=() => {
    console.error(`Database Error:`)
}

const plantsIndexedDB = window.indexedDB.open('plantsDatabase')
plantsIndexedDB.addEventListener("upgradeneeded", handleUpgrade3)
plantsIndexedDB.addEventListener("success", handleSuccess3)
plantsIndexedDB.addEventListener("error", handleError3)