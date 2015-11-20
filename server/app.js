var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var crypto = require('crypto');
var phash = require('phash-image');
var request = require('request');
var randomstring = require("randomstring");
var md5File = require('md5-file');
var fs = require('fs');

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
      var name  = "/tmp/" + randomstring.generate() + "." + url.split('.').pop();
      var stream = fs.createWriteStream(name);
      stream.on('close', function() {
        stream.close();
        md5File(name, function (error, h) {
          if (error) return handleError(error, res);
          else {
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
                phash(name, function(err, pHash) {
                  if(err) return handleError(err, res);
                  else {
                    Image.findOne({phash: pHash}, function(err, imgPh) {
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
        })
      });
      request.get({uri: url})
      .pipe(stream);

    }
  });
});

app.post('/url/block/', function(req, res) {
  if (!req.body.hasOwnProperty('url')) {
    res.statusCode = 400;
    return res.sendStatus(400);
  }

  var url = req.body.url;
  Image.findOne({ urls: url }, function(err, img) {
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
      var name  = "/tmp/" + randomstring.generate() + "." + url.split('.').pop();
      var stream = fs.createWriteStream(name);
      stream.on('close', function() {
        stream.close();
        md5File(name, function (error, h) {
          if (error) return handleError(error, res);
          else {
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
                  if (done) res.sendStatus(200);
                });
              } else {
                phash(name, function(err, pHash) {
                  if(err) return handleError(err, res);
                  else {
                    Image.findOne({phash: pHash}, function(err, imgPh) {
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
                          if (done) res.sendStatus(200);
                        });
                      } else {
                        var image = new Image({
                          phash: pHash,
                          md5s: [h],
                          urls: [url],
                          nView         : 1,
                          nReport       : 1,
                          nAllow        : 0
                        });
                        image.save(function(err, done) {
                          if(err) return handleError(err, res);
                          else res.sendStatus(200);
                        })
                      }
                    });
                  }
                });
              }
            });
          }
        })
      });
      request.get({uri: url})
      .pipe(stream);
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
