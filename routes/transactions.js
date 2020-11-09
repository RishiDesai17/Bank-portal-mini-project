const express = require('express')
const router = express.Router()
const TransactionsController = require('../controllers/transactions')

router.get("/:customer", TransactionsController.customerTransactions)

router.get("/account/:account", TransactionsController.transactionsPage)

router.post("/account/:account", TransactionsController.transaction)

router.post("/time-filter/:customer", TransactionsController.filterByTime)

module.exports = router