module.exports = {
  db: {
    development: "mongodb://localhost/molyneux-api"
  // , test: "mongodb://localhost/molyneux-api-test"
  // , production: "mongodb://maxim:synth001@paulo.mongohq.com:10016/molyneux-api"
  }
, saltWorkFactor: 10
, twitter: {
    development: {
      consumerKey: 'd8rHgAia27mD3qujVzrxw'
    , consumerSecret: 'DAIckyp7TLqag2PqDXwMnKbKdIIXlGuztVZhtBokNs'
    }
  , production: {
      consumerKey: 'hsFqLNJhZDp6WZBK3QlhQw'
    , consumerSecret: 'Bzg8GSi6JXPtbURp75mnh1c3jD67HKr2N7fo1daBH8'
    }
  }
, mandrill: {
    development: 'CyVaJZB4NBU7VQvDKdZVHA'
  , production: '2ehHgWa6hFk42koCAgp8yA'
  }
, stripe: {
    development: {
      backend: 'sk_test_XtMIIOJSG5wOyKKEBGcIi4NG'
    , frontend: 'pk_test_O0xKfxk0s8ptBnLVy8xNvaFz'
    }
  , production: {
      backend: 'sk_live_ewzV1K8nN386p0CDdySGk4wz'
    , frontend: 'pk_live_s3NHzUoTeyU1xqX3ZOdrUSyD'
    }
  }
, mixpanel: {
    development: {
      frontend: 'd57bb9097b855d81b4f3d689ba6c261f'
    }
  , production: {
      frontend: '53c9ac54c3de9e44aa1b8864aef961c0'
    }
  }
, session:
  { secret: 'dayz-G0n3-b____ai' }
}
