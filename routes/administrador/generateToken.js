const jwt = require('jsonwebtoken')

function generateToken(resultId) {
  const secret = process.env.SECRET
  
  return (
    jwt.sign(
      {
        adminId: resultId,
        isAdmin: false
      },
      secret,
      { expiresIn: '1d' }
    )
  )

}

module.exports.generateToken = generateToken
