//req,res,next is necessary because this is a middleware
module.exports.isLoggedIn = (req, res, next) => {
    //isAuthenticated is helper method from passport
    //it check whethe client has logged in or not
    if (!req.isAuthenticated()) {
        //returning to the client's destination after logging in
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}
