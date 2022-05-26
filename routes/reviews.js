const express = require('express');
const router = express.Router({ mergeParams: true });
const app = express();
const Campground = require('../models/campground');
const Review = require('../models/review')

const { reviewSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//the path /campgrounds/:id/rev, etc. is the url, it can be modivied; it doesn't refer to any directory or index pages
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull is used to delete the review without deleting the entire campground. it will delete the one specifically with the given id
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;








// const express = require('express');
// const router = express.Router({ mergeParams: true });

// const Campground = require('../models/campground');
// const Review = require('../models/review')

// const { reviewSchema } = require('../schemas.js')

// const ExpressError = require('../utils/ExpressError')
// const catchAsync = require('../utils/catchAsync')

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next()
//     }
// }

// app.post('/', validateReview, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id)
//     const review = new Review(req.body.review)
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// //the path /campgrounds/:id/rev, etc. is the url, it can be modivied; it doesn't refer to any directory or index pages
// app.delete("/:reviewId", catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     //$pull is used to delete the review without deleting the entire campground. it will delete the one specifically with the given id
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
//     await Review.findByIdAndDelete(reviewId)
//     res.redirect(`/campgrounds/${id}`)
// }))

// module.exports = router;