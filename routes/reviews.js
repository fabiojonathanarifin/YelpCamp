const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
//router instead of app
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    //embed user id in the review
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//the path /campgrounds/:id/rev, etc. is the url, it can be modivied; it doesn't refer to any directory or index pages
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull is used to delete the review without deleting the entire campground. it will delete the one specifically with the given id
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;