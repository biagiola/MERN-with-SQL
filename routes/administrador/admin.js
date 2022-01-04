const express = require('express')
const router = express.Router()
const db = require('../../dbConfig')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const { generateToken } = require('./generateToken')
const { welcomeResponse } = require('./welcomeResponse')
const { 
  actualTime, 
  dentroDe5Seg, 
  dentroDe10Seg, 
  dentroDe20Seg, 
  dentroDe1Min,
  dentroDe2Min,
  dentroDe30Min,
  dentroDe30Dias,
  hace30Dias,
} = require('../../helpers/timer') 
const { unixtimeToTimestamp } = require('../../helpers/unixtimeToTimestamp')

// registrar admin o user
router.post('/register', (req, res) => {
  let { firstname, lastname, email, password, roll } = req.body
  console.log(firstname, lastname, email, password, roll)
  // tiempo en unixtime
  let unixtime = actualTime() 
  
  // convertir a timestamp
  let timestamp  = unixtimeToTimestamp(unixtime)
  
  // hash password
  password = bcrypt.hashSync(password, 10)

  // person data
  let personData = {
    firstname,
    lastname,
    roll,
    email,
    password,
    date_in: timestamp,
    active: 0
  }

  console.log('admin/register')

  // sentencia sql person
  let sqlPerson = 'INSERT INTO tblperson SET ?'

  // query person
  let queryPerson = db.query(sqlPerson, personData, (err, result) => {
    console.log('queryPerson')
    // errores
    if(err) 
      return res.status(400).send({ message: err.code + ' ' + err.sqlMessage})


    // guardamos id
    console.log('result.insertId', result.insertId)
    let person_id = result.insertId
    
    // relación tblperson -> tbladmins || tblusers
    console.log('roll', roll)
    switch (roll) {
      case 'admin':
        let { permissions_level } = req.body
        
        if (permissions_level) {
          // admin extra data
          let adminData = { 
            permissions_level,
            person_id
          }

          // sentencia sql admin
          let sqlAdmin = `INSERT INTO tbladmins SET ?`
          console.log('queryAdmin')
          // query
          let queryAdmin = db.query(sqlAdmin, adminData, (err, resultAdmin) => {
            if (err) return res.status(400).send(err.sqlMessage)

            return res.send({
              message: 'Admin was added' ,
              firstname: firstname ,
              lastname: lastname,
              roll: roll,
              email: email,
              date_in: timestamp,
              permissions_level: permissions_level,
              person_id: person_id,
              admin_id: resultAdmin.insertId
            })
            
          })
          break;
        } else {
          console.log('Permissions level was not provided.')
          return res.status(400).send({ message: 'Permissions level was not provided.'})
        }
  
      case 'user':
        // define user data
        let userData = {
          date_out: null,
          last_login: null,
          last_pass_changed: null,
          last_remember: null,
          blocked: 0,
          attempts: 0,
          wait_until: null,
          person_id
        }
        
        // sentencia sql user
        let sqlUser = `INSERT INTO tblusers SET ?`

        // query
        let queryUser = db.query(sqlUser, userData, (err, resultUser) => {
          if (err) return res.status(400).send(err.sqlMessage)

          return res.send({
            message: 'User was added' ,
            firstname: firstname ,
            lastname: lastname,
            roll: roll,
            email: email,
            date_in: timestamp,
            person_id: person_id,
            user_id: resultUser.insertId
          })
        })
        break;
    
      default:
        console.log('Roll is not correct.')
        return res.status(400).send({ message: 'Permissions level was not provided.'})
        //return res.status(400).send({ message: 'Roll is not correct.'})
    }
  })
})

