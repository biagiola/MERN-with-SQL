const db = require('../dbConfig')
const bcrypt = require('bcryptjs')
const { generateToken } = require('./generateToken')
const { welcomeResponse } = require('./welcomeResponse')
const { 
  actualTime, 
  dentroDe5Seg, 
  dentroDe10Seg, 
  dentroDe15Seg,
  dentroDe20Seg, 
  dentroDe1Min,
  dentroDe2Min,
  dentroDe30Min,
  dentroDe60Min,
  dentroDe30Dias,
  hace30Dias,
} = require('../helpers/timer') 
const { unixtimeToTimestamp } = require('../helpers/unixtimeToTimestamp')
const { rolesAndPermissions } = require('./rolesAndPermissionsList')
const { months } = require('./months')

const registerAccount = (req, res) => {

  let { 
    firstname, 
    lastname,
    email, 
    password, 
    role_id, 
    permission_id 
  } = req.body

  console.log(
    'firstname',    firstname, 
    '\nlastname',   lastname,
    '\nemail',      email, 
    '\npassword',   password, 
    '\nrole_id',    role_id, 
    '\npermission_id', permission_id 
  )

  let sqlExistUser = `SELECT email FROM tbl_users WHERE email='${email}'`
  
  db.query(sqlExistUser, (err, result) => {
    console.log('result[0].email', result[0])
    // erros
    if (err) return res.status(402).send({ message: err.sqlMessage })
    
    // if user exist...
    console.log('sqlExistUser?... yes.')
    
    // user already exists
    if (result[0]) {
      return res.status(401).send({ message: 'User already exists'})
    } else {
      // tiempo en unixtime
      let unixtime = actualTime() 
      // convertir a timestamp
      let timestamp  = unixtimeToTimestamp(unixtime)

      // hash password
      password = bcrypt.hashSync(password, 10)

      // user data
      let userData = {
        firstname,
        lastname,
        email,
        password,
        date_in: timestamp,
        active: 0,
        role_id: role_id,
        permission_id: permission_id
      }

      /* ADD tbl_user */
      let sqlUser = 'INSERT INTO tbl_users SET ?'

      // query tbl_user
      db.query(sqlUser, userData, (err, resultUser) => {
        console.log('query tbl_user')
        
        // errors
        if(err) return res.status(400).send({ message: err.sqlMessage })

        // user id inserted
        console.log('result.insertId', resultUser.insertId)

        // relación tbl_users -> tbl_role_user
        /* ADD tbl_role_user */
        let sqlRoleUser = `INSERT INTO tbl_role_user SET ?`
        
        // role_user data
        let roleUserData = { 
          user_id: resultUser.insertId,
          role_id: rolesAndPermissions[role_id].id
        }

        // query tblrole_user
        db.query(sqlRoleUser, roleUserData, (err, resultRoleUser) => {
          console.log('query tbl_role_user')
          console.log('resultRoleUser', resultRoleUser)
          
          // errors
          if (err) return res.status(400).send({ message: err.sqlMessage })

          let timestampT = timestamp.replace(" ", "T")

          let stringDate = timestampT.toString()
          let splitDate = stringDate.split('T')
          //let monthName = splitDate[1]
          
          console.log('splitDate**', splitDate) // date and hour -> [ '2021-06-17', '13:24:18' ]

          // slipt date
          let splitDate0 = splitDate[0].toString()
          let newSplitDate0 = splitDate0.split('-')  

          // concatenate
          console.log('year', newSplitDate0[0])
          console.log('month', newSplitDate0[1])
          console.log('date', newSplitDate0[2])
          console.log('hour', splitDate[1])
          //               date                month               year
          let newDate = `${newSplitDate0[1]}-${newSplitDate0[2]}-${newSplitDate0[0]}`

          /* let date = `${months[monthName]}-${splitDate[2]}-${splitDate[3]}`
          let hour = splitDate[4]

          result.date = date
          result.hour = hour */
        
          return res.status(200).send({
            message: 'User was added' ,
            //firstname: firstname ,
            //lastname: lastname,
            //role_id: role_id,
            //email: email,
            date_in: timestampT,
            date: newDate,
            hour: splitDate[1]
            //permission_id: permission_id,
          })
        })
      })
    }
  })  
}

