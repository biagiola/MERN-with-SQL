const express = require('express')
const router = express.Router()
const db = require('../../dbConfig')
const { actualTime } = require('../../helpers/timer') 
const { unixtimeToTimestamp } = require('../../helpers/unixtimeToTimestamp')

/* PROVIDERS (providers, ddis, circuits) */
// create
router.post('/add', (req, res) => {
  console.log('add provider')

  let {
    providerName,
    providerActive,
    circuitName,
    circuitIdentifier,
    circuitHost,
    circuitPort,
    circuitDescription,
    circuitActive,
    DDI,
    associateDDI,
    DDIActive } = req.body

  console.log(
    'providerName', providerName,
    '\n providerActive', providerActive,
    '\n circuitName', circuitName,
    '\n circuitIdentifier', circuitIdentifier,
    '\n circuitHost', circuitHost,
    '\n circuitPort', circuitPort,
    '\n circuitDescription', circuitDescription,
    '\n circuitActive', circuitActive,
    '\n DDI', DDI,
    '\n associateDDI', associateDDI,
    '\n DDIActive', DDIActive )

  /* añadir provider */
  
  // variables
  let providerData = {
    name: providerName,
    active: providerActive,
  }
  
  // sentencia
  let sqlProvider = 'INSERT INTO tbl_providers SET ?'
  
  // query
  db.query(sqlProvider, providerData, (err, resultProvider) => {
    console.log('query sqlProvider')
    
    // erros
    if (err) return res.status(400).send({ message: err.sqlMessage })

    console.log('provider added', resultProvider)
    
    /* añadir circuit */
    let timeNow = actualTime()
    let timestamp = unixtimeToTimestamp(timeNow)

    let circuitData = {
      id_provider: resultProvider.insertId,
      name: circuitName,
      identifier: circuitIdentifier,
      host: circuitHost,
      port: circuitPort,
      description: circuitDescription,
      date_in: timestamp,
      /* date_out: null, */
      active: circuitActive
    }

    let sqlCircuit = 'INSERT INTO tbl_circuits SET ?'

    db.query(sqlCircuit, circuitData,(err, resultCircuit) => {
      if (err) return res.status(400).send({ message: err.sqlMessage })

      /*  añadir ddis */
      // variables
      let ddidata = {
        id_provider: resultProvider.insertId,
        id_circuit: resultCircuit.insertId,
        ddis: DDI,
        ddis_associated: associateDDI,
        date_in: timestamp,
        active: DDIActive,
      }

      // sql
      let sqlddi = 'INSERT INTO tbl_ddis SET ?'

      // query
      db.query(sqlddi, ddidata, (err, resultddi) => {
        if (err) return res.status(400).send({ message: err.sqlMessage })

        return res.status(200).send({ message: 'Provider, Circuit and DDI has been added.' })

      })
    })
  })
})

// read all
router.get('/getProviders', (req, res) => {
  console.log('/getProviders')

  let sqlProviders = 
    `SELECT  
      tbl_providers.id         as provider_id, 
      tbl_providers.name       as provider_name, 
      tbl_providers.active     as provider_active, 
      tbl_ddis.id              as ddi_id, 
      tbl_ddis.ddis            as ddi_principal, 
      tbl_ddis.ddis_associated as ddi_associate, 
      tbl_ddis.active          as ddi_active, 
      tbl_circuits.id          as circuit_id, 
      tbl_circuits.name        as circuit_name, 
      tbl_circuits.identifier  as circuit_identifier, 
      tbl_circuits.host        as circuit_host,
      tbl_circuits.port        as circuit_port,
      tbl_circuits.active      as circuit_active,
      tbl_circuits.description as circuit_description,
      tbl_circuits.date_in     as date_in

    FROM tbl_providers
      JOIN tbl_ddis ON tbl_providers.id = tbl_ddis.id_provider 
      JOIN tbl_circuits ON tbl_providers.id = tbl_circuits.id_provider;`

  db.query(sqlProviders, (err, resultProviders) => {
    // erros
    if(err) return res.status(400).send({ message: err.sqlMessage })

    return res.status(200).send({ listOfProviders: resultProviders })
  })
})

