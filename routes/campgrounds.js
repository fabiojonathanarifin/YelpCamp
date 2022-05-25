const express = require('express')
const router = express.Router();
const { campgroundSchema } = require('../schemas.js')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');

//server side validation using Joi for error handling purposes
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    //.find() is used to grab the data in the server and using it on the campgrounds/index
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// page for inputing new data into the server
router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

//adding new campground to the server and displaying it on campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    // req.body.campground to grab the data, and put it into 'campground' variable
    const campground = new Campground(req.body.campground);
    //saving the new campground to the server
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//showing specific place in the list
router.get('/:id', catchAsync(async (req, res) => {
    //requesting the data using specific id
    const campground = await Campground.findById(req.params.id).populate('reviews')
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

//update
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router;