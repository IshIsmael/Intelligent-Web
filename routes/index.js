var express = require('express');
var router = express.Router();
var multer = require('multer');
const plantSightingController = require('../controllers/plantSighting');

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

/* GET view sole plant info and chat page. */
router.get('/plant-info', function (req, res, next) {
  res.render('plant-info', { title: 'Plant Information' });
});

// Multer
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    // Unique name for file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // This is the file name that will be stored
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        require('path').extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Post request to submit plant sighting
router.post(
  '/submit-plant-sighting',
  upload.single('image'),
  plantSightingController.createSighting
);

module.exports = router;
