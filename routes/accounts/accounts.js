const express = require('express')
const router  = express.Router()
const {
  loginAccount,
  registerAccount,
  logoutAccount,
  updateAccount,
  deleteAccount,
  getAccounts
} = require('../../controllers/accounts')


router.post('/login', loginAccount) 

router.post('/register', registerAccount)

router.post('/logout', logoutAccount)

router.put('/update', updateAccount)

router.delete('/delete', deleteAccount)

router.get('/getAccounts', getAccounts)

module.exports = router



