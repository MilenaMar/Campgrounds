if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session = require('express-session');
const ExpressError = require ('./utilities/ExpressError');
const methodOverride = require ('method-override');
const flash = require('connect-flash') // enable notifications and messages to the user
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const campgrounds = require('./routes/campgrounds');
const reviews = require ('./routes/reviews')
const users =require('./routes/user')

mongoose.connect ('mongodb://localhost:27017/yelp-camp',{
 useNewUrlParser:true,
 useCreateIndex:true,
 useUnifiedTopology:true,
 useFindAndModify: false
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
app.use(express.static(path.join(__dirname,'public')))// telling express to serve the public directory

const sessionConfig = {
    secret: 'lazy cat!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge:1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig)) // use before passport.session 
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use( new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=> {
    res.locals.user=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

/*test if passport is working 
app.get('/fakeuser', async (req, res) => {
    const user = new User({email:'mmm2@example.com', username:'Milenam2'})
    const registerUser = await User.register(user, 'chicken')
    res.send(registerUser);
})*/

// Routes 

app.use("/", users)
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)





app.get ('/', (req, res) => {
    res.render('home')
})


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




