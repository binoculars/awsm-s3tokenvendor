'use strict';

var crypto = require('crypto');

/**
 *
 * @param {number} timeout - The upload timeout (in minutes)
 * @returns {string} - An ISO String of the timeout date/time group
 */
exports.getExpiration = function(timeout) {
	return new Date(
		Date.now() + (timeout || 15) * 60000
	).toISOString();
};

/**
 *
 * @param {number} exp - The expiration time for the upload (in milliseconds)
 * @param {string} key - The S3 key pointing to where the object will be stored
 * @param {number} size - The size of the file/S3 Object AKA content length
 * @returns {string} - The Base64 encoded policy
 */
exports.getPolicy = function(exp, key, size) {
	return new Buffer(JSON.stringify({
		"expiration": exp,
		"conditions": [
			{"bucket": process.env.UPLOAD_BUCKET},
			["eq", "$key", key],
			{"acl": "private"},
			["starts-with", "$Content-Type", process.env.UPLOAD_CONTENT_TYPE || "*"],
			["content-length-range", size, size]
		]
	})).toString('base64');
};

/**
 *
 * @param {string} secret - The AWS_SECRET_ACCESS_KEY
 * @param {string} policy_b64 - The policy in Base64
 * @returns {string} - The signed policy in Base64
 */
exports.signPolicy = function(secret, policy_b64) {
	return crypto
		.createHmac('sha1', secret)
		.update(policy_b64)
		.digest('base64');
};