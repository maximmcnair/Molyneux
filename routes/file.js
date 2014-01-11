var mongoose = require('mongoose')
  , fs = require('fs')
  , FileModel = require('../models/file.js').FileModel

// File upload
exports.upload = function (req, res) {
  var oldPath = req.files.myFile.path
  //   , pathPieces = oldPath.split("/")
  //   , filename = pathPieces[pathPieces.length - 1]
  //   , newPath = __dirname + "/../../../client/images/uploads/" + filename

  var userId = req.user._id
    , filename = userId + '_' + req.files.myFile.name
    , newPath = __dirname + '/../public/uploads/' + filename

  fs.rename(oldPath, newPath, function (err) {
    if (err === null) {
      var file = {
        modificationDate: req.files.myFile.modifiedDate || new Date()
      , name: req.files.myFile.name || "???"
      , size: req.files.myFile.size || 0
      , type: req.files.myFile.type || "???"
      , filename: filename
      , userId: req.user._id
      }
      doc = new FileModel(file)

      doc.save(function (err) {
        var retObj = {
          meta: {
            "action": "upload"
          , 'timestamp': new Date()
          , filename: __filename
          }
        , doc: doc
        , err: err
        , path: '/uploads/' + filename
        }
        return res.send(retObj)
      })
    }
  })
}