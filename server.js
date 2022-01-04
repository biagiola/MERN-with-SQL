const express = require('express') 
const app     = express()
const server  = require('http').Server(app)  
const cors    = require('cors') 
const bodyParser = require('body-parser')
const morgan  = require('morgan')
const authJwt = require('./helpers/jwt') 
require('dotenv').config();

const PORT = process.env.PORT || 9000
const api  = process.env.API_URL

// middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(express.json()) 
app.use(morgan('tiny'))
/* app.use(authJwt()) */

// Routes
const accounts  = require('./routes/accounts/accounts')
const providers = require('./routes/providers/providers')
const tables = require('./routes/tables/tables')
const times  = require('./routes/times/times')
app.use(`${api}/accounts`, accounts)
app.use(`${api}/providers`, providers)
app.use(`${api}/tables`, tables)
app.use(`${api}/times`, times)


// servidor escuchando
server.listen(PORT, () => console.log(`listening on localhost:${PORT}`))