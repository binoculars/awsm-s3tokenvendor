var handler = require('../awsm/vendtoken/handler.js');
var event = require('../awsm/vendtoken/event.json');

process.env.UPLOAD_BUCKET = 'test-bucket';
process.env.UPLOAD_TIMEOUT = 15;

handler.handler(event, {
	done: function(err, msg) {
		if (err) console.log('Error:', err);
		else console.log('Success:', msg);
	}
});