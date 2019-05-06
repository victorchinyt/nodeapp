var mysql = require('mysql');

// connect to sql
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
});

// create db
connection.connect();
connection.query('CREATE DATABASE IF NOT EXISTS nodelogin', function(err, rows, fields) {
  if (!err)
	//console.log('DB Created/No Error\n', rows);
	console.log('DB Created/No Error\n');
  else
	console.log('Error while performing Query.\n');
});
connection.end();

//connect to db
connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

// create table
connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
	var sql = "CREATE TABLE IF NOT EXISTS users (email VARCHAR(50) PRIMARY KEY, password VARCHAR(50) NOT NULL, fname VARCHAR(50) NOT NULL, lname VARCHAR(50) NOT NULL)";
	connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Table created");
	});	
});

// exports connect function
module.exports = connection;