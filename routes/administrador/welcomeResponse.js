
const db = require('../../dbConfig')
const { actualTime } = require('../../helpers/timer')
const { unixtimeToTimestamp } = require('../../helpers/unixtimeToTimestamp')

function welcomeResponse(res, result, resultUser, token) {
  // establecer ultimo login (hora acutal)
  let last_login = actualTime()

  let timestamp = unixtimeToTimestamp(last_login).toString()

  console.log('Usuario ha sido logueado', timestamp)
  
  // setear active=true en tblperson
  let sqlPerson = `UPDATE tblperson SET active=1 WHERE email='${result.email}'`

  let queryPerson = db.query(sqlPerson, (err, resultPerson) => {
    // errores
    if(err) return res.status(400).send(err.sqlMessage)

    //console.log('resultPerson', resultPerson)

    // actualizamos el last_login de tblusers
    let sql = `UPDATE tblusers SET last_login='${timestamp}' WHERE person_id=${resultUser.person_id}`

    let queryUser = db.query(sql, (err, resultUser) => {
      if (err) return res.status(400).send(err.code + ' ' + err.sqlMessage)
  
      return res.status(200).send({ 
        message: `Welcome ${result.firstname}`, 
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        roll: result.roll,
        timestamp,
        active: true 
        /* token: token  */
      })
    })
  })

  

  
}

module.exports.welcomeResponse = welcomeResponse