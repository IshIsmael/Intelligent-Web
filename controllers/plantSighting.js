// controllers/plantSighting.js
const PlantSighting = require('../models/plantSighting');

exports.createSighting = async (req, res) => {
  try {
    console.log(req.body);

    const {
      dateSeen,
      commonName,
      scientificName,
      description,
      dbPediaUri,
      userNickname,
      sunExposure,
      flowerColor,
      plantLength,
      plantHeight,
      plantSpread,
    } = req.body;

    // Sets the default status to Pending Confirmation
    let confirmation = 'Pending Confirmation';

    // If a DBPedia URI is provided it is autmoatically verified
    if (dbPediaUri) {
      confirmation = 'Verified';
    }
    // default for no image uploaded, else image uploaded name added to image path
    //fixes issue with image not being retrieved from the databse
    let imagePath = 'images/Logo.png';
    if (req.file) {
      imagePath = 'images/uploads/' + req.file.filename;
    }

    const hasFlowers = !!req.body.hasFlowers;
    const hasLeaves = !!req.body.hasLeaves;
    const hasFruitsOrSeeds = !!req.body.hasFruitsOrSeeds;
    let { latitude, longitude } = req.body;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    // Create a new PlantSighting object
    const newSighting = new PlantSighting({
      dateSeen: new Date(dateSeen),
      userNickname,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      identification: {
        commonName,
        scientificName,
        description,
        dbPediaUri,
        photo: imagePath,
        confirmation,
      },
      plantCharacteristics: {
        hasFlowers: hasFlowers,
        hasLeaves: hasLeaves,
        hasFruitsOrSeeds: hasFruitsOrSeeds,
        sunExposure,
        flowerColor,
        plantLength: parseFloat(plantLength),
        plantHeight: parseFloat(plantHeight),
        plantSpread: parseFloat(plantSpread),
      },
      // Comments will be added later
    });

    await newSighting.save();
    res.redirect('forum'); // later will add option to choose forum or plant info page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving plant sighting to the database');
  }
};

exports.listPlants = async (req, res) => {
  let query = {};
  let sortOption = {};
  // Filtering and Sorting logic
  switch (req.query.sort) {
    case 'newest':
      sortOption = { dateSeen: -1 };
      break;
    case 'oldest':
      sortOption = { dateSeen: 1 };
      break;
    default:
      sortOption = { 'identification.commonName': 1 };
      break;
  }

  if (req.query.hasFlowers === 'true') {
    query['plantCharacteristics.hasFlowers'] = true;
  }
  if (req.query.hasLeaves === 'true') {
    query['plantCharacteristics.hasLeaves'] = true;
  }
  if (req.query.hasFruitsOrSeeds === 'true') {
    query['plantCharacteristics.hasFruitsOrSeeds'] = true;
  }
  if (req.query.confirmation) {
    query['identification.confirmation'] = req.query.confirmation;
  }

  try {
    const plants = await PlantSighting.find(query).sort(sortOption);
    res.render('forum', { title: 'Forum', plants });
  } catch (error) {
    console.error('Failed to fetch plants:', error);
    res.status(500).send('Error fetching plants from the database');
  }
};

exports.getPlantInfo = async (req, res) => {
  try {
    const plantId = req.params.id;
    const plant = await PlantSighting.findById(plantId);
    if (!plant) {
      return res.status(404).send('Plant not found');
    }
    res.render('plant-info', { title: 'Plant Information', plant });
  } catch (error) {
    console.error('Failed to fetch plant:', error);
    res.status(500).send('Error fetching plant from the database');
  }
};
// controllers/plantSighting.js
exports.getEditPlantForm = async (req, res) => {
  try {
    const plantId = req.params.id;
    const plant = await PlantSighting.findById(plantId);

    if (!plant) {
      return res.status(404).send('Plant not found');
    }

    res.render('edit-plant', { plant });
  } catch (error) {
    console.error('Failed to fetch plant:', error);
    res.status(500).send('Error fetching plant from the database');
  }
};

exports.updatePlantSighting = async (req, res) => {
  try {
    const plantId = req.params.id;
    const { commonName, scientificName, description, dbPediaUri } = req.body;

    // Set the new confirmation status based on the presence of a DBPedia URI
    let confirmation = 'Pending Verification';
    if (dbPediaUri) {
      confirmation = 'Verified';
    }
    // Update the plant sighting with the new information
    const updatedPlant = await PlantSighting.findByIdAndUpdate(
      plantId,
      {
        'identification.commonName': commonName,
        'identification.scientificName': scientificName,
        'identification.description': description,
        'identification.dbPediaUri': dbPediaUri,
        'identification.confirmation': confirmation,
      },
      { new: true }
    );
    // If the plant is not found, return a 404 error
    if (!updatedPlant) {
      return res.status(404).send('Plant not found');
    }
    // Redirect to the plant info page
    res.redirect(`/plant-info/${updatedPlant._id}`);
  } catch (error) {
    console.error('Failed to update plant:', error);
    res.status(500).send('Error updating plant in the database');
  }
};

exports.newMessage = async (req, res) => {
  try {
    const { id, ...messageObj } = req.body;

    await PlantSighting.findByIdAndUpdate(id, {
      $push: { comments: messageObj },
    });

    res.status(200).send('Message added to database');
  } catch (err) {
    res.status(500).send('An error occured');
  }
};

exports.homePagePlants = async (req, res, next) => {
  try {
    const plants = await PlantSighting.find().sort({ dateSeen: -1 }).limit(3);

    req.plants = plants;
    next();
  } catch (error) {
    res.status(500).send('An error occured');
    next();
  }
};

exports.closestPlants = async (req, res) => {
  try {
    const coordinates = req.params.location.split(',').map(value => +value);
    console.log(coordinates);

    const plants = await PlantSighting.find({
      location: { $near: { $geometry: { type: 'Point', coordinates } } },
    }).limit(3);

    res.status(200).json({
      status: 'success',
      plants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occured');
  }
};
