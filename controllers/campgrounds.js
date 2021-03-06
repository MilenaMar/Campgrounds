const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maxBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: maxBoxToken});
const {cloudinary} = require ('../cloudinary');


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});  
    res.render('campgrounds/index', {campgrounds})
   }

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
   }

module.exports.newCreate =  async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
      query: req.body.campground.location,
      limit:1
    }).send()
    const campground= new Campground(req.body.campground);
     campground.geometry= geoData.body.features[0].geometry;
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
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit:1
  }).send()
    const {id} = req.params
      const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true}); 
      campground.geometry= geoData.body.features[0].geometry;
      const imgs = req.files.map(file => ({url: file.path, filename: file.filename}) )
      campground.images.push(...imgs)
      await campground.save()
      if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
      }
      req.flash('success', 'Campground successfully updated') 
      res.redirect(`/campgrounds/${campground._id}`)
      }

module.exports.deleteSingleCampground = async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id);  
    req.flash('success', "Campground successfully deleted")
   res.redirect(`/campgrounds`);
   }