/*
* URL Shortener Demo App
* 6170 Software Studio
* Daniel Jackson
* Functions for counting requests
*/

/**
* Count elements satisfying predicate
* @param {function (T) bool} p - predicate to count
* @returns {number} - number of elements in this for which p holds
*/
Array.prototype.count =
	function (p) {
		return this.reduce(
			function (total, e) {return total + (p(e) ? 1 : 0)},
			0)
			};

/**
* Build array by unrolling function over indexes
* @param {function (number) T} f - function to apply
* @param {number} n - length of returned array
* @returns {T[]} - ith element is f(i)
*/
var unroll = function (f, n) {
  var a = [];
  for (var i = 0; i < n; i++) a.push(f(i));
  return a;
	}

/**
* Conjoin predicate array with predicate
* @param {function (T) bool []} preds - array of predicates
* @param {function (T) bool} pred - a predicate
* @returns {function (T): bool []} - preds(i) && pred is ith element
*/
// return array of preds 
var conjoin = function (preds, pred) {
	return preds.map (function (p) {
		return function (e) {return p(e) && pred(e);}
		});
	}
	
/**
* Compose predicate array with function
* @param {function (T) bool []} preds - array of predicates
* @param {function (T) S} f - function to apply
* @returns {function (T): bool []} - result[i](e) = preds[i](fun(e))
*/
var compose = function (preds, f) {
	return preds.map (function (p) {
		return function (e) {return p(f(e));}
		});
	}
	
/**
* Counts number of elements that satisfy predicates
* @param {function (T) bool []} preds
* @param {T []}
* @returns [number []} - ith elt is number of elements of vals for which preds[i] holds
*/
var counts = function(preds, vals) {
	return preds.map(
		function (p) {return vals.count(p)}
		);
	}

/**
* Determine if date is within given range
* @param {number} unit - in milliseconds
* @returns {function (Date) bool} - predicate true if arg date is between i and i+1 units ago
*/
var i_ago = function (unit) {
	return function (i) {
		var i_ago_date = Date.now() - (i * unit);
		var i_plus_ago_date = i_ago_date - unit;
		return function (d) {
			var v = d.valueOf();
			return v >= i_plus_ago_date && v <= i_ago_date;
			}
		}
	}

var MILLISECONDS_PER_MIN = 60 * 1000;
var MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
* Generate predicates for matching recent dates
* @param {number} n - number of predicates in returned array
* @returns {function (Date) bool []} - ith pred true if arg date between i and i+1 days ago
*/
var last_n_days_preds = function (n) {
	return unroll(i_ago(MILLISECONDS_PER_DAY), n);
	}

var last_n_mins_preds = function (n) {
	return unroll(i_ago(MILLISECONDS_PER_MIN), n);
	}

var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// return string rep of date i days ago
var days_ago_str = function (i) {
  var then = new Date(Date.now() - (MILLISECONDS_PER_DAY * i));
  return DAYS[then.getDay()];
  }

/**
* Returns strings of recent days as array
* @param {number} n - number of days to report
* @returns {string[]} - names of days, from today back to n-1
*/
var last_n_days = function (n) {
  return unroll(days_ago_str, n)
  }

module.exports = {
	conjoin: conjoin,
	compose: compose,
	counts: counts,
	last_n_days_preds: last_n_days_preds,
	last_n_mins_preds: last_n_mins_preds,
	last_n_days: last_n_days
}