// update
router.put('/update', (req, res) => {
  console.log('/update')

  let {
    role_id,
    provider_id,
    provider_name,
    provider_active,
    ddi_id,
    ddi_principal,
    ddi_associate,
    ddi_active,
    circuit_id,
    circuit_name,
    circuit_identifier,
    circuit_host,
    circuit_port,
    circuit_description,
  } = req.body

  
  console.log(
    'provider_id: ', provider_id,
    '\nprovider_name: ', provider_name,
    '\nprovider_active: ', provider_active,
    '\nddi_principal: ', ddi_principal,
    '\nddi_associate: ', ddi_associate,
    '\nddi_active: ', ddi_active,
    '\ncircuit_id: ', circuit_id,
    '\ncircuit_id: ', circuit_name,
    '\ncircuit_identifier: ', circuit_identifier,
    '\ncircuit_host: ', circuit_host,
    '\ncircuit_port: ', circuit_port,
    '\ncircuit_description: ', circuit_description,
    '\nrole_id: ', role_id)

  // editar admin
  if(role_id == 0) {
    console.log('providers update, admin')

    // Provider
    let sqlUpdateProvider = 
    `UPDATE tbl_providers
     SET name='${provider_name}', active=${provider_active} 
     WHERE id='${provider_id}'
    `
    db.query(sqlUpdateProvider, (err, resultUpdateProvider) => {
      console.log('sqlUpdateProvider')

      if (err) return res.status(401).send({ message: err.sqlMessage }) 
      
      // Circuits
      let sqlUpdateCircuits =
      `UPDATE tbl_circuits
       SET 
        name='${circuit_name}',
        identifier='${circuit_identifier}', 
        host='${circuit_host}', 
        port='${circuit_port}', 
        description='${circuit_description}'
       WHERE id=${circuit_id} 
      `
      db.query(sqlUpdateCircuits, (err, resultUpdateCircuits) => {
        console.log('sqlUpdateCircuits')

        if(err) return res.status(402).send({ message: err.sqlMessage })

        // DDI
        let sqlUpdateDDI =
        `UPDATE tbl_ddis
         SET 
          ddis='${ddi_principal}', 
          ddis_associated='${ddi_associate}', 
          active=${ddi_active}
         WHERE id=${ddi_id}
        `
        db.query(sqlUpdateDDI, (err, resultUpdateDDI) => {
          console.log('sqlUpdateProvider')
          
          if(err) return res.status(403).send({ message: err.sqlMessage })

          return res.status(200).send({
            message: 'Provier, circuit and ddi was updated',
            provider_id: provider_id,
            provider_name: provider_name,
            provider_active: provider_active,
            ddi_id: ddi_id,
            ddi_principal: ddi_principal,
            ddi_associate: ddi_associate,
            ddi_active: ddi_active,
            circuit_identifier: circuit_identifier,
            circuit_host: circuit_host,
            circuit_port: circuit_port,
            circuit_description: circuit_description
          })
        })
      })
    })
  }

  if(role_id == 1) { 
    return res.status(400).send({ message: "Update denied. You are not an admin."})
  }
})

// delete
router.delete('/delete', (req, res) => {
  console.log('/delete')

  let { provider_id, role_id } = req.body.source
  
  console.log('provider_id:', provider_id)
  console.log('role_id:', role_id)

  let sqlSelectDDi = 
  `SELECT id_provider 
   FROM tbl_ddis 
   WHERE id='${provider_id}'
  `

  if(role_id == 0) {
    // search if it exists
    db.query(sqlSelectDDi, (err, resultSelectDDI) => {
      console.log('query sqlSelectDDi')
  
      // erros
      if (err) return res.status(400).send({ message: err.sqlMessage })
  
      // Delete from tbl_ddis
      let sqlDeleteDDI = 
      `DELETE 
       FROM tbl_ddis 
       WHERE id_provider=${provider_id}
      `
      
      db.query(sqlDeleteDDI, (err, resultDeleteDDI) => {
        console.log('query sqlDeleteDDI')
  
        if(err) return res.status(400).send({ message: err.sqlMessage })
  
        // Delete from tbl_providers
        let sqlDeleteProvider = 
        `DELETE 
         FROM tbl_providers 
         WHERE id=${provider_id}
        `
  
        db.query(sqlDeleteProvider, (err, resullDeleteProvider) => {
          console.log('query sqlDeleteProvider')

          if(err) return res.status(401).send({ message: err.sqlMessage })

          let sqlDeleteCircuits =
          `DELETE
           FROM tbl_circuits
           WHERE id_provider=${provider_id}
          `

          db.query(sqlDeleteCircuits, (err, resultDeleteCircuit) => {
            console.log('query sqlDeleteCircuits')

            if(err) return res.status(402).send({ message: err.sqlMessage })

            return res.status(200).send({ message: 'Provider, ddi, circuit was deleted succesfully' })
          })
        })
      })
    })
  } else {
    return res.status(400).send({ message: 'Delete denied. You are not an admin'})
  }

  
})



module.exports = router

