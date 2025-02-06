const express = require('express')
const SignUp = require('../controller/SignUpController')
const {Login,getprofile} = require('../controller/LoginController')
const changePassword = require('../controller/ChangePasswordController')
const createCs = require('../controller/CreateMatchCsController')
const Authverify = require('../middleware/AuthVerify')
const router = express.Router()

router.post('/signup',SignUp)
router.post('/login',Login)
router.post('/changepassword',Authverify,changePassword)
router.get('/getprofile',getprofile)
router.post('/create',createCs)
module.exports=router