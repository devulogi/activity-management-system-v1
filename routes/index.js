const routes = require('express').Router();
const { authenticateUser } = require('../helper');

const homeController = require('../controllers/home.controller');
const {getSignUpController, postSignUpController} = require('../controllers/signup.controller');
const {getLoginController} = require('../controllers/login.controller');

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

// every view will now have access to the user object (if logged in)
routes.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.infos = req.flash('info');
    res.locals.errors = req.flash('error');
    next();
});
routes.get('/', homeController); // GET / - Home page
routes.get('/signup', getSignUpController); // GET /signup - Signup page
routes.post('/signup', postSignUpController); // POST /signup - Signup page
routes.get('/login', getLoginController); // GET /login - Login page
routes.post('/login', (req, res, next) => {
    authenticateUser(req, res, next);
});
routes.get('/logout', logOut); // GET /logout - Logout page

module.exports = routes;