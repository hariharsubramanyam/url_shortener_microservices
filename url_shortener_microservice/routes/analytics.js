var express = require("express");
var router = express.Router();

var Analytics = require("../util/analytics.js");
var counter = require("../counter.js");

/**
 * Serve the analytics form.
 */
router.get("/", function(req, res) {
  res.render("analytics");
});

/**
 * Get the analytics report.
 * @param {Object} req - The request object. It should contain a body field 
 *  called shortName. 
 * @param {Object} res - The response object. We will serve a page that
 *  shows the analytics form and the analytics for that short name.
 */
router.post("/", function(req, res) {
  var shortName = req.body.shortName;
  // Get the analytics for the short name.
  Analytics.getRequests(shortName, function(err, requests) {
    if (err) {
      res.render("error", {msg: "Failed to get analytics"});
    } else {
      var browsers = ["Chrome", "Safari", "Firefox"];
      var short_match = function() { return true; };
      var browser_is = function(b) {
        return function(req) { return req.browser === b; };
      };
      var preds = counter.conjoin(browsers.map(browser_is), short_match);
      browser_counts = counter.counts(preds, requests);
      preds = counter.conjoin(counter.compose(counter.last_n_mins_preds(7), 
        function (req) {return req.date;}), short_match);
      var day_counts = counter.counts(preds, requests);
      res.render("analytics", {
        by_browser: {
          browsers: browsers, counts: browser_counts
        },
        by_time: {
          days: counter.last_n_days(7), 
          counts: day_counts
        },
        short: shortName
      });
    }
  });
});

module.exports = router;
