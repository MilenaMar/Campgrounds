const express = require('express');
const router = express.Router({mergeParams: true});
//  campgroundSchema is not a schema it validates our data before it sends the data to mongo.
const Review = require ('../models/review');
const Campground = require('../models/campground');
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');



router.post('/', isLoggedIn, validateReview,  catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Your reviews was added")
    res.redirect(`/campgrounds/${campground._id}`)
    }))
    
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async(req, res) =>{
     const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review successfully deleted")
    res.redirect(`/campgrounds/${id}`)
    }))



module.exports= router;
    
    