const cron = require('node-cron');
const ClashSquad = require('./model/ClashSquadModel');
const { User } = require('./model/schema');
const tdm = require('./model/TdmModel');

// Delete Clash Squad match cards older than 6 minutes
const deleteOldMatchCardsClash = async () => {
  try {
    const now = new Date();
    const sixMinutesAgo = new Date(now - 6 * 60 * 1000);
    const matchCards = await ClashSquad.find({
      createdAt: { $lte: sixMinutesAgo },
      TotalPlayers: 1,
    });

    if (matchCards.length === 0) {
      console.log('No expired Clash Squad match cards found.');
      return;
    }

    for (const match of matchCards) {
      const userId = match.teamHost[0]?.userid;
      if (userId) {
        const userinfo = await User.findOne({ _id: userId });
        if (!userinfo) {
          console.log(`User not found for ID: ${userId}`);
          continue;
        }
        userinfo.matchId.FreefireClashId = [];
        userinfo.isplaying = false;
        userinfo.balance += Number(match?.matchDetails?.[0]?.betAmount || 0);
        await userinfo.save();
        console.log('Processed refund for Clash Squad match');
      }
    }

    const deleted = await ClashSquad.deleteMany({
      _id: { $in: matchCards.map(match => match._id) },
    });
    console.log(`Deleted ${deleted.deletedCount} expired Clash Squad match cards.`);
  } catch (error) {
    console.error('Error deleting expired Clash Squad match cards:', error);
  }
};

// Delete PUBG TDM match cards older than 6 minutes
const deleteOldMatchCardtdm = async () => {
  try {
    const now = new Date();
    const sixMinutesAgo = new Date(now - 6 * 60 * 1000);
    const matchCards = await tdm.find({
      createdAt: { $lte: sixMinutesAgo },
      TotalPlayers: 1,
    });

    if (matchCards.length === 0) {
      console.log('No expired TDM match cards found.');
      return;
    }

    for (const match of matchCards) {
      const userId = match.teamHost[0]?.userid;
      if (userId) {
        const userinfo = await User.findOne({ _id: userId });
        if (!userinfo) {
          console.log(`User not found for ID: ${userId}`);
          continue;
        }
        userinfo.matchId.pubgTdmId = [];
        userinfo.isplaying = false;
        userinfo.balance += Number(match?.entryFee || 0);
        await userinfo.save();
        console.log('Processed refund for TDM match');
      }
    }

    const deleted = await tdm.deleteMany({
      _id: { $in: matchCards.map(match => match._id) },
    });
    console.log(`Deleted ${deleted.deletedCount} expired TDM match cards.`);
  } catch (error) {
    console.error('Error deleting expired TDM match cards:', error);
  }
};

// Delete Clash Squad matches with no customId/customPassword
const deleteifNoPasswordClashSquad = async () => {
  try {
    const now = new Date();
    const matchCards = await ClashSquad.find({
      createdAt: { $lte: now },
      TotalPlayers: 2,
      customId: null,
    });

    if (matchCards.length === 0) {
      console.log('No Clash Squad matches with missing ID/password found.');
      return;
    }

    await ClashSquad.deleteMany({
      _id: { $in: matchCards.map(match => match._id) },
    });

    for (const match of matchCards) {
      if (match.teamHost?.length > 0) {
        const hostId = match.teamHost[0]?.userid;
        if (hostId) {
          const userinfo = await User.findById(hostId);
          if (userinfo) {
            userinfo.matchId.FreefireClashId = [];
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.matchDetails[0]?.betAmount || 0);
            await userinfo.save();
          }
        }
      }
      if (match.teamopponent?.length > 0) {
        const opponentId = match.teamopponent[0]?.userid;
        if (opponentId) {
          const userinfo = await User.findById(opponentId);
          if (userinfo) {
            userinfo.matchId.FreefireClashId = [];
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.matchDetails[0]?.betAmount || 0);
            await userinfo.save();
          }
        }
      }
    }

    console.log('Deleted Clash Squad matches with no ID/password and refunded users.');
  } catch (error) {
    console.error('Error deleting Clash Squad matches:', error);
  }
};

