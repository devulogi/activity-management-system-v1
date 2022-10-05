const User = require('../models/user.model');
const {authenticateUser} = require('../helper');

const getSignUpController = (req, res) => {
    res.render('signup', {title: 'Sign Up'});
}

const postSignUpController = async (req, res, next) => {
    let user; // user object

    // check if passwords match
    if (req.body.password !== req.body.password2) {
        res.render('signup', {title: 'Sign Up', error: 'Passwords do not match'});
    }

    try {
        // check if user already exists
        user = await User.findOne({username: req.body.username});
        if (user) {
            req.flash('error', 'User already exists.');
            res.redirect('/signup');
        } else {
            user = new User(req.body); // create new user object
            await user.save(); // save user to database
            req.flash('info', 'You have successfully signed up.');
            // authenticate user and redirect to home page
            authenticateUser(req, res, next);
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getSignUpController,
    postSignUpController
}