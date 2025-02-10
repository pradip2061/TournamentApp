const express = require('express')
const {Login,getprofile} = require('../controller/LoginController')
const changePassword = require('../controller/ChangePasswordController')
const Authverify = require('../middleware/AuthVerify')
const { requestOtp, verifyOtpandSignup } = require('../controller/OtpController')
const router = express.Router()

router.post('/verifyotp',verifyOtpandSignup)
router.post('/sendOtp',requestOtp)
router.post('/login',Login)
router.post('/changepassword',Authverify,changePassword)
router.get('/getprofile',getprofile)
module.exports=router