// routes/index.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
const plantSightingController = require('../controllers/plantSighting');
const path = require('path');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Plant App' });
});

/* GET view plants page. */
router.get('/view-plants', function (req, res, next) {
  res.render('view-plants', { title: 'View Plants' });
});

/* GET create plant sighting page. */
router.get('/create', function (req, res, next) {
  res.render('create', { title: 'Add a Plant' });
});

/* GET individual plant information page. */
router.get('/plant-info/:id', plantSightingController.getPlantInfo);  

// Multer
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/uploads');
  },
  filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Post request to submit plant sighting
router.post(
  '/submit-plant-sighting',
  upload.single('image'), function(sighting){
      if(navigator.storage.estimate() > 1){
          plantSightingController.offlineSighting(sighting)
      }
      else{
          plantSightingController.createSighting
      }
    }
);


// get Forum route
router.get('/forum', 
  plantSightingController.listPlants
);

// routes.js
router.get('/edit-plant-sighting/:id', plantSightingController.getEditPlantForm);
router.post('/edit-plant-sighting/:id', plantSightingController.updatePlantSighting);


//need to implement this for the create page to be able to let the user select a plant from dbpedia from what they type into common name input field in form.
// // get for sparql query dbpedia
// router.get('/dbpedia', req, res, next);{
//   const commonName = req.query.commonName;
//   const endpoint = 'https://dbpedia.org/sparql';

//   const sparqlQuery = `
//     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//     PREFIX dbo: <http://dbpedia.org/ontology/>
//     SELECT ?name ?plant ?description ?dbpediaUri
//     WHERE {
//       ?plant rdfs:label ?name.
//       ?plant dbo:abstract ?description.
//       ?plant dbo:wikiPageID ?dbpediaUri.
//       FILTER (lang(?name) = 'en' && lang(?description) = 'en').
//       FILTER (contains(?name, "${commonName}")).
//     }
//     LIMIT 10
//   `;
//   // encode the query as a url parameter
//   const encodedQuery = encodeURIComponent(sparqlQuery);
//   const url = `${endpoint}?query=${encodedQuery}&format=json`;

//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       let plants = data.results.bindings;
//       let plantNames = JSON.stringify(plants);
//       res.render('dbpedia', { title: 'DBPedia', plantNames });
//     }
//     )
// };


module.exports = router;
