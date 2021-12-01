var express = require('express');
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser');

var fs = require('fs');
var session = require('express-session');

var logger = require('./middleware/logger');
var users = require('./users.json');
var utility = require('./utility');


var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  secret: 'verysecret',
  resave: false,
  saveUninitialized: true
  
}));


// Init middleware
//app.use(logger);

// Gets All users, just for test
app.get('/api/users', function(req, res){
	console.log('Get users');
	res.status(200).json(users);
});

//Get Single Member, just for test
app.get('/api/users/:id', function(req, res){
	console.log('Get single user');
	res.status(200).json(users.filter(function(user){
			return user.id === parseInt(req.params.id);
	}));

});

app.get('/api/login', function(req, res){
	res.status(200).json({"message": "login get route"});
});

app.post('/api/login', function(req, res) {
	
	var userName = req.body.userName;
	var password = req.body.password;

	if (userName && password) {

		var results = users.filter(function(user){
							return (user.userName == userName && user.password == password);
						});

		if(results.length > 0){
			req.session.user = results[0];
			res.status(200).json({"message": "Authorized"});
		}
		else
		{
			res.status(404).json({"message": "User not found"});
		}

		
	}
	else{
		res.status(404).json({"message": "Please enter Username and Password"});	
	}
});

app.get('/api/game', function(req, res) {

	if(!req.session.user) {
		res.status(401).json({"message": "Un-authorized"});
	}
	else {

		var user = req.session.user;
		//build game state-data
		var data = {};
		data.id = user.id;
		data.name = user.name;
		data.wins = user.wins;
		data.losses = user.losses;
		data.won = false;
		data.rgbs = [];

		var tmpArray = [];
		var rgb = utility.getRGB();
		
		data.answer = rgb;
		tmpArray.push(rgb);
		for (i = 0; i < 5; i++) {
			rgb = utility.getRGB();
			tmpArray.push(rgb);
		};

		data.rgbs = tmpArray;
		//Shuffle for new game
		data.rgbs = utility.shuffleArray(tmpArray);

		data.sfDateTime = moment().format('LLLL');
		data.nyDateTime = "NY Date-Time";

		res.status(200).json(data);

	}

	
});

app.post('/api/game', function(req, res) {

	if(!req.session.user){
		res.status(401).json({"message": "Un-authorized"});
	}
	else
	{
		var user = req.session.user;
	
		var id = req.body.id;
		var won = req.body.won;

		// if its Db then Direct update
		for (var i = 0; i < users.length; i++) {
	  		if(users[i].id == parseInt(id)){

	  			if(won == "true") {
						users[i].wins = users[i].wins + 1;
				}
				else {
						users[i].losses = users[i].losses + 1;
				}

				req.session.user = users[i];
	  		}
	  	}
		
		//at last write file if requred.
		fs.writeFile('./users.json', JSON.stringify(users), function (err,data) {
			  if (err) {
			    return console.log(err);
			  }
			  
			  res.status(200).json({"message": "Updated"});
		});
	}
	
});

//logout
app.get('/api/logout', function(req,res){
 	req.session.destroy(function (err) {
        res.redirect('/');
    });
});

//Set static folder
app.use(express.static(path.join(__dirname, 'dist')));

var PORT = process.env.PORT || 5001;
app.listen(PORT, function(){
	console.log("Server started on port " + PORT);
});