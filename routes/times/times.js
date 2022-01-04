const express = require('express')
const router = express.Router()
const { unixtimeToTimestamp } = require('../../helpers/unixtimeToTimestamp')
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

/* TIME MANIPULATION */

// controlar tiempos
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

// unixtiem to timestamp
router.post('/testTimestamp', (req, res) => {
  let unixtime = 1621721929830;
  let timestamp = unixtimeToTimestamp(unixtime)
  return res.status(200).send({
    'timestamp': timestamp
  })
})

module.exports = router