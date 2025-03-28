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

if(match.teamopponent[0].userid){
    return res.status(400).json({
        message:"player has been joined match cannot be deleted"
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
    const reportClashSquad =async(req,res)=>{
        try {
            const userid =req.user
            const{reportMessage,uploadedProof}=req.body
            console.log(reportMessage)
        if(!userid){
            return res.status(404).json({
                message:"userid not found"
            })
        }
        const userinfo=await User.findOne({_id:userid})
        if(!userinfo){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const matchId = userinfo?.matchId?.FreefireClashId?.[0]
        const match = await ClashSquad.findOne({_id:matchId})
        if(!match){
            return res.status(404).json({
                message:'matchCard not found'
            })
        }
        if(match.teamHost[0].userid === userid){
            match.teamHost[0].reportImage=uploadedProof
            match.teamHost[0].reportMessage=reportMessage
            match.save()
        }else if(match.teamopponent[0].userid === userid){
            match.teamopponent[0].reportImage=uploadedProof
            match.teamopponent[0].reportMessage=reportMessage
            match.save()
        }else{
            console.log("userid not match")
            return
        }

        res.status(200).json({
            message:"report submit successfully"
        })
        } catch (error) {
            
        }
    }

    const reportTdm =async(req,res)=>{
        try {
            const userid =req.user
            const{reportMessage,uploadedProof}=req.body
        if(!userid){
            return res.status(404).json({
                message:"userid not found"
            })
        }
        console.log("report route")
        const userinfo=await User.findOne({_id:userid})
        if(!userinfo){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const matchId = userinfo?.matchId?.pubgTdmId?.[0]
        const match = await tdm.findOne({_id:matchId})
        if(!match){
            return res.status(404).json({
                message:'matchCard not found'
            })
        }
        if(match.teamHost[0].userid === userid){
            match.teamHost[0].reportImage=uploadedProof
            match.teamHost[0].reportMessage=reportMessage
            match.save()
        }else if(match.teamopponent.userid === userid){
            match.teamopponent[0].reportImage=uploadedProof
            match.teamopponent[0].reportMessage=reportMessage
            match.save()
        }else{
            console.log("userid not match")
            return
        }

        res.status(200).json({
            message:"report submit successfully"
        })
        } catch (error) {
            
        }
    }

module.exports ={deleteCard,deleteCardtdm,reportClashSquad,reportTdm}
