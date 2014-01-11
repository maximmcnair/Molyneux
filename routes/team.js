var teamService = require('../controllers/team')

// teamService.create({name: 'Clock'}, function (err, team) {
//   console.log(team)
// })
// teamService.detail('52d155ed8d94e2e235000001', function (err, team) {
//   console.log(team)
// })
// teamService.update('52d155ed8d94e2e235000001', {name: 'Synth Media'}, function (err, team) {
//   console.log(team)
// })
// teamService.delete('52d15d8155a18bcc3d000001', function (err) {
//   console.log(err)
// })
// teamService.getMembers('52d155ed8d94e2e235000001', function (err, users) {
//   console.log(users)
// })

exports.getMembers = function (req, res) {
  teamService.getMembers(req.params.teamId, function (err, users) {
    if(err) return res.json(err, 400)
    return res.json(users, 201)
  })
}