var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var md5Lib = require('md5'); // TODO
var phashLib = require('phash'); // TODO
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
  Image.find({url: req.body.url}, function(err, imgUrl) {
    if (err) {
      handleError(err);
    }
    if (imgUrl) {
      var ratio = computeRatio(imgUrl);
      console.log("found url"); // TODO compute ratio
    } else {
      var picture = // TODO get picture from url
      var md5Pic = md5Lib.md5(picture);

      Image.find({md5: md5Pic}, function(err, imgMd5) {
        if (err) {
          handleError(err);
        }
        if (imgMd5) {
          var ratio = computeRatio(imgMd5);
          console.log("found url"); // TODO compute ratio
        } else {
          var phashPic = phashLib.compute(picture); // TODO

          Image.find({phash: phashPic}, function(err, imgPh) {
            if (err) {
              handleError(err);
            }
            if (imgPh) {
              var ratio = computeRatio(imgPh);
              console.log("found phash"); // TODO compute ratio
            } else {
              console.log("pic not in db");
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
    return res.send('Error 400: Post syntax incorrect.');
  }
  Image.find({url: req.body.url}, function(err, img) {
    if (err) handleError(err);
    if (img) {
      img.nReport = img.nReport + 1;
      var done = img.save(function(err, model) {
        if (err) handleError(err);
        if (done) res.send("done");
      });
    }
  });
});

app.post('/url/allow/', function(req, res) {
  if (!req.body.hasOwnProperty('url')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  Image.find({url: req.body.url}, function(err, img) {
    if (err) handleError(err);
    if (img) {
      img.nAllow = img.nAllow + 1;
      var done = img.save(function(err, model) {
        if (err) handleError(err);
        if (done) res.send("done");
      });
    }
  });
});

/*
app.post('/md5s/', function(req, res) {
  if (!req.body.hasOwnProperty('md5s')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var response = "";
  for (var i in req.body.md5s) {
    Image.find({md5s: req.body.md5s[i]}, function(err, model) {
      if (err) handleError(err);
      if (model) {
        response = response + "md5 found: return json with infos. "; // TODO
        console.log(model);
        console.log("oui");
      } else {
        response = response + "md5 not found: return json to send second request. "; // TODO
        console.log("non");
      }
    })
  }
  return res.send(response);
});

app.post('/phash/', function(req, res) {
  if (!req.body.hasOwnProperty('phash') ||
  !req.body.hasOwnProperty('md5')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  Image.findOneAndUpdate(
    {phash: req.body.phash},
    {$push: {'md5s': req.body.md5}},
    {upsert: false},
    function(err, model) {
      if (err) {
        handleError(err);
        return res.status(500).send({error: err});
      }
      if (model) {
        return res.send('phash in the db: block the img'); // TODO
      } else {
        var img = new Image({
          phash: req.body.phash,
          md5s: req.body.md5,
          nView         : 0,
          nReport       : 0,
          nAllow        : 0
        });
        var done = img.save(function(err, model) {
          if (err) {
            handleError(err);
            return res.send(err);
          }
          if (done) {
            return res.send('db updated: dont block the img'); // TODO
          }
        });
      }
  })
});

// TODO delete:
app.get('/md5s/', function(req, res) {
  Image.find({}, function (err, image) {
    if (err) {
      handleError(err);
    }
    if (image) {
      res.send(image)
    }
  })
})

// TODO delete:
app.get('/phash/', function(req, res) {
  Image.find({}, function (err, image) {
    if (err) {
      handleError(err);
    }
    if (image) {
      res.send(image)
    }
  })
})
*/
var server = app.listen(3000, function () {
  console.log('Listening port %s', server.address().port);
});

function computeRatio(elem) {
  return 0;
}

function handleError(err) {
  console.log(err);
}
