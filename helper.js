const passport = require("passport");

const authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // will generate a 500 error (Internal Server Error)
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login'); // redirect back to login page if user not found or password is incorrect
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // will generate a 500 error (Internal Server Error)
            }
            return res.redirect('/'); // redirect to home page if user is found and password is correct
        });
    })(req, res);
}

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to view this page');
    res.redirect('/login');
}

const logOut = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = {
    authenticateUser,
    ensureAuthenticated,
    logOut
}