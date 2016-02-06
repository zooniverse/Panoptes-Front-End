#!/usr/bin/env node

var express = require('express');

var port = process.env.PORT || 3735;
var host = process.env.HOST || 'localhost';

var root = '/' + (process.env.DEPLOY_SUBDIR || '');

var app = express();
app.set('view engine', 'ejs');

var router = express.Router();

router.use(express.static('public'));

router.use(function(req, res, next) {
  res.render('index');
});

app.use(root, router);

app.listen(port, host, function() {
  console.log('Panoptes-Front-End listening at http://' + host + ':' + port + root);
});
