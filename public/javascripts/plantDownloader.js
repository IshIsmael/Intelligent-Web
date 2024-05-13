
const handleSuccess3 = (event) => {
    console.log("Opened..")// USED FOR TESTING
    window.addEventListener('online',isOnline)
    window.addEventListener('offline',isOffline)
    const applyOfflineFiltersBtn = document.getElementById('applyOfflineFiltersBtn')
    applyOfflineFiltersBtn.addEventListener('click', offlineFilters)
}

//This is what is needed to initialise the indexedDB objects in the database
const handleUpgrade3 = (ev) => {
    const db = ev.target.result
    let store = db.createObjectStore('plants', {keyPath: "id",autoIncrement : true}) //Creates the object key
    store.createIndex("commonName","identification.commonName", {unique:false})
    store.createIndex("dateSeen","dateSeen", {unique: false})
    store.createIndex("plantID","_id", {unique: true} )
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
        let pointer = store.openCursor()
        console.log("PLANT:")
        console.log(plant)
        //Pointer loops the IndexedDB list
        pointer.onsuccess = function(ev){
            //gets the current element at pointer position
            const current = ev.target.result
            //checks that the pointer is not outside the db
            if (current !== null){
                const value = current.value
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
function redirectToOfflinePlantPage(plantID){
    const selectedPlantID = encodeURIComponent(plantID)
    window.location.href = 'offline_plant_info/'+ selectedPlantID
}
//This function displays the offline posts,
// it is also responsible for implementing the link between pages

const showOfflinePosts=(plant, amountOfPlants) =>{
    const row = document.getElementById("offlineRow")
    const defaultCard = document.getElementById("offlineCard")
    defaultCard.style.display="none"
    //Copies all the elements from the template
    const plantCard = defaultCard.cloneNode()
    plantCard.style.display="flex"
    plantCard.style.flexDirection = "column"
    const imageCopy = document.getElementById("offline-image").cloneNode()
    imageCopy.style.height= "200px"
    imageCopy.style.objectFit= "cover"
    imageCopy.style.width= "225px"
    const titleCopy = document.getElementById("offline-card-title").cloneNode()
    const statusCopy = document.getElementById("offline-card-status").cloneNode()
    const offlineLinkCopy = document.getElementById("offline-view-details").cloneNode()
    titleCopy.style.margin= "20px"
    titleCopy.style.fontWeight = "bold"
    titleCopy.style.fontSize = "20px"
    statusCopy.style.padding = "15px"
    statusCopy.style.margin = "0"
    offlineLinkCopy.style.padding = "15px"
    offlineLinkCopy.style.margin = "0"
    imageCopy.removeAttribute("id") // otherwise this will be hidden as well
    imageCopy.src = plant.identification.photo
    titleCopy.removeAttribute("id")
    titleCopy.innerText = plant.identification.commonName
    statusCopy.removeAttribute("id")
    statusCopy.innerText = "Status: " + plant.identification.confirmation
    plantCard.removeAttribute("id")
    offlineLinkCopy.removeAttribute("id")
    offlineLinkCopy.innerText = "View Details"
    offlineLinkCopy.setAttribute("plant", plant._id)
    offlineLinkCopy.onclick= function() {
        var selectedPlantID = offlineLinkCopy.getAttribute("plant")
        redirectToOfflinePlantPage(selectedPlantID)
    }
    plantCard.append(imageCopy)
    plantCard.append(titleCopy)
    plantCard.append(statusCopy)
    plantCard.append(offlineLinkCopy)
    row.append(plantCard)
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
        let count = 1 //gets the length of the array
        const card = document.getElementById("offlineRow")
        const defaultMessage = document.getElementById("offlineMessage")
        if (plants.length === 0){
            card.style.display = "none" //turns the template card invisible

        } else{
            defaultMessage.innerText = ""
            card.style.display = "flex" //Turns it back to visible
            for (const plant of plants) {
                console.log(plant)
                if (plant !== null) {
                    showOfflinePosts(plant, count)
                    count++
                }
            }
        }
    })
}

//This applies the offline filters to the given array of plants
function applyOfflineFilter(plants,filterName){
    const plantsFilter = document.getElementById(filterName).checked
    if (plantsFilter === true) {
        return plants.filter(function (plant) {
            return plant.plantCharacteristics[filterName.replace("OfflineFilter", "")] === plantsFilter
        })
    } else {
        return plants
    }
}
//This checks the confirmation status of the plants and only returns the ones with that type or all
function checkConfirmation(plants){
    const statusOfflineFilter = document.getElementById('statusOfflineFilter').value
    //Checks if all was selected
    if (statusOfflineFilter === ""){
        return plants
    }{
        return plants.filter(function(plant){
            return plant.identification.confirmation === statusOfflineFilter
        })
    }
}

function showFilteredResults(filterPlants,amountOfPlants){
    var entries =  document.getElementById("offlineRow")
    var childNodes = entries.childNodes
    console.log(childNodes)
    for (var i = childNodes.length - 1; i>0; i--){
        if (childNodes[i].id === "offlineCard"){
            console.log(childNodes[i].id)
            console.log("match")
            continue
        }else {
            console.log(childNodes[i].id)
            entries.removeChild(childNodes[i])
        }
    }
    const card = document.getElementById("offlineRow")
    const defaultMessage = document.getElementById("offlineMessage")
    let count = 1//gets the length of the array
    if (amountOfPlants > 0) {
        defaultMessage.innerText = ""
        card.style.display = "flex" //Turns it back to visible
        for (const plant of filterPlants) {
            if (plant !== null) {
                console.log(count)
                showOfflinePosts(plant, count)
                if (count !== amountOfPlants ) {
                    count++
                }
            }
        }
    }else{
       defaultMessage.innerText = "There are no plants currently downloaded that fulfill those conditions"
       card.style.display = "none" //turns the template card invisible
   }
}




//This is the main function that applies the filters to the posts on the offline forum
function applyOfflineSelectedFilters(plants) {
    let filteredPlants = []
    const namesOfFilters = ["hasFlowersOfflineFilter","hasLeavesOfflineFilter"
        , "hasFruitsOrSeedsOfflineFilter"]
    for (const plant of plants) {
        if (plant !== null) {
            filteredPlants.push(plant)
        }
    }
    for (const pos in namesOfFilters) {
        filteredPlants = applyOfflineFilter(filteredPlants, namesOfFilters[pos])
    }
    filteredPlants = checkConfirmation(filteredPlants)
    var filteredPlantLength = filteredPlants.length
    showFilteredResults(filteredPlants, filteredPlantLength)
}

function offlineFilters(){
    const db = plantsIndexedDB.result
    const action = db.transaction('plants', 'readwrite') //states what action is going to happen to what objects
    const store = action.objectStore('plants')
    const sortType = document.getElementById("sortOfflineSelect").value
    console.log(sortType)
    var sortedPlants = []

    //Sort this out tomorrow
    if (sortType === "default") {
        const index = store.index("commonName")
        const allPlants = index.openCursor(null,"next")
        allPlants.onsuccess = function (ev) {
            var plants = ev.target.result
            if (plants){
                sortedPlants.push(plants.value)
                plants.continue()
            }
            console.log("Could sort alphabetically")
            console.log(sortedPlants)
            applyOfflineSelectedFilters(sortedPlants)
        }
        allPlants.onerror = function(ev){
            console.log("Could not sort alphabetically")
        }
    }
    if (sortType === "newest"){
        const index = store.index("dateSeen")
        const allPlants = index.getAll()
        allPlants.onsuccess = function (ev) {
            applyOfflineSelectedFilters(allPlants.result)
        }
    }
    if (sortType === "oldest"){
        const index = store.index("dateSeen")
        const allPlants = index.getAll()
        allPlants.onsuccess = function (ev) {
            applyOfflineSelectedFilters(allPlants.result)
        }
    }

}

const handleError3=() => {
    console.error(`Database Error:`)
}

const plantsIndexedDB = window.indexedDB.open('plantsDatabase')
plantsIndexedDB.addEventListener("upgradeneeded", handleUpgrade3)
plantsIndexedDB.addEventListener("success", handleSuccess3)
plantsIndexedDB.addEventListener("error", handleError3)