var User = require('./models/user');

module.exports = function(app, passport) {
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    app.get('/signup', function(req, res){
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    app.post('/signup',  passport.authenticate('local-signup', {
         successRedirect: '/',
         failureRedirect: '/signup',
          failureFlash: true
        }));

    app.get('/login', function(req, res){
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login',passport.authenticate('local-login', {
         successRedirect: '/profile',
         failureRedirect: '/login',
          failureFlash: true
    }))

    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', {user: req.user});
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    app.get('/:username/:password', function(req, res){
        var newuser =  new User();
        newuser.local.username = req.params.username;
        newuser.local.password = req.params.password;
        console.log(newuser.username + " "+  newuser.password);
        newuser.save(function(err){
            if(err) {
                throw err;
            }
        });
        res.send('suucess');
 });

 function isLoggedIn(req, res, next){
   if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 }
}