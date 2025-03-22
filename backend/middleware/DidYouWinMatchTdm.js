
const {User} = require("../model/schema");
const tdm = require("../model/TdmModel");

const verifyDidYouWinMatchTdm = async (req, res, next) => {
    try {
        const { matchId } = req.body;
        const match = await tdm.findOne({ _id: matchId });

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        if (
            typeof match.teamHost[0].teamHostStatus === "boolean" &&
            typeof match.teamopponent[0].team2Status === "boolean" &&
            match.teamHost[0].teamHostStatus === match.teamopponent[0].team2Status
        ) {
            return res.status(400).json({ message: " result suspicious!" });
        }

        if (typeof match.teamHost[0].teamHostStatus === "boolean" &&
            typeof match.teamopponent[0].team2Status === "boolean" &&
            match.teamHost[0].teamHostStatus != match.teamopponent[0].team2Status) {
                const useridHost=match.teamHost[0].userid
                const userid=match.teamopponent[0].userid
                const host = await User.findOne({_id:useridHost})
                const user = await User.findOne({_id:userid})
                if(match.teamHost[0].teamHostStatus === true){
                    host.balance +=25
                    host.victory.pubg.push(matchId)
                }else{
                    host.Loss.pubg.push(matchId)
                }
                if(match.teamopponent[0].team2Status === true){
                    user.balance +=25
                    user.victory.pubg.push(matchId)
                }else{
                    user.Loss.pubg.push(matchId)
                }
                    user.matchId.pubgTdmId.splice(0,user.matchId.pubgTdmId.length); // Removes 1 item at the found index
                    host.matchId.pubgTdmId.splice(0,host.matchId.pubgTdmId.length); // Removes 1 item at the found index
               host.isplaying=false
               user.isplaying=false
               match.status ='completed'
               await host.save()
               await user.save()
               await match.save()
            return res.status(200).json({ message: " result validate" });
        }

        next(); // Only call next() if no response is sent

    } catch (error) {
        console.error("Error in verifyDidYouWinMatch:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = verifyDidYouWinMatchTdm