// Delete TDM matches with no customId/customPassword
const deleteifNoPasswordTdm = async () => {
  try {
    const now = new Date();
    const matchCards = await tdm.find({
      createdAt: { $lte: now },
      TotalPlayers: 2,
      customId: null,
    });

    if (matchCards.length === 0) {
      console.log('No TDM matches with missing ID/password found.');
      return;
    }

    await tdm.deleteMany({
      _id: { $in: matchCards.map(match => match._id) },
    });

    for (const match of matchCards) {
      if (match.teamHost?.length > 0) {
        const hostId = match.teamHost[0]?.userid;
        if (hostId) {
          const userinfo = await User.findById(hostId);
          if (userinfo) {
            userinfo.matchId.pubgTdmId = [];
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.entryFee || 0);
            await userinfo.save();
          }
        }
      }
      if (match.teamopponent?.length > 0) {
        const opponentId = match.teamopponent[0]?.userid;
        if (opponentId) {
          const userinfo = await User.findById(opponentId);
          if (userinfo) {
            userinfo.matchId.pubgTdmId = [];
            userinfo.isplaying = false;
            userinfo.balance += Number(match?.entryFee || 0);
            await userinfo.save();
          }
        }
      }
    }

    console.log('Deleted TDM matches with no ID/password and refunded users.');
  } catch (error) {
    console.error('Error deleting TDM matches:', error);
  }
};

// Confirm Clash Squad results
const resultConfirmationClash = async () => {
  try {
    const now = new Date();
    const matchCards = await ClashSquad.find({
      createdAt: { $lte: new Date(now - 6 * 60 * 1000) }, // Assuming 6-minute threshold
      TotalPlayers: 2,
      $or: [
        { 'teamHost.0.teamHostStatus': { $type: 'bool' }, 'teamopponent.0.team2Status': null },
        { 'teamHost.0.teamHostStatus': null, 'teamopponent.0.team2Status': { $type: 'bool' } },
      ],
    });

    if (matchCards.length === 0) {
      console.log('No Clash Squad matches for result confirmation found.');
      return;
    }

    for (const match of matchCards) {
      if (match.teamHost[0]?.reportMessage || match.teamopponent[0]?.reportMessage) {
        continue;
      }
      const betAmount = Number(match?.matchDetails?.[0]?.betAmount || 0);
      let userinfo = null;

      if (match.teamHost?.[0]?.teamHostStatus === true) {
        const hostId = match.teamHost[0]?.userid;
        if (hostId) userinfo = await User.findById(hostId);
      } else if (match.teamopponent?.[0]?.team2Status === true) {
        const opponentId = match.teamopponent[0]?.userid;
        if (opponentId) userinfo = await User.findById(opponentId);
      }

      if (userinfo) {
        userinfo.matchId.FreefireClashId = [];
        userinfo.isplaying = false;
        userinfo.balance += betAmount;
        await userinfo.save();

        match.status = 'completed';
        await match.save();
      }
    }
  } catch (err) {
    console.error('Error in Clash Squad result confirmation:', err);
  }
};

// Confirm TDM results
const resultConfirmationTdm = async () => {
  try {
    const now = new Date();
    const matchCards = await tdm.find({
      createdAt: { $lte: new Date(now - 6 * 60 * 1000) }, // Assuming 6-minute threshold
      TotalPlayers: 2,
      $or: [
        { 'teamHost.0.teamHostStatus': { $type: 'bool' }, 'teamopponent.0.team2Status': null },
        { 'teamHost.0.teamHostStatus': null, 'teamopponent.0.team2Status': { $type: 'bool' } },
      ],
    });

    if (matchCards.length === 0) {
      console.log('No TDM matches for result confirmation found.');
      return;
    }

    for (const match of matchCards) {
      if (match.teamHost[0]?.reportMessage || match.teamopponent[0]?.reportMessage) {
        continue;
      }
      const betAmount = Number(match?.entryFee || 0);
      let userinfo = null;

      if (match.teamHost?.[0]?.teamHostStatus === true) {
        const hostId = match.teamHost[0]?.userid;
        if (hostId) userinfo = await User.findById(hostId);
      } else if (match.teamopponent?.[0]?.team2Status === true) {
        const opponentId = match.teamopponent[0]?.userid;
        if (opponentId) userinfo = await User.findById(opponentId);
      }

      if (userinfo) {
        userinfo.matchId.pubgTdmId = [];
        userinfo.isplaying = false;
        userinfo.balance += betAmount;
        await userinfo.save();

        match.status = 'completed';
        await match.save();
      }
    }
  } catch (err) {
    console.error('Error in TDM result confirmation:', err);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running cron job: Processing match cards...');
  deleteOldMatchCardsClash();
  deleteOldMatchCardtdm();
  deleteifNoPasswordClashSquad();
  deleteifNoPasswordTdm();
  resultConfirmationClash();
  resultConfirmationTdm();
});

module.exports = cron;