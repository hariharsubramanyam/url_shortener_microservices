var express = require("express");
var router = express.Router();

var Request = require("../models/request.js");

/**
 * Log the request. 
 * @param {Object} req - The request object. It should have the following string
 *  fields in the body: key, browser, and ip.
 * @param {Object} res - The response object. If the request is successfully
 *  logged, this returns {success: true}, otherwise it returns {success: false}.
 */
router.post("/", function(req, res) {
  Request.logRequest(req.body.key, req.body.browser, req.body.ip, 
  function(err) {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
});

/**
 * Get requests for a given key.
 * @param {Object} req - The request object. It should have a String URL 
 *  parameter: req.params.key.
 * @param {Object} res - The response object. If there errors, this returns
 *  {success: false}. Otherwise, it returns {success: true, requests: ... }
 *  where requests is an Array of Objects of the form 
 *  {ip: String, browser: String, date: Number}. The date is the number of
 *  milliseconds since Jan 1, 1970.
 */
router.get("/:key", function(req, res) {
  Request.requestsForKey(req.params.key, function(err, requests) {
    if (err) {
      res.status(500);
      res.json({success: false});
    } else {
      res.json({success: true, requests: requests});
    }
  });
});

module.exports = router;
