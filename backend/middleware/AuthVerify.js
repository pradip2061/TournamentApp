const promisify =require('util').promisify
const jwt =require('jsonwebtoken')
require('dotenv').config()
const Authverify= async(req,res,next)=>{
const token=req.headers.authorization
const decoded = await promisify (jwt.verify)(token,process.env.secret_key)
if(!decoded){
    res.status(400).json({
        message:'you need to login again'
    })
}

req.user=decoded.id
next()
}

module.exports = Authverify