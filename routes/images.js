var Image = require('../models/image');
var express = require('express');
var router = express.Router();

//example
router.route('/images').get(function(req, res) {
  Image.find(function(err, images) {
    if (err) {
      return res.send(err);
    }
    res.json(images);
  });
});
