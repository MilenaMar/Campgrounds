const express = require ('express');
const router = express.Router();
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('../utilities/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, validateCamp, isAuthor  } = require ('../middleware')

// route to show all the campgrounds

router.get ('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});  
    res.render('campgrounds/index', {campgrounds})
   }))
   

// route to get the form for adding a new campground
router.get ('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
   })
   
 // route to create the new campground  
router.post('/new', isLoggedIn, validateCamp,  catchAsync(async (req, res, next) => {
    const campground= new Campground(req.body.campground);
    campground.author = req.user._id;
           await campground.save();
           req.flash('success', 'Campground created successfully')
           res.redirect(`/campgrounds/${campground._id}`)
      
   }))


   
// route to get all the information for a single route 
router.get('/:id', catchAsync(async (req, res) => {
       const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
      if(!campground){
          req.flash('error', 'The Campground you are looking for could not be found')
          return res.redirect('/campgrounds')
        }
       res.render('campgrounds/show', {campground})
      }))

      
// route to retrive the form to edit selected campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
       const campground = await Campground.findById(id);
       if(!campground){
        req.flash('error', 'The Campground you are looking for could not be found')
        return res.redirect('/campgrounds')
      }
       res.render('campgrounds/edit', {campground})
      }))


// route to edit selected campground
router.put('/:id', isLoggedIn, isAuthor, validateCamp, catchAsync(async (req, res) => {
    const {id} = req.params
      const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true}); 
      req.flash('success', 'Campground successfully updated') 
      res.redirect(`/campgrounds/${campground._id}`)
      }))


// route to delete a campground 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id);  
    req.flash('success', "Campground successfully deleted")
   res.redirect(`/campgrounds`);
   }))


module.exports = router;