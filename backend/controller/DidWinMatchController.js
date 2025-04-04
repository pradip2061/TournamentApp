const ClashSquad = require("../model/ClashSquadModel");
const { User } = require("../model/schema");
const tdm = require("../model/TdmModel");

const DidYouWinMatch = async (req, res) => {
    try {
        const { boolean, matchId,proof} = req.body;
        const userid = req.user;
        console.log(userid)
        console.log(boolean)
        
        if(boolean === null || undefined){
            return res.status(400).json({ message: "no result submit" });
        }
        const match = await ClashSquad.findOne({ _id: matchId });
        const userinfo = await User.findOne({_id:userid});

        if(!userinfo){
            return res.status(404).json({ message: "user not found" });
        }
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
   
        if (match.teamHost[0].userid === userid) {
            match.teamHost[0].teamHostStatus = boolean;
            if(!match.resultAt){
                match.resultAt= new Date(Date.now() + 30 * 60 * 1000);
            }
            userinfo.isplaying=false
            userinfo.matchId.FreefireClashId=[]
            if(boolean === true){
                match.hostProof=proof
                userinfo?.victory?.FreefireClash.push(matchId);
            }else{
                userinfo?.Loss?.FreefireClash.push(matchId);
            }
        } else if (match.teamopponent[0].userid === userid) {
            match.teamopponent[0].team2Status = boolean;
            if(!match.resultAt){
                match.resultAt= new Date(Date.now() + 30 * 60 * 1000);
            }
            userinfo.isplaying=false
            userinfo.matchId.FreefireClashId=[]
            if(boolean === true){
                match.userProof=proof
                userinfo?.victory?.FreefireClash.push(matchId);
            }else{
                userinfo?.Loss?.FreefireClash.push(matchId);
            }
        } else {
            return res.status(403).json({ message: "You are not part of this match" });
        }
        await match.save();
        await userinfo.save()
        return res.status(200).json({ message: "result has been submitted wait 5-20min",match:match._id });
    } catch (error) {
        console.error("Error in DidYouWinMatch:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const DidYouWinMatchtdm = async (req, res) => {
    try {
        const { boolean, matchId } = req.body;
        const userid = req.user;
        console.log(userid)
        const match = await tdm.findOne({ _id: matchId });

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        if (match.teamHost[0].userid === userid) {
            match.teamHost[0].teamHostStatus = boolean;
        } else if (match.teamopponent[0].userid === userid) {
            match.teamopponent[0].team2Status = boolean;
        } else {
            return res.status(403).json({ message: "You are not part of this match" });
        }

        await match.save();

        return res.status(200).json({ message: "Added successfully!",match });
    } catch (error) {
        console.error("Error in DidYouWinMatch:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {DidYouWinMatch,DidYouWinMatchtdm};
