const express = require('express')
const router = express.Router()
const AccountsController = require('../controllers/accounts')

router.get("/my-accounts/:id", AccountsController.getOneAccount)

router.get("/bank-accounts/:bank", AccountsController.getBankAccountsPage)

router.post("/bank-accounts/:bank", AccountsController.getBankAccounts)

module.exports = router