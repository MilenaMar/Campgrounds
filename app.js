const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');

//Joi  does data validation 
const Joi = require('joi');
// catch async makes sure we catch the error (in case there is any) and pass it into next.
const catchAsync = require ('./utilities/catchAsync');
const ExpressError = require ('./utilities/ExpressError');
const methodOverride = require ('method-override');
const Campground = require('./models/campground');

mongoose.connect ('mongodb://localhost:27017/yelp-camp',{
 useNewUrlParser:true,
 useCreateIndex:true,
 useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind,('connection error:'));
db.once('open',() => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true})) // allowed us to parse the req.body

app.use(methodOverride ('_method'))//allow express to override a method send in a form



app.get ('/', (req, res) => {
    res.render('home')
})

app.get ('/campgrounds', catchAsync(async(req, res) => {
 const campgrounds = await Campground.find({});  
 res.render('campgrounds/index', {campgrounds})
}))

app.get ('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})


app.post('/campgrounds/new', catchAsync(async (req, res, next) => {
 //   if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
 //  campgroundSchema is not a schema it validates our data before it sends the data to mongo.
 const campgroundSchema = Joi.object({
         campground: Joi.object({
         title: Joi.string().required(),
         location: Joi.string().required(),
         price: Joi.number().required().min(0),
         description : Joi.string().required(),
         image: Joi.string().required(),
     }).required()
 })
 const {error} = campgroundSchema.validate(req.body);

 if(error){
     const msg = error.details.map (el => el.message).join(',')
     throw new ExpressError(msg, 400)
 }
 const campground= new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
   
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);  
    res.render('campgrounds/show', {campground})
   }))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);  
    res.render('campgrounds/edit', {campground})
   }))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
   const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});  
   res.redirect(`/campgrounds/${campground._id}`)
   }))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id);  
   res.redirect(`/campgrounds`);
   }))

/* for every path call 404, the order is importat 
as it will only resolve if nothing has solve before */
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

   
   // next --> if error 
app.use((err, req, res, next) => {
 const {statusCode = 500}= err;
 if(!err.message) err.message = 'Oh No, Something went Wrong'
 res.status (statusCode).render('error', {err})
})

/* check if database is now working
app.get ('/campground', (req, res) => {
Campground.create({title:'my backyard numero dos', description:'my first camp'})
.then((camp)=>res.send(camp))
}) */


app.listen (3000, ()=> {
    console.log('serving on port 3000')
})