const express = require('express')
const {checkResult,checkuserJoinFF} = require('../controller/checkResultController')
const Authverify = require('../middleware/AuthVerify')
const router2 = express.Router()
router2.post('/checkresult',checkResult)
router2.post('/checkuserff',Authverify,checkuserJoinFF)
module.exports = router2