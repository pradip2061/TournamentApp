const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const PubgFull = require("../model/PubgFullMatchModel");
const {User} = require("../model/schema");
const tdm = require("../model/TdmModel");
const mongoose = require("mongoose");
const checkResult = async (req, res) => {
    try {
        const userid = req.user;
        // Check if user exists first
        const userinfo = await User.findOne({ _id: userid });
        if (!userinfo) {
            return res.status(400).json({ message: "User not found" });
        }

        // Ensure matchId exists
        const matchId = userinfo.matchId?.FreefireClashId?.[0];
        if (!matchId) {
            return res.status(400).json({ message: "No match associated with user" });
        }

        // Find match
        const match = await ClashSquad.findOne({ _id: matchId });
        if (!match) {
            return res.status(400).json({ message: "Invalid match data" });
        }

        // Check team host status
        if (match.teamHost[0]?.userid === userid) {
            if (typeof match.teamHost[0].teamHostStatus === "boolean") {
                return res.status(200).json({ message: "resultsubmit" });
            }
        }

        // Check opponent status
        if (match.teamopponent[0]?.userid === userid) {
            if (typeof match.teamopponent[0].team2Status === "boolean") {
                return res.status(200).json({ message: "resultsubmit" });
            }
        }

        // Default response
        return res.status(200).json({ message: "noresponse" });
    } catch (error) {
        console.error("Error checking match result:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const checkResulttdm = async (req, res) => {
    try {
        const userid = req.user;
        // Check if user exists first
        const userinfo = await User.findOne({ _id: userid });
        if (!userinfo) {
            return res.status(400).json({ message: "User not found" });
        }

        // Ensure matchId exists
        const matchId = userinfo.matchId?.pubgTdmId?.[0];
        if (!matchId) {
            return res.status(400).json({ message: "No match associated with user" });
        }

        // Find match
        const match = await tdm.findOne({ _id: matchId });
        if (!match) {
            return res.status(400).json({ message: "Invalid match data" });
        }

        // Check team host status
        if (match.teamHost[0]?.userid === userid) {
            if (typeof match.teamHost[0].teamHostStatus === "boolean") {
                return res.status(200).json({ message: "resultsubmit" });
            }
        }

        // Check opponent status
        if (match.teamopponent[0]?.userid === userid) {
            if (typeof match.teamopponent[0].team2Status === "boolean") {
                return res.status(200).json({ message: "resultsubmit" });
            }
        }

        // Default response
        return res.status(200).json({ message: "noresponse" });
    } catch (error) {
        console.error("Error checking match result:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const checkuserJoinFF =async(req,res)=>{
    const { matchId } = req.body;
    const userid = req.user;
    const userinfo = await User.findOne({ _id: userid });
    const gameNameArray = userinfo.matchId.FreefireFullId
    if(!gameNameArray){
        return res.status(400).json({
            message:'no matches right now'
        })
    }
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

const getchampions = async (req, res) => {
    try {
        const userid = req.user;
        if (!userid) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user info
        const userinfo = await User.findOne({ _id: userid })
            .select("username trophy image")
            .lean();

        if (!userinfo) {
            return res.status(404).json({ message: "User info not found" });
        }

        // Fetch all users sorted by trophies
        const userdata = await User.find()
            .select("username trophy image _id")
            .sort({ trophy: -1 })
            .lean();

        if (userdata.length === 0) {
            return res.status(404).json({ message: "No champions found" });
        }

        // Find the index using .equals()
        const index = userdata.findIndex(item => item._id.equals(userid));

        return res.status(200).json({
            message: "Data sent!",
            userinfo,
            userdata,
            index,
        });
    } catch (error) {
        console.error("Error fetching champions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const checkReportClash=async(req,res)=>{
    const userid = req.user;
  
    const userinfo =await User.findOne({_id:userid})
    const matchId=userinfo?.matchId?.FreefireClashId?.[0]
    const match = await ClashSquad.findOne({ _id: matchId });
    if (!match) {
        return res.status(400).json({ message: "Invalid match data " });
    }
if(!userinfo){
    return res.status(400).json({ message: "user not found" });
}

if( match.teamHost[0].userid === userid){
    if(match.teamHost[0].reportMessage){
        return res.status(200).json({ message: "report" });
    }else{
        return res.status(200).json({ message: "noreport" });
    }
    
}else if( match.teamopponent[0].userid === userid){
    if(match.teamopponent[0].reportMessage){
        return res.status(200).json({ message: "report" });
    }else{
        return res.status(200).json({ message: "noreport" });
    }
}else{
    return res.status(200).json({ message: "no user found" });
}
  
}

const checkReportTdm=async(req,res)=>{
    const userid = req.user;
  
    const userinfo =await User.findOne({_id:userid})
    const matchId=userinfo?.matchId?.pubgTdmId?.[0]
    const match = await tdm.findOne({ _id: matchId });
    if (!match) {
        return res.status(400).json({ message: "Invalid match data" });
    }
if(!userinfo){
    return res.status(400).json({ message: "user not found" });
}

if( match.teamHost[0].userid === userid){
    if(match.teamHost[0].reportMessage){
        return res.status(200).json({ message: "report" });
    }else{
        return res.status(200).json({ message: "noreport" });
    }
    
}else if( match.teamopponent[0].userid === userid){
    if(match.teamopponent[0].reportMessage){
        return res.status(200).json({ message: "report" });
    }else{
        return res.status(200).json({ message: "noreport" });
    }
}else{
    return res.status(200).json({ message: "no user found" });
}
  
}



const divideMoney = async (req, res) => {
    try {
        const { matchId } = req.body;
        console.log("backend bata divide money", matchId);

        const matchinfo = await ClashSquad.findById(matchId);
        if (!matchinfo) {
            return res.status(404).json({ message: "Match not found" });
        }

        if (!matchinfo.teamHost?.[0] || !matchinfo.teamopponent?.[0]) {
            return res.status(400).json({ message: "Invalid match data" });
        }
        if( typeof matchinfo.teamHost[0].teamHostStatus === "boolean" &&
           typeof matchinfo.teamopponent[0].team2Status === "boolean" && matchinfo.teamHost[0].teamHostStatus === matchinfo.teamopponent[0].team2Status){
            matchinfo.status="conflict"
            await matchinfo.save()
            return res.status(200).json({ message: "resultconflict",userid:matchinfo.teamHost[0].userid,hostid:matchinfo.teamopponent[0].userid});
        }

        const betAmount = Number(matchinfo.matchDetails?.[0]?.betAmount || 0);
        const hostId = matchinfo.teamHost[0].userid;
        const opponentId = matchinfo.teamopponent[0].userid;

        // Validate ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(hostId) || !mongoose.Types.ObjectId.isValid(opponentId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const host = await User.findById(hostId);
        const user = await User.findById(opponentId);

        if (!host || !user) {
            return res.status(404).json({ message: "User(s) not found" });
        }

        const hostStatus = matchinfo.teamHost[0].teamHostStatus;
        const opponentStatus = matchinfo.teamopponent[0].team2Status;

        if (typeof hostStatus !== "boolean" || typeof opponentStatus !== "boolean") {
            return res.status(200).json({ message: "Match result is not yet determined" });
        }

        // Ensure victory and loss objects exist
        host.victory = host.victory || { FreefireClash: [] };
        host.loss = host.loss || { FreefireClash: [] };
        user.victory = user.victory || { FreefireClash: [] };
        user.loss = user.loss || { FreefireClash: [] };

        // Update Host
        if (hostStatus) {
            host.balance += betAmount;
        }

        // Update Opponent
        if (opponentStatus) {
            user.balance += betAmount;
        } 

        // Mark match as completed
        matchinfo.status = "completed";

        // Save all changes in parallel
        await Promise.all([host.save(), user.save(), matchinfo.save()]);

        return res.status(200).json({ message: "Money submitted successfully"});
    } catch (error) {
        console.error("Error in divideMoney:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const deductHonorScore=async(req,res)=>{
    const{userid}=req.body
    if(!userid){
        return res.status(400).json({
            message:"userid not found"
        })
    }
    const userinfo= await User.findOne({_id:userid})
    if(!userinfo){
        return res.status(400).json({
            message:"user not found"
        })
    }
    userinfo.honorscore -=2
    userinfo.save()
    res.status(200).json({message:"report successfully"})

}




module.exports = {checkResult,checkResulttdm,checkuserJoinFF,checkmatchtypeTdm,checkrole,checkmatchtypePubg,checkmatchtypeff,getchampions,checkReportClash,checkReportTdm,divideMoney,deductHonorScore};