const loginAccount = (req, res) => {
  console.log('/login')

  let { email, password } = req.body
  console.log(email, password)

  // buscar en tbl_users con el email
  let sqlUser = `SELECT * FROM tbl_users WHERE email='${email}'`

  db.query(sqlUser, (err, result) => {
    console.log('query sqlUser')

    // comprobar si se ha encontrado la cuenta en tbl_users
    if (err) return res.status(400).send(err.sqlMessage)

    if(result.length) {
      console.log('result', result)
      // establecer el role_id y user_id
      let { role_id, user_id } = result[0]
      console.log('role_id, user_id',role_id, user_id)
      
      // ADMINS 
      if(role_id == 0) { 
        let sqlAdmin = `SELECT * FROM tbl_users WHERE email='${email}'`
        
        db.query(sqlAdmin, (err, result) => {
          // erros
          if(err) return res.status(400).send(err.sqlMessage)
          
          console.log('query sqlAdmin')
      
          // validación CONTRASEÑA
          if(bcrypt.compareSync(password, result[0].password)) {
            console.log('contraseña es correcta')

            return welcomeResponse(res, result[0])
      
          } else {
            return res.status(400).send({ message: 'Password is wrong.' })
          }
        })
      }

      // USERS
      if(role_id == 1) {
        let sqlUser = `SELECT * FROM tbl_users WHERE email='${email}'`

        db.query(sqlUser, (err, resultUser) => {  
          console.log('query slqUser')

          // erros
          if(err) return res.status(400).send(err.sqlMessage)

          // CONTRASEÑA CORRECTA
          if (bcrypt.compareSync(password, result[0].password)) {
            console.log('contraseña es correcta')
      
            // si NO está blocked
            if ( resultUser[0].blocked == false ) { // blocked = 0
              console.log('si NO está blocked', resultUser[0].blocked == false)
              
              // caducacion 30 dias?
              if (result[0].date_in <= hace30Dias()) {
                res.status(400).send('Han pasado 30 días. Necesita actualizar contraseña')
              } else {
      
                console.log(`Bienvenido ${result[0].firstname}`)
      
                // generamos token
                const token = generateToken(result[0].id)
                
                // usuario ha sido logueado... return usuario
                welcomeResponse(res, result[0], resultUser[0], token)
                
              }
            }
              
            // si está blocked
            if ( resultUser[0].blocked == true ) {
              console.log('si está blocked', result[0].blocked == true)
              
              let timeNow = actualTime()
              
              // si no ha paso el tiempo de espera
              if ( timeNow < result[0].wait_until && result[0].wait_until != null ) {
                console.log('No ha pasado tiempo de espera ', timeNow < result[0].wait_until)
                return res.status(400).send({ message: 'Password correct but user is still blocked.'})
              }
      
              // si ha pasado el tiempo de espera
              if ( timeNow > result[0].wait_until && result[0].wait_until != null ) {
                console.log('Ha pasado tiempo de espera ', timeNow > result[0].wait_until)
      
                // desbloqueamos al usuario
                let sql = `UPDATE tbl_users SET blocked=0, attempts=0, wait_until=null WHERE email='${result[0].email}'`
      
                let query = db.query(sql, (err, result) => {
                  if(err) throw err;
                  console.log(err)
                })
      
                console.log(`Bienvenido ${result[0].firstname}`)
                
                // generamos token
                const token = generateToken(result[0].id)
                
                // usuario ha sido logueado... return usuario
                welcomeResponse(res, result[0], token)
              
              } 
            }
          } else {
          // CONTRASEÑA INCORRECTA.
            console.log('contraseña es incorrecta')
            
            // si NO está blocked
            if (result[0].blocked == false) { // blocked = 0  // attempts = (1,2,3,4,6,8)
              
              console.log('si NO está blocked', result[0].blocked == false)
      
              // si ha pasado 1 hora del bloqueo automático
              if(result[0].wait_until > dentroDe60Min()) {
                console.log('Ha pasado 1 hora. Desbloqueo automático')
                
                // generamos el token
                let token = generateToken(result[0].id)
                
                // usuario ha sido logueado... return usuario
                welcomeResponse(res, result[0], token)
              }
              
              // si intentos (1,2,3,4, 6,8)...; son los intentos donde no hay tiempo de espera
              if ( (result[0].attempts >=0 && result[0].attempts < 5) || result[0].attempts == 6 || result[0].attempts == 8  ) {
                
                console.log('intento: ', result[0].attempts)
      
                if ( result[0].attempts < 4 ) { // intentos = 0, 1, 2, 3, 
                  console.log('intento 1,2,3: ', result[0].attempts)

                  let attempts = (result[0].attempts) + 1
      
                  let sql = `UPDATE tbl_users SET blocked=0, attempts=${attempts}, wait_until=null WHERE email='${email}'`
      
                  let query = db.query(sql, (err, result) => {
                    console.log(result)
                    if(err) throw error
                    return res.status(400).send({ message: `Password is wrong. Attempt number = ${attempts}. Try it again.`})
                  })
                }
      
                if ( result[0].attempts == 4 ) { // intento = 4
                  console.log('intento cuatro: ', result[0].attempts)

                  let attempts = (result[0].attempts) + 1
                  let wait_until = dentroDe10Seg()
                  
                  let sql = `UPDATE tbl_users SET blocked=1, attempts=${attempts}, wait_until=${wait_until} WHERE email='${email}'`
      
                  let query = db.query(sql, (err, result) => {
                    console.log(result)
                    if(err) throw error
                    return res.status(400).send({ message: `Password is wrong. Attempt number = 5. blocked for 10 seconds.`})
                  })
                }
      
                if ( result[0].attempts == 6 ) { // intentos = 6
                  console.log('intento  6: ', result[0].attempts)
                  let attempts = (result[0].attempts) + 1 
                  let wait_until = dentroDe15Seg()
      
                  let sql = `UPDATE tbl_users SET blocked=1, attempts=${attempts}, wait_until=${wait_until} WHERE email='${email}'`
      
                  let query = db.query(sql, (err, result) => {
                    console.log(result)
                    if(err) throw error
                    return res.status(400).send({ message: `Password is wrong. Attempt number = 7. blocked for 15 seconds.`})
                                          
                  })
                }
      
                if ( result[0].attempts == 8 ) { // intentos = 8
                  console.log('intentos 8: ', result[0].attempts)
                      
                  let attempts = (result[0].attempts) + 1
      
                  let sql = `UPDATE tbl_users SET attempts=${attempts}, blocked=1, wait_until=111  WHERE email='${email}'`
                  
                  let query = db.query(sql, (err, result) => {
                    console.log(result)
                    // Enviar aviso al usuario
                    if(err) throw error
                    return res.status(400).send({ message: `User ${ email } was blocked indefinately. Contact with the administrator.`})
                  }) 
                }
              }
            } 
            
            // si está blocked
            if ( result[0].blocked == true ) {
              console.log('sí está bloqueado')
              
              // si pasó el tiempo de espera
              if(actualTime() > result[0].wait_until && result[0].wait_until !== 111) { // tiempo de espera == blocked permanentemente
                console.log('si paso el tiempo de espera', actualTime() > result[0].wait_until )
                // seguir
                console.log(result[0].attempts)
      
                if ( result[0].attempts == 5 || result[0].attempts == 7 || result[0].attempts == 7 ) {
                  switch (result[0].attempts) {
                    case 5:
                      console.log('case intentos 5: ', result[0].attempts)
                      
                      //let wait_untilCase5 = dentroDe15Seg()
                      let attemptsCase5 = (result[0].attempts) + 1
        
                      let sqlPrimerCase5 = `UPDATE tbl_users SET attempts=${attemptsCase5}, blocked=0, wait_until=null  WHERE email='${result[0].email}'`
                      
                      let queryCase5 = db.query(sqlPrimerCase5, (err, result) => {
                        console.log(result)
                        if(err) throw error
                        return res.status(400).send({ message: `Password is wrong. Attempt number = 6. Try it again.`})
                                              
                      })
                      break;
        
                    case 7:
                      console.log('case intentos 7: ', result[0].attempts)
                      
                      let attemptsCase7 = (result[0].attempts) + 1
        
                      let sqlPrimerCase7 = `UPDATE tbl_users SET attempts=${attemptsCase7}, blocked=0, wait_until=null  WHERE email='${result[0].email}'`
                      
                      let queryCase9 = db.query(sqlPrimerCase7, (err, result) => {
                        console.log(result)
                        if(err) throw error
                        return res.status(400).send({ message: `Password is wrong. Attempt number = 8. Try it again.`})  
                      }) 
                      break;
      
                    case 9:
                      console.log('case intentos 9: ', result[0].attempts)
                  
                    default:
                      break;
                  }
                }
              
              // si no paso el tiempo de espera
              } else {
                console.log('no pasó el tiempo de espera') // o... wait_until == 111 == bloqueado permanentemente
      
                // Enviar aviso al usuario
                if( result[0].attempts > 8 ) { // en este punto intentos en la DB = 9; y no cambia más ese valor
                  return res.status(400).send({ message: `User ${ result[0].email } was blocked indefinitely. Contact with the administrator.` })
                }
      
                // si pasó 1 hora del desbloqueo automático
                if( result[0].wait_until > dentroDe60Min()) {
                  // desbloqueamos usuario 
                  let sql = `UPDATE tbl_users SET blocked=0, attempts=0, wait_until=null WHERE email='${email}'`
      
                  let query = db.query(sql, (err, result) => {
                    if (err) throw err
                    console.log(err)
      
                    // generamos el token
                    generateToken(result[0].id)
      
                    // logueamos usuario... return usuario
                    welcomeResponse(res, result[0], token)
                    
                  })
          
                } else { // si NO pasó 1 hora del desbloqueo automático
                  return res.status(400).send({ message: 'User is still blocked.' })
                }
      
                // si está blocked pero no ha pasado ningun tiempo de espera
                return res.status(400).send({ message: 'User is still blocked.' })
              }
            }
          }
        })
      }
    } else {
      return res.status(400).send({ message: 'user not found'})
    }
  })
}

