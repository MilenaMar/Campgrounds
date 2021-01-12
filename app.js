const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//const Campground = require('./models/campground')

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


app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname,'views'))


app.get ('/', (req, res) => {
    res.render('home')
})

/* check if database is now working
app.get ('/campground', (req, res) => {
Campground.create({title:'my backyard numero dos', description:'my first camp'})
.then((camp)=>res.send(camp))
}) */


app.listen (3000, ()=> {
    console.log('serving on port 3000')
})