const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const exphbs = require('express-handlebars');

const connectDB = require('./config/db');

// LOAD CONFIG
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
// LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Passport Config
require('./config/passport')(passport);

// HANDLERBARS
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//Sessios
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
