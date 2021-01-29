/*Middleware : function that runs between the request and response lifecycle 
each middleware has acces to the request and response object and they can make 
changes to it, can be the end of the cicle, or call the next middleware function*/
//  campgroundSchema is not a schema it validates our data before it sends the data to mongo.
const {campgroundSchema } = require('./schemasMiddleware');
const ExpressError = require ('./utilities/ExpressError');
const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) =>{
 if(!req.isAuthenticated()){
     req.session.returnTo = req.originalUrl //store the url requested before login in the session
    req.flash('error', 'you must be signed in!');
    return res.redirect('/login');
}
next();
}

module.exports.validateCamp = (req, res, next)=> {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next ();
    }
    }
    
module.exports.isAuthor = async( req,res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
      req.flash('error', `You don't have permissions to edit this campground`)
      return res.redirect(`/campgrounds/${id}`)
    }
    next ();
}