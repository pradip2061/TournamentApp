const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const PubgFull = require("../model/PubgFullMatchModel");
const {User} = require("../model/schema");
const tdm = require("../model/TdmModel");

const checkResult = async (req, res) => {
    const { matchId } = req.body;
    const userid = req.user;
console.log(matchId)
    // Check if match exists
    const match = await ClashSquad.findOne({ _id: matchId });
    if (!match) {
        return res.status(400).json({ message: "Invalid match data" });
    }

    // Get opponent and host details
    const result = await ClashSquad.findOne(
        { 'teamopponent.userid': userid },
        { 'teamopponent.$': 1 }
    );
    const resulthost = await ClashSquad.findOne(
        { 'teamHost.userid': userid },
        { 'teamHost.$': 1 }
    );

    // Determine result based on team2Status or teamHostStatus
    if (result?.teamopponent?.[0]?.team2Status) {
        return res.status(200).json({ message: "resultsubmit" });
    }

    if (resulthost?.teamHost?.[0]?.teamHostStatus) {
        return res.status(200).json({ message: "resultsubmit" });
    }

    // If both checks fail, return a single response
    return res.status(200).json({ message: "noresponse" });
};

const checkResulttdm = async (req, res) => {
    const { matchId } = req.body;
    const userid = req.user;
console.log(matchId)
    // Check if match exists
    const match = await tdm.findOne({ _id: matchId });
    if (!match) {
        return res.status(400).json({ message: "Invalid match data" });
    }

    // Get opponent and host details
    const result = await tdm.findOne(
        { 'teamopponent.userid': userid },
        { 'teamopponent.$': 1 }
    );
    const resulthost = await tdm.findOne(
        { 'teamHost.userid': userid },
        { 'teamHost.$': 1 }
    );

    // Determine result based on team2Status or teamHostStatus
    if (result?.teamopponent?.[0]?.team2Status) {
        return res.status(200).json({ message: "resultsubmit" });
    }

    if (resulthost?.teamHost?.[0]?.teamHostStatus) {
        return res.status(200).json({ message: "resultsubmit" });
    }

    // If both checks fail, return a single response
    return res.status(200).json({ message: "noresponse" });
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




module.exports = {checkResult,checkResulttdm,checkuserJoinFF,checkmatchtypeTdm,checkrole,checkmatchtypePubg,checkmatchtypeff,getchampions};
