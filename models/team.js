var mongoose = require('mongoose')
  , Schema = mongoose.Schema

// Team schema
var TeamSchema = new Schema({
  name:
  { type: String
  , required: true
  }
// , manager:
//   { type: String
//   , required: true
//   }
// , members:
//   { type: Array
//   , required: true
//   }
})

var TeamModel = mongoose.model('Team', TeamSchema)
exports.TeamModel = TeamModel


TeamModel.findOne({name: 'Synth Media'}, function (err, doc){
 if(doc === null){
    var newTeam = new TeamModel({
      name: 'Synth Media'
    , _id: '52d155ed8d94e2e235000001'
    // , members: ['52d1262dfbad1a8d09000003', '52d1262dfbad1a8d09000002']
    })

    newTeam.save(function (err, team) {
      if(err) console.log(err)
      console.log(team)
    })
  }
})
TeamModel.findOne({name: 'Synth Media'}, function (err, doc){
 if(doc === null){
    var newTeam = new TeamModel({
      name: 'Clock'
    , _id: '52d15d7503bc79c03d000001'
    // , members: ['52d1262dfbad1a8d09000003', '52d1262dfbad1a8d09000002']
    })

    newTeam.save(function (err, team) {
      if(err) console.log(err)
      console.log(team)
    })
  }
})