var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var analyticsRoutes = require("./routes/analytics.js");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use("/analytics", analyticsRoutes);

mongoose.connect("mongodb://localhost/url_shortener", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
    app.listen(3001, function() {
      console.log("Listening on port 3001");
    });
  }
});
