const jwt = require('jsonwebtoken')
require('dotenv').config()
const generateTokens=(userid)=>{
    const token= jwt.sign({id:userid},process.env.secret_key,{expiresIn:'5d'})
    return token
}
module.exports =generateTokens