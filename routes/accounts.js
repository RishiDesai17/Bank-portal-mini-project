const express = require('express')
const router = express.Router()
const AccountsController = require('../controllers/accounts')

router.get("/my-accounts/:id", AccountsController.getOneAccount)

module.exports = router