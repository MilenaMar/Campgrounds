const express = require('express');
const router = express.Router({mergeParams: true});
//  campgroundSchema is not a schema it validates our data before it sends the data to mongo.
const { reviewSchema} = require('../schemasMiddleware');
const Review = require ('../models/review');
const Campground = require('../models/campground');
const ExpressError = require ('../utilities/ExpressError');
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');


//Midleware for reviews 

const validateReview = (req, res, next) => {
    const {error}= reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError (msg, 400)
    } else {
        next ();
    }
    }

router.post('/', validateReview, catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Your reviews was added")
    res.redirect(`/campgrounds/${campground._id}`)
    }))
    
router.delete('/:reviewId', catchAsync(async(req, res) =>{
     const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review successfully deleted")
    res.redirect(`/campgrounds/${id}`)
    }))



module.exports= router;
    
    