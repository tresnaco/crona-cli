#!/usr/bin/env node

var tresna = require('./lib/tresna');
var Promise = require('bluebird');
var program = require('commander');
var promptly = require('promptly');
var co = require('co');
var table = require('table');

Promise.promisifyAll(tresna);
Promise.promisifyAll(promptly);

program
  .version('0.0.1')
  .command('login') 
  .action(function () {
	 co(function*() {
	 	var username = yield promptly.promptAsync('Username: ');
	 	var password = yield promptly.passwordAsync('Password: ');
	 	var login = yield tresna.loginAsync(username, password);
	 	if(login.error)
	 		return console.log(login.error);
	 	console.log('Now you are logged.');
	 });
  })
program.command('register') 
  .action(function () {
    co(function*() {
	 	var username = yield promptly.promptAsync('Username: ');
	 	var name = yield promptly.promptAsync('Name: ');
	 	var email = yield promptly.promptAsync('Email: ', {
	 		validator: function(mail) {
	 			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	 			if(!filter.test(mail))
	 				throw new Error('You need to set a valid mail.');
	 			return mail;
	 		}
	 	});
	 	var password = yield promptly.passwordAsync('Password: ');
	 	var passwordConfirm = yield promptly.passwordAsync('Confirm Password: ');
	 	if(password != passwordConfirm) {
	 		console.log('The password confirm should match with password.');
	 		return;
	 	}
	 	var register = yield tresna.registerAsync(username, name, password, email);
	 	if(register.error)
	 		return console.log(register.error);
	 	console.log('You are logged!');
	}).catch(function(err) {
		console.error(err.toString());
	});
  })
program.command('token:list') 
  .action(function () {
    co(function*() {
    	var isLogged = yield tresna.isLoggedAsync();
    	if(!isLogged)
    		return console.log('You need to login first!');
    	var tokens = yield tresna.tokenListAsync();
    	var _tabl = [];
		_tabl.push(['Token', 'Auth', 'Created']);
    	tokens.forEach(function(token) {
    		_tabl.push([token.token, token.auth, token.createdAt]);
    	});
    	console.log(table.default(_tabl));
    }).catch(function(err) {
		console.error(err.toString());
	});
  })
program.command('token:create') 
  .action(function () {
	co(function*() {
		var isLogged = yield tresna.isLoggedAsync();
	if(!isLogged)
		return console.log('You need to login first!');
	var createToken = yield tresna.tokenCreateAsync();
	if(createToken.ok) {
		var token = createToken.token;
		var _tabl = [];
		_tabl.push(['Token', 'Auth', 'Created']);
		_tabl.push([token.token, token.auth, token.createdAt]);
		console.log('Token Created');
    	console.log(table.default(_tabl));
	} else {
		console.log('Something went wrong try again.');
	}
	});
  });
program.parse(process.argv);
