const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
const PubgFull = require("../model/PubgFullMatchModel");
const { User } = require("../model/schema");
const tdm = require("../model/TdmModel");
const namelimit = require("../model/updateNameLimit");
const createCs = async (req, res) => {
  const { matchDetails } = req.body;
  const userId = req.user;

  if (!userId || !matchDetails) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const userinfo = await User.findOne({ _id: userId });
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userinfo.balance < matchDetails.betAmount) { // Fixed logic
      return res.status(400).json({ message: "You don’t have enough balance" });
    }
    if(!userinfo.gameName[0].freefire){
      return res.status(400).json({
        message:'add pubgGameName in your profile'
      })
    }
    const newMatch = new ClashSquad({
      matchDetails: matchDetails,
      teamHost: [{ userid: userId,reportImage:"",reportMessage:"" }],
      teamopponent: [{ userid: "" ,reportImage:"",reportMessage:""}],
      status: "pending",
      customId: null,
      customPassword: null,
      TotalPlayers:1,
      userProof:"",
      hostProof:"",
      opponentName:"",
     
    });

    await newMatch.save();
    userinfo.isplaying = true;
    userinfo.balance -= matchDetails.betAmount; // Ensure matchDetails is an object
    await userinfo.save(); // Use await

    res.status(200).json({ message: "Match created successfully!", newMatch });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCsData = async (req, res) => {   
  try {     
    const userid = req.user;
    
    if (!userid) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const userinfo = await User.findOne({ _id: userid });

    if (!userinfo) {
      return res.status(404).json({ error: "User not found" });
    }

    const matchId = userinfo?.matchId?.FreefireClashId?.[0] || null;

    // Fetch the user's joined match
    const matchjoin = matchId ? await ClashSquad.find({ _id: matchId }) : [];

    // Fetch matches where the user is not in teamHost or teamopponent
    const card = await ClashSquad.find({
      $and: [
        { $nor: [{ teamHost: { $elemMatch: { userid } } }, { teamopponent: { $elemMatch: { userid } } }] },
        { status: { $in: ["pending", "running"] } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ card, matchjoin });

  } catch (error) {     
    console.error("Error:", error);     
    res.status(500).json({ error: "Internal Server Error", details: error.message });   
  } 
};

const playingmatch = async (req, res) => {
  const userId = req.user;
  const data = await User.findById(userId).populate("matchId");
  res.status(200).json({
    message: "data is sent ",
    data: data,
  });
};

const joinuser = async (req, res) => {
  const userid = req.user;
  const { matchId } = req.body;
  const userinfo = await User.findOne({ _id: userid });
  if (!userinfo) {
    res.status(404).json({
      message: "user not found",
    });
  }
  const match = await ClashSquad.findOne(
    { _id: matchId } // Find where userid is null
  );
  if (userinfo.balance < match.matchDetails[0].betAmount) {
    return res.status(200).json({
      message: "you haven`t enough balance",
    });
  }
  if (!userinfo.gameName[0].freefire) {
    return res.status(400).json({
      message: "add pubgGameName in your profile",
    });
  }
  userinfo.matchId.FreefireClashId.push(matchId);
  userinfo.isplaying = true;
  userinfo.balance -= match.matchDetails[0].betAmount;
  match.teamopponent[0].userid = userid;
  match.TotalPlayers += 1;
  match.opponentName = userinfo.gameName[0].freefire;
  await match.save();
  await userinfo.save();
  res.status(200).json({
    message: "join successfully",
  });
};

const trackusermodel = async (req, res) => {
  const { matchId } = req.body;
  const userid = req.user;
  if (!matchId) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }
  const match = await User.findOne({ _id: userid });
  match.matchId.FreefireClashId.push(matchId);
  await match.save();
  res.status(200).json({
    message: "matchid add successfully",
  });
};

const trackusermodeltdm = async (req, res) => {
  const { matchId } = req.body;
  const userid = req.user;
  if (!matchId) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }
  const match = await User.findOne({ _id: userid });

  match.matchId.pubgTdmId.push(matchId);
  await match.save();
  res.status(200).json({
    message: "matchid add successfully",
  });
};

