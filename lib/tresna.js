var homedir = require('homedir');
var request = require('request');
var is = require('is');
var request = request.defaults({jar: true});
var APIURL = 'https://api1.tresna.co';
var fs = require('fs-extra');
var auth = homedir()+'/.crona/auth.json';
fs.ensureFileSync(auth, '{}');
var FileCookieStore = require('tough-cookie-filestore');
var j = request.jar(new FileCookieStore(auth));
request = request.defaults({ jar : j });

var requestMethod = function(method, url, form, callback) {
	if(!callback)
		var callback = form;
	request[method](APIURL+url, { form: form }, function(error, response, body) {
		var result;
		if(!is.string(body)) {
			result = body;
		} else {
			try {
				result = JSON.parse(body);
			} catch(error) {
				result = body;
			}
		}
		callback(error, {
			response: response,
			body: result
		});
	});
}
var Tresna = {
	isLogged: function(callback) {
		requestMethod('get', '/user', function(error, res) {
			if(error) {
				return callback(error);
			}
			if(res.body.error) {
				callback(null, false);
			} else {
				callback(null, true);
			}
		});
	},
	login: function(username, password, callback) {
		requestMethod('post', '/user/login', {
			username: username,
			password: password
		}, function(error, res) {
			if(error) {
				return callback(error);
			}
			if(res.body) {
				callback(null, res.body);
			} else {
				callback(null, res.body);
			}
		});
	},
	register: function(username, name, password, email, callback) {
		requestMethod('post', '/user/register', {
			username: username,
			name: name,
			password: password,
			mail: email
		}, function(error, res) {
			if(error) {
				return callback(error);
			}
			if(res.body) {
				callback(null, res.body);
			} else {
				callback(null, res.body);
			}
		});
	},
	tokenList: function(callback) {
		requestMethod('get', '/token', function(error, res) {
			if(error) {
				return callback(error);
			}
			callback(null, res.body);
		});
	},
	tokenCreate: function(callback) {
		requestMethod('post', '/token/create', function(error, res) {
			if(error) {
				return callback(error);
			}
			callback(null, res.body);
		});
	}
}
module.exports = Tresna;