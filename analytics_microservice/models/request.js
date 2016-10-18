var mongoose = require("mongoose");

var RequestSchema = mongoose.Schema({
  "key": { type: String, required: true, index: true },
  "browser": { type: String },
  "ip": { type: String },
  "date": { type: Date, default: Date.now },
});

/**
 * Log a request in the request log.
 * @param {String} key - A key to associated the request with.
 * @param {String} browser - The browser that originated the request.
 * @param {String} ip - The IP address making the request.
 * @param {Function} callback - Executed as callback(err).
 */
RequestSchema.statics.logRequest = function(key, browser, ip, callback) {
  this.create({ "key": key, "browser": browser, "ip": ip }, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

/**
 * Return all the requests associated with a given key.
 * @param {String} key - The key.
 * @param {Function} callback - Executed as callback(err, requests) where
 *  requests is an Array of { browser: String, ip: String, date: Number } 
 *  objects. The date is the number of milliseconds since midnight Jan 1 1970.
 */
RequestSchema.statics.requestsForKey = function(key, callback) {
  this.find({"key": key}, function(err, docs) {
    if (err) {
      callback(err);
    } else {
      callback(null, docs.map(function(doc) {
        return {
          browser: doc.browser,
          ip: doc.ip,
          date: doc.date.getTime()
        };
      }));
    }
  });
};

module.exports = mongoose.model("Request", RequestSchema);
