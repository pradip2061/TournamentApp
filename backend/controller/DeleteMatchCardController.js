const ClashSquad = require("../model/ClashSquadModel")
const signUp = require("../model/signUpModel")

const deleteCard =async(req,res)=>{
try {
    const{matchId}=req.body
const userid =req.user
const match = await ClashSquad.findByIdAndDelete({_id:matchId})
if(!match){
    return res.status(404).json({
        message:'matchCard not found'
    })
}
const userinfo =await signUp.findOne({_id:userid})
userinfo.balance +=match.matchDetails[0].betAmount
userinfo.isplaying =false
userinfo.matchId =""
await userinfo.save()
res.status(200).json({
    message:'matchcard deleted!!'
})
} catch (error) {
    console.log(error)
}
}

module.exports =deleteCard