const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
//router instead of app
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//the path /campgrounds/:id/rev, etc. is the url, it can be modivied; it doesn't refer to any directory or index pages
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
