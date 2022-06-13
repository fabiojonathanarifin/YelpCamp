const express = require('express')
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    //campgrounds.index, located in controllers campgrounds, module.exports.index
    .get(catchAsync(campgrounds.index))
    //adding new campground to the server and displaying it on campground
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    // upload.single and req.file is from multer
    .post(upload.single('image'), (req, res) => {
        res.send(req.body, req.file)
    })

// page for inputing new data into the server
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    //showing specific place in the list
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;