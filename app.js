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
const helmet = require('helmet')

const campgrounds = require('./routes/campgrounds');
const reviews = require ('./routes/reviews')
const users =require('./routes/user')
const dbUrl= process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const MongoDBStore = require("connect-mongo")(session);
mongoose.connect (dbUrl,{
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


const store = new MongoDBStore({
    url:dbUrl,
    secret:process.env.SECRET,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('Session Store Error',e)
})
const sessionConfig = {
    store,
    name:'CampUser',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge:1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig)) // use before passport.session 
app.use(flash())
app.use(helmet())


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwttlckdr/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



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

const port = process.env.PORT || 3000;
app.listen (port, ()=> {
    console.log(`serving on port ${port}`)
})




