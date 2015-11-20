var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var crypto = require('crypto');
//var phashLib = require('phash'); // TODO
var request = require('request');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  phash         : {type: String, required: true, unique: true},
  md5s          : [String],
  urls          : [String],
  nView         : {type: Number, default: 1},
  nReport       : {type: Number, default: 1},
  nAllow        : {type: Number, default: 0}
});

mongoose.connect('mongodb://localhost/testDB');
var Image = mongoose.model('Image', imageSchema);

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

app.post('/url/check', function(req, res) {
  if (!req.body.hasOwnProperty('url')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  var url = req.body.url
  Image.findOne({urls: url}, function(err, img) {
    if (err) {
      return handleError(err, res);
    }
    if (img) {
      img.nView = img.nView + 1;
      var ratio = computeRatio(img);
      var done = img.save(function(err, model) {
        if (err) return handleError(err, res);
        if (done) res.json({ blocked: true });
      });
    } else {
      request.get(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var algo = 'md5';
            var shasum = crypto.createHash(algo);
            var h = shasum.update(body).digest('hex');
            Image.findOne({md5s: h}, function(err, imgMd5) {
              if (err) {
                return handleError(err, res);
              }
              if (imgMd5) {
                var ratio = computeRatio(imgMd5);
                imgMd5.nView = imgMd5.nView + 1;
                imgMd5.urls.push(url);
                var done = imgMd5.save(function(err, done) {
                  if (err) return handleError(err, res);
                  if (done) res.json({blocked: true});
                });
              } else {
                var phashPic = phashLib.compute(picture); // TODO

                Image.find({phash: phashPic}, function(err, imgPh) {
                  if (err) {
                    return handleError(err, res);
                  }
                  if (imgPh) {
                    imgPh.urls.push(url);
                    imgPh.md5s.push(h);
                    imgPh.nView = imgPh.nView + 1;
                    var ratio = computeRatio(imgPh);
                    imgPh.save(function(err, done) {
                      if (err) return handleError(err, res);
                      if (done) res.json({blocked: true});
                    });
                  } else {
                    res.json({blocked: false});
                  }
                });
              }
            });
          }
      });
    }
  });
});

app.post('/url/block/', function(req, res) {
  if (!req.body.hasOwnProperty('url')) {
    res.statusCode = 400;
    return res.sendStatus(400);
  }

  Image.findOne({ urls: req.body.url }, function(err, img) {
    if (err) return handleError(err, res);
    if (img) {
      img.nReport = img.nReport + 1;
      var done = img.save(function(err, model) {
        if (err) return handleError(err, res);
        if (done) res.sendStatus(200);
      });
    } else {

      // TODO add image
      // Compute ph and look for it

      // If PH not found, we add a new image
      request.get(req.body.url, function (error, response, body)  {
          if (!error && response.statusCode == 200) {
              var algo = 'md5';
              var shasum = crypto.createHash(algo);
              var h = shasum.update(body).digest('hex');
              var img = new Image({
                phash: "trololo", // TODO change
                md5s: [h],
                urls: [req.body.url],
                nView         : 1,
                nReport       : 1,
                nAllow        : 0
              });
              var done = img.save(function(err, model) {
                if (err) {
                  return handleError(err, res);
                }
                if (done) {
                  return res.sendStatus(200); // TODO
                }
              });
          }
      });
    }
  });
});

app.post('/url/unblock/', function(req, res) {
  if (!req.body.hasOwnProperty('url')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  Image.findOne({ urls: req.body.url}, function(err, img) {
    if (err) return handleError(err, res);
    if (img) {
      img.nAllow = img.nAllow + 1;
      img.save(function(err, done) {
        if (err) return handleError(err, res);
        if (done) res.sendStatus(200);
      });
    } else {
        res.sendStatus(200);
    }
  });
});

var server = app.listen(3000, function () {
  console.log('Listening port %s', server.address().port);
});

function computeRatio(elem) {
  return 0;
}

function handleError(err, res) {
  console.log(err);
  res.sendStatus(500);
}
