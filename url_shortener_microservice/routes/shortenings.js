var express = require("express");
var router = express.Router();
var LinkMap = require("../models/linkmap.js");
var Analytics = require("../util/analytics.js");

var UA_Parser = require('ua-parser-js');
var ua_parser = new UA_Parser();
var getIP = require('ipware')().get_ip;

router.get("/go/:short", function(req, res) {
  // Expand the short name.
  LinkMap.expandShortening(req.params.short, function(err, url) {
    if (err) {
      res.render("error", {msg: "Failed to lookup short name"});
    } else if (url) {
      // If the short name exists...
      var shortName = req.params.short;
      var browser = ua_parser.setUA(req.headers['user-agent']).getBrowser().name;
      var ip = getIP(req).clientIp;
      // Log the request to the analytics server.
      Analytics.logRequest(shortName, browser, ip, function(err) {
        if (err) {
          res.render("error", {msg: "Failed to log request."});
        } else {
          res.redirect(url);
        }
      });
    } else {
      // If the short name does not exist...
      res.render("error", {msg: "Short name doesn't have a URL."});
    }
  });
});

router.post("/shorten", function(req, res) {
  // remove whitespace?
  var short = req.body.short.replace(/\s+/g, "");
  short = short.length !== 0 ? short : undefined;
  LinkMap.makeShortening(req.body.url, short, function(err, shortName, url) {
    if (err) {
      res.render("error", {msg: "Can't create mapping from short name to URL"});
    } else {
      res.render("success", {"url": url, "short": shortName});
    }
  });
});

module.exports = router;