const checkUserOrAdmin = async (req, res) => {
  const userId = req.user;
  const { matchId } = req.body;
  if (!matchId) {
    return res.status(400).json({
      message: "something error",
    });
  }
  const matchCard = await ClashSquad.findOne({
    _id: matchId,
    teamHost: { $elemMatch: { userid: userId } },
  });
  if (matchCard) {
    return res.status(200).json({
      message: "host",
    });
  } else if (!matchCard) {
    const userjoined = await ClashSquad.findOne({
      _id: matchId,
      teamopponent: { $elemMatch: { userid: userId } },
    });
    if (userjoined) {
      return res.status(200).json({
        message: "userjoined",
      });
    } else {
      return res.status(200).json({
        message: "user",
      });
    }
  }
};

const checkUserOrAdmintdm = async (req, res) => {
  const userId = req.user;
  const { matchId } = req.body;
  if (!matchId) {
    return res.status(400).json({
      message: "something error",
    });
  }
  const matchCard = await tdm.findOne({
    _id: matchId,
    teamHost: { $elemMatch: { userid: userId } },
  });
  if (matchCard) {
    return res.status(200).json({
      message: "host",
    });
  }
  if (!matchCard) {
    const userjoined = await tdm.findOne({
      _id: matchId,
      teamopponent: { $elemMatch: { userid: userId } },
    });
    if (userjoined) {
      return res.status(200).json({
        message: "userjoined",
      });
    } else {
      return res.status(200).json({
        message: "user",
      });
    }
  }
};

