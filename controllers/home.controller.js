const homeController = (req, res) => {
    console.log('sample lang')
    res.render('index', {title: 'Home'});
};

module.exports = homeController;
