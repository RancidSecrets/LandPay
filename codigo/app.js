require('dotenv').config();
const passport = require("passport")
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session")
const flash=require('connect-flash')
const {isAuthenticated,checkRole}=require("./middlewares")

mongoose
  .connect("mongodb+srv://egiorgana:GiorganA13@cluster0-szo2p.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 60000})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(cookieParser());
app.use(flash())
app.use(
  session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true
  })

)

app.use(passport.initialize())
app.use(passport.session())
//require("./config/passport")(passport)
// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.get("facebook")


// default value for title local
app.locals.title = 'LandPay';



const index = require('./routes/index');
app.use('/', index);


module.exports = app;
