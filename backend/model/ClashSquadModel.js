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
        type:Number,
        required:true
    }
},{timestamps:true})

const ClashSquad = mongoose.model('ClashSquad',schema)
module.e