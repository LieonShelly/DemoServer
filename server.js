var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database');
require('./config/passport')(passport);
mongoose.connect(configDB.url);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
                resave: true,
                 saveUninitialized: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');
require('./app/routes')(app, passport);
app.listen(8080, function(){
    console.log('server is running port' + port);
});

                