// loguear admin o user
router.post('/login', (req, res) => {
  let { email, password } = req.body
  console.log(email, password)

  // buscar en tblperson con el email
  let sqlPerson = `SELECT * FROM tblperson WHERE email='${email}'`

  let queryPerson = db.query(sqlPerson, (err, result) => {
    // establecer el roll y person_id
    let { roll, person_id, active } = result[0]
    console.log('roll, person_id',roll, person_id, active)

    // comprobar si se ha encontrado la cuenta en tblperson
    if (err) return res.status(400).send(err.sqlMessage)
    
    if(roll == 'admin') {
      let sqlAdmin = `SELECT * FROM tblperson, tbladmins WHERE email='${email}'`

      let query = db.query(sqlAdmin, (err, result) => {
        if(err) 
          return res.status(400).send(err.sqlMessage)
        
    
        // validación CONTRASEÑA
        if(bcrypt.compare(password, result[0].password)) {
          return res.status(200).send({ 
            message: 'Welcome Admin', 
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            roll: result[0].roll,
            email: result[0].email, 
            date_in: result[0].date_in,
            person_id: result[0].person_id,
            admin_id: result[0].admin_id,
            permissions_level: result[0].permissions_level
          })
    
        } else {
          res.status(400).send('Password is wrong.')
        }
      })
    }

    if(roll == 'user') {
      let sqlUser = `SELECT * FROM tblusers WHERE person_id='${person_id}'`

      let query = db.query(sqlUser, (err, resultUser) => {  
        // validación EMAIL.
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
              console.log(`Bienvenido ${result[0].firstname}`)
    
              // desbloqueamos al usuario
              let sql = `UPDATE tblusers SET blocked=0, attempts=0, wait_until=null WHERE email='${result[0].email}'`
    
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
                // Wblock = 0
                // wait_until = null
                // i++
                console.log('intento 1,2,3: ', result[0].attempts)
                let attempts = (result[0].attempts) + 1
    
                let sql = `UPDATE tblusers SET blocked=0, attempts=${attempts}, wait_until=null WHERE email='${email}'`
    
                let query = db.query(sql, (err, result) => {
                  if(err) throw err
                  console.log(result)
                  return res.status(200).send({ message: `Password is wrong. Attempt number = ${attempts}. Try it again.`})
                })
              }
    
              if ( result[0].attempts == 4 ) { // intento = 4
                // Wblock = 0
                // wait_until = 1min
                // i++
                console.log('intento cuatro: ', result[0].attempts)
                let attempts = (result[0].attempts) + 1
                let wait_until = dentroDe10Seg()
                
                let sql = `UPDATE tblusers SET blocked=1, attempts=${attempts}, wait_until=${wait_until} WHERE email='${email}'`
    
                let query = db.query(sql, (err, result) => {
                  if(err) throw err
                  console.log(result)
                  return res.status(200).send({ message: `Password is wrong. Attempt number = 5. blocked for 10 seconds.`})
                })
              }
    
              /* if (timer.actualTime > result[0].wait_until && result[0].wait_until != null) { */
              //console.log('Ha pasado tiempo de espera.', timer.actualTime > result[0].wait_until)
              // 1.2
    
              if ( result[0].attempts == 6 ) { // intentos = 6
                console.log('intento  6: ', result[0].attempts)
                // Wblock = 1
                // wait_until = null
                // i++
                let attempts = (result[0].attempts) + 1 
                let wait_until = dentroDe15Seg()
    
                let sql = `UPDATE tblusers SET blocked=1, attempts=${attempts}, wait_until=${wait_until} WHERE email='${email}'`
    
                let query = db.query(sql, (err, result) => {
                  if(err) throw err
                  console.log(result)
                  return res.status(200).send({ message: `Password is wrong. Attempt number = 7. blocked for 15 seconds.`})
                                        
                })
              }
    
              if ( result[0].attempts == 8) { // intentos = 8
                console.log('intentos 8: ', result[0].attempts)
                    
                let attempts = (result[0].attempts) + 1
    
                let sql = `UPDATE tblusers SET attempts=${attempts}, blocked=1, wait_until=111  WHERE email='${email}'`
                
                let query = db.query(sql, (err, result) => {
                  if(err) throw err
                  console.log(result)
                  
                  // Enviar aviso al usuario
                  return res.status(400).send(`User ${ result[0].email } was blocked indefinately. Contact with the administrator.`)
                }) 
              }
            }
          } 
          
          // si está blocked
          if ( result[0].blocked == true ) {
            console.log('si está bloqueado')
            
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
      
                    let sqlPrimerCase5 = `UPDATE tblusers SET intentos=${attemptsCase5}, blocked=0, wait_until=null  WHERE email='${result[0].email}'`
                    
                    let queryCase5 = db.query(sqlPrimerCase5, (err, result) => {
                      if(err) throw err
                      console.log(result)
                      return res.status(400).send({ message: `Password is wrong. Attempt number = 6. Try it again.`})
                                            
                    })
                    break;
      
                  case 7:
                    console.log('case intentos 7: ', result[0].attempts)
                    
                    let attemptsCase7 = (result[0].attempts) + 1
      
                    let sqlPrimerCase7 = `UPDATE tblusers SET intentos=${attemptsCase7}, blocked=0, wait_until=null  WHERE email='${result[0].email}'`
                    
                    let queryCase9 = db.query(sqlPrimerCase7, (err, result) => {
                      if(err) throw err
                      console.log(result)
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
    
              if( result[0].attempts > 8 ) { // en este punto intentos en la DB = 9; y no cambia más ese valor
                // Enviar aviso al usuario
                return res.status(400).send({ message: `User ${ result[0].email } was blocked indefinitely. Contact with the administrator.` })
              }
    
              // si pasó 1 hora del desbloqueo automático
              if( result[0].wait_until > dentroDe60Min()) {
                // desbloqueamos usuario 
                let sql = `UPDATE tblusers SET bloqueodo=0, intentos=0, wait_until=null WHERE email='${email}'`
    
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
  })
})

// logout user
router.post('/logout', (req, res) => {
  console.log('logout req.body.email', req.body.email)

  let { email } = req.body

  // buscar el usuario en tblperson
  let sqlPerson = `SELECT * FROM tblperson WHERE email='${email}'`

  let query = db.query(sqlPerson, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)
      
      // de acuerdo a su roll buscar en tbladmin or tbluser
      let { roll, person_id } = result[0]
      console.log('roll, person_id', roll, person_id)

      if(roll == 'admin') {
        // si es tbladmins no hace falta editar la tabla
        // set active = 0
        let sqlAdmin = `UPDATE tblperson SET active=0 WHERE person_id=${person_id}` 

        let queryAdmin = db.query(sqlAdmin, (err, resultAdmin) => {
          if (err) return res.status(400).send(err.sqlMessage)

          return res.status(200).send({ message: `Admin ${email} has been logout.`})
        })
      }

      if(roll == 'user') {
        // set active = 0
        let sqlUser = `UPDATE tblperson SET active=0 WHERE person_id=${person_id}` 

        let queryUser = db.query(sqlUser, (err, resultUser) => {
          if (err) return res.status(400).send(err.sqlMessage)

          return res.status(200).send({ message: `User ${email} has been logout.`})
        })
      }
  })


  /* return res.status(200).send({
    message: `User ${req.body.email} was logout`,
    email: req.body.email
  }) */
  
})

// mostrar todas las cuentas
router.post('/getAccounts', (req, res) => {
  // traermos todas las cuentas
  let sqlAccounts = 'SELECT * from tblperson'

  let queryAccounts = db.query(sqlAccounts, (err, resultAccounts) => {
    // errores
    if (err) return res.status(400).send(err.sqlMessage)

    // discriminamos tipo de cuenta admin o user
    let admins  = []
    let users = []

    resultAccounts.map( result => {
      console.log('result map', result.roll)

      delete result.password
      delete result.person_id

      if(result.roll == 'admin') {
        admins.push(result)
      } 
      if(result.roll == 'user') {
        users.push(result)
      }
    })

    console.log('admins', admins)
    console.log('users', users)

    return res.status(200).send({
      message: 'List of all accounts',
      admins: admins,
      users: users
    })
  })
})

// editar admin o user
router.put('/update', (req, res) => {
  let { firstname, lastname, email, roll } = req.body
  console.log('/update', firstname, lastname, email, roll)

  // editar usuario
  if( roll == 'admin') {
    console.log('you reach update, admin')

    // sentencia sql
    let sqlUpdateAdmin = `UPDATE tblperson SET firstname='${firstname}', lastname='${lastname}', roll='${roll}' WHERE email='${email}'`

    //query
    let queryUpdateAdmin = db.query(sqlUpdateAdmin, (err, resultUpdateAdmin) => {
      if (err) return res.status(400).send(err.sqlMessage)
      
      console.log('resultUpdateAdmin',resultUpdateAdmin)
      return res.status(200).send(resultUpdateAdmin)

    })
  }
  
  // editar usuario
  if( roll == 'user') {
    console.log('you reach update, user')

    // sentencia sql
    let sqlUpdateUser = `UPDATE tblperson SET firstname='${firstname}', lastname='${lastname}', roll='${roll}' WHERE email='${email}'`

    //query
    let queryUpdateUser = db.query(sqlUpdateUser, (err, resultUpdateUser) => {
      if (err) return res.status(400).send(err.sqlMessage)
      
      console.log('resultUpdateUser',resultUpdateUser)
      return res.status(200).send(resultUpdateUser)

    })
  }
})

// eliminar admin o user
router.delete('/delete', (req, res) => {
  let { email, roll } = req.body.source
  console.log('/delete', email, roll)
  
  // buscar y seleccionar cuenta
  let sqlPerson = `SELECT * FROM tblperson WHERE email='${email}'`

  console.log('sqlPerson', sqlPerson)

  // delete admin
  if( roll == 'admin') {
        
    let queryPerson = db.query(sqlPerson, (err, result) => {
      if (err) return res.status(400).send(err.sqlMessage)

      console.log('person_id', result[0].person_id)
      let person_id = result[0].person_id
      
      // una vez encontrado el person_id borrarlo de tbladmins (tabla dependiente)
      let sqlDeleteAdmin = `DELETE FROM tbladmins WHERE person_id=${person_id}`

      let queryDeleteAdmin = db.query(sqlDeleteAdmin, (err, resultAdmin) => {
        if(err) res.status(400).send(err.sqlMessage)

        console.log('delete admin from tbladmins done')
        
        // una vez que el usuario ha sido eliminado en tbluser, eliminarlo de tblperson (tabla madre)
        let sqlDeletePerson = `DELETE FROM tblperson WHERE person_id=${person_id}`

        let queryDeletePerson = db.query(sqlDeletePerson, (err, resultPerson) => {
          if (err) return res.status(400).send(err.sqlMessage)

          console.log('delete admin from tblperson done')

          return res.status(200).send({ message: 'Admin have been deleted succesfully.'})
        })
      })
    })
  }

  // delete user  
  if( roll == 'user') {
    // buscar a la persona en tblperson y usar person_id
    let sqlPerson = `SELECT * FROM tblperson WHERE email='${email}'`
    
    let queryPerson = db.query(sqlPerson, (err, result) => {
      if (err) return res.status(400).send(err.sqlMessage)

      console.log('person_id', result[0].person_id)
      let person_id = result[0].person_id
      
      // una vez encontrado el person_id borrarlo de tblusers (tabla dependiente)
      let sqlDeleteUser = `DELETE FROM tblusers WHERE person_id=${person_id}`

      let queryDeleteUser = db.query(sqlDeleteUser, (err, resultUser) => {
        if(err) res.status(400).send(err.sqlMessage)

        console.log('delete user from tblusers done')
        
        // una vez que el usuario ha sido eliminado en tbluser, eliminarlo de tblperson (tabla madre)
        let sqlDeletePerson = `DELETE FROM tblperson WHERE person_id=${person_id}`

        let queryDeletePerson = db.query(sqlDeletePerson, (err, resultPerson) => {
          if (err) return res.status(400).send(err.sqlMessage)

          console.log('delete user from tblperson done')

          return res.status(200).send({ message: 'User have been deleted succesfully.'})
        })
      })
    })
  }

  
})

// creamos tabla de Administradores
router.post('/crearTablaAdmins', (req, res) => {
  const crearTableAdmins = fs.readFileSync(
    path.join(__dirname, '../../sql/tbladmins.sql')
  ).toString()

  db.query(crearTableAdmins, (err, result) => {
    if(err) 
      return res.status(400).send(err.code + ' ' + err.sqlMessage)

    return res.status(200).send('Tabla "admins" ha sido creada.')
  })
})

// crear table person
router.post('/createTblPerson', (req, res) => {
  const createTblPerson = fs.readFileSync(
    path.join(__dirname, '../../sql/tblperson.sql')
  ).toString()

  let query = db.query(createTblPerson, (err, result) => {
    if (err) 
      return res.status(400).send(err.sqlMessage)

    console.log(result)

    return res.status(200).send({ result: result })
  })
})

// eliminar tabla person
router.delete('/deleteTblPerson', (req, res) => {
  let sql = 'DROP TABLE tblperson'

  db.query(sql, (err, result) => {
    // if(err) throw err
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)
      
    
    return res.status(200).send('Tabla "person" ha sido eliminada.')
  })
}) 

// eliminar tabla de administradores.
router.delete('/borrarTablaAdmins', (req, res) => {
  let sql = 'DROP TABLE tbladmins'

  db.query(sql, (err, result) => {
    // if(err) throw err
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)
      
    
    return res.status(200).send('Tabla "admins" ha sido eliminada.')
  })
})  

