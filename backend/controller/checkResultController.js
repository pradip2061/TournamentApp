const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const signUp = require("../model/signUpModel");

const checkResult = async (req, res) => {
    const { matchId } = req.body;

    const match = await ClashSquad.findOne({ _id: matchId });

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
    const{matchId}=req.body
    const userid =req.user
 const userinfo =await signUp.findOne({_id:userid})
      if(userinfo.matchId === matchId){
        res.status(200).json({
            message:'joined'
        })
      }else {
        res.status(200).json({
            message:'notjoined'
        })
      }
}

module.exports = {checkResult,checkuserJoinFF};
