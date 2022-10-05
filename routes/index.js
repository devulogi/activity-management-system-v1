const routes = require('express').Router();
const {logOut} = require('../helper');

// every view will now have access to the user object (if logged in)
routes.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.infos = req.flash('info');
    res.locals.errors = req.flash('error');
    next();
});
routes.get('/', require('./home.route')); // GET / - Home page
routes.use('/signup', require('./signup.route'));
routes.use('/login', require('./login.route'));
routes.get('/logout', logOut); // GET /logout - Logout page

module.exports = routes;