const logoutAccount = (req, res) => {
  console.log('/logout ')

  let { email, role_id } = req.body

  console.log('email, role_id', email, role_id)

  // buscar el usuario en tbl_user
  let sqlUser = `SELECT * FROM tbl_users WHERE email='${email}'`

  db.query(sqlUser, (err, result) => {
    console.log('query sqlUser')
    // erros
    if (err) return res.status(400).send(err.sqlMessage)
      
    // de acuerdo a su role_id buscar en tbl_users
    //console.log('role_id, user_id', role_id, user_id)

    // set active = 0
    let sqlActive = `UPDATE tbl_users SET active=0 WHERE email='${email}'` 

    db.query(sqlActive, (err, resultActive) => {
      console.log('query sqlActive')

      // erros
      if (err) return res.status(400).send(err.sqlMessage)

      if (role_id == 0) 
        return res.status(200).send({ message: `Admin ${email} has been logout.`})

      if (role_id == 1) 
        return res.status(200).send({ message: `User ${email} has been logout.`})
    })
  })
}

const updateAccount = (req, res) => {
  console.log('/update')

  let { firstname, lastname, email, role_id } = req.body
  
  console.log(
    'firstname: ', firstname, 
    '\nlastname: ',lastname, 
    '\nemail: ', email,
    '\nrole_id: ', role_id)

  // editar admin
  if(role_id == 0) {
    console.log('you reach update, admin')

    // sentencia sql
    let sqlUpdateAdmin = 
    `UPDATE tbl_users 
     SET firstname='${firstname}', lastname='${lastname}', role_id='${role_id}' 
     WHERE email='${email}'
    `

    //query
    db.query(sqlUpdateAdmin, (err, resultUpdateAdmin) => {
      console.log('sqlUpdateAdmin')
      // erros
      if (err) return res.status(400).send(err.sqlMessage)
      
      console.log('resultUpdateAdmin',resultUpdateAdmin)
      return res.status(200).send(resultUpdateAdmin)

    })
  }
  
  // editar usuario
  if(role_id == 1) {
    console.log('you reach update, user')

    // sentencia sql
    let sqlUpdateUser = `UPDATE tbl_users SET firstname='${firstname}', lastname='${lastname}', role_id='${role_id}' WHERE email='${email}'`

    //query
    db.query(sqlUpdateUser, (err, resultUpdateUser) => {
      console.log('sqlUpdateUser')

      // erros
      if (err) return res.status(400).send(err.sqlMessage)
      
      console.log('resultUpdateUser',resultUpdateUser)
      return res.status(200).send(resultUpdateUser)

    })
  }
}

