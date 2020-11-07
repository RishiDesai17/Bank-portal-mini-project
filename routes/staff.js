const express = require('express')
const router = express.Router()
const StaffController = require('../controllers/staff')

router.get("/:staff", StaffController.staffPage)

module.exports = router