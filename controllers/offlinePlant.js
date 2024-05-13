// controllers/offlinePlant.js

exports.getPlantInfo = async (req, res) => {
    const plantID = req.params.id
    const accessDB = window.indexedDB.open('plantsDatabase')
    accessDB.onsuccess = function(ev){
        const db = plantsIndexedDB.result
        const action = db.transaction(['plants'], 'readonly') //states what action is going to happen to what objects
        const store = action.objectStore('plants')
        const index = store.index('plantID')
        const request = store.get(plantID)
        request.onsuccess = function(ev){
            const plant = ev.target.result
            console.log(plant)
            res.render('offline_plant_info', {title: 'Plant Info', plant: plant})
        }
    }
    accessDB.onerror = function(ev){
        console.log("Could not retrieve the plant")
    }
};