const express = require('express')
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
//Don't need to /index, because node is automatically looking for index file in a folder
const { storage } = require('../cloudinary')
// This store multer locally
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })

const Campground = require('../models/campground')

router.route('/')
    //campgrounds.index, located in controllers campgrounds, module.exports.index
    .get(catchAsync(campgrounds.index))
    //adding new campground to the server and displaying it on campground
    // upload.single and req.file is from multer
    //the multer upload.array run prior to the createCampground function 
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('IT WORKED?!')
// })


// page for inputing new data into the server
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    //showing specific place in the list
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;