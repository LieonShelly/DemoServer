var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
module.exports = function(passport){

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done){
    process.nextTick(function(){
        User.findOne({'local.username': email }, function(err, user){
            if (err){
                return done(err);
            }
            if(user){
                return done(null, false, req.flash('signupMessage', 'That email already taken'))
            } else {
                var newUser = new User();
                newUser.local.username = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err){
                    if(err){
                        throw err;
                    } else {
                        return done(null, newUser);;
                    } 
                });
            }
        });
    });
}
));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    process.nextTick(function(){
        User.findOne({'local.username': email}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, req.flash('loginMessage', 'no user find'));
            }
            if(user.validPassword(password)){
                    console.log(user.validPassword(password));
                     return done(null, user); 
            } else {
                return done(null, false, req.flash('loginMessage', 'invalid password'));
            }
           
        });
    });
}));
}