// eliminar todos los administradores de la tabla (vaciar).
router.delete('/borrarTodoAdmins', (req, res) => {
  let sql = 'DELETE FROM tbladmins;'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)

    return res.status(200).send('Tabla "admins" ha sido vaciada.')
  })
})

// creamos tabla de usuarios.
router.post('/crearTablaUsuarios', (req, res) => {
  const crearTableAdmins = fs.readFileSync(
    path.join(__dirname, '../../sql/tblusers.sql')
  ).toString()

  db.query(crearTableAdmins, (err, result) => {
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)
    
    return res.status(200).send('Tabla "usuarios" ha sido creada.')
  })
})

// eliminar tabla de usuarios.
router.delete('/borrarTablaUsuarios', (req, res) => {
  let sql = 'DROP TABLE tblusers'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)

    return res.status(200).send('Tabla "usuarios" ha sido eliminada.')
  })
})

// eliminar todos los usuarios de la tabla (vaciar).
router.delete('/borrarTodoUsuarios', (req, res) => {
  let sql = 'DELETE FROM tblusers;'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send(err.code + ' ' + err.sqlMessage)

    return res.status(200).send('Tabla "usuarios" ha sido vaciada.')
  })
})

// nulear intentos, bloqueos y tiempo de espera
router.post('/nulearIntentosUsuarios', (req, res) => {
  let { email } = req.body
  
  if (email) {
    let sql = `UPDATE tblusers SET blocked=0, attempts=0, wait_until=null WHERE email='${email}';`
    let query = db.query(sql, (err, result) => {
      if(err)
        return res.status(400).send(err.code + ' ' + err.sqlMessage)
      

      console.log(`Usuario ${email} ha sido nuleado. attempts = 0, blocked = 0, wait_until = null`)
      return res.status(200).send(`Usuario ${email} ha sido nuleado. attempts = 0, blocked = 0, wait_until = null`)
    })
  } else {
    let sql = 'UPDATE tblusers SET blocked=0, attempts=0, wait_until=null;'
    let query = db.query(sql, (err, result) => {
      if(err)
        return res.status(400).send(err.code + ' ' + err.sqlMessage)

      console.log('Tabla usuarios han sido nuleados. attempts = 0, blocked = 0, wait_until = null')
      return res.status(200).send('Tabla usuarios nuleados. attempts = 0, blocked = 0, wait_until = null')
    })
  }
})

