const express = require('express')
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');




router.get('/', catchAsync(async (req, res) => {
    //.find() is used to grab the data in the server and using it on the campgrounds/index
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// page for inputing new data into the server
router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

//adding new campground to the server and displaying it on campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    // req.body.campground to grab the data, and put it into 'campground' variable
    const campground = new Campground(req.body.campground);
    //inputing user id to campground
    campground.author = req.user._id;
    //saving the new campground to the server
    await campground.save();
    req.flash('success', 'Successfull made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//showing specific place in the list
router.get('/:id', catchAsync(async (req, res) => {
    //requesting the data using specific id
    const campground = await (await Campground.findById(req.params.id).populate({
        //populate reviews on campground
        path: 'reviews',
        //populate the author of each reviews
        populate: {
            path: 'author'
        }
        //separately populate author of campgrounds
    }).populate('author'));
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
}))

module.exports = router;