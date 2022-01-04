function actualTime() { 
  //console.log(actualTime, 'actualTime')
  return Date.now()
}

function tiempoPrimerBloqueo() {
  var primerBloqueo = new Date

  var tiempo1 = process.env.TIEMPO_PRIMER_BLOQUEO

  primerBloqueo.setSeconds(primerBloqueo.getSeconds())
  var tiempo1erBloqueo = primerBloqueo.setSeconds(primerBloqueo.getSeconds()+tiempo1)
  
  return tiempo1erBloqueo
}

function tiempoSegundoBloqueo() {
  var segundoBloqueo = new Date

  var tiempo2 = process.env.TIEMPO_SEGUNDO_BLOQUEO

  console.log('tiempo2', tiempo2)

  segundoBloqueo.setSeconds(segundoBloqueo.getSeconds())
  var tiempo2doBloqueo = segundoBloqueo.setSeconds(segundoBloqueo.getSeconds()+tiempo2)
  
  return tiempo2doBloqueo
}

function dentroDe5Seg() {
  var actual5Seg = new Date

  actual5Seg.setSeconds(actual5Seg.getSeconds())
  var dentroDe5Seg = actual5Seg.setSeconds(actual5Seg.getSeconds()+5)
  
  return dentroDe5Seg
}

function dentroDe10Seg() {
  var actual10Seg = new Date
  
  actual10Seg.setSeconds(actual10Seg.getSeconds())
  var dentroDe10Seg = actual10Seg.setSeconds(actual10Seg.getSeconds()+10)
  
  return dentroDe10Seg
}

function dentroDe15Seg() {
  var actual15Seg = new Date
  
  actual15Seg.setSeconds(actual15Seg.getSeconds())
  var dentroDe15Seg = actual15Seg.setSeconds(actual15Seg.getSeconds()+10)
  
  return dentroDe15Seg
}

function dentroDe20Seg() {
  var actual20Seg = new Date

  actual20Seg.setSeconds(actual20Seg.getSeconds())
  var dentroDe20Seg = actual20Seg.setSeconds(actual20Seg.getSeconds()+20)
  
  return dentroDe20Seg
}

function dentroDe1Min() {
  var actual1Min = new Date

  actual1Min.setMinutes(actual1Min.getMinutes())
  var dentroDe1Min = actual1Min.setMinutes(actual1Min.getMinutes()+1)
  
  return dentroDe1Min
}

function dentroDe2Min() {
  var actual2Min = new Date

  actual2Min.setMinutes(actual2Min.getMinutes())
  var dentroDe2Min = actual2Min.setMinutes(actual2Min.getMinutes()+2)
  
  return dentroDe2Min
}

function dentroDe60Min() {
  var actual60Min = new Date

  actual60Min.setMinutes(actual60Min.getMinutes())
  var dentroDe60Min = actual60Min.setMinutes(actual60Min.getMinutes()+60)
  
  return dentroDe60Min
}

function dentroDe30Min() {
  var actual30Min = new Date

  actual30Min.setMinutes(actual30Min.getMinutes())
  var dentroDe30Min = actual30Min.setMinutes(actual30Min.getMinutes()+30)
  
  return dentroDe30Min
}

function dentroDe30Dias() {
  var actual30Dias = new Date

  actual30Dias.setDate(actual30Dias.getDate())
  var dentroDe30Dias = actual30Dias.setDate(actual30Dias.getDate()+30)
  
  return dentroDe30Dias
}

function hace30Dias() {
  var before30Min = new Date

  before30Min.setDate(before30Min.getDate())
  var hace30Dias = before30Min.setDate(before30Min.getDate()-30)
  
  return hace30Dias
}

module.exports.actualTime = actualTime
module.exports.tiempoPrimerBloqueo = tiempoPrimerBloqueo
module.exports.tiempoSegundoBloqueo = tiempoSegundoBloqueo
module.exports.dentroDe5Seg = dentroDe5Seg
module.exports.dentroDe10Seg = dentroDe10Seg
module.exports.dentroDe15Seg = dentroDe15Seg
module.exports.dentroDe20Seg = dentroDe20Seg
module.exports.dentroDe1Min = dentroDe1Min
module.exports.dentroDe2Min = dentroDe2Min
module.exports.dentroDe30Min = dentroDe30Min
module.exports.dentroDe60Min = dentroDe60Min
module.exports.dentroDe30Dias = dentroDe30Dias
module.exports.hace30Dias = hace30Dias
