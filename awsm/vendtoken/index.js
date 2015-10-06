'use strict';

/**
 * !!!!!!!!!!!!!IMPORTANT!!!!!!!!!!!
 *
 * Code in awsm dir of an aws module is just skeletion/example code and CAN be modified by user who installed awsm.
 *
 * Code inside an aws module's 'awsm' dir is copied to project's aws_modules/<mod name> folder (during npm postinstall)
 *
 * Therefore, npm 'dependencies' defined in the module you are creating CAN NOT be used here as node require loader wont
 * be able to find it.
 *
 * For example if awsm-images had a 'dependency' of bluebird defined in its package.json, bluebird could NOT be used
 * in this file.  This file will live in <project>/aws_modules/awsm-images/thumbnail/index.js and the bluebird mod will
 * be included in <project>/node_modules/awsm-images/node_modules/bluebird.
 *
 * In npm v3 dependencies were flattened (https://github.com/npm/npm/releases/tag/v3.0.0) HOWEVER you can still NOT
 * rely on skeletion/example having access to a package the module you are creating depends on because there could be
 * conflicting dependencies (and then your dependency wont be on the flattened path).
 *
 * Keep in mind awsm nodejs mods are just npm modules and should be treated as such.
 */


var Promise = require('bluebird');
var signing = require('../../lib/signing.js');

/**
 * Export for lambda handler
 * @param event
 * @param context
 * @param cb
 */
exports.run = function(event, context, cb) {
	var expiration = signing.getExpiration(process.env.UPLOAD_TIMEOUT);

	Promise.map(event.files, function(file) {
		var policy_b64 = signing.getPolicy(expiration, file.name, file.size);
		var signature = signing.signPolicy(process.env.AWS_SECRET_ACCESS_KEY, policy_b64);

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