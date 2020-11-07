const express = require('express')
const router = express.Router()
const StaffController = require('../controllers/staff')

router.get("/:id", StaffController.staffPage)

module.exports = router