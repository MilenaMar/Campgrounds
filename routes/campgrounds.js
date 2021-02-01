const express = require ('express');
const router = express.Router();
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const {isLoggedIn, validateCamp, isAuthor  } = require ('../middleware')
const campgrounds = require('../controllers/campgrounds')


router.get ('/', catchAsync(campgrounds.index))
   
router.route('/new')
.get (isLoggedIn, campgrounds.newForm)
.post(isLoggedIn, validateCamp, catchAsync(campgrounds.newCreate))

router.route('/:id')
.get(catchAsync(campgrounds.singleCampground))
.put(isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.editSingleCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteSingleCampground))

   
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editSingleCampgroundForm))



module.exports = router;