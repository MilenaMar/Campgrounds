const express = require('express');
const router = express.Router({mergeParams: true});
//  campgroundSchema is not a schema it validates our data before it sends the data to mongo.
const Review = require ('../models/review');
const Campground = require('../models/campground');
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require ('../controllers/reviews')


router.post('/', isLoggedIn, validateReview,  catchAsync(reviews.addNewReview))
    
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))



module.exports= router;
    
    