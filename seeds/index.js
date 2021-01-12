//index self containt conects to mongo and my camp model
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

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


const sample = (array)=>array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<50 ; i++){
        const randomNumber = Math.floor(Math.random()*1000)
       const camp =  new Campground({
            location:`${cities[randomNumber].city},${cities[randomNumber].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}


//close connection to the database after seeded
seedDB().then(()=>{
    mongoose.connection.close();
})
