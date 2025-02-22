const ClashSquad = require("../model/ClashSquadModel")

const checkSlot = async(req,res,next)=>{
const{matchId}=req.body
const match = await ClashSquad.findOne({_id:matchId})

if(match.teamopponent[0].userid){
    return res.status(400).json({
        message:'slot is  full'
    })
}
next()
}

module.exports = checkSlot