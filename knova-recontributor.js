/******************************
 * knova-recontributor
 *
 * todo: help function - f => path to id list *required
 *						 l => log path
 *						 u => url with token *required
 *						 d => dry (test) run (will hit google.com)
 *						 v => debug logging
 *
 * exit codes:
 *   3 - missing command line arguments
 *   9 - invalid string, missing token
 ******************************/
var argv = require('minimist')(process.argv.slice(2));
const log4js = require('log4js');
var Logger = require('./modules/Logger');
const log = Logger.getLogger(argv['l']);

if (argv['v']) {
	log.level = 'debug';
}

// Read csv file
var fs = require('fs');

getIDList = function (callback) {
	var tokenString = argv['u'];
	if (!tokenString) {
		log.fatal('Missing command line argument -u tokenized url.');
		log4js.shutdown(function() { process.exit(3) });
	}

	var filename = argv['f'];
	if (!filename) {
		log.fatal('Could not locate IDList. Missing command line argument -f');
		log4js.shutdown(function() { process.exit(3) });
	} else {
		log.info('Attempting to read contents of ' + filename + ' into memory...');

		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) {
				log.fatal(err);
				log4js.shutdown(function() { process.exit(5) });
			}
			log.info('Loaded contents of file \'' + filename + '\' into memory.');
			log.debug(data);

			IDList = data.split(",").map(function (val) {
				return Number(val) + 1;
			});

			callback(null, IDList, tokenString);
		});
	}
}

// run http requests
var request = require('request');

// string must contain {id} token, which will be substituted for each value in
// the IDList
exports.updateKnova = function(IDList, tokenString, callback) {
	log.debug('updateKnova method called. IDList and tokenString:');
	log.debug(IDList);
	log.debug(tokenString);

	if (!tokenString.includes('{id}')) {
		log.fatal('tokenString: ' + tokenString + ' is missing {id}.');
		log4js.shutdown(function() { process.exit(8) });
	}

	var failedIDs = [];
	var c = 0;
	var timeout = setInterval(function() {
		log.debug('timout c: ' + c);
		log.debug('IDList.length: ' + IDList.length);

		let url = tokenString.replace('{id}', IDList[c]);
		log.debug('id: ' + IDList[c]);
		log.debug('url + id: ' + url);

		if (argv['d']) {
			url = 'http://www.google.com';
		}

		log.info('Attempting http request to: ' + url + '...');
		request(url, function (error, response, body) {
			if (error) {
				failedIDs.push(IDList[c]);
				log.error(error);
			}
			log.info('Success: statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			log.debug('body:', body); // Print the HTML
		});

		c++;
		if (c >= IDList.length) {
			clearInterval(timeout);
			writeFailedIDList(failedIDs, callback);
		}
	}, 1000); // one second interval
}

writeFailedIDList = function(failedIDs, callback) {
	if (failedIDs.length == 0) {
		log.info('Nothing failed. Moving on...');
		callback(null, 'Success!');
	} else {
		log.info('Writing list of failed ID\'s to disk...');
		fs.writeFile('failedIDs.csv', failedIDs, function(err) {
			if (err) {
				callback(err);
			}

			log.info('File \'failedIDs.csv\' written successfully.');

			callback(null, 'Success!');
		});
	}
}
const async = require("async");

if (process.argv[1].includes('knova-recontributor.js')) {
	log.debug('process.argv[1].includes knova-recontributor');
	async.waterfall([
		getIDList,
		exports.updateKnova
	], function (err, result) {
		if (err) {
			log.error(err);
		}
		log.info(result);
		log4js.shutdown(function() { process.exit(0) });
	});
} else {
	log.debug('knova-recontributor included as part of another process');
}
