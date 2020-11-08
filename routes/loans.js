const express = require('express')
const router = express.Router()
const LoansController = require('../controllers/loans')

router.get("/:customer", LoansController.loansPage)

router.get("/request-loan/:customer", LoansController.requestLoanPage)

router.post("/request-loan/:customer", LoansController.requestLoan)

router.get("/requested-loans/:bank", LoansController.requestedLoans)

router.patch("/loan-action", LoansController.loanAction)

module.exports = router