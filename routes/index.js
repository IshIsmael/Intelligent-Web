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
  upload.single('image'),
  plantSightingController.createSighting
);

// get Forum route
router.get('/forum', 
  plantSightingController.listPlants
);

// routes.js
router.get('/edit-plant-sighting/:id', plantSightingController.getEditPlantForm);
// Post to edit plant sighting
router.post('/edit-plant-sighting/:id', plantSightingController.updatePlantSighting);


module.exports = router;
