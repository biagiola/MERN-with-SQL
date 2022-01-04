const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const db = require('../../dbConfig')
const { route } = require('../accounts/accounts')

/* TABLE MANIPULATIONS */

/* tblusers */
// crear tbl_users
router.post('/createTblUsers', (req, res) => {
  const crearTableAdmins = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_users.sql')
  ).toString()

  db.query(crearTableAdmins, (err, result) => {
    if(err) return res.status(400).send( err.sqlMessage)
    
    return res.status(200).send('Tabla "tbl_users" ha sido creada.')
  })
})
// eliminar tbl_users
router.delete('/deleteTblUsers', (req, res) => {
  let sql = 'DROP TABLE tbl_role_user'

  db.query(sql, (err, result) => {
    //if(err) return res.status(400).send(err.sqlMessage)

    let sql = 'DROP TABLE tbl_users'
  
    db.query(sql, (err, result) => {
      if(err) return res.status(400).send(err.sqlMessage)
  
      return res.status(200).send('Tabla "tbl_users" ha sido eliminada.')
    })
    
  })

})
// vaciar tbl_users
router.delete('/deleteAllUsers', (req, res) => {
  let sqlRoutes = 'DELETE FROM tbl_role_user'

  db.query(sqlRoutes, (err, result) => {
    if(err)
      return res.status(400).send(err.sqlMessage)
    
    let sql = 'DELETE FROM tbl_users;'

    db.query(sql, (err, result) => {
      if(err) return res.status(400).send(err.sqlMessage)

      return res.status(200).send('Tabla "tbl_users" ha sido vaciada.')
    })
  })  
})
// nulear intentos, bloqueos y tiempo de espera
router.post('/nulearIntentosUsuarios', (req, res) => {
  let { email } = req.body
  
  if (email) {
    let sql = `UPDATE tblusers SET blocked=0, attempts=0, wait_until=null WHERE email='${email}';`
    let query = db.query(sql, (err, result) => {
      if(err)
        return res.status(400).send( err.sqlMessage)
      

      console.log(`Usuario ${email} ha sido nuleado. attempts = 0, blocked = 0, wait_until = null`)
      return res.status(200).send(`Usuario ${email} ha sido nuleado. attempts = 0, blocked = 0, wait_until = null`)
    })
  } else {
    let sql = 'UPDATE tblusers SET blocked=0, attempts=0, wait_until=null;'
    let query = db.query(sql, (err, result) => {
      if(err)
        return res.status(400).send( err.sqlMessage)

      console.log('Tabla usuarios han sido nuleados. attempts = 0, blocked = 0, wait_until = null')
      return res.status(200).send('Tabla usuarios nuleados. attempts = 0, blocked = 0, wait_until = null')
    })
  }
})


/* crear tbl_role_user */
router.post('/createTblRoleUser', (req, res) => {
  const createTblRoles = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_role_user.sql')
  ).toString()

  let query = db.query(createTblRoles, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    console.log('createTblRoles')

    return res.status(200).send('Tabla "tbl_role_user" ha sido creada.')
    
  })
})
router.delete('/deleteTblRoleUser', (req, res) => {
  let sql = 'DROP TABLE tbl_role_user'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send( err.sqlMessage)

    return res.status(200).send('Tabla "tbl_role_user" ha sido eliminada.')
  })
})

/* tbl_roles */
// crear y cargar tbl_roles
router.post('/createTblRoles', (req, res) => {
  const createTblRoles = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_roles.sql')
  ).toString()

  let query = db.query(createTblRoles, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    console.log('query')
    
    // add admin role
    let sqlAddAdminRole = `INSERT INTO tbl_roles SET ?`

    let adminRolesData = {
      role_id: 0,
      name: 'admin',                           
      slug: 'administrator',                   
      desc: 'administrator description'     
    }

    let queryAdminRole = db.query(sqlAddAdminRole, adminRolesData, (err, resultAdminRole) => {
      console.log('query AdminRole')

      // errors
      if (err) return res.status(400).send(err.sqlMessage)

      // add user role
      let sqlAddUserRole = `INSERT INTO tbl_roles SET ?`

      let userRolesData = {
        role_id: 1,
        name: 'user',                    
        slug: 'user',              
        desc: 'user description'       
      }

      let queryAdminRole = db.query(sqlAddUserRole, userRolesData, (err, resultUserRole) => {
        console.log('query UserRole')

        // errors
        if (err) return res.status(400).send(err.sqlMessage)

        return res.status(200).send('Tabla "tbl_roles" ha sido creada y cargada.')
      })
    })
  })
})
// eliminar tbl_roles
router.delete('/deleteTblRoles', (req, res) => {
  let sql = 'DROP TABLE tbl_roles'

  db.query(sql, (err, result) => {
    if(err) return res.status(400).send(err.sqlMessage)

    return res.status(200).send('Tabla "tbl_role" ha sido eliminada.')
  })
})


