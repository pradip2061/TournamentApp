const ClashSquad = require("../model/ClashSquadModel")

const createCs =async(req,res)=>{
const userid =req.user
const {matchDetails}=req.body
  const{player}=matchDetails
  const{ammo}=matchDetails
  const{headshot}=matchDetails
      const{skill}=matchDetails
      const{round}=matchDetails
      const{coin}=matchDetails
      const{getName}=matchDetails
      const{betAmount}=matchDetails

if(!matchDetails || !userid){
    res.status(400).json({
        message:'credentials must be required'
})
    return
}

  await ClashSquad.create({
    userid,
    player,
     ammo,
    headshot,
      skill,
      round,
      coin,
     getName,
    betAmount
})

res.status(200).json({
    message:'data send successfully!!'
})
}

module.exports = createCs