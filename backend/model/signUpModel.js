const mongoose =require('mongoose')

 const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const signUp =  mongoose.model('signUp',schema)
module.exports = signUp