/* tbl_permission_role */
// crear y cargar tbl_permission_role
router.post('/createTbPermissionRole', (req, res) => {
  const createTbPermissionRole = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_permission_role.sql')
  ).toString()

  let query = db.query(createTbPermissionRole, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    console.log('query')
    
    // add admin0 permission
    let sqlAddAdmin0Permission = `INSERT INTO tbl_permission_role SET ?`

    let admin0PermissionData = {
      role_id: 0,
      permission_id: 0
    }

    let queryAdmin0Permission = db.query(sqlAddAdmin0Permission, admin0PermissionData, (err, resultAdmin0Permission) => {
      console.log('query queryAdmin0Permission')

      // errors
      if (err) return res.status(400).send(err.sqlMessage)

      // add admin1 permission
      let sqlAddAdmin1Permission = `INSERT INTO tbl_permission_role SET ?`

      let admin1PermissionData = {
        role_id: 0,
        permission_id: 1
      }

      let queryAdmin1Permission = db.query(sqlAddAdmin1Permission, admin1PermissionData, (err, resultAdmin1Permission) => {
        console.log('query queryAdmin1Permission')

        // errors
        if (err) return res.status(400).send(err.sqlMessage)

        // add admin0 permission
        let sqlAddUser0Permission = `INSERT INTO tbl_permission_role SET ?`

        let user0PermissionData = {
          role_id: 1,
          permission_id: 2
        }

        let queryUser0Permission = db.query(sqlAddUser0Permission, user0PermissionData, (err, resultUser0Permission) => {
          console.log('query queryUser0Permission')

          // errors
          if (err) return res.status(400).send(err.sqlMessage)

          // add user1 permission
          let sqlAddUser1Permission = `INSERT INTO tbl_permission_role SET ?`

          let user1PermissionData = {
            role_id: 1,
            permission_id: 3
          }

          let queryUser1Permission = db.query(sqlAddUser1Permission, user1PermissionData, (err, resultUser1Permission) => {
            console.log('query queryUser1Permission')

            // errors
            if (err) return res.status(400).send(err.sqlMessage)

            return res.status(200).send('Permissions Role added')
          })
        })
      })
    })
  })
})
/* tbl_permissions */
// crear y cargar tbl_permissions
router.post('/createTblPermissions', (req, res) => {
  const createTbPermissions = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_permissions.sql')
  ).toString()

  let query = db.query(createTbPermissions, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    console.log('query')
    
    // add admin0 permission
    let sqlAddAdmin0Permission = `INSERT INTO tbl_permissions SET ?`

    let admin0PermissionData = {
      permissions_id: 0,                                  
      name: 'crud-a&&u',                        
      slug: 'crud admins and users',            
      desc: 'crud admins and users description' 
    }

    let queryAdmin0Permission = db.query(sqlAddAdmin0Permission, admin0PermissionData, (err, resultAdmin0Permission) => {
      console.log('query queryAdmin0Permission')

      // errors
      if (err) return res.status(400).send(err.sqlMessage)

      // add admin1 permission
      let sqlAddAdmin1Permission = `INSERT INTO tbl_permissions SET ?`

      let admin1PermissionData = {
        permissions_id: 1,                               
        name: 'crud-a&&cru-u',                     
        slug: 'crud admins and cru users',         
        desc: 'crud admins and cru users desc'  
      }

      let queryAdmin1Permission = db.query(sqlAddAdmin1Permission, admin1PermissionData, (err, resultAdmin1Permission) => {
        console.log('query queryAdmin1Permission')

        // errors
        if (err) return res.status(400).send(err.sqlMessage)

        // add admin0 permission
        let sqlAddUser0Permission = `INSERT INTO tbl_permissions SET ?`

        let user0PermissionData = {
          permissions_id: 2,
          name: 'cr-u',                     
          slug: 'create read users',        
          desc: 'create read users only'
        }

        let queryUser0Permission = db.query(sqlAddUser0Permission, user0PermissionData, (err, resultUser0Permission) => {
          console.log('query queryUser0Permission')

          // errors
          if (err) return res.status(400).send(err.sqlMessage)

          // add user1 permission
          let sqlAddUser1Permission = `INSERT INTO tbl_permissions SET ?`

          let user1PermissionData = {
            permissions_id: 3,
            name: 'r-u',                      
            slug: 'read users',               
            desc: 'read users only'  
          }

          let queryUser1Permission = db.query(sqlAddUser1Permission, user1PermissionData, (err, resultUser1Permission) => {
            console.log('query queryUser1Permission')

            // errors
            if (err) return res.status(400).send(err.sqlMessage)

            return res.status(200).send('Permissions added')
          })
        })
      })
    })
  })
})




