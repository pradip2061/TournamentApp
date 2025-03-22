const express = require('express')
const {checkResult,checkuserJoinFF} = require('../../controller/checkResultController')
const Authverify = require('../../middleware/AuthVerify')
const {deleteCard,deleteCardtdm} = require('../../controller/DeleteMatchCardController')
const router3 = express.Router()
router3.post('/deletecard',Authverify,deleteCard)
router3.post('/deletecardtdm',Authverify,deleteCardtdm)
module.exports = router3