// controllar tiempos
router.get('/getTimes', (req, res) => {
  console.log('Tiempo en UNIXTIME')
  console.log(actualTime(), 'actualTime')
  console.log(dentroDe5Seg(), 'dentroDe5Seg')
  console.log(dentroDe10Seg(), 'dentroDe10Seg')
  console.log(dentroDe20Seg(), 'dentroDe20Seg')
  console.log(dentroDe1Min(), 'dentroDe1Min')
  console.log(dentroDe2Min(), 'dentroDe2Min')
  console.log(dentroDe30Min(), 'dentroDe30Min')
  console.log(dentroDe30Dias(), 'dentroDe30Dias')
  console.log(hace30Dias(), 'hace30Dias')

  res.send(`
    ${actualTime()}, actualTime
    ${dentroDe5Seg()}, dentroDe5Seg
    ${dentroDe10Seg()}, dentroDe10Seg
    ${dentroDe20Seg()}, dentroDe20Seg
    ${dentroDe1Min()}, dentroDe1Min
    ${dentroDe2Min()}, dentroDe2Min
    ${dentroDe30Min()}, dentroDe30Min
    ${dentroDe30Dias()}, dentroDe30Dias
    ${hace30Dias()}, hace30Dias
  `)
})

router.post('/testTimestamp', (req, res) => {
  let unixtime = 1621721929830;
  let timestamp = unixtimeToTimestamp(unixtime)
  return res.status(200).send({
    'timestamp': timestamp
  })
})


module.exports = router

