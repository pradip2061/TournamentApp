const ClashSquad = require("../model/ClashSquadModel");
const signUp = require("../model/signUpModel");

const verifyDidYouWinMatch = async (req, res, next) => {
    try {
        const { matchId } = req.body;
        const match = await ClashSquad.findOne({ _id: matchId });

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        if (typeof match.teamHost[0].teamHostStatus === "boolean" &&
            typeof match.teamopponent[0].team2Status === "boolean" &&
            match.teamHost[0].teamHostStatus != match.teamopponent.team2Status) {
                const useridHost=match.teamHost[0].userid
                const userid=match.teamopponent[0].userid
                const host = await signUp.findOne({_id:useridHost})
                const user = await signUp.findOne({_id:userid})
                if(match.teamHost[0].teamHostStatus === true){
                    host.balance +=25
                    host.victory.Freefire.push(matchId)
                }else{
                    host.Loss.Freefire.push(matchId)
                }
                if(match.teamopponent[0].team2Status === true){
                    user.balance +=25
                    user.victory.Freefire.push(matchId)
                }else{
                    user.Loss.Freefire.push(matchId)
                }
               host.isplaying=false
               host.matchId=""
               user.isplaying=false
               user.matchId=""
               match.status ='completed'
               await host.save()
               await user.save()
               await match.save()
            return res.status(200).json({ message: " result validate" });
        }
        if (
            typeof match.teamHost[0].teamHostStatus === "boolean" &&
            typeof match.teamopponent[0].team2Status === "boolean" &&
            match.teamHost[0].teamHostStatus === match.teamopponent.team2Status
        ) {
            return res.status(400).json({ message: " result suspicious!" });
        }
        

        next(); // Only call next() if no response is sent

    } catch (error) {
        console.error("Error in verifyDidYouWinMatch:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = verifyDidYouWinMatch;
