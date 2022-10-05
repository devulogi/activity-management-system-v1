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

exports.authenticateUser = authenticateUser;