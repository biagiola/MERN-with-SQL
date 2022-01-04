const mysql = require('mysql')

// Creamos coneccion con MySQL 
const db = mysql.createConnection({
  //host: 'localhost',
  user: 'root',
  password: 'Certina123@#!',
  database: 'test',
  //multipleStatements: true 
})

// Conectamos
db.connect( err => {
  if(err) throw err
  console.log('mysql está conectado con Nodejs!!')
})

module.exports = db