const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')

router.get("/login", UsersController.loginPage)

router.post("/login", UsersController.login)

router.get("/register", UsersController.registerPage)

router.post("/register", UsersController.register)

module.exports = router