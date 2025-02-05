const signUp = require("../model/signUpModel")
const bcrypt = require('bcrypt')
const changePassword=async(req,res)=>{
try {
    const userid =req.user
const{oldPassword,newPassword}=req.body
const NewPassword = await bcrypt.hash(newPassword,11)
const userinfo = await signUp.findById(userid)
if(!userinfo){
    res.status(400).json({
        message:'user not signup!'
    })
    return
}
const ispassword = await bcrypt.compare(oldPassword,userinfo.password)
if(!ispassword){
res.status(400).json({
    message:'oldPassword is wrong!'
})
return
}
userinfo.password = NewPassword
userinfo.save()
res.status(200).json({
    message:'password change successfully'
})
} catch (error) {
    res.status(400).json({
        message:error
    })
}

}

module.exports = changePassword