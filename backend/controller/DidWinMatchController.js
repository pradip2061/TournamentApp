const ClashSquad = require("../model/ClashSquadModel");
const { User } = require("../model/schema");
const tdm = require("../model/TdmModel");

const DidYouWinMatch = async (req, res) => {
    try {
        const { boolean, matchId,proof} = req.body;
        const userid = req.user;
        console.log(userid)
        const match = await ClashSquad.findOne({ _id: matchId });
        const user = await User.findOne({_id:userid})
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        if (match.teamHost[0].userid === userid) {
            match.teamHost[0].teamHostStatus = boolean;
            if(boolean === true){
                match.hostProof = proofuser
                user.balance += 25;
                user.victory.FreefireClash.push(matchId);
                user.isplaying =false
                user.matchId.FreefireClashId=[]
            }else{
                user.loss.FreefireClash.push(matchId);
                user.isplaying =false
                user.matchId.FreefireClashId=[]
            }
        } else if (match.teamopponent[0].userid === userid) {
            match.teamopponent[0].team2Status = boolean;
            if(boolean === true){
                match.userProof= proof
                user.balance += 25;
                user.victory.FreefireClash.push(matchId);
                user.isplaying =false
                user.matchId.FreefireClashId=[]
            }else{
                user.loss.FreefireClash.push(matchId);
                user.isplaying =false
                user.matchId.FreefireClashId=[]
            }
        } else {
            return res.status(403).json({ message: "You are not part of this match" });
        }

        await match.save();
        await user.save()
        return res.status(200).json({ message: "Added successfully!",match });
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
            if(boolean === true){
                match.hostProof = proof
            }else{
                console.log('might be no')
            }
        } else if (match.teamopponent[0].userid === userid) {
            match.teamopponent[0].team2Status = boolean;
            if(boolean === true){
                match.userProof= proof
            }else{
                console.log('might be no')
            }
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
