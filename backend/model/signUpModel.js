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
    },
    trophy:{
        type:Number,
        default:0
    },
    matches:{

    },
    image:{

    },
    uid:[
        {
        
        }
    ]
},{timestamps:true})

const signUp =  mongoose.model('signUp',schema)
module.exports = signUp