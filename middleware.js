/*Middleware : function that runs between the request and response lifecycle 
each middleware has acces to the request and response object and they can make 
changes to it, can be the end of the cicle, or call the next middleware function*/

module.exports.isLoggedIn = (req, res, next) =>{
 if(!req.isAuthenticated()){
     req.session.returnTo = req.originalUrl //store the url requested before login in the session
    req.flash('error', 'you must be signed in!');
    return res.redirect('/login');
}
next();
}