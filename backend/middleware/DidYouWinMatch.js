const ClashSquad = require("../model/ClashSquadModel");
const { User } = require("../model/schema");

const verifyDidYouWinMatch = async (req, res, next) => {
    try {
        const { matchId,boolean} = req.body;
        console.log("Received matchId:", matchId);

        const match = await ClashSquad.findOne({ _id: matchId });
        console.log("Match found:", match);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        if(match.teamHost[0].teamHostStatus === true){
            if(boolean === true){
                return res.status(400).json({
                    message:"your opponent already declared as winner report the match!!"
                })
            }
        }

        if(match.teamopponent[0].team2Status === true){
            if(boolean === true){
                return res.status(400).json({
                    message:"your opponent already declared as winner report the match!!"
                })
            }
        }

        if (typeof match.teamHost[0].teamHostStatus === "boolean" &&
            typeof match.teamopponent[0].team2Status === null) {
                match.status = "completed";
            return res.status(400).json({ message: "match completed!!" });
        }
        if (typeof match.teamHost[0].teamHostStatus === null &&
            typeof match.teamopponent[0].team2Status === "boolean") {
                match.status = "completed";
            return res.status(400).json({ message: "match completed!!" });
        }
            await match.save();
        next();
    } catch (error) {
        console.error("Error in verifyDidYouWinMatch:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = verifyDidYouWinMatch;
