const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const PubgFull = require("../model/PubgFullMatchModel");
const {User} = require("../model/schema");
const tdm = require("../model/TdmModel");

const checkResult = async (req, res) => {
    const { matchId } = req.body;
    const match = await ClashSquad.findOne({ _id:matchId });
    if (!match || !match.teamHost[0] || !match.teamopponent[0]) {
        return res.status(400).json({ message: "Invalid match data" });
    }
    const hostStatus = match.teamHost[0].teamHostStatus;
    const opponentStatus = match.teamopponent[0].team2Status;

    if (typeof hostStatus === "boolean" && typeof opponentStatus === "boolean") {
        if (hostStatus  ===  true||false  || opponentStatus === true||false) {
            return res.status(200).json({ message: "booleanMatch" });
        } else {
            return res.status(200).json({ message: "booleanNotMatch" });
        }
    }

    if (hostStatus === null || opponentStatus === null) {
        return res.status(200).json({ message: "noresponse" });
    }
    if(hostStatus === true||false || opponentStatus === null){
        return res.status(200).json({ message: "oneresponse" });
    }
    if(hostStatus === null || opponentStatus === true||false){
        return res.status(200).json({ message: "oneresponse" });
    }
};

const checkuserJoinFF =async(req,res)=>{
    const { matchId } = req.body;
    const userid = req.user;
    const userinfo = await User.findOne({ _id: userid });
    const gameNameArray = userinfo.matchId.FreefireFullId
    const index = gameNameArray.findIndex(arr => arr.includes(matchId));
    if (index !== -1) {
      res.status(200).json({
        message: "joined",
      });
    }else {
      res.status(200).json({
        message: "notjoined",
      });
    }
}

const checkmatchtypeTdm =async(req,res)=>{
    const{matchId}=req.body
    if(!matchId){
        return res.status(400).json({
            message:'match card not found'
        })
    }
    const matchinfo =await tdm.findOne({_id:matchId})
    if(matchinfo.playermode === "solo"){
        return res.status(200).json({message:'solo'})
    }else if(matchinfo.playermode === "duo"){
        return res.status(200).json({message:'duo'})
    }else{
        return res.status(200).json({message:'squad'})
    }
}

const checkmatchtypePubg=async(req,res)=>{
    const{matchId}=req.body
    if(!matchId){
        return res.status(400).json({
            message:'match card not found'
        })
    }
    const matchinfo =await PubgFull.findOne({_id:matchId})
    if(matchinfo.playermode === "solo"){
        return res.status(200).json({message:'solo'})
    }else if(matchinfo.playermode === "duo"){
        return res.status(200).json({message:'duo'})
    }else{
        return res.status(200).json({message:'squad'})
    }
}

const checkmatchtypeff =async(req,res)=>{
    const{matchId}=req.body
    if(!matchId){
        return res.status(400).json({
            message:'match card not found'
        })
    }
    const matchinfo =await FFfreefire.findOne({_id:matchId})
    if(matchinfo.playermode === "solo"){
        return res.status(200).json({message:'solo'})
    }else if(matchinfo.playermode === "duo"){
        return res.status(200).json({message:'duo'})
    }else{
        return res.status(200).json({message:'squad'})
    }
}

const checkrole =async(req,res)=>{
    const userid =req.user
    const role  = await User.findById(userid).select("role").lean();
    if(!role){
        return res.status(400).json({
            message:'user not found'
        })
    }

    res.status(200).json({
        message:'check successfully',
        data:role
    })
}

const getchampions = async(req,res)=>{
    const userid = req.user
    const userinfo = await User.findOne({_id:userid}).select('username trophy').lean()
    const userdata = await User.find().select('username trophy image').sort({ trophy: -1 }).lean()
    if(!userinfo || !userdata){
        return res.status(404).json({
            message:'data not found'
        })
    }

    res.status(200).json({
        message:'data sent!',
        userinfo,
        userdata
    })
}

module.exports = {checkResult,checkuserJoinFF,checkmatchtypeTdm,checkrole,checkmatchtypePubg,checkmatchtypeff,getchampions};
