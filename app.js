const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp').
    catch(error => handleError(error));

const app = express();

//ejs-mate is engine for boilerplate (creating layout file in views directory)
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//server side validation using Joi for error handling purposes
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

//necessary for parsing req.body -- app.post
app.use(express.urlencoded({ extended:true }))
//to be able to use put and patch through method
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    //.find() is used to grab the data in the server and using it on the campgrounds/index
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// page for inputing new data into the server
app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

//adding new campground to the server and displaying it on campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    // req.body.campground to grab the data, and put it into 'campground' variable
    const campground = new Campground(req.body.campground);
    //saving the new campground to the server
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//showing specific place in the list
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    //requesting the data using specific id
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

//update
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})