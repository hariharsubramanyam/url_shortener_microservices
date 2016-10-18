/*
* URL Shortener Demo App
* 6170 Software Studio
* Daniel Jackson
* Functions for checking IP addresses
* Quick hack: only works for IPv4
*/

var getIP = require('ipware')().get_ip;
var LOCALHOST = "127.0.0.1";

// if parsing fails, returns ip address of localhost
var parse_ipv4 = function (ip_str) {
	var ip = ip_str.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/);
	if (ip === null || ip.length == 0) return parse_ipv4 (LOCALHOST);
	// remove first element of array which is entire match
	ip.shift();
	return ip;
	}

var is_MIT_ip = function (ip) {
	return ip[0] === '18';
	}
	
var is_CSAIL_ip = function (ip) {
	return ip[0] === '128' && ip[1] === '30';
	}
	
var is_localhost_ip = function (ip) {  
	return ip[0] === '127';
	}

/**
 * Checks client IP address of a request
 * @param req - a node.js HTTP request object
 * @returns {bool} - whether the request IP meets some criteria
 */
var check_ip = function (req) {
	var ip_str = getIP(req).clientIp;
	var ip = parse_ipv4(ip_str);
	return is_MIT_ip(ip) || is_CSAIL_ip(ip) || is_localhost_ip(ip);
}

module.exports = check_ip;
