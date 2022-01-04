
const db = require('../dbConfig')
const { actualTime } = require('../helpers/timer')
const { unixtimeToTimestamp } = require('../helpers/unixtimeToTimestamp')

function welcomeResponse(res, result, resultUser, token) {
  // establecer ultimo login (hora acutal)
  let last_login = actualTime()

  let timestamp = unixtimeToTimestamp(last_login).toString()

  
  
  // setear active=true en tbl_users y
  // actualizamos el last_login de tbl_users
  //let sqlUser = `UPDATE tbl_users SET last_login='${timestamp}',active=1 WHERE email='${result.email}'`

  let sqlUser = `UPDATE tbl_users SET last_login='${timestamp}' WHERE email='${result.email}'`

  db.query(sqlUser, (err, resultUser) => {
    console.log('Usuario ha sido logueado0', timestamp)
    // errores
    if(err) return res.status(400).send(err.sqlMessage)

    console.log('Usuario ha sido logueado1', timestamp)

    console.log('resultUser', resultUser)
    console.log('result.role_id', result.role_id)
  
    // ADMIN
    if(result.role_id == 0) {
      return res.status(200).send({ 
        message: `Welcome Admin ${result.firstname}`, 
        user_id: result.user_id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email, 
        role_id: result.role_id,
        date_in: timestamp,
        // active: true, // admin no tiene este campo
        permissions_id: result.permissions_id, 
        /* token: token  */
      })
    }

    if(result.role_id == 1) {
      return res.status(200).send({ 
        message: `Welcome user ${result.firstname}`, 
        user_id: result.user_id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        role_id: result.role_id,
        date_in: timestamp,
        active: true,
        permissions_id: result.permissions_id
        /* token: token  */
      })
    }

  })
}

module.exports.welcomeResponse = welcomeResponse