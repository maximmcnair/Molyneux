var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var FileSchema = new Schema({
  modificationDate: {type: Date}
, name: {type: String}
, size: {type: Number}
, type: {type: String}
, filename: {type: String}
, userId: {type: String}
})

exports.FileModel = mongoose.model('File', FileSchema)