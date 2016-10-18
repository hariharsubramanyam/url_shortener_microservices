/*
* URL Shortener Demo App
* 6170 Software Studio
* Harihar Subramanyam
* Mapping from short names to URLs
*/

// Import randomization library for generating random short names.
var chance = require("chance").Chance();

// Import mongoose so we can interact with MongoDB.
var mongoose = require("mongoose");

// A Shortening will have a short name and URL.
var ShorteningSchema = mongoose.Schema({
  shortName: { type: String, required: true, unique: true , index: true },
  url: { type: String, required: true }
});

/**
 * Create or update a shortening that maps the given short name to the given
 * URL. 
 * @param {String} url - The URL
 * @param {String} shortName - The short name. If this is a false-y value (like
 *  null or undefined), then a random short name will be generated.
 * @param {Function} callback - Executed as callback(err, shortName, url). 
 */
ShorteningSchema.statics.makeShortening = function(url, shortName, callback) {
  shortName = shortName ? shortName : chance.word();
  this.findOneAndUpdate(
    { shortName: shortName }, 
    { shortName: shortName, url: url },
    { upsert: true },
    function(err, doc) {
      if (err) {
        callback(err);
      } else {
        callback(null, shortName, url);
      }
  });
};

/**
 * Find the URL associated with the given short name.
 * @param {String} shortName - The short name.
 * @param {Function} callback - Executed as callback(err, url) where url is
 *  null if the short name does not have an associated URL.
 */
ShorteningSchema.statics.expandShortening = function(shortName, callback) {
  this.findOne({shortName: shortName}, function(err, doc) {
    if (err) {
      callback(err);
    } else if (doc) {
      callback(null, doc.url);
    } else {
      callback(new Error("Could not expand URL"));
    }
  });
};

module.exports = mongoose.model("Shortening", ShorteningSchema);
