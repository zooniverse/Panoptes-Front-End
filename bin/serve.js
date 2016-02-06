#!/usr/bin/env node

var express = require('express');

var port = process.env.PORT || 3735;
var host = process.env.HOST || 'localhost';

var app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.render('index');
});

app.listen(port, host, function() {
  console.log('Panoptes-Front-End listening at http://' + host + ':' + port + '/');
});
