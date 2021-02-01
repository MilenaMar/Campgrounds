const express = require ('express');
const router = express.Router();
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const {isLoggedIn, validateCamp, isAuthor  } = require ('../middleware')
const campgrounds = require('../controllers/campgrounds')
// route to show all the campgrounds

router.get ('/', catchAsync(campgrounds.index))
   
// route to get the form for adding a new campground
router.get ('/new', isLoggedIn, campgrounds.newForm)
   
 // route to create the new campground  
router.post('/new', isLoggedIn, validateCamp, catchAsync(campgrounds.newCreate))

// route to get all the information for a single campground 
router.get('/:id', catchAsync(campgrounds.singleCampground))
   
// route to retrive the form to edit selected campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editSingleCampgroundForm))

// route to edit selected campground
router.put('/:id', isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.editSingleCampground))

// route to delete a campground 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteSingleCampground))


module.exports = router;