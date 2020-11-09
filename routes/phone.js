const express = require('express')
const router = express.Router()
const PhoneController = require('../controllers/phone')

router.get("/:customer", PhoneController.addPhoneNumberPage)

router.post("/:customer", PhoneController.addPhoneNumber)

module.exports = router