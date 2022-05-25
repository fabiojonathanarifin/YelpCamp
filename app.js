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
const campgrounds = require('./routes/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp').
    catch(error => handleError(error));

const app = express();


//ejs-mate is engine for boilerplate (creating layout file in views directory)
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

//necessary for parsing req.body -- app.post
app.use(express.urlencoded({ extended: true }))
//to be able to use put and patch through method
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgrounds)

app.get('/', (req, res) => {
    res.render('home')
});

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//the path /campgrounds/:id/rev, etc. is the url, it can be modivied; it doesn't refer to any directory or index pages
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull is used to delete the review without deleting the entire campground. it will delete the one specifically with the given id
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    const review = await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})