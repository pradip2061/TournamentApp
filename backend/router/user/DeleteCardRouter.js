const express = require('express')
const {checkResult,checkuserJoinFF} = require('../../controller/checkResultController')
const Authverify = require('../../middleware/AuthVerify')
const deleteCard = require('../../controller/DeleteMatchCardController')
const router3 = express.Router()
router3.post('/deletecard',Authverify,deleteCard)

module.exports = router3