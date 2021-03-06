// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession    = require('cookie-session');


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// setup middleware
app.use(cookieSession({
  keys: [process.env.SESSION_SECRET]
}));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: false,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
const userRoutes = require("./routes/user-routes");
const passwordRoutes = require("./routes/password-routes");
const orgRoutes = require("./routes/org-routes");

// Mount all resource routes
app.use(userRoutes);
app.use('/passwords', passwordRoutes);
app.use('/orgs', orgRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
