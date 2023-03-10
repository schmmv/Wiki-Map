// load .env data into process.env
require('dotenv').config();


// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // lasts 24 hours
}));
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const apiRoutes = require('./routes/apiRoutes');
const pinApiRoutes = require('./routes/pins-api');
const usersRoutes = require('./routes/users');
const mapsRoutes = require('./routes/maps');
const mapApiRoutes = require('./routes/maps-api');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api', apiRoutes);
app.use('/api/pins', pinApiRoutes);
app.use('/users', usersRoutes);
app.use('/maps', mapsRoutes);
app.use('/api/maps', mapApiRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
// do this instead
app.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;
  res.redirect(`/users/${req.params.id}`);
});

app.get('/', (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { map: {latitude: 49.2578262, longitude: -123.1941156, zoom: 10}, user: userID, key: process.env.API_KEY };
  res.render('index', templateVars);
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
