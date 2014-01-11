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
    // , members: ['52d1262dfbad1a8d09000003', '52d1262dfbad1a8d09000002']
    })

    newTeam.save(function (err, team) {
      if(err) console.log(err)
      console.log(team)
    })
  }
})