const deleteAccount = (req, res) => {
  console.log('/delete')

  let { email, role_id } = req.body.source
  
  console.log('email:', email, 'role_id:', role_id)

  // buscar y seleccionar cuenta
  let sqlSelectUser = `SELECT user_id FROM tbl_users WHERE email='${email}'`

  db.query(sqlSelectUser, (err, resultUser) => {
    console.log('query sqlSelectUser')
    let { user_id } = resultUser[0]
    console.log('resultUser', user_id)

    // erros
    if (err) return res.status(400).send(err.sqlMessage)

    // Delete tbl_role_user 
    let sqlDeleteRoleUser = `DELETE FROM tbl_role_user WHERE user_id='${user_id}'`
    
    db.query(sqlDeleteRoleUser, (err, resultRoleUser) => {
      console.log('query sqlDeleteRoleUser')

      // erros
      if (err) return res.status(400).send(err.sqlMessage)

      // Delete tbl_users 
      let sqlDeleteUser = `DELETE FROM tbl_users WHERE email='${email}'`

      db.query(sqlDeleteUser, (err, result) => {
        if (role_id == 0) 
          return res.status(200).send({ message: `Admin ${email} was deleted succesfully.`})
        
        if (role_id == 1) 
          return res.status(200).send({ message: `User ${email} was deleted succesfully.`})
      })
    })
  })
}

