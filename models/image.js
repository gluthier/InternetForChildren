var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  phash: { type: String, index: true },
  md5: [String],
  nViews: Number,
  nReports: Number,
  nAllows: Number
});

module.exports = mongoose.model('Image', imageSchema);
