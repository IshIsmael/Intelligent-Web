const PlantSighting = require('../models/plantSighting');
exports.createSighting = async (req, res) => {
    // Handles the case where no image is uploaded
    try {
        const { dateSeen, commonName, scientificName, description, dbPediaUri, status, userNickname, sunExposure, flowerColor, plantLength, plantHeight, plantSpread } = req.body;
        
        let imagePath;
        if (req.file) {
            imagePath = req.file.path;
        } else {
            // For example, set a default image path or throw an error
            imagePath = '../public/images/Logo.png'; // or set to null if your schema allows it
        }
        
        const hasFlowers = !!req.body.hasFlowers; // If checkbox is checked, req.body.hasFlowers will be true
        const hasLeaves = !!req.body.hasLeaves;
        const hasFruitsOrSeeds = !!req.body.hasFruitsOrSeeds;
        let { latitude, longitude } = req.body;
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        // Check if the coordinates are valid
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).send('Invalid coordinates.');
        }

        // Create a new PlantSighting object
        const newSighting = new PlantSighting({
            dateSeen: new Date(dateSeen),
            userNickname,
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            identification: {
                commonName,
                scientificName,
                description,
                dbPediaUri,
                photo: imagePath,
                status
            },
            plantCharacteristics: {
                hasFlowers: hasFlowers, 
                hasLeaves: hasLeaves, 
                hasFruitsOrSeeds: hasFruitsOrSeeds,
                sunExposure,
                flowerColor,
                plantLength: parseFloat(plantLength),
                plantHeight: parseFloat(plantHeight),
                plantSpread: parseFloat(plantSpread)
            }
            // Comments will be added later
        });

        await newSighting.save();
        res.send('Plant Sighting added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving plant sighting to the database');
    }
};