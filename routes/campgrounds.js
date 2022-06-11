const express = require('express')
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

//campgrounds.index, located in controllers campgrounds, module.exports.index
router.get('/', catchAsync(campgrounds.index));

// page for inputing new data into the server
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//adding new campground to the server and displaying it on campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

//showing specific place in the list
router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;