const checkisplaying = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isplaying === true) {
      return res
        .status(400)
        .json({ message: "previous is running you can't setup matches" });
    }
    return res.status(200).json({
      message: "You are validated",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const create_FM = async (req, res) => {
  console.log("Create Fm_  match ROute ---------.");
  try {
    const { time, entryFee, playermode, matchType } = req.body;
    if (!time || !entryFee || !playermode || !matchType) {
      console.log("missing Fields .........");
      return res.status(400).json({ message: "Please fill all fields" });
    }

    console.log(
      `time ${time} entryFee ${entryFee} playermode ${playermode} matchType ${matchType}`
    );
    let match_type;
    let match;
    if (matchType === "FreeFire") {
      match = await FFfreefire.create({
        playermode,
        gameName: [],
        entryFee,
        time,
        coustum: {
          id: "",
          password: "",
        },
        TotalPlayer: 0,
      });
    } else if (matchType == "PUBG") {
      match = await PubgFull.create({
        playermode,
        gameName: [],
        entryFee,
        time,
        coustum: {
          id: "",
          password: "",
        },
        TotalPlayer: 0,
      });
    } else {
      console.log("invalid Match Type .......");
      return res.status(400).json({
        message: "Invalid match type",
      });
    }
    console.log("Creating match with type..... ", match);

    console.log("match Created for ", matchType, "sucesfully .............");
    match.save();

    res.status(200).json({
      message: "Created successfully",
      match,
      totalPlayers: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFFmatch = async (req, res) => {
  try {
    const card = await FFfreefire.find({
      status: { $in: ["pending", "running"] },
    }).sort({ createdAt: -1 });
    res.status(200).json({
      card,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const joinuserff = async (req, res) => {
  try {
    const userid = req.user;
    const { matchId } = req.body;
    const userinfo = await User.findOne({ _id: userid });
    const match = await FFfreefire.findOne({ _id: matchId });
    if (userinfo.balance >= match.entryFee) {
      userinfo.balance -= match.entryFee;
      userinfo.matchId.FreefireFullId.push(matchId);
      match.userid.push(userid);
      if (!userinfo.gameName[0].freefire) {
        return res.status(400).json({
          message: "add freefireGameName in your profile",
        });
      }
      const objectcount = match.gameName.reduce(
        (count, obj) => count + Object.keys(obj),
        0
      );
      const slot = objectcount + 1;
      match.gameName.push({
        userid: userid,
        player1: userinfo.gameName[0].freefire,
        player2: "",
        player3: "",
        player4: "",
        slot: slot,
      });
      match.TotalPlayer = 1;
      await match.save();
      await userinfo.save();
      res.status(200).json({
        message: "user join successfully",
      });
    } else {
      res.status(400).json({
        message: "you don`t have enough balance",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const addName = async (req, res) => {
  try {
    const { player1, player2, player3, player4, matchId } = req.body;
    const userid = req.user;

    // Validate input
    if (!player2 || !player3 || !player4 || !player1) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Check if match exists
    const matchinfo = await FFfreefire.findOne({ _id: matchId });
    const userinfo = await User.findOne({ _id: userid });
    if (!userinfo || !userinfo.gameName || !userinfo.gameName[0]?.freefire) {
      return res
        .status(400)
        .json({ message: "Please set your gameName from your first" });
    }
    if (!matchinfo) {
      return res.status(400).json({ message: "No match found" });
    }

    // Check rate limit (2-hour restriction)
    const checklimit = await namelimit.findOne({ matchId, userid });
    if (checklimit) {
      return res
        .status(400)
        .json({ message: "You can try again after 2 hours." });
    }

    // Save the request timestamp with a TTL index (2 hours)
    await namelimit.create({
      userid,
      matchId,
      lastRequest: Date.now(),
    });

    // ✅ Choose one:
    // matchinfo.gameName.push(player1, player2, player3);  // Append names
    const teamIndex = matchinfo.gameName.findIndex(
      (team) => team.userid === userid
    );
    matchinfo.gameName[teamIndex].player1 = player1;
    matchinfo.gameName[teamIndex].player2 = player2;
    matchinfo.gameName[teamIndex].player3 = player3;
    matchinfo.gameName[teamIndex].player4 = player4;
    const totalStrings = matchinfo.gameName.reduce(
      (acc, obj) => acc + Object.keys(obj).length,
      0
    );
    matchinfo.TotalPlayer = totalStrings;
    matchinfo.save();

    res.status(200).json({ message: "Set successfully" });
  } catch (error) {
    console.log(error);
  }
};

const EnrollMatch = async (req, res) => {
  try {
    const userid = req.user;
    if (!userid) {
      return res.status(400).json({ message: "User not found!" });
    }

    const userinfo = await User.findOne({ _id: userid });
    if (!userinfo) {
      return res.status(400).json({ message: "User not found!" });
    }

    const matchIdsclash = userinfo.matchId.FreefireClashId;
    const matchesclash = await tdm.find({
      _id: { $in: matchIdsclash },
      status: { $in: ["pending", "running"] },
    });

    const matchIdff = userinfo.matchId.FreefireFullId;
    const matchesff = await FFfreefire.find({
      _id: { $in: matchIdff },
      status: { $in: ["pending", "running"] },
    });

    const matchIdspubg = userinfo.matchId.pubgFullId;
    const matchespubg = await PubgFull.find({
      _id: { $in: matchIdspubg },
      status: { $in: ["pending", "running"] },
    });

    const matchIdstdm = userinfo.matchId.pubgTdmId;
    const matchestdm = await tdm.find({
      _id: { $in: matchIdstdm },
      status: { $in: ["pending", "running"] },
    });

    res.status(200).json({
      matchesclash,
      matchesff,
      matchespubg,
      matchestdm,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || error });
  }
};

module.exports = {
  EnrollMatch,
  createCs,
  addName,
  trackusermodeltdm,
  getCsData,
  playingmatch,
  joinuser,
  trackusermodel,
  checkUserOrAdmin,
  checkUserOrAdmintdm,
  joinuserff,
  checkisplaying,
  getFFmatch,
  create_FM,
};
