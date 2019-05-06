//var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var connection = require('./create_db.js');


// initialize express
var app = express();

// use express packages
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// html login view
router.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/login.html'));
});
// html register view
router.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/register.html'));
});

// form action login
app.post('/auth', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
                // create sessions
				request.session.loggedin = true;
				request.session.fname = results[0].fname;
				request.session.lname = results[0].lname;
                // redirect to /home
				response.redirect('/home');
			} else {
				response.send('Incorrect Email and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});
// form action register
app.post('/authr', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	var fname = request.body.fname;
	var lname = request.body.lname;
	if (email && password && fname && lname) {
		connection.query('INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)', [email, password, fname, lname], function(error, results, fields) {
			response.send('You have successfully registered!<br/>Click here to <a href="/"/>Login</a>');
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

// GET /logout
router.get('/logout', function(request, response, next) {
  if (request.session) {
    // delete session object
    request.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return response.redirect('/');
      }
    });
  }
});

// html home view
router.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome, ' + request.session.fname + ' ' + request.session.lname + '!' +'<br/>Click here to <a href="/logout"/>Logout</a>');
	} else {
		response.send('Please login to view this page! <br/>Click here to <a href="/"/>Login</a>');
	}
	response.end();
});

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/views'));
//Store all JS and CSS in Scripts folder.
//app.use(express.static(__dirname + '/scripts'));

app.use('/', router);

// listen to port 3000
app.listen(3000);
console.log('Running at Port 3000\nReady!');