const getAccounts = (req, res) => {
  console.log('/getAccounts')

  // traermos todas las cuentas
  let sqlAccounts = 'SELECT * from tbl_users'

  db.query(sqlAccounts, (err, resultAccounts) => {
    console.log('query sqlAccounts')

    // errors
    if (err) return res.status(400).send({ message: err.sqlMessage })

    let listOfUsers = []

    resultAccounts.map( result => {
      console.log('result', result)
      
      let stringDate = result.date_in.toString()
      let splitDate = stringDate.split(' ')
      let monthName = splitDate[1]
      
      /* console.log('month', months[monthName])
      console.log('date', splitDate[2])
      console.log('year', splitDate[3])
      console.log('hour', splitDate[4]) */

      let date = `${months[monthName]}-${splitDate[2]}-${splitDate[3]}`
      let hour = splitDate[4]

      result.date = date
      result.hour = hour

      delete result.password
      delete result.user_id
      
      // change role_id field to role
      let role = result.role_id
      delete result.role_id
      result.role = role

      listOfUsers.push(result)
    })

    console.log('months', months.Jun)

    /* console.log('admins', admins)
    console.log('users', users) */
    //console.log('listOfUsers', listOfUsers)

    return res.status(200).send({
      message: 'List of all accounts',
      listOfUsers: listOfUsers,
      /* admins: admins,
      users: users */
    })
  })
}

module.exports = {
  loginAccount,
  registerAccount,
  logoutAccount,
  updateAccount,
  deleteAccount,
  getAccounts
}