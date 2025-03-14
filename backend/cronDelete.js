const cron = require("node-cron");
const ClashSquad = require("./model/ClashSquadModel");
const {User} = require("./model/schema");
const tdm = require("./model/TdmModel");

// Function to delete match cards older than 6 minutes
const deleteOldMatchCards = async () => {
  try {
    const now = new Date();
    // Find match cards that need to be deleted
    const matchCards = await ClashSquad.find({
      createdAt: { $lte: now }, // Match cards older than now
      TotalPlayers: 1
    });

    if (matchCards.length === 0) {
      console.log("No expired match cards found.");
      return;
    }

    // Process each match card
    for (const match of matchCards) {
      const userId = match.teamHost[0]?.userid; // Get user ID safely
      if (userId) {
        const userinfo = await User.findOne({ _id: userId });
        const findindex = userinfo.matchId.FreefireClashId.findIndex((item)=>item === matchCards._id)
        if (findindex !== -1) {
            userinfo.matchId.FreefireClashId.splice(findindex); // Removes 1 item at the found index
          }
        if (userinfo) {
          userinfo.isplaying = false;
          userinfo.balance += Number(match.matchDetails[0]?.betAmount || 0); // Convert betAmount to Number safely
          await userinfo.save();
        }
      }
    }

    // Delete match cards after processing
    const deleted = await ClashSquad.deleteMany({
      _id: { $in: matchCards.map(match => match._id) }
    });

    console.log(`Deleted ${deleted.deletedCount} expired match cards.`);
  } catch (error) {
    console.error("Error deleting expired match cards:", error);
  }
};

const deleteOldMatchCard = async () => {
  try {
    const now = new Date();

    // Find match cards that need to be deleted
    const matchCards = await tdm.find({
      createdAt: { $lte: now }, // Match cards older than now
      TotalPlayers: 1
    });

    if (matchCards.length === 0) {
      console.log("No expired match cards found tdm.");
      return;
    }
    // Process each match card
    for (const match of matchCards) {
      const userId = match.teamHost[0]?.userid; // Get user ID safely
      if (userId) {
        const userinfo = await User.findOne({ _id: userId });
        const findindex = userinfo.matchId.pubgTdmId.findIndex((item)=>item === matchCards._id)
        if (findindex !== -1) {
            userinfo.matchId.pubgTdmId.splice(findindex); // Removes 1 item at the found index
          }
        if (userinfo) {
          userinfo.isplaying = false;
          userinfo.balance += Number(match.matchDetails[0]?.betAmount || 0); // Convert betAmount to Number safely
          await userinfo.save();
        }
      }
    }

    // Delete match cards after processing
    const deleted = await ClashSquad.deleteMany({
      _id: { $in: matchCards.map(match => match._id) }
    });

    console.log(`Deleted ${deleted.deletedCount} expired match cards.`);
  } catch (error) {
    console.error("Error deleting expired match cards:", error);
  }
};

// Schedule the cron job to run every minute
cron.schedule("* * * * *", () => {
  console.log("Running cron job: Deleting old match cards...");
  deleteOldMatchCards();
  deleteOldMatchCard();
});

module.exports = cron;
