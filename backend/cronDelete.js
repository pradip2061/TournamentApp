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
        if (!userinfo) {
          return res.status(404).json({message:'user not found'})
        }
        userinfo.matchId.FreefireClashId.splice(0, userinfo.matchId.FreefireClashId.length);
        // Removes 1 item at the found index
        userinfo.isplaying = false;
          userinfo.balance += Number(match?.matchDetails?.[0]?.betAmount || 0); // Convert betAmount to Number safely
        await userinfo.save();
      }
    }

    // Delete match cards after processing
    const deleted = await ClashSquad.deleteMany({
      _id: { $in: matchCards?.map(match => match._id) }
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
        if (!userinfo) {
        return res.status(404).json({
          message:'user not found'
        })
        }
        userinfo.matchId.pubgTdmId.splice(0,userinfo.matchId.pubgTdmId.length); // Removes 1 item at the found index
        userinfo.isplaying = false;
        userinfo.balance += Number(match?.entryFee || 0); // Convert betAmount to Number safely
        await userinfo.save();
      }
    }

    // Delete match cards after processing
    const deleted = await tdm.deleteMany({
      _id: { $in: matchCards?.map(match => match._id) }
    });

    console.log(`Deleted ${deleted.deletedCount} expired match cards.`);
  } catch (error) {
    console.error("Error deleting expired match cards:", error);
  }
};
 
const deleteifNoPasswordClashSquad = async () => {
  try {
    const now = new Date();
    
    // Find match cards older than now with only one player
    const matchCards = await ClashSquad.find({
      createdAt: { $lte: now }, // Assuming 'createdAt' is the correct field
      TotalPlayers: 2,
      $nor: [
        { customId: { $exists: true } }, 
        { customPassword: { $exists: true } }
      ]
    });
    

    if (matchCards.length === 0) {
      console.log("No idpass found clashsquad.");
      return;
    }

    // Delete the found match cards
    await ClashSquad.deleteMany({
      _id: { $in: matchCards.map(match => match._id) }
    });

    // Process each match card
    for (const match of matchCards) {
      // Handle teamHost
      if (match.teamHost?.length > 0) {
        const hostId = match.teamHost[0]?.userid;
        if (hostId) {
          const userinfo = await User.findById(hostId);
          if (userinfo) {
            userinfo.matchId.FreefireClashId = []; // Clear match ID
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.matchDetails[0].betAmount || 0); // Ensure entryFee is a number
            await userinfo.save();
          } else {
            console.log(`User with ID ${hostId} not found.`);
          }
        }
      }

      // Handle teamOpponent
      if (match.teamopponent?.length > 0) {
        const opponentId = match.teamopponent[0]?.userid;
        if (opponentId) {
          const userinfo = await User.findById(opponentId);
          if (userinfo) {
            userinfo.matchId.FreefireClashId = []; // Clear match ID
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.matchDetails[0].betAmount || 0);
            await userinfo.save();
          } else {
            console.log(`User with ID ${opponentId} not found.`);
          }
        }
      }
    }

    console.log("Deleted expired ClashSquad matches and refunded users.");
  } catch (error) {
    console.error("Error deleting ClashSquad matches:", error);
  }
};

const resultConfirmation=async()=>{
  const matchCards = await ClashSquad.find({
    resultAt: { $lte: now },
    TotalPlayers:2,
    $or: [
      { "teamHost.0.teamHostStatus": true }, 
      { "teamopponent.0.team2status": true }
    ]
  });  

  await ClashSquad.deleteMany({_id:{$in:matchCards.map(match=>match._id)}})
  for (const match of matchCards) {
    if (match.teamHost?.[0].teamHostStatus) {
      const hostId = match.teamHost[0]?.userid;
      if (hostId) {
        const userinfo = await User.findById(hostId);
        if (userinfo) {
          userinfo.matchId.FreefireClashId = []; // Clear match ID
          userinfo.isplaying = false;
          userinfo.balance += Number(match?.matchDetails[0].betAmount || 0); // Ensure entryFee is a number
          await userinfo.save();
        } else {
          console.log(`User with ID ${hostId} not found.`);
        }
      }
    }else{
    const opponentId = match.teamopponent[0]?.userid;
    if (opponentId) {
      const userinfo = await User.findById(opponentId);
      if (userinfo) {
        userinfo.matchId.FreefireClashId = []; // Clear match ID
        userinfo.isplaying = false;
        userinfo.balance += Number(match?.matchDetails[0].betAmount || 0);
        await userinfo.save();
      } else {
        console.log(`User with ID ${opponentId} not found.`);
      }
    }
  }
}}


// Schedule the cron job to run every minute
cron.schedule("* * * * *", () => {
  console.log("Running cron job: Deleting old match cards...");
  deleteOldMatchCards();
  deleteOldMatchCard();
  deleteifNoPasswordClashSquad()
  resultConfirmation()
});

module.exports = cron;
