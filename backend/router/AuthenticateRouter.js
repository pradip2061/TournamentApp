const express = require('express')
const SignUp = require('../controller/SignUpController')
const {Login,getprofile} = require('../controller/LoginController')
const changePassword = require('../controller/ChangePasswordController')
const router = express.Router()

router.post('/signup',SignUp)
router.post('/login',Login)
router.post('/changePassword',changePassword)
router.get('/getprofile',getprofile)

module.exports=router