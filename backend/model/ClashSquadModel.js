const mongoose =require('mongoose')

 const schema = new mongoose.Schema({
     userid :{
        type:String,
        required:true
     },
      player:{
        type:String,
        required:true
     },
      ammo:{
        type:String,
        required:true
     },
      headshot:{
        type:String,
        required:true
     },
      skill:{
        type:String,
        required:true
     },
      round:{
        type:String,
        required:true
     },
      coin:{
        type:String,
        required:true
     },
     getName:{
        type:String,
        required:true
     },
    betAmount:{
        type:String,
        required:true
     }
},{timestamps:true})

const ClashSquad = mongoose.model('ClashSquad',schema)
module.exports=ClashSquad