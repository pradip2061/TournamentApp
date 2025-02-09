const express =require('express')
const router1 = express.Router()
const {createCs,getCsData} = require('../controller/CreateMatchCsController')
const userRateLimiter = require('../middleware/reactLimit')
const Authverify = require('../middleware/AuthVerify')
router1.post('/create',Authverify, userRateLimiter,createCs)
router1.get('/get',getCsData)
module.exports = router1