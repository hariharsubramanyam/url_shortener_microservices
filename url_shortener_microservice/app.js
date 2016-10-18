/*
* URL Shortener Demo App
* 6170 Software Studio
* Daniel Jackson, based on code by Harihar Subramanyam
* Main module
*/

var express = require("express");

var path = require("path");
var bodyParser = require("body-parser");
var mustache = require("mustache-express");
var mongoose = require("mongoose");

var LinkMap = require("./models/linkmap.js");
var checkIP = require("./checkip.js");
var counter = require("./counter.js");
var shorteningRoutes = require("./routes/shortenings.js");
var analyticsRoutes = require("./routes/analytics.js");

// Set the URL of the analytics server.
require("./util/analytics.js").setServerUrl("http://localhost:3001/");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// set location of static files
// using __dirname makes independent of where node invoked from
app.use(express.static(__dirname + "/public"));

// associate html files with mustache templating
app.engine("html", mustache());
app.set("view engine", "html");
// set directory for view files
app.set("views", __dirname + "/public/html");

// middleware to add date to a request
app.use(function (req, res, next) {
  req.date = Date.now();
  next();
});

// middleware to check IP address
app.use(function (req, res, next) {
	if (checkIP(req))
		next();
	else {
    res.render("error", {msg: "Service not available from this IP address"});
	}
});

// Show shortening form
app.get("/", function(req, res) {
  res.render("index");
});


app.use("/analytics", analyticsRoutes);
app.use("/", shorteningRoutes);

mongoose.connect("mongodb://localhost/url_shortener", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
    app.listen(3000, function() {
      console.log("Listening on port 3000");
    });
  }
});
