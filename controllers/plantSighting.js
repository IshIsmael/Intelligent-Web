// controllers/plantSighting.js
const PlantSighting = require('../models/plantSighting');
const { SparqlEndpointFetcher } = require('fetch-sparql-endpoint');
const fetcher = new SparqlEndpointFetcher();

exports.createSighting = async (req, res) => {
  try {
    console.log(req.body);

    const {
      dateSeen,
      commonName,
      description,
      userNickname,
      sunExposure,
      flowerColor,
      plantLength,
      plantHeight,
      plantSpread,
      comments,
    } = req.body;

    let comments1 = [];

    if (comments) {
      comments1 = JSON.parse(comments);
    }

    // console.log(JSON.parse(req.body.comments));

    // Sets the default status to Pending Confirmation
    let confirmation = 'Pending Confirmation';
    const knowsPlantName = req.body.knowsPlantName === 'on';
    if (knowsPlantName && commonName) {
      confirmation = 'Verified';
      await fetchDBpediaInfo(commonName);
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
        description,
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
      comments: comments1,
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

    let dbpediaInfo = {};
    if (plant.identification.confirmation === 'Verified') {
      const commonName = plant.identification.commonName;
      dbpediaInfo = await fetchDBpediaInfo(commonName);
    }

    res.render('plant-info', {
      title: 'Plant Information',
      plant,
      dbpediaInfo,
    });
  } catch (error) {
    console.error('Failed to fetch plant:', error);
    res.status(500).send('Error fetching plant from the database');
  }
};

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
    const { commonName, knowsPlantName } = req.body;

    // Set the new confirmation status based on the presence of a DBPedia URI
    let confirmation = 'Pending Confirmation';
    if (knowsPlantName === 'on' && commonName) {
      confirmation = 'Verified';
    }
    // Update the plant sighting with the new information
    const updatedPlant = await PlantSighting.findByIdAndUpdate(
      plantId,
      {
        'identification.commonName': commonName,
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

async function fetchDBpediaInfo(commonName) {
  try {
    const response = await fetch(
      `http://localhost:3000/dbpedia-plants?plant=${encodeURIComponent(
        commonName
      )}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    const results = await response.json();
    return results[0] || {};
  } catch (error) {
    console.error('Error fetching DBpedia info:', error);
    return {};
  }
}

const plantQUERY = userPlantInput => {
  return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbr: <http://dbpedia.org/resource/>
    SELECT ?uri ?label ?abstract
    WHERE {
      {
        BIND(IRI(CONCAT("http://dbpedia.org/resource/", "${userPlantInput}")) AS ?uri)
        ?uri rdfs:label ?label ;
             rdfs:comment ?abstract .
        
        FILTER(langMatches(lang(?label), "EN"))
        FILTER(langMatches(lang(?abstract), "EN"))
      }
      UNION
      {
        ?uri a dbo:Plant ;
             rdfs:label ?label ;
             rdfs:comment ?abstract .
        FILTER(REGEX(?label, "${userPlantInput}", "i"))
        FILTER(langMatches(lang(?label), "EN"))
        FILTER(langMatches(lang(?abstract), "EN"))
        FILTER(?uri != IRI(CONCAT("http://dbpedia.org/resource/", "${userPlantInput}")))
      }
    }
    LIMIT 15
  `;
};

exports.getPlantFromDBpedia = async (req, res) => {
  try {
    const userPlantInput = req.query.plant || '';
    const query = plantQUERY(userPlantInput);
    const bindData = await fetcher.fetchBindings(
      'https://dbpedia.org/sparql',
      query
    );

    const results = [];
    bindData.on('data', binding => {
      results.push({
        uri: binding.uri.value,
        label: binding.label.value,
        abstract: binding.abstract.value,
      });
    });

    bindData.on('end', () => {
      res.json(results);
    });

    bindData.on('error', error => {
      console.error('Failed to fetch plant data from DBpedia:', error);
      if (!res.headersSent) {
        res.status(500).send('Error fetching plant data from DBpedia');
      }
    });
  } catch (error) {
    console.error('Failed to fetch plant data from DBpedia:', error);
    if (!res.headersSent) {
      res.status(500).send('Error fetching plant data from DBpedia');
    }
  }
};
