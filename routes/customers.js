const express = require('express')
const router = express.Router()
const CustomersController = require('../controllers/customers')

router.get("/:id", CustomersController.customerPage)

router.get("/:id/my-accounts", CustomersController.customerAccounts)

module.exports = router