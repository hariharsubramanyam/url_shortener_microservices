var request = require("request");

/**
 * This is a helper model that exposes functions for talking with the Analytics
 * service.
 */
var Analytics = function() {
  var that = Object.create(Analytics.prototype);

  var ANALYTICS_ROUTE = "analytics/";

  /**
   * Log the given request to the Analytics service.
   * @param {String} shortName - The shortName being visited.
   * @param {String} browser - The name of the user's browser.
   * @param {String} ip - The IP address of the request.
   * @param {Function} callback - Executed as callback(err).
   */
  that.logRequest = function(shortName, browser, ip, callback) {
    if (serverUrl) {
      request.post(serverUrl + ANALYTICS_ROUTE, { form: {
        key: shortName,
        browser: browser,
        ip: ip
      }},
      function(err, httpResponse, body) {
        if (err || JSON.parse(body).success === false) {
          callback(err);
        } else {
          callback(null);
        }
      });
    } else {
      callback(new Error("Server URL not defined!"));
    }
  };

  /**
   * Get all the requests associated with the given short name.
   * @param {String} shortName - The short name.
   * @param {Function} callback - Executed as callback(err, requests) where
   *  requests is an Array of Objects of the form { browser: String, ip: String,
   *  date: Date }.
   */
  that.getRequests = function(shortName, callback) {
    if (serverUrl) {
      request.get(serverUrl + ANALYTICS_ROUTE + shortName,
      function(err, httpResponse, body) {
        body = JSON.parse(body);
        if (err || body.success === false) {
          callback(err);
        } else {
          callback(null, body.requests.map(function(request) {
            request.date = new Date(request.date);
            return request;
          }));
        }
      });
    } else {
      callback(new Error("Server URL not defined!"));
    }
  };


  /**
   * Set the server URL.
   * @param {String} serverUrl - The URL of the analytics server.
   */
  that.setServerUrl = function(url) {
    serverUrl = url;
  };

  Object.freeze(that);
  return that;
};

module.exports = Analytics();
