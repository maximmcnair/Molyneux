var mongoose = require('mongoose')

// Timer schema
var timerSchema = mongoose.Schema({
    user: String
  , team: String
  , title: String
  , project: String
  , tags: Array
  , active: Boolean
  , date: Date
  , before: Number
  , start:
    { type: String
    , default: '0'
    }
  , stop:
    { type: String
    , default: '0'
    }
  , total:
    { type: Number
    , default: 0
    }
})

exports.TimerModel = mongoose.model('Timer', timerSchema)