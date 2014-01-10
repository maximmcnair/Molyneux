var mongoose = require('mongoose')
  , mongooseTypes = require("mongoose-types")
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , properties = require('../config')

// Email schema type
mongooseTypes.loadTypes(mongoose)
Email = mongoose.SchemaTypes.Email

// User schema
var UserSchema = new Schema({
  username:
  { type: String
  , required: true
  }
, team:
  { type: String
  , required: true
  }
, email:
  { type: Email
  , required: true
  , unique: true
  }
, password:
  { type: String
  , required: true
  }
, avatar:
  { type: String
  }
})

// Bcrypt middleware
UserSchema.pre('save', function (next) {
  var user = this
  if(!user.isModified('password')) return next()
  user.hashPassword(user.password, function (hash) {
    user.password = hash
    next()
  })
})

// Password verification
UserSchema.methods.hashPassword = function (password, cb) {
  bcrypt.genSalt(properties.saltWorkFactor, function (err, salt) {
    if(err) return next(err)
    bcrypt.hash(password, salt, function (err, hash) {
      if(err) return next(err)
      cb(hash)
    })
  })
}

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if(err) return cb(err)
    cb(null, isMatch)
  })
}

// Remember Me implementation helper method
UserSchema.methods.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_'
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 )
    token += chars.charAt( i )
  }
  return token
}

exports.UserModel = mongoose.model('User', UserSchema)