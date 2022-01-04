const expressJwt = require('express-jwt')

function authJwt() {
  const secret = process.env.SECRET
  const api = process.env.API_URL

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({ // token en todos las rutas menos estos...
    path: [
      /* {url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS']}, */
      /* {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']}, */
      `${api}/admin/createTable`,
      `${api}/users/createTable`,
      `${api}/admin/register`,
      `${api}/admin/login`,
      `${api}/users/register`,
      `${api}/users/login`,
    ]
  })
}

async function isRevoked(req, payload, done) {
  //console.log(payload.isAdmin) // where is comming from payload(isAdmin) exactly?
  if(!payload.isAdmin) {
    done(null, true)
    //done()
  }

  done()
}

module.exports = authJwt