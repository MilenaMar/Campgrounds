const Campground = require('../models/campground');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});  
    res.render('campgrounds/index', {campgrounds})
   }

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
   }

module.exports.newCreate =  async (req, res, next) => {
    
    const campground= new Campground(req.body.campground);
    campground.images= req.files.map(file => ({url: file.path, filename: file.filename}) )
    campground.author = req.user._id;
           await campground.save();
           req.flash('success', 'Campground created successfully')
           res.redirect(`/campgrounds/${campground._id}`)
      
   }

module.exports.singleCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews', populate: {
      path:'author'
    }}).populate('author');
   if(!campground){
       req.flash('error', 'The Campground you are looking for could not be found')
       return res.redirect('/campgrounds')
     }
    res.render('campgrounds/show', {campground})
   }

module.exports.editSingleCampgroundForm = async (req, res) => {
    const {id} = req.params
       const campground = await Campground.findById(id);
       if(!campground){
        req.flash('error', 'The Campground you are looking for could not be found')
        return res.redirect('/campgrounds')
      }
       res.render('campgrounds/edit', {campground})
      }

module.exports.editSingleCampground = async (req, res) => {
    const {id} = req.params
      const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true}); 
      req.flash('success', 'Campground successfully updated') 
      res.redirect(`/campgrounds/${campground._id}`)
      }

module.exports.deleteSingleCampground = async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id);  
    req.flash('success', "Campground successfully deleted")
   res.redirect(`/campgrounds`);
   }