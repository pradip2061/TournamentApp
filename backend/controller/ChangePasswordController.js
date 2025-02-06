const signUp = require("../model/signUpModel")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const changePassword=async(req,res)=>{
try {
const userid =req.user
const{oldPassword,newPassword}=req.body
if(!oldPassword || !newPassword){
    res.status(400).json({
        message:'plz fill the all field!'
    })
    return
}
const cleanUserId = userid.trim();
const objectId = new mongoose.Types.ObjectId(cleanUserId);
const NewPassword = await bcrypt.hash(newPassword,11)
const userinfo = await signUp.findById(objectId)
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
 await userinfo.save()
res.status(200).json({
    message:'password change successfully'
})
} catch (error) {
    res.status(400).json({
        message:error.message
    })
}

}

module.exports=changePassword