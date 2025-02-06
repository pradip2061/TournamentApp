const signUp = require("../model/signUpModel")
const generateTokens = require('../token/generateToken')
const bcrypt = require('bcrypt')
const Login =async(req,res)=>{
try {
    const{email,password}=req.body
if(!email || !password){
    res.status(400).json({
        message:'fill the field properly'
    })
    return
}

const emailCheck = await signUp.findOne({email:email})
if(!emailCheck){
    res.status(404).json({
        message:'user not found!'
    })
    return
}


const decoded = await bcrypt.compare(password,emailCheck.password)
if(!decoded){
    res.status(400).json({
        message:'password is wrong!'
    })
}

const token = generateTokens(emailCheck._id.toString())
console.log(token)
if(!token){
    res.status(400).json({
        message:'login failed!'
    })
    return
}

res.status(200).json({
    message:'login successfully!',
    data:`${token}`
})

} catch (error) {
    res.status(400).json({message:error})
}
}

const getprofile =async(req,res)=>{
const userid = req.user
if(!userid){
    res.status(400).json({
        message:'user need to login'
    })
    return
}
const userinfo = await signUp.findById(userid)

res.status(200).json({
    message:'this is user info'
})

}


module.exports ={Login,getprofile}