const ClashSquad = require("../model/ClashSquadModel")
const {User} = require("../model/schema")
const tdm = require("../model/TdmModel")

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
const userinfo =await User.findOne({_id:userid})
userinfo.balance += Number(match.matchDetails[0].betAmount)
userinfo.isplaying =false
userinfo.matchId.FreefireClashId.splice(0,userinfo.matchId.FreefireClashId.length)
await userinfo.save()
res.status(200).json({
    message:'matchcard deleted!!'
})
} catch (error) {
    console.log(error)
}
}

const deleteCardtdm =async(req,res)=>{
    try {
        const{matchId}=req.body
    const userid =req.user
    const match = await tdm.findByIdAndDelete({_id:matchId})
    if(!match){
        return res.status(404).json({
            message:'matchCard not found'
        })
    }
    const userinfo =await User.findOne({_id:userid})
    userinfo.balance += Number(match.entryFee)
    userinfo.isplaying =false
    userinfo.matchId.pubgTdmId.splice(0,userinfo.matchId.pubgTdmId.length)
    await userinfo.save()
    res.status(200).json({
        message:'matchcard deleted!!'
    })
    } catch (error) {
        console.log(error)
    }
    }

module.exports ={deleteCard,deleteCardtdm}
