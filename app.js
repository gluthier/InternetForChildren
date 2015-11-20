var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var images = require('./routes/images');

var app = express();

//connect to our database
mongoose.connect('mongodb://localhost/imageDB'); // TODO change name_database

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(images); // TODO ?

app.listen(process.env.PORT || 4730); // TODO change port
