const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const PubgFull = require("../model/PubgFullMatchModel");
const signUp = require("../model/signUpModel");
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
        if (hostStatus === opponentStatus) {
            return res.status(200).json({ message: "booleanMatch" });
        } else {
            return res.status(200).json({ message: "booleanNotMatch" });
        }
    }

    if (hostStatus === null || opponentStatus === null) {
        return res.status(200).json({ message: "noresponse" });
    }
};

const checkuserJoinFF =async(req,res)=>{
    const { matchId } = req.body;
    const userid = req.user;
    const userinfo = await signUp.findOne({ _id: userid });
    const gameNameArray = userinfo.matchId
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
    const role  = await signUp.findById(userid).select("role").lean();
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
module.exports = {checkResult,checkuserJoinFF,checkmatchtypeTdm,checkrole,checkmatchtypePubg,checkmatchtypeff};
