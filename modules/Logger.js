/******************
 * Logger
 ******************/
const log4js = require('log4js');

exports.getLogger = function(path) {
	this.path = path;

	if (!this.path) {
		this.path = 'knova-recontributor.log';
	}

	log4js.configure({
		appenders: { 
			knova: { type: 'file', filename: this.path },
			console: { type: 'console' }
		},
		categories: {
			default: { appenders: ['knova', 'console'], level: 'info' }
		}
	});

	return log4js.getLogger('knova');
}
