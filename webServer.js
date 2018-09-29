/*   REQUIRES  */
// Database
var mongoose = require('mongoose');
var async = require('async');

// Running server
var express = require('express');
var app = express();
var session = require('express-session');

// Parsing JSON requests/resonses
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File reading
var fs = require("fs");
var util = require("util");

// For communicating with Python processes
var spawn = require("child_process").spawn;

/*  Connect to Database  */
// Local: mongoose.connect('mongodb://localhost/trevorproject');
var mongoDB = 'mongodb://trevor:cs50@ds249545.mlab.com:49545/heroku_5czv9s99';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

// Get default collection.
var db = mongoose.connection;

// Bind connection to error event.
db.on('error', console.error.bind(console, 'connection error:'));
console.log("Database connected!");

// Can also load data from a json file. Stores as JSON object automatically :)
//var data = require('./data.json');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

var postSchema = new mongoose.Schema({
	name: String,
	age: Number,
  profile_url: String,
	post_content: String,
  post_url: String,
	post_date: Date,
	keywords: [String],
	status: String,
	accept_date: Date,
  complete_date: Date,
  moderator: String
});
var Post = mongoose.model('Post', postSchema, 'flagged_posts');

var keywordSchema = new mongoose.Schema({
	keyword: String
});
var Keyword = mongoose.model('Keyword', keywordSchema, 'keywords');

// set up the RESTful API, handler methods are defined in api.js
//var api = require('assets/js/api.js');
app.get('/interventions/:user', function(req, res) {
  var user = req.params.user;
  console.log("Getting from interventions for " + user);
  // TODO: UNCOMMENT OUT USER WHEN TESTING
  var query = { status: "In Progress" , moderator: user /*new RegExp('.*')*/};
  Post.find(query, function(error, posts) {
    //console.log(posts);
    res.send(posts);
  });
});

app.get('/pending', function(req, res) {
  console.log("Getting from pending");
  var query = { status: "Pending" };
  Post.find(query, function(error, posts) {
    //console.log(posts);
    res.send(posts);
  });
});

app.get('/history/:user', function(req, res) {
  var user = req.params.user;
  console.log("Getting from history for " + user);
  var query = { status: "Complete" , moderator: user};
  Post.find(query, function(error, posts) {
    //console.log(posts);
    res.send(posts);
  });
});

app.get('/loadkeywords', function(req, res) {
  console.log("Getting from keywords");
  Keyword.find(function(error, posts) {
    console.log(posts);
    res.send(posts);
  });
});

app.post('/addkeyword', function (request, response) {
  console.log("MADE IT TO ADD KEYWORD");
  var arr = request.body.keywords;
  for(var i = 0; i < arr.length; i++){
    var k = new Keyword({keyword: arr[i].toLowerCase()});
    k.save(function (err) {
      if (err) return handleError(err);
    });
  }
  response.status(200).end("Done adding keywords");
});

app.post('/removekeyword', function (request, response) {
  console.log("MADE IT TO REMOVE KEYWORD");
  var arr = request.body.keywords;
  for(var i = 0; i < arr.length; i++){
    Keyword.remove({keyword: arr[i].toLowerCase()}, function (err) {
      if (err) console.log("Error in removing");
    });
  }
  response.status(200).end("Done removing keywords");
});

app.post('/resolve/:id', function(req, res) {
  var id = req.params.id;
  console.log("In webServer. Resolving " + id);
  var query = { _id: id },
      update = { $set: { status: "Complete",
                  complete_date: new Date().toISOString()}};
  Post.update(query, update, function(error, data) {
    res.status(200).end("Done resolving " + id);
  });
});

app.post('/accept/:id/:user_id', function(req, res) {
  var id = req.params.id;
  var user_id = req.params.user_id;
  console.log("In webServer. Accepting " + id + " for user " + user_id);
  var query = { _id: id },
      update = { $set: { status: "In Progress",
                  moderator: user_id,
                  accept_date: new Date().toISOString()}};
  Post.update(query, update, function(error, data) {
    res.status(200).end("Done accepting " + id);
  });
});

app.post('/delete/:id', function(req, res) {
  var id = req.params.id;
  console.log("In webServer. Deleting " + id);
  var query = { _id: id },
      update = { $set: { status: "Deleted"}};
  Post.update(query, update, function(error, data) {
    res.status(200).end("Done removing " + id);
  });
});

app.post('/test', function (request, response) {
	console.log("MADE IT TO THE WEBSERVER");
	response.status(200).end("Hi you made it!");
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
