const express = require ('express');
const router = express.Router();
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const {isLoggedIn, validateCamp, isAuthor  } = require ('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const campground = require('../models/campground');
const {storage} = require('../cloudinary')
const upload = multer({storage})


router.get ('/', catchAsync(campgrounds.index))
   
router.route('/new')
.get (isLoggedIn, campgrounds.newForm)
.post(isLoggedIn,  upload.array('campground[images]'), validateCamp, catchAsync(campgrounds.newCreate))


router.route('/:id')
.get(catchAsync(campgrounds.singleCampground))
.put(isLoggedIn, isAuthor, upload.array('campground[images]'), validateCamp, catchAsync(campgrounds.editSingleCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteSingleCampground))

   
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editSingleCampgroundForm))



module.exports = router;