/* tbl_providers */
// crear tbl_providers
router.post('/createTblProviders', (req, res) => {
  const createTblProviders = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_providers.sql')
  ).toString()

  const query = db.query(createTblProviders, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    return res.status(200).send('Tabla providers ha sido creada.')
  })
})

// eliminar tbl_providers
router.delete('/deleteTblProviders', (req, res) => {
  let sql = 'DROP TABLE tbl_providers'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send( err.sqlMessage)

    return res.status(200).send('Tabla "providers" ha sido eliminada.')
  })
})

// vaciar tbl_providers
router.delete('/deleteAllProviders', (req, res) => {
  let sql = 'DELETE FROM tbl_providers'

  let query = db.query(sql, (err, result) => {
    if (err) return res.status(200).send(err.sqlMessage)

    return res.status(200).send('Tabla "providers" ha sido vaciada.')
  })
})


/* tbl_circuits */
// crear tbl_circuits
router.post('/createtbl_circuits', (req, res) => {
  const createTblCircuits = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_circuits.sql')
  ).toString()

  const query = db.query(createTblCircuits, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    return res.status(200).send('Tabla circuits ha sido creada.')
  })
})

// eliminar tbl_circuits
router.delete('/deleteTblCircuits', (req, res) => {
  let sql = 'DROP TABLE tbl_circuits'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send( err.sqlMessage)

    return res.status(200).send('Tabla "circuits" ha sido eliminada.')
  })
})

// vaciar tbl_circuits
router.delete('/deleteAllCircuits', (req, res) => {
  let sql = 'DELETE FROM tbl_circuits'

  let query = db.query(sql, (err, result) => {
    if (err) return res.status(200).send(err.sqlMessage)

    return res.status(200).send('Tabla "circuits" ha sido vaciada.')
  })
})


/* tbl_ddis */
// crear tbl_ddis
router.post('/createTblddis', (req, res) => {
  const createTblddis = fs.readFileSync(
    path.join(__dirname, '../../sql/tbl_ddis.sql')
  ).toString()

  const query = db.query(createTblddis, (err, result) => {
    if (err) return res.status(400).send(err.sqlMessage)

    return res.status(200).send('Tabla ddis ha sido creada.')
  })
})

// eliminar tbl_ddis
router.delete('/deleteTblddis', (req, res) => {
  let sql = 'DROP TABLE tbl_ddis'

  db.query(sql, (err, result) => {
    if(err)
      return res.status(400).send( err.sqlMessage)

    return res.status(200).send('Tabla "ddis" ha sido eliminada.')
  })
})

// vaciar tbl_circuits
router.delete('/deleteAllddis', (req, res) => {
  let sql = 'DELETE FROM tbl_ddis'

  let query = db.query(sql, (err, result) => {
    if (err) return res.status(200).send(err.sqlMessage)

    return res.status(200).send('Tabla "ddis" ha sido vaciada.')
  })
})

module.exports = router