var ce = require('./customEvents.js');

ce.addEvent(global, 'test', function() {
	console.log('success');
})
ce.fireEvent(global, 'test');