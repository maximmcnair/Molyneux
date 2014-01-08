var _ = require('lodash')
  , path = require('path')

  , baseProperties =
    { port: 4001
    , root: __dirname
    , saltWorkFactor: 10
    , session:
      { secret: 'dayz-G0n3-b____ai' }
    , db: 'mongodb://localhost/molyneux'
    , twitter:
      { clientID: 'DajrqNKXtC4QLpl77AvYw'
      , clientSecret: '2s456NYgtnUodPBkKKMptynmScS80Lq2RHgNac1FCs'
      }
    , github:
      { clientID: '4fa5818ad0525b2a03f9'
      , clientSecret: 'fc46fb965cb56873b0cfc77c2818f93491df370f'
      }
    }

  , properties =
    { development:
      { port: 4001 }
    }


module.exports = function () {
  var env = process.env.NODE_ENV || 'development'
  return _.extend({ environment: env }, baseProperties, properties[env])
}