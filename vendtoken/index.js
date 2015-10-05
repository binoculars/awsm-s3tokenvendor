/**
 * AWS Module: Action: Modularized Code
 */

var crypto = require('crypto');
var Promise  = require('bluebird');

/**
 *
 * @param {number} exp - The expiration time for the upload (in milliseconds)
 * @param {string} key - The S3 key pointing to where the object will be stored
 * @param {number} size - The size of the file/S3 Object AKA content length
 * @returns {string} - The Base64 encoded policy
 */
function getPolicyJSONbase64(exp, key, size) {
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
}

// Export For Lambda Handler
module.exports.run = function(event, context, cb) {
	// Upload timeout in minutes
	var expiration = new Date(Date.now() + (process.env.UPLOAD_TIMEOUT || 15) * 60000).toISOString();

	Promise.map(event.files, function(file) {
		var policy_b64 = getPolicyJSONbase64(expiration, file.name, file.size);
		console.log(policy_b64);
		var signature = crypto
			.createHmac('sha1', process.env.AWS_SECRET_ACCESS_KEY)
			.update(policy_b64)
			.digest('base64');

		return {
			s3Key: file.name,
			policy_b64: policy_b64,
			signature: signature
		}
	}).then(function(tokens) {
		return cb(null, {
			AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
			tokens: tokens
		});
	});
};