const signUp = require("../model/signUpModel")
const bcrypt = require('bcrypt')
const SignUp = async(req,res)=>{
    try {
        const{email,password,username}=req.body
    if(!email||!password||!username){
        res.status(400).json({
            message:'fill the field properly'
        })
        return
    }

    const verifyemail = await signUp.findOne({email:email})
    if(verifyemail){
        res.status(400).json({
            message:'email already use'
        })
        return
    }

    await signUp.create({
        username,
        email,
        password:await bcrypt.hash(password,11)
    })

    res.status(200).json({
        message:'signup successfully'
    })
    } catch (error) {
        res.status(400).json({
            message:error
        })
    }
}

module